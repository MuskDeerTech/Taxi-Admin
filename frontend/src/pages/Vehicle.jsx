import { Table, Button, Card, Space, Input, Select, Tooltip } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const Vehicle = () => {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState(null); // Filter for Status
  const [vehicleTypeFilter, setVehicleTypeFilter] = useState(null); // Filter for Vehicle Type
  const navigate = useNavigate();

  useEffect(() => {
    fetchVehicles();
  }, []);

  // Apply filters whenever searchText, statusFilter, or vehicleTypeFilter changes
  useEffect(() => {
    applyFilters();
  }, [searchText, statusFilter, vehicleTypeFilter, vehicles]);

  const fetchVehicles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/vehicles`);
      setVehicles(response.data);
      setFilteredVehicles(response.data); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching vehicles:", error);
      toast.error("Failed to fetch vehicles: " + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  // Apply filters based on search text, status, and vehicle type
  const applyFilters = () => {
    let filtered = [...vehicles];
    console.log("Applying filters:", { searchText, statusFilter, vehicleTypeFilter });

    if (searchText) {
      filtered = filtered.filter(
        (vehicle) =>
          vehicle.make?.toLowerCase().includes(searchText.toLowerCase()) ||
          vehicle.model?.toLowerCase().includes(searchText.toLowerCase()) ||
          vehicle.year?.toString().includes(searchText) ||
          vehicle.licensePlate?.toLowerCase().includes(searchText.toLowerCase()) ||
          vehicle.status?.toLowerCase().includes(searchText.toLowerCase()) ||
          vehicle.vehicleType?.toLowerCase().includes(searchText.toLowerCase()) ||
          vehicle.capacity?.toString().includes(searchText)
      );
    }

    if (statusFilter) {
      filtered = filtered.filter((vehicle) => vehicle.status === statusFilter);
    }

    if (vehicleTypeFilter) {
      filtered = filtered.filter((vehicle) => vehicle.vehicleType === vehicleTypeFilter);
    }

    console.log("Filtered vehicles:", filtered);
    setFilteredVehicles(filtered);
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle Status filter change
  const handleStatusFilter = (value) => {
    setStatusFilter(value);
  };

  // Handle Vehicle Type filter change
  const handleVehicleTypeFilter = (value) => {
    setVehicleTypeFilter(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setStatusFilter(null);
    setVehicleTypeFilter(null);
  };

  const columns = [
    {
      title: "Make",
      dataIndex: "make",
      key: "make",
      sorter: (a, b) => a.make?.localeCompare(b.make),
      render: (text) => <span style={{ fontWeight: 500, color: "#333" }}>{text || "N/A"}</span>,
    },
    {
      title: "Model",
      dataIndex: "model",
      key: "model",
      sorter: (a, b) => a.model?.localeCompare(b.model),
      render: (text) => <span style={{ color: "#555" }}>{text || "N/A"}</span>,
    },
    {
      title: "Year",
      dataIndex: "year",
      key: "year",
      sorter: (a, b) => (a.year || 0) - (b.year || 0), // Numeric sort for year
      render: (text) => text || "N/A",
    },
    {
      title: "License Plate",
      dataIndex: "licensePlate",
      key: "licensePlate",
      sorter: (a, b) => a.licensePlate?.localeCompare(b.licensePlate),
      render: (text) => text || "N/A",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      sorter: (a, b) => a.status?.localeCompare(b.status),
      render: (text) => <span style={{ color: text === "Active" ? "#52c41a" : "#f5222d" }}>{text || "N/A"}</span>,
    },
    {
      title: "Capacity",
      dataIndex: "capacity",
      key: "capacity",
      sorter: (a, b) => (a.capacity || 0) - (b.capacity || 0), // Numeric sort for capacity
      render: (text) => text || "N/A",
    },
    {
      title: "Vehicle Type",
      dataIndex: "vehicleType",
      key: "vehicleType",
      sorter: (a, b) => a.vehicleType?.localeCompare(b.vehicleType),
      render: (text) => text || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/vehicles/${record._id}`)}
          style={{ color: "#1890ff", padding: 0 }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh",  }}>
      <Card
        title={
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Vehicle List
          </span>
        }
        extra={
          <Space>
            <Input
              placeholder="Search vehicles..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 200, borderRadius: "4px" }}
            />
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={handleStatusFilter}
              allowClear
              style={{ width: 120, borderRadius: "4px" }}
            >
              <Select.Option value="Active">Active</Select.Option>
              <Select.Option value="Inactive">Inactive</Select.Option>
              <Select.Option value="Maintenance">Maintenance</Select.Option>
            </Select>
            <Select
              placeholder="Vehicle Type"
              value={vehicleTypeFilter}
              onChange={handleVehicleTypeFilter}
              allowClear
              style={{ width: 150, borderRadius: "4px" }}
            >
              <Select.Option value="Sedan">Sedan</Select.Option>
              <Select.Option value="SUV">SUV</Select.Option>
              <Select.Option value="Truck">Truck</Select.Option>
              <Select.Option value="Van">Van</Select.Option>
            </Select>
            <Tooltip title="Reset Filters">
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={resetFilters}
                style={{ borderRadius: "4px" }}
              />
            </Tooltip>
            <Link to="/dashboard/vehicle-registration">
              <Button type="primary" style={{ borderRadius: "4px" }}>
                Add Vehicle
              </Button>
            </Link>
          </Space>
        }
        style={{
          borderRadius: "8px",
          border: "1px solid #d9d9d9",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
        bodyStyle={{ padding: "16px" }}
      >
        <Table
          columns={columns}
          dataSource={filteredVehicles}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          rowClassName={() => "custom-table-row"}
          style={{ borderRadius: "8px", overflow: "hidden" }}
        />
      </Card>
    </div>
  );
};

// Add custom CSS for table hover effect and enhanced sort arrows
const styles = `
  .custom-table-row:hover {
    background-color: #fafafa;
    transition: background-color 0.3s ease;
  }
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
    position: relative;
    padding-right: 20px; /* Add space for custom arrow */
  }
  .ant-table-tbody > tr > td {
    color: #555;
  }

`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Vehicle;