
import axios from 'axios';
import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import merchantImage from '../assets/merchant.png';
import Footer from '../pages/Footer';
import '../style/MerchantDashboard.css';
import MerchantNavBar from './MerchantNavBar';


const MerchantDashboard = () => {
  const { merchantId } = useParams();
  const [merchant, setMerchant] = useState(null);
  const [error, setError] = useState('');
  const [transactionCount, setTransactionCount] =useState(0);

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/merchants/${merchantId}`);
        setMerchant(response.data);
      } catch (error) {
        console.error('Error fetching merchant details:', error);
        setError('Failed to fetch merchant details');
      }
    };



    fetchMerchantDetails();
  }, [merchantId]);


  useEffect(() => {
    const fetchTransactionCount = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/merchants/counttransaction/${merchantId}`);
        console.log("t count" ,response);
        setTransactionCount(response.data);
      } catch (error) {
        console.error('Error fetching transaction details:', error);
        setError('Failed to fetch transaction count details');
      }
    };

    fetchTransactionCount();
  }, [merchantId]);


  const handleDownloadPDF=() =>{
    const doc= new jsPDF();
    doc.text("Merchant Details" ,20 ,20);
    if(merchant){
      doc.text(`Merchant ID : ${merchant.merchantID}` ,20 ,30);
      doc.text(`Merchant Name : ${merchant.merchantName}` ,20 ,40);
      doc.text(`Merchant Address : ${merchant.merchantAddress}` ,20 ,50);
      doc.text(`Merchant Mobile : ${merchant.merchantMobile}` ,20 ,60);
      doc.text(`Merchant Email : ${merchant.merchantEmail}` ,20 ,70);
      doc.text(`Merchant Account : ${merchant.merchantBankAcc}` ,20 ,80);
      doc.text(`Merchant IFSC : ${merchant.merchantIFSC}` ,20 ,90);
      doc.text(`Merchant BANK NAME : ${merchant.merchantBankName}` ,20 ,100);
      doc.text(`Merchant Location : ${merchant.merchantLocation}` ,20 ,110);
      doc.text(`Merchant Code : ${merchant.merchantCode}` ,20 ,120);
      doc.text(`Merchant Status : ${merchant.merchantStatus}` ,20 ,130);
      doc.text(`No. Of Transaction: ${transactionCount}`, 20, 140);

    }
    doc.save('merchant-details.pdf');
  }

  if (error) {
    return <p style={{ color: 'red' }}>{error}</p>;
  }

  if (!merchant) {
    return <p>Loading...</p>;
  }

  return (
    <div className="merchant-dashboard">
    <MerchantNavBar merchantId={merchantId} />
    <div className="dashboard-content">
    <div className="merchant-details">
      <h2>Merchant Details</h2>
      <p><strong>Merchant ID:</strong> {merchant.merchantID}</p>
      <p><strong>Name:</strong> {merchant.merchantName}</p>
      <p><strong>Address:</strong> {merchant.merchantAddress}</p>
      <p><strong>Mobile:</strong> {merchant.merchantMobile}</p>
      <p><strong>Email:</strong> {merchant.merchantEmail}</p>
      <p><strong>Bank Account:</strong> {merchant.merchantBankAcc}</p>
      <p><strong>IFSC:</strong> {merchant.merchantIFSC}</p>
      <p><strong>Bank Name:</strong> {merchant.merchantBankName}</p>
      <p><strong>Location:</strong> {merchant.merchantLocation}</p>
      <p><strong>Code:</strong> {merchant.merchantCode}</p>
      <p><strong>Status:</strong> {merchant.merchantStatus}</p>
      <p><strong>No. Transaction:</strong>{transactionCount}</p>
      <button className="download-pdf-button" onClick={handleDownloadPDF}>Download Details</button>
    </div>
    <div className="merchant-image">
          <img src={merchantImage} alt="Merchant" />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MerchantDashboard;
