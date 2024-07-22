import React, { useState } from 'react';

const Services = () => {
  const [formData, setFormData] = useState({
    date: '',
    jobCardNo: '',
    customerDetails: '',
    machineType: '',
    complaints: [''],
    parts: [{ partName: '', partNumber: '', qty: '', rate: '', amount: '' }],
    technicianName: '',
    charges: { oil: '', petrol: '', labour: '' },
    totalAmount: '',
    repairDate: '',
  });

  const handleChange = (e, index, field) => {
    const { name, value } = e.target;
    setFormData(prevData => {
      if (field) {
        const newArray = [...prevData[name]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prevData, [name]: newArray };
      } else if (name in prevData.charges) {
        return { ...prevData, charges: { ...prevData.charges, [name]: value } };
      }
      return { ...prevData, [name]: value };
    });
  };

  const addItem = (type) => {
    setFormData(prevData => ({
      ...prevData,
      [type]: type === 'parts' 
        ? [...prevData[type], { partName: '', partNumber: '', qty: '', rate: '', amount: '' }]
        : [...prevData[type], '']
    }));
  };

  const removeItem = (type, index) => {
    setFormData(prevData => ({
      ...prevData,
      [type]: prevData[type].filter((_, i) => i !== index)
    }));
  };

  const renderInputField = (label, name, type = 'text') => (
    <div className="flex flex-col">
      <label>{label}:</label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="p-2 border rounded"
      />
    </div>
  );

  const renderTextArea = (label, name) => (
    <div className="flex flex-col">
      <label>{label}:</label>
      <textarea
        name={name}
        value={formData[name]}
        onChange={handleChange}
        className="p-2 border rounded"
      ></textarea>
    </div>
  );

  return (
    <div className="p-8 bg-gray-100">
      <form className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {renderInputField('Date', 'date', 'date')}
          {renderInputField('Job Card No', 'jobCardNo')}
        </div>

        {renderTextArea('Customer Details', 'customerDetails')}
        {renderInputField('Machine Type', 'machineType')}

        <div>
          <label>Complaints:</label>
          {formData.complaints.map((complaint, index) => (
            <div key={index} className="flex items-center mt-1">
              <input
                type="text"
                value={complaint}
                onChange={(e) => handleChange(e, index, 'complaints')}
                className="flex-grow p-2 border rounded"
              />
              <button type="button" onClick={() => removeItem('complaints', index)} className="ml-2 px-2 py-1 bg-red-500 text-white rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('complaints')} className="mt-2 px-2 py-1 bg-green-500 text-white rounded">Add Complaint</button>
        </div>

        <div>
          <label>Parts:</label>
          {formData.parts.map((part, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 mt-1">
              {Object.keys(part).map(field => (
                <input
                  key={field}
                  type={field === 'qty' || field === 'rate' || field === 'amount' ? 'number' : 'text'}
                  value={part[field]}
                  onChange={(e) => handleChange(e, index, field)}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="p-2 border rounded"
                />
              ))}
              <button type="button" onClick={() => removeItem('parts', index)} className="px-2 py-1 bg-red-500 text-white rounded">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('parts')} className="mt-2 px-2 py-1 bg-green-500 text-white rounded">Add Part</button>
        </div>

        {renderInputField('Name of Technician', 'technicianName')}

        <div className="grid grid-cols-3 gap-4">
          {Object.keys(formData.charges).map(charge => (
            renderInputField(charge.charAt(0).toUpperCase() + charge.slice(1) + ' Charge', charge, 'number')
          ))}
        </div>

        {renderInputField('Total Amount', 'totalAmount', 'number')}
        {renderInputField('Date of Repair', 'repairDate', 'date')}
      </form>
    </div>
  );
};

export default Services;
