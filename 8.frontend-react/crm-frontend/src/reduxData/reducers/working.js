import { workingActions } from "../constants";

/**
 * Tracks the amount of the current working projects
 */
const workingReducer = (state = 0, action) => {
    switch(action.type){
        case workingActions.start:
            return state + 1;
        case workingActions.stop:
            return state - 1;
        default:
            return state;

    }
}

export default workingReducer;