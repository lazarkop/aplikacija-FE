/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { postMockData, postReactionOne } from "@mocks/data/post.mock";
import { addUser } from "../../../redux-toolkit/reducers/user/user.reducer";
import { render, screen } from "../../..//test.utils";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import CommentArea from "./CommentArea";
import { existingUser } from "../../../mocks/data/user.mock";
import { addReactions } from "../../../redux-toolkit/reducers/post/user-post-reaction.reducer";
import { store } from "../../../redux-toolkit/store";

describe("CommentArea", () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(addReactions([]));
      store.dispatch(addUser({ token: "123456", profile: existingUser }));
    });
  });

  it("should display default reaction icon and name", () => {
    render(<CommentArea post={postMockData} />);
    const defaultReaction = screen.queryByTestId("selected-reaction");
    expect(defaultReaction).toBeInTheDocument();
    expect(defaultReaction.childNodes.item(0)).toHaveAttribute(
      "src",
      "like.png"
    );
    expect(defaultReaction.childNodes.item(1).textContent).toEqual("Like");
  });

  it("should display selected reaction icon and name", async () => {
    act(() => {
      store.dispatch(addReactions([postReactionOne]));
    });
    render(<CommentArea post={postMockData} />);
    const reactionItem = screen.queryAllByTestId("reaction");
    await act(() => {
      userEvent.click(reactionItem[1]);
    });
    const selectedReaction = await screen.findByTestId("selected-reaction");
    expect(selectedReaction).toBeInTheDocument();
    expect(selectedReaction.childNodes.item(0)).toHaveAttribute(
      "src",
      "love.png"
    );
    expect(selectedReaction.childNodes.item(1).textContent).toEqual("Love");
  });
});
