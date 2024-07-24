import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';

const PrintBillDialog = ({ open, handleClose, customer }) => {
  if (!customer) return null;

  const handlePrint = () => {
    // Implement the print functionality
    window.print();
    handleClose(true);
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

  const products = parseProducts(customer.products);

  return (
    <Dialog open={open} onClose={() => handleClose(false)}>
      <DialogTitle>Print Bill</DialogTitle>
      <DialogContent>
        <div>
          <p><strong>Customer Name:</strong> {customer.name}</p>
          <p><strong>Mobile Number:</strong> {customer.mobilenumber1}</p>
          <p><strong>Date Added:</strong> {new Date(customer.created_at).toLocaleDateString()}</p>
          <p><strong>Products:</strong></p>
          {Object.values(products).map((product) => (
            <Chip
              key={product.product_id}
              label={`${product.product_name} (${product.quantity})`}
              size="small"
              style={{ marginRight: '8px', marginBottom: '8px' }}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handlePrint} color="primary">
          Print
        </Button>
        <Button onClick={() => handleClose(false)} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PrintBillDialog;
