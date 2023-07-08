import React, { useState, useEffect } from "react";
import { Menu, Dropdown, Table } from "antd";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ApiFetch from "./service/ApiCalls/request";
import { ColumnsType } from "antd/es/table";
import logo from "./logo.svg";
import "./App.css";
import Create from "./CreatePage";
import Edit from "./EditPage";
import Delete from "./DeletePage";

interface DataTypeDeposit {
    amount: number;
    fromAddress: string;
}

interface DataTypeWithdrawls {
    amount: number;
    toAddress: string;
    wasApprovedByUser2FA: boolean;
}

interface DataTypeTradeOrder {
    amount: number;
    tradeOrderType: {
        name: string;
    };
}

const columnsDeposit: ColumnsType<DataTypeDeposit> = [
    {
        title: "Amount",
        dataIndex: "amount",
        width: 150,
        sorter: (a, b) => a.amount - b.amount, // Enable sorting by amount
    },
    {
        title: "From Address",
        dataIndex: "fromAddress",
    },
];

const columnsTradeOrders: ColumnsType<DataTypeTradeOrder> = [
    {
        title: "Amount",
        dataIndex: "amount",
        width: 150,
        sorter: (a, b) => a.amount - b.amount, // Enable sorting by amount
    },
    {
        title: "Trade Order Type",
        dataIndex: ["tradeOrderType", "name"],
    },
];

const columnsWithdrawals: ColumnsType<DataTypeWithdrawls> = [
    {
        title: "Amount",
        dataIndex: "amount",
        width: 150,
        sorter: (a, b) => a.amount - b.amount, // Enable sorting by amount
    },
    {
        title: "To Address",
        dataIndex: "toAddress",
    },
    {
        title: "2FA Confirmed",
        dataIndex: "wasApprovedByUser2FA",
        key: "isActive",
        render: (isActive: any) => (isActive ? "True" : "False"),
    },
];

function App() {
    const [data, setData] = useState<any>();
    const [options, setOptions] = useState([]);
    const [selectedValue, setSelectedValue] = useState("Deposit");

    const handleSelectDropDown = (event: any) => {
        setSelectedValue(event.target.value);
    };
    const handleMenuClick = (event: any) => {
        setSelectedValue(event.key);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="create">
                <Link to="/create">Create</Link>
            </Menu.Item>
            <Menu.Item key="edit">
                <Link to="/edit">Edit</Link>
            </Menu.Item>
            <Menu.Item key="delete">
                <Link to="/delete">Delete</Link>
            </Menu.Item>
        </Menu>
    );

    useEffect(() => {
        const fetchDropDown = async () => {
            try {
                const response = await fetch(ApiFetch.fetchOperationTypes);
                const data = await response.json();
                const newOptions = data.map((item: any) => ({
                    value: item.id,
                    label: item.name,
                }));
                setOptions(newOptions);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDropDown();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let url = "";
                switch (selectedValue) {
                    case "Deposit":
                        url = ApiFetch.fetchDeposits;
                        break;
                    case "Withdrawal":
                        url = ApiFetch.fetchWithdrawals;
                        break;
                    case "TradeOrder":
                        url = ApiFetch.fetchTradeOrder;
                        break;
                    default:
                        url = "";
                }
                if (url) {
                    const response = await fetch(url);
                    const json = await response.json();
                    setData(json);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, [selectedValue]);

    console.log("FETCH: ", data);
    console.log("dp value is: ", selectedValue);

    return (
        <div className="App">
            <Router>
                <nav className="navbar">
                    <Dropdown overlay={menu} placement="bottomLeft" arrow>
                        <button className="navbar-button">Deposit</button>
                    </Dropdown>
                </nav>
                <Routes>
                    <Route path="/" element={<OperationTable />} />
                    <Route path="/create" element={<Create />} />
                    <Route path="/edit" element={<Edit />} />
                    <Route path="/delete" element={<Delete />} />
                </Routes>
            </Router>
        </div>
    );

    function OperationTable() {
        return (
            <>
                <h1>Operation table</h1>
                <select value={selectedValue} onChange={handleSelectDropDown}>
                    {options.map((option: any) => (
                        <option key={option.value} value={option.label}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className="Table-grid">
                    {selectedValue === "Deposit" ? (
                        <Table
                            columns={columnsDeposit}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            scroll={{ y: 300 }}
                        />
                    ) : selectedValue === "Withdrawal" ? (
                        <Table
                            columns={columnsWithdrawals}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            scroll={{ y: 300 }}
                        />
                    ) : (
                        <Table
                            columns={columnsTradeOrders}
                            dataSource={data}
                            pagination={{ pageSize: 5 }}
                            scroll={{ y: 300 }}
                        />
                    )}
                </div>
            </>
        );
    }
}

export default App;
