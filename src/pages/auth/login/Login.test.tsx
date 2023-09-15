import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";
import { signInMockError } from "../../../mocks/handlers/auth";
import { fireEvent, waitFor, render, screen } from "../../../test.utils";
import { server } from "../../../mocks/server";
import Login from "./Login";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("SignIn", () => {
  it("signin form should have its inputs", () => {
    render(<Login />);
    const usernameElement = screen.getByLabelText("Username");
    const passwordElement = screen.getByLabelText("Password");
    const checkBoxLabel = screen.getByLabelText("Keep me signed in");
    expect(usernameElement).toBeInTheDocument();
    expect(passwordElement).toBeInTheDocument();
    expect(checkBoxLabel).toBeInTheDocument();
  });

  it("checkbox should be unchecked", () => {
    render(<Login />);
    const checkBoxElement = screen.getByLabelText(/Keep me signed in/i);
    expect(checkBoxElement).not.toBeChecked();
  });

  it("checkbox should be checked when clicked", () => {
    render(<Login />);
    const checkBoxElement = screen.getByLabelText("Keep me signed in");
    expect(checkBoxElement).not.toBeChecked();

    fireEvent.click(checkBoxElement);
    expect(checkBoxElement).toBeChecked();
  });

  describe("Button", () => {
    it("should be disabled", () => {
      render(<Login />);
      const buttonElement = screen.getByRole("button");
      expect(buttonElement).toBeDisabled();
    });

    it("should be enabled with inputs", () => {
      render(<Login />);
      const buttonElement = screen.getByRole("button");
      expect(buttonElement).toBeDisabled();

      const usernameElement = screen.getByLabelText("Username");
      const passwordElement = screen.getByLabelText("Password");

      fireEvent.change(usernameElement, { target: { value: "manny" } });
      fireEvent.change(passwordElement, { target: { value: "qwerty" } });

      expect(buttonElement).toBeEnabled();
    });

    it("should change label when clicked", async () => {
      render(<Login />);
      const buttonElement = screen.getByRole("button");
      const usernameElement = screen.getByLabelText("Username");
      const passwordElement = screen.getByLabelText("Password");

      userEvent.type(usernameElement, "manny");
      userEvent.type(passwordElement, "qwerty");

      act(() => {
        userEvent.click(buttonElement);
      });

      await waitFor(() => {
        const newButtonElement = screen.getByRole("button");
        expect(newButtonElement.textContent).toEqual("SIGNIN IN PROGRESS...");
      });
    });
  });

  describe("Success", () => {
    it("should navigate to streams page", async () => {
      render(<Login />);
      const buttonElement = screen.getByRole("button");
      const usernameElement = screen.getByLabelText("Username");
      const passwordElement = screen.getByLabelText("Password");
      userEvent.type(usernameElement, "manny");
      userEvent.type(passwordElement, "qwerty");
      userEvent.click(buttonElement);

      await waitFor(() =>
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/app/social/streams")
      );
    });
  });

  describe("Error", () => {
    it("should display error alert and border", async () => {
      server.use(signInMockError);
      render(<Login />);
      const buttonElement = screen.getByRole("button");
      const usernameElement = screen.getByLabelText("Username");
      const passwordElement = screen.getByLabelText("Password");
      userEvent.type(usernameElement, "ma");
      userEvent.type(passwordElement, "qwerty");
      userEvent.click(buttonElement);

      const alert = await screen.findByRole("alert");
      expect(alert).toBeInTheDocument();
      expect(alert.textContent).toEqual("Invalid credentials");

      await waitFor(() =>
        expect(usernameElement).toHaveStyle({ border: "1px solid #fa9b8a" })
      );
      await waitFor(() =>
        expect(passwordElement).toHaveStyle({ border: "1px solid #fa9b8a" })
      );
    });
  });
});

/* import userEvent from "@testing-library/user-event";
// import { act } from "@testing-library/react";
import { signInMockError } from "../../../mocks/handlers/auth";
import { fireEvent, waitFor, render, screen } from "../../../test.utils";
import { server } from "../../../mocks/server";
import Login from "./Login";

const mockedUsedNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockedUsedNavigate,
}));

describe("SignIn123", () => {
  it("signin form should have its labels", async () => {
    await waitFor(() => {
      render(<Login />);
    });
    const usernameElement = await screen.findByLabelText("Username");
    const passwordElement = await screen.findByLabelText("Password");
    const checkBoxLabel = await screen.findByLabelText("Keep me signed in");
    await waitFor(() => {
      expect(usernameElement).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(passwordElement).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(checkBoxLabel).toBeInTheDocument();
    });
  });

  it("checkbox should be unchecked", async () => {
    await waitFor(() => {
      render(<Login />);
    });
    const checkBoxElement = await screen.findByLabelText(/Keep me signed in/i);
    await waitFor(() => {
      expect(checkBoxElement).not.toBeChecked();
    });
  });

  it("checkbox should be checked when clicked", async () => {
    await waitFor(() => {
      render(<Login />);
    });
    const checkBoxElement = await screen.findByLabelText("Keep me signed in");
    await waitFor(() => {
      expect(checkBoxElement).not.toBeChecked();
    });

    await waitFor(() => {
      fireEvent.click(checkBoxElement);
    });
    await waitFor(() => {
      expect(checkBoxElement).toBeChecked();
    });
  });

  describe("Button", () => {
    it("should be disabled", async () => {
      await waitFor(() => {
        render(<Login />);
      });
      const buttonElement = await screen.findByRole("button");

      await waitFor(() => {
        expect(buttonElement).toBeDisabled();
      });
    });

    it("should be enabled with inputs", async () => {
      await waitFor(() => {
        render(<Login />);
      });
      const buttonElement = await screen.findByRole("button");
      await waitFor(() => {
        expect(buttonElement).toBeDisabled();
      });

      const usernameElement = await screen.findByLabelText("Username");
      const passwordElement = await screen.findByLabelText("Password");

      await waitFor(() => {
        fireEvent.change(usernameElement, { target: { value: "manny" } });
      });
      await waitFor(() => {
        fireEvent.change(passwordElement, { target: { value: "qwerty" } });
      });
      await waitFor(() => {
        expect(buttonElement).toBeEnabled();
      });
    });

    it("should change label when clicked", async () => {
      await waitFor(() => {
        render(<Login />);
      });
      const buttonElement = await screen.findByRole("button");
      const usernameElement = await screen.findByLabelText("Username");
      const passwordElement = await screen.findByLabelText("Password");

      await waitFor(() => {
        userEvent.type(usernameElement, "manny");
      });
      await waitFor(() => {
        userEvent.type(passwordElement, "qwerty");
      });

      await waitFor(() => {
        userEvent.click(buttonElement);
      });

      const newButtonElement = await screen.findByRole("button");
      await waitFor(() => {
        expect(newButtonElement.textContent).toEqual("SIGNIN IN PROGRESS...");
      });
    });
  });

  describe("Success", () => {
    it("should navigate to streams page", async () => {
      await waitFor(() => {
        render(<Login />);
      });
      const buttonElement = await screen.findByRole("button");
      const usernameElement = await screen.findByLabelText("Username");
      const passwordElement = await screen.findByLabelText("Password");

      await waitFor(() => {
        userEvent.type(usernameElement, "manny");
      });
      await waitFor(() => {
        userEvent.type(passwordElement, "qwerty");
      });
      await waitFor(() => {
        userEvent.click(buttonElement);
      });

      await waitFor(() =>
        expect(mockedUsedNavigate).toHaveBeenCalledWith("/app/social/streams")
      );
    });
  });

  describe("Error", () => {
    it("should display error alert and border", async () => {
      await waitFor(() => {
        server.use(signInMockError);
      });
      await waitFor(() => {
        render(<Login />);
      });
      const buttonElement = await screen.findByRole("button");
      const usernameElement = await screen.findByLabelText("Username");
      const passwordElement = await screen.findByLabelText("Password");

      await waitFor(() => {
        userEvent.type(usernameElement, "ma");
      });
      await waitFor(() => {
        userEvent.type(passwordElement, "qwerty");
      });
      await waitFor(() => {
        userEvent.click(buttonElement);
      });

      const alert = await screen.findByRole("alert");
      await waitFor(() => {
        expect(alert).toBeInTheDocument();
        expect(alert.textContent).toEqual("Invalid credentials");
      });

      await waitFor(() =>
        expect(usernameElement).toHaveStyle({ border: "1px solid #fa9b8a" })
      );
      await waitFor(() =>
        expect(passwordElement).toHaveStyle({ border: "1px solid #fa9b8a" })
      );
    });
  });
});
 */
