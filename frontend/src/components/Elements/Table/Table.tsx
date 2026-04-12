import React from "react";
import { Pagination } from "@mui/material";

// Define the type for columns and rows
type TableProps = {
  pagination?: boolean;
  columns: { header: string; field: string }[]; // Array of columns (header, field)
  rows: { [key: string]: any }[]; // Array of row objects (with dynamic keys)
};

export const Table: React.FC<TableProps> = ({ pagination = true, columns, rows }) => {
  return (
    <div>
      {/* {pagination && (
        <div className="d-flex justify-content-between pb-3 align-items-end">
          <div className="d-flex align-items-center">
            Show
            <select
              defaultValue={10}
              className="mx-2 form-control"
              style={{ padding: "0.175rem 0.75rem" }}
            >
              <option value="10">10</option>
              <option>15</option>
              <option>20</option>
            </select>
            entries
          </div>
          <div className="w-25">
            <input className="form-control" placeholder="Search" />
          </div>
        </div>
      )} */}

      <table className="table table-hover">
        <thead className="table-primary">
          <tr>
            {columns.map((column, index) => (
              <th key={index} scope="col">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {columns.map((column, colIndex) => (
                <td key={colIndex}>{row[column.field]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div className="d-flex justify-content-between pagination align-items-end">
          <span>Showing 1 to 10 of {rows.length} entries</span>
          <Pagination
            color="primary"
            count={10}
            variant="outlined"
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
};
