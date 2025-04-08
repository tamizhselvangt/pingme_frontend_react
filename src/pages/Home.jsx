import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
import axios from 'axios';
import { 
  Box, 
  Drawer, 
  AppBar, 
  Toolbar, 
  Typography, 
  List, 
  ListItem, 
  ListItemAvatar, 
  ListItemText, 
  Avatar, 
  IconButton, 
  TextField, 
  Badge, 
  Tabs, 
  Tab, 
  Divider,
  Menu,
  MenuItem,
  Paper,
  InputAdornment
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  Mic as MicIcon,
  Search as SearchIcon,
  AccountCircle as AccountCircleIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Business as BusinessIcon,
  Campaign as CampaignIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { 
    contacts, 
    messages, 
    activeChat, 
    setActiveChat, 
    activeTab, 
    setActiveTab, 
    notices, 
    searchQuery, 
    setSearchQuery,
    sendMessage
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNotices, setShowNotices] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
  };

  const handleFileUpload = () => {
    // Mock file upload
    const file = { name: 'document.pdf', size: '1.2MB' };
    sendMessage('', file);
  };

  const handleVoiceRecord = () => {
    // Mock voice recording
    const voice = { duration: '0:30', url: 'voice-message.mp3' };
    sendMessage('', null, voice);
  };

  const renderContacts = () => {
    if (activeTab === 'noticeboard') {
      return (
        <List>
          {notices.map((notice) => (
            <ListItem 
              key={notice.id} 
              button 
              onClick={() => setShowNotices(true)}
              sx={{ 
                borderLeft: '4px solid',
                borderColor: 'primary.main',
                mb: 1
              }}
            >
              <ListItemText 
                primary={notice.title} 
                secondary={`${notice.date} - ${notice.author}`} 
              />
            </ListItem>
          ))}
        </List>
      );
    }

    return (
      <List>
        {contacts.map((contact) => (
          <ListItem 
            key={contact.id} 
            button 
            selected={activeChat === contact.id}
            onClick={() => setActiveChat(contact.id)}
          >
            <ListItemAvatar>
              <Badge 
                color={contact.status === 'online' ? 'success' : 'default'} 
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              >
                <Avatar src={contact.avatar} alt={contact.name} />
              </Badge>
            </ListItemAvatar>
            <ListItemText 
              primary={contact.name} 
              secondary={contact.members ? `${contact.members} members` : contact.status} 
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderMessages = () => {
    if (!activeChat) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
          <Typography variant="h6" color="text.secondary">
            Select a conversation to start chatting
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
          {messages.map((message) => {
            const isOwnMessage = message.sender === currentUser?.id;
            return (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                  mb: 2,
                }}
              >
                <Paper
                  sx={{
                    p: 2,
                    maxWidth: '70%',
                    bgcolor: isOwnMessage ? 'primary.main' : 'grey.100',
                    color: isOwnMessage ? 'white' : 'text.primary',
                  }}
                >
                  {message.text && <Typography>{message.text}</Typography>}
                  {message.file && (
                    <Box sx={{ mt: 1 }}>
                      <AttachFileIcon fontSize="small" />
                      <Typography variant="body2">{message.file.name}</Typography>
                    </Box>
                  )}
                  {message.voice && (
                    <Box sx={{ mt: 1 }}>
                      <MicIcon fontSize="small" />
                      <Typography variant="body2">{message.voice.duration}</Typography>
                    </Box>
                  )}
                  <Typography variant="caption" sx={{ display: 'block', mt: 1, opacity: 0.7 }}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Paper>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
        
        <Box component="form" onSubmit={handleSendMessage} sx={{ p: 2, bgcolor: 'background.paper' }}>
          <TextField
            fullWidth
            placeholder="Type a message"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleFileUpload}>
                    <AttachFileIcon />
                  </IconButton>
                  <IconButton onClick={handleVoiceRecord}>
                    <MicIcon />
                  </IconButton>
                  <IconButton type="submit" color="primary">
                    <SendIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      </Box>
    );
  };

  const renderNotices = () => {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Notices
        </Typography>
        <List>
          {notices.map((notice) => (
            <Paper key={notice.id} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6">{notice.title}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {new Date(notice.date).toLocaleDateString()} - {notice.author}
              </Typography>
              <Typography>{notice.content}</Typography>
            </Paper>
          ))}
        </List>
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: 320,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 320,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <TextField
            fullWidth
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab icon={<PersonIcon />} label="Personal" value="personal" />
          <Tab icon={<BusinessIcon />} label="Department" value="department" />
          <Tab icon={<GroupIcon />} label="Groups" value="groups" />
          <Tab icon={<CampaignIcon />} label="Notices" value="noticeboard" />
        </Tabs>
        
        {renderContacts()}
      </Drawer>
      
      {/* Main content */}
      <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <AppBar position="static" color="default" elevation={1}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {activeChat ? contacts.find(c => c.id === activeChat)?.name : 'Chat'}
            </Typography>
            <IconButton onClick={() => setShowNotices(true)}>
              <NotificationsIcon />
            </IconButton>
            <IconButton onClick={handleProfileMenuOpen}>
              <AccountCircleIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        
        {renderMessages()}
      </Box>
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemAvatar>
            <Avatar src={currentUser?.photoURL} alt={currentUser?.name} />
          </ListItemAvatar>
          <ListItemText 
            primary={currentUser?.name} 
            secondary={currentUser?.email} 
          />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
      
      {/* Notices drawer */}
      <Drawer
        anchor="right"
        open={showNotices}
        onClose={() => setShowNotices(false)}
      >
        {renderNotices()}
      </Drawer>
    </Box>
  );
};

export default Home; 
