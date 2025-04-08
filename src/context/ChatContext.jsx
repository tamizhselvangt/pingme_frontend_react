import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
const ChatContext = createContext();

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [messages, setMessages] = useState({});
  const [activeChat, setActiveChat] = useState(null);
  const [activeTab, setActiveTab] = useState('personal'); // personal, department, groups, noticeboard
  const [notices, setNotices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for contacts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser) {
          
          const response = await axios.post('http://localhost:8080/api/users/all');
          const users = response.data;

          // Optional: filter or categorize based on activeTab here
          const formattedContacts = users
            .filter(user => user.id !== currentUser.id) // avoid showing current user as contact
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

  // Mock data for messages
  useEffect(() => {
    if (activeChat) {
      const mockMessages = {
        '1': [
          { id: '1', sender: '1', text: 'Hi there!', timestamp: '2023-04-08T10:00:00' },
          { id: '2', sender: currentUser?.id, text: 'Hello! How are you?', timestamp: '2023-04-08T10:01:00' },
          { id: '3', sender: '1', text: 'I\'m good, thanks!', timestamp: '2023-04-08T10:02:00' },
        ],
        '2': [
          { id: '1', sender: '2', text: 'Can we meet tomorrow?', timestamp: '2023-04-07T15:00:00' },
          { id: '2', sender: currentUser?.id, text: 'Sure, what time?', timestamp: '2023-04-07T15:05:00' },
        ],
        'dept1': [
          { id: '1', sender: 'dept1', text: 'HR Announcement: New policy update', timestamp: '2023-04-06T09:00:00' },
          { id: '2', sender: currentUser?.id, text: 'Thanks for the update', timestamp: '2023-04-06T09:30:00' },
        ],
        'group1': [
          { id: '1', sender: '1', text: 'Project update: Phase 1 complete', timestamp: '2023-04-05T14:00:00' },
          { id: '2', sender: '2', text: 'Great work everyone!', timestamp: '2023-04-05T14:05:00' },
          { id: '3', sender: currentUser?.id, text: 'When is the next phase starting?', timestamp: '2023-04-05T14:10:00' },
        ],
      };
      setMessages(mockMessages);
    }
  }, [activeChat, currentUser]);

  const sendMessage = (text, file = null, voice = null) => {
    if (!activeChat || !currentUser) return;

    const newMessage = {
      id: Date.now().toString(),
      sender: currentUser.id,
      text,
      file,
      voice,
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => ({
      ...prev,
      [activeChat]: [...(prev[activeChat] || []), newMessage],
    }));
  };

  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    contacts: filteredContacts,
    messages: messages[activeChat] || [],
    activeChat,
    setActiveChat,
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
