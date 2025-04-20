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
}
