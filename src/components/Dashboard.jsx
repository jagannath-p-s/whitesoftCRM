import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const monthlySalesData = [
  { month: 'January', sales: 4000 },
  { month: 'February', sales: 3000 },
  { month: 'March', sales: 2000 },
  { month: 'April', sales: 2780 },
  { month: 'May', sales: 1890 },
  { month: 'June', sales: 2390 },
  { month: 'July', sales: 3490 },
  { month: 'August', sales: 2000 },
  { month: 'September', sales: 2780 },
  { month: 'October', sales: 1890 },
  { month: 'November', sales: 2390 },
  { month: 'December', sales: 3490 },
];

const weeklySalesData = [
  { week: 'Week 1', sales: 1200 },
  { week: 'Week 2', sales: 2100 },
  { week: 'Week 3', sales: 800 },
  { week: 'Week 4', sales: 1600 },
];

const annualSalesData = [
  { year: 2019, sales: 50000 },
  { year: 2020, sales: 60000 },
  { year: 2021, sales: 70000 },
  { year: 2022, sales: 80000 },
  { year: 2023, sales: 90000 },
];

const salesmanPerformanceData = [
  { name: 'John Doe', sales: 2400 },
  { name: 'Jane Smith', sales: 4567 },
  { name: 'Sam Johnson', sales: 1398 },
  { name: 'Chris Lee', sales: 9800 },
  { name: 'Alex King', sales: 3908 },
  { name: 'Taylor Green', sales: 4800 },
];

const Dashboard = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Sales Dashboard</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Monthly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Weekly Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklySalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Annual Sales</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={annualSalesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Salesman Performance</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={salesmanPerformanceData}
              dataKey="sales"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {salesmanPerformanceData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Dashboard;
