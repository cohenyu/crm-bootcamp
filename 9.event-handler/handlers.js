const basicUrl = 'http://localhost:7000';
var events = [];

var accountId;
var userId;
var userName;

var tempAccountId;
var tempUserId;
var tempUserName;

var loginTime = new Date();


const sendEvents = () => {
    if(events.length){
        console.log("sends events");
        axios.post(`${basicUrl}/saveEvents`, {events: events}).catch(()=>{console.log('error')});
        events = [];
    }
}

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

    if(e.target.innerText == 'Logout') {
        if(tempAccountId && tempUserId){
            logoutEvent(e);
        }

    } else if((e.view.location.pathname == '/signup' || e.view.location.pathname == '/login') && e.target.classList[0] == 'submit-button'){
        loginTime = new Date();
    }
});


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
        console.log(event);
    }
});



window.addEventListener('beforeunload', function(e){
    window.clearInterval(interval);
    if(accountId && userId){
        logoutEvent(e);
    }
    sendEvents();
});


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


var interval = window.setInterval(sendEvents, 5000);

