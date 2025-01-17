import React from 'react';
import {useTable} from 'react-table'
import './table.scss'

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
        <div className={'table-container'}>
            <table 
              className={props.tableClass ? props.tableClass : 'table sticky'} 
              id='table' 
              {...getTableProps()}>
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
            <tr 
              onMouseEnter={()=>{props.hoverHandler && props.hoverHandler(row)}}
              onMouseLeave={()=>{props.hoverHandler && props.hoverHandler()}}
              onClick={()=>{props.clickRow && props.clickRow(row)}} 
              className='card' {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
    {props.data.length === 0 && 
          <div className='empty-msg'>
              <h3>There is nothing to show</h3>
          </div>}
        </div>
    );
}

export default Table;