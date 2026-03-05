import React, { useEffect, useState } from "react";
import "./PaymentSuccess.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import axios from "axios";


const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(8);

const location = useLocation();
const { orderIds } = location.state || {};


const token = localStorage.getItem("token");


  // Auto redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    if (seconds === 0) {
      navigate("/");
    }

    return () => clearInterval(timer);
  }, [seconds, navigate]);

const downloadInvoice = async () => {
  try {

    const response = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/orders/invoice`,
      orderIds,   
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "invoice.pdf");
    document.body.appendChild(link);
    link.click();

  } catch (error) {
    console.error("Error downloading invoice:", error);
  }
};




  return (
    <div className="order-success">
      <div className="success-glow"></div>

      <div className="success-card premium">
        {/* Animated Check */}
        <div className="check-wrapper">
          <div className="check-circle">
            <span className="check-icon">✓</span>
          </div>
        </div>

        <h1 className="success-title">
          <span className="title-dark">Payment</span>{" "}
          <span className="title-gradient">Successfully!</span>
        </h1>

        {/* <p className="subtitle">
          Your delicious food is being prepared and will reach you shortly 🍽️
        </p> */}

        <p className="redirect-text">
          Redirecting to home page in <strong>{seconds}s</strong>...
        </p>

        <div className="success-buttons">
         <button
  className="btn-primary1"
  onClick={downloadInvoice}
>
  Download Invoice
</button>


          <button className="btn-outline" onClick={() => navigate("/")}>
            🏠 Go Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
