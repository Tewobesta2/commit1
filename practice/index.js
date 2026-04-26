const http = require('http');
const movie = require('./movie');

const server = http.createServer((req, res) => {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Movie Review API Server Running");
});

server.listen(5000, () => {
    console.log("Server running on port 5000");
});