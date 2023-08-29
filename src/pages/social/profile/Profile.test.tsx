import Profile from "./Profile";
import { createBrowserHistory } from "history";
import { act } from "react-dom/test-utils";
import { createSearchParams } from "react-router-dom";
import { existingUser } from "../../../mocks/data/user.mock";
import { render, screen } from "../../../test.utils";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useParams: () => ({
    username: "Manny",
  }),
}));

describe("Profile", () => {
  beforeEach(() => {
    const url = `/app/social/profile/${
      existingUser?.username
    }?${createSearchParams({
      id: existingUser._id,
      uId: existingUser.uId,
    })}`;
    const history = createBrowserHistory();
    history.push(url);
  });

  beforeAll(() => {
    window.localStorage.setItem("username", JSON.stringify("Danny"));
  });

  afterAll(() => {
    window.localStorage.removeItem("username");
  });

  it("should have background header component", async () => {
    const { baseElement } = render(<Profile />);
    await act(() => {
      const backgroundElement = baseElement.querySelector(".profile-banner");
      expect(backgroundElement).toBeInTheDocument();
    });
  });

  it("should have timeline component", async () => {
    render(<Profile />);
    let timelineComponent;
    await act(() => {
      timelineComponent = screen.queryByTestId("timeline");
    });
    expect(timelineComponent).toBeInTheDocument();
  });
});
