/*
* user.js - module to provide user login and saving operations
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
emitUserList, signIn, signOut, userObj,
socket = require('socket.io'),
crud = require('./crud'),
makeMongoId = crud.makeMongoId;
// ------------- END MODULE SCOPE VARIABLES ---------------
// ---------------- BEGIN UTILITY METHODS -----------------
// emitUserList - broadcast user list to all connected clients
//
emitUserList = function (io) {
    crud.read(
        'user',
        { is_online: true },
        function (result_list) {
            io
                .of('/user')
                .emit('listchange', result_list);
        }
    );
};

// signIn 
//
signIn = function (io, user_map, socket) {
     console.log('signing in...');
    socket.user_id = user_map._id;
}

// signOut 
//
signOut = function (io, user_id) {
};
// ---------------- END UTILITY METHODS -----------------
// ---------------- BEGIN PUBLIC METHODS ------------------
userObj = {
    connect: function (server) {
        var io = socket.listen(server);
        // Begin io setup
        io
        .set('blacklist', [])
        .of('/user')
        .on('connection', function (socket) {
            // Begin /adduser/ message handler
            // Summary : Provides user registration capability.
            // Arguments : A single user_map object.
            // user_map should have the following properties:
            // name = the name of the user
            // password = the password of the user
            // Action :
            // If a user with the provided username already exists
            // in Mongo, emit user exists.
            // If a user with the provided username does not exist
            // in Mongo, create one and use it.
            // Send a 'userupdate' message to the sender so that
            // a login cycle can complete. 
            //
            socket.on('adduser', function (user_map) {
                crud.read(
                    'user',
                    { name: user_map.name },
                    function (result_list) {
                        var result_map;
                        
                        delete user_map.cid;

                        // use existing user with provided name
                        if (result_list.length > 0) {
                            result_map = result_list[0];
                            signIn(io, result_map, socket);
                        }

                        // create user with new name
                        else {
                          //  user_map.is_online = true;
                            crud.construct(
                                'user',
                                user_map,
                                function (result_list) {
                                    result_map = result_list[0];
                                    socket.user_id = result_map._id;
                                    socket.emit('userupdate', result_map);
                                    emitUserList(io);
                                }
                            );
                        }
                    }
                );
            });
            // End /adduser/ message handler

            // Begin /login/ message handler
            socket.on('login', function (user_map) {
                crud.read(
                    'user',
                    {
                        name: user_map.name,
                        password: user_map.password
                    },
                     function (result_list) {
                         var
                          result_map;
                         
                        if (result_list != null && result_list.length > 0) {
                            result_map = result_list[0];
                            signIn(io, result_map, socket);
                        } else {
                            result_map = [];
                        }
                        socket.emit('userupdate', result_map);
                     }
                );
            });
            // End /login/ message handler

            // Begin /logout/ message handler
            socket.on('logout', function () {
                console.log(
                '** user %s logged out **', socket.user_id
                );
                signOut(io, socket.user_id);
            });
            // End /logout/ message handler

            // Begin /disconnect/ message handler
            socket.on('disconnect', function () {
                console.log(
                '** user %s closed browser window or tab **',
                socket.user_id
                ); signOut(io, socket.user_id);
            });
            // End /disconnect/ message handler

            // Begin /updateuser/ message handler
            socket.on('updateuser',  function (user_map) {
                crud.update(
                    'user',
                    user_map,
                     function (result_list) {
                         var
                          result_map;
                         if (result_list != null && result_list.length > 0) {
                             result_map = result_list[0];

                         } else {
                             result_map = [];
                         }

                     }
                );

            });
            // End /updateuser/ message handler
        });
        // End io setup
        return io;
    }
};

module.exports = userObj;
// ----------------- END PUBLIC METHODS -------------------