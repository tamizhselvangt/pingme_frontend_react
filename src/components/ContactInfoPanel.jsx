import { Box, Typography, IconButton, Tabs, Tab, Divider, List, ListItem, ListItemAvatar, ListItemText, Avatar, Grid } from '@mui/material';
import { IoClose } from 'react-icons/io5';
import { useState, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

export default function ContactInfoPanel({ onClose, groupId, chatId }) {
  const { activeTab, groups, contacts } = useChat();
  const [currentTab, setCurrentTab] = useState('info');
  const [info, setInfo] = useState(null);
  const [groupMembers, setGroupMembers] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);
  const [links, setLinks] = useState([]);
  const [docs, setDocs] = useState([]);

  // Find group info based on groupId
  useEffect(() => {

    //Group Info
    if (groupId && groups) {
      const group = groups.find(g => g.id === groupId);
      if (group) {
        setInfo(group);
        // For demo purposes, we're setting placeholder data
        // In a real app, you would fetch this data from your backend
        setGroupMembers(contacts.slice(0, 5)); // Just using some contacts as members
        
        // Mock media items
        setMediaItems([
          { id: 1, type: 'image', url: '/api/placeholder/100/100', date: 'December 2024' },
          { id: 2, type: 'image', url: '/api/placeholder/100/100', date: 'December 2024' },
          { id: 3, type: 'image', url: '/api/placeholder/100/100', date: 'January' },
          { id: 4, type: 'audio', url: '/audio.mp3', duration: '0:10', date: 'December 2024' },
        ]);
        
        // Mock links
        setLinks([
          { id: 1, title: 'Project Document', url: 'https://example.com/doc1' },
          { id: 2, title: 'Meeting Notes', url: 'https://example.com/notes' },
        ]);
        
        // Mock docs
        setDocs([
          { id: 1, title: 'Presentation.pptx', url: 'https://example.com/ppt' },
          { id: 2, title: 'Report.pdf', url: 'https://example.com/pdf' },
        ]);
      }
    }
    //Chat Info
    if (chatId && contacts) {
      const contact = contacts.find(c => c.id === chatId);
      if (contact) {
        setInfo(contact);
        // For demo purposes, we're setting placeholder data
        // In a real app, you would fetch this data from your backend
        setGroupMembers([]); // Just using some contacts as members
        
        // Mock media items
        setMediaItems([
          { id: 1, type: 'image', url: '/api/placeholder/100/100', date: 'December 2024' },
          { id: 2, type: 'image', url: '/api/placeholder/100/100', date: 'December 2024' },
          { id: 3, type: 'image', url: '/api/placeholder/100/100', date: 'January' },
          { id: 4, type: 'audio', url: '/audio.mp3', duration: '0:10', date: 'December 2024' },
        ]);
        
        // Mock links
        setLinks([
          { id: 1, title: 'Project Document', url: 'https://example.com/doc1' },
          { id: 2, title: 'Meeting Notes', url: 'https://example.com/notes' },
        ]);
        
        // Mock docs
        setDocs([
          { id: 1, title: 'Presentation.pptx', url: 'https://example.com/ppt' },
          { id: 2, title: 'Report.pdf', url: 'https://example.com/pdf' },
        ]);
      }
    }

  }, [groupId,chatId, groups, contacts]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!info) {
    return;
  }

  return (
    <Box sx={{
      position: 'absolute',
      top: 10,
      right: 10,
      bottom: 0,
      width: '320px',
      bgcolor: '#fff',
      border: '1px solid #e0e0e0',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '-5px 0 15px rgba(99, 99, 99, 0.4)',
      height: '500px',
      borderRadius: '10px',
    }}>
      {/* Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 2,
        borderBottom: '1px solid #e0e0e0'
      }}>
        <Typography variant="h6" fontWeight="500">{activeTab === 'groups' ? 'Group' : 'Contact'}</Typography>
        <IconButton onClick={onClose} size="small">
          <IoClose />
        </IconButton>
      </Box>

      {/* Navigation Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={currentTab} 
          onChange={handleTabChange} 
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTab-root': { minWidth: 'unset' } }}
        >
          <Tab value="info" label="Info" />
          <Tab value="media" label="Media" />
          <Tab value="links" label="Links" />
          <Tab value="docs" label="Docs" />
          {activeTab === 'groups' && <Tab value="members" label="Members" />}
        </Tabs>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {/* Info Tab */}
        {currentTab === 'info' && (
          <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar 
                sx={{ width: 80, height: 80, mb: 1 }}
                src={info.avatar || '/api/placeholder/80/80'}
              />
              <Typography variant="h6">{info.name}</Typography>
              {info.description && (
                <Typography variant="body2" color="text.secondary">
                  {info.description}
                </Typography>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            {groupId &&info.creator.id && (
            <List>
              <ListItem>
                <ListItemText 
                  primary="Created by" 
                  secondary={contacts.find(c => c.id === info.creator.id)?.name || 'Unknown'} 
                />
              </ListItem>
              <ListItem>
                <ListItemText 
                  primary="Members" 
                  secondary={`${groupMembers.length} participants`} 
                />
              </ListItem>
            </List>
            )}
          </Box>
        )}

        {/* Media Tab */}
        {currentTab === 'media' && (
          <Box>
            {mediaItems.length > 0 ? (
              <>
                {/* Group by date */}
                {['December 2024', 'January'].map(date => {
                  const dateItems = mediaItems.filter(item => item.date === date);
                  if (dateItems.length === 0) return null;
                  
                  return (
                    <Box key={date} sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>{date}</Typography>
                      <Grid container spacing={1}>
                        {dateItems.map(item => (
                          <Grid item xs={4} key={item.id}>
                            <Box 
                              sx={{ 
                                position: 'relative',
                                paddingTop: '100%',
                                bgcolor: 'rgba(0,0,0,0.1)',
                                borderRadius: 1,
                                overflow: 'hidden'
                              }}
                            >
                              {item.type === 'image' ? (
                                <img 
                                  src={item.url} 
                                  alt="Media"
                                  style={{ 
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                  }}
                                />
                              ) : (
                                <Box 
                                  sx={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    bgcolor: 'rgba(0,0,0,0.05)'
                                  }}
                                >
                                  <Typography variant="caption">{item.duration}</Typography>
                                </Box>
                              )}
                            </Box>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  );
                })}
              </>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No media files
              </Typography>
            )}
          </Box>
        )}

        {/* Links Tab */}
        {currentTab === 'links' && (
          <Box>
            {links.length > 0 ? (
              <List>
                {links.map(link => (
                  <ListItem key={link.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={link.title}
                      secondary={link.url}
                      sx={{
                        '& .MuiListItemText-primary': { fontWeight: 500 },
                        '& .MuiListItemText-secondary': { color: 'primary.main', textDecoration: 'underline' }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No links shared
              </Typography>
            )}
          </Box>
        )}

        {/* Docs Tab */}
        {currentTab === 'docs' && (
          <Box>
            {docs.length > 0 ? (
              <List>
                {docs.map(doc => (
                  <ListItem key={doc.id} sx={{ px: 0 }}>
                    <ListItemText
                      primary={doc.title}
                      sx={{
                        '& .MuiListItemText-primary': { fontWeight: 500 }
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                No documents shared
              </Typography>
            )}
          </Box>
        )}

        {/* Members Tab (only for groups) */}
        {currentTab === 'members' && activeTab === 'groups' && (
          <Box>
            <List>
              {groupMembers.map(member => (
                <ListItem key={member.id} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar src={member.avatar} alt={member.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={member.name}
                    secondary={member.status === 'online' ? 'Online' : 'Offline'}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        )}
      </Box>

      {/* Footer button for closing */}
      <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0' }}>
        <Box 
          sx={{ 
            bgcolor: '#4caf50', 
            color: 'white', 
            textAlign: 'center',
            borderRadius: 1,
            py: 1,
            cursor: 'pointer'
          }}
          onClick={onClose}
        >
          Done
        </Box>
      </Box>
    </Box>
  );
}
