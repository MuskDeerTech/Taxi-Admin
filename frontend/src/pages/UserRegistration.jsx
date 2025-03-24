import React, { useState } from "react";
import { Layout, Form, Input, Button, Select, Typography, Card, Row, Col } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import {
  MailOutlined,
  LockOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const { Option } = Select;
const { Title } = Typography;
const { Content } = Layout;

const UserRegistration = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await axios.post("http://157.245.101.161:5000/register", values);
      toast.success("User registered successfully!");
      form.resetFields();
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.error || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout >
      <Content>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={16} xl={24}>
            <Card
              style={{
                borderRadius: "12px",
                padding: "0px 20px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
                width: "100%",
              }}
            >
              <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
                User Registration
              </Title>
              <Form form={form} layout="vertical" onFinish={onFinish}>
                <Row gutter={[36, 36]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Full Name"
                      name="name"
                      rules={[{ required: true, message: "Enter your name" }]}
                    >
                      <Input prefix={<UserOutlined />} placeholder="Name" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[
                        { required: true, message: "Enter your email" },
                        { type: "email", message: "Invalid email" },
                      ]}
                    >
                      <Input prefix={<MailOutlined />} placeholder="Email" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[36, 36]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Password"
                      name="password"
                      rules={[{ required: true, message: "Enter password" }]}
                    >
                      <Input.Password prefix={<LockOutlined />} placeholder="Password" size="large" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Phone"
                      name="phone"
                      rules={[
                        { required: true, message: "Enter phone number" },
                        { pattern: /^\d{10}$/, message: "Must be 10 digits" },
                      ]}
                    >
                      <Input prefix={<PhoneOutlined />} placeholder="Phone" size="large" />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={[36, 36]}>
                  <Col xs={24} sm={12}>
                    <Form.Item
                      label="Role"
                      name="role"
                      rules={[{ required: true, message: "Select a role" }]}
                    >
                      <Select placeholder="Select role" size="large">
                        <Option value="admin">Admin</Option>
                        <Option value="customer">Customer</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    block
                    loading={loading}
                    size="large"
                    style={{ fontWeight: "bold", height: "50px" }}
                  >
                    Register
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>
        </Row>
      </Content>
    </Layout>
  );
};

export default UserRegistration;
