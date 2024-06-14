const io = require('socket.io')(8800, {
    cors: {
        origin: 'http://localhost:5173'
    }
});

let activeUsers = [];

io.on('connection', socket => {

    socket.on('addUser', (userId) => {
        if (!activeUsers.some(user => user.userId === userId)) {
            activeUsers.push({ userId, socketId: socket.id });
        }
        console.log('User connected', activeUsers);
        io.emit('getUsers', activeUsers);
    });

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        console.log('User disconnected', activeUsers);
        io.emit('getUsers', activeUsers);
    });

    socket.on('sendMessage', (data) => {
        const { receiverId } = data;
        const user = activeUsers.find(user => user.userId === receiverId);
        console.log('Sending message from socket to ', receiverId);
        console.log('Data :', data);
        if (user) {
            io.to(user.socketId).emit('receiveMessage', data);
        }
    });

});
