
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AdminNavBar from "../pages/AdminNavBar";
import '../style/RecentCustomer.css';
const CustomerList = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer =async(id) =>{
    try{
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      setCustomers(customers.filter(customer => customer.customerID != id));

    }catch(error){
      console.error('Error deleting Customer' ,error);
    }
  };

  return (
    
    <div className="recent-customer-container">
    <AdminNavBar  />
    <h1 className="recent-customer-title">Customer List</h1>
    <table className="recent-customer-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Date of Birth</th>
            <th>Address</th>
            <th>Mobile</th>
            <th>PAN</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer.customerID}>
              <td>{customer.name}</td>
              <td>{customer.dob}</td>
              <td>{customer.address}</td>
              <td>{customer.mobile}</td>
              <td>{customer.pan}</td>
              <td>{customer.email}</td>
              <td><button  className="delete-button" onClick={() => handleDeleteCustomer(customer.customerID)}>DELETE</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
