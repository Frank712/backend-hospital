//  Requires
let express = require('express');
let mongoose = require( 'mongoose' );

//  Initialize variables
let app = express();

//  Connection to database
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err, resp) => {
    if( err ){
        throw err;
    }
    console.log('Hospital Mongo DB ONLINE!!!');
});

//  Listen request
const port = 3000;
app.listen(port, () =>{
    console.log(`Server ONLINE, listen in port ${port}`);
});

//   Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Hello from to EXPRESS'
    });
});

app.post('/user', (res, req) => {
    body = req.body;
});
