let express = require('express');
let app = express();

    /*======================================*/
    /*|         Models             |*/
    /*======================================*/
let Hospital = require('../models/hospital');
let Doctor = require('../models/doctor');
let User = require('../models/user');
//   Routes
app.get('/all/:search', (req, res, next) => {
    let search = req.params.search;
    let regex = new RegExp(search, 'i');

    Promise.all([
        searchHospitals(search, regex),
        searchDoctors(search, regex),
        searchUsers(search, regex)
    ])
        .then(( results ) => {
            if( results[0].length === 0 && results[1].length === 0 && results[2].length === 0 ){
                return res.status(400).json({
                    ok: true,
                    message: `Results not found with param '${search}'`
                })
            }
            res.status(200).json({
                ok: true,
                message: "Results found successfully",
                hospitals: results[0],
                doctors: results[1],
                users: results[2]
            });
        })
        .catch( err =>{
            return res.status(500).json({
                ok: false,
                message: 'An error has been occurred while searching on database',
                error: err
            });
        });
});

function searchHospitals( search, regex ) {
    return new Promise( ( resolve, reject ) =>{
        Hospital.find({ name: regex })
            .populate('user', 'name email')
            .exec( (err, hospitals) => {
                if( err ){
                    reject( err );
                } else {
                    resolve( hospitals );
                }
            });
    });
}

function searchDoctors( search, regex ) {
    return new Promise( ( resolve, reject ) =>{
        Doctor.find({ name: regex })
            .populate('user', 'name email')
            .populate('hospital')
            .exec( (err, doctors) => {
            if( err ){
                reject( err );
            } else {
                resolve( doctors );
            }});
    });
}

function searchUsers( search, regex ) {
    return new Promise( ( resolve, reject ) =>{
        User.find({}, 'name email role')
            .or([ {'name': regex}, {'email': regex}])
            .exec( (err, users) =>{
                if( err ){
                    reject( err );
                } else {
                    resolve( users );
                }
            });
    });
}

module.exports = app;