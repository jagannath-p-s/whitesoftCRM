import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Typography,
  Grid,
  Container,
  Divider
} from '@mui/material';
import { CloudDownload as CloudDownloadIcon } from '@mui/icons-material';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Dash = () => {
  const [bills, setBills] = useState([]);
  const [filters, setFilters] = useState({
    mobileNumber: '',
    jobCardNumber: '',
    customerName: '',
  });
  const [sortOption, setSortOption] = useState('');

  useEffect(() => {
    fetchBills();
  }, [filters, sortOption]);

  const fetchBills = async () => {
    let query = supabase.from('printed_bills').select('*');

    if (filters.mobileNumber) {
      query = query.ilike('mobile_number', `%${filters.mobileNumber}%`);
    }
    if (filters.jobCardNumber) {
      query = query.ilike('job_card_number', `%${filters.jobCardNumber}%`);
    }
    if (filters.customerName) {
      query = query.ilike('customer_name', `%${filters.customerName}%`);
    }

    if (sortOption) {
      query = query.order('waiting_number', { ascending: sortOption === 'asc' });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching bills:', error);
    } else {
      setBills(data);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Customer Name", "Mobile Number", "Job Card Number", "Waiting Number", "Pipeline Name", "Invoiced", "Collected"];
    const tableRows = [];

    bills.forEach(bill => {
      const billData = [
        bill.customer_name,
        bill.mobile_number,
        bill.job_card_number,
        bill.waiting_number,
        bill.pipeline_name,
        bill.invoiced ? 'Yes' : 'No',
        bill.collected ? 'Yes' : 'No'
      ];
      tableRows.push(billData);
    });

    doc.autoTable(tableColumn, tableRows, { startY: 20 });
    doc.text("Printed Bills Report", 14, 15);
    doc.save('printed_bills_report.pdf');
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom component="div" sx={{ mb: 4 }}>
          Printed Bills Dashboard
        </Typography>
        
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="mobileNumber"
              label="Mobile Number"
              variant="outlined"
              value={filters.mobileNumber}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="jobCardNumber"
              label="Job Card Number"
              variant="outlined"
              value={filters.jobCardNumber}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              name="customerName"
              label="Customer Name"
              variant="outlined"
              value={filters.customerName}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth variant="outlined">
              <InputLabel>Sort By</InputLabel>
              <Select value={sortOption} onChange={handleSortChange} label="Sort By">
                <MenuItem value="asc">Waiting Number (ASC)</MenuItem>
                <MenuItem value="desc">Waiting Number (DESC)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudDownloadIcon />}
            onClick={downloadPDF}
          >
            Download as PDF
          </Button>
        </Box>
        
        <Divider sx={{ mb: 3 }} />
        
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="printed bills table">
            <TableHead>
              <TableRow>
                <TableCell>Customer Name</TableCell>
                <TableCell>Mobile Number</TableCell>
                <TableCell>Job Card Number</TableCell>
                <TableCell>Waiting Number</TableCell>
                <TableCell>Pipeline Name</TableCell>
                <TableCell>Invoiced</TableCell>
                <TableCell>Collected</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bills.map((bill) => (
                <TableRow key={bill.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                  <TableCell component="th" scope="row">{bill.customer_name}</TableCell>
                  <TableCell>{bill.mobile_number}</TableCell>
                  <TableCell>{bill.job_card_number}</TableCell>
                  <TableCell>{bill.waiting_number}</TableCell>
                  <TableCell>{bill.pipeline_name}</TableCell>
                  <TableCell>{bill.invoiced ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{bill.collected ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default Dash;