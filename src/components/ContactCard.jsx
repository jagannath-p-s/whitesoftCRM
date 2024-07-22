import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import CommentIcon from '@mui/icons-material/Comment';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AddTaskDialog from './AddTaskDialog'; // Ensure this path is correct

const ContactCard = ({ contact, user, color, visibleFields }) => {
  const [open, setOpen] = useState(false);
  const [addTaskOpen, setAddTaskOpen] = useState(false);

  const userInitial = user?.username ? user.username.charAt(0).toUpperCase() : 'J';
  const username = user?.username ? user.username : 'Unknown User';

  const handleInitialClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAddClick = () => {
    setAddTaskOpen(true);
  };

  const handleAddTaskClose = () => {
    setAddTaskOpen(false);
  };

  const getTextColorClass = (color) => {
    switch (color) {
      case 'blue':
        return 'text-blue-600';
      case 'red':
        return 'text-red-600';
      case 'green':
        return 'text-green-600';
      case 'yellow':
        return 'text-yellow-600';
      case 'purple':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const parseProducts = (products) => {
    if (!products) return {};
    try {
      return JSON.parse(products.replace(/""/g, '"'));
    } catch (error) {
      console.error('Error parsing products:', error);
      return {};
    }
  };

  const products = parseProducts(contact?.products);

  if (!contact || !user) {
    return <div>Error: contact or user data is missing.</div>;
  }

  return (
    <div className="mb-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 flex flex-col justify-between">
      <div>
        {visibleFields.name && <div className={`text-sm font-bold ${getTextColorClass(color)} mb-2`}>{contact.name}</div>}
        {visibleFields.mobilenumber1 && <p className="text-sm mb-1">Contact No: {contact.mobilenumber1}</p>}
        {visibleFields.mobilenumber2 && <p className="text-sm mb-1">Contact No 2: {contact.mobilenumber2}</p>}
        {visibleFields.address && <p className="text-sm mb-1">Address: {contact.address}</p>}
        {visibleFields.location && <p className="text-sm mb-1">Location: {contact.location}</p>}
        {visibleFields.stage && <p className="text-sm mb-1">Stage: {contact.stage}</p>}
        {visibleFields.mailid && <p className="text-sm mb-1">Email: {contact.mailid}</p>}
        {visibleFields.leadsource && <p className="text-sm mb-1">Lead Source: {contact.leadsource}</p>}
        {visibleFields.assignedto && <p className="text-sm mb-1">Assigned To: {username}</p>}
        {visibleFields.remarks && <p className="text-sm mb-1">Remarks: {contact.remarks}</p>}
        {visibleFields.priority && <p className="text-sm mb-1">Priority: {contact.priority}</p>}
        {visibleFields.invoiced && <p className="text-sm mb-1">Invoiced: {contact.invoiced ? 'Yes' : 'No'}</p>}
        {visibleFields.collected && <p className="text-sm mb-1">Collected: {contact.collected ? 'Yes' : 'No'}</p>}
        {visibleFields.created_at && <p className="text-sm mb-1">Date Created: {new Date(contact.created_at).toLocaleDateString()}</p>}
        {visibleFields.salesflow_code && <p className="text-sm mb-1">Salesflow Code: {contact.salesflow_code}</p>}
        {visibleFields.products && Object.values(products).length > 0 && (
          <Box mt={2}>
            <Typography variant="body2">Products:</Typography>
            {Object.values(products).map((product) => (
              <Chip 
                key={product.product_id}
                label={`${product.product_name} (${product.quantity})`}
                size="small"
                sx={{ mr: 1, mt: 1 }}
              />
            ))}
          </Box>
        )}
      </div>
      <div className="flex justify-end items-center space-x-2 mt-2">
        <Tooltip title="Add">
          <button className="p-1 rounded-full hover:bg-gray-200" onClick={handleAddClick}>
            <AddIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Edit">
          <button className="p-1 rounded-full hover:bg-gray-200">
            <EditIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Comment">
          <button className="p-1 rounded-full hover:bg-gray-200">
            <CommentIcon fontSize="small" />
          </button>
        </Tooltip>
        <Tooltip title="Assigned To">
          <div 
            className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center cursor-pointer"
            onClick={handleInitialClick}
          >
            {userInitial}
          </div>
        </Tooltip>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Assigned To</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {username}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <AddTaskDialog
        open={addTaskOpen}
        handleClose={handleAddTaskClose}
        enquiryId={contact.id}
        assignedBy={user.id}
      />
    </div>
  );
};

export default ContactCard;