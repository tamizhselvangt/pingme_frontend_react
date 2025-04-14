import { Box, TextField, InputAdornment, IconButton, Modal, Typography, Button, List, ListItem, ListItemText, ListItemButton, Radio, Checkbox } from '@mui/material';
import { LuUserRoundSearch } from 'react-icons/lu';
import { TbLayoutGridAdd } from 'react-icons/tb';
import { useState } from 'react';
import { useChat } from '../context/ChatContext';

export default function ChatActions() {
  const { 
    contacts,
    createChatGroup,
    groups
  } = useChat();
  const [open, setOpen] = useState(false);
  const [modalView, setModalView] = useState('home');
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  // const groups = ['Friends', 'Family', 'Work']; 
  const [errors, setErrors] = useState({
    groupName: '',
  });

  const [groupDetails, setGroupDetails] = useState({
    groupName: '',
    description: '',
  });
  
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
    console.log("selectedContacts,selectedGroup",selectedContacts,selectedGroup);
    // addMembersToGroup(selectedGroup.id, selectedContacts);
    setModalView('done');
  };

  const handleCreateGroup = () => {
    let isValid = true;
    let newErrors = { groupName: '' };
  
    if (groupDetails.groupName.trim() === '') {
      newErrors.groupName = 'Group Name is required';
      isValid = false;
    }
  
    setErrors(newErrors);
  
    if (isValid) {
      console.log('Group Created:', groupDetails);
      setGroupDetails({ groupName: '', description: '' });
      createChatGroup(groupDetails).then((createdGroup) => {
        if (createdGroup) {
          setModalView('addGroup');
        }else{
          setModalView('home');
        }
      });
      
    }
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
                  onClick={() => setModalView('createNewGroup')}>
                  Create New Group
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

{modalView === 'createNewGroup' && (
  <>
    <Typography variant="h6" gutterBottom>Create New Group</Typography>
    <TextField
  fullWidth
  label="Group Name"
  value={groupDetails.groupName}
  onChange={(e) => {
    setGroupDetails({ ...groupDetails, groupName: e.target.value });
    if (e.target.value.trim() !== '') {
      setErrors({ ...errors, groupName: '' });
    }
  }}
  placeholder="Enter group name"
  error={!!errors.groupName}
  helperText={errors.groupName}
  InputLabelProps={{ style: { color: 'white' } }}
  sx={{
    mb: 2,
    '& .MuiOutlinedInput-root': {
      bgcolor: 'rgba(255,255,255,0.1)',
      borderRadius: 2,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: 'rgba(255,255,255,0.3)',
      },
    },
    input: { color: 'white' },
  }}
/>


    <TextField
      fullWidth
      label="Description"
      value={groupDetails.description}
      onChange={(e) =>
        setGroupDetails({ ...groupDetails, description: e.target.value })
      }
      placeholder="Enter description"
      multiline
      rows={3}
      InputLabelProps={{ style: { color: 'white' } }}
      sx={{
        mb: 2,
        '& .MuiOutlinedInput-root': {
          bgcolor: 'rgba(255,255,255,0.1)',
          borderRadius: 2,
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255,255,255,0.3)',
          },
        },
        textarea: { color: 'white' },
      }}
    />

    <Button
      fullWidth
      variant="contained"
      color="primary"
      sx={{ mb: 1, borderRadius: 2 }}

      onClick={handleCreateGroup}
    
    >
      Create Group
    </Button>

    <Button
      fullWidth
      variant="text"
      sx={{ color: 'rgba(255,255,255,0.7)' }}
      onClick={() => setModalView('home')}
    >
      Back
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
                    <ListItem key={group.id} disablePadding>
                      <ListItemButton onClick={() => {
                        setSelectedGroup(group);
                        setModalView('addContactsToGroup');
                      }}>
                        {/* <Radio edge="start" checked={selectedGroup.id === group.id} /> */}
                        <ListItemText primary={group.name} />
                      </ListItemButton> 
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            {/* Add Contacts to Selected Group */}
            {modalView === 'addContactsToGroup' && (
              <>
                <Typography variant="h6" gutterBottom>Add Contacts to {selectedGroup.name} </Typography>
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
                  onClick={handleAddContacts}>
                  Add to {selectedGroup.name}
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
