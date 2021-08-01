const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const MongoHelper = require('./helpers/mongoHelper');
const port = 9034;
const bodyParser = require('body-parser')
const chat = require('./db/controllers/chat/chat.ts');
const services = require('./db/services/services.ts');
const { Socket } = require('dgram');
services.InitMongoDB();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/chat', chat)

mongoHelper = new MongoHelper();
var openRooms = [];

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
        result.forEach(element => {
            io.sockets.to('crm').emit('new room', {room: element.roomID, name: element.name, mail: element.mail});
        });
    });

    socket.on('create client room', function (room) {
        socket.join(room);
    });

    socket.on('join crm to client', async function(data){
        const result = await mongoHelper.getRequest(`/${data.mail}`);
        if(result){
            await mongoHelper.putRequest(`/setRoom/${result.mail}`, {roomID: data.room});
        } else {
            await mongoHelper.postRequest(``, {roomID: data.room, name: data.name, mail: data.mail, accountID: 1});
        }
        io.sockets.to('crm').emit('new room', data);
    })

    socket.on('join', function (room) {
        socket.join(room);
        openRooms.push({room: room, roommates: io.sockets.adapter.rooms.get(room)});
    });


    socket.on('client message', msg => {
        if(msg.save){
            mongoHelper.putRequest(`/addMsg/${msg.mail}`, {msg: msg.msgValue, client: true, datetime: msg.datetime});
            mongoHelper.putRequest(`/set/${msg.mail}`, {read: false});
        }
        io.sockets.in(msg.room).emit('client message', msg);
    });

    socket.on('crm message', msg => {
        mongoHelper.putRequest(`/addMsg/${msg.mail}`, {msg: msg.msgValue, client: false, datetime: msg.datetime});
        io.sockets.in(msg.room).emit('crm message', msg);
    });

    socket.on('crm typing', (data) => {
        io.sockets.in(data.room).emit('crm typing', data);
    });

    socket.on('client typing', (data) => {
        io.sockets.in(data.room).emit('client typing', data);
    });

    socket.on('room clicked', async (clickData) => {
        if(!clickData.msgs){
            const data = await mongoHelper.getRequest(`/getMsgs/${clickData.mail}`);
            if(data){
                io.sockets.in('crm').emit('room msgs', {msgs: data.msgs, room: clickData.mail});
            }
        }
        await mongoHelper.putRequest(`/set/${clickData.mail}`, {read: true});
        
    })

    socket.on("read msg", async (mail) => {
        await mongoHelper.putRequest(`/set/${mail}`, {read: true});
    })

    socket.on("unread msg", async (mail) => {
        await mongoHelper.putRequest(`/set/${mail}`, {read: false});
    })

    socket.on("client exist", async (room) => {
        const response = await mongoHelper.getRequest(`/getClientByRoom/${room}`);
        io.sockets.in(room).emit('client data', response);
    })

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:9034/`);
});