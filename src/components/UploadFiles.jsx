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
  FormGroup,
  Typography,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  CloudUpload as CloudUploadIcon,
  Add as AddIcon,
  Image as ImageIcon,
  PictureAsPdf as PdfIcon,
  Description as FileIcon,
  Edit as EditIcon,
} from '@mui/icons-material';

const UploadFiles = () => {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [fileName, setFileName] = useState('');
  const [accessControl, setAccessControl] = useState({
    staff_access: false,
    manager_access: false,
    service_access: false,
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [fileDialogOpen, setFileDialogOpen] = useState(false);
  const [selectedFileUrl, setSelectedFileUrl] = useState('');
  const [unsupportedFile, setUnsupportedFile] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [newFileName, setNewFileName] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from('uploaded_files_view')
      .select('*');
    if (error) {
      showSnackbar(`Error fetching files: ${error.message}`, 'error');
    } else {
      setFiles(data);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleMenuOpen = (event, file) => {
    setAnchorEl(event.currentTarget);
    setSelectedFile(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFile(null);
  };

  const handleDownload = async () => {
    const { data, error } = await supabase.storage.from('files').download(selectedFile.file_path);
    if (error) {
      showSnackbar(`Error downloading file: ${error.message}`, 'error');
    } else {
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = selectedFile.file_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      showSnackbar('File downloaded', 'success');
    }
    handleMenuClose();
  };

  const handleDelete = async () => {
    const { error } = await supabase.from('uploaded_files').delete().eq('file_id', selectedFile.file_id);
    if (error) {
      showSnackbar(`Error deleting file: ${error.message}`, 'error');
    } else {
      await supabase.storage.from('files').remove([selectedFile.file_path]);
      showSnackbar('File deleted successfully', 'success');
      fetchFiles();
      handleMenuClose();
    }
  };

  const handleOpenUploadDialog = () => {
    setUploadDialogOpen(true);
  };

  const handleCloseUploadDialog = () => {
    setUploadDialogOpen(false);
    setSelectedFiles([]);
    setFileName('');
    setAccessControl({
      staff_access: false,
      manager_access: false,
      service_access: false,
    });
  };

  const handleFileChange = (event) => {
    setSelectedFiles(event.target.files);
  };

  const handleFileNameChange = (event) => {
    setFileName(event.target.value);
  };

  const handleAccessControlChange = (event) => {
    const { name, checked } = event.target;
    setAccessControl({ ...accessControl, [name]: checked });
  };

  const handleFileUpload = async () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
      showSnackbar('User not authenticated', 'error');
      return;
    }

    for (const file of selectedFiles) {
      try {
        const uniqueFileName = `${Date.now()}-${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('files')
          .upload(uniqueFileName, file);

        if (uploadError) {
          showSnackbar(`Error uploading file: ${uploadError.message}`, 'error');
          continue;
        }

        const { error: insertError } = await supabase.from('uploaded_files').insert([
          {
            file_name: fileName || file.name,
            file_path: uniqueFileName,
            uploaded_by: user.id,
            ...accessControl,
          },
        ]);

        if (insertError) {
          showSnackbar(`Error saving file metadata: ${insertError.message}`, 'error');
        } else {
          showSnackbar('File uploaded successfully', 'success');
          fetchFiles();
        }
      } catch (error) {
        showSnackbar(`Unexpected error: ${error.message}`, 'error');
      }
    }

    handleCloseUploadDialog();
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

  const handleFilePreview = async (filePath) => {
    const { data, error } = await supabase.storage.from('files').download(filePath);
    if (error) {
      showSnackbar(`Error fetching file: ${error.message}`, 'error');
    } else {
      const url = URL.createObjectURL(data);
      const fileType = data.type;
      setUnsupportedFile(false);

      if (fileType === 'application/pdf') {
        setUnsupportedFile(true);
        setSelectedFileUrl('');
      } else if (fileType.startsWith('image/')) {
        setSelectedFileUrl(url);
      } else {
        setUnsupportedFile(true);
        setSelectedFileUrl('');
      }
      setFileDialogOpen(true);
    }
  };

  const handleCloseFileDialog = () => {
    setFileDialogOpen(false);
    setSelectedFileUrl('');
  };

  const handleEdit = () => {
    setNewFileName(selectedFile.file_name);
    setEditDialogOpen(true);
  };

  const handleEditFileNameChange = (event) => {
    setNewFileName(event.target.value);
  };

  const handleSaveEdit = async () => {
    const { error } = await supabase
      .from('uploaded_files')
      .update({ file_name: newFileName })
      .eq('file_id', selectedFile.file_id);

    if (error) {
      showSnackbar(`Error updating file name: ${error.message}`, 'error');
    } else {
      showSnackbar('File name updated successfully', 'success');
      fetchFiles();
    }

    setEditDialogOpen(false);
    handleMenuClose();
  };

  const getFileIcon = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) {
      return <ImageIcon />;
    } else if (extension === 'pdf') {
      return <PdfIcon />;
    } else {
      return <FileIcon />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <CloudUploadIcon className="text-blue-500" style={{ fontSize: '1.75rem' }} />
              <h1 className="text-xl font-semibold ml-2">Upload Files</h1>
            </div>
            <div className="flex items-center space-x-4">
              <TextField
                type="text"
                placeholder="Search for files"
                value={searchTerm}
                onChange={handleSearch}
                variant="outlined"
                size="small"
                sx={{ pl: 1, pr: 1, py: 1, borderRadius: 2 }}
                autoComplete="off"
              />
              <Tooltip title="Add new file">
                <IconButton
                  className="p-2"
                  onClick={handleOpenUploadDialog}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <AddIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
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
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>File Name</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Uploaded Date</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Uploaded By</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Preview</TableCell>
                <TableCell sx={{ fontWeight: 'bold', color: 'black' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {files
                .filter((file) =>
                  file.file_name.toLowerCase().includes(searchTerm.toLowerCase())
                )
                .map((file) => (
                  <TableRow key={file.file_id} className="bg-white border-b">
                    <TableCell>{file.file_name}</TableCell>
                    <TableCell>{new Date(file.upload_date).toLocaleDateString()}</TableCell>
                    <TableCell>{file.uploaded_by_username}</TableCell>
                    <TableCell>
                      <Tooltip title="Preview file">
                        <IconButton onClick={() => handleFilePreview(file.file_path)}>
                          {getFileIcon(file.file_path)}
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <IconButton onClick={(event) => handleMenuOpen(event, file)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleDownload} sx={{ padding: '12px 20px' }}>
          <ListItemIcon>
            <DownloadIcon fontSize="small" sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText primary="Download file" />
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ padding: '12px 20px' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText primary="Delete file" />
        </MenuItem>
        <MenuItem onClick={handleEdit} sx={{ padding: '12px 20px' }}>
          <ListItemIcon>
            <EditIcon fontSize="small" sx={{ fontSize: '20px' }} />
          </ListItemIcon>
          <ListItemText primary="Edit file name" />
        </MenuItem>
      </Menu>

      <Dialog open={uploadDialogOpen} onClose={handleCloseUploadDialog}>
        <DialogTitle>Upload Files</DialogTitle>
        <DialogContent>
          <TextField
            label="File Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={fileName}
            onChange={handleFileNameChange}
            className="mt-2 mb-4"
          />
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="mt-2 mb-4 w-full text-gray-700 bg-white border border-gray-300 rounded-md p-2 focus:outline-none focus:border-blue-500"
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessControl.staff_access}
                  onChange={handleAccessControlChange}
                  name="staff_access"
                />
              }
              label="Staff Access"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessControl.manager_access}
                  onChange={handleAccessControlChange}
                  name="manager_access"
                />
              }
              label="Manager Access"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={accessControl.service_access}
                  onChange={handleAccessControlChange}
                  name="service_access"
                />
              }
              label="Service Access"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleFileUpload} color="primary">
            Upload
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={fileDialogOpen} onClose={handleCloseFileDialog} maxWidth="sm" fullWidth>
        <DialogTitle>File Preview</DialogTitle>
        <DialogContent>
          {unsupportedFile ? (
            <Typography variant="body1">
              Unsupported file type for preview. Download it to view.
            </Typography>
          ) : selectedFileUrl ? (
            <img src={selectedFileUrl} alt="Preview" style={{ width: '100%', maxHeight: '600px', objectFit: 'contain' }} />
          ) : (
            <Typography variant="body1">
              Unsupported file type for preview. Download it to view.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseFileDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit File Name</DialogTitle>
        <DialogContent>
          <TextField
            label="New File Name"
            variant="outlined"
            fullWidth
            margin="dense"
            value={newFileName}
            onChange={handleEditFileNameChange}
            className="mt-2 mb-4"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSaveEdit} color="primary">
            Save
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

export default UploadFiles;
