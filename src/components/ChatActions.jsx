import { Box, TextField, InputAdornment, IconButton, Modal, Typography, Button, List, ListItem, ListItemText, ListItemButton, Radio, Checkbox } from '@mui/material';
import { LuUserRoundSearch } from 'react-icons/lu';
import { TbLayoutGridAdd } from 'react-icons/tb';
import { useState } from 'react';
import { useChat } from '../context/ChatContext';

export default function ChatActions() {
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
  const [open, setOpen] = useState(false);
  const [modalView, setModalView] = useState('home');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groups = ['Friends', 'Family', 'Work'];      // demo groups

  const handleOpen = () => {
    setOpen(true);
    setModalView('home');
  };
  const handleClose = () => {
    setOpen(false);
    setModalView('home');
    setSelectedContacts([]);
    setSelectedGroup(null);
  };

  const toggleContact = (contact) => {
    setSelectedContacts((prev) =>
      prev.includes(contact) ? prev.filter(c => c !== contact) : [...prev, contact]
    );
  };

  const handleAddContacts = () => {
    // Logic to add selectedContacts to selectedGroup
    console.log(`Added [${selectedContacts.join(', ')}] to ${selectedGroup}`);
    setModalView('done');
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
      <IconButton sx={{ color: 'white' }} onClick={handleOpen}>
        <TbLayoutGridAdd />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          bgcolor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start',
          pt: 8, zIndex: 1300,
        }}>
          <Box sx={{
            width: '90%', maxWidth: 400, bgcolor: '#222', borderRadius: 3, p: 3,
            color: 'white', boxShadow: 5,
          }}>
            {modalView === 'home' && (
              <>
                <Typography variant="h6" gutterBottom>Quick Actions</Typography>
                <Button fullWidth variant="contained" color="primary" sx={{ mb: 1, borderRadius: 2 }}
                  onClick={() => setModalView('addGroup')}>
                  Add Group
                </Button>
                <Button fullWidth variant="outlined" sx={{ mb: 1, borderRadius: 2, color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
                  onClick={() => setModalView('chooseGroup')}>
                  Add Contacts to Group
                </Button>
                <Button fullWidth variant="text" sx={{ color: 'rgba(255,255,255,0.7)' }} onClick={handleClose}>
                  Cancel
                </Button>
              </>
            )}

            {/* Add Group View */}
            {modalView === 'addGroup' && (
              <>
                <Typography variant="h6" gutterBottom>Select Contacts</Typography>
                <List>
                  {contacts.map((contact) => (
                    <ListItem key={contact.id} disablePadding>
                      <ListItemButton onClick={() => toggleContact(contact.name)}>
                        <Checkbox edge="start" checked={selectedContacts.includes(contact.name)} />
                        <ListItemText primary={contact.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Button fullWidth variant="contained" sx={{ mt: 2, borderRadius: 2 }}
                  onClick={() => {
                    console.log('New Group Created with:', selectedContacts);
                    setModalView('done');
                  }}>
                  Create Group
                </Button>
              </>
            )}

            {/* Choose Group View */}
            {modalView === 'chooseGroup' && (
              <>
                <Typography variant="h6" gutterBottom>Select Group</Typography>
                <List>
                  {groups.map((group) => (
                    <ListItem key={group} disablePadding>
                      <ListItemButton onClick={() => {
                        setSelectedGroup(group);
                        setModalView('addContactsToGroup');
                      }}>
                        <Radio edge="start" checked={selectedGroup === group} />
                        <ListItemText primary={group} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Add Contacts to Selected Group */}
            {modalView === 'addContactsToGroup' && (
              <>
                <Typography variant="h6" gutterBottom>Add Contacts to {selectedGroup}</Typography>
                <List>
                  {contacts.map((contact) => (
                    <ListItem key={contact} disablePadding>
                      <ListItemButton onClick={() => toggleContact(contact)}>
                        <Checkbox edge="start" checked={selectedContacts.includes(contact)} />
                        <ListItemText primary={contact} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
                <Button fullWidth variant="contained" sx={{ mt: 2, borderRadius: 2 }}
                  onClick={handleAddContacts}>
                  Add to {selectedGroup}
                </Button>
              </>
            )}

            {/* Done View */}
            {modalView === 'done' && (
              <>
                <Typography variant="h6" gutterBottom>Success!</Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>Action completed successfully.</Typography>
                <Button fullWidth variant="contained" color="primary" sx={{ borderRadius: 2 }} onClick={handleClose}>
                  Close
                </Button>
              </>
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
}
