import { IChat } from "./types/chat";
import { IMessage } from "./types/message";
import { v4 as uuidv4 } from "uuid";
import { IUser } from "./types/user";

// Generate unique IDs for chats
const chatIds = {
  chat1: uuidv4(),
  chat2: uuidv4(),
  chat3: uuidv4(),
  chat4: uuidv4(),
  chat5: uuidv4(),
  chat6: uuidv4(),
  chat7: uuidv4(),
  chat8: uuidv4(),
  chat9: uuidv4(),
  chat10: uuidv4(),
};

// Mock chats data
export const mockChats: IChat[] = [
  {
    id: chatIds.chat1,
    groupName: "Frontend Team",
    participants: ["user1", "user2", "user3", "user4"],
    type: "group",
    lastMessage: {
      text: "I've fixed that accessibility issue on the dropdown component",
      timestamp: Date.now() - 1000 * 60 * 5,
    },
    timestamp: Date.now() - 1000 * 60 * 5,
    unreadCount: 3,
    members: [
      { id: "user1", name: "You", isAdmin: true },
      { id: "user2", name: "Alex Johnson" },
      { id: "user3", name: "Taylor Swift" },
      { id: "user4", name: "John Smith" },
    ],
  },
  {
    id: chatIds.chat2,
    groupName: "Project Brainstorm",
    participants: ["user1", "user2", "user5"],
    type: "group",
    lastMessage: {
      text: "I've attached a few examples of animation libraries we could use",
      timestamp: Date.now() - 1000 * 60 * 20,
    },
    timestamp: Date.now() - 1000 * 60 * 20,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You" },
      { id: "user2", name: "Alex Johnson", isAdmin: true },
      { id: "user5", name: "Emma Parker" },
    ],
    muted: true,
  },
  {
    id: chatIds.chat3,
    groupName: "Sarah Johnson",
    participants: ["user1", "user6"],
    type: "individual",
    lastMessage: {
      text: "Let me know when we can discuss the feedback from the client",
      timestamp: Date.now() - 1000 * 60 * 60,
    },
    timestamp: Date.now() - 1000 * 60 * 60,
    unreadCount: 1,
    members: [
      { id: "user1", name: "You" },
      { id: "user6", name: "Sarah Johnson" },
    ],
  },
  {
    id: chatIds.chat4,
    groupName: "UX Research Team",
    participants: ["user1", "user7", "user8", "user9"],
    type: "group",
    lastMessage: {
      text: "The user testing results have been analyzed - check out the insights!",
      timestamp: Date.now() - 1000 * 60 * 60 * 3,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    unreadCount: 5,
    members: [
      { id: "user1", name: "You" },
      { id: "user7", name: "Maya Rodriguez", isAdmin: true },
      { id: "user8", name: "David Kim" },
      { id: "user9", name: "Priya Patel" },
    ],
  },
  {
    id: chatIds.chat5,
    groupName: "Michael Chen",
    participants: ["user1", "user10"],
    type: "individual",
    lastMessage: {
      text: "Thanks for the code review! I've addressed all your comments",
      timestamp: Date.now() - 1000 * 60 * 60 * 8,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You" },
      { id: "user10", name: "Michael Chen" },
    ],
  },
  {
    id: chatIds.chat6,
    groupName: "Hackathon 2025",
    participants: ["user1", "user11", "user12", "user13", "user14"],
    type: "group",
    lastMessage: {
      text: "We won first place! 🏆 Celebratory lunch tomorrow?",
      timestamp: Date.now() - 1000 * 60 * 60 * 24,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    unreadCount: 2,
    members: [
      { id: "user1", name: "You" },
      { id: "user11", name: "Olivia Wilson", isAdmin: true },
      { id: "user12", name: "Ethan Brown" },
      { id: "user13", name: "Sophie Lee" },
      { id: "user14", name: "Noah Garcia" },
    ],
  },
  {
    id: chatIds.chat7,
    groupName: "API Integration",
    participants: ["user1", "user15", "user16"],
    type: "group",
    lastMessage: {
      text: "The authentication middleware is now working correctly",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    unreadCount: 0,
    members: [
      { id: "user1", name: "You", isAdmin: true },
      { id: "user15", name: "Liam Scott" },
      { id: "user16", name: "Emma Davis" },
    ],
    muted: true,
  },
  {
    id: chatIds.chat8,
    groupName: "Design System",
    participants: ["user1", "user2", "user3", "user17", "user18"],
    type: "group",
    lastMessage: {
      text: "I created a Figma library with all our components",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    unreadCount: 3,
    members: [
      { id: "user1", name: "You" },
      { id: "user2", name: "Alex Johnson" },
      { id: "user3", name: "Taylor Swift" },
      { id: "user17", name: "Isabella Martinez", isAdmin: true },
      { id: "user18", name: "James Wilson" },
    ],
  },
  {
    id: chatIds.chat9,
    groupName: "Jessica Parker",
    participants: ["user1", "user19"],
    type: "individual",
    lastMessage: {
      text: "Are we still meeting for coffee tomorrow at 10?",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    unreadCount: 1,
    members: [
      { id: "user1", name: "You" },
      { id: "user19", name: "Jessica Parker" },
    ],
  },
  {
    id: chatIds.chat10,
    groupName: "Conference Planning",
    participants: ["user1", "user20", "user21", "user22", "user23"],
    type: "group",
    lastMessage: {
      text: "The speaker list has been finalized - check the spreadsheet",
      timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    },
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    unreadCount: 7,
    members: [
      { id: "user1", name: "You" },
      { id: "user20", name: "Daniel Thomas", isAdmin: true },
      { id: "user21", name: "Ava Robinson", isAdmin: true },
      { id: "user22", name: "William Clark" },
      { id: "user23", name: "Grace Hall" },
    ],
  },
];

// Mock messages data
export const mockMessages: IMessage[] = [
  // Frontend Team
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "Hey team, I've just pushed the latest updates to the design system",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "Looks great! I especially like the new button styles",
    timestamp: Date.now() - 1000 * 60 * 60 * 1.9,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user4",
    senderName: "John Smith",
    text: "Let's review the new design system together this afternoon",
    timestamp: Date.now() - 1000 * 60 * 60 * 1.8,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "I've also added a prototype for mobile views",
    timestamp: Date.now() - 1000 * 60 * 60 * 1.7,
    media: {
      type: "image",
      url: "https://cdn.sanity.io/images/qyzm5ged/production/08a2380ccd0d504abc18e28ef7d247952e6033bb-1296x970.gif/Scroll_view.gif",
      name: "mobile-prototype.png",
      size: 1240000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user3",
    senderName: "Taylor Swift",
    text: "Nice work! The responsive behavior looks smooth",
    timestamp: Date.now() - 1000 * 60 * 60 * 1.6,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat1,
    senderId: "user1",
    senderName: "You",
    text: "I've fixed that accessibility issue on the dropdown component",
    timestamp: Date.now() - 1000 * 60 * 5,
    status: "sent",
  },

  // Project Brainstorm
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user5",
    senderName: "Emma Parker",
    text: "What frameworks are we considering for the new project?",
    timestamp: Date.now() - 1000 * 60 * 60 * 4,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user1",
    senderName: "You",
    text: "I was thinking about Vue or React",
    timestamp: Date.now() - 1000 * 60 * 60 * 3.9,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "I think we should use React for this. It would integrate better with our existing tools",
    timestamp: Date.now() - 1000 * 60 * 60 * 3.8,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user1",
    senderName: "You",
    text: "Good point. React it is then!",
    timestamp: Date.now() - 1000 * 60 * 60 * 3.7,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user5",
    senderName: "Emma Parker",
    text: "Agreed. Let me share some starter templates I've used before",
    timestamp: Date.now() - 1000 * 60 * 60 * 3.6,
    media: {
      type: "file",
      url: "#",
      name: "react-starter-templates.zip",
      size: 2560000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat2,
    senderId: "user2",
    senderName: "Alex Johnson",
    text: "I've attached a few examples of animation libraries we could use",
    timestamp: Date.now() - 1000 * 60 * 20,
    media: {
      type: "file",
      url: "#",
      name: "animation-libraries.pdf",
      size: 4750000,
    },
  },

  // Individual chat with Sarah Johnson
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user6",
    senderName: "Sarah Johnson",
    text: "Hi, I've finished the quarterly report",
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user1",
    senderName: "You",
    text: "Great! Can you share it with me?",
    timestamp: Date.now() - 1000 * 60 * 60 * 4.9,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user6",
    senderName: "Sarah Johnson",
    text: "Sure, here you go. Let me know if you need any changes",
    timestamp: Date.now() - 1000 * 60 * 60 * 4.8,
    media: {
      type: "file",
      url: "#",
      name: "Q2-2024-Report.pdf",
      size: 3450000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user1",
    senderName: "You",
    text: "Thanks! I'll review it this afternoon",
    timestamp: Date.now() - 1000 * 60 * 60 * 4.7,
    status: "read",
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user6",
    senderName: "Sarah Johnson",
    text: "The documents are ready for review. I've also included the presentation slides",
    timestamp: Date.now() - 1000 * 60 * 60 * 2,
    media: {
      type: "file",
      url: "#",
      name: "Q2-Presentation.pptx",
      size: 5670000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat3,
    senderId: "user6",
    senderName: "Sarah Johnson",
    text: "Let me know when we can discuss the feedback from the client",
    timestamp: Date.now() - 1000 * 60 * 60,
  },

  // UX Research Team with pinned message
  {
    id: "ux-pinned-msg",
    chatId: chatIds.chat4,
    senderId: "user7",
    senderName: "Maya Rodriguez",
    text: "Team, we've completed the first round of user testing for the new checkout flow",
    timestamp: Date.now() - 1000 * 60 * 60 * 6,
    pinned: true,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat4,
    senderId: "user8",
    senderName: "David Kim",
    text: "How many participants did we have?",
    timestamp: Date.now() - 1000 * 60 * 60 * 5.9,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat4,
    senderId: "user7",
    senderName: "Maya Rodriguez",
    text: "We had 12 participants across different demographics",
    timestamp: Date.now() - 1000 * 60 * 60 * 5.8,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat4,
    senderId: "user9",
    senderName: "Priya Patel",
    text: "Here's a recording of one of the test sessions",
    timestamp: Date.now() - 1000 * 60 * 60 * 5.7,
    media: {
      type: "video",
      url: "#",
      name: "user-test-session3.mp4",
      size: 102400000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat4,
    senderId: "user7",
    senderName: "Maya Rodriguez",
    text: "The user testing results have been analyzed - check out the insights!",
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    summary:
      "Summary of user testing findings for the checkout flow redesign, highlighting pain points and areas for improvement",
    media: {
      type: "file",
      url: "#",
      name: "ux-research-findings.pdf",
      size: 8750000,
    },
  },

  // Hackathon team with reactions
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user11",
    senderName: "Olivia Wilson",
    text: "Team, we need to submit our hackathon project by tomorrow at 5 PM",
    timestamp: Date.now() - 1000 * 60 * 60 * 48,
    isSaved: true,
    savedAt: Date.now() - 1000 * 60 * 60 * 47,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user12",
    senderName: "Ethan Brown",
    text: "I'm just finishing up the frontend. Does anyone still need help with their part?",
    timestamp: Date.now() - 1000 * 60 * 60 * 47,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user13",
    senderName: "Sophie Lee",
    text: "I could use some help with the AI integration",
    timestamp: Date.now() - 1000 * 60 * 60 * 46,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user14",
    senderName: "Noah Garcia",
    text: "I can help with that, Sophie. I'll DM you",
    timestamp: Date.now() - 1000 * 60 * 60 * 45,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user11",
    senderName: "Olivia Wilson",
    text: "We've been announced as finalists! Presentation is in 30 minutes",
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    reactions: [
      {
        emoji: "👍",
        userId: "user12",
        timestamp: Date.now() - 1000 * 60 * 60 * 35.9,
      },
      {
        emoji: "❤️",
        userId: "user13",
        timestamp: Date.now() - 1000 * 60 * 60 * 35.8,
      },
      {
        emoji: "❤️",
        userId: "user14",
        timestamp: Date.now() - 1000 * 60 * 60 * 35.7,
      },
    ],
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat6,
    senderId: "user11",
    senderName: "Olivia Wilson",
    text: "We won first place! 🏆 Celebratory lunch tomorrow?",
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    reactions: [
      {
        emoji: "👍",
        userId: "user12",
        timestamp: Date.now() - 1000 * 60 * 60 * 23.9,
      },
      {
        emoji: "👍",
        userId: "user13",
        timestamp: Date.now() - 1000 * 60 * 60 * 23.8,
      },
      {
        emoji: "👍",
        userId: "user14",
        timestamp: Date.now() - 1000 * 60 * 60 * 23.7,
      },
      {
        emoji: "❤️",
        userId: "user1",
        timestamp: Date.now() - 1000 * 60 * 60 * 23.6,
      },
    ],
  },

  // API Integration with replies
  {
    id: "auth-error-msg",
    chatId: chatIds.chat7,
    senderId: "user15",
    senderName: "Liam Scott",
    text: "I'm having trouble with the auth middleware - getting 401 errors",
    timestamp: Date.now() - 1000 * 60 * 60 * 72,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat7,
    senderId: "user16",
    senderName: "Emma Davis",
    text: "Are you passing the token in the Authorization header?",
    timestamp: Date.now() - 1000 * 60 * 60 * 71.9,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat7,
    senderId: "user15",
    senderName: "Liam Scott",
    text: "Yes, but I might be formatting it wrong",
    timestamp: Date.now() - 1000 * 60 * 60 * 71.8,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat7,
    senderId: "user1",
    senderName: "You",
    text: "Make sure you're using 'Bearer ' prefix before the token",
    timestamp: Date.now() - 1000 * 60 * 60 * 71.7,
    status: "read",
    replyToId: "auth-error-msg",
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat7,
    senderId: "user15",
    senderName: "Liam Scott",
    text: "That was it! I forgot the Bearer prefix. Thanks!",
    timestamp: Date.now() - 1000 * 60 * 60 * 71.6,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat7,
    senderId: "user1",
    senderName: "You",
    text: "The authentication middleware is now working correctly",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 2,
    status: "read",
  },

  // Design System with media files
  {
    id: "design-system-start",
    chatId: chatIds.chat8,
    senderId: "user17",
    senderName: "Isabella Martinez",
    text: "Everyone, we need to standardize our design system. Too many inconsistent components in the app",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    pinned: true,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat8,
    senderId: "user18",
    senderName: "James Wilson",
    text: "I've started documenting the current state - here's what I found",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 4,
    media: {
      type: "file",
      url: "#",
      name: "design-audit.pdf",
      size: 7850000,
    },
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat8,
    senderId: "user17",
    senderName: "Isabella Martinez",
    text: "I created a Figma library with all our components",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 3,
    media: {
      type: "file",
      url: "#",
      name: "design-system-v1.fig",
      size: 12500000,
    },
  },

  // Forwarded message in the Conference Planning group
  {
    id: "conference-important",
    chatId: chatIds.chat10,
    senderId: "user20",
    senderName: "Daniel Thomas",
    text: "The tech conference planning is in full swing. We need to finalize speakers by Friday",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 7,
    pinned: true,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat10,
    senderId: "user21",
    senderName: "Ava Robinson",
    text: "I've contacted all the potential speakers - here's their availability",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 6,
    media: {
      type: "file",
      url: "#",
      name: "speaker-availability.xlsx",
      size: 2340000,
    },
    isSaved: true,
    savedAt: Date.now() - 1000 * 60 * 60 * 24 * 5.9,
  },
  {
    id: uuidv4(),
    chatId: chatIds.chat10,
    senderId: "user23",
    senderName: "Grace Hall",
    text: "The speaker list has been finalized - check the spreadsheet",
    timestamp: Date.now() - 1000 * 60 * 60 * 24 * 5,
    forwardedFrom: {
      chatId: "chat-organizers",
      chatName: "Conference Organizers",
      messageId: "original-schedule-msg",
      senderName: "Conference Committee",
    },
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
    name: "John Smith",
    status: "At the gym",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60 * 2,
    isOnline: false,
  },
  {
    id: "user5",
    name: "Emma Parker",
    status: "At work",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 15,
    isOnline: true,
  },
  {
    id: "user6",
    name: "Sarah Johnson",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 5,
    isOnline: true,
  },
  {
    id: "user7",
    name: "Maya Rodriguez",
    status: "On vacation",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60 * 24 * 3,
    isOnline: false,
  },
  {
    id: "user8",
    name: "David Kim",
    status: "Coding",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 180,
    isOnline: false,
  },
  {
    id: "user9",
    name: "Priya Patel",
    status: "At work",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 30,
    isOnline: true,
  },
  {
    id: "user10",
    name: "Michael Chen",
    status: "In transit",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 45,
    isOnline: true,
  },
  {
    id: "user11",
    name: "Olivia Wilson",
    status: "Do not disturb",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 120,
    isOnline: false,
  },
  {
    id: "user12",
    name: "Ethan Brown",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 25,
    isOnline: true,
  },
  {
    id: "user13",
    name: "Sophie Lee",
    status: "Working from home",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 10,
    isOnline: true,
  },
  {
    id: "user14",
    name: "Noah Garcia",
    status: "In a meeting",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 15,
    isOnline: true,
  },
  {
    id: "user15",
    name: "Liam Scott",
    status: "Busy",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 60,
    isOnline: false,
  },
  {
    id: "user16",
    name: "Emma Davis",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now(),
    isOnline: true,
  },
  {
    id: "user17",
    name: "Isabella Martinez",
    status: "In a design review",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 45,
    isOnline: true,
  },
  {
    id: "user18",
    name: "James Wilson",
    status: "Away",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 120,
    isOnline: false,
  },
  {
    id: "user19",
    name: "Jessica Parker",
    status: "At a coffee shop",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 30,
    isOnline: true,
  },
  {
    id: "user20",
    name: "Daniel Thomas",
    status: "Planning conference",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 15,
    isOnline: true,
  },
  {
    id: "user21",
    name: "Ava Robinson",
    status: "On a call",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 5,
    isOnline: true,
  },
  {
    id: "user22",
    name: "William Clark",
    status: "Available",
    avatar: undefined,
    lastSeen: Date.now(),
    isOnline: true,
  },
  {
    id: "user23",
    name: "Grace Hall",
    status: "Taking notes",
    avatar: undefined,
    lastSeen: Date.now() - 1000 * 60 * 10,
    isOnline: true,
  },
];

// Mark the first chat as being selected by default
localStorage.setItem(`pinned_message_${chatIds.chat1}`, "pinned-msg-1");

// Mark important messages as pinned
localStorage.setItem(`pinned_message_${chatIds.chat4}`, "ux-pinned-msg");
localStorage.setItem(`pinned_message_${chatIds.chat8}`, "design-system-start");
localStorage.setItem(
  `pinned_message_${chatIds.chat10}`,
  "conference-important"
);

/**
 * Pre-defined message summaries for long messages
 */
export const mockMessageSummaries: Record<string, string> = {
  "auth-error-msg":
    "Discussion about authentication middleware issues and Bearer token configuration.",
  "design-system-start":
    "Discussion about standardizing the design system to improve consistency across the app.",
  "ux-pinned-msg":
    "Overview of user testing process for the new checkout flow and key findings.",
  "conference-important":
    "Information about tech conference planning and speaker selection deadline.",
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

  // Added smart replies for our new mock messages
  "I've fixed that accessibility issue on the dropdown component": [
    "Great work!",
    "Can you walk me through the changes?",
    "Any other accessibility issues we should address?",
  ],
  "I've attached a few examples of animation libraries we could use": [
    "These look promising",
    "Which one do you recommend?",
    "Thanks, I'll review them",
  ],
  "Let me know when we can discuss the feedback from the client": [
    "How about tomorrow morning?",
    "I'm free this afternoon",
    "Can you summarize the key points first?",
  ],
  "We won first place! 🏆 Celebratory lunch tomorrow?": [
    "Congratulations! I'm in",
    "Where are we thinking of going?",
    "What time works for everyone?",
  ],
  "The authentication middleware is now working correctly": [
    "Excellent! Were there any tricky issues?",
    "Great, let's add tests for it",
    "Did you document the solution for the team?",
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
