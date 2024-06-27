const io = require('socket.io')(8800, {
    cors: {
        origin: ["https://connectify-six.vercel.app", "https://connectify-omega.vercel.app", "https://connectify-socket-wixg.onrender.com"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

let activeUsers = [];

io.on('connection', socket => {

    socket.on('addUser', (userId) => {
        if (!activeUsers.some(user => user.userId === userId)) {
            activeUsers.push({ userId, socketId: socket.id });
        }
        io.emit('getUsers', activeUsers);
    });

    socket.on('disconnect', () => {
        activeUsers = activeUsers.filter(user => user.socketId !== socket.id);
        io.emit('getUsers', activeUsers);
    });

    socket.on('sendMessage', (data) => {
        const { receiverId } = data;
        const user = activeUsers.find(user => user.userId === receiverId);
        if (user) {
            io.to(user.socketId).emit('receiveMessage', data);
        }
    });

});
