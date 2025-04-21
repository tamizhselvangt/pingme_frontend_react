import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import axios from 'axios';

const Departments = () => {

  const url = "http://localhost:8080";
  const [departments, setDepartments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get(`${url}/api/departments/all`);
      setDepartments(response.data);
    } catch (error) {
      enqueueSnackbar('Error fetching departments', { variant: 'error' });
    }
  };

  const handleAddDepartment = async () => {
    try {
      await axios.post(`${url}/api/departments/add`, {
        name: newDepartment,
      });
      setNewDepartment('');
      setOpenDialog(false);
      fetchDepartments();
      enqueueSnackbar('Department added successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error adding department', { variant: 'error' });
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
        await axios.delete(`${url}/api/departments/remove/${departmentId}`);
      fetchDepartments();
      enqueueSnackbar('Department deleted successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Error deleting department', { variant: 'error' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Departments</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
        >
          Add Department
        </Button>
      </Box>

      <Card>
        <CardContent>
          <List>
            {departments.map((department) => (
              <ListItem key={department.id}>
                <ListItemText primary={department.name} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    onClick={() => handleDeleteDepartment(department.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Add New Department</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Department Name"
            fullWidth
            value={newDepartment}
            onChange={(e) => setNewDepartment(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleAddDepartment} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Departments; 
