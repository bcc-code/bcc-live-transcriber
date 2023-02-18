const { Server } = require('@hocuspocus/server');
const fs = require('fs-extra');
const path = require('path');
const url = require('url');

const server = Server.configure({
    port: process.env.PORT || 3000,

    async connected(args) {
        console.log('Connected');
    },

    async onRequest({ request, response }) {
        const parsedUrl = url.parse(request.url);

        let pathname = `public${parsedUrl.pathname}`;
        console.log(pathname);  
        if (pathname === 'public/') pathname = 'public/index.html'; // default to index.html (e.g. when requesting /
        // based on the URL path, extract the file extension. e.g. .js, .css, ...
        const ext = path.parse(pathname).ext;
        // maps file extension to MIME type
        const map = {
            '.ico': 'image/x-icon',
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.png': 'image/png',
        };

        if (! await fs.pathExists(pathname)) {
            // if the file is not found, return 404
            response.statusCode = 404;
            response.end(`File ${parsedUrl.pathname} not found!`);
            throw null;
        }

        // read file from file system
        const data = await fs.readFile(pathname)

        if(! data){
            response.statusCode = 500;
            response.end(`Error getting the file: ${err}.`);
        } else {
            // if the file is found, set Content-type and send data
            response.setHeader('Content-type', map[ext] || 'text/plain' );
            response.end(data);
        }

        throw null;
    },
})

server.listen();
