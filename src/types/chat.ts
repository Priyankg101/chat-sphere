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
 * Interface for last message in a chat
 */
export interface ILastMessage {
  /** Text content of the last message */
  text: string;

  /** Timestamp of when the message was sent */
  timestamp: number;
}

/**
 * Interface representing a chat or conversation
 */
export interface IChat {
  /** Unique identifier for the chat */
  id: string;

  /** Name of the group or conversation */
  groupName: string;

  /** Array of participant IDs */
  participants: string[];

  /** Information about the most recent message */
  lastMessage: {
    text: string;
    timestamp: number;
  };

  /** Timestamp of the most recent message */
  timestamp: number;

  /** Number of unread messages */
  unreadCount: number;

  /** Type of the chat */
  type: "individual" | "group";

  /** Optional avatar URL */
  avatar?: string;

  /** Array of member details */
  members?: IChatMember[];

  /** Whether notifications are muted for this chat */
  muted?: boolean;
}
