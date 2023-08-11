import "./Posts.scss";
import { useSelector } from "react-redux";
import { useState, useEffect, FC } from "react";
import { Utils } from "../../services/utils/utils.service";
import Post, { IPost } from "./post/Post";
import { PostUtils } from "../../services/utils/post-utils.service";
import PostSkeleton from "./post/PostSkeleton";
import { RootState } from "../../redux-toolkit/store";
import { IFollowerData } from "../../pages/social/streams/Streams";

interface IPostsProps {
  postsLoading?: boolean;
  allPosts: IPost[];
  userFollowing: IFollowerData[];
}

const Posts: FC<IPostsProps> = ({ allPosts, userFollowing, postsLoading }) => {
  const { profile } = useSelector((state: RootState) => state.user);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [following, setFollowing] = useState<IFollowerData[]>([]);
  const [loading, setLoading] = useState<boolean | undefined>(true);

  useEffect(() => {
    setPosts(allPosts);
    setFollowing(userFollowing);
    setLoading(postsLoading);
  }, [allPosts, userFollowing, postsLoading]);

  return (
    <div className="posts-container" data-testid="posts">
      {!loading &&
        posts.length > 0 &&
        posts.map((post) => (
          <div key={post?._id} data-testid="posts-item">
            {(!Utils.checkIfUserIsBlocked(profile?.blockedBy, post?.userId) ||
              post?.userId === profile?._id) && (
              <>
                {PostUtils.checkPrivacy(post, profile, following) && (
                  <>
                    <Post post={post} showIcons={false} />
                  </>
                )}
              </>
            )}
          </div>
        ))}

      {loading &&
        !posts.length &&
        [1, 2, 3, 4, 5, 6].map((index) => (
          <div key={index}>
            <PostSkeleton />
          </div>
        ))}
    </div>
  );
};

export default Posts;
