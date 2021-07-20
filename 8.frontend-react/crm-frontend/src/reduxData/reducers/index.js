import workingReducer from "./working";
import loggedReducer from "./isLogged";
import { combineReducers } from "redux";

const allReducers = combineReducers({
    working : workingReducer, 
    isLogged: loggedReducer
})

export default allReducers;