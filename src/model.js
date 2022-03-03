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
        dataName: {
            screenshotNames: [
                {
                    screenshotName: {
                        type: String,
                    },
                }
            ],
            clickRecordNames: [
                {
                    clickRecordName: { type: String, },
                }
            ],
            recordVideoNames: [
                {
                    videoName: {
                        type: String,
                    },
                }
            ]
        },
        currentQueue: {
            clickRecordName: { type: String, },
            data: [
                {
                    positionX: {
                        type: String,
                    },
                    positionY: {
                        type: String,
                    },
                    screenshot: {
                        data: Buffer,
                        contentType: String
                    },

                }
            ]
        },
        screenshots: [
            {
                screenshotName: {
                    type: String,
                },
                screenshot: {
                    data: Buffer,
                    contentType: String
                },
            }
        ],
        recordClicks: [
            {
                clickRecordName: { type: String, },
                data: [
                    {
                        positionX: {
                            type: String,
                        },
                        positionY: {
                            type: String,
                        },
                        screenshot: {
                            data: Buffer,
                            contentType: String
                        }
                    }
                ],
                isOpen: { type: Boolean }
            }
        ],
        screenRecardVideos: [
            {
                videoName: {
                    type: String,
                },
                video: {
                    data: Buffer,
                    contentType: String
                },
            }
        ]
    }
}, { timestamps: true, }
);


const recordSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },
    data: {
        recordNames: [
            {
                recordName: { type: String, },
                recordId: { type: String, },
                total: { type: Number, },
                time: { type: Date, },
                lastRecord: {
                    itemName: {
                        type: String
                    },
                    itemId: {
                        type: String,
                    },
                    itemData: {
                        data: Buffer,
                        contentType: String
                    }
                }
            }
        ],
        records: [
            {
                recordName: { type: String, },
                recordId: { type: String, },
                total: { type: Number, },
                time: { type: Date, },
                recordData: [
                    {
                        isPosition: { type: Boolean, },
                        positionX: {
                            type: String,
                        },
                        orderNum: {
                            type: Number,
                        },
                        recordTime: { type: String, },
                        positionY: {
                            type: String,
                        },
                        itemName: {
                            type: String
                        },
                        itemId: {
                            type: String,
                        },
                        itemData: {
                            data: Buffer,
                            contentType: String
                        }
                    }
                ],
                lastRecord: {
                    itemName: {
                        type: String
                    },
                    itemId: {
                        type: String,
                    },
                    itemData: {
                        data: Buffer,
                        contentType: String
                    }
                }
            }
        ]
    }
}, { timestamps: true, })
module.exports = mongoose.model('RecardData', recordSchema);