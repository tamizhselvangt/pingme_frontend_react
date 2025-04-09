import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';




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
      console.log('Fetching messages for user:', currentUser.id, 'and chat:', activeChatId);
      try {
        const response = await axios.get(`http://localhost:8080/api/messages/messages/${currentUser.id}/${activeChatId}`);
        
        console.log('Fetched messages:', response.data);
        const fetchedMessages = response.data.map((msg) => ({
          id: msg.id,
          sender: msg.senderId,
          text: msg.content,
          timestamp: new Date(msg.createdAt * 1000), // Assuming it's in seconds
          file: msg.mediaType?.startsWith('image') || msg.mediaType?.startsWith('video') ? {
            name: msg.mediaType,
            data: msg.mediaData
          } : null,
          voice: msg.mediaType?.startsWith('audio') ? {
            duration: 'Audio message',
            data: msg.mediaData
          } : null
        }));
  
        console.log('Fetched Converted messages:', fetchedMessages);
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
  

  const sendMessage = async (text, file = null, voice = null) => {
    if (!activeChatId || !currentUser) return;
  
    // Only send to the /api/messages/send endpoint if it's a plain text message
    if (text && !file && !voice) {
      const payload = {
        senderId: currentUser.id,
        recipientId: activeChatId,
        content: text,
        mediaData: null,
        mediaType: null,
      };
  
      try {
        const response = await axios.post('http://localhost:8080/api/messages/send', payload);
  
        if (response.status === 202) {
          // console.log('Text message sent successfully:', response.data);
          const msg = response.data;
          const sentMessage = {
            id: msg.id,
            sender: msg.senderId,
            text: msg.content,
            timestamp: new Date(msg.timestamp * 1000), 
            file: msg.mediaType?.startsWith('image') || msg.mediaType?.startsWith('video') ? {
              name: msg.mediaType,
              data: msg.mediaData
            } : null,
            voice: msg.mediaType?.startsWith('audio') ? {
              duration: 'Audio message',
              data: msg.mediaData
            } : null
          };
          // Add the message to local state
          setMessages(prev => ({
            ...prev,
            [activeChatId]: [...(prev[activeChatId] || []), sentMessage],
          }));
 
        } else {
          console.warn('Unexpected response status:', response.status);
          enqueueSnackbar('Failed to send text message', { variant: 'error' });
        }
      } catch (error) {
        console.error('Failed to send text message:', error);
        enqueueSnackbar('Failed to send text message', { variant: 'error' });
      }
      return;
    }
  
    // If it's a media message (file or voice), handle with another endpoint
    // You can handle that here:
    if (file || voice) {
      // Example placeholder for media upload logic
      console.log('Send media message via different endpoint...');
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
