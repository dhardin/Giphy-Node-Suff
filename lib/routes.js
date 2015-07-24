/*
 * routes.js - module to provide routing
 */
/*jslint node : true, continue : true,
devel : true, indent : 2, maxerr : 50,
newcap : true, nomen : true, plusplus : true,
regexp : true, sloppy : true, vars : false,
white : true
*/
/*global */
// ------------ BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
    configRoutes,
    crud = require('./crud'),
    user = require('./user'),
    http = require('http'),
    makeMongoId = crud.makeMongoId;
// ------------- END MODULE SCOPE VARIABLES ---------------
// ---------------- BEGIN PUBLIC METHODS ------------------
configRoutes = function(app, server) {

    app.get('/', function(request, response) {
        response.redirect('/index.html');
    });
    app.all('/:obj_type/*?', function(request, response, next) {
        response.contentType('json');
        next();
    });
    app.get('/search/:query', function(request, response) {
        var query = request.params.query,
            api_key = 'dc6zaTOxFJmzC',
            api_url = 'http://api.giphy.com',
            search_path = '/v1/gifs/search';
        console.log(query);

        http.get(api_url + search_path + '?q=' + query + '&api_key=' + api_key, function(res) {
            var body = '';
            res.setEncoding('utf8');
            res.on('data', function(chunk) {
                body += chunk;
            });
            res.on('end', function() {
                response.write(body);
                response.end();
            });
        }).on('error', function(e) {
            response.write("Got error: ", e);
            response.end();
        });
    });

    app.post('/login', function(request, response) {
        crud.read(
            'user',
            request.body,
            function(result_map) {
                response.send(result_map);
            }
        );
    });

    app.post('/fetch', function(request, response) {
        console.log('fetching..');
        crud.read(
            'user',
            request.body,
            function(result_map) {
                console.log(JSON.stringify(result_map));
                response.send(result_map);
            }
        );
    });

    app.post('/create', function(request, response) {
        crud.construct(
            'user',
            request.body,
            function(result_map) {

                response.send(result_map);
            }
        );
    });


    user.connect(server);
};

module.exports = {
    configRoutes: configRoutes
};
// ----------------- END PUBLIC METHODS -------------------
