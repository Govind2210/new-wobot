"use client"; 
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Table, Select, Divider, message, Input } from 'antd'; 
import { fetchCameras, updateCameraStatus} from "@/services/cameras"; 
import OnlineIcon from "../../public/icons/onlineIcon";
import { NewcloudIcon } from "../../public/icons/cloud";
import ServerIcon from "../../public/icons/server";
import { BanIcon } from "../../public/icons/ban";
import { Newlogo } from "../../public/icons/logo";
import EditIcon from "../../public/icons/edit";

const { Option } = Select;
const { Search } = Input;

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter(); // Initialize router

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const fetchedData = await fetchCameras();
        setTableData(fetchedData);
        setFilteredData(fetchedData); 
        const uniqueLocations = [...new Set(fetchedData.map((camera) => camera.location))];
        setCities(uniqueLocations);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  const handleStatusChange = async (cameraId, newStatus) => {
    try {
      const updatedCamera = await updateCameraStatus(cameraId, newStatus);
      setTableData((prev) =>
        prev.map((camera) =>
          camera.id === cameraId ? { ...camera, status: updatedCamera.status } : camera
        )
      );
      message.success("Camera status updated successfully.");
      // router.refresh();
      window.location.reload(); 

    } catch (error) {
      console.error("Failed to update camera status:", error);
      message.error("Failed to update camera status.");
    }
  };


  const handleLocationChange = (location) => {
    setSelectedCity(location);
    filterData(location, selectedStatus, searchTerm);
  };

  const handleFilterStatusChange = (status) => {
    setSelectedStatus(status);
    filterData(selectedCity, status, searchTerm);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    filterData(selectedCity, selectedStatus, e.target.value);
  };

  const filterData = (location, status, term) => {
    let filtered = tableData;

    if (location) {
      filtered = filtered.filter((camera) => camera.location === location);
    }

    if (status) {
      filtered = filtered.filter((camera) => camera.status === status);
    }

    if (term) {
      filtered = filtered.filter((camera) =>
        camera.location.toLowerCase().includes(term.toLowerCase()) ||
        camera.status.toLowerCase().includes(term.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, "selectedRows: ", selectedRows);
    }
  };

  const columns = [
    {
      title: "NAME",
      dataIndex: "name",
      render: (text) => (
        <span className="flex items-center gap-4">
          <OnlineIcon />
          <a>{text}</a>
        </span>
      )
    },
    {
      title: "HEALTH",
      render: (record) => (
        <div className="flex gap-2">
          <NewcloudIcon />
          <p>{record.health?.cloud || "N/A"}</p>
          <ServerIcon />
          <p>{record.health?.device || "N/A"}</p>
        </div>
      )
    },
    {
      title: "LOCATION",
      dataIndex: "location"
    },
    {
      title: "RECORDER",
      dataIndex: "recorder",
      render: (record) =>
        record === "" ? <span>N/A</span> : <span>{record}</span>
    },
    {
      title: "TASK",
      dataIndex: "tasks",
      render: (task) =>
        task === "" ? <span>N/A</span> : <span>{task} Task</span>
    },
    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <div
          className={`flex justify-center items-center ${
            status === "Active"
              ? "text-green-600 bg-green-300 p-1"
              : "bg-slate-400 p-1"
          }`}
        >
          <span>{status}</span>
        </div>
      )
    },
    {
      title: "ACTION",
      key: "action",
      render: (record) => (
        <span className="flex  items-center gap-2">
          <button
            onClick={() =>
              handleStatusChange(
                record.id,
                record.status === "Active" ? "Inactive" : "Active"
              )
            }
          >
            <EditIcon />
          </button>
          <button onClick={() => handleDelete(record.id)}>
            <BanIcon />
          </button>
        </span>
      )
    }
  ];

  return (
    <>
    {
      filteredData ? <>
         <div className='mt-2'>
      <div className="flex justify-center items-center top-10">
        <Newlogo />
      </div>
      <div className="mx-20">
        <div className="flex justify-between p-2">
          <div>
            <h3 className='text-bold'>Cameras</h3>
            <p>Manage Your Camera here</p>
          </div>
          <div>
            <Search
              placeholder="Search by City / Status"
              className="p-2"
              onChange={handleSearchChange}
              value={searchTerm}
              allowClear
            />
          </div>
        </div>
        <div className="flex gap-4">
          <Select
            placeholder="Select Location"
            style={{ width: 200 }}
            onChange={handleLocationChange}
            value={selectedCity}
            allowClear
          >
            {cities.map((location) => (
              <Option key={location} value={location}>
                {location}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="Select Status"
            style={{ width: 200 }}
            onChange={handleFilterStatusChange}
            value={selectedStatus}
            allowClear
          >
            <Option value="Active">Active</Option>
            <Option value="Inactive">Inactive</Option>
          </Select>
        </div>
      </div>
      <div className="w-100 items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)] pt-1 mx-20">
        <Divider />
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection
          }}
          columns={columns}
          dataSource={filteredData}
          rowKey={(record) => record.id}
        />
      </div>
    </div>
      </> : 
      <>
        <DotLoader />
      </>
    }
   
    </>
  );
}
