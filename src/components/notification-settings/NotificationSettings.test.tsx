/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import NotificationSettings from "./NotificationSettings";
import { render, screen } from "../../test.utils";
import { act } from "react-dom/test-utils";
import { store } from "../../redux-toolkit/store";
import { addUser } from "../../redux-toolkit/reducers/user/user.reducer";
import { existingUser } from "../../mocks/data/user.mock";
import userEvent from "@testing-library/user-event";

describe("NotificationSettings", () => {
  beforeEach(() => {
    act(() => {
      store.dispatch(addUser({ token: "123456", profile: existingUser }));
    });
  });

  it("should display notification settings items", async () => {
    render(<NotificationSettings />);
    const settingsItems = await screen.findAllByTestId(
      "notification-settings-item"
    );
    expect(settingsItems.length).toEqual(4);
    settingsItems.forEach((item) => expect(item).toBeInTheDocument());
  });

  it("should have buttons toggled by default", async () => {
    render(<NotificationSettings />);
    const checkBoxElement = await screen.findAllByTestId("toggle");
    expect(checkBoxElement[0].childNodes.item(0)).toBeChecked();
    expect(checkBoxElement[1].childNodes.item(0)).toBeChecked();
    expect(checkBoxElement[2].childNodes.item(0)).toBeChecked();
    expect(checkBoxElement[3].childNodes.item(0)).toBeChecked();
  });

  it("should button toggled by click", async () => {
    render(<NotificationSettings />);
    const checkBoxElement = await screen.findAllByTestId("toggle");
    expect(checkBoxElement[0].childNodes.item(0)).toBeChecked();
    userEvent.click(checkBoxElement[0].childNodes.item(0));
    expect(checkBoxElement[0].childNodes.item(0)).not.toBeChecked();
  });
});
