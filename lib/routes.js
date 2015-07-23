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
user = require ('./user'),
makeMongoId = crud.makeMongoId;
// ------------- END MODULE SCOPE VARIABLES ---------------
// ---------------- BEGIN PUBLIC METHODS ------------------
configRoutes = function ( app, server ) {
    app.get( '/', function ( request, response ) {
        response.redirect( '/fsm.html' );
    });
    app.all( '/:obj_type/*?', function ( request, response, next ) {
        response.contentType('json');
        next();
    });
    app.get( '/search/:query', function ( request, response ) {
         var query = request.params.query,
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
    });

    app.post('/login', function (request, response) {
        console.log(JSON.stringify(request, null, 2));
        crud.read(
            request.params.obj_type,
            request.body,
            function (result_map) {
                response.send(result_map);
            }
        );
    });
    app.get('/sign_in', function (request, response) {
        
    });

   user.connect(server);
};

module.exports = { configRoutes: configRoutes };
// ----------------- END PUBLIC METHODS -------------------