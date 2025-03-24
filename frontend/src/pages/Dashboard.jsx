import React, { useEffect, useState } from "react";
import { Layout, Menu, Button } from "antd";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  TeamOutlined,
  CarOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import UserRegistration from "./UserRegistration";
import VehicleRegistration from "./VehicleRegistration"; // Import VehicleRegistration
import Vehicle from "./Vehicle"; // Import Vehicle
import DriverRegistration from "./DriverRegistration"; // Import DriverRegistration
import Drivers from "./Drivers"; // Import Drivers
import DriverDetails from "./DriverDetails"; // Import DriverDetails
import VehicleDetails from "./VehicleDetails"; // Import VehicleDetails
import Ride from "./Ride";
import RideDetails from "./RideDetails";
import RideEdit from "./RideEdit";

const { Header, Sider, Content } = Layout;

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // ✅ Prevent Flashing

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true }); // ✅ Instant Redirect to Login Without Flashing
    } else {
      setIsAuthenticated(true); // ✅ Set Authenticated State to Prevent Flash
    }
  }, [navigate]);

  // ✅ Prevent Dashboard from Rendering Until Auth is Checked
  if (isAuthenticated === null) return null;

  // 🔹 Handle Logout Function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/", { replace: true }); // ✅ Instantly Redirect & Prevent Back Navigation
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider theme="dark" collapsible>
        <div style={{ padding: "20px", color: "#fff", textAlign: "center" }}>
          <UserOutlined style={{ fontSize: "24px" }} /> Rohini
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            { key: "/dashboard", icon: <DashboardOutlined />, label: "Dashboard" },
            { key: "/dashboard/user-register", icon: <UserOutlined />, label: "User Register" },
            { key: "/dashboard/vehicle", icon: <CarOutlined />, label: "Vehicles" }, // Added Vehicle
           
            { key: "/dashboard/drivers", icon: <TeamOutlined />, label: "Drivers" }, // Added Drivers
            { key: "/dashboard/rides", icon: <CalendarOutlined />, label: "Rides" }, // Added Drivers
            
          ]}
        />
      </Sider>

      {/* Main Content */}
      <Layout>
        <Header
          style={{
            background: "#fff",
            fontWeight: "600",
            fontSize: "20px",
            padding: "10px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <p>Good Morning, Rohini 👋</p>

          {/* 🔹 Logout Button */}
          <Button type="primary" icon={<LogoutOutlined />} onClick={handleLogout} danger>
            Logout
          </Button>
        </Header>

        <Content style={{ margin: "20px" }}>
          <Routes>
            <Route index element={<h1>Dashboard</h1>} />
            <Route path="user-register" element={<UserRegistration />} />
            <Route path="vehicle" element={<Vehicle />} /> {/* Added Vehicle route */}
            <Route path="vehicle-registration" element={<VehicleRegistration />} /> {/* Added VehicleRegistration route */}
            <Route path="drivers" element={<Drivers />} /> {/* Added Drivers route */}
            <Route path="driver-registration" element={<DriverRegistration />} /> {/* Added DriverRegistration route */}
            <Route path="drivers/:id" element={<DriverDetails />} /> {/* Added route for driver details */}
            <Route path="vehicles/:id" element={<VehicleDetails />} /> {/* Added route for vehicle details */}
            <Route path="rides" element={<Ride />} /> {/* Added route for rides */}
            <Route path="rides/:id" element={<RideDetails />} /> {/* Added route for ride details */}
            <Route path="rides/edit/:id" element={<RideEdit />} /> {/* Added route for ride edit */}
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;