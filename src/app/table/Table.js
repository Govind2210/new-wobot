"use client";
import React, { useState, useEffect } from "react";

export const TableData = () => {
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchdata = () => {
        const data = fetch("https://api-app-staging.wobot.ai/app/v1/fetch/cameras")
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setTableData(data);
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    }
    fetchdata()
  }, []);
  console.log("my data", tableData);
  return <div>Table</div>;
};
