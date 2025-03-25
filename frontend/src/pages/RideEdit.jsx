import React, { useEffect, useState } from "react";
import { Card, Form, Input, DatePicker, TimePicker, InputNumber, Select, Button, Typography, Spin, message } from "antd";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import moment from "moment";

const { Title } = Typography;
const { Option } = Select;

const RideEdit = () => {
  const { id } = useParams();
  const [ride, setRide] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL}`;

  useEffect(() => {
    fetchRideDetails();
  }, [id]);

  const fetchRideDetails = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      console.log("Fetching ride details for ID:", id); // Debug log
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Fetched ride details:", response.data); // Debug log
      setRide(response.data);
      form.setFieldsValue({
        ...response.data,
        date: moment(response.data.date),
        time: moment(response.data.time, "HH:mm A"),
      });
    } catch (error) {
      console.error("Error fetching ride details:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
      } else if (error.request) {
        console.error("Request data:", error.request);
      }
      toast.error("Failed to fetch ride details: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
        time: values.time.format("HH:mm A"),
      };
  
      console.log("🔍 Sending PUT request:", updatedData);
  
      const response = await axios.put(`${API_URL}/bookings/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      console.log("✅ Response:", response.data);
      message.success("Ride updated successfully!");
      navigate("/dashboard/rides");
  
    } catch (error) {
      console.error("❌ Error updating ride:", error);
  
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Status:", error.response.status);
        toast.error(`Update failed: ${error.response.data.error || error.message}`);
      } else if (error.request) {
        console.error("No response from server.");
        toast.error("Network Error: No response received from server.");
      } else {
        toast.error("Error: " + error.message);
      }
    } finally {
      setLoading(false);
    }
  };
  

  if (loading) return <Spin size="large" style={{ display: "block", margin: "20px auto" }} />;
  if (!ride) return <p>Ride not found.</p>;

  return (
    <div style={{ padding: "24px", background: "#f0f2f5", minHeight: "100vh" }}>
      <Card
        title={<Title level={3}>Edit Ride - {ride.name}</Title>}
        extra={
          <Button type="primary" onClick={() => navigate("/dashboard/rides")}>
            Back to List
          </Button>
        }
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            paymentMethod: ride.paymentMethod,
            paymentStatus: ride.paymentStatus,
            tripStatus: ride.tripStatus,
            driverAssigned: ride.driverAssigned,
            advancePayment: ride.advancePayment,
            balancePayment: ride.balancePayment,
          }}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the passenger's name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: "email", message: "Please enter a valid email" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Mobile"
            name="mobile"
            rules={[{ required: true, message: "Please enter a mobile number" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="From"
            name="from"
            rules={[{ required: true, message: "Please enter the starting location" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="To"
            name="to"
            rules={[{ required: true, message: "Please enter the destination" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Distance (km)"
            name="distance"
            rules={[{ required: true, message: "Please enter the distance" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Duration"
            name="duration"
            rules={[{ required: true, message: "Please enter the duration" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Pickup Address"
            name="pickupAddress"
            rules={[{ required: true, message: "Please enter the pickup address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Drop Address"
            name="dropAddress"
            rules={[{ required: true, message: "Please enter the drop address" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Date"
            name="date"
            rules={[{ required: true, message: "Please select the date" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Time"
            name="time"
            rules={[{ required: true, message: "Please select the time" }]}
          >
            <TimePicker style={{ width: "100%" }} format="HH:mm A" />
          </Form.Item>

          <Form.Item
            label="Passengers"
            name="passengers"
            rules={[{ required: true, message: "Please enter the number of passengers" }]}
          >
            <InputNumber min={1} max={10} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Car Name"
            name="carName"
            rules={[{ required: true, message: "Please enter the car name" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Car Rate ($/km)"
            name="carRate"
            rules={[{ required: true, message: "Please enter the car rate" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Estimated Cost ($)"
            name="estimatedCost"
            rules={[{ required: true, message: "Please enter the estimated cost" }]}
          >
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Payment Method" name="paymentMethod">
            <Select>
              <Option value="COD">Cash on Delivery</Option>
              <Option value="Advanced">Advanced</Option>
              <Option value="Online">Online</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Payment Status" name="paymentStatus">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="Paid">Paid</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item label="Advance Payment ($)" name="advancePayment">
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Balance Payment ($)" name="balancePayment">
            <InputNumber min={0} step={0.01} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Driver Assigned" name="driverAssigned">
            <Input />
          </Form.Item>

          <Form.Item label="Trip Status" name="tripStatus">
            <Select>
              <Option value="Pending">Pending</Option>
              <Option value="In Progress">In Progress</Option>
              <Option value="Completed">Completed</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%" }}>
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default RideEdit;