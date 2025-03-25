import {
  Table,
  Button,
  Card,
  Space,
  Input,
  Select,
  Tooltip,
  Typography,
} from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FilterOutlined,
  EditOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const Ride = () => {
  const [rides, setRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [tripStatusFilter, setTripStatusFilter] = useState(null);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchText, tripStatusFilter, paymentStatusFilter, rides]);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRides(response.data);
      setFilteredRides(response.data);
    } catch (error) {
      console.error("Error fetching rides:", error);
      toast.error(
        "Failed to fetch rides: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rides];
    console.log("Applying filters:", {
      searchText,
      tripStatusFilter,
      paymentStatusFilter,
    });

    if (searchText) {
      filtered = filtered.filter(
        (ride) =>
          ride.name?.toLowerCase().includes(searchText.toLowerCase()) ||
          ride.email?.toLowerCase().includes(searchText.toLowerCase()) ||
          ride.mobile?.includes(searchText) ||
          ride.from?.toLowerCase().includes(searchText.toLowerCase()) ||
          ride.to?.toLowerCase().includes(searchText.toLowerCase()) ||
          ride.carName?.toLowerCase().includes(searchText.toLowerCase()) ||
          ride.driverAssigned?.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    if (tripStatusFilter) {
      filtered = filtered.filter(
        (ride) => ride.tripStatus === tripStatusFilter
      );
    }

    if (paymentStatusFilter) {
      filtered = filtered.filter(
        (ride) => ride.paymentStatus === paymentStatusFilter
      );
    }

    console.log("Filtered rides:", filtered);
    setFilteredRides(filtered);
  };

  const handleSearch = (value) => {
    setSearchText(value);
  };

  const handleTripStatusFilter = (value) => {
    setTripStatusFilter(value);
  };

  const handlePaymentStatusFilter = (value) => {
    setPaymentStatusFilter(value);
  };

  const resetFilters = () => {
    setSearchText("");
    setTripStatusFilter(null);
    setPaymentStatusFilter(null);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name?.localeCompare(b.name),
      render: (text) => (
        <span style={{ fontWeight: 500, color: "#1f1f1f" }}>
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email?.localeCompare(b.email),
      render: (text) => (
        <span style={{ color: "#595959" }}>{text || "N/A"}</span>
      ),
    },
    {
      title: "From",
      dataIndex: "from",
      key: "from",
      sorter: (a, b) => a.from?.localeCompare(b.from),
      render: (text) => text || "N/A",
    },
    {
      title: "To",
      dataIndex: "to",
      key: "to",
      sorter: (a, b) => a.to?.localeCompare(b.to),
      render: (text) => text || "N/A",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      render: (date) => (date ? new Date(date).toLocaleDateString() : "N/A"),
    },
    {
      title: "Trip Status",
      dataIndex: "tripStatus",
      key: "tripStatus",
      sorter: (a, b) => a.tripStatus?.localeCompare(b.tripStatus),
      render: (text) => (
        <span
          style={{
            color:
              text === "Completed"
                ? "#52c41a"
                : text === "In Progress"
                ? "#faad14"
                : "#f5222d",
            fontWeight: 500,
          }}
        >
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Payment Status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      sorter: (a, b) => a.paymentStatus?.localeCompare(b.paymentStatus),
      render: (text) => (
        <span
          style={{
            color:
              text === "Completed"
                ? "#52c41a"
                : text === "Paid"
                ? "#1890ff"
                : "#f5222d",
            fontWeight: 500,
          }}
        >
          {text || "N/A"}
        </span>
      ),
    },
    {
      title: "Driver Assigned",
      dataIndex: "driverAssigned",
      key: "driverAssigned",
      sorter: (a, b) => a.driverAssigned?.localeCompare(b.driverAssigned),
      render: (text) => text || "N/A",
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/dashboard/rides/${record._id}`)}
            style={{ color: "#1890ff", padding: 0 }}
         />
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/dashboard/rides/edit/${record._id}`)}
            style={{ color: "#fa8c16", padding: 0 }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5"}}>
      <Card
        title={
          <Title level={3} style={{ margin: 0, color: "#1f1f1f" }}>
            Ride List
          </Title>
        }
        extra={
          <Space>
            <Input
              placeholder="Search rides..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => handleSearch(e.target.value)}
              allowClear
              style={{ width: 200 }}
            />
            <Select
              placeholder="Trip Status"
              value={tripStatusFilter}
              onChange={handleTripStatusFilter}
              allowClear
              style={{ width: 150 }}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="In Progress">In Progress</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
            <Select
              placeholder="Payment Status"
              value={paymentStatusFilter}
              onChange={handlePaymentStatusFilter}
              allowClear
              style={{ width: 150 }}
            >
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Paid">Paid</Select.Option>
              <Select.Option value="Completed">Completed</Select.Option>
            </Select>
            <Tooltip title="Reset Filters">
              <Button
                type="default"
                icon={<FilterOutlined />}
                onClick={resetFilters}
              />
            </Tooltip>
          </Space>
        }
        style={{
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          background: "#fff",
        }}
 
      >
        <Table
          columns={columns}
          dataSource={filteredRides}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          bordered
          style={{ borderRadius: "8px", padding: "0px", overflow: "hidden" }}
          rowClassName="custom-table-row"
        />
      </Card>
    </div>
  );
};

// Add custom CSS for table hover effect using AntD classes
const styles = `
  .custom-table-row:hover {
    background-color: #e6f7ff !important;
    transition: background-color 0.3s ease;
  }
  .ant-table-thead > tr > th {
    background: #fafafa !important;
    font-weight: 600;
    color: #1f1f1f;
    border-bottom: 2px solid #e8e8e8 !important;
  }
  .ant-table-tbody > tr > td {
    color: #595959;
    border-bottom: 1px solid #e8e8e8 !important;
  }
  .ant-table-tbody > tr:hover > td {
    background: #e6f7ff !important;
  }
  .ant-table-container {
    border-radius: 8px !important;
  
   
  }
    .ant-card-body{
    padding: 0px !important;
    }
  .ant-table {
    background: #fff !important;
  }
`;

// Inject styles into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default Ride;
