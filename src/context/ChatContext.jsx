import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import { showMessageNotification } from '../components/showMessageNotification';

const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeTab, setActiveTab] = useState('personal'); // personal, department, groups, noticeboard
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const stompClientRef = useRef(null);

  // Socket connection Handling
useEffect(() => {
    if (!currentUser) return;
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        // Subscribe to personal message queue
        stompClient.subscribe(`/user/${currentUser.id}/queue/messages`, (message) => {
          const body = JSON.parse(message.body);
          const incomingMessage = {
            id: Date.now().toString(), // Optional unique ID
            sender: body.senderId,
            text: body.content,
            timestamp: new Date(),
            // Customize handling media if needed
          };

          const senderId = body.senderId;

          setMessages((prev) => ({
            ...prev,
            [senderId]: [...(prev[senderId] || []), incomingMessage],
          }));
          if(senderId !== activeChatId){
            const notification = {
              name: body.username,
              avatarUrl: body.profile
            };
            showMessageNotification(notification);
          }
        });
      },
      onStompError: (frame) => {
        console.error('WebSocket error:', frame.headers['message']);
      }
    });

    stompClient.activate();
    stompClientRef.current = stompClient;

    return () => {
      stompClient.deactivate();
    };
  }, [currentUser]);
  
  // Fetch All Users for contacts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser) {
          
          const response = await axios.post('http://localhost:8080/api/users/all');
          const users = response.data;

          // Optional: filter or categorize based on activeTab here
          const formattedContacts = users
            .filter(user => user.name !== currentUser.name) // avoid showing current user as contact
            .map(user => ({
              id: user.id.toString(),
              name: user.name,
              status: user.status?.toLowerCase(), // assuming API returns ONLINE/OFFLINE
              avatar: user.profileImage,
            }));

          setContacts(formattedContacts);
        }
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, [currentUser, activeTab]);

  // Mock data for notices
  useEffect(() => {
    if (activeTab === 'noticeboard') {
      const mockNotices = [
        { id: '1', title: 'Company Meeting', content: 'Monthly company meeting on Friday', date: '2023-04-01', author: 'Admin' },
        { id: '2', title: 'Holiday Notice', content: 'Office will be closed on Monday', date: '2023-03-28', author: 'HR' },
        { id: '3', title: 'New Policy', content: 'New work from home policy effective next week', date: '2023-03-25', author: 'Admin' },
      ];
      setNotices(mockNotices);
    }
  }, [activeTab]);


  //Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId || !currentUser?.id) return;
    
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/messages/${currentUser.id}/${activeChatId}`);
      
        const fetchedMessages = response.data.map((msg) => ({
          id: msg.id,
          sender: msg.senderId,
          text: msg.content,
          timestamp: new Date(msg.createdAt * 1000), // Assuming it's in seconds
          mediaType: msg.mediaType,
          mediaData: msg.mediaData, 
        }));
        setMessages(prev => ({
          ...prev,
          [activeChatId]: fetchedMessages,
        }));        
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        enqueueSnackbar('Failed to fetch messages', { variant: 'error' });
      }
    };

    fetchMessages();
  }, [activeChatId, currentUser]);
  
  const sendMessage = async (text, file = null, mediaType = null) => {
    if (!activeChatId || !currentUser) return;
  
    const baseMessage = {
      senderId: currentUser.id,
      recipientId: activeChatId,
      content: text || '', // Always have content
      mediaType: mediaType,
    };
  
    // If there's a file (image, video, audio)
    if (file && mediaType) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", new Blob([JSON.stringify(baseMessage)], { type: 'application/json' }));
  
        const response = await axios.post('http://localhost:8080/api/messages/upload/media', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        if (response.status === 202) {
          const msg = response.data;
          const sentMessage = {
            id: msg.id,
            sender: msg.senderId,
            text: msg.content,
            timestamp: new Date(msg.createdAt * 1000),
            mediaType: msg.mediaType,
            mediaData: msg.mediaData, // ✅ Make this direct
          };
  
          setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), sentMessage],
          }));
        } else {
          enqueueSnackbar('Failed to send media message', { variant: 'error' });
        }
      } catch (error) {
        console.error('Media upload failed:', error);
        enqueueSnackbar('Failed to send media message', { variant: 'error' });
      }
      return;
    }
  
    // Else: Text-only message
    if (text) {
      try {
        const response = await axios.post('http://localhost:8080/api/messages/send', {
          ...baseMessage,
          mediaData: null,
        });
  
        if (response.status === 202) {
          const msg = response.data;
          const sentMessage = {
            id: msg.id,
            sender: msg.senderId,
            text: msg.content,
            timestamp: new Date(msg.timestamp * 1000),
            mediaType: null,
            mediaData: null, // ✅ Make this direct
          };
  
          setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), sentMessage],
          }));
        } else {
          enqueueSnackbar('Failed to send text message', { variant: 'error' });
        }
      } catch (error) {
        console.error('Text message send failed:', error);
        enqueueSnackbar('Failed to send text message', { variant: 'error' });
      }
    }
  };
  
  
  // const sendMessage = (text, file = null, voice = null) => {
  //   if (!activeChatId || !currentUser) return;

  //   const newMessage = {
  //     id: Date.now().toString(),
  //     sender: currentUser.id,
  //     text,
  //     file,
  //     voice,
  //     timestamp: new Date().toISOString(),
  //   };

  //   setMessages(prev => ({
  //     ...prev,
  //     [activeChatId]: [...(prev[activeChatId] || []), newMessage],
  //   }));
  // };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    contacts: filteredContacts,
    messages: messages[activeChatId] || [],
    activeChatId,
    setActiveChatId,
    activeTab,
    setActiveTab,
    notices,
    searchQuery,
    setSearchQuery,
    sendMessage,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 
