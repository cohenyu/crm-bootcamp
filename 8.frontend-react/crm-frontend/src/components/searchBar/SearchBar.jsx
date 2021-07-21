
// import React from 'react';
// import './searchBar.scss'
// import SearchResult from '../searchResult/searchResult';
// const SearchBar = ({input,onChange, countryList=[]}) => {

//   return (
//       <div>
//         <input 
//         key="random1"
//         value={input}
//         placeholder={"Search Client"}
//         onChange={(e) => onChange(e.target.value)}
//         />
//         <div className='results'>
//         { countryList.map((data,index) => {
//         if (data) {
//           return (
//             <div key={data.client_name}>
//                 <SearchResult main={data.client_name} second={[data.client_mail, data.client_phone]}/>
// 	        </div>	
//     	   )	
//     	 }
//     	 return null
//         }) }
//         </div>
//       </div>
//   );
// }

// export default SearchBar