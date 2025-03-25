import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, Button, Spin } from "antd";
import axios from "axios";
import { toast } from "react-toastify";

const DriverDetails = () => {
  const { id } = useParams(); // Get the driver _id from the URL
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverDetails();
  }, [id]);

  const fetchDriverDetails = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/drivers/${id}`);
      setDriver(response.data);
    } catch (error) {
      console.error("Error fetching driver details:", error);
      toast.error("Failed to fetch driver details: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;

  if (!driver) return <p>Driver not found.</p>;

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title={`Driver Details - ${driver.name}`}
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard/drivers")}>
            Back to List
          </Button>
        }
        style={{ maxWidth: "600px", padding: "24px", margin: "0 auto", borderRadius: "8px" }}
      >
        <p><strong>Phone:</strong> {driver.phone}</p>
        <p><strong>Address:</strong> {driver.address}</p>
        <p><strong>License Number:</strong> {driver.licenseNo}</p>
        <p><strong>Own Car:</strong> {driver.ownCar ? "Yes" : "No"}</p>
        <p><strong>Photo:</strong> {driver.photo || "Not provided"}</p>
        <p><strong>License Photo:</strong> {driver.documents?.licensePhoto || "Not provided"}</p>
        <p><strong>Created At:</strong> {new Date(driver.createdAt).toLocaleString()}</p>
        <p><strong>Updated At:</strong> {new Date(driver.updatedAt).toLocaleString()}</p>
      </Card>
    </div>
  );
};

export default DriverDetails;