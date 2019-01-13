let express = require('express');
let app = express();

//   Routes
app.get('/:typeUser/:img', (req, res, next) => {
    let typeUser = req.params.typeUser;
    let nameImg = req.params.img;
    const path = require('path');
    const fs = require('fs');

    let pathImage = path.resolve( __dirname, `../uploads/${typeUser}/${nameImg}` );
    if( fs.existsSync( pathImage ) ){
        res.sendFile( pathImage );
    } else {
        let pathNoImage = path.resolve(  __dirname, '../assets/no-img.jpg');
        res.sendFile( pathNoImage );
    }
    /*let validTypes = [ 'users', 'doctors', 'hospitals' ];
    console.log(typeUser);
    console.log(nameImg);*/
});

module.exports = app;