import React, { useEffect, useState } from 'react';
import {
  Box, Button, Card, CardContent, Dialog, DialogActions, DialogContent, DialogTitle,
  FormControl, IconButton, InputLabel, List, ListItem, ListItemSecondaryAction,
  ListItemText, MenuItem, Select, Switch, TextField, Typography, Link, FormControlLabel
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { CgAttachment } from 'react-icons/cg';

const url = "http://localhost:8080";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    content: '',
    departmentId: '',
    isImportant: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchNotices();
    fetchDepartments();
  }, []);

  const fetchNotices = async () => {
    try {
      const response = await axios.post(`${url}/api/notices/all`);
      setNotices(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching notices', { variant: 'error' });
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${url}/api/departments/all`);
      setDepartments(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching departments', { variant: 'error' });
    }
  };

  const handleAddNotice = async () => {
    try {
      if (selectedFile) {
        // If file is selected — send multipart request
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('notice', new Blob([JSON.stringify(newNotice)], { type: 'application/json' }));

        await axios.post(`${url}/api/notices/upload/media`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        console.log(newNotice);
        await axios.post(`${url}/api/notices/post`, newNotice);
      }

      // Reset form & reload
      setNewNotice({
        title: '',
        description: '',
        content: '',
        departmentId: '',
        isImportant: false,
      });
      setSelectedFile(null);
      setOpenDialog(false);
      fetchNotices();
      enqueueSnackbar('Notice added successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Error adding notice', { variant: 'error' });
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
        await axios.delete(`${url}/api/notices/remove/${noticeId}`);
      fetchNotices();
      enqueueSnackbar('Notice deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting notice', { variant: 'error' });
    }
  };

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dept) => dept.id === departmentId);
    return department ? department.name : 'Unknown';
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Notices</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Notice
        </Button>
      </Box>

      <Card>
        <CardContent>
          <List>
            {notices.map((notice) => (
              <ListItem key={notice.id}>
                <ListItemText
                  primary={notice.title}
                  secondary={
                    <>
                    <Typography variant="body2">
                        Description : {notice.description}
                      </Typography>
                      <Typography component="span" variant="body1">
                        Content : {notice.content}
                      </Typography>
                      
                      <br />
                      <Typography component="span" variant="caption">
                        Department :  {getDepartmentName(notice.departmentId)}
                      </Typography>
                      <br />
                      {notice.isImportant && (
                        <Typography component="span" variant="caption" color="error">
                          🔴 Important
                        </Typography>
                      )}
                      <br />
                      {notice.attachment && (
                        <a href={notice.attachment} target="_blank" rel="noopener noreferrer">
                          📎 Attachment
                        </a>
                      )}
                    </>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteNotice(notice.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Notice</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newNotice.title}
            onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            value={newNotice.description}
            onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newNotice.content}
            onChange={(e) => setNewNotice({ ...newNotice, content: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Department</InputLabel>
            <Select
              value={newNotice.departmentId}
              label="Department"
              onChange={(e) => setNewNotice({ ...newNotice, departmentId: e.target.value })}
            >
              {departments.map((dept) => (
                <MenuItem key={dept.id} value={dept.id}>
                  {dept.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <Typography>Mark as Important</Typography>
            <FormControlLabel
  control={
    <Switch
      checked={newNotice.isImportant}
      onChange={(e) =>
        setNewNotice({ ...newNotice, isImportant: e.target.checked })
      }
      color="primary"
    />
  }
  label="Mark as Important"
/>

          </Box>

          <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
            <label htmlFor="fileInput">
              <input
                id="fileInput"
                type="file"
                accept="
                  image/*, video/*, audio/*, application/pdf,
                  application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document,
                  application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                  text/plain
                "
                style={{ display: 'none' }}
                onChange={(e) => setSelectedFile(e.target.files[0])}
              />
              <IconButton component="span" sx={{ color: 'rgba(18, 17, 17, 0.7)' }}>
                <CgAttachment />
              </IconButton>
            </label>
            {selectedFile && (
              <Typography variant="body2" sx={{ ml: 1 }}>
                {selectedFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddNotice} variant="contained">Add</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notices;
