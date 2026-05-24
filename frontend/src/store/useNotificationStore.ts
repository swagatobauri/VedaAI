import { create } from 'zustand';

export type NotificationType = "success" | "info" | "warning" | "error";

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: Date;
  read: boolean;
  type: NotificationType;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "date" | "read">) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
      read: false,
    };
    
    set((state) => {
      const newNotifications = [newNotification, ...state.notifications];
      return {
        notifications: newNotifications,
        unreadCount: newNotifications.filter((n) => !n.read).length
      };
    });
  },

  markAllAsRead: () => {
    set((state) => {
      const newNotifications = state.notifications.map((notif) => ({ ...notif, read: true }));
      return {
        notifications: newNotifications,
        unreadCount: 0
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  }
}));
