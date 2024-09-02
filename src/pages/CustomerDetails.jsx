
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import * as XLSX from 'xlsx';
import customerImage from '../assets/customerdetail.png';
import '../style/CustomerDetails.css';


const CustomerDetails = (props) => {
  const [customer, setCustomer] = useState(null);
  const { customerId } = useParams();
  const [isEditing, setIsEditing] =useState(false);
  const [editForm,setEditForm] =useState({
    name:'',
    dob:'',
    address:'',
    mobile:'',
    pan:'',
    email:''
  });
  const [showUpdatePassword ,setShowUpdatePassword] =useState(false);
  const [newPassword ,setNewPassword] =useState('');
  const [confirmPassword ,setConfirmPassword] =useState('');
  const [passwordErrors ,setPasswordErrors] =useState({});
  const[message,setMessage] =useState('');
  
  
  
  //const id=Number(customerId);
  console.log("9",props.customerId);
//   const id = parseInt(customerId, 10);
  //console.log(id);
  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/customers/${customerId}`);
        setCustomer(response.data);
        setEditForm(response.data);
      } catch (error) {
        console.error('Error fetching customer details:', error);
      }
    };

    fetchCustomer();
  }, []);

  const handleDownloadPDF= () => {
    const doc =new jsPDF();
    doc.text("Customer Details " , 20 ,20);
    if(customer){
      doc.text(`Name : ${customer.name}`,20,30);
      doc.text(`Date of Birth : ${customer.dob}`,20 ,40);
      doc.text(`Address : ${customer.address}` ,20, 50);
      doc.text(`Mobile : ${customer.mobile}`,20,60);
      doc.text(` PAN: ${customer.pan}`,20,70);
      doc.text(`Email : ${customer.email}`,20,80);
    }
    doc.save('customer-details.pdf');
  };
  const handleDownloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet([customer]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "CustomerDetails");
    XLSX.writeFile(wb, "customer-details.xlsx");
  };

  const handleEditClick=() => {
    setIsEditing(true);
  };
  const handleInputChange=(e) =>{
    const { name , value} =e.target;
    setEditForm({...editForm,[name]: value});
  };

  const handleUpdateClick =async () => {
    try{
      const response =await axios.put(`http://localhost:8080/api/customers/${customerId}`,editForm);
      setCustomer(response.data);
      setIsEditing(false);
    }catch(error){
      console.error('Error updating customer details ' ,error);
    }
  };
  const validatePassword = () => {
    const newErrors = {};
    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordPattern.test(newPassword)) {
      newErrors.newPassword = 'Password must be at least 6 characters long, contain at least one uppercase letter, one number, and one special character.';
    }

    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (validatePassword()) {
      try {
        await axios.put(`http://localhost:8080/api/customers/${customerId}/password`, null, {
          params: { newPassword },
        });
        setMessage("Password updated successfully");
        setShowUpdatePassword(false);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordErrors({});
      } catch (error) {
        console.error('Error updating password:', error);
        setMessage("Error updating password");
      }
    }
  };



  if (!customer) {
    return <div>Loading...</div>;
  }

  return (
    // <div className="customer-details">
    <div className="customer-details-container">
    <div className="customer-image-container">
      <img src={customerImage} alt="Customer" className="customer-image" />
    </div>
    {!showUpdatePassword ? (
    <div  className="customer-details">
      <h1>Customer Details</h1>
      {isEditing ? (
        <div>
          <input type="text" name="name" value={editForm.name} onChange={handleInputChange} placeholder="Name" />
          <input type="text" name="dob" value={editForm.dob} onChange={handleInputChange} placeholder="DOB" />
          <input type="text" name="address" value={editForm.address} onChange={handleInputChange} placeholder="Address" />
          <input type="text" name="mobile" value={editForm.mobile} onChange={handleInputChange} placeholder="Mobile number" />
          <input type="text" name="pan" value={editForm.pan} onChange={handleInputChange} placeholder="PAN" />
          <input type="text" name="email" value={editForm.email} onChange={handleInputChange} placeholder="email" />
          <button className="update-button" onClick={handleUpdateClick}>UPDATE</button>
          <button className="cancel-button" onClick={() =>setIsEditing(false)}>Cancel</button>
          </div>
      ):(
      <div>
      <p>Name: {customer.name}</p>
      <p>Date of Birth: {customer.dob}</p>
      <p>Address: {customer.address}</p>
      <p>Mobile: {customer.mobile}</p>
      <p>PAN: {customer.pan}</p>
      <p>Email: {customer.email}</p>
      <div className="button-container">
      <button className="edit-button" onClick={handleEditClick}>UPDATE PROFILE</button>
      <button className="update-password-button" onClick={() =>setShowUpdatePassword(true)}>UPDATE PASSWORD</button>
      <button className="download-pdf-button" onClick={handleDownloadPDF}>Download PDF</button>
      <button className="download-excel-button" onClick={handleDownloadExcel}>Download Excel</button>
      
      </div>
    </div>
  )}
  </div>
) : (
<div className="update-password-container">
  <h2>Update Password</h2>
  
  <div className="password-field">
    <label>New Password:</label>
    <input
      type="password"
      placeholder="New Password"
      value={newPassword}
      onChange={(e) => setNewPassword(e.target.value)}
    />
  </div>
  {passwordErrors.newPassword && <span style={{ color: 'red' }}>{passwordErrors.newPassword}</span>}
  
  <div className="password-field">
    <label>Confirm Password:</label>
    <input
      type="password"
      placeholder="Confirm New Password"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />
  </div>
  {passwordErrors.confirmPassword && <span style={{ color: 'red' }}>{passwordErrors.confirmPassword}</span>}
  
  <button className="update-button" onClick={handleUpdatePassword}>Update Password</button>
  {message && <p>{message}</p>}
  <button className="cancel-button" onClick={() => setShowUpdatePassword(false)}>Cancel</button>
</div>
)}
</div>

  );
};

export default CustomerDetails;
