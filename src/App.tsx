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

// Import mock data
import mockChats from "./mocks/chats.json";
import mockMessages from "./mocks/messages.json";

function App() {
  // Theme state
  const [mode, setMode] = useState<"light" | "dark">("light");
  const theme = useMemo(() => getTheme(mode), [mode]);

  // Responsive drawer
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
  const [drawerOpen, setDrawerOpen] = useState(!isSmallScreen);

  // Calculate drawer width
  const drawerWidth = 320;

  // Chat state
  const [chats, setChats] = useState<IChat[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | undefined>(
    undefined
  );

  // Load mock data
  useEffect(() => {
    // Check for muted chats in localStorage
    const mutedChats = localStorage.getItem("mutedChats");
    let mutedChatsArray: string[] = [];

    if (mutedChats) {
      try {
        mutedChatsArray = JSON.parse(mutedChats) as string[];
      } catch (error) {
        console.error("Error parsing muted chats:", error);
      }
    }

    // Apply muted status to chats
    const chatsWithMuteStatus = (mockChats as unknown as IChat[]).map(
      (chat) => ({
        ...chat,
        muted: mutedChatsArray.includes(chat.id),
      })
    );

    setChats(chatsWithMuteStatus);
    setMessages(mockMessages as unknown as IMessage[]);

    // Select the first chat by default if available
    if (mockChats.length > 0 && !selectedChatId) {
      setSelectedChatId(mockChats[0].id);
    }
  }, [selectedChatId]);

  // Filter messages for the selected chat
  const selectedChatMessages = useMemo(() => {
    return messages.filter((message) => message.chatId === selectedChatId);
  }, [messages, selectedChatId]);

  // Find the selected chat
  const selectedChat = useMemo(() => {
    return chats.find((chat) => chat.id === selectedChatId);
  }, [chats, selectedChatId]);

  // Toggle theme
  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  // Handle send message
  const handleSendMessage = (text: string, media?: IMediaAttachment) => {
    if (!selectedChatId) return;

    const newMessage: IMessage = {
      id: `msg${Date.now()}`,
      chatId: selectedChatId,
      senderId: "user1", // Current user ID
      senderName: "Jamie Doe", // Current user name
      text,
      timestamp: Date.now(),
      isRead: true,
      ...(media && { media }),
    };

    setMessages((prev) => [...prev, newMessage]);

    // Update the last message in the chat
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === selectedChatId
          ? {
              ...chat,
              lastMessage: media
                ? `${text || ""}${text ? " " : ""}[${media.type}]`
                : text,
              timestamp: Date.now(),
            }
          : chat
      )
    );
  };

  // Handle select chat
  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);

    // Close drawer on mobile after selecting a chat
    if (isSmallScreen) {
      setDrawerOpen(false);
    }

    // Mark messages as read
    setMessages((prev) =>
      prev.map((message) =>
        message.chatId === chatId ? { ...message, isRead: true } : message
      )
    );

    // Reset unread count
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, unreadCount: 0 } : chat
      )
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

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* App Bar */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
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

          <ThemeSwitcher toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          overflow: "hidden",
          pt: { xs: "56px", sm: "64px" },
        }}
      >
        {/* Sidebar / Chat List - Permanent on large screens, temporary on small screens */}
        {isSmallScreen ? (
          // Mobile drawer (temporary)
          <Drawer
            variant="temporary"
            open={drawerOpen}
            onClose={toggleDrawer}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
            />
          </Drawer>
        ) : (
          // Desktop drawer (permanent)
          <Drawer
            variant="permanent"
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: drawerWidth,
                boxSizing: "border-box",
                position: "relative",
                height: "100%",
              },
            }}
          >
            <ChatList
              chats={chats}
              selectedChatId={selectedChatId}
              onSelectChat={handleSelectChat}
            />
          </Drawer>
        )}

        {/* Main Content / Chat Window */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            height: "100%",
            position: "relative",
          }}
        >
          <ChatWindow
            selectedChat={selectedChat}
            messages={selectedChatMessages}
            onSendMessage={handleSendMessage}
            onMuteToggle={handleMuteToggle}
          />
        </Box>
      </Box>
    </ThemeProvider>
  );
}

export default App;
