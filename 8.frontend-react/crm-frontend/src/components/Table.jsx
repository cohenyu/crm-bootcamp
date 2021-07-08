import React from 'react';
import {useTable} from 'react-table'
import '../styles/table.css'

function Table(props) {

    const {columns, data} = props;
    
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
      } = useTable({columns, data});
      

    return (
        <div className='table-container'>
            <table className='table sticky' id='table' {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr className='table-header' {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <th {...column.getHeaderProps()}>{column.render("Header")}</th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr className='card' {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
        </div>
    );
}

export default Table;