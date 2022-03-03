const express = require('express');
const app = express();
const fs = require('fs')
const cors = require('cors');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path')
const userInstance = require('./src/model')

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

app.use(express.json())
app.use(express.urlencoded());
app.use(cors())

// Database Setup
let DATABASE_URI = "mongodb+srv://slot_book:slot_book@cluster0.mk5te.mongodb.net/cowin_app?retryWrites=true&w=majority"
mongoose.connect(DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection
    .once('open', () => {
        console.log("Connection is successfully esteblished to the database")
    })
    .on('error', (error) => {
        console.log(`Conneciton error is ${error}`)
    })

app.get('/', (req, res) => {
    res.send('Hello Newton!');
});

let count = 0;

app.post('/signwithemailonly', async (req, res) => {
    console.log('req', req.body.email)
    let findUser = await userInstance.findOne({ email: req.body.email })
    if (findUser) {
        res.send(JSON.stringify({ "data": "Email Id already existed" }))
    }
    let obj = {
        email: req.body.email
    }
    let newUser = await userInstance.create(obj)
    console.log("findUser", findUser, "newUser", newUser)
    res.send(JSON.stringify({ "data": "Sign in successfully" }))
})

// app.post('/save-video', upload.single('video-file'), function (req, res, next) {
//     // console.log(req);
//     const file = req.file;
//     if (!file) {
//         const error = new Error('Please upload a file');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     var obj = {
//         video: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'video/webm'
//         }
//     }
//     console.log('req.file', req.file, "obj", obj);
//     res.send(file);
// });

// app.post('/record-screenshot', upload.single('screenshot'), async function (req, res, next) {
//     console.log('req.file', req.file);
//     const file = req.file;
//     if (!file) {
//         const error = new Error('Please upload a file');
//         error.httpStatusCode = 400;
//         return next(error);
//     }
//     // var obj = {
//     //     screenshotName: `screenshot${count}`,
//     //     screenshot: {
//     //         data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//     //         contentType: 'image/png'
//     //     }
//     // }
//     // let user = await userInstance.findOne({ email: "newtonmauryadw@gmail.com" })
//     // console.log("user", user)
//     // if (!user) {
//     //     res.send(JSON.stringify({ "data": "Email Id already existed" }))
//     // }
//     // user.data.screenshots.push(obj)
//     // let dataRes = await user.save()
//     // console.log("dataRes", dataRes)
//     res.send("dataRes")
// });

// app.post('/record-click', upload.single('screenshot-click'), async function (req, res, next) {
//     console.log('req.file', req.file);
//     // console.log(req);
//     const file = req.file;
//     if (!file) {
//         const error = new Error('Please upload a file');
//         error.httpStatusCode = 400;
//         return next(error);
//     }

//     var obj = {
//         clickRecordName: `screenshot${count}`,
//         screenshot: {
//             data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
//             contentType: 'image/png'
//         }
//     }
//     let user = await userInstance.findOne({ email: "newtonmauryadw@gmail.com" })
//     console.log("user", user)
//     if (!user) {
//         res.send(JSON.stringify({ "data": "Email Id already existed" }))
//     }

//     res.send(file);
// });




app.post('/handle-new-record/', upload.single('screenshot'), async (req, res, next) => {
    // true-112-6443_Free-Dictionary-API_FreeDictionaryAPI134254536469
    console.log(req.body, "req.body")
    let recordId = req.body.recordId
    let isPosition = req.body.isPosition === 'true' ? true : false
    let recordName = req.body.recordName
    let positionX = req.body.positionX;
    let positionY = req.body.positionY;

    let email = 'newtonmauryadw@gmail.com';

    let file = req.file;

    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }

    let user = await userInstance.findOne({ email: email })

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }

    let obj = {
        recordName: recordName,
        recordId: recordId,
        time: Date.now(),
        total: 1,
        recordData: [
            {
                isPosition: isPosition,
                positionX: positionX,
                positionY: positionY,
                orderNum: 1,
                recordTime: Date.now(),
                itemName: "",
                itemId: "",
                itemData: {
                    data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                    contentType: req.file.mimetype
                }
            }
        ]
    }

    user.data.records.push(obj)

    let obj2 = {
        recordName: recordName,
        recordId: recordId,
        time: Date.now(),
        total: 1,
        lastRecord: {
            itemName: "",
            itemId: "",
            itemData: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }
        }
    }

    user.data.recordNames.push(obj2)
    try {
        let dbRes = await user.save()
        res.send(JSON.stringify({ res: "successfully recorded" }))
    }
    catch (err) {
        res.send(err)
    }
})

app.post('/handle-existing-record/', upload.single('screenshot'), async (req, res, next) => {
    count++
    console.log('req.body', req.body, "count", count)
    // "true-112-6443_Free-Dictionary-API_FreeDictionaryAPI134254536469"
    let recordId = req.body.recordId
    let isPosition = req.body.isPosition === 'true' ? true : false
    let recordName = req.body.recordName
    let positionX = req.body.positionX;
    let positionY = req.body.positionY;

    console.log("paramsData", "recordId", recordId, positionX, positionY)
    let email = 'newtonmauryadw@gmail.com';
    let file = req.file;
    if (!file) {
        const error = new Error('Please upload a file');
        error.httpStatusCode = 400;
        return next(error);
    }

    let user = await userInstance.findOne({ email: email })

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }
    let index = (user.data.records.findIndex((ele) => {
        return ele.recordId === recordId
    }))
    // console.log('outside if block', index, user, "user.data.records", user.data.records)
    if (user.data.records.some((ele) => {
        return ele.recordId === recordId
    })) {
        let index = (user.data.records.findIndex((ele) => {
            return ele.recordId === recordId
        }))


        let userData = user.data.records[index];
        let userRecordName = user.data.records[index]

        userData.total = userData.total + 1;
        console.log("Inside else block, index", index, userData.total)


        userRecordName.total = userData.total;
        userRecordName.time = Date.now()
        userRecordName.lastRecord = {
            itemName: "",
            itemId: "",
            itemData: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }
        };

        let obj = {
            isPosition: isPosition,
            positionX: positionX,
            positionY: positionY,
            orderNum: userData.total,
            recordTime: Date.now(),
            itemName: "",
            itemId: "",
            itemData: {
                data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
                contentType: req.file.mimetype
            }
        }

        userData.recordData.push(obj);

        user.data.records[index] = userData;
        user.data.recordNames[index] = userRecordName;
        user.markModified("NewData")
    }

    try {
        let dbRes = await user.save()
        // console.log("dbRes", dbRes)
        res.send(JSON.stringify({ res: dbRes }))
    }
    catch (err) {
        res.send(err)
    }

})

app.get('/delete-item/:id', async (req, res, next) => {
    let paramsId = req.params.id;
    let paramsData = paramsId.split('_')
    let id = paramsData[0]
    let recordId = paramsData[1]
    console.log("recordID", recordId)
    let email = "newtonmauryadw@gmail.com";
    let user = await userInstance.findOne({ email: email });

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }

    if (user.data.records.some((ele) => {
        return ele.recordId === recordId
    })) {

        let index = (user.data.records.findIndex((ele) => {
            return ele.recordId === recordId
        }))

        let recordItems = user.data.records[index];

        if (recordItems.recordData.some((ele) => {
            return ele.itemId === itemId
        })) {

            recordItems.recordData = recordItems.recordData.filter(ele => ele._id !== id)
            recordItems.total = recordItems.total - 1;
        }
        user.data.records[index] = recordItems

        user.markModified("ItemDeleted")
    }

    try {
        let dbRes = await user.save()
        console.log("dbRes", dbRes)
        res.send(JSON.stringify({ res: dbRes, message: "Hi, Newton. You are deleted successfully." }))
    }
    catch (err) {
        res.send(err)
    }
})

app.get('/delete-record/:id', async (req, res, next) => {
    let recordId = req.params.id;
    console.log("recordID", recordId)
    let email = "newtonmauryadw@gmail.com";
    let user = await userInstance.findOne({ email: email });

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }

    if (user.data.records.some((ele) => {
        return ele.recordId === recordId
    })) {

        user.data.records = user.data.records.filter((ele) => {
            ele.recordId !== recordId
        })

        user.markModified("RecordDeleted")
    }

    try {
        let dbRes = await user.save()
        console.log("dbRes", dbRes)
        res.send(JSON.stringify({ res: dbRes, message: "Hi, Newton. You are record deleted successfully." }))
    }
    catch (err) {
        res.send(err)
    }
})

app.get('/rearrange-order/:id', async (req, res, next) => {
    let paramsId = req.params.id;
    let paramsData = paramsId.split('_')
    let id = paramsData[0]
    let recordId = paramsData[1]
    let forOrder = paramsData[2]
    let fromOrder = paramsData[3]
    let email = "newtonmauryadw@gmail.com";
    let user = await userInstance.findOne({ email: email });

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }

    if (user.data.records.some((ele) => {
        return ele.recordId === recordId
    })) {

        let index = (user.data.records.findIndex((ele) => {
            return ele.recordId === recordId
        }))

        let recordItems = user.data.records[index];

        if (recordItems.recordData.some((ele) => {
            return ele._id === id
        })) {

            let itemIndex = recordItems.recordData.findIndex((ele) => {
                return ele._id === id
            })

            let targetItem = recordItems.recordData[itemIndex];
            targetItem.orderNum = forOrder;
            recordItems.recordData[itemIndex] = targetItem;
        }

    }
})

app.get('/get-records', async (req, res) => {
    let email = "newtonmauryadw@gmail.com";

    console.log("Hi, Newton!")
    let user = await userInstance.findOne({ email: email });

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }
    console.log("user", user)
    // let recordIds = await userInstance.find({ email: email })
    // let recordIds = await userInstance.findOne({ email: email }, { recordId: 1 })
    console.log("recordIds", user, user.data.recordNames)
    res.contentType('json')
    res.send({ data: user.data.recordNames })
})
app.get('/get-record-items/:id', async (req, res) => {
    let id = req.params.id;

    let email = "newtonmauryadw@gmail.com";

    console.log("Hi, Newton!")
    let user = await userInstance.findOne({ email: email });

    if (!user) {
        const error = new Error('Not found');
        error.httpStatusCode = 404;
        return next(error);
    }

    let record = user.data.records.find(ele => ele.recordId === id)

    // console.log('record', record)
    res.send(record)
})
// Initializing the server
app.listen(2000, () => {
    console.log(`Server listening on Port 2000`);
});