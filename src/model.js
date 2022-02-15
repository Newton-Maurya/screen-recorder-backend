const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const screenRecordSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    data: {
        currentQueue: [
            {

            }
        ],
        screenshots: [{

        }],
        recordClicks: [
            {

            }
        ],
        screenRecardVideos: [
            {

            }
        ]
    }
}, { timestamps: true, }
);

module.exports = mongoose.model('UserRecord', screenRecordSchema);