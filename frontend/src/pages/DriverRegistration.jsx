import { Form, Input, Button, Select, Switch, Row, Col, Card } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";
import { UserOutlined, PhoneOutlined, IdcardOutlined, CarOutlined, CameraOutlined } from "@ant-design/icons";

const { Option } = Select;

const DriverRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    console.log("Form values being sent:", values);
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/drivers-register`, values);
      toast.success("Driver registered successfully!");
      form.resetFields();
      navigate("/dashboard/drivers");
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
          Driver Registration
        </h2>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ ownCar: false }}
          size="large"
        >
          <Row gutter={[36, 36]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Full Name</span>}
                name="name"
                rules={[{ required: true, message: "Please enter driver name" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Name" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Phone</span>}
                name="phone"
                rules={[
                  { required: true, message: "Please enter phone number" },
                  { pattern: /^\+?\d{10,15}$/, message: "Enter a valid phone number" },
                ]}
              >
                <Input prefix={<PhoneOutlined />} placeholder="Phone" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[36, 36]}>
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >License Number</span>}
                name="licenseNo"
                rules={[{ required: true, message: "Please enter license number" }]}
              >
                <Input prefix={<IdcardOutlined />} placeholder="License Number" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Address</span>}
                name="address"
                rules={[{ required: true, message: "Please enter address" }]}
              >
                <Input placeholder="Address" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[36, 36]}>
            

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Vehicle Type</span>}
                name="vehicleType"
              >
                <Select placeholder="Select vehicle type">
                  <Option value="sedan">Sedan</Option>
                  <Option value="suv">SUV</Option>
                  <Option value="hatchback">Hatchback</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Driver Photo (Optional)</span>}
                name="photo"
              >
                <Input prefix={<CameraOutlined />} placeholder="Enter photo URL" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[36, 36]}>
            
            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >License Photo (Optional)</span>}
                name={["documents", "licensePhoto"]}
              >
                <Input prefix={<CarOutlined />} placeholder="Enter license photo URL" />
              </Form.Item>
            </Col>

            <Col xs={24} sm={12}>
              <Form.Item
                label={<span >Own Car</span>}
                name="ownCar"
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading} style={{ height: "50px", fontSize: "18px", fontWeight: "bold" }}>
              Register Driver
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DriverRegistration;
