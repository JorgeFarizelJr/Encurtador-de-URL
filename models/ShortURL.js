// models/ShortURL.js

const mongoose = require('mongoose');

const shortURLSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    shortCode: {
        type: String,
        required: true,
        unique: true
    },
    clicks: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model('ShortURL', shortURLSchema);
