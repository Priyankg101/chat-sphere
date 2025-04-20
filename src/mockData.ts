import { IChat } from "./types/chat";
import { IMessage } from "./types/message";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./types/user";

// Generate unique IDs for chats
const chatIds = {
  general: uuidv4(),
  tech: uuidv4(),
  social: uuidv4(),
  family: uuidv4(),
  work: uuidv4(),
  friends: uuidv4(),
  travel: uuidv4(),
  sports: uuidv4(),
};

// Mock chats data
export const mockChats: IChat[] = [
  {
    id: chatIds.general,
    groupName: "General Chat",
    participants: ["user1", "user2", "user3", "user4"],
    type: "group",
    lastMessage: {
      text: "Let's discuss the project timeline this week",
      timestamp: Date.now() - 1000 * 60 * 5, // 5 minutes ago
    },
    timestamp: Date.now() - 1000 * 60 * 5,
    unreadCount: 2,
    members: [
      { id: "user1", name: "You", isAdmin: true },
      { id: "user2", name: "Alex Johnson" },
      { id: "user3", name: "Taylor Swift" },
      { id: "user4", name: "John Doe" },
    ],
  },
  {
    id: chatIds.tech,
    groupName: "Tech Discussion",
    participants: ["user1", "user2", "user5"],
    type: "group",
    lastMessage: {
      text: "Have you tried the new React 18 features?",
      timestamp: Date.now() - 1000 * 60 * 20, // 20 minutes ago
    },
    timestamp: Date.now() - 1000 * 60 * 20,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You" },
      { id: "user2", name: "Alex Johnson", isAdmin: true },
      { id: "user5", name: "Emma Wilson" },
    ],
    muted: true,
  },
  {
    id: chatIds.social,
    groupName: "Weekend Plans",
    participants: ["user1", "user3", "user6", "user7"],
    type: "group",
    lastMessage: {
      text: "I'm thinking of hosting a BBQ on Saturday",
      timestamp: Date.now() - 1000 * 60 * 60, // 1 hour ago
    },
    timestamp: Date.now() - 1000 * 60 * 60,
    unreadCount: 5,
    members: [
      { id: "user1", name: "You" },
      { id: "user3", name: "Taylor Swift" },
      { id: "user6", name: "Michael Brown", isAdmin: true },
      { id: "user7", name: "Sarah Parker" },
    ],
  },
  {
    id: chatIds.family,
    groupName: "Family Group",
    participants: ["user1", "user8", "user9", "user10"],
    type: "group",
    lastMessage: {
      text: "Mom's birthday is next week, let's plan something special",
      timestamp: Date.now() - 1000 * 60 * 60 * 3, // 3 hours ago
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You", isAdmin: true },
      { id: "user8", name: "Mom" },
      { id: "user9", name: "Dad" },
      { id: "user10", name: "Sister" },
    ],
  },
  {
    id: chatIds.work,
    groupName: "Work Team",
    participants: ["user1", "user11", "user12", "user13", "user14"],
    type: "group",
    lastMessage: {
      text: "The client meeting is scheduled for tomorrow at 10 AM",
      timestamp: Date.now() - 1000 * 60 * 60 * 8, // 8 hours ago
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    unreadCount: 1,
    members: [
      { id: "user1", name: "You" },
      { id: "user11", name: "Boss", isAdmin: true },
      { id: "user12", name: "Colleague 1" },
      { id: "user13", name: "Colleague 2" },
      { id: "user14", name: "HR" },
    ],
  },
  {
    id: chatIds.friends,
    groupName: "College Friends",
    participants: ["user1", "user15", "user16", "user17"],
    type: "group",
    lastMessage: {
      text: "Reunion next month? Who's in?",
      timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    unreadCount: 3,
    members: [
      { id: "user1", name: "You" },
      { id: "user15", name: "Best Friend", isAdmin: true },
      { id: "user16", name: "Roommate" },
      { id: "user17", name: "Study Buddy" },
    ],
  },
  {
    id: chatIds.travel,
    groupName: "Travel Plans",
    participants: ["user1", "user18", "user19"],
    type: "group",
    lastMessage: {
      text: "I found some great deals for our trip to Europe",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2, // 2 days ago
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You", isAdmin: true },
      { id: "user18", name: "Travel Buddy" },
      { id: "user19", name: "Tour Guide" },
    ],
    muted: true,
  },
  {
    id: chatIds.sports,
    groupName: "Sports Talk",
    participants: ["user1", "user20", "user21", "user22"],
    type: "group",
    lastMessage: {
      text: "Did you watch the game last night? Amazing finish!",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3, // 3 days ago
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You" },
      { id: "user20", name: "Sports Fan 1", isAdmin: true },
      { id: "user21", name: "Sports Fan 2" },
      { id: "user22", name: "Coach" },
    ],
  },
];

// Mock messages data
export const mockMessages: IMessage[] = [
  // General Chat
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Hi everyone! Welcome to our new project channel.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1 day ago
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "Excited to work with all of you on this project!",
    timestamp: Date.now() - 1000 * 60 * 60 * 23.5, // 23.5 hours ago
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user1",
    senderName: "You",
    text: "Thanks for setting this up, Alex. I think this will help us collaborate better.",
    timestamp: Date.now() - 1000 * 60 * 60 * 23,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user4",
    senderName: "John Doe",
    text: "I've shared the initial requirements document in our shared folder.",
    timestamp: Date.now() - 1000 * 60 * 60 * 22,
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Thanks John! Let's all review it by tomorrow.",
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "I've already looked through it and added some comments.",
    timestamp: Date.now() - 1000 * 60 * 60,
  },
  {
    id: uuidv4(),
    chatId: chatIds.general,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Let's discuss the project timeline this week",
    timestamp: Date.now() - 1000 * 60 * 5,
  },

  // Tech Discussion
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "Has anyone implemented server-side rendering with Next.js?",
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
  },
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user1",
    senderName: "You",
    text: "Yes, I've used it in my last project. It's great for SEO and initial load times.",
    timestamp: Date.now() - 1000 * 60 * 60 * 11.5,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "I can share some code examples if you'd like.",
    timestamp: Date.now() - 1000 * 60 * 60 * 11,
  },
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "That would be very helpful, thanks!",
    timestamp: Date.now() - 1000 * 60 * 60 * 10,
  },
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user1",
    senderName: "You",
    text: "Also, make sure to check the documentation on data fetching methods.",
    timestamp: Date.now() - 1000 * 60 * 60 * 9,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Have you tried the new React 18 features?",
    timestamp: Date.now() - 1000 * 60 * 20,
  },

  // Weekend Plans
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "Hey everyone! Any plans for the weekend?",
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user7",
    senderName: "Sarah Parker",
    text: "Not yet, open to suggestions!",
    timestamp: Date.now() - 1000 * 60 * 60 * 4.5,
  },
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user1",
    senderName: "You",
    text: "I might go hiking if the weather is nice.",
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user6",
    senderName: "Michael Brown",
    text: "That sounds fun! Which trail are you thinking of?",
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user1",
    senderName: "You",
    text: "Probably Pine Mountain. It's not too difficult and has great views.",
    timestamp: Date.now() - 1000 * 60 * 60 * 2.5,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.social,
    senderId: "user6",
    senderName: "Michael Brown",
    text: "I'm thinking of hosting a BBQ on Saturday",
    timestamp: Date.now() - 1000 * 60 * 60,
  },

  // Add some saved messages
  {
    id: uuidv4(),
    chatId: chatIds.work,
    senderId: "user11",
    senderName: "Boss",
    text: "Important: The deadline for the quarterly report has been moved up to next Friday.",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    isSaved: true,
    savedAt: Date.now() - 1000 * 60 * 60 * 47,
  },
  {
    id: uuidv4(),
    chatId: chatIds.family,
    senderId: "user8",
    senderName: "Mom",
    text: "The new address for Thanksgiving dinner is 123 Maple Street. Don't forget to bring the dessert!",
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
    isSaved: true,
    savedAt: Date.now() - 1000 * 60 * 60 * 70,
  },

  // Add a message with a reply
  {
    id: uuidv4(),
    chatId: chatIds.tech,
    senderId: "user5",
    senderName: "Emma Wilson",
    text: "Does anyone know how to fix the webpack configuration issue we discussed yesterday?",
    timestamp: Date.now() - 1000 * 60 * 60 * 25,
  },
  {
    id: "reply-msg-1",
    chatId: chatIds.tech,
    senderId: "user1",
    senderName: "You",
    text: "I fixed it by updating the babel config and clearing the cache. Let me know if you need the exact settings.",
    timestamp: Date.now() - 1000 * 60 * 60 * 24.5,
    status: "read",
    replyToId: "webpack-issue-msg",
  },

  // Add a forwarded message
  {
    id: uuidv4(),
    chatId: chatIds.family,
    senderId: "user1",
    senderName: "You",
    text: "I just booked our vacation for July 15-22. We'll be staying at the Oceanview Resort.",
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    status: "read",
    forwardedFrom: {
      chatId: chatIds.travel,
      chatName: "Travel Plans",
      messageId: "original-travel-msg",
      senderName: "Travel Buddy",
    },
  },

  // Add pinned message
  {
    id: "pinned-msg-1",
    chatId: chatIds.general,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Project kickoff meeting is on Monday at 10 AM in the main conference room. Please prepare your status updates.",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    pinned: true,
  },
];

// Mock users data
export const mockUsers: IUser[] = [
  {
    id: "user1",
    name: "You",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now(),
    isOnline: true,
  },
  {
    id: "user2",
    name: "Alex Johnson",
    status: "In a meeting",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 30,
    isOnline: true,
  },
  {
    id: "user3",
    name: "Taylor Swift",
    status: "Busy",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60,
    isOnline: false,
  },
  {
    id: "user4",
    name: "Chris Evans",
    status: "At the gym",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60 * 2,
    isOnline: false,
  },
  {
    id: "user5",
    name: "Emma Wilson",
    status: "At work",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 15,
    isOnline: true,
  },
  {
    id: "user6",
    name: "Michael Brown",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 5,
    isOnline: true,
  },
  {
    id: "user7",
    name: "Sarah Parker",
    status: "On vacation",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isOnline: false,
  },
  {
    id: "user8",
    name: "Mom",
    status: "Cooking",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 180,
    isOnline: false,
  },
  {
    id: "user9",
    name: "Dad",
    status: "At work",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 30,
    isOnline: true,
  },
  {
    id: "user10",
    name: "Jessica Smith",
    status: "In transit",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 45,
    isOnline: true,
  },
  {
    id: "user11",
    name: "Boss",
    status: "Do not disturb",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 120,
    isOnline: false,
  },
];

// Mark the first chat as being selected by default
localStorage.setItem(`pinned_message_${chatIds.general}`, "pinned-msg-1");

/**
 * Pre-defined message summaries for long messages
 */
export const mockMessageSummaries: Record<string, string> = {
  "message-1": "Discussion about project timeline and upcoming deadlines.",
  "message-5": "Plans for team meeting and review of recent progress.",
  "message-12":
    "Questions about technical implementation details and potential solutions.",
  "message-17": "Update on client feedback and suggestions for improvement.",
  "message-25": "Weekend plans and coordination for next week's activities.",
  "message-38": "Information about system requirements and deployment process.",
};

/**
 * Smart reply suggestions based on the last message in a conversation
 */
export const mockSmartReplies: Record<string, string[]> = {
  // Greetings
  "Hey there! How's it going?": [
    "I'm good, thanks!",
    "Great! How are you?",
    "Doing well, just busy with work.",
  ],
  "Hi everyone": ["Hey team!", "Hello!", "Hi there, how's everyone doing?"],

  // Questions
  "Do you have time for a quick call?": [
    "Sure, I'm free now",
    "How about in 30 minutes?",
    "I'm available after 2pm",
  ],
  "What do you think about the new design?": [
    "Looks great!",
    "I like it, but have a few suggestions",
    "It's a good start",
  ],
  "When is the deadline for this project?": [
    "End of this week",
    "Let me check and get back to you",
    "I believe it's Friday",
  ],

  // Project related
  "I've pushed the changes to the repo": [
    "Thanks for the update",
    "I'll take a look",
    "Any issues I should know about?",
  ],
  "The client requested some revisions to the UI": [
    "What kind of changes?",
    "Let's discuss it tomorrow",
    "I can start working on it",
  ],

  // General responses
  "Thanks for your help!": ["No problem!", "Happy to help", "Anytime!"],
  "Sorry I'll be late to the meeting": [
    "No worries",
    "Thanks for letting us know",
    "We'll wait for you",
  ],
  "Look at this article I found": [
    "Interesting!",
    "Thanks for sharing",
    "I'll check it out",
  ],
};
