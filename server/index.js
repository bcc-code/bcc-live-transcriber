const { Server } = require('@hocuspocus/server');

const server = Server.configure({
    onConnect: (args) => {
        const { readonly } = args.requestParameters;
        args.connection.readOnly = !! readonly;
    },
    async connected(args) {
        console.log('Connected');
        console.log(args.connection)
    },
    onChange(args) {
        console.log(args.update)
    }
})

server.listen(1234)