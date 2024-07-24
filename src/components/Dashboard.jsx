import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Select, MenuItem, InputLabel, FormControl, Box, Typography, Grid, Paper, TextField } from '@mui/material';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import { DatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { supabase } from '../supabaseClient'; // Adjust the path as needed


// Mock data
const mockData = {
  products: [
    { name: 'Agricultural Chaff Cutter VP-01 With 2HP BN & Acces', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 120 },
    { name: 'Agricultural Chaff Cutter VP-01 With 2HP SM & Acces', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 98 },
    { name: 'Agricultural Chaffcutter VP-02', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 86 },
    { name: 'Agricultural Chaff Cutter VP-02 With 2HP SM & Acces', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 99 },
    { name: 'Agricultural Chaff Cutter VP-03', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 85 },
    { name: 'Agricultural Chaff Cutter VP-03 with 2HP Sm&Acc', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 65 },
    { name: 'Agricultural Chaff Cutter VP-04', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 74 },
    { name: 'Agricultural Chaffcutter VP-01', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 79 },
    { name: 'Agricultural chaff cutter VP-01 with 1.5 Hp SM&Acc', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 62 },
    { name: 'Agricultural Chaff Cutter VP-05', subcategory: 'Chaffcutter', category: 'Agriculture Machinery', sales: 55 },
    { name: '110x90 Reducer Bush', subcategory: 'Reducer', category: 'Irrigation', sales: 90 },
    { name: '1 1/4 Clamb Ss Original', subcategory: 'Clamp', category: 'Irrigation', sales: 85 },
    { name: '12mm Bit', subcategory: 'Spare Part', category: 'Spares', sales: 80 },
    { name: '12mm Drillbit Neta Type SDI', subcategory: 'Spare Part', category: 'Spares', sales: 75 },
    { name: '12MM Joiner Black SDI', subcategory: 'Spare Part', category: 'Spares', sales: 70 },
    { name: '12x8 Reduser Tee', subcategory: 'Reducer', category: 'Irrigation', sales: 65 },
    { name: '16mm C Stake', subcategory: 'Spare Part', category: 'Spares', sales: 60 },
    { name: '16mm Drill Bit Neta Type SDI', subcategory: 'Spare Part', category: 'Spares', sales: 55 },
    { name: 'Air Bleed Milk Claw (DL)', subcategory: 'Milk Claw', category: 'Dairy', sales: 50 },
    { name: 'Air Pulsator AP 19 (DL)', subcategory: 'Pulsator', category: 'Dairy', sales: 45 },
    { name: 'AP 19 Pulsator Lid', subcategory: 'Pulsator', category: 'Dairy', sales: 40 },
    { name: 'Bio Foam 1 Ltr (DL)', subcategory: 'Pulsator', category: 'Dairy', sales: 35 },
    { name: 'Biofoam Plus 10 L (DL)', subcategory: 'Pulsator', category: 'Dairy', sales: 30 },
    { name: 'BMS DVP 170 1ph (Mc11, Ap19, Bucket 25L)-Delaval', subcategory: 'Pulsator', category: 'Dairy', sales: 25 },
    { name: 'BMS DVP 340 (2 BMM, 1ph 50hz)- Delaval', subcategory: 'Pulsator', category: 'Dairy', sales: 20 },
    { name: 'Bottle Kit for Lubricator (DL)', subcategory: 'Pulsator', category: 'Dairy', sales: 15 },
    { name: 'Bowl Complete MC 11 (DL)', subcategory: 'Pulsator', category: 'Dairy', sales: 10 },
    { name: 'Bowl Milk Claw MC 11 (DL)', subcategory: 'Milk Claw', category: 'Dairy', sales: 5 },
  ],
  topSalesmen: {
    daily: [
      { name: 'Sanoop', sales: 20 },
      { name: 'Sijosh', sales: 18 },
      { name: 'Sruthi', sales: 22 },
      { name: 'Sumi', sales: 14 },
      { name: 'Sajana', sales: 16 },
    ],
    weekly: [
      { name: 'Sanoop', sales: 140 },
      { name: 'Sijosh', sales: 126 },
      { name: 'Sruthi', sales: 154 },
      { name: 'Sumi', sales: 98 },
      { name: 'Sajana', sales: 112 },
    ],
    monthly: [
      { name: 'Sanoop', sales: 600 },
      { name: 'Sijosh', sales: 540 },
      { name: 'Sruthi', sales: 660 },
      { name: 'Sumi', sales: 420 },
      { name: 'Sajana', sales: 480 },
    ],
    yearly: [
      { name: 'Sanoop', sales: 7200 },
      { name: 'Sijosh', sales: 6480 },
      { name: 'Sruthi', sales: 7920 },
      { name: 'Sumi', sales: 5040 },
      { name: 'Sajana', sales: 5760 },
    ],
  },
  salesReport: {
    daily: [
      { date: '2024-07-01', sales: 2400 },
      { date: '2024-07-02', sales: 1398 },
      { date: '2024-07-03', sales: 9800 },
      { date: '2024-07-04', sales: 3908 },
      { date: '2024-07-05', sales: 4800 },
      { date: '2024-07-06', sales: 3800 },
      { date: '2024-07-07', sales: 4300 },
    ],
    monthly: [
      { month: 'Jan', sales: 4000 },
      { month: 'Feb', sales: 3000 },
      { month: 'Mar', sales: 5000 },
      { month: 'Apr', sales: 4500 },
      { month: 'May', sales: 6000 },
      { month: 'Jun', sales: 5500 },
      { month: 'Jul', sales: 7000 },
    ],
    yearly: [
      { year: '2020', sales: 30000 },
      { year: '2021', sales: 35000 },
      { year: '2022', sales: 40000 },
      { year: '2023', sales: 45000 },
      { year: '2024', sales: 50000 },
    ],
  },
};


const Dashboard = () => {
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [subcategoryFilter, setSubcategoryFilter] = useState('All');
  const [salesReportType, setSalesReportType] = useState('daily');
  const [salesmanTimeFrame, setSalesmanTimeFrame] = useState('daily');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [serviceIncome, setServiceIncome] = useState({});
  const [technicianPerformance, setTechnicianPerformance] = useState([]);

  const categories = ['All', ...new Set(mockData.products.map(product => product.category))];
  const subcategories = ['All', ...new Set(mockData.products.filter(product => categoryFilter === 'All' || product.category === categoryFilter).map(product => product.subcategory))];

  const filteredProducts = mockData.products.filter(product =>
    (categoryFilter === 'All' || product.category === categoryFilter) &&
    (subcategoryFilter === 'All' || product.subcategory === subcategoryFilter)
  );

  const salesReportData = mockData.salesReport[salesReportType];
  const topSalesmenData = mockData.topSalesmen[salesmanTimeFrame];

  const handleDateChange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  const applyDateFilter = (data) => {
    if (!startDate || !endDate) return data;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return data.filter(item => {
      const date = new Date(item.date || item.month || item.year).getTime();
      return date >= start && date <= end;
    });
  };

  const filteredSalesReportData = applyDateFilter(salesReportData);

  useEffect(() => {
    const fetchServiceData = async () => {
      const { data, error } = await supabase
        .from('service_enquiries')
        .select('total_amount, technician_name');
      if (error) {
        console.error('Error fetching service data:', error);
      } else {
        const income = data.reduce((acc, enquiry) => {
          acc.total += enquiry.total_amount;
          acc.today += enquiry.total_amount; // Adjust this logic based on real "today" filter
          acc.week += enquiry.total_amount; // Adjust this logic based on real "week" filter
          acc.month += enquiry.total_amount; // Adjust this logic based on real "month" filter
          acc.year += enquiry.total_amount; // Adjust this logic based on real "year" filter
          return acc;
        }, { today: 0, week: 0, month: 0, year: 0, total: 0 });

        setServiceIncome(income);

        const performance = data.reduce((acc, enquiry) => {
          const technician = acc.find(t => t.name === enquiry.technician_name);
          if (technician) {
            technician.income += enquiry.total_amount;
          } else {
            acc.push({ name: enquiry.technician_name, income: enquiry.total_amount });
          }
          return acc;
        }, []);

        setTechnicianPerformance(performance);
      }
    };

    fetchServiceData();
  }, []);

  return (
    <Box className="p-4">
      {/* Header */}
      <div className="bg-white shadow-md mb-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <ShoppingBagOutlinedIcon className="text-blue-500" style={{ fontSize: '1.75rem' }} />
                <h1 className="text-xl font-semibold ml-2">Sales Dashboard</h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 rounded-lg">
            <div className="mb-6">
              <Typography variant="h6" className="mb-6">Top Selling Products</Typography>
            </div>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" disabled={!!startDate && !!endDate}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    label="Category"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                  >
                    {categories.map(category => (
                      <MenuItem key={category} value={category}>{category}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth variant="outlined" disabled={!!startDate && !!endDate}>
                  <InputLabel>Subcategory</InputLabel>
                  <Select
                    label="Subcategory"
                    value={subcategoryFilter}
                    onChange={(e) => setSubcategoryFilter(e.target.value)}
                  >
                    {subcategories.map(subcategory => (
                      <MenuItem key={subcategory} value={subcategory}>{subcategory}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <ResponsiveContainer width="100%" className={"mt-10"} height={300}>
              <BarChart data={filteredProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 rounded-lg">
            <div className="mb-6">
              <Typography variant="h6" className="mb-4">Top Salesman Performance</Typography>
            </div>
            <FormControl fullWidth variant="outlined" className="mb-4">
              <InputLabel>Time Frame</InputLabel>
              <Select
                label="Time Frame"
                value={salesmanTimeFrame}
                onChange={(e) => setSalesmanTimeFrame(e.target.value)}
              >
                <MenuItem value="daily">Daily</MenuItem>
                <MenuItem value="weekly">Weekly</MenuItem>
                <MenuItem value="monthly">Monthly</MenuItem>
                <MenuItem value="yearly">Yearly</MenuItem>
              </Select>
            </FormControl>
            <ResponsiveContainer width="100%" className={"mt-10"} height={300}>
              <BarChart data={topSalesmenData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} className="p-4 rounded-lg">
            <div className="mb-6">
              <Typography variant="h6" className="mb-4">Sales Report</Typography>
            </div>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={6} md={3}>
                <FormControl fullWidth variant="outlined" disabled={!!startDate && !!endDate}>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    label="Report Type"
                    value={salesReportType}
                    onChange={(e) => setSalesReportType(e.target.value)}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                    <MenuItem value="yearly">Yearly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="From"
                    value={startDate}
                    onChange={(date) => handleDateChange(date, endDate)}
                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6} md={4}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="To"
                    value={endDate}
                    onChange={(date) => handleDateChange(startDate, date)}
                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <ResponsiveContainer width="100%" className={"mt-10"} height={300}>
              <LineChart data={filteredSalesReportData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={salesReportType === 'daily' ? 'date' : salesReportType === 'monthly' ? 'month' : 'year'} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 rounded-lg">
            <div className="mb-6">
              <Typography variant="h6" className="mb-6">Service Income</Typography>
            </div>
            <Grid container spacing={2} className="mb-4">
              <Grid item xs={6} md={3}>
                <Typography variant="body1">Today: {serviceIncome.today || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body1">This Week: {serviceIncome.week || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body1">This Month: {serviceIncome.month || 0}</Typography>
              </Grid>
              <Grid item xs={6} md={3}>
                <Typography variant="body1">This Year: {serviceIncome.year || 0}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} className="p-4 rounded-lg">
            <div className="mb-6">
              <Typography variant="h6" className="mb-6">Technician Performance</Typography>
            </div>
            <ResponsiveContainer width="100%" className={"mt-10"} height={300}>
              <BarChart data={technicianPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="income" fill="#ff7300" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;