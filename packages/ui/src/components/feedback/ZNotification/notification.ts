import React, { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { ZNotification, ZNotificationProps } from "./ZNotification";
import styles from "./ZNotificationContainer.module.css";

export type NotificationPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "bottom-center";

interface NotificationItem extends ZNotificationProps {
  id: string;
}

class NotificationManager {
  private notifications: Map<string, NotificationItem> = new Map();
  private container: HTMLDivElement | null = null;
  private root: any = null;
  private position: NotificationPosition = "top-right";

  private ensureContainer() {
    if (!this.container) {
      this.container = document.createElement("div");
      this.container.className = `${styles.container} ${styles[this.position]}`;
      document.body.appendChild(this.container);

      if (typeof createRoot !== "undefined") {
        this.root = createRoot(this.container);
      }
    }
  }

  private render() {
    if (!this.root || !this.container) return;

    const notificationElements = Array.from(this.notifications.values()).map(
      (notification) =>
        React.createElement(ZNotification, {
          key: notification.id,
          ...notification,
          onClose: () => this.remove(notification.id),
        })
    );

    this.root.render(
      React.createElement(
        "div",
        { className: styles.list },
        notificationElements
      )
    );
  }

  show(props: Omit<ZNotificationProps, "onClose">): string {
    this.ensureContainer();

    const id = Math.random().toString(36).substring(2, 11);
    const notification: NotificationItem = { ...props, id };

    this.notifications.set(id, notification);
    this.render();

    if (props.autoDismiss) {
      setTimeout(() => this.remove(id), props.autoDismiss);
    }

    return id;
  }

  remove(id: string) {
    this.notifications.delete(id);
    this.render();

    if (this.notifications.size === 0 && this.container) {
      setTimeout(() => {
        if (this.notifications.size === 0) {
          this.root?.unmount();
          this.container?.remove();
          this.container = null;
          this.root = null;
        }
      }, 300);
    }
  }

  setPosition(position: NotificationPosition) {
    this.position = position;
    if (this.container) {
      this.container.className = `${styles.container} ${styles[position]}`;
    }
  }

  clear() {
    this.notifications.clear();
    this.render();
  }
}

export const notification = new NotificationManager();

export default notification;
