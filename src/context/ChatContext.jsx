import { createContext, useState, useContext, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SockJS from 'sockjs-client/dist/sockjs';
import { Client } from '@stomp/stompjs';
import { showMessageNotification } from '../components/showMessageNotification';
import { showNewUserNotification } from '../components/showNewUserNotification';

const ChatContext = createContext();

const url = "http://51.21.248.13:8080";

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
  const [groups, setGroups] = useState([]);
  const [selectedGroupChat, setSelectedGroupChat] = useState(null);
  const [groupMessages, setGroupMessages] = useState({});
  const [departments, setDepartments] = useState([]);
  const activeChatIdRef = useRef(activeChatId);


  useEffect(() => {
    activeChatIdRef.current = activeChatId;
  }, [activeChatId]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${url}/api/departments/all`);
      console.log("Departments:", response.data);
      setDepartments(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching departments', { variant: 'error' });
    }
  };
  
  // Socket connection Handling
  useEffect(() => {
    if (!currentUser) return;
    
    const connectToWebSocket = () => {
      const socket = new SockJS(`${url}/ws`);
      const stompClient = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        onConnect: () => {
          console.log('Connected to WebSocket');
          fetchDepartments();
          // Subscribe to personal message queue
          stompClient.subscribe(`/user/${currentUser.id}/queue/messages`, (message) => {
            const body = JSON.parse(message.body);
            const incomingMessage = 
            {
              id: body.id,
              sender: body.senderId,
              text: body.content,
              timestamp: new Date(body.createdAt * 1000), 
              mediaType: body.mediaType,
              mediaData: body.mediaDataURL, 
            }

            const senderId = body.senderId;
            if(body.messageType === "GROUP"){
              setGroupMessages((prev) => ({
                ...prev,
                [senderId]: [...(prev[senderId] || []), incomingMessage],
              }));
            }else{
              setMessages((prev) => ({
                ...prev,
                [senderId]: [...(prev[senderId] || []), incomingMessage],
              }));
            }
            const username = contacts.find(c => c.id === senderId)?.name;
            const avatarUrl = contacts.find(c => c.id === senderId)?.avatar;

            if(senderId !== Number(activeChatIdRef.current)){
              const notification = {
                name: username,
                avatarUrl: avatarUrl
              };
              showMessageNotification(notification);
            }
          });

          stompClient.subscribe(`/topic/users`, (message) => {
         const newMessage = JSON.parse(message.body);

          const newUser = {
            id: newMessage.id.toString(),
            name: newMessage.name,
            email: newMessage.email,
            departmentId: newMessage.departmentId,
            status: newMessage.status?.toLowerCase(), 
            avatar: newMessage.profileImage,
          }
          console.log("New User: boolean", !contacts.some(contact => contact.id === newUser.id));

          if(!contacts.some(contact => contact.id === newUser.id)){
            console.log("New User: boolean", newUser.id !== currentUser.id);
            if(newUser.id !== currentUser.id){
              setContacts((prev) => [...prev, newUser]);
              const notification = {
                name: newUser.name,
                avatarUrl: newUser.avatar
              };
              showNewUserNotification(notification);
            }
            
          }else{
            setContacts((prev) => prev.map(contact => contact.id === newUser.id ? newUser : contact));
          }
});

          
          // Now that we're connected, fetch groups and subscribe
          fetchGroupsAndSubscribe(stompClient);
        },
        onStompError: (frame) => {
          console.error('WebSocket error:', frame.headers['message']);
        }
      });

      stompClient.activate();
      stompClientRef.current = stompClient;
    };

    connectToWebSocket();

    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, [currentUser]);

  useEffect(() => {
    if (activeTab === 'groups' && selectedGroupChat) {
      fetchGroupsAndSubscribe(stompClientRef.current);
    }
  }, [activeTab, selectedGroupChat]);

  // Function to fetch groups and subscribe to them
  const fetchGroupsAndSubscribe = async (stompClient) => {
    if (!currentUser) return;
    
    try {
      const response = await axios.post(`${url}/api/group-chat/user/${currentUser.id}`);
      const groups = response.data;
      setGroups(groups);

      // Subscribe to each group topic
      groups.forEach(group => {
        stompClient.subscribe(`/topic/group/${group.id}`, (message) => {
          const body = JSON.parse(message.body);
          const incomingMessage = {
            id: body.id,
            sender: body.senderId,
            text: body.content,
            timestamp: new Date(body.createdAt * 1000),
            mediaType: body.mediaType,
            mediaData: body.mediaDataURL,
          };


          setGroupMessages(prev => ({
            ...prev,
            [group.id]: [...(prev[group.id] || []), incomingMessage],
          }));

          if (group.id !== activeChatIdRef.current) {
            const groupName = groups.find(g => g.id === group.id)?.name;
            const avatarUrl = groups.find(g => g.id === group.id)?.avatar;
            showMessageNotification({ name: groupName, avatarUrl: avatarUrl });
          }
        });
      });
    } catch (error) {
      console.error('Failed to fetch groups or subscribe:', error);
    }
  };
  
  // Fetch All Users for contacts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (currentUser) {
          
          const response = await axios.post(`${url}/api/users/all`);
          const users = response.data;

          // Optional: filter or categorize based on activeTab here
          const formattedContacts = users
            .filter(user => user.name !== currentUser.name) // avoid showing current user as contact
            .map(user => ({
              id: user.id.toString(),
              name: user.name,
              email: user.email,
              departmentId: user.departmentId,
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
      const fetchNotices = async () => {
        try {
          const response = await axios.post(`${url}/api/notices/all`);
          console.log("Notices:", response.data);
          setNotices(response.data);
        } catch (error) {
          enqueueSnackbar('Error fetching notices', { variant: 'error' });
        }
      };
      fetchNotices();
    }
  }, [activeTab]);

  //Fetch messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      if (!activeChatId || !currentUser?.id) return;
    
      try {
        const response = await axios.post(`${url}/api/messages/messages/${currentUser.id}/${activeChatId}`);
      
        const fetchedMessages = response.data.map((msg) => ({
          id: msg.id,
          sender: msg.senderId,
          text: msg.content,
          timestamp: new Date(msg.createdAt * 1000), // Assuming it's in seconds
          mediaType: msg.mediaType,
          mediaData: msg.mediaDataURL, 
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

  const sendMessage = async (text, file = null, mediaType = null, onProgress = null) => {
    if (!currentUser) return;

    let messageType, recipientId;

    if (activeTab === 'groups' && selectedGroupChat) {
      messageType = "GROUP";
      recipientId = selectedGroupChat;
    } else if (activeChatId) {
      messageType = "MESSAGE";
      recipientId = activeChatId;
    } else {
      // No valid recipient — exit early
      return;
    }
    
    const baseMessage = {
      messageType: messageType,
      senderId: currentUser.id,
      recipientId: recipientId,
      content: text || '',
      mediaType: mediaType,
    };
  
    if (file && mediaType) {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("message", new Blob([JSON.stringify(baseMessage)], { type: 'application/json' }));
  
        const response = await axios.post(
              `${url}/api/messages/upload/media`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              if (onProgress) onProgress(percentCompleted);
            }
          }
        );
  
        if (response.status === 202) {
          const msg = response.data;
          const sentMessage = {
            id: msg.id,
            sender: msg.senderId,
            text: msg.content,
            timestamp: new Date(msg.createdAt * 1000),
            mediaType: msg.mediaType,
            mediaData: msg.mediaDataURL,
          };
  
          if (messageType === "GROUP") {
            setGroupMessages(prev => ({
              ...prev,
              [recipientId]: [...(prev[recipientId] || []), sentMessage],
            }));
          } else {
            setMessages(prev => ({
              ...prev,
              [recipientId]: [...(prev[recipientId] || []), sentMessage],
            }));
          }
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
        const response = await axios.post(`${url}/api/messages/send`, {
          ...baseMessage,
          mediaData: null,
        });
  
        if (response.status === 202) {
          const msg = response.data;
          const sentMessage = {
            id: msg.id,
            sender: msg.senderId,
            text: msg.content,
            timestamp: new Date(msg.createdAt * 1000),
            mediaType: null,
            mediaData: null, 
          };
  
          if (messageType === "GROUP") {
            setGroupMessages(prev => ({
              ...prev,
              [recipientId]: [...(prev[recipientId] || []), sentMessage],
            }));
          } else {
            setMessages(prev => ({
              ...prev,
              [recipientId]: [...(prev[recipientId] || []), sentMessage],
            }));
          }
        } else {
          enqueueSnackbar('Failed to send text message', { variant: 'error' });
        }
      } catch (error) {
        console.error('Text message send failed:', error);
        enqueueSnackbar('Failed to send text message', { variant: 'error' });
      }
    }
  };

  const createChatGroup = async (groupDetails) => {
    if (groupDetails.groupName.trim() === '') {
      enqueueSnackbar('Group Name is required', { variant: 'error' });
      return;
    }
    const groupPayload = {
      groupName: groupDetails.groupName,
      description: groupDetails.description,
      creatorId: currentUser.id,
      departmentId: currentUser.departmentId
    };
    console.log("Group Payload:", groupPayload);
    try {
      // Post to your Spring backend
      const response = await axios.post(`${url}/api/group-chat/create`, groupPayload);
      const newGroup = response.data;
  
      // Update state — assuming 'groups' state exists
      setGroups(prevGroups => [...prevGroups, newGroup]);
  
      // Optionally: Show success notification / reset form
      enqueueSnackbar('Group created successfully', { variant: 'success' });
      
      // Subscribe to the new group if we have an active stomp client
      if (stompClientRef.current && stompClientRef.current.connected) {
        stompClientRef.current.subscribe(`/topic/group/${newGroup.id}`, (message) => {
          const body = JSON.parse(message.body);
          const incomingMessage = {
            id: body.id,
            sender: body.senderId,
            text: body.content,
            timestamp: new Date(body.createdAt * 1000),
            mediaType: body.mediaType,
            mediaData: body.mediaDataURL,
          };
          
          setGroupMessages(prev => ({
            ...prev,
            [newGroup.id]: [...(prev[newGroup.id] || []), incomingMessage],
          }));
        });
      }
      
      return newGroup; // in case you want to use it after creation
    } catch (error) {
      console.error('Failed to create group:', error);
      enqueueSnackbar('Failed to create group', { variant: 'error' });
    }
  };

  const addMemberToGroup = async (groupId, memberId) => {
    try {
      const response = await axios.post(`${url}/api/group-chat/add-member/${groupId}/${memberId}`);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to add member to group:', error);
    }
  };
    
  const addMembersToGroup = async (groupId, userIds) => {
    try {
      const params = new URLSearchParams();
      params.append('groupId', groupId);
      userIds.forEach(id => params.append('userIds', id));
  
      const response = await axios.post(`${url}/api/group-chat/add-members`, params);
      console.log(response.data);
    } catch (error) {
      console.error('Failed to add members to group:', error);
    }
  };

  useEffect(() => {
    const fetchGroupMessages = async (groupId, before = null, limit = 20) => {
      try {
        const params = new URLSearchParams({ limit });
        if (before) {
          params.append("before", before);
        }
  
        const response = await axios.post(`${url}/api/group-chat/${groupId}/messages?${params.toString()}`);
        
        const fetchedGroupMessages = response.data.map((msg) => ({
          id: msg.id,
          sender: msg.senderId,
          text: msg.content,
          timestamp: new Date(msg.createdAt * 1000), // Assuming it's in seconds
          mediaType: msg.mediaType,
          mediaData: msg.mediaDataURL, 
        }));

        setGroupMessages(prev => ({
          ...prev,
          [groupId]: fetchedGroupMessages,
        }));
  
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };
  
    if (activeTab === 'groups' && selectedGroupChat) {
      fetchGroupMessages(selectedGroupChat);
    }
  
  }, [activeTab, selectedGroupChat]);
    
  const filteredContacts = contacts.filter(contact => 
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const value = {
    contacts: filteredContacts,
    messages: messages[activeChatIdRef.current] || [],
    activeChatId,
    setActiveChatId,
    activeTab,
    setActiveTab,
    notices,
    searchQuery,
    setSearchQuery,
    sendMessage,
    createChatGroup,
    groups,
    selectedGroupChat,
    setSelectedGroupChat,
    groupMessages: groupMessages[selectedGroupChat] || [],
    setGroupMessages,
    addMemberToGroup,
    addMembersToGroup,
    departments,
    fetchDepartments
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
