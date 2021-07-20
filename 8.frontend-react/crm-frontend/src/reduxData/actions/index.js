import { workingActions , loggedActions} from "../constants"

export const start = () => {
    return {
        type: workingActions.start
    }
}

export const stop = () => {
    return {
        type: workingActions.stop
    }
}

export const changedIsLogged = () => {
    return {
        type: loggedActions.signIn
    }
}