import { Suggestions } from "./Suggestions";
import userEvent from "@testing-library/user-event";
import { addToSuggestions } from "../../redux-toolkit/reducers/suggestions/suggestions.reducer";
import { store } from "../../redux-toolkit/store";
import { Utils } from "../../services/utils/utils.service";
import { render, waitFor, screen } from "../../test.utils";

const user = {
  _id: "12345",
  uId: 23456,
  username: "Sunny",
  email: "sunny@test.com",
  avatarColor: "red",
  postsCount: 2,
  work: "",
  school: "",
  quote: "",
  location: "",
  blocked: [],
  blockedBy: [],
  followersCount: 1,
  followingCount: 1,
  notifications: null,
  social: null,
  createdAt: "2022-06-15",
  bgImageVersion: "",
  bgImageId: "",
  profilePicture: "",
};

describe("Suggestions", () => {
  it("should have items in list", () => {
    const userOne = { ...user };
    user._id = Utils.generateString(8);
    const userTwo = { ...user };
    user._id = Utils.generateString(6);
    const userThree = { ...user };
    store.dispatch(
      addToSuggestions({
        users: [userOne, userTwo, userThree],
        isLoading: false,
      })
    );
    render(<Suggestions />);
    const items = screen.queryAllByTestId("suggestions-item");
    expect(items.length).toEqual(3);
  });

  it("should display view more", () => {
    const users = [];
    for (const item of [
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
    ]) {
      const userItem = { ...item };
      userItem._id = Utils.generateString(10);
      users.push(userItem);
    }
    store.dispatch(addToSuggestions({ users, isLoading: false }));
    const { baseElement } = render(<Suggestions />);
    const items = screen.queryAllByTestId("suggestions-item");
    const viewMore = baseElement.querySelector(".view-more");
    expect(items.length).toEqual(10);
    expect(viewMore).toBeInTheDocument();
  });

  it("should change url when view more is clicked", async () => {
    const users = [];
    for (const item of [
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
      user,
    ]) {
      const userItem = { ...item };
      userItem._id = Utils.generateString(10);
      users.push(userItem);
    }
    store.dispatch(addToSuggestions({ users, isLoading: false }));
    const { baseElement } = render(<Suggestions />);
    const viewMore = baseElement.querySelector(".view-more");
    if (viewMore) {
      userEvent.click(viewMore);
    }
    expect(viewMore).toBeInTheDocument();
    await waitFor(() =>
      expect(window.location.pathname).toEqual("/app/social/people")
    );
  });
});
