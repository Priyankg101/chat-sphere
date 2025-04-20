/**
 * Interface representing a media attachment
 */
export interface IMediaAttachment {
  /** Type of the media */
  type: "image" | "video" | "file";

  /** URL or data URI of the media */
  url: string;

  /** Optional name of the file */
  name?: string;

  /** Optional size in bytes */
  size?: number;

  /** Optional width (for images/videos) */
  width?: number;

  /** Optional height (for images/videos) */
  height?: number;
}

/**
 * Represents an emoji reaction to a message
 */
export interface IReaction {
  /** Type of emoji reaction */
  emoji: "❤️" | "👍" | "😂" | "😮" | "😢" | "😡";

  /** User ID who reacted */
  userId: string;

  /** Timestamp when the reaction was added */
  timestamp: number;
}

/**
 * Message delivery status
 */
export type MessageStatus = "sent" | "delivered" | "read";

/**
 * Interface representing a message
 */
export interface IMessage {
  /** Unique identifier for the message */
  id: string;

  /** ID of the chat this message belongs to */
  chatId: string;

  /** ID of the sender */
  senderId: string;

  /** Name of the sender */
  senderName: string;

  /** Text content of the message */
  text: string;

  /** Timestamp when the message was sent */
  timestamp: number;

  /** Whether the message has been read */
  isRead?: boolean;

  /** Delivery status of the message */
  status?: MessageStatus;

  /** Whether the message is pinned */
  pinned?: boolean;

  /** Optional media attachment */
  media?: IMediaAttachment;

  /** Array of reactions to this message */
  reactions?: IReaction[];

  /** Optional ID of the message being replied to */
  replyToId?: string;

  /** Whether this message has been saved/bookmarked */
  isSaved?: boolean;

  /** When message was saved (timestamp) */
  savedAt?: number;

  /** Optional forwarded info */
  forwardedFrom?: {
    chatId: string;
    chatName: string;
    messageId: string;
    senderName: string;
  };
}
