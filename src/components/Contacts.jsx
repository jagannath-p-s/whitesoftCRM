import React, { useState, useEffect } from 'react';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';
import ViewListIcon from '@mui/icons-material/ViewList';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import DownloadIcon from '@mui/icons-material/Download';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import { supabase } from '../supabaseClient';
import ContactTable from './ContactTable';

const Contacts = () => {
  const [view, setView] = useState('cards');
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [settingsAnchorEl, setSettingsAnchorEl] = useState(null);
  const [filterAnchorEl, setFilterAnchorEl] = useState(null);

  useEffect(() => {
    const fetchContacts = async () => {
      const { data, error } = await supabase
        .from('customer_common_info')
        .select('*');

      if (error) {
        console.error('Error fetching contacts:', error);
      } else {
        setContacts(data);
      }
    };

    fetchContacts();
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSettingsAnchorEl(null);
    setFilterAnchorEl(null);
  };

  const handleSettingsMenuOpen = (event) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleFilterMenuOpen = (event) => {
    setFilterAnchorEl(event.currentTarget);
  };

  const handleDownloadContacts = () => {
    const data = contacts.map((contact) => ({
      Name: contact.name,
      'Mobile Number 1': contact.mobilenumber1,
      'Mobile Number 2': contact.mobilenumber2,
      Address: contact.address,
      Location: contact.location,
      Email: contact.mailid,
    }));

    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <PeopleOutlineIcon className="text-blue-500" style={{ fontSize: '1.75rem' }} />
              <h1 className="text-xl font-semibold ml-2">Contacts</h1>
            </div>
            <div className="flex items-center space-x-2">
              <TextField
                variant="outlined"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
              />
              <Tooltip title="Download">
                <IconButton
                  onClick={handleDownloadContacts}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <DownloadIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Filter">
                <IconButton
                  onClick={handleFilterMenuOpen}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <FilterListIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Settings">
                <IconButton
                  onClick={handleSettingsMenuOpen}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <SettingsOutlinedIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
              <Tooltip title={view === 'cards' ? "Table View" : "Card View"}>
                <IconButton
                  onClick={() => setView(view === 'cards' ? 'table' : 'cards')}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  {view === 'cards' ? (
                    <TableChartOutlinedIcon style={{ fontSize: '1.75rem' }} />
                  ) : (
                    <ViewListIcon style={{ fontSize: '1.75rem' }} />
                  )}
                </IconButton>
              </Tooltip>
              <Tooltip title="Upload">
                <IconButton
                  onClick={handleMenuOpen}
                  style={{ backgroundColor: '#e3f2fd', color: '#1e88e5', borderRadius: '12px' }}
                >
                  <FileUploadOutlinedIcon style={{ fontSize: '1.75rem' }} />
                </IconButton>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col p-4">
        {view === 'cards' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredContacts.map((contact, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold">{contact.name}</h2>
                  <p className="text-sm text-gray-600">Primary Contact: {contact.mobilenumber1}</p>
                  {contact.mobilenumber2 && <p className="text-sm text-gray-600">Secondary Contact: {contact.mobilenumber2}</p>}
                  <p className="text-sm text-gray-600">Email: {contact.mailid}</p>
                  <p className="text-sm text-gray-600">Address: {contact.address}</p>
                  <p className="text-sm text-gray-600">Location: {contact.location}</p>
                </div>
                <div className="mt-4">
                  <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
                    Add New Purchase
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ContactTable contacts={filteredContacts} />
        )}
      </div>

      {/* Menus */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Upload Contacts</MenuItem>
      </Menu>
      <Menu anchorEl={settingsAnchorEl} open={Boolean(settingsAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
      </Menu>
      <Menu anchorEl={filterAnchorEl} open={Boolean(filterAnchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleMenuClose}>Filter Options</MenuItem>
      </Menu>
    </div>
  );
};

export default Contacts;
