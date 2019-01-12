/*=//////////////////////////////////////////////////////////*/
/*                         ROUTES USER                      |*/
/*  Description: Contains all services for the user         |*/
/*=//////////////////////////////////////////////////////////*/
    /*======================================*/
    /*|            Requires                |*/
    /*======================================*/
let express = require('express');
let app = express();
let bcrypt = require( 'bcryptjs');
let middlewareAuth = require('../middlewares/authentication');
    /*======================================*/
    /*|            Models                  |*/
    /*======================================*/
const User = require('../models/user');
/*=//////////////////////////////////////////////////////////*/
/*                         SERVICES                         |*/
/*  Description: contains all services:                     |*/
/*  GET, POST, UPDATE, PUT, DELETE,                         |*/
/*=//////////////////////////////////////////////////////////*/

    /*======================================*/
    /*|             Get all USERS          |*/
    /*======================================*/
app.get('/', (req, res, next) => {
    User.find({}, 'name lastname email img role')
        .exec( (err, users) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error on DB',
                        error: err
                    });
                }
                res.json({
                    ok: true,
                    users
                });
            }
        )
    });
/*  For the rest services, is required the jwt validate*/

    /*======================================*/
    /*|         Create a new User           |*/
    /*======================================*/
app.post('/', middlewareAuth.verifyToken, (req, res) => {
    let body = req.body;
    let user = new User({
        name: body.name,
        lastname: body.lastname,
        email: body.email,
        password: bcrypt.hashSync( body.password, 10),
        role: body.role,
        google: body.google
    });

    user.save( (err, userDB) => {
        if ( err ){
            return res.status(400).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'New user has been created successfully!',
            user: userDB,
            created_by: req.user_consult
        })
    });
});
    /*======================================*/
    /*|     Update a USER (by ID)          |*/
    /*======================================*/
app.put( '/:id', middlewareAuth.verifyToken, (req, res) =>{
    let id = req.params.id;
    let body = req.body;
    User.findById(id, (err, userDB) => {
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !userDB ){
            return res.status(500).json({
                ok: false,
                message: 'User not found!!!',
                error: err
            });
        }

        userDB.name = body.name;
        userDB.lastname = body.lastname;
        userDB.email = body.email;
        userDB.role= body.role;
        console.log(userDB);

        userDB.save( (err, userSaved ) => {
           if( err  ){
               return res.status(400).json({
                   ok: false,
                   message: 'Could not update user!',
                   error: err
               });
           }
           userSaved.password = 'xD';
            res.status(200).json({
                ok: true,
                message: 'User updated',
                user: userSaved,
                updated_by: req.user_consult
            });
        });
    });
});

    /*======================================*/
    /*|         Delete a user (by ID)      |*/
    /*======================================*/
app.delete( '/:id', middlewareAuth.verifyToken, (req, res) =>{
    let id = req.params.id;
    User.findByIdAndRemove(id, (err, userDel) =>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !userDel ){
            return res.status(400).json({
                ok: false,
                message: 'User not found!!!',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            message: 'User deleted',
            user: userDel,
            deleted_by: req.user_consult
        });
    });

});

module.exports = app;