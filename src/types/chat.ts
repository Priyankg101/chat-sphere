/**
 * Interface representing a group member
 */
export interface IChatMember {
  /** ID of the member */
  id: string;

  /** Name of the member */
  name: string;

  /** Whether the member is an admin */
  isAdmin?: boolean;
}

/**
 * Interface representing a chat or conversation
 */
export interface IChat {
  /** Unique identifier for the chat */
  id: string;

  /** Name of the group or conversation */
  groupName: string;

  /** Text of the most recent message */
  lastMessage: string;

  /** Timestamp of the most recent message */
  timestamp: number;

  /** Number of unread messages */
  unreadCount: number;

  /** Optional avatar URL */
  avatarUrl?: string;

  /** Array of participant IDs */
  participants?: string[];

  /** Array of member details */
  members?: IChatMember[];

  /** Whether notifications are muted for this chat */
  muted?: boolean;
}
