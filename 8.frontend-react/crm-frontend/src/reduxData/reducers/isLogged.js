import { loggedActions } from "../constants";

/**
 * Change login to logout and vise versa
 */
const loggedReducer = (state = false, action) => {
    switch(action.type){
        case loggedActions.signIn:
            return !state;
        default:
            return state;

    }
}

export default loggedReducer;