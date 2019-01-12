let express = require('express');
let app = express();

//   Routes
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        message: 'Hello from to EXPRESS'
    });
});

module.exports = app;