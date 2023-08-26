import {
  chatListMock,
  chatMessagesMock,
  emptyChatListMock,
} from "../../../mocks/handlers/chat";
import Chat from "./Chat";
import { createBrowserHistory } from "history";
import { act } from "react-dom/test-utils";
import { createSearchParams } from "react-router-dom";
import { messageData } from "../../../mocks/data/chat.mock";
import { existingUser } from "../../../mocks/data/user.mock";
import { server } from "../../../mocks/server";
import { store } from "../../../redux-toolkit/store";
import { render, screen, waitFor } from "../../../test.utils";
import {
  addToChatList,
  setSelectedChatUser,
} from "../../../redux-toolkit/reducers/chat/chat.reducer";

describe("Chat", () => {
  it("should have chat list component", async () => {
    render(<Chat />);
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    await act(() => {});
    const chatListElement = await screen.findByTestId("chatList");
    expect(chatListElement).toBeInTheDocument();
  });

  it("should not display chat window component with empty chat list", () => {
    server.use(emptyChatListMock);
    render(<Chat />);
    const chatWindowElement = screen.queryByTestId("chatWindowContainer");
    expect(chatWindowElement).not.toBeInTheDocument();
  });

  it("should display no chat text", () => {
    server.use(emptyChatListMock);
    render(<Chat />);
    const noChatElement = screen.getByTestId("no-chat");
    expect(noChatElement).toBeInTheDocument();
    expect(noChatElement.textContent).toEqual(
      "Select or Search for users to chat with"
    );
  });

  it("should display chat window component", async () => {
    server.use(chatListMock);
    server.use(chatMessagesMock);
    const url = `/app/social/chat/messages?${createSearchParams({
      username: "danny",
      id: "123456",
    })}`;
    const history = createBrowserHistory();
    history.push(url);
    render(<Chat />);
    await act(() => {
      store.dispatch(
        addToChatList({ isLoading: false, chatList: [messageData] })
      );
      store.dispatch(
        setSelectedChatUser({ isLoading: false, user: existingUser })
      );
    });
    await waitFor(() => {
      const chatWindowElement = screen.getByTestId("chatWindow");
      expect(chatWindowElement).toBeInTheDocument();
    });
  });
});
