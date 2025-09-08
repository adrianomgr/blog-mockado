export interface Notification {
  id: number;
  type: 'new-post' | 'new-user';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: string;
  severity: 'info' | 'success' | 'warning' | 'error';
}

export interface CreateNotificationRequest {
  type: 'new-post' | 'new-user';
  title: string;
  message: string;
}
