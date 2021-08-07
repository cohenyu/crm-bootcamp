const basicUrl = 'http://localhost:7000';
var events = [];

var accountId;
var userId;
var userName;

var tempAccountId;
var tempUserId;
var tempUserName;

var loginTime = new Date();


/**
 * Send request to save the events array
 */
const sendEvents = () => {
    if(events.length){
        axios.post(`${basicUrl}/saveEvents`, {events: events}).catch(()=>{console.log('error')});
        events = [];
    }
}

/**
 * Saves user details
 * @param {account id} account 
 * @param {user id} user 
 * @param {user name} name 
 */
window.setUserDetails = (account=0, user=0, name=0) => {
    accountId = account;
    userId = user;
    userName = name;
    if(accountId && userId){
        tempUserId = userId;
        tempAccountId = accountId;
        tempUserName = name;
    }
}

/**
 * Adds logout event to events array, and saves all the events that already in the array.
 * @param {*} e 
 */
const logoutEvent = (e) => {
    const event = {
        type: 'pageClosed',
        accountId: tempAccountId,
        userId: tempUserId,
        url: e.target.baseURI,
        timestamp: new Date(),
        timeSpentOnPage: parseInt(new Date() - loginTime)/1000/60,
        userName: tempUserName
    };
    tempAccountId = tempUserId = tempUserName = 0;
    events.push(event);
    sendEvents();
}

/**
 * Listens to click event and add it to the array
 */
window.addEventListener("click", function(e){
    if(tempUserId && tempAccountId && e.target.className != "crm-page"){
        const event = {
            type: e.type,
            accountId: tempAccountId,
            userId: tempUserId,
            class: e.target.className,
            url: e.target.baseURI,
            content: e.target.innerText,
            timestamp: new Date(),
            userName: tempUserName
            };
        events.push(event);
    }

    // user clicked logout button
    if(e.target.innerText == 'Logout') {
        if(tempAccountId && tempUserId){
            logoutEvent(e);
        }

    // user clicked login / signup button
    } else if((e.view.location.pathname == '/signup' || e.view.location.pathname == '/login') && e.target.classList[0] == 'submit-button'){
        loginTime = new Date();
    }
});

/**
 * Listens to change event and add it to the array
 */
window.addEventListener('change', function(e){
    if(accountId && userId){
        const event = {
            type: e.type,
            accountId: accountId,
            userId: userId,
            class: e.target.className,
            inputType: e.target.type,
            url: e.target.baseURI,
            content: e.target.defaultValue,
            timestamp: new Date(),
            userName: userName
            };
        events.push(event);
    }
});


/**
 * Listens to beforeunload event and saves all the previous events
 */
window.addEventListener('beforeunload', function(e){
    window.clearInterval(interval);
    if(accountId && userId){
        logoutEvent(e);
    }
    sendEvents();
});


/**
 * Listens to copy event
 */
window.addEventListener('copy', function(e){
    if(accountId && userId){
        const event = {
            type: e.type,
            accountId: accountId,
            userId: userId,
            node: e.target.localName,
            parentClassName: e.path[1].className,
            inputType: e.target.type,
            url: e.target.baseURI,
            content: e.target.innerText,
            timestamp: new Date(),
            userName: userName
            };
        events.push(event);
    }
});

// saving the events list every 10 seconds
var interval = window.setInterval(sendEvents, 10000);

