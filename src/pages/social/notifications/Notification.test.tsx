/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import Notification from "./Notification";
import { render, screen } from "../../../test.utils";
import userEvent from "@testing-library/user-event";
import { NotificationUtils } from "../../../services/utils/notification-utils.service";
import { notificationService } from "../../../services/api/notifications/notification.service";
import { server } from "../../../mocks/server";
import { emptyNotificationsMock } from "../../../mocks/handlers/notification";
import { notificationData } from "../../../mocks/data/notification.mock";

describe("Notification", () => {
  it("should display empty notification message", async () => {
    server.use(emptyNotificationsMock);
    render(<Notification />);
    const cardElementItems = screen.queryByTestId("notification-box");
    const emptyPage = await screen.findByTestId("empty-page");
    expect(cardElementItems).toBeNull();
    expect(emptyPage).toBeInTheDocument();
    expect(emptyPage.textContent).toEqual("You have no notification");
  });

  it("should have 1 card element item", async () => {
    render(<Notification />);
    const cardElementItems = await screen.findAllByTestId("notification-box");
    expect(cardElementItems.length).toEqual(1);
  });

  it("should show notification preview modal", async () => {
    render(<Notification />);
    const cardElementItems = await screen.findAllByTestId("notification-box");
    userEvent.click(cardElementItems[0]);
    const notificationPreview = await screen.findByTestId(
      "notification-preview"
    );
    expect(notificationPreview).toBeInTheDocument();
  });

  it("should handle mark as read", async () => {
    jest.spyOn(NotificationUtils, "markMessageAsRead");
    render(<Notification />);
    const cardElementItems = await screen.findAllByTestId("notification-box");
    userEvent.click(cardElementItems[0]);
    expect(NotificationUtils.markMessageAsRead).toHaveBeenCalledWith(
      notificationData._id,
      notificationData,
      expect.any(Function)
    );
  });

  it("should handle delete", async () => {
    jest.spyOn(notificationService, "deleteNotification");
    render(<Notification />);
    const subtitleElement = await screen.findAllByTestId("subtitle");
    userEvent.click(subtitleElement[0]);
    expect(notificationService.deleteNotification).toHaveBeenCalledWith(
      "12345"
    );
  });
});
