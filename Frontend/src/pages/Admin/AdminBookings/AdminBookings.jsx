import React, { useEffect, useState} from "react";
import axios from "axios";
import "./AdminBookings.css";

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const token = localStorage.getItem("token");

  const fetchBookings = async (date = "") => {
    try {
      const url = date
        ? `http://localhost:8080/api/bookings/date/${date}`
        : `http://localhost:8080/api/bookings/all`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setBookings(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Today button
  const handleToday = () => {
    const today = new Date().toISOString().split("T")[0];
    setSelectedDate(today);
    fetchBookings(today);
  };

  // Filtered bookings
// Filtered bookings (simple way)
const filteredBookings = bookings.filter((b) => {
  const matchesSearch =
    b.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.phone?.includes(searchTerm) ||
    b.id?.toLowerCase().includes(searchTerm.toLowerCase());

  const matchesStatus =
    statusFilter === "All" || b.status === statusFilter;

  return matchesSearch && matchesStatus;
});


  // Summary Data
  const totalBookings = filteredBookings.length;
  const confirmed = filteredBookings.filter(
    (b) => b.status === "BOOKED"
  ).length;
  const cancelled = filteredBookings.filter(
    (b) => b.status === "CANCELLED"
  ).length;
  const totalGuests = filteredBookings.reduce(
    (sum, b) => sum + b.guests,
    0
  );

  return (
    <div className="admin-bookings">
      {/* Header */}
      <div className="top-header">
        <h2>Advance Table Bookings</h2>
        <button className="today-btn" onClick={handleToday}>
          📅 Today
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-box">
          <p>Total Bookings</p>
          <h3>{totalBookings}</h3>
        </div>
        <div className="summary-box">
          <p>Confirmed</p>
          <h3>{confirmed}</h3>
        </div>
        <div className="summary-box">
          <p>Cancelled</p>
          <h3>{cancelled}</h3>
        </div>
        <div className="summary-box">
          <p>Total Guests</p>
          <h3>{totalGuests}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name, phone."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
          <input
    type="date"
    className="date-filter"
    value={selectedDate}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedDate(value);
      fetchBookings(value);
    }}
  />

        <select
          className="status-filter"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="BOOKED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="booking-table">
        <div className="booking-header">
          <span>ID</span>
          <span>Customer</span>
          <span>Date & Time</span>
          <span>Guests</span>
          <span>Table</span>
          <span>Status</span>
        </div>

        {filteredBookings.map((b) => (
          <div key={b.id} className="booking-row">
            <span>{b.bookingNumber}</span>
            <span>
              {b.name}
              <br />
              <small>{b.phone}</small>
            </span>
            <span>
              {b.date}
              <br />
              <small>{b.time}</small>
            </span>
            <span>{b.guests}</span>
            <span>Table {b.tableNumber || b.tableId}</span>
            <span
              className={
                b.status === "BOOKED"
                  ? "status-confirmed"
                  : "status-cancelled"
              }
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminBookings;
