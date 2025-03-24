import React, { useEffect, useState } from "react";
import { Card, Spin, Button } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RideDetails = () => {
  const { id } = useParams(); // Get the ride ID from the URL
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRideDetails = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://157.245.101.161:5000/bookings/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRide(response.data);
      } catch (error) {
        console.error("Error fetching ride details:", error);
        toast.error("Failed to fetch ride details: " + (error.response?.data?.error || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchRideDetails();
  }, [id]);

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (!ride) return <p>Ride not found.</p>;

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title={`Ride Details - ${ride.name}`}
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard/rides")}>
            Back to List
          </Button>
        }
        style={{ maxWidth: "600px", padding: "24px", margin: "0 auto", borderRadius: "8px" }}
      >
        <p><strong>Email:</strong> {ride.email}</p>
        <p><strong>Mobile:</strong> {ride.mobile}</p>
        <p><strong>From:</strong> {ride.from}</p>
        <p><strong>To:</strong> {ride.to}</p>
        <p><strong>Distance:</strong> {ride.distance}</p>
        <p><strong>Duration:</strong> {ride.duration}</p>
        <p><strong>Pickup Address:</strong> {ride.pickupAddress}</p>
        <p><strong>Drop Address:</strong> {ride.dropAddress}</p>
        <p><strong>Date:</strong> {new Date(ride.date).toLocaleDateString()}</p>
        <p><strong>Time:</strong> {ride.time}</p>
        <p><strong>Passengers:</strong> {ride.passengers}</p>
        <p><strong>Car Name:</strong> {ride.carName}</p>
        <p><strong>Car Rate:</strong> {ride.carRate}</p>
        <p><strong>Estimated Cost:</strong> {ride.estimatedCost}</p>
        <p><strong>Payment Method:</strong> {ride.paymentMethod}</p>
        <p><strong>Payment Status:</strong> {ride.paymentStatus}</p>
        <p><strong>Advance Payment:</strong> {ride.advancePayment}</p>
        <p><strong>Balance Payment:</strong> {ride.balancePayment}</p>
        <p><strong>Driver Assigned:</strong> {ride.driverAssigned}</p>
        <p><strong>Trip Status:</strong> {ride.tripStatus}</p>
        <p><strong>Created At:</strong> {new Date(ride.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(ride.updatedAt).toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default RideDetails;