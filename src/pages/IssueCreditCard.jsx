import axios from 'axios';
import { jsPDF } from 'jspdf';
import React, { useEffect, useState } from 'react';
import creditCardImage from '../assets/creditcard.png';
import '../style/IssueCreditCard.css';

const IssueCreditCard= ({ customerId }) => {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState('');
  const [maker, setMaker] = useState('');
  const [checker, setChecker] = useState('');
  const [creditCard, setCreditCard] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/products');
        const availableProducts = response.data.filter(
          (product) => product.productDescription && product.cardType
        );
        setProducts(availableProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:8080/api/customers/${customerId}/issueCreditCard`,
        null,
        {
          params: {
            productId: productId,
            maker: maker,
            checker: checker,
          },
        }
      );
     console.log("135", response.data);
      setCreditCard(response.data);
      setError('');
    } catch (error) {
      console.error('Error issuing credit card:', error);
      setCreditCard(null);
      setError('Failed to issue credit card');
    }
  };
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Credit Card Details", 20, 20);
    if (creditCard) {
      doc.text(`Credit Card Number: ${creditCard.creditcardNumber}`, 20, 30);
      doc.text(`Expiry Date: ${creditCard.creditcardExpiry}`, 20, 40);
      doc.text(`CVV: ${creditCard.cvv}`, 20, 50);
      doc.text(`Credit Limit: ${creditCard.creditLimit}`, 20, 60);
      doc.text(`Status: ${creditCard.creditcardstatus}`, 20, 70);
      doc.text(`Maker: ${creditCard.maker}`, 20, 80);
      doc.text(`Checker: ${creditCard.checker}`, 20, 90);
      doc.text(`Daily Expense: ${creditCard.dailyExpence}`, 20, 100);
    }
    doc.save('credit-card-details.pdf');
  };


  return (
    <div className="issue-credit-card-container">
      <div className="image-container">
        <img src={creditCardImage} alt="credit card" />
        </div>
        <div className="form-container" >
     
      {creditCard ? (
        <div>
        
          <p><strong>Credit Card Number:</strong> {creditCard.creditcardNumber}</p>
          <p><strong>Expiry Date:</strong> {creditCard.creditcardExpiry}</p>
          <p><strong>CVV:</strong> {creditCard.cvv}</p>
          <p><strong>Credit Limit:</strong> {creditCard.creditLimit}</p>
          <p><strong>Status:</strong> {creditCard.creditcardstatus}</p>
          <p><strong>Maker:</strong> {creditCard.maker}</p>
          <p><strong>Checker:</strong> {creditCard.checker}</p>
          <p><strong>Daily Expense:</strong> {creditCard.dailyExpence}</p>
          <button onClick={handleDownloadPDF} className="download-button">Download Details</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Customer ID:</label>
            <input
              type="text"
              value={customerId}
              readOnly
            />
          </div>
          <div>
            <label>Product ID:</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              required
            >
              <option value="" disabled>Select a product</option>
              {products.map((product) => (
                <option key={product.productID} value={product.productID}>
                  {`${product.productDescription} - ${product.cardType}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label>Maker:</label>
            <input
              type="text"
              value={maker}
              onChange={(e) => setMaker(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Checker:</label>
            <input
              type="text"
              value={checker}
              onChange={(e) => setChecker(e.target.value)}
              required
            />
          </div>
          <button type="submit">Credit Card Details</button>
        </form>
      )}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>
  );
};

export default IssueCreditCard;
