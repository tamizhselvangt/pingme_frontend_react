import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useChat } from '../context/ChatContext';
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
  Stack,
  useMediaQuery,
  useTheme,
  LinearProgress 
} from '@mui/material';
import {Logout as LogoutIcon, Close as CloseIcon} from '@mui/icons-material';
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
import { BsLayoutSidebarInset } from "react-icons/bs";
import EmojiPickerButton from '../components/EmojiPickerButton';
import { IoCloseCircleOutline } from "react-icons/io5";
import { MdOutlineFilePresent } from "react-icons/md";
import  AudioRecorder  from '../components/AudioRecorder';
import MediaMessage from '../components/MediaMessage';
import { MdOutlineAddReaction } from "react-icons/md";
import { TbLayoutGridAdd } from "react-icons/tb";
import ChatActions from '../components/ChatActions';

const Home = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    sendMessage,
    groups,
    selectedGroupChat,
    setSelectedGroupChat,
    groupMessages,
    setGroupMessages
  } = useChat();
  
  const [messageText, setMessageText] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [showNotices, setShowNotices] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isPrgressShown, setIsPrgressShown] = useState(false); // Default: not uploading
  const messagesEndRef = useRef(null);

  //Voice Recorder Handling
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [recordedAudioFile, setRecordedAudioFile] = useState(null);



  // Check if the window is small on initial load and when window is resized
  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, groupMessages]);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

const getSelectedFileSize = (file) => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (file.size === 0) return '0 Byte';
  const i = parseInt(Math.floor(Math.log(file.size) / Math.log(1024)));
  return Math.round(file.size / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


const truncateFileName = (fileName) => {
  if (fileName.length > 20) {
      const ext = fileName.split('.').pop();
      return `${fileName.slice(0, 25)}... .${ext}`;
  }
  return fileName;
};


  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  var handleSendMessage = (e) => {
    if (e) e.preventDefault();
    if (messageText.trim()) {
      if (selectedFile) {
        sendMessage(messageText, selectedFile);
      } else {
        sendMessage(messageText);
      }
      setMessageText('');
      setSelectedFile(null);
    }
    if(selectedFile) {
      sendMessage('', selectedFile, selectedFile.type);
      setSelectedFile(null);
      setMessageText('');
    }
    if(recordedAudioFile) {
      handleSendAudioMessage();
    }
  };


const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  function isOnlyEmoji(text) {
    const emojiRegex = /^(?:\p{Extended_Pictographic}|\p{Emoji_Presentation}){1,2}$/u;
    return emojiRegex.test(text.trim());
  }


  //Audio Handlings
  const handleRecordingComplete = (file) => {
    setRecordedAudioFile(file);
  };

  const handleSendAudioMessage = () => {
    if (recordedAudioFile) {
      setUploadingAudio(true);
      
      // Mock upload progress - replace with your actual upload logic
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          setUploadingAudio(false);
          
          // Send the message with the audio file
          sendMessage('',recordedAudioFile, recordedAudioFile.type);
          setRecordedAudioFile(null);
          setUploadProgress(0);
        }

      }, 300);
    }
    else if (messageText.trim()) {
      sendMessage(messageText);
      setMessageText('');
    }
    setUploadingAudio(false);
    setRecordedAudioFile(null);
  };
  
  const displayName = () => {
    if (activeTab === 'personal' && activeChatId) {
      return contacts.find(c => c.id === activeChatId)?.name;
    } else if (activeTab === 'department' && selectedGroupChat) {
      return groups.find(g => g.id === selectedGroupChat)?.name;
    }
    return 'Select a chat';
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
    if (activeTab === 'department') {
      return (
        <List>
          {groups.map((group) => (
            <ListItem key={group.id}
              button={true}
              selected={activeChatId === group.id}
              onClick={() => {
                setSelectedGroupChat(group.id);
                if (isMobile) {
                  setSidebarOpen(false);
                }
              }}
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
                <Avatar src={group.avatar} alt={group.name} />
              </ListItemAvatar>
              <ListItemText primary={group.name}  secondary={group.description} 
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
            onClick={() => {
             setActiveChatId(contact.id); 
              if (isMobile) {
                setSidebarOpen(false);
              }
            }}
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
          width: '100%'
         }}> 
          <Box sx={{ textAlign: 'center' }}>
            <TbMessageFilled style={{ fontSize: 80, opacity: 0.5, color: 'rgba(30, 30, 30, 0.64)' }}/>
            <Typography variant="h6" sx={{ color: 'rgba(30, 30, 30, 0.64)' }}>
              Select a conversation to start chatting
            </Typography>
          </Box>
        </Box>
      );
    }
    if (activeTab === 'department' && !selectedGroupChat) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: 'rgba(255,255,255,0.5)',
          bgcolor: '#FCFBFC',
          width: '100%'
         }}> 
          <Box sx={{ textAlign: 'center' }}>
            <TbMessageFilled style={{ fontSize: 80, opacity: 0.5, color: 'rgba(30, 30, 30, 0.64)' }}/>
            <Typography variant="h6" sx={{ color: 'rgba(30, 30, 30, 0.64)' }}>
              Select a conversation to start chatting
            </Typography>
          </Box>
        </Box>
      );
    }

 let currentMessages = [];
 
 if (activeTab === 'department' && selectedGroupChat) {
   currentMessages = groupMessages;
 }
 else{
   currentMessages = messages;
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
          {currentMessages.map((message) => {
            const isOwnMessage = message.sender === currentUser?.id;
            return (
              <Box
                display="flex"
                alignItems="flex-start"
                ml={1.3}
                m={1}
                width="80%"
                key={message.id}
              >
                {/* Avatar */}
                {!isOwnMessage && activeChatId && (
                  <Avatar
                    src={contacts.find(c => c.id === activeChatId)?.avatar}
                    alt={contacts.find(c => c.id === activeChatId)?.name}
                    sx={{ width: 40, height: 40, borderRadius: 1.5, mt: 0.5 }}
                  />
                )}
              
                {isOwnMessage && (
                  <Avatar
                    src={currentUser?.photoURL}
                    alt={currentUser?.name}
                    sx={{ width: 40, height: 40, borderRadius: 1.5, mt: 0.5 }}
                  />
                )}
              
                {/* Message Content */}
                <Box ml={1} display="flex" flexDirection="column" maxWidth="80%">
                  
                  {/* Name & Time */}
                  <Box display="flex" alignItems="center" gap={1} mt='1'>
                   { !isOwnMessage &&  activeChatId && (
                      <Typography variant="subtitle2" color="black"  sx={{ fontFamily: 'GeneralSans-SemiBold' }}>
                        {contacts.find(c => c.id === activeChatId)?.name}
                      </Typography>
                    )
                    }
                    { isOwnMessage &&  activeChatId && (
                      <Typography variant="subtitle2" color="black" fontWeight="bold" sx={{ fontFamily: 'GeneralSans-SemiBold' }}>
                        {currentUser?.name}
                      </Typography>
                    )
                    }
                   
                  </Box>
              
                  {/* Message Text */}
                  <Box mt={0.3} display="flex" direction="row" alignItems="flex-start">
            
                    <Typography
                      variant="body1"
                      sx={{
                        color: 'black',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        fontSize: isOnlyEmoji(message.text) ? '2.5rem' : '1rem',
                        textAlign: isOnlyEmoji(message.text) ? 'center' : 'left',
                      }}
                    >
                      {message.text}
                    </Typography>
              
                
                    {/* <Typography>
                      MediaMessage 
                    </Typography> */}
                   {message.mediaData && message.mediaType && (
                            <MediaMessage 
                              mediaData={message.mediaData}
                               mediaType={message.mediaType}
                              isYou={isOwnMessage}
                          />
                       )}

            
                  </Box>
                  {/* Reaction Icon  && Time*/}
                  <Box display="flex" alignItems="center" gap={1} mt='1'> 
                    <Typography variant="caption" color="text.secondary" mt={0.5}>
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Typography>
                    <Box>
                      {/* <IconButton
                        sx={{ p: 0.5, color: 'rgba(86, 86, 86, 0.6)' }}
                      > */}
                        {/* <LuSmile size={15} /> */}
                         <EmojiPickerButton onSelect={(emoji) => {
                            console.log('Selected emoji:', emoji);
                            // You can now react or insert it into a message
                      }} />

                      {/* </IconButton> */}
                    </Box>
                  </Box>
                </Box>
              </Box>
            );
          })}
          <div ref={messagesEndRef} />
        </Box>
        
        <Box component="form" onSubmit={handleSendMessage}
        elevation={10} sx={{ 
          bgcolor: 'rgba(228, 228, 228, 0.89)',
          position: 'sticky',
          borderTop: '2px solid rgba(255,255,255,0.1)',
         }}>
          <Paper
          elevation={4}
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            p: 1, 
            bgcolor: 'transparent',
            elevation: 4
          }}>
 <label htmlFor="fileInput">
      <input
        id="fileInput"
        type="file"
        accept="image/*,video/*,audio/*"
        style={{ display: 'none' }}
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <IconButton component="span" sx={{ color: 'rgba(18, 17, 17, 0.7)' }}>
        <CgAttachment />
      </IconButton>
    </label>
    {selectedFile && (
  <Box
    sx={{
      color: 'white',
      position: 'absolute',
      bottom: '60px',
      left: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      zIndex: 10,
    }}
  >
    <Box
      sx={{
        fontSize: '28px',
        backgroundColor: '#9D97C7',
        color: 'white',
        pt: 1,
        pb: 0,
        pl: 1,
        pr: 1,
        borderRadius: '8px',
      }}
    >
      <MdOutlineFilePresent />
    </Box>

    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        backgroundColor: '#9D97C7',
        borderRadius: '5px',
        padding: '8px',
        maxWidth: '300px',
        overflow: 'hidden',
      }}
    >
      <Typography
        sx={{
          color: 'white',
          fontSize: '0.8rem',
          textOverflow: 'ellipsis',
          fontFamily: 'GeneralSans-SemiBold',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
        }}
      >
        {truncateFileName(selectedFile.name)}
      </Typography>

      {isPrgressShown ? (
        <LinearProgress
          variant="determinate"
          value={uploadProgress}
          sx={{
            mt: 1,
            height: '10px',
            width: '100%',
            borderRadius: '30px',
            backgroundColor: '#b6b6b6',
            '& .MuiLinearProgress-bar': {
              backgroundColor: '#5A65CA',
              borderRadius: '30px',
            },
          }}
        />
      ) : (
        <Typography
          sx={{
            fontSize: '0.7rem',
            color: 'white',
            mt: 1,
            textAlign: 'start',
          }}
        >
          File Size: {getSelectedFileSize(selectedFile)}
        </Typography>
      )}
    </Box>

    <IconButton onClick={() => setSelectedFile(null)}>
  <Box component={
    IoCloseCircleOutline} sx={{ color: '#E66104', fontSize: '1.8rem' }}
     />
</IconButton>
  </Box>
)}
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
                    <AudioRecorder 
          onRecordingComplete={handleRecordingComplete}
          currentlyUploading={uploadingAudio}
          uploadProgress={uploadProgress}
        />
            <IconButton 
              onClick={handleSendMessage} 
              sx={{ 
                bgcolor: 'primary.main', 
                color: 'black',
                '&:hover': { bgcolor: 'primary.dark' },
                ml: 1,
                borderRadius: 2
              }}
            >
              <IoIosSend  style={{
                color: 'white'
              }}/>
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

  const renderSidebar = () => {
    return (
      <Box 
        sx={ {
          width: 320,
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 2,
          transition: 'transform 0.3s ease',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-120%)',
          position: isMobile ? 'absolute' : 'relative',
          zIndex: 1100,
          bgcolor: '#18181A',
          boxShadow: isMobile ? '0px 0px 15px rgba(0,0,0,0.2)' : 'none',
          ml: 2
        } }
      >
        {/* App Title */}
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
              Pingme
            </Typography>
            <IconButton 
              onClick={toggleSidebar} 
              sx={{ color: 'white' }}
            >
          <BsLayoutSidebarInset />
            </IconButton>
          </Box>
          
          {/* Search TextField  and add Contact Button*/}
          <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <TextField
            fullWidth
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              style: { color: 'white', paddingLeft: '8px', height: 40 },
              startAdornment: (
                <InputAdornment position="start">
                  <LuUserRoundSearch style={{ fontSize: '20px', color: 'rgba(255,255,255,0.7)', marginLeft: '10px' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mt: 2,
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

          <ChatActions />
          </Box>
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
            '-ms-overflow-style': 'none',
            'scrollbar-width': 'none',
          }}
        >
          <Button 
            variant={activeTab === 'personal' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('personal')}
            startIcon={<HiOutlineUser />}
            sx={{ mr: 1, borderRadius: 2, border: 'none', textTransform: 'none' }}
          >
            <Typography>
              Personal
            </Typography>
          </Button>
          <Button 
            variant={activeTab === 'department' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('department')}
            startIcon={<TbBuildingBridge2 />}
            sx={{ mr: 1, borderRadius: 2, border: 'none', textTransform: 'none' }}
          >
            Department
          </Button>
          <Button 
            variant={activeTab === 'groups' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('groups')}
            startIcon={<GrGroup />}
            sx={{ mr: 1, borderRadius: 2, border: 'none', textTransform: 'none' }}
          >
            Groups
          </Button>
          <Button 
            variant={activeTab === 'noticeboard' ? 'contained' : 'outlined'} 
            onClick={() => setActiveTab('noticeboard')}
            startIcon={<PiNotificationDuotone />}
            sx={{ borderRadius: 2, border: 'none', textTransform: 'none' }}
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
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
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
            sx={{ borderRadius: 2,
              textTransform: 'none',
              border: 'none'
             }}
          >
            <Typography sx={{ color: 'white', textTransform: 'none' }}>
              Logout
            </Typography>
          
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1200,
      display: 'flex', 
      height: '100vh', 
      // bgcolor: '#18181A',
      bgcolor: 'black',
      pt: 2,
      pr: 2,
      pb: 2,
      pl: 0,
      boxSizing: 'border-box',
      overflow: 'hidden',
      width: '100%'
    }}>
      {/* Sidebar */}
      {renderSidebar()}
      
      {/* Toggle Button (Only visible when sidebar is closed) */}
      {!sidebarOpen && (
        <IconButton 
          onClick={toggleSidebar}
          sx={{ 
            position: 'absolute',
            top: 18,
            left: 18,
            bgcolor: 'rgba(255,255,255,0.1)',
            color: 'white',
            zIndex: 1050,
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.2)',
            }
          }}
        >
    {    !isMobile &&( <BsLayoutSidebarInsetReverse />)}
        </IconButton>
      )}
      
      {/* Main chat area */}
      <Box sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        borderRadius: 6,
        overflow: 'hidden',
        ml: sidebarOpen && !isMobile ? 2 : 2,
        transition: 'margin-left 0.3s ease',
        width: '100px',
      }}>
        {/* Chat header */}
        <Box sx={{ 
          p: 2, 
          position: 'sticky',
          top: 0,
          elevation: 10,
          zIndex: 1000,
          display: 'flex', 
          alignItems: 'center',
          borderBottom: '2px solid rgba(187, 187, 187, 0.37)',
          bgcolor: '#FEFEFE',
        }}>
          {!sidebarOpen && isMobile && (
            <IconButton 
              onClick={toggleSidebar} 
              sx={{ mr: 1, color: 'black' }}
            >
             <BsLayoutSidebarInsetReverse />
            </IconButton>
          )}
          
          {activeChatId && activeTab === 'personal' && (
            <Avatar 
              src={contacts.find(c => c.id === activeChatId)?.avatar} 
              alt={contacts.find(c => c.id === activeChatId)?.name}
              sx={{ mr: 2 }}
            />
          )}
          {selectedGroupChat && activeTab === 'department' && (
            <Avatar 
              src={groups.find(g => g.id === selectedGroupChat)?.groupImage} 
              alt={groups.find(g => g.id === selectedGroupChat)?.name}
              sx={{ mr: 2 }}
            />
          )}
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black', fontFamily: 'GeneralSans-SemiBold' }}>
          {displayName()}
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
            secondaryTypographyProps={{ color: 'rgba(0,0,0,0.6)' }}
          />
        </MenuItem>
        <Divider sx={{ bgcolor: 'rgba(0,0,0,0.1)' }} />
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
          borderTopLeftRadius: 10, 
          borderBottomLeftRadius: 10,
        }}
        PaperProps={{
          sx: { bgcolor: '#1D1D1F', color: 'white', width: 320, borderRadius: 5 }
        }}
      >
        <Box sx={{ 
          p: 2, 
          display: 'flex', 
          alignItems: 'center', 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>Notifications</Typography>
          <IconButton sx={{ color: 'white' }} onClick={() => setShowNotices(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
        {renderNotices()}
      </Drawer>
    </Box>
  );
};

export default Home;
