const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoHelper = require('./helpers/mongoHelper');
const port = 9034;
// const http = require('http');
const bodyParser = require('body-parser')
// const server = http.createServer(app);
// const { Server } = require('socket.io');
const chat = require('./db/controllers/chat/chat.ts');
// const io = new Server(server);
const services = require('./db/services/services.ts');
const { Socket } = require('dgram');
services.InitMongoDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/chat', chat)

mongoHelper = new MongoHelper();
var openRooms = [];

// app.get('/plugin',(req, res) => {
//     res.sendFile(__dirname + '/mychat.js');
//   })

app.get('/client', (req, res) => {
  res.sendFile(__dirname + '/client.html');
});

app.get('/crm', (req, res) => {
    res.sendFile(__dirname + '/crm.html');
});


io.on('connection', (socket) => {

    socket.on('create crm room', async function (room) {
        const accountID = 1;
        const result = await mongoHelper.getRequest(`/getAllRooms/${accountID}`);
        socket.join(room);
        io.sockets.to(room).emit('rooms list', result);
    });

    socket.on('create client room', function (room) {
        socket.join(room);
    });

    socket.on('join crm to client', async function(data){
        const result = await mongoHelper.getRequest(`/${data.mail}`);
        if(result){
            console.log("client already exist");
            await mongoHelper.putRequest(`/setRoom/${result.mail}`, {roomID: data.room});
            console.log("room changed to: ", data.room);
        } else {
            console.log("client not exist");
            await mongoHelper.postRequest(``, {roomID: data.room, name: data.name, mail: data.mail, accountID: 1});
        }
        console.log("joining crm to room:", data.room);
        io.sockets.to('crm').emit('new room', data);
    })

    socket.on('join', function (room) {
        console.log("crm joined to ", room);
        socket.join(room);
        openRooms.push({room: room, roommates: io.sockets.adapter.rooms.get(room)});
    });


    socket.on('client message', msg => {
        if(msg.save){
            mongoHelper.putRequest(`/addMsg/${msg.room}`, {msg: msg.msgValue, client: true, datetime: msg.datetime});
        }
        io.sockets.in(msg.room).emit('client message', msg);
    });

    socket.on('crm message', msg => {
        console.log("the room is: ", msg);
        mongoHelper.putRequest(`/addMsg/${msg.room}`, {msg: msg.msgValue, client: false, datetime: msg.datetime});
        io.sockets.in(msg.room).emit('crm message', msg);
    });

    socket.on('crm typing', (data) => {
        io.sockets.in(data.room).emit('crm typing', data);
    });

    socket.on('client typing', (data) => {
        io.sockets.in(data.room).emit('client typing', data);
    });

    socket.on('room clicked', async (room) => {
        const data = await mongoHelper.getRequest(`/getMsgs/${room}`);
        if(data){
            console.log("msgs: ", data.msgs);
            io.sockets.in('crm').emit('room msgs', {msgs: data.msgs, room: room});
            await mongoHelper.putRequest(`/set/${room}`, {read: true});
        }
    })

    socket.on("unread msg", async (room) => {
        await mongoHelper.putRequest(`/set/${room}`, {read: false});
    })
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:9034/`);
});