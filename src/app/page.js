"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import newLogo from "../../public/logo_blue.svg";
import { Divider, Radio, Table } from "antd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const fetchDataApi = async () => {
  const token = process.env.NEXT_PUBLIC_Token;
  try {
    const data = await fetch(
      "https://api-app-staging.wobot.ai/app/v1/fetch/cameras",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    if (!data.ok) {
      console.log("data is not available");
      return [];
    }

    const responseData = await data.json();
    console.log("API Response:", responseData);

    if (Array.isArray(responseData)) {
      return responseData;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      return responseData.data;
    } else {
      console.log("Unexpected data format:", responseData);
      return [];
    }
  } catch (error) {
    console.log("Fetch error:", error);
    return [];
  }
};

const columns = [
  {
    title: "NAME",
    dataIndex: "name",
    render: (text) => <a>{text}</a>
  },
  {
    title: "HEALTH",
    render: (record) => (
      <div className="flex gap-2">
        <p>{record.health?.cloud || "N/A"}</p>
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
    render: (record) => {
      return record == "" ? <span>N/A</span> : <span>{record}</span>;
    }
  },
  {
    title: "TASK",
    dataIndex: "tasks",
    render: (task) => {
      return task == "" ? <span>N/A</span> : <span>{task} Task</span>;
    }
  },
  {
    title: "STATUS",
    dataIndex: "status",
    render: (status) => (
      <div
        className={`flex justify-center items-center ${
          status == "Active"
            ? `text-green-600 bg-green-300 p-1`
            : `bg-slate-400 p-1`
        }`}
      >
        <span>{status}</span>
      </div>
    )
  },
  {
    title: "ACTION",
    key: "action",
    render: (action) => (
      <button
        onClick={() => handleDelete(action)}
        className="text-red-500 hover:text-red-700"
      >
        <FontAwesomeIcon icon="fa-solid fa-ban" />
      </button>
    )
  }
];

const handleDelete = (record) => {
  console.log("Deleting record:", record);
};

const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(
      `selectedRowKeys: ${selectedRowKeys}`,
      "selectedRows: ",
      selectedRows
    );
  }
};

export default function Home() {
  const [tableData, setTableData] = useState([]);
  const [selectionType, setSelectionType] = useState("checkbox");

  useEffect(() => {
    const fetchDataAsync = async () => {
      try {
        const fetchingData = await fetchDataApi();
        console.log("Fetched Data:", fetchingData); // Log fetched data to inspect it
        if (Array.isArray(fetchingData)) {
          setTableData(fetchingData);
        } else {
          console.error("Fetched data is not an array:", fetchingData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchDataAsync();
  }, []);

  console.log("tableData==>", tableData);
  return (
    <>
    <div className="flex justify-center items-center top-5">
      <Image src={newLogo} alt="wobot-logo" height={150} width={150} />
    </div>
      <div className="w-100  items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="w-100 h-auto">
          <Radio.Group
            onChange={({ target: { value } }) => {
              setSelectionType(value);
            }}
            value={selectionType}
          >
            <Radio value="checkbox hidden">Checkbox</Radio>
          </Radio.Group>

          <Divider />

          <Table
            rowSelection={{
              type: selectionType,
              ...rowSelection
            }}
            columns={columns}
            dataSource={tableData}
          />
        </div>
      </div>
    </>
  );
}
