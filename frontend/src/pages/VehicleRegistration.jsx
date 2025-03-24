import { Form, Input, Button, Select, Row, Col, Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { CarOutlined, FileTextOutlined, HomeOutlined, UserOutlined } from "@ant-design/icons";

const { Option } = Select;

const VehicleRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Form values being sent:", values);
    setLoading(true);
    try {
      await axios.post("http://157.245.101.161:5000/vehicles-register", values);
      toast.success("Vehicle registered successfully!");
      form.resetFields();
      navigate("/dashboard/vehicle");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      }}
    >
      <Card
        style={{
          width: "100%",
          
          padding: "0px 20px",
          borderRadius: "12px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          background: "white",
        }}
      >
        <h2 style={{ textAlign: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
          Vehicle Registration
        </h2>
        <Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ status: "active" }} size="large">
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Make" name="make" rules={[{ required: true, message: "Please enter vehicle make" }]}>
                <Input prefix={<CarOutlined />} placeholder="Toyota, BMW, etc." />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Model" name="model" rules={[{ required: true, message: "Please enter vehicle model" }]}>
                <Input placeholder="Camry, X5, etc." />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Year" name="year" rules={[{ required: true, message: "Please enter year" }]}>
                <Input type="number" placeholder="2022" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="License Plate" name="licensePlate" rules={[{ required: true, message: "Please enter license plate" }]}>
                <Input placeholder="MH12AB1234" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Capacity" name="capacity" rules={[{ required: true, message: "Please enter capacity" }]}>
                <Input type="number" placeholder="Number of passengers" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Vehicle Type" name="vehicleType" rules={[{ required: true, message: "Please select vehicle type" }]}>
                <Select placeholder="Select vehicle type">
                  <Option value="Sedan">Sedan</Option>
                  <Option value="SUV">SUV</Option>
                  <Option value="Hatchback">Hatchback</Option>
                  <Option value="Van">Van</Option>
                  <Option value="Minivan">Minivan</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Insurance Expiry" name="insuranceExpiry" rules={[{ required: true, message: "Please enter insurance expiry date" }]}>
                <Input type="date" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Fuel Type" name="fuelType" rules={[{ required: true, message: "Please select fuel type" }]}>
                <Select placeholder="Select fuel type">
                  <Option value="Petrol">Petrol</Option>
                  <Option value="Diesel">Diesel</Option>
                  <Option value="Electric">Electric</Option>
                  <Option value="Hybrid">Hybrid</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Mileage" name="mileage" rules={[{ required: true, message: "Please enter mileage" }]}>
                <Input type="number" placeholder="25000 km" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Owner Name" name={["owner", "name"]} rules={[{ required: true, message: "Please enter owner name" }]}>
                <Input prefix={<UserOutlined />} placeholder="Enter owner name" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="Owner Address" name={["owner", "address"]} rules={[{ required: true, message: "Please enter owner address" }]}>
                <Input prefix={<HomeOutlined />} placeholder="Enter owner address" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item label="Vehicle Picture (Optional)" name="vehiclePicture">
                <Input prefix={<FileTextOutlined />} placeholder="Enter vehicle picture URL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item label="RC Book Document (Optional)" name={["documents", "rcBook"]}>
                <Input prefix={<FileTextOutlined />} placeholder="Enter RC book URL" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: "50px", fontSize: "18px", fontWeight: "bold" }}>
              Register Vehicle
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default VehicleRegistration;
