import { jsPDF } from 'jspdf';
import React, { useState } from 'react';
import { default as transactionDetailsImage, default as transactionImage } from '../assets/transactionform.png';
import TransactionService from '../Services/TransactionService';
import '../style/TransactionForm.css';

const TransactionForm = () => {
  const [transactionType, setTransactionType] = useState('');
  const [creditcardNumber, setCreditcardNumber] = useState('');
  const [merchantID, setMerchantID] = useState('');
  const [currency, setCurrency] = useState('');
  const [transactionAmount, setTransactionAmount] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [serverAuthCode, setServerAuthCode] = useState('');
  const [enteredAuthCode, setEnteredAuthCode] = useState('');
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [error, setError] = useState('');
  const [availableBalance, setAvailableBalance] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

  //   TransactionService.getCreditCardDetails(creditcardNumber)
  //     .then((response) => {
  //       const balance = response.data.creditLimit;
  //       setAvailableBalance(balance);

  //       if (transactionType === "2" && parseFloat(transactionAmount) > parseFloat(balance)) {
  //         alert('Insufficient Balance');
  //         return;
  //       } else {
  //         const authCode = "123";
  //         TransactionService.postTransaction(parseInt(transactionType), creditcardNumber, merchantID, currency, transactionAmount, authCode)
  //           .then((response) => {
  //             console.log('Transaction posted:', response.data);
  //             setServerAuthCode(response.data.authCode);
  //             setTransactionDetails(response.data);
              
  //             const emailData = {
  //               otp: response.data.authCode,
  //               to_email:response.data.creditcard.customer.email
  //             };
              
  //             sendEmail(emailData);
  //             setSubmitted(true);
  //           })
  //           .catch((error) => {
  //             console.error('Error posting transaction:', error);
  //             setError('Error posting transaction');
  //           });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching credit card details', error);
  //       setError('Error fetching credit card details');
  //     });
  // };

  // const sendEmail = (data) => {
  //   emailjs.send('service_bt7ytxl', 'template_xvvlm3w', data, '1zNU9SmOvkydPkEuf')
  //     .then((result) => {
  //       console.log(result.text);
  //     }, (error) => {
  //       console.log(error.text);
  //     });
  // };

  TransactionService.getCreditCardDetails(creditcardNumber)
  .then((response) => {
    const balance = response.data.creditLimit;
    setAvailableBalance(balance);

    if (transactionType === "2" && parseFloat(transactionAmount) > parseFloat(balance)) {
      alert('Insufficient Balance');
      return;
    } else {
      const authCode = "123";
      TransactionService.postTransaction(parseInt(transactionType), creditcardNumber, merchantID, currency, transactionAmount, authCode)
        .then((response) => {
          console.log('Transaction posted:', response.data);
          setServerAuthCode(response.data.authCode);
          setTransactionDetails(response.data);
          
          // Log the authCode to the console
          console.log('Auth Code:', response.data.authCode);
          
          setSubmitted(true);
        })
        .catch((error) => {
          console.error('Error posting transaction:', error);
          setError('Error posting transaction');
        });
    }
  })
  .catch((error) => {
    console.error('Error fetching credit card details', error);
    setError('Error fetching credit card details');
  });
};

  const handleAuthCodeSubmit = (e) => {
    e.preventDefault();
    if (enteredAuthCode === serverAuthCode) {
      setError('');
    } else {
      setError('OTP did not match');
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Transaction Details", 20, 20);
    if (transactionDetails) {
      doc.text(`Transaction ID: ${transactionDetails.transactionID}`, 20, 30);
      doc.text(`Transaction Type: ${transactionDetails.transactionType}`, 20, 40);
      doc.text(`Credit Card Number: ${transactionDetails.creditcard.creditcardNumber}`, 20, 50);
      doc.text(`Merchant Name: ${transactionDetails.merchant.merchantName}`, 20, 60);
      doc.text(`Transaction Amount: ${transactionDetails.transactionAmount}`, 20, 70);
      doc.text(`Currency: ${transactionDetails.currency}`, 20, 80);
      doc.text(`Available Balance: ${transactionDetails.creditcard.creditLimit}`, 20, 90);
    }
    doc.save('transaction-details.pdf');
  };

  if (transactionDetails && enteredAuthCode === serverAuthCode) {
    return (
      <div className="transaction-details-wrapper">
        <div className="transaction-details-image-container">
          <img src={transactionDetailsImage} alt="Transaction Details" className="transaction-details-image" />
        </div>
        <div className="transaction-details-container">
          <h2>Transaction Details</h2>
          <p><strong>Transaction ID:</strong> {transactionDetails.transactionID}</p>
          <p><strong>Transaction Type:</strong> {transactionDetails.transactionType}</p>
          <p><strong>Credit Card Number:</strong> {transactionDetails.creditcard.creditcardNumber}</p>
          <p><strong>Merchant Name:</strong> {transactionDetails.merchant.merchantName}</p>
          <p><strong>Transaction Amount:</strong> {transactionDetails.transactionAmount}</p>
          <p><strong>Currency:</strong> {transactionDetails.currency}</p>
          <p><strong>Available Balance :</strong>{transactionDetails.creditcard.creditLimit}</p>
          <button onClick={handleDownloadPDF} className="download-button">Download PDF</button>
        </div>
      </div>
    );
  }

  return (
    <div className="transaction-form-wrapper">
      <div className="transaction-image-container">
        <img src={transactionImage} alt="Transaction" className="transaction-image" />
      </div>
      <div className="transaction-form-container">
        {!submitted ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label>Transaction Type:</label>
              <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} required>
                <option value="">Select Transaction Type</option>
                <option value="1">Balance Enquiry</option>
                <option value="2">Purchases</option>
                <option value="3">Payments</option>
              </select>
            </div>
            <div>
              <label>Credit Card Number:</label>
              <input type="text" value={creditcardNumber} onChange={(e) => setCreditcardNumber(e.target.value)} required />
            </div>
            <div>
              <label>Merchant ID:</label>
              <input type="number" value={merchantID} onChange={(e) => setMerchantID(e.target.value)} required />
            </div>
            <div>
              <label>Currency:</label>
              <input type="text" value={currency} onChange={(e) => setCurrency(e.target.value)} required />
            </div>
            <div>
              <label>Transaction Amount:</label>
              <input type="number" value={transactionAmount} onChange={(e) => setTransactionAmount(e.target.value)} required />
            </div>
            <button type="submit">Submit Transaction</button>
          </form>
        ) : (
          <form onSubmit={handleAuthCodeSubmit}>
            <div>
              <label>Enter OTP :</label>
              <input type="text" value={enteredAuthCode} onChange={(e) => setEnteredAuthCode(e.target.value)} required />
            </div>
            <button type="submit">Verify OTP</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default TransactionForm;
