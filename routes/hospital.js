/*=//////////////////////////////////////////////////////////*/
/*                    ROUTES HOSPITAL                       |*/
/*  Description: Contains all services for the hospitals    |*/
/*=//////////////////////////////////////////////////////////*/
    /*======================================*/
    /*|            Requires                |*/
    /*======================================*/
let express = require('express');
let app = express();
let middlewareAuth = require('../middlewares/authentication');
    /*======================================*/
    /*|         Models                      |*/
    /*======================================*/
const Hospital = require('../models/hospital');
/*=//////////////////////////////////////////////////////////*/
/*                         SERVICES                         |*/
/*  Description: contains all services:                     |*/
/*  GET, POST, UPDATE, PUT, DELETE,                         |*/
/*=//////////////////////////////////////////////////////////*/

    /*======================================*/
    /*|             Get all HOSPITALS      |*/
    /*======================================*/
app.get( '/', (req, res) =>{
   Hospital.find({}, 'name img, user')
       .exec( (err, hospitals) =>{
           if ( err ) {
               return res.status(500).json({
                   ok: false,
                   message: 'Error on DB',
                   error: err
               });
           }
           res.json({
               ok: true,
               hospitals
           });
       });
});

    /*======================================*/
    /*|       Create a new HOSPITAL        |*/
    /*======================================*/
app.post( '/', middlewareAuth.verifyToken, (req, res) =>{
   let body = req.body;
   let hospital = new Hospital({
       name: body.name,
       img: body.img,
       user: body.user
   });
   hospital.save( (err, hospitalDB) => {
       if ( err ){
           return res.status(500).json({
               ok: false,
               message: 'An error has been occurred!',
               error: err
           });
       }
       res.json({
           ok: true,
           message: 'New hospital has been created successfully!',
           hospital: hospitalDB,
           created_by: req.user_consult
       });
   });
});
    /*======================================*/
    /*|     Update a USER (by ID)          |*/
    /*======================================*/
app.put( '/:id', middlewareAuth.verifyToken, (req, res) =>{
   let body = req.body;
   let id = req.params.id;
   Hospital.findById(id, (err, hospitalDB) =>{
       if ( err  ){
           return res.status(500).json({
               ok: false,
               message: 'An error has been occurred!',
               error: err
           });
       }
       if( !hospitalDB ){
           return res.status(400).json({
               ok: false,
               message: 'Hospital not found!!!',
               error: err
           });
       }
       hospitalDB.name = body.name;
       hospitalDB.img = body.img;
       hospitalDB.user = body.user;

       hospitalDB.save( (err, hospitalSaved ) => {
           if( err  ){
               return res.status(400).json({
                   ok: false,
                   message: 'Could not update hospital!',
                   error: err
               });
           }
           res.status(200).json({
               ok: true,
               message: 'Hospital updated',
               hospital: hospitalSaved,
               updated_by: req.user_consult
           });
       });
   });
});

    /*======================================*/
    /*|     Delete a HOSPITAL (by ID)      |*/
    /*======================================*/
app.delete( '/:id', middlewareAuth.verifyToken, (req, res) =>{
    let id = req.params.id;
    Hospital.findByIdAndRemove(id, (err, hospitalDel) =>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !hospitalDel ){
            return res.status(400).json({
                ok: false,
                message: 'Hospital not found!!!',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Hospital deleted',
            hospital: hospitalDel,
            deleted_by: req.user_consult
        });
    });

});

module.exports = app;