import React, { useState } from "react";
import "./BillPage.css";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BillPage = () => {
  const [selected, setSelected] = useState("UPI");
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const tableNumber = parseInt(localStorage.getItem("tableNo"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/orders/table/${tableNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      //   console.log("API Response:", res.data); // Debugging line
      setOrders(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const subtotal = orders.reduce((acc, o) => acc + o.amount, 0);

 const sgst = subtotal * 0.025;   // 2.5%
const cgst = subtotal * 0.025;   // 2.5%

const grandTotal = subtotal + sgst + cgst;

  const handlePayment = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/orders/pay/${tableNumber}`,
        { paymentMethod: selected },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const paidOrderIds = response.data;

      toast.success("Payment Successful!");

      localStorage.removeItem("tableNo");

      navigate("/payment-success", {
        state: {
          orderIds: paidOrderIds, // 🔥 send only these
        },
      });
    } catch (error) {
      console.log(error);
      alert("Payment Failed");
    }
  };

  return (
    <>
      <div className="bill-header">
        <div className="bill-header-content">
          <span className="back-arrow" onClick={() => navigate(-1)}>
            ←
          </span>

          <div className="header-text">
            <h2>💵 Bill — Table {tableNumber}</h2>
            <p>{orders.length} orders consolidated</p>
          </div>
        </div>
      </div>

      <div className="bill-page">
        {/* HEADER */}

        {/* ORDER CARDS */}
        {orders.map((order) => (
          <div className="bill-card" key={order.id}>
            <div className="bill-top">
              <h4>{order.orderNumber}</h4>
            </div>

            {order.orderedItems.map((item, i) => (
              <div className="bill-row" key={i}>
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="bill-total">
              <span>Order Total</span>
              <span>₹{order.amount.toFixed(2)}</span>
            </div>
          </div>
        ))}

        {/* SUMMARY */}
        <div className="summary-card1">
          <h3>Bill Summary</h3>

          <div className="summary-row">
            <span>Subtotal ({orders.length} orders)</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

           <div className="summary-row">
    <span>SGST (2.5%)</span>
    <span>₹{sgst.toFixed(2)}</span>
  </div>

  <div className="summary-row">
    <span>CGST (2.5%)</span>
    <span>₹{cgst.toFixed(2)}</span>
  </div>

          <div className="grand-total">
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="payment-card">
          <h3>Payment Method</h3>

          <div className="payment-options">
            {["Cash", "UPI", "Card"].map((method) => (
              <div
                key={method}
                className={`payment-box ${selected === method ? "active" : ""}`}
                onClick={() => setSelected(method)}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* PAY BUTTON */}
        <button className="pay-btn" onClick={handlePayment}>
          Pay ₹{grandTotal.toFixed(2)}
        </button>
      </div>
    </>
  );
};

export default BillPage;
