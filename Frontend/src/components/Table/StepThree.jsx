import React from "react";
import axios from "axios";

const StepThree = ({ form, setForm, onBack, onBook }) => {
  const isValid = form.name.trim() !== "" && form.phone.trim() !== "";
  const token = localStorage.getItem("token");

  const handleBooking = async () => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await axios.post(
        "http://localhost:8080/api/bookings",
        {
          userId,
          tableId: form.table.id,
          date: form.date,
          time: form.time,
          guests: form.guests,
          name: form.name,
          phone: form.phone,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      onBook(res.data); // pass real booking data
    } catch (error) {
      console.log("Booking failed", error);
      alert("Booking failed");
    }
  };

  return (
    <>
      <div className="step-title">
        <span>3</span> Your Details
      </div>

      <div className="details-grid">
        <div className="input-group">
          <label>👤 Your Name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>📞 Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="btn-row">
        <button className="btn-back" onClick={onBack}>
          Back
        </button>

        <button
          className={`btn-primary wide ${isValid ? "enabled" : ""}`}
          disabled={!isValid}
          onClick={handleBooking}
        >
          Book Table
        </button>
      </div>
    </>
  );
};

export default StepThree;
