import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {
  TextField,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Checkbox,
  FormControlLabel,
  FormControl,
  Box,
  Typography,
  Select,
  InputLabel
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  MoreVert as MoreVertIcon,
  Settings as SettingsIcon,
  FilterList as FilterListIcon,
  Inventory as InventoryIcon,
  Download as DownloadIcon,
  Category as CategoryIcon,
  SubdirectoryArrowRight as SubdirectoryArrowRightIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import BatchDialog from './BatchDialog';  // Adjust the import path as needed

const Stock = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [batches, setBatches] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productDialogOpen, setProductDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [subcategoryDialogOpen, setSubcategoryDialogOpen] = useState(false);
  const [batchDialogOpen, setBatchDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [newSubcategoryCategoryId, setNewSubcategoryCategoryId] = useState('');
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productSubcategory, setProductSubcategory] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productMinStock, setProductMinStock] = useState('');
  const [productMaxStock, setProductMaxStock] = useState('');
  const [productCurrentStock, setProductCurrentStock] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);
  const [filterStockLevel, setFilterStockLevel] = useState('');
  const [visibleColumns, setVisibleColumns] = useState({
    currentStock: true,
    productName: true,
    brand: true,
    category: true,
    subcategory: true,
    price: true,
    minStock: true,
    maxStock: true,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [productToDelete, setProductToDelete] = useState(null);
  const [productAnchorEl, setProductAnchorEl] = useState(null);
  const [selectedProductForMenu, setSelectedProductForMenu] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubcategories();
    fetchBatches();
  }, []);

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) {
      showSnackbar(`Error fetching products: ${error.message}`, 'error');
    } else {
      setProducts(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from('categories').select('*');
    if (error) {
      showSnackbar(`Error fetching categories: ${error.message}`, 'error');
    } else {
      setCategories(data);
    }
  };

  const fetchSubcategories = async () => {
    const { data, error } = await supabase.from('subcategories').select('*');
    if (error) {
      showSnackbar(`Error fetching subcategories: ${error.message}`, 'error');
    } else {
      setSubcategories(data);
    }
  };

  const fetchBatches = async () => {
    const { data, error } = await supabase.from('batches').select('*');
    if (error) {
      showSnackbar(`Error fetching batches: ${error.message}`, 'error');
    } else {
      setBatches(data);
    }
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSettingsAnchorEl(null);
    setFilterAnchorEl(null);
  };

  const handleOpenProductDialog = () => {
    setSelectedProduct(null);
    setProductName('');
    setBrand('');
    setProductCategory('');
    setProductSubcategory('');
    setProductPrice('');
    setProductMinStock('');
    setProductMaxStock('');
    setProductCurrentStock('');
    setProductDialogOpen(true);
    handleMenuClose();
  };

  const handleOpenBatchDialog = () => {
    setBatchDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseBatchDialog = () => {
    setBatchDialogOpen(false);
  };
  const handleOpenCategoryDialog = () => {
    setNewCategoryName('');
    setCategoryDialogOpen(true);
    handleMenuClose();
  };

  const handleOpenSubcategoryDialog = () => {
    setNewSubcategoryName('');
    setNewSubcategoryCategoryId('');
    setSubcategoryDialogOpen(true);
    handleMenuClose();
  };

  const handleCloseProductDialog = () => {
    setProductDialogOpen(false);
  };


  const handleCloseCategoryDialog = () => {
    setCategoryDialogOpen(false);
  };

  const handleCloseSubcategoryDialog = () => {
    setSubcategoryDialogOpen(false);
  };

  const handleAddCategory = async () => {
    const { error } = await supabase.from('categories').insert([{ category_name: newCategoryName }]);
    if (error) {
      showSnackbar(`Error adding category: ${error.message}`, 'error');
    } else {
      showSnackbar('Category added successfully', 'success');
      fetchCategories();
      handleCloseCategoryDialog();
    }
  };

  const handleAddSubcategory = async () => {
    const { error } = await supabase
      .from('subcategories')
      .insert([{ subcategory_name: newSubcategoryName, category_id: newSubcategoryCategoryId }]);
    if (error) {
      showSnackbar(`Error adding subcategory: ${error.message}`, 'error');
    } else {
      showSnackbar('Subcategory added successfully', 'success');
      fetchSubcategories();
      handleCloseSubcategoryDialog();
    }
  };

  const handleSaveProduct = async () => {
    const productData = {
      product_name: productName,
      brand: brand,
      category_id: productCategory,
      subcategory_id: productSubcategory,
      price: parseFloat(productPrice),
      min_stock: parseInt(productMinStock),
      max_stock: parseInt(productMaxStock),
      current_stock: parseInt(productCurrentStock),
    };

    if (selectedProduct) {
      const { error } = await supabase
        .from('products')
        .update(productData)
        .eq('product_id', selectedProduct.product_id);
      if (error) {
        showSnackbar(`Error updating product: ${error.message}`, 'error');
      } else {
        showSnackbar('Product updated successfully', 'success');
        fetchProducts();
        handleCloseProductDialog();
      }
    } else {
      const { error } = await supabase
        .from('products')
        .insert([productData]);
      if (error) {
        showSnackbar(`Error adding product: ${error.message}`, 'error');
      } else {
        showSnackbar('Product added successfully', 'success');
        fetchProducts();
        handleCloseProductDialog();
      }
    }
  };

  const handleSaveBatches = async (batchCode, batchesToAdd) => {
    try {
      const batchData = batchesToAdd.map((batch) => ({
        product_id: batch.productId,
        batch_code: batchCode,
        expiry_date: batch.expiryDate,
        current_stock: parseInt(batch.currentStock),
      }));

      const { error } = await supabase.from('batches').insert(batchData);
      if (error) {
        showSnackbar(`Error adding batches: ${error.message}`, 'error');
      } else {
        showSnackbar('Batches added successfully', 'success');
        fetchBatches();
        fetchProducts(); // Refresh products to update stock levels
        handleCloseBatchDialog();
      }
    } catch (error) {
      showSnackbar(`Error adding batches: ${error.message}`, 'error');
    }};

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setProductName(product.product_name);
    setBrand(product.brand);
    setProductCategory(product.category_id);
    setProductSubcategory(product.subcategory_id);
    setProductPrice(product.price);
    setProductMinStock(product.min_stock);
    setProductMaxStock(product.max_stock);
    setProductCurrentStock(product.current_stock);
    setProductDialogOpen(true);
  };

  const handleDeleteProduct = (product_id) => {
    setProductToDelete(product_id);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    const { error } = await supabase.from('products').delete().eq('product_id', productToDelete);
    if (error) {
      showSnackbar(`Error deleting product: ${error.message}`, 'error');
    } else {
      showSnackbar('Product deleted successfully', 'success');
      fetchProducts();
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  const getCurrentStockColor = (current, min, max) => {
    if (current <= min) return 'red';
    if (current > min && current <= max * 0.5) return 'darkorange';
    if (current > max * 0.5 && current < max) return 'yellowgreen';
    if (current >= max) return 'green';
    return 'gray';
  };

  const handleVisibleColumnChange = (event) => {
    setVisibleColumns({ ...visibleColumns, [event.target.name]: event.target.checked });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStockLevel(event.target.value);
  };

  const handleDownloadProductData = () => {
    const data = products.map(product => ({
      'Product Name': product.product_name,
      'Brand': product.brand,
      'Category': categories.find(cat => cat.category_id === product.category_id)?.category_name,
      'Subcategory': subcategories.find(sub => sub.subcategory_id === product.subcategory_id)?.subcategory_name,
      'Price': product.price,
      'Min Stock': product.min_stock,
      'Max Stock': product.max_stock,
      'Current Stock': getTotalStock(product.product_id),
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleProductMenuOpen = (event, product) => {
    setProductAnchorEl(event.currentTarget);
    setSelectedProductForMenu(product);
  };

  const handleProductMenuClose = () => {
    setProductAnchorEl(null);
    setSelectedProductForMenu(null);
  };

  const getTotalStock = (productId) => {
    return batches
      .filter(batch => batch.product_id === productId)
      .reduce((total, batch) => total + batch.current_stock, 0);
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearchTerm =
      product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      categories.find((cat) => cat.category_id === product.category_id)?.category_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subcategories.find((sub) => sub.subcategory_id === product.subcategory_id)?.subcategory_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.price.toString().includes(searchTerm.toLowerCase()) ||
      product.min_stock.toString().includes(searchTerm.toLowerCase()) ||
      product.max_stock.toString().includes(searchTerm.toLowerCase()) ||
      getTotalStock(product.product_id).toString().includes(searchTerm.toLowerCase());

    if (filterStockLevel) {
      const color = getCurrentStockColor(getTotalStock(product.product_id), product.min_stock, product.max_stock);
      return matchesSearchTerm && color === filterStockLevel;
    }
    return matchesSearchTerm;
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <StorageIcon className="text-blue-500" style={{ fontSize: '1.75rem' }} />
              <h1 className="text-xl font-semibold ml-2">Stock</h1>
            </div>
            <div className="flex items-center space-x-4">
              <TextField
                variant="outlined"
                placeholder="Search products..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
              />
              <Tooltip title="Download">
                <IconButton
                  onClick={handleDownloadProductData}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <DownloadIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add">
                <IconButton onClick={handleMenuOpen} style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}>
                  <AddIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton onClick={handleFilterMenuOpen} style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}>
                  <FilterListIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton onClick={handleSettingsMenuOpen} style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}>
                  <SettingsIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleOpenProductDialog} sx={{ padding: '12px 24px' }}>
                  <ListItemIcon>
                    <AddIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Add Product" />
                </MenuItem>
                <MenuItem onClick={handleOpenCategoryDialog} sx={{ padding: '12px 24px' }}>
                  <ListItemIcon>
                    <CategoryIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Add Category" />
                </MenuItem>
                <MenuItem onClick={handleOpenSubcategoryDialog} sx={{ padding: '12px 24px' }}>
                  <ListItemIcon>
                    <SubdirectoryArrowRightIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Add Subcategory" />
                </MenuItem>
                <MenuItem onClick={handleOpenBatchDialog} sx={{ padding: '12px 24px' }}>
                  <ListItemIcon>
                    <InventoryIcon fontSize="medium" />
                  </ListItemIcon>
                  <ListItemText primary="Add Batch" />
                </MenuItem>
              </Menu>
              <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { handleFilterChange({ target: { value: '' } }); handleMenuClose(); }}>
                  All
                </MenuItem>
                <MenuItem onClick={() => { handleFilterChange({ target: { value: 'red' } }); handleMenuClose(); }}>
                  Low Stock
                </MenuItem>
                <MenuItem onClick={() => { handleFilterChange({ target: { value: 'darkorange' } }); handleMenuClose(); }}>
                  Medium-Low Stock
                </MenuItem>
                <MenuItem onClick={() => { handleFilterChange({ target: { value: 'yellowgreen' } }); handleMenuClose(); }}>
                  Medium-High Stock
                </MenuItem>
                <MenuItem onClick={() => { handleFilterChange({ target: { value: 'green' } }); handleMenuClose(); }}>
                  High Stock
                </MenuItem>
              </Menu>
              <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleMenuClose}>
                <Box sx={{ p: 2 }}>
                  <FormControl component="fieldset" variant="standard">
                    {Object.entries(visibleColumns).map(([key, value]) => (
                      <FormControlLabel
                        key={key}
                        control={
                          <Checkbox
                            checked={value}
                            onChange={handleVisibleColumnChange}
                            name={key}
                          />
                        }
                        label={key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}
                      />
                    ))}
                  </FormControl>
                </Box>
              </Menu>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow p-4 space-x-4 overflow-x-auto">
        <TableContainer component={Paper} className="shadow-md sm:rounded-lg overflow-auto">
          <Table stickyHeader className="min-w-full">
            <TableHead>
              <TableRow>
                {Object.entries(visibleColumns).map(([key, value]) =>
                  value && <TableCell key={key} sx={{ fontWeight: 'bold', color: 'black' }}>{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim()}</TableCell>
                )}
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.product_id} className="bg-white border-b">
                  {visibleColumns.currentStock && (
               
                    <TableCell
                      sx={{ fontWeight: 'bold', color: getCurrentStockColor(product.current_stock, product.min_stock, product.max_stock) }}
                    >
                      {product.current_stock}
                    </TableCell>
                                    )}
                  
                  {visibleColumns.productName && <TableCell>{product.product_name}</TableCell>}
                  {visibleColumns.brand && <TableCell>{product.brand}</TableCell>}
                  {visibleColumns.category && <TableCell>{categories.find((cat) => cat.category_id === product.category_id)?.category_name}</TableCell>}
                  {visibleColumns.subcategory && <TableCell>{subcategories.find((sub) => sub.subcategory_id === product.subcategory_id)?.subcategory_name}</TableCell>}
                  {visibleColumns.price && <TableCell>{product.price}</TableCell>}
                  {visibleColumns.minStock && <TableCell>{product.min_stock}</TableCell>}
                  {visibleColumns.maxStock && <TableCell>{product.max_stock}</TableCell>}
                  <TableCell>
                    <Tooltip title="More options">
                      <IconButton onClick={(event) => handleProductMenuOpen(event, product)}>
                        <MoreVertIcon />
                      </IconButton>
                    </Tooltip>
                    <Menu
                      anchorEl={productAnchorEl}
                      open={Boolean(productAnchorEl && selectedProductForMenu?.product_id === product.product_id)}
                      onClose={handleProductMenuClose}
                    >
                      <MenuItem onClick={() => { handleEditProduct(product); handleProductMenuClose(); }}>
                        <ListItemIcon>
                          <EditIcon />
                        </ListItemIcon>
                        <ListItemText primary="Edit" />
                      </MenuItem>
                      <MenuItem onClick={() => { handleDeleteProduct(product.product_id); handleProductMenuClose(); }}>
                        <ListItemIcon>
                          <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText primary="Delete" />
                      </MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Dialog open={productDialogOpen} onClose={handleCloseProductDialog} fullWidth maxWidth="sm">
        <DialogTitle>{selectedProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Product Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
            <TextField
              label="Brand"
              variant="outlined"
              fullWidth
              margin="dense"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={productCategory}
                onChange={(e) => setProductCategory(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel>Subcategory</InputLabel>
              <Select
                value={productSubcategory}
                onChange={(e) => setProductSubcategory(e.target.value)}
                label="Subcategory"
              >
                {subcategories
                  .filter((sub) => sub.category_id === productCategory)
                  .map((subcategory) => (
                    <MenuItem key={subcategory.subcategory_id} value={subcategory.subcategory_id}>
                      {subcategory.subcategory_name}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Price"
              variant="outlined"
              fullWidth
              margin="dense"
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
            />
            <TextField
              label="Min Stock"
              variant="outlined"
              fullWidth
              margin="dense"
              type="number"
              value={productMinStock}
              onChange={(e) => setProductMinStock(e.target.value)}
            />
            <TextField
              label="Max Stock"
              variant="outlined"
              fullWidth
              margin="dense"
              type="number"
              value={productMaxStock}
              onChange={(e) => setProductMaxStock(e.target.value)}
            />
            <TextField
              label="Current Stock"
              variant="outlined"
              fullWidth
              margin="dense"
              type="number"
              value={productCurrentStock}
              onChange={(e) => setProductCurrentStock(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseProductDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveProduct} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <BatchDialog
        open={batchDialogOpen}
        onClose={handleCloseBatchDialog}
        onSave={handleSaveBatches}
        products={products}
      />


      <Dialog open={categoryDialogOpen} onClose={handleCloseCategoryDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Category Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCategoryDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={subcategoryDialogOpen} onClose={handleCloseSubcategoryDialog} fullWidth maxWidth="sm">
        <DialogTitle>Add Subcategory</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Subcategory Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={newSubcategoryName}
              onChange={(e) => setNewSubcategoryName(e.target.value)}
            />
            <FormControl fullWidth margin="dense">
              <InputLabel>Category</InputLabel>
              <Select
                value={newSubcategoryCategoryId}
                onChange={(e) => setNewSubcategoryCategoryId(e.target.value)}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.category_id} value={category.category_id}>
                    {category.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubcategoryDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddSubcategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog} fullWidth maxWidth="sm">
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography>Are you sure you want to delete this product?</Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={confirmDeleteProduct} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Stock;
