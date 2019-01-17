/*=//////////////////////////////////////////////////////////*/
/*                         UPLOAD FILES                     |*/
/*  Description:  service to upload the user's image        |*/
/*=//////////////////////////////////////////////////////////*/
    /*======================================*/
    /*|             Requires               |*/
    /*======================================*/
let express = require('express');
let app = express();
const fileUpload = require('express-fileupload');
const fs = require('fs');

    /*======================================*/
    /*|         Add the middleware         |*/
    /*======================================*/
app.use(fileUpload());

    /*======================================*/
    /*|         Add the models             |*/
    /*======================================*/
let User = require('../models/user');
let Doctor = require('../models/doctor');
let Hospital = require('../models/hospital');
    /*======================================*/
    /*|    Services to upload images       |*/
    /*======================================*/
app.put('/:typeUser/:id', (req, res, next) => {
    let typeUser = req.params.typeUser;
    let id = req.params.id;
    let validTypes = ['users', 'doctors', 'hospitals'];
    //  Validating that file exists
    if( !req.files ){
        return res.status(400).json({
            ok: false,
            message: 'File not selected'
        });
    }
    //  Validating that the type be correct
    if( validTypes.indexOf( typeUser ) < 0 ) {
        return res.status(400).json({
            ok: false,
            message: `The type '${typeUser}' is not valid!!!`,
            error: {
                message: 'The valid types are ' + validTypes.join(', ')
            }
        });
    }
    //  Getting file name
    let file = req.files.img;
    //  Decomposing the file name
    let fileName = file.name.split('.');
    //  Getting the extension of file
    let ext = fileName[ fileName.length - 1 ];
    let validExtension = [ 'jpeg', 'jpg', 'gif', 'png' ];
    //  Verifying file extension
    if( validExtension.indexOf( ext ) < 0 ){
        return res.status(400).json({
            ok: false,
            message: 'Extension is not valid!',
            error: {
                message: 'The valid extension are ' + validExtension.join(', ')
            }
        });
    }
    // Generating a specific name to image
    let specName = `${id}-${ new Date().getMilliseconds()}.${ext}`;
    // Moving the file to specific directory
    let path = `./uploads/${typeUser}/${specName}`;
    file.mv(path, (err) =>{
        if( err ){
            return res.status(400).json({
                ok: false,
                message: 'Error to move a file',
                error: err
            });
        }
        // Sending the ok response
        uploadByType( typeUser, id, specName, res);
    });
});

function uploadByType( typeUser, id, fileName, response ){
    if( typeUser === 'users' ){
        User.findById(id, (err, userDB) =>{
            if( err ){
                return response.status(500).json({
                    ok: false,
                    message: 'Error to try to search in database',
                    error: err
                });
            }
            if( !userDB ){
                return response.status(400).json({
                    ok: false,
                    message: 'The user doesn\'t exists!',
                    error: {
                        message: `The user with id ${id} hasn't been found!`
                    }
                });
            }
            let oldPath = './uploads/users/' + userDB.img;
            console.log(oldPath);
            if( fs.existsSync( oldPath ) ){
                console.log("The image exists!");
                fs.unlink( oldPath, err =>{
                    if( err ){
                        return response.status(500).json({
                            ok: false,
                            message: 'Error to try to deleted user\'s image',
                            error: err
                        });
                    }
                    console.log("Image deleted!");
                });
            }
            userDB.img = fileName;
            userDB.save( (err, userSaved) =>{
                if( err ){
                    return response.status(500).json({
                        ok: false,
                        message: 'Error to try to save user in database',
                        error: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    message: 'User\'s image updated successfully!',
                    user: userSaved
                });
            });
        });
    }
    if( typeUser === 'doctors' ){
        Doctor.findById(id, (err, doctorDB) =>{
            if( err ){
                return response.status(500).json({
                    ok: false,
                    message: 'Error to try to search in database',
                    error: err
                });
            }
            if( !doctorDB ){
                return response.status(400).json({
                    ok: false,
                    message: 'The doctor doesn\'t exists!',
                    error: {
                        message: `The doctor with id ${id} hasn't been found!`
                    }
                });
            }
            let oldPath = './uploads/doctors/' + doctorDB.img;
            console.log(oldPath);
            if( fs.existsSync( oldPath ) ){
                console.log("The image exists!");
                fs.unlink( oldPath, err =>{
                    if( err ){
                        return response.status(500).json({
                            ok: false,
                            message: 'Error to try to deleted doctor\'s image',
                            error: err
                        });
                    }
                    console.log("Image deleted!");
                });
            }
            doctorDB.img = fileName;
            doctorDB.save( (err, doctorSaved) =>{
                if( err ){
                    return response.status(500).json({
                        ok: false,
                        message: 'Error to try to save doctor in database',
                        error: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    message: 'Doctor\'s image updated successfully!',
                    doctor: doctorSaved
                });
            });
        });
    }
    if( typeUser === 'hospitals' ){
        Hospital.findById(id, (err, hospitalDB) =>{
            if( err ){
                return response.status(500).json({
                    ok: false,
                    message: 'Error to try to search in database',
                    error: err
                });
            }
            if( !hospitalDB ){
                return response.status(400).json({
                    ok: false,
                    message: 'The hospital doesn\'t exists!',
                    error: {
                        message: `The hospital with id ${id} hasn't been found!`
                    }
                });
            }
            let oldPath = './uploads/hospitals/' + hospitalDB.img;
            console.log(oldPath);
            if( fs.existsSync( oldPath ) ){
                console.log("The image exists!");
                fs.unlink( oldPath, err =>{
                    if( err ){
                        return response.status(500).json({
                            ok: false,
                            message: 'Error to try to deleted hospital\'s image',
                            error: err
                        });
                    }
                    console.log("Image deleted!");
                });
            }
            hospitalDB.img = fileName;
            hospitalDB.save( (err, hospitalSaved) =>{
                if( err ){
                    return response.status(500).json({
                        ok: false,
                        message: 'Error to try to save hospital in database',
                        error: err
                    });
                }
                return response.status(200).json({
                    ok: true,
                    message: 'Hospital\'s image updated successfully!',
                    hospital: hospitalSaved
                });
            });
        });
    }
}

module.exports = app;