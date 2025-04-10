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
  InputAdornment,
  Button,
  Stack
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
  Logout as LogoutIcon,
  Close as CloseIcon,
  Chat as ChatIcon
} from '@mui/icons-material';
import { PiUserListDuotone } from "react-icons/pi";
import { BsLayoutSidebarInsetReverse } from "react-icons/bs";
import { HiOutlineUser } from "react-icons/hi2";
import { TbMessageFilled } from "react-icons/tb";
import { TbBuildingBridge2 } from "react-icons/tb";
import { GrGroup } from "react-icons/gr";
import { IoIosSend } from "react-icons/io";
import { PiNotificationDuotone } from "react-icons/pi";
import { PiWaveformBold } from "react-icons/pi";
import { CgAttachment } from "react-icons/cg";
import { LuUserRoundSearch } from "react-icons/lu";

const Home = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const { 
    contacts, 
    messages, 
    activeChatId, 
    setActiveChatId, 
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
    if (e) e.preventDefault();
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
                mb: 1,
                borderRadius: 1,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.07)'
                }
              }}
            >
              <ListItemText 
                primary={notice.title} 
                secondary={`${notice.date} - ${notice.author}`}
                primaryTypographyProps={{ color: 'white' }}
                secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
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
            button={true}
            selected={activeChatId === contact.id}
            onClick={() => setActiveChatId(contact.id)}
            sx={{
              borderRadius: 1,
              '&.Mui-selected': {
                bgcolor: 'rgba(25, 118, 210, 0.2)',
                '&:hover': {
                  bgcolor: 'rgba(25, 118, 210, 0.3)'
                }
              },
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.07)'
              }
            }}
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
              primaryTypographyProps={{ color: 'white' }}
              secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
            />
          </ListItem>
        ))}
      </List>
    );
  };

  const renderMessages = () => {
    if (!activeChatId) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'rgba(255,255,255,0.5)',
          bgcolor: '#FCFBFC',
         }}> 
          <Box sx={{ textAlign: 'center' }}>
            {/* <ChatIcon sx={{ fontSize: 60, mb: 2, opacity: 0.5 , color: 'rgba(30, 30, 30, 0.64)' }} /> */}
            <TbMessageFilled style={{ fontSize: 80, mb: 2, opacity: 0.5 , color: 'rgba(30, 30, 30, 0.64)' }}/>
            <Typography variant="h6" sx={{ color: 'rgba(30, 30, 30, 0.64)' }}>
              Select a conversation to start chatting
            </Typography>
          </Box>
        </Box>
      );
    }

    return (
      <Box
      elevation={4}
      sx={{ display: 'flex', flexDirection: 'column', height: '100%',
          overflowX: 'auto',
          bgcolor: '#FCFBFC',
          borderLeft: '2px solid rgba(154, 154, 154, 0.3)',
          borderRight: '2px solid rgba(154, 154, 154, 0.3)',
          }}>
        <Box sx={{
              flexGrow: 1, overflow: 'auto',
              p: 2,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': {
               display: 'none',
               },
              '-ms-overflow-style': 'none', // for Internet Explorer and Edge
              'scrollbar-width': 'none', // for Firefox
         }}>
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
                    borderRadius: 2,
                    bgcolor: isOwnMessage ? 'primary.main' : 'rgba(255,255,255,0.1)',
                    color: 'black',
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
        
        <Box component="form" onSubmit={handleSendMessage}
        elevation={4} sx={{ 
          bgcolor: 'transparent',
          position: 'sticky',
         }}>
          <Paper
          elevation={4}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: '#FEFEFE',
            elavation: 4
          }}>
            <IconButton onClick={handleFileUpload} sx={{ color: 'rgba(18, 17, 17, 0.7)' }}>
            <CgAttachment />
            </IconButton>
            <TextField
              fullWidth
              placeholder="Type a message"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              variant="standard"
              InputProps={{
                disableUnderline: true,
                style: { color: 'black', paddingLeft: '8px' }
              }}
              sx={{ mx: 1 }}
            />
            <IconButton onClick={handleVoiceRecord} sx={{ color: 'rgba(68, 68, 68, 0.75)' }}>
               <PiWaveformBold />
            </IconButton>
            <IconButton 
              onClick={handleSendMessage} 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'black',
                '&:hover': { bgcolor: 'primary.dark' },
                ml: 1
              }}
            >
              <IoIosSend />
            </IconButton>
          </Paper>
        </Box>
      </Box>
    );
  };

  const renderNotices = () => {
    return (
        <Box sx={{ p: 3, color: 'white' }}>
      <Typography variant="h5" gutterBottom>
          Notices
        </Typography>
        <List>
          {notices.map((notice) => (
            <Paper key={notice.id} sx={{ p: 2, mb: 2, bgcolor: '#37353F', color: 'white', borderRadius: 5 }}>
              <Typography variant="h6">{notice.title}</Typography>
              <Typography variant="body2" color="rgba(255,255,255,0.6)" gutterBottom>
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
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1200,
      display: 'flex', 
      height: '100vh', 
      bgcolor: '#18181A',
      pt: 2,   // padding-top
      pr: 2,   // padding-right
      pb: 2,   // padding-bottom
      pl: 0,   // padding-left (set to 0)
      boxSizing: 'border-box'
    }}>
      {/* Sidebar */}
      <Box 
        sx={{
          width: 320,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
        }}
      >
        {/* App Title */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          
          <Typography variant="h5" fontWeight="bold" sx={{ mb: 2, color: 'white' }}>
            Pingme
          </Typography>
          
          {/* Search */}
          <TextField
  fullWidth
  placeholder="Search contacts..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  InputProps={{
    style: { color: 'white', paddingLeft: '8px',
      height: 40,
     },
    startAdornment: (
      <InputAdornment position="start">
        <LuUserRoundSearch style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', marginLeft: '10px' }} />
      </InputAdornment>
    ),
  }}
  sx={{
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255,255,255,0.1)',
      borderRadius: 30,
      color: 'black',
      '&:hover .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.3)',
      },
      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: 'primary.main',
      },
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.2)',
      },
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255,255,255,0.7)',
    },
  }}
/>

        </Box>

        {/* Horizontally scrollable tabs */}
        <Box 
        sx={{
          p: 2,
          overflowX: 'auto',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // for Internet Explorer and Edge
          'scrollbar-width': 'none', // for Firefox
        }}
        >
          <Button 
            variant={activeTab === 'personal' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('personal')}
            startIcon={<HiOutlineUser />}
            sx={{ mr: 1, borderRadius: 2 , border: 'none', selected: 'none',
               textTransform: 'none'
            }}
          >
            <Typography  sx={{ color: 'white' }}>
            Personal
            </Typography>

          </Button>
          <Button 
            variant={activeTab === 'department' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('department')}
            startIcon={<TbBuildingBridge2 />}
            sx={{ mr: 1, borderRadius: 2, border: 'none',
               textTransform: 'none'
            }}
          >
            Department
          </Button>
          <Button 
            variant={activeTab === 'groups' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('groups')}
            startIcon={<GrGroup />}
            sx={{ mr: 1, borderRadius: 2 , border: 'none',
               textTransform: 'none'
            }}
          >
            Groups
          </Button>
          <Button 
            variant={activeTab === 'noticeboard' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('noticeboard')}
            startIcon={<PiNotificationDuotone />}
            sx={{ borderRadius: 2 ,border: 'none',
               textTransform: 'none'
            }}
          >
            Notices
          </Button>
        </Box>
        
        {/* Contacts list - scrollable area */}
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto',
          px: 1,
          borderTop: '1px solid rgba(255,255,255,0.1)',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          whiteSpace: 'nowrap',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
          '-ms-overflow-style': 'none', // for Internet Explorer and Edge
          'scrollbar-width': 'none', // for Firefox
        }}>
          {renderContacts()}
        </Box>
        
        {/* Logout button at bottom */}
        <Box sx={{ p: 2 }}>
          <Button 
            fullWidth 
            variant="outlined" 
            color="error" 
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ borderRadius: 2 }}
          >
            Logout
          </Button>
        </Box>
      </Box>
      
      {/* Main chat area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 6,
        overflow: 'hidden',
      }}>
        {/* Chat header */}
        <Box sx={{ 
          p: 2, 
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '2px solid rgba(187, 187, 187, 0.22)',
          bgcolor: '#FEFEFE',
        }}>
          {activeChatId && (
            <Avatar 
              src={contacts.find(c => c.id === activeChatId)?.avatar} 
              alt={contacts.find(c => c.id === activeChatId)?.name}
              sx={{ mr: 2 }}
            />
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' ,fontFamily: 'GeneralSans-SemiBold' }}>
            {activeChatId ? contacts.find(c => c.id === activeChatId)?.name : 'Select a chat'}
          </Typography>

          <IconButton sx={{ color: 'black' }} onClick={handleProfileMenuOpen}>
          <PiUserListDuotone />
          </IconButton>
          <IconButton sx={{ color: 'black', fontSize: '20px' }} onClick={() => setShowNotices(true)}>
          <BsLayoutSidebarInsetReverse />
          </IconButton>
      
        </Box>
        
        {/* Messages area */}
        {renderMessages()}
      </Box>
      
      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { bgcolor: '#FBFDFD', color: 'black' }
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <ListItemAvatar>
            <Avatar src={currentUser?.photoURL} alt={currentUser?.name} />
          </ListItemAvatar>
          <ListItemText 
            primary={currentUser?.name} 
            secondary={currentUser?.email}
            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.7)' }}
          />
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 1, color: 'error.main' }} />
          <Typography color="error">Logout</Typography>
        </MenuItem>
      </Menu>
      
      {/* Notices drawer */}
      <Drawer
        anchor="right"
        open={showNotices}
        onClose={() => setShowNotices(false)}
        sx={{
          borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
        }}
        PaperProps={{
          sx: { bgcolor: '#1D1D1F', color: 'white', width: 320, borderRadius: 5 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)',
         }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Notifications</Typography>
          <IconButton sx={{ color: 'black' }} onClick={() => setShowNotices(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderNotices()}
      </Drawer>
    </Box>
  );
};

export default Home;
