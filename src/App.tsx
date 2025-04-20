import { useState, useMemo, useEffect } from "react";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  Drawer,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import getTheme from "./theme";
import ChatList from "./components/ChatList";
import ChatWindow from "./components/ChatWindow";
import ThemeSwitcher from "./components/ThemeSwitcher";
import { IChat } from "./types/chat";
import { IMessage, IMediaAttachment } from "./types/message";
import "./styles/global.css";
import { v4 as uuidv4 } from "uuid";
import { mockChats, mockMessages, mockUsers } from "./mockData";
import { BackgroundType } from "./components/ChatBackground";
import ProfileSettings from "./components/ProfileSettings";
import { IUser } from "./types/user";
import DirectMessageButton from "./components/DirectMessageButton";
import logo from "./assets/logo.png";
import SearchResults from "./components/SearchResults";
import NameDialog from "./components/NameDialog";

function App() {
  // Theme state
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(() => {
    // Check localStorage first, fallback to system preference
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode === "light" || savedMode === "dark") {
      return savedMode;
    }
    return prefersDarkMode ? "dark" : "light";
  });
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Name dialog state
  const [showNameDialog, setShowNameDialog] = useState(false);

  // Chat background state
  const [chatBackground, setChatBackground] = useState<BackgroundType>("solid");

  // Responsive drawer
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isSmallScreen);

  const isXlScreen = useMediaQuery(theme.breakpoints.up("xl"));
  const isLgScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const isMdScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Calculate drawer width based on screen size
  const drawerWidth = isXlScreen
    ? 420
    : isLgScreen
    ? 420
    : isMdScreen
    ? 350
    : 320;

  // Chat state
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedChat, setSelectedChat] = useState<IChat | undefined>(
    undefined
  );
  const [highlightedMessageId, setHighlightedMessageId] = useState<
    string | undefined
  >(undefined);
  const [searchQuery, setSearchQuery] = useState("");

  // User profile state
  const [currentUser, setCurrentUser] = useState<IUser>(mockUsers[0]);

  // Add new state for search UI
  const [searchOpen, setSearchOpen] = useState(false);

  // Load mock data and check for username
  useEffect(() => {
    // Initialize with mock data
    setChats(mockChats);
    setMessages(mockMessages);
    // Set first chat as selected by default
    if (mockChats.length > 0) {
      setSelectedChat(mockChats[0]);
    }

    // Check if username exists in localStorage
    const userName = localStorage.getItem("userName");
    if (!userName) {
      setShowNameDialog(true);
    }
  }, []);

  // Filter messages for the selected chat
  const selectedChatMessages = useMemo(() => {
    return selectedChat
      ? messages.filter((message) => message.chatId === selectedChat.id)
      : [];
  }, [selectedChat, messages]);

  // Toggle theme
  const handleThemeToggle = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "light" ? "dark" : "light";
      // Save to localStorage
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Handle background change
  const handleChangeBackground = (background: BackgroundType) => {
    setChatBackground(background);
  };

  // Handle send message
  const handleSendMessage = (
    text: string,
    media?: IMediaAttachment,
    replyToId?: string
  ) => {
    if (!selectedChat) return;

    const newMessage: IMessage = {
      id: uuidv4(),
      chatId: selectedChat.id,
      senderId: "user1", // Current user ID
      senderName: "You",
      text,
      timestamp: Date.now(),
      ...(media && { media }),
      ...(replyToId && { replyToId }),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update the last message in the chat
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChat.id
          ? {
              ...chat,
              lastMessage: {
                text: media ? "Media" : text.substring(0, 30),
                timestamp: Date.now(),
              },
              unreadCount: 0,
            }
          : chat
      )
    );
  };

  // Enhanced select chat function to handle highlighted messages
  const handleSelectChat = (chat: IChat, messageId?: string) => {
    setSelectedChat(chat);
    setHighlightedMessageId(messageId);

    // Clear the highlight after a short delay
    if (messageId) {
      setTimeout(() => {
        setHighlightedMessageId(undefined);
      }, 3000); // Clear highlight after 3 seconds
    }

    // Close drawer on mobile after selecting a chat
    if (isSmallScreen) {
      setDrawerOpen(false);
    }

    // Mark messages as read
    setMessages((prev) =>
      prev.map((message) =>
        message.chatId === chat.id ? { ...message, isRead: true } : message
      )
    );

    // Reset unread count
    setChats((prev) =>
      prev.map((c) => (c.id === chat.id ? { ...c, unreadCount: 0 } : c))
    );
  };

  // Toggle drawer
  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  // Handle mute toggle
  const handleMuteToggle = (chatId: string, muted: boolean) => {
    // Update chat's muted status
    setChats((prev) =>
      prev.map((chat) => (chat.id === chatId ? { ...chat, muted } : chat))
    );
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim()) {
      setSearchOpen(true);
    } else {
      setSearchOpen(false);
      setHighlightedMessageId(undefined);
    }
  };

  // Clear search query
  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchOpen(false);
    setHighlightedMessageId(undefined);
  };

  // Close search results
  const handleCloseSearch = () => {
    setSearchOpen(false);
  };

  // Handle selecting a search result
  const handleSelectSearchResult = (messageId: string, chatId: string) => {
    // Find the chat
    const chat = chats.find((c) => c.id === chatId);

    if (chat) {
      // Set the active chat
      handleSelectChat(chat);

      // Highlight the message
      setHighlightedMessageId(messageId);

      // Close search results (optional, can keep open if preferred)
      setSearchOpen(false);
    }
  };

  const handleForwardMessage = (messageId: string, targetChatId: string) => {
    const originalMessage = messages.find((msg) => msg.id === messageId);
    if (!originalMessage) return;

    const sourceChat = chats.find((chat) => chat.id === originalMessage.chatId);
    const targetChat = chats.find((chat) => chat.id === targetChatId);

    if (!sourceChat || !targetChat) return;

    // Create new forwarded message
    const forwardedMessage: IMessage = {
      id: uuidv4(),
      chatId: targetChatId,
      senderId: "user1", // Current user ID
      senderName: "You",
      text: originalMessage.text,
      timestamp: Date.now(),
      ...(originalMessage.media && { media: originalMessage.media }),
      forwardedFrom: {
        chatId: originalMessage.chatId,
        chatName: sourceChat.groupName,
        messageId: originalMessage.id,
        senderName: originalMessage.senderName,
      },
    };

    // Add message to state
    setMessages((prevMessages) => [...prevMessages, forwardedMessage]);

    // Update last message in target chat
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === targetChatId
          ? {
              ...chat,
              lastMessage: {
                text: `Forwarded: ${originalMessage.text.substring(0, 25)}...`,
                timestamp: Date.now(),
              },
              unreadCount:
                selectedChat?.id !== targetChatId
                  ? (chat.unreadCount || 0) + 1
                  : 0,
            }
          : chat
      )
    );
  };

  const handleSaveMessage = (messageId: string, isSaved: boolean) => {
    setMessages((prevMessages) =>
      prevMessages.map((message) =>
        message.id === messageId
          ? {
              ...message,
              isSaved,
              ...(isSaved ? { savedAt: Date.now() } : {}),
            }
          : message
      )
    );
  };

  // Handle user profile update
  const handleUpdateProfile = (updatedUser: IUser) => {
    setCurrentUser(updatedUser);
    // In a real app, this would be saved to a backend
    console.log("User profile updated:", updatedUser);
  };

  // Handle creating new chats
  const handleCreateChat = (newChat: IChat) => {
    // Check if a chat with the same participants already exists
    const existingChatIndex = chats.findIndex(
      (chat) =>
        chat.type === newChat.type &&
        chat.type === "individual" &&
        chat.participants.every((p) => newChat.participants.includes(p)) &&
        newChat.participants.every((p) => chat.participants.includes(p))
    );

    if (existingChatIndex >= 0) {
      // If the chat already exists, update its timestamp to make it appear at the top
      const updatedChats = [...chats];
      const existingChat = {
        ...updatedChats[existingChatIndex],
        timestamp: Date.now(),
        lastMessage: {
          ...updatedChats[existingChatIndex].lastMessage,
          timestamp: Date.now(),
        },
      };

      updatedChats[existingChatIndex] = existingChat;
      setChats(updatedChats);

      // Select the chat
      handleSelectChat(existingChat);
    } else {
      // Make sure new chat has the current timestamp
      const timestampedChat = {
        ...newChat,
        timestamp: Date.now(),
        lastMessage: {
          ...newChat.lastMessage,
          timestamp: Date.now(),
        },
      };

      // Add the new chat
      setChats((prev) => [timestampedChat, ...prev]);

      // Select the newly created chat
      handleSelectChat(timestampedChat);
    }
  };

  // Handle user name submission
  const handleNameSubmit = (name: string) => {
    localStorage.setItem("userName", name);
    setShowNameDialog(false);

    // Update current user name
    setCurrentUser((prev) => ({
      ...prev,
      name,
    }));
  };

  // Add the handleDeleteMessage handler function
  const handleDeleteMessage = (
    messageId: string,
    deleteType: "me" | "everyone"
  ) => {
    // Get the message first
    const messageToDelete = messages.find((msg) => msg.id === messageId);
    if (!messageToDelete) return;

    if (deleteType === "everyone") {
      // Only the sender can delete for everyone
      if (messageToDelete.senderId === "user1") {
        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            message.id === messageId ? { ...message, isDeleted: true } : message
          )
        );
      }
    } else {
      // Delete for me - either hide it completely or mark as deleted for this user
      setMessages((prevMessages) =>
        prevMessages.map((message) =>
          message.id === messageId
            ? {
                ...message,
                deletedFor: [...(message.deletedFor || []), "user1"],
              }
            : message
        )
      );
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Name Dialog */}
      <NameDialog open={showNameDialog} onSubmit={handleNameSubmit} />

      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{ zIndex: theme.zIndex.drawer + 1, borderRadius: 0 }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            {drawerOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Avatar
              src={logo}
              alt="ChatSphere Logo"
              sx={{
                width: 36,
                height: 36,
                mr: 1,
                bgcolor: "background.paper",
              }}
            />
            <Typography variant="h6" component="div">
              ChatSphere
            </Typography>
          </Box>

          <ProfileSettings
            currentUser={currentUser}
            onUpdateProfile={handleUpdateProfile}
          />

          <ThemeSwitcher
            toggleTheme={handleThemeToggle}
            currentBackground={chatBackground}
            onChangeBackground={handleChangeBackground}
          />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
        }}
      >
        {/* Chat List Drawer */}
        <Drawer
          variant={isSmallScreen ? "temporary" : "permanent"}
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Toolbar />
          {searchOpen ? (
            <SearchResults
              searchQuery={searchQuery}
              onClose={handleCloseSearch}
              chats={chats}
              messages={messages}
              onSelectResult={handleSelectSearchResult}
              onClearSearch={handleClearSearch}
              onUpdateQuery={setSearchQuery}
            />
          ) : (
            <ChatList
              chats={chats}
              onSelectChat={handleSelectChat}
              selectedChat={selectedChat}
              onSearch={handleSearch}
              searchQuery={searchQuery}
              onCreateChat={handleCreateChat}
            />
          )}
        </Drawer>

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            pt: { xs: 7, sm: 8 }, // Account for app bar
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            height: "100vh",
            overflow: "hidden",
            position: "relative",
            bgcolor: "background.default",
          }}
        >
          <ChatWindow
            selectedChat={selectedChat}
            messages={selectedChatMessages}
            allChats={chats}
            onSendMessage={handleSendMessage}
            onMuteToggle={handleMuteToggle}
            highlightedMessageId={highlightedMessageId}
            onForwardMessage={handleForwardMessage}
            onSaveMessage={handleSaveMessage}
            onDeleteMessage={handleDeleteMessage}
            onSetActiveChat={(chatId) => {
              const chat = chats.find((c) => c.id === chatId);
              if (chat) {
                handleSelectChat(chat);
              }
            }}
            backgroundType={chatBackground}
            onHighlightMessage={(messageId) => {
              setHighlightedMessageId(messageId);
              // Clear the highlight after a short delay
              setTimeout(() => {
                setHighlightedMessageId(undefined);
              }, 3000);
            }}
            onCreateDirectChat={(userId) => {
              // Find the user to create chat with
              const user = mockUsers.find((user) => user.id === userId);
              if (user) {
                const newChat: IChat = {
                  id: `new-chat-${Date.now()}`,
                  type: "individual",
                  groupName: user.name,
                  participants: ["user1", userId],
                  timestamp: Date.now(),
                  lastMessage: {
                    text: "Start a conversation",
                    timestamp: Date.now(),
                  },
                  unreadCount: 0,
                  members: [
                    { id: "user1", name: "You" },
                    { id: userId, name: user.name },
                  ],
                  avatar: user.avatar,
                };
                handleCreateChat(newChat);
              }
            }}
          />

          {/* Add Direct Message Button */}
          <DirectMessageButton
            users={mockUsers.filter((user) => user.id !== currentUser.id)}
            onCreateChat={handleCreateChat}
            currentChats={chats}
            currentUserId={currentUser.id}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
