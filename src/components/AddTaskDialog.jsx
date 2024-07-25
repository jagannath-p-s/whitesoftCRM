import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  Box
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import dayjs from 'dayjs';

const AddTaskDialog = ({ open, handleClose, enquiryId, assignedBy }) => {
  const [taskName, setTaskName] = useState('');
  const [taskMessage, setTaskMessage] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [dateTimeOption, setDateTimeOption] = useState('days');
  const [daysToComplete, setDaysToComplete] = useState('');
  const [submissionDate, setSubmissionDate] = useState(dayjs());

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('users')
        .select('id, username');

      if (error) {
        console.error('Error fetching users:', error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const handleSubmit = async () => {
    const calculatedSubmissionDate = dateTimeOption === 'days'
      ? dayjs().add(daysToComplete, 'day')
      : submissionDate;

    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert({
          task_name: taskName,
          task_message: taskMessage,
          enquiry_id: enquiryId,
          type: 'product',
          assigned_by: assignedBy,
          assigned_to: assignedTo,
          submission_date: calculatedSubmissionDate.toISOString()
        });

      if (error) throw error;
      console.log('Task added successfully:', data);
      handleClose();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            type="text"
            fullWidth
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Task Message"
            type="text"
            fullWidth
            multiline
            rows={4}
            value={taskMessage}
            onChange={(e) => setTaskMessage(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Assigned To</InputLabel>
            <Select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl component="fieldset" fullWidth margin="dense">
            <RadioGroup
              value={dateTimeOption}
              onChange={(e) => setDateTimeOption(e.target.value)}
            >
              <FormControlLabel
                value="days"
                control={<Radio />}
                label="Days to Complete"
              />
              <FormControlLabel
                value="datetime"
                control={<Radio />}
                label="Pick Date & Time"
              />
            </RadioGroup>
          </FormControl>
          {dateTimeOption === 'days' ? (
            <TextField
              margin="dense"
              label="Days to Complete"
              type="number"
              fullWidth
              value={daysToComplete}
              onChange={(e) => setDaysToComplete(e.target.value)}
            />
          ) : (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <StaticDateTimePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                value={submissionDate}
                onChange={(newValue) => setSubmissionDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Task</Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default AddTaskDialog;
