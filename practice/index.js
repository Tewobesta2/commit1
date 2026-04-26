const http = require('http');
const movies = require('./movie');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {

    if (req.url === '/api/update-movie' && req.method === 'PUT') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            const updatedMovie = JSON.parse(body);
            const result = await updateMovie(updatedMovie);

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result));
        });
    }

    else if (req.url.startsWith('/api/delete-movie/') && req.method === 'DELETE') {
        (async () => {
            const movieId = req.url.split('/')[3];
            const result = await deleteMovie(parseInt(movieId));

            if (result) {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } else {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Movie Not Found');
            }
        })();
    }
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const updateMovie = async (movie) => {
    const movieDataPath = path.join(__dirname, 'movie.js');

    let data = await fs.promises.readFile(movieDataPath, 'utf-8');

    data = data.replace('const movies = ', '');
    data = data.replace('; module.exports = movies;', '');
    data = data.replace('module.exports = movies;', '');

    let moviesArray = eval(data);

    const index = moviesArray.findIndex(m => m.id === movie.id);

    if (index !== -1) {
        moviesArray[index] = movie;
    }

    const fileData = `const movies = ${JSON.stringify(moviesArray, null, 4)};\n\nmodule.exports = movies;`;

    await fs.promises.writeFile(movieDataPath, fileData);

    return movie;
}

const deleteMovie = async (id) => {
    const movieDataPath = path.join(__dirname, 'movie.js');

    let data = await fs.promises.readFile(movieDataPath, 'utf-8');

    data = data.replace('const movies = ', '');
    data = data.replace('; module.exports = movies;', '');
    data = data.replace('module.exports = movies;', '');

    let moviesArray = eval(data);

    const index = moviesArray.findIndex(m => m.id === id);

    if (index !== -1) {
        const deletedMovie = moviesArray.splice(index, 1)[0];

        const fileData = `const movies = ${JSON.stringify(moviesArray, null, 4)};\n\nmodule.exports = movies;`;

        await fs.promises.writeFile(movieDataPath, fileData);

        return deletedMovie;
    }

    return null;
}

const PORT = 5000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});