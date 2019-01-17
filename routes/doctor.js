/*=//////////////////////////////////////////////////////////*/
/*                    ROUTES DOCTOR                         |*/
/*  Description: Contains all services for the doctors      |*/
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
const Doctor = require('../models/doctor');
/*=//////////////////////////////////////////////////////////*/
/*                         SERVICES                         |*/
/*  Description: contains all services:                     |*/
/*  GET, POST, UPDATE, PUT, DELETE,                         |*/
/*=//////////////////////////////////////////////////////////*/

/*======================================*/
/*|             Get all DOCTORS        |*/
/*======================================*/
app.get( '/', (req, res) =>{
    let _from = req.query._from || 0;
    _from = Number(_from);
    Doctor.find({}, 'name img user hospital')
        .skip(_from)
        .limit(5)
        .populate('user', 'name email')
        .populate('hospital', 'name')
        .exec( (err, doctors) =>{
            if ( err ) {
                return res.status(500).json({
                    ok: false,
                    message: 'Error on DB',
                    error: err
                });
            }
            Doctor.count({}, (err, count) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        message: 'Error on counter DB',
                        error: err
                    });
                }
                res.json({
                    ok: true,
                    message: "Doctors found successfully",
                    doctors,
                    counter: count
                });
            });

        });
});

    /*======================================*/
    /*|         Get a Doctor by ID!        |*/
    /*======================================*/
app.get( '/:id', (req, res) =>{
    let id = req.params.id;
    Doctor.findById(id)
        .populate('user', 'name lastname email img')
        .populate('hospital')
        .exec( (err, doctorDB) =>{
            if ( err  ){
                return res.status(500).json({
                    ok: false,
                    message: 'An error has been occurred!',
                    error: err
                });
            }
            if( !doctorDB ){
                return res.status(400).json({
                    ok: false,
                    message: 'Doctor not found!!!',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                message: 'Doctor found',
                doctor: doctorDB
            });
        });
});

    /*======================================*/
    /*|       Create a new DOCTOR           |*/
    /*======================================*/
app.post( '/', middlewareAuth.verifyToken, (req, res) =>{
    let body = req.body;
    let doctor = new Doctor({
        name: body.name,
        user: req.user_consult,
        hospital: body.hospital
    });
    doctor.save( (err, doctorDB) => {
        if ( err ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        res.json({
            ok: true,
            message: 'New doctor has been created successfully!',
            doctor: doctorDB,
            created_by: req.user_consult
        });
    });
});
/*======================================*/
/*|     Update a DOCTOR (by ID)         |*/
/*======================================*/
app.put( '/:id', middlewareAuth.verifyToken, (req, res) =>{
    let body = req.body;
    let id = req.params.id;
    Doctor.findById(id, (err, doctorDB) =>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !doctorDB ){
            return res.status(400).json({
                ok: false,
                message: 'Doctor not found!!!',
                error: err
            });
        }
        doctorDB.name = body.name;
        doctorDB.img = body.img;
        doctorDB.user = req.user_consult;
        doctorDB.hospital = body.hospital;

        doctorDB.save( (err, doctorSaved ) => {
            if( err  ){
                return res.status(400).json({
                    ok: false,
                    message: 'Could not update doctor!',
                    error: err
                });
            }
            res.status(200).json({
                ok: true,
                message: 'The doctor has been updated',
                doctor: doctorSaved,
                updated_by: req.user_consult
            });
        });
    });
});

/*======================================*/
/*|     Delete a DOCTOR (by ID)      |*/
/*======================================*/
app.delete( '/:id', middlewareAuth.verifyToken, (req, res) =>{
    let id = req.params.id;
    Doctor.findByIdAndRemove(id, (err, doctorDel) =>{
        if ( err  ){
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred!',
                error: err
            });
        }
        if( !doctorDel ){
            return res.status(400).json({
                ok: false,
                message: 'Doctor not found!!!',
                error: err
            });
        }
        res.status(200).json({
            ok: true,
            message: 'Doctor deleted',
            doctor: doctorDel,
            deleted_by: req.user_consult
        });
    });

});

module.exports = app;