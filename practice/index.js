const http = require('http');
const movies = require('./movie'); 

const server = http.createServer((req, res) => {

    if (req.url === '/api/movie' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(movies));
    }
    else if (req.url.startsWith('/api/movie/') && req.method === 'GET') {
        const movieId = req.url.split('/')[3];
        const movie = movies.find(m => m.id === parseInt(movieId));

        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(movie));
        } else {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('Movie Not Found');
        }
    }

    else if (req.url === '/api/add-movie' && req.method === 'POST') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const newMovie = JSON.parse(body);

            const newId = movies.length > 0 ? movies[movies.length - 1].id + 1 : 1;
            newMovie.id = newId;

            movies.push(newMovie);

            res.writeHead(201, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(newMovie));
        });
    }

    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}); 

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});