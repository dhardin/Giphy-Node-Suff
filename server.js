var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};

var server = http.createServer(function(req, res) {

    var filePath = false;
    if (req.url == '/') {
        filePath = 'public/index.html';
    } else {
        filePath = 'public' + req.url;
    }
    var absPath = './' + filePath;
    if(filePath.indexOf('?q') == -1){
         serveStatic(res, cache, absPath);
         return;
    }
    

    switch (req.method) {
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            req.on('data', function(chunk) {
                item += chunk;
            });
            req.on('end', function() {
                items.push(item);
                res.end('OK\n');
            });
            break;
        case 'GET':
            var query = url.parse(req.url).query,
                api_key = 'dc6zaTOxFJmzC',
                api_url = 'http://api.giphy.com',
                search_path = '/v1/gifs/search';
            console.log(query);

            http.get(api_url + search_path + '?' + query + '&api_key=' + api_key, function(response) {
                var body = '';
                response.setEncoding('utf8');
                response.on('data', function(chunk) {
                    body += chunk;
                });
                response.on('end', function() {
                    res.write(body);
                    res.end();
                });
            }).on('error', function(e) {
                res.write("Got error: ", e);
                res.end();
            });
            break;
    }
});

function send404(response) {
    response.writeHead(404, {
        'Content-Type': 'text/plain'
    });
    response.write('Error 404: resource not found.');
    response.end();
}

function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200, {
            "content-type": mime.lookup(path.basename(filePath))
        }
    );
    response.end(fileContents);
}

function serveStatic(response, cache, absPath) {
    if (cache[absPath]) {
        sendFile(response, absPath, cache[absPath]);
    } else {
        fs.exists(absPath, function(exists) {
            if (exists) {
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        send404(response);
                    } else {
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                send404(response);
            }
        });
    }
}

server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});
