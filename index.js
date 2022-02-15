const express = require('express');
const app = express();
const fs = require('fs')
const cors = require('cors');
const multer = require('multer');
const path = require('path')

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        console.log(file);
        cb(null, file.originalname);
    }
});
var upload = multer({ storage: storage });

app.use(cors());
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Rogue follows the religion of Islam and Allah is the most gracious');
});

app.post('/save-video', upload.single('video-file'), function (req, res, next) {
    // console.log(req);
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    var obj = {
        name: req.file.fieldname,
        desc: req.file.destination,
        video: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'video/webm'
        }
    }
    console.log('req.file', req.file, "obj", obj);
    res.send(file);
});

app.post('/record-screenshot', upload.single('screenshot'), function (req, res, next) {
    console.log('req.file', req.file);
    // console.log(req);
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
});

app.post('/record-click', upload.single('screenshot-click'), function (req, res, next) {
    console.log('req.file', req.file);
    // console.log(req);
    const file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }
    res.send(file);
});
// Initializing the server
app.listen(2000, () => {
    console.log(`Server listening on Port 2000`);
});