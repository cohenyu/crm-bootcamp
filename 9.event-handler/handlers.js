const basicUrl = 'http://localhost:7000';
var events = [];
var accountId;
var userId;
var userName;


const sendEvents = () => {
    if(events.length){
        console.log("sends events");
        axios.post(`${basicUrl}/saveEvents`, {events: events}).catch(()=>{console.log('error')});
        events = [];
    }
}

const getUserDetails = async() => {
    console.log("the token is:", window.localStorage.getItem('jwtToken'));
    let response = await axios.get(`http://rgb.com:8005/getUser`, 
    {
        headers: {
            'authorization': localStorage.getItem('jwtToken')
        }
    }).catch(()=>{
        console.log('error')
    });

    if(response){
        accountId = response.data.accountId;
        userId = response.data.userId;
        userName = response.data.userName;
    } else {
        console.log("error :(");
    }
}
getUserDetails();



window.addEventListener("click", function(e){
    console.log("click event", e);
    console.log('account: ', accountId);
    console.log("click event");

    if(accountId && userId){
        console.log('add event click');
        const event = {
            type: e.type,
            accountId: accountId,
            userId: userId,
            class: e.target.className,
            url: e.target.baseURI,
            content: e.target.innerText,
            timestamp: new Date(),
            userName: userName
            };
        events.push(event);
    }

    if(e.target.innerText == 'Logout') {
        console.log("logout!!");
        accountId = null;
        userId = null;
        userName = null;
    } else if((e.view.location.pathname == '/signup' || e.view.location.pathname == '/login') && e.target.classList[0] == 'submit-button'){
        console.log("login!!");
        const tokenInterval = window.setInterval(() => {
            console.log("trying to look for token");
            if(window.localStorage.getItem("jwtToken")){
                console.log("token found");
                window.clearInterval(tokenInterval);
                getUserDetails();
            }
        }, 2000);
        console.log("now we have the account", accountId);
    }
});


window.addEventListener('change', function(e){
    console.log("change event: ",e);
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
    // e.preventDefault();
    // e.returnValue = '';
    if(accountId && userId){
        const event = {
            type: e.type,
            accountId: accountId,
            userId: userId,
            url: e.target.baseURI,
            timestamp: new Date(),
            timeSpentOnPage: (e.timeStamp)/1000/60,
            userName: userName
        };
        events.push(event);
    }
    sendEvents();
});

window.addEventListener('fetch', e => {
    if(e.request.method != 'GET' && e.request.method != 'POST') return;
    console.log("fetch event", e);
})

window.addEventListener('load', function(e){
   console.log('loaded');
})


window.addEventListener('blur', function(e){
    console.log("blur event!");
    // events.push(e);
});

window.addEventListener('popstate', function(e){
    console.log("popstate event");
    // events.push(e);
});

window.addEventListener('hashchange', function(e){
    console.log("hashchange event");
    // events.push(e);
});


var interval = window.setInterval(sendEvents, 5000);

