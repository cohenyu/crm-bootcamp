const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 9034;
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

    socket.on('create crm room', function (room) {
        socket.join(room);
    });

    socket.on('create client room', function (room) {
        socket.join(room);
    });

    socket.on('join crm to client', function(data){
        io.sockets.to('crm').emit('new room', data);
    })

    socket.on('join', function (room) {
        socket.join(room);
        openRooms.push({room: room, roommates: io.sockets.adapter.rooms.get(room)});
    });


    socket.on('client message', msg => {
        io.sockets.in(msg.room).emit('client message', msg);
    });

    socket.on('crm message', msg => {
        io.sockets.in(msg.room).emit('crm message', msg);
    });

    socket.on('crm typing', (data) => {
        io.sockets.in(data.room).emit('crm typing', data);
    });

    socket.on('client typing', (data) => {
        io.sockets.in(data.room).emit('client typing', data);
    });
});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:9034/`);
});