import { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import "./Streams.scss";
import { Suggestions } from "../../../components/suggestions/Suggestions";
import { getUserSuggestions } from "../../../redux-toolkit/api/suggestion";
import useEffectOnce from "../../../hooks/useEffectOnce";
import PostForm from "../../../components/posts/post-form/PostForm";
import Posts from "../../../components/posts/Posts";
import { postService } from "../../../services/api/post/post.service";
import useLocalStorage from "../../../hooks/useLocalStorage";
import useInfiniteScroll from "../../../hooks/useInfiniteScroll";
import { orderBy, uniqBy } from "lodash";
import { Utils } from "../../../services/utils/utils.service";
import { addReactions } from "../../../redux-toolkit/reducers/post/user-post-reaction.reducer";
import { getPosts } from "../../../redux-toolkit/api/posts";
import { PostUtils } from "../../../services/utils/post-utils.service";
import { RootState } from "../../../redux-toolkit/store";
import { IPost } from "../../../components/posts/post/Post";
import axios from "axios";
import { useAppDispatch } from "../../../hooks/useAppDispatch";
import { followerService } from "../../../services/api/followers/follower.service";
import { IUserDocument } from "../../../redux-toolkit/reducers/user/user.reducer";

export interface IFollowerData {
  avatarColor: string;
  followersCount: number;
  followingCount: number;
  profilePicture: string;
  postCount: number;
  username: string;
  uId: string;
  _id?: string;
  userProfile?: IUserDocument;
}

const Streams = () => {
  const allPosts = useSelector((state: RootState) => state.allPosts);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState<IFollowerData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPostsCount, setTotalPostsCount] = useState(0);
  const bodyRef = useRef(null);
  const bottomLineRef = useRef<HTMLDivElement>(null);
  const appPosts = useRef<IPost[]>([]);
  const dispatch = useAppDispatch();
  const storedUsername = useLocalStorage("username", "get");
  const deleteSelectedPostId = useLocalStorage(
    "selectedPostId",
    "delete"
  ) as () => void;
  useInfiniteScroll(bodyRef, bottomLineRef, fetchPostData);
  const PAGE_SIZE = 8;

  function fetchPostData() {
    let pageNum = currentPage;
    if (currentPage <= Math.round(totalPostsCount / PAGE_SIZE)) {
      pageNum += 1;
      setCurrentPage(pageNum);
      getAllPosts();
    }
  }

  const getAllPosts = async () => {
    try {
      const response = await postService.getAllPosts(currentPage);
      if (response.data.posts.length > 0) {
        appPosts.current = [...posts, ...response.data.posts];
        const allPosts = uniqBy(appPosts.current, "_id");
        const orderedPosts = orderBy(allPosts, ["createdAt"], ["desc"]);
        setPosts(orderedPosts);
      }
      setLoading(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    }
  };

  const getUserFollowing = async () => {
    try {
      const response = await followerService.getUserFollowing();
      setFollowing(response.data.following);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    }
  };

  const getReactionsByUsername = async () => {
    try {
      const response = await postService.getReactionsByUsername(storedUsername);
      dispatch(addReactions(response.data.reactions));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        Utils.dispatchNotification(
          error.response.data.message,
          "error",
          dispatch
        );
      }
    }
  };

  useEffectOnce(() => {
    getUserFollowing();
    getReactionsByUsername();
    if (typeof deleteSelectedPostId === "function") {
      deleteSelectedPostId();
      dispatch(getPosts());
      dispatch(getUserSuggestions());
    }
  });

  useEffect(() => {
    setLoading(allPosts?.isLoading);
    const orderedPosts = orderBy(allPosts?.posts, ["createdAt"], ["desc"]);
    setPosts(orderedPosts);
    setTotalPostsCount(allPosts?.totalPostsCount);
  }, [allPosts]);

  useEffect(() => {
    PostUtils.socketIOPost(posts, setPosts);
  }, [posts]);

  return (
    <div className="streams" data-testid="streams">
      <div className="streams-content">
        <div className="streams-post" ref={bodyRef}>
          <PostForm />
          <Posts
            allPosts={posts}
            postsLoading={loading}
            userFollowing={following}
          />
          <div
            ref={bottomLineRef}
            style={{ marginBottom: "50px", height: "50px" }}
          ></div>
        </div>
        <div className="streams-suggestions">
          <Suggestions />
        </div>
      </div>
    </div>
  );
};

export default Streams;
