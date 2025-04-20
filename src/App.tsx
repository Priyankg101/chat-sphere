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

function App() {
  // Theme state
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">(
    prefersDarkMode ? "dark" : "light"
  );
  const theme = useMemo(() => getTheme(mode), [mode]);

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

  // Load mock data
  useEffect(() => {
    // Initialize with mock data
    setChats(mockChats);
    setMessages(mockMessages);
    // Set first chat as selected by default
    if (mockChats.length > 0) {
      setSelectedChat(mockChats[0]);
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
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
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

    if (query && selectedChat) {
      // Find first message matching query
      const matchingMessage = messages.find(
        (msg) =>
          msg.chatId === selectedChat.id &&
          msg.text.toLowerCase().includes(query.toLowerCase())
      );

      if (matchingMessage) {
        setHighlightedMessageId(matchingMessage.id);
      } else {
        setHighlightedMessageId(undefined);
      }
    } else {
      setHighlightedMessageId(undefined);
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

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

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Chat Sphere
          </Typography>

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
          <ChatList
            chats={chats}
            onSelectChat={handleSelectChat}
            selectedChat={selectedChat}
            onSearch={handleSearch}
            searchQuery={searchQuery}
            onCreateChat={handleCreateChat}
          />
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
