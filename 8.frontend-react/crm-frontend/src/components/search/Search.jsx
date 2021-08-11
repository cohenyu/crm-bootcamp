import React, {useState} from 'react';
import './search.scss'
import SearchResult from '../searchResult/searchResult';


function Search(props) {
    const [input, setInput] = useState('');
    const [resultsList, setResultList] = useState([]);

    /**
     * Gets all result according to the input
     * @param {the search input} input 
     */
    const updateInput = async (input) => {
        let tempList = [];
        if(input !== ''){
            tempList = await props.fetchData(input);
        }
        setResultList(tempList);
        setInput(input);
    }

    /**
     * Sets the selected item
     * @param {selects item} data 
     */
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
                updateChoice(props.mapFunc(data));
                }}>
                {index !== 0 && <hr/>}
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