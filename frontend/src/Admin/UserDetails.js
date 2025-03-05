import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SurveyFormService from '../Service/SurveyFormService';
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper
} from '@tanstack/react-table';
import "./UserDetails.css"

export default function UserDetails() {
    const [data, setData] = useState([]);
    const [globalFilter, setGlobalFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5; // Number of rows per page
    const navigate = useNavigate();

    useEffect(() => {
        SurveyFormService.getUserDetails().then((res) => {
            console.log("Response from API:", res.data);
            setData(res.data);
        }).catch(err => console.error("Error fetching data:", err));
    }, []);

    const columnHelper = createColumnHelper();

    const columns = [
        columnHelper.accessor('fullName', { header: 'Name' }),
        columnHelper.accessor('createdby', { header: 'Created By' }),
        columnHelper.accessor('address', { header: 'Address' }),
        {
            accessorKey: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <button 
                    className="btn button-color btn-sm"
                    onClick={() => navigate(`/details/${row.original.id}`, { state: { user: row.original } })}
                >
                    View Details
                </button>
            )
        }
    ];

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    // 🔹 Search Filtering with NULL Safety
    const filteredData = table.getRowModel().rows.filter(row => {
        const fullName = row.original.fullName ? row.original.fullName.toLowerCase() : "";
        const createdby = row.original.createdby ? row.original.createdby.toLowerCase() : "";
        const address = row.original.address ? row.original.address.toLowerCase() : "";
        const searchValue = globalFilter.toLowerCase();
        return fullName.includes(searchValue) || createdby.includes(searchValue) || address.includes(searchValue);
    });

    // 🔹 Pagination
    const totalPages = Math.ceil(filteredData.length / rowsPerPage);
    const paginatedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2>User Details</h2>
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                />
            </div>

            <table className="table table-bordered">
                <thead  className="header-color">
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {paginatedData.map(row => (
                        <tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                <td key={cell.id}>
                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* 🔹 Pagination Controls */}
            <nav>
                <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button className="btn button-color" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                            <button className="btn button-color" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                        </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className=" btn button-color" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}
