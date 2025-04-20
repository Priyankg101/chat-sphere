// User interface
export interface IUser {
  id: string;
  name: string;
  avatar?: string;
  status?: string;
  email?: string;
  lastSeen?: number; // Timestamp
  isOnline?: boolean;
}
