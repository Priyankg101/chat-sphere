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

  /** Optional media attachment */
  media?: IMediaAttachment;

  /** Array of reactions to this message */
  reactions?: IReaction[];
}
