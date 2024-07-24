import React, { useState, useEffect } from 'react';
import {
  Box, Button, TextField, Typography, IconButton, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, FormControl, InputLabel, Select, MenuItem, Chip
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { supabase } from '../supabaseClient'; // Adjust the path as needed
import ServiceEnquiryDialog from './ServiceEnquiryDialog'; // Renamed from AddServiceEnquiryDialog

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const Services = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [filteredEnquiries, setFilteredEnquiries] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [technicianFilter, setTechnicianFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEnquiry, setEditingEnquiry] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  useEffect(() => {
    filterEnquiries();
  }, [searchTerm, technicianFilter, statusFilter, enquiries]);

  const fetchEnquiries = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('service_enquiries')
        .select('*, service_enquiry_parts(*)');
      if (error) throw error;
      setEnquiries(data);
      setFilteredEnquiries(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const filterEnquiries = () => {
    let filtered = enquiries;
    if (searchTerm) {
      filtered = filtered.filter(enquiry =>
        enquiry.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enquiry.customer_mobile.includes(searchTerm) ||
        enquiry.job_card_no.includes(searchTerm)
      );
    }
    if (technicianFilter) {
      filtered = filtered.filter(enquiry => enquiry.technician_name === technicianFilter);
    }
    if (statusFilter) {
      filtered = filtered.filter(enquiry => enquiry.status === statusFilter);
    }
    setFilteredEnquiries(filtered);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTechnicianFilterChange = (e) => {
    setTechnicianFilter(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleAddEnquiryClick = () => {
    setEditingEnquiry(null);
    setDialogOpen(true);
  };

  const handleEditEnquiry = (enquiry) => {
    setEditingEnquiry(enquiry);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditingEnquiry(null);
  };

  const handleFormSubmit = () => {
    fetchEnquiries();
    handleDialogClose();
  };

  const handleDeleteEnquiry = async (id) => {
    if (window.confirm('Are you sure you want to delete this enquiry?')) {
      try {
        const { error } = await supabase
          .from('service_enquiries')
          .delete()
          .eq('id', id);
        if (error) throw error;
        fetchEnquiries();
      } catch (error) {
        console.error('Error deleting enquiry:', error);
      }
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ maxWidth: 1200, margin: 'auto', p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Service Enquiries
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Search"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: <SearchIcon />
            }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Technician</InputLabel>
            <Select
              value={technicianFilter}
              onChange={handleTechnicianFilterChange}
              label="Technician"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              {Array.from(new Set(enquiries.map(e => e.technician_name))).map(tech => (
                <MenuItem key={tech} value={tech}>{tech}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              label="Status"
            >
              <MenuItem value=""><em>None</em></MenuItem>
              <MenuItem value="started">Started</MenuItem>
              <MenuItem value="ongoing">Ongoing</MenuItem>
              <MenuItem value="paused">Paused</MenuItem>
              <MenuItem value="paused due to parts unavailability">Paused due to Parts Unavailability</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Date</StyledTableCell>
              <StyledTableCell>Job Card No</StyledTableCell>
              <StyledTableCell>Customer Name</StyledTableCell>
              <StyledTableCell>Customer Mobile</StyledTableCell>
              <StyledTableCell>Technician</StyledTableCell>
              <StyledTableCell>Total Amount</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredEnquiries.map(enquiry => (
              <StyledTableRow key={enquiry.id}>
                <TableCell>{new Date(enquiry.date).toLocaleDateString()}</TableCell>
                <TableCell>{enquiry.job_card_no}</TableCell>
                <TableCell>{enquiry.customer_name}</TableCell>
                <TableCell>{enquiry.customer_mobile}</TableCell>
                <TableCell>{enquiry.technician_name}</TableCell>
                <TableCell>₹{enquiry.total_amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Chip 
                    label={enquiry.status} 
                    color={enquiry.status === 'completed' ? 'success' : enquiry.status.includes('paused') ? 'warning' : 'primary'}
                  />
                </TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditEnquiry(enquiry)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteEnquiry(enquiry.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ServiceEnquiryDialog
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
        handleFormSubmit={handleFormSubmit}
        editingEnquiry={editingEnquiry}
      />
    </Box>
  );
};

export default Services;
