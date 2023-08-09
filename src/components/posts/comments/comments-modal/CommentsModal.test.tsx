/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import CommentsModal from "./CommentsModal";
import { render, screen, waitFor } from "../../../../test.utils";
import { act } from "react-dom/test-utils";
import { postComment, postMockData } from "../../../../mocks/data/post.mock";
import { updatePostItem } from "../../../../redux-toolkit/reducers/post/post.reducer";
import { store } from "../../../../redux-toolkit/store";

describe("CommentsModal", () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(updatePostItem(postMockData));
    });
  });

  it("should have modal wrapper", async () => {
    render(<CommentsModal />);
    let wrapper;
    let modalBg;
    let modalBody;
    await act(() => {
      wrapper = screen.queryByTestId("modal-wrapper");
      modalBg = screen.queryByTestId("modal-bg");
      modalBody = screen.queryByTestId("modal-body");
    });
    await waitFor(() => {
      expect(wrapper).toBeInTheDocument();
      expect(modalBg).toBeInTheDocument();
      expect(modalBody).toBeInTheDocument();
    });
  });

  it("should title comments", async () => {
    render(<CommentsModal />);
    let title;
    await act(() => {
      title = screen.queryByText(/comments/i);
    });
    await waitFor(() => {
      expect(title).toBeInTheDocument();
      expect(title.textContent).toEqual("Comments");
    });
  });

  it("should have comments", async () => {
    const { baseElement } = render(<CommentsModal />);
    const listItems = await screen.findAllByTestId("modal-list-item");
    const h1 = baseElement.querySelector("h1");
    const comment = baseElement.querySelector("p");
    expect(listItems.length).toEqual(1);
    expect(listItems[0]).toBeInTheDocument();
    expect(h1.textContent).toEqual(postMockData.username);
    expect(comment.textContent).toEqual(postComment.comment);
  });
});
