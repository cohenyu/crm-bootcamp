
import React from 'react';
import './searchResult.scss'

const SearchResult = ({main, second}) => {

    let itemsList = second.join(" | ");
  return (
      <div className='result-container'>
          <div className='main-result'>
            {main}
          </div>
          <div className="sub-result"> 
            {itemsList}
          </div>
      </div>
  );
}

export default SearchResult