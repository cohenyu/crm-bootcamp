import { workingActions , loggedActions} from "../constants"

/**
 * Start the working time
 */
export const start = () => {
    return {
        type: workingActions.start
    }
}

/**
 * Stop the working time
 */
export const stop = () => {
    return {
        type: workingActions.stop
    }
}

/**
 * Change login to logout and vise versa
 */
export const changedIsLogged = () => {
    return {
        type: loggedActions.signIn
    }
}