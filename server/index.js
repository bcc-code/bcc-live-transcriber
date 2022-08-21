const { Server } = require('@hocuspocus/server');

const server = Server.configure({
    async connected(args) {
        console.log('Connected');
    }
})

server.listen(process.env.PORT || 3000);