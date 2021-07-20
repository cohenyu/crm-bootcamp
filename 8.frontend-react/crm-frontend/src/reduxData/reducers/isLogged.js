import { loggedActions } from "../constants";

const loggedReducer = (state = false, action) => {
    switch(action.type){
        case loggedActions.signIn:
            return !state;
        default:
            return state;

    }
}

export default loggedReducer;