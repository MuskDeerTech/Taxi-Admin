import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const VehicleDetails = () => {
  const { id } = useParams(); // Get the vehicle _id from the URL
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVehicleDetails();
  }, [id]);

  const fetchVehicleDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles/${id}`);
      console.log("Vehicle Data:", response.data); // Debugging
      setVehicle(response.data);
    } catch (error) {
      console.error("Error fetching vehicle details:", error);
      toast.error("Failed to fetch vehicle details: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;

  if (!vehicle) return <p>Vehicle not found.</p>;

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title={`Vehicle Details - ${vehicle.make} ${vehicle.model}`}
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard/vehicle")}>
            Back to List
          </Button>
        }
        style={{ maxWidth: "600px", padding: "24px", margin: "0 auto", borderRadius: "8px", border: "1px solid #d9d9d9" }} // Added border
      >
        <p><strong>Make:</strong> {vehicle.make}</p>
        <p><strong>Model:</strong> {vehicle.model}</p>
        <p><strong>Year:</strong> {vehicle.year}</p>
        <p><strong>License Plate:</strong> {vehicle.licensePlate}</p>
        <p><strong>Status:</strong> {vehicle.status}</p>
        <p><strong>Capacity:</strong> {vehicle.capacity}</p>
        <p><strong>Vehicle Type:</strong> {vehicle.vehicleType}</p>
        <p><strong>Insurance Expiry:</strong> {new Date(vehicle.insuranceExpiry).toLocaleDateString()}</p>
        <p><strong>Fuel Type:</strong> {vehicle.fuelType}</p>
        <p><strong>Mileage:</strong> {vehicle.mileage} km</p>
        <p><strong>Vehicle Picture:</strong> {vehicle.vehiclePicture || "Not provided"}</p>
        <p><strong>RC Book Document:</strong> {vehicle.documents?.rcBook || "Not provided"}</p>
        <p><strong>Owner Name:</strong> {vehicle.owner.name}</p>
        <p><strong>Owner Address:</strong> {vehicle.owner.address}</p>
        <p><strong>Created At:</strong> {new Date(vehicle.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(vehicle.updatedAt).toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default VehicleDetails;