import { Table, Button, Card, Space, Input, Select, Tooltip } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";

const Drivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [filteredDrivers, setFilteredDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [ownCarFilter, setOwnCarFilter] = useState(null); // Filter for Own Car
  const [licenseFilter, setLicenseFilter] = useState(""); // Filter for License Number
  const navigate = useNavigate();

  useEffect(() => {
    fetchDrivers();
  }, []);

  // Apply filters whenever searchText, ownCarFilter, or licenseFilter changes
  useEffect(() => {
    applyFilters();
  }, [searchText, ownCarFilter, licenseFilter, drivers]);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/drivers`); // Updated endpoint
      setDrivers(response.data);
      setFilteredDrivers(response.data); // Initialize filtered data
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error(
        "Failed to fetch drivers: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Apply filters based on search text, ownCar, and license number
  const applyFilters = () => {
    let filtered = [...drivers];
    console.log("Applying filters:", {
      searchText,
      ownCarFilter,
      licenseFilter,
    });

    if (searchText) {
      filtered = filtered.filter(
        (driver) =>
          driver.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          driver.phone?.includes(searchText) ||
          driver.address?.toLowerCase().includes(searchText.toLowerCase()) ||
          driver.licenseNo?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (ownCarFilter !== null) {
      filtered = filtered.filter((driver) => driver.ownCar === ownCarFilter);
    }

    if (licenseFilter) {
      filtered = filtered.filter((driver) =>
        driver.licenseNo?.toLowerCase().includes(licenseFilter.toLowerCase())
      );
    }

    console.log("Filtered drivers:", filtered);
    setFilteredDrivers(filtered);
  };

  // Handle search input
  const handleSearch = (value) => {
    setSearchText(value);
  };

  // Handle Own Car filter change
  const handleOwnCarFilter = (value) => {
    setOwnCarFilter(value);
  };

  // Handle License Number filter change
  const handleLicenseFilter = (value) => {
    setLicenseFilter(value);
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchText("");
    setOwnCarFilter(null);
    setLicenseFilter("");
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#333" }}>{text || "N/A"}</span>
      ),
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      sorter: (a, b) => a.phone?.localeCompare(b.phone), // Lexicographical sort for phone
      render: (text) => <span style={{ color: "#555" }}>{text || "N/A"}</span>,
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      ellipsis: true,
      sorter: (a, b) => a.address?.localeCompare(b.address), // Alphabetical sort
      render: (text) => (
        <Tooltip title={text}>
          <span>{text || "N/A"}</span>
        </Tooltip>
      ),
    },
    {
      title: "License Number",
      dataIndex: "licenseNo",
      key: "licenseNo",
      sorter: (a, b) => a.licenseNo?.localeCompare(b.licenseNo), // Lexicographical sort
      render: (text) => text || "N/A",
    },
    {
      title: "Own Car",
      dataIndex: "ownCar",
      key: "ownCar",
      sorter: (a, b) => (a.ownCar === b.ownCar ? 0 : a.ownCar ? -1 : 1), // Boolean sort (true first)
      render: (value) => (
        <span style={{ color: value ? "#52c41a" : "#f5222d" }}>
          {value ? "Yes" : "No"}
        </span>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button
          type="link"
          onClick={() => navigate(`/dashboard/drivers/${record._id}`)}
          style={{ color: "#1890ff", padding: 0 }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
      }}
    >
      <Card
        title={
          <span style={{ fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Driver List
          </span>
        }
        extra={
          <Space>
            <Input
              placeholder="Search drivers..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear // Add close icon to clear the search input
              style={{ width: 200, borderRadius: "4px" }}
            />
            <Select
              placeholder="Own Car"
              value={ownCarFilter}
              onChange={handleOwnCarFilter}
              allowClear
              style={{ width: 120, borderRadius: "4px" }}
            >
              <Select.Option value={true}>Yes</Select.Option>
              <Select.Option value={false}>No</Select.Option>
            </Select>
            <Input
              placeholder="License No."
              value={licenseFilter}
              onChange={(e) => handleLicenseFilter(e.target.value)}
              allowClear // Add close icon to clear the license filter input
              style={{ width: 150, borderRadius: "4px" }}
            />
            <Tooltip title="Reset Filters">
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={resetFilters}
                style={{ borderRadius: "4px" }}
              />
            </Tooltip>
            <Link to="/dashboard/driver-registration">
              <Button type="primary" style={{ borderRadius: "4px" }}>
                Add Driver
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
          dataSource={filteredDrivers}
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

// Add custom CSS for table hover effect using AntD's class structure
const styles = `
  .custom-table-row:hover {
    background-color: #fafafa;
    transition: background-color 0.3s ease;
  }
  .ant-table-thead > tr > th {
    background: #fafafa;
    font-weight: 600;
    color: #333;
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

export default Drivers;