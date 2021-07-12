import React, {useState, useEffect} from 'react';
import './search.scss'
import CrmApi from '../../helpers/CrmApi';
import SearchResult from '../searchResult/searchResult';

const crmApi = new CrmApi(); 

// search: {
//     id: 'search',
//     side: true,
//     text : 'Search Client',
//     fetchData: crmApi.getAllClients,
//     mapFunc: mapFunc
//   },

function Search(props) {
    const [input, setInput] = useState('');
    const [resultsList, setResultList] = useState([]);

    const updateInput = async (input) => {
        let tempList = [];
        if(input !== ''){
            tempList = await props.fetchData(input);
        }
        setResultList(tempList);
        setInput(input);
    }

    const updateChoice = (data) => {
        setResultList([]);
        setInput('');
        props.callback(data.details);
    }


    return (
        <div className='search-container' >
        <input className='form-input'
        key="search"
        value={input}
        placeholder={props.text}
        onChange={(e) => updateInput(e.target.value)}
        />
        <div className='results'>
        { 
        resultsList && resultsList.map((data,index) => {
        if (data) {
          return (
            <div className='result' key={index} onClick={()=>{
                const mappedData = props.mapFunc(data);
                updateChoice(props.mapFunc(data));
                }}>
                <SearchResult {...props.mapFunc(data)}/>
	        </div>	
    	   )	
    	 }
    	 return null
        }) }
        </div>
        </div>
    );
}

export default Search;