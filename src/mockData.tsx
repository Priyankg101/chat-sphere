import { IChat } from "./types/chat";
import { IMessage } from "./types/message";
import { IUser } from "./types/user";

// Mock users data
export const mockUsers: IUser[] = [
  {
    id: "user1",
    name: "You",
    status: "Online",
    isOnline: true,
    email: "you@example.com",
    lastSeen: Date.now(),
  },
  {
    id: "user2",
    name: "Alex Johnson",
    status: "Last seen 5 minutes ago",
    isOnline: false,
    lastSeen: Date.now() - 5 * 60 * 1000,
    avatar:
      "https://ui-avatars.com/api/?name=Alex+Johnson&background=0D8ABC&color=fff",
  },
  {
    id: "user3",
    name: "Taylor Swift",
    status: "At the gym 🏋️‍♀️",
    isOnline: true,
    lastSeen: Date.now(),
    avatar:
      "https://ui-avatars.com/api/?name=Taylor+Swift&background=FF6347&color=fff",
  },
  {
    id: "user4",
    name: "John Doe",
    status: "Busy",
    isOnline: true,
    lastSeen: Date.now(),
    avatar:
      "https://ui-avatars.com/api/?name=John+Doe&background=4CAF50&color=fff",
  },
  {
    id: "user5",
    name: "Emma Wilson",
    status: "In a meeting",
    isOnline: false,
    lastSeen: Date.now() - 30 * 60 * 1000,
    avatar:
      "https://ui-avatars.com/api/?name=Emma+Wilson&background=9C27B0&color=fff",
  },
  {
    id: "user6",
    name: "Michael Brown",
    status: "Away",
    isOnline: false,
    lastSeen: Date.now() - 2 * 60 * 60 * 1000,
    avatar:
      "https://ui-avatars.com/api/?name=Michael+Brown&background=FFC107&color=000",
  },
  {
    id: "user7",
    name: "Sophia Garcia",
    status: "Working from home",
    isOnline: true,
    lastSeen: Date.now(),
    avatar:
      "https://ui-avatars.com/api/?name=Sophia+Garcia&background=607D8B&color=fff",
  },
];

// Mock chat data
export const mockChats: IChat[] = [
  {
    id: "chat1",
    type: "group",
    groupName: "Tech Discussion",
    participants: ["user1", "user2", "user3", "user4", "user5"],
    lastMessage: {
      text: "Has anyone implemented server-side rendering with Next.js?",
      timestamp: Date.now() - 5 * 60 * 1000,
    },
    unreadCount: 3,
    timestamp: Date.now() - 5 * 60 * 1000,
  },
  {
    id: "chat2",
    type: "individual",
    participants: ["user1", "user2"],
    groupName: "Alex Johnson",
    lastMessage: {
      text: "Let's catch up tomorrow for coffee",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
    },
    unreadCount: 0,
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "chat3",
    type: "group",
    groupName: "Project Alpha Team",
    participants: ["user1", "user3", "user4", "user7"],
    lastMessage: {
      text: "The new feature is now deployed to production",
      timestamp: Date.now() - 12 * 60 * 60 * 1000,
    },
    unreadCount: 0,
    timestamp: Date.now() - 12 * 60 * 60 * 1000,
  },
  {
    id: "chat4",
    type: "individual",
    participants: ["user1", "user5"],
    groupName: "Emma Wilson",
    lastMessage: {
      text: "I've sent you the documents you requested",
      timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
    },
    unreadCount: 1,
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  {
    id: "chat5",
    type: "group",
    groupName: "JavaScript Enthusiasts",
    participants: ["user1", "user2", "user5", "user7"],
    lastMessage: {
      text: "Have you tried the new React 18 features?",
      timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
    },
    unreadCount: 5,
    timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "chat6",
    type: "individual",
    participants: ["user1", "user3"],
    groupName: "Taylor Swift",
    lastMessage: {
      text: "Can you review my PR?",
      timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
    },
    unreadCount: 0,
    timestamp: Date.now() - 3 * 24 * 60 * 60 * 1000,
  },
  {
    id: "chat7",
    type: "individual",
    participants: ["user1", "user4"],
    groupName: "John Doe",
    lastMessage: {
      text: "Thanks for your help with the bug fix!",
      timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
    },
    unreadCount: 0,
    timestamp: Date.now() - 4 * 24 * 60 * 60 * 1000,
  },
  {
    id: "chat8",
    type: "group",
    groupName: "Office Hangout",
    participants: [
      "user1",
      "user2",
      "user3",
      "user4",
      "user5",
      "user6",
      "user7",
    ],
    lastMessage: {
      text: "Who's coming to the Friday happy hour?",
      timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
    },
    unreadCount: 2,
    timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000,
  },
];

// Mock messages data
export const mockMessages: IMessage[] = [
  {
    id: "msg1",
    chatId: "chat1",
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "Has anyone implemented server-side rendering with Next.js?",
    timestamp: Date.now() - 5 * 60 * 1000,
  },
  {
    id: "msg2",
    chatId: "chat1",
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "Yes, I've been using it for a while now. What specific issue are you facing?",
    timestamp: Date.now() - 4 * 60 * 1000,
  },
  {
    id: "msg3",
    chatId: "chat1",
    senderId: "user4",
    senderName: "John Doe",
    text: "SSR is pretty straightforward with Next.js. Their documentation has excellent examples.",
    timestamp: Date.now() - 3 * 60 * 1000,
  },
  {
    id: "msg4",
    chatId: "chat1",
    senderId: "user1",
    senderName: "You",
    text: "I've had trouble with data fetching in getServerSideProps when using external APIs that require authentication.",
    timestamp: Date.now() - 2 * 60 * 1000,
  },
  {
    id: "msg5",
    chatId: "chat1",
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "You should store your auth tokens in cookies instead of localStorage when using SSR. That way your server can access them during the server-side rendering phase.",
    timestamp: Date.now() - 1 * 60 * 1000,
  },
  {
    id: "msg6",
    chatId: "chat2",
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Hey, are you free tomorrow?",
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: "msg7",
    chatId: "chat2",
    senderId: "user1",
    senderName: "You",
    text: "Yeah, what's up?",
    timestamp: Date.now() - 2.5 * 60 * 60 * 1000,
  },
  {
    id: "msg8",
    chatId: "chat2",
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Let's catch up tomorrow for coffee",
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: "msg9",
    chatId: "chat4",
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "Hi there! Just following up on the documentation we discussed yesterday.",
    timestamp: Date.now() - 1.5 * 24 * 60 * 60 * 1000,
  },
  {
    id: "msg10",
    chatId: "chat4",
    senderId: "user1",
    senderName: "You",
    text: "Yes, I'm still working on it. Should be ready by tomorrow.",
    timestamp: Date.now() - 1.2 * 24 * 60 * 60 * 1000,
  },
  {
    id: "msg11",
    chatId: "chat4",
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "Great! I've sent you the documents you requested",
    timestamp: Date.now() - 1 * 24 * 60 * 60 * 1000,
  },
  // Additional mock messages for other chats can be added here
];

export const getRandomMessage = (
  chatId: string,
  senderId: string,
  senderName: string
) => {
  const randomMessages = [
    "Hey, how's it going?",
    "Did you see the latest update?",
    "Can we discuss the project later today?",
    "Just checking in. How are you?",
    "I think we need to review the code again.",
    "Have you had a chance to look at my PR?",
    "What do you think about the new design?",
    "When is the next team meeting?",
    "Let's grab coffee sometime this week.",
    "I've been working on this bug all day!",
  ];

  const randomIndex = Math.floor(Math.random() * randomMessages.length);

  return {
    id: `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    chatId,
    senderId,
    senderName,
    text: randomMessages[randomIndex],
    timestamp: Date.now(),
  };
};
