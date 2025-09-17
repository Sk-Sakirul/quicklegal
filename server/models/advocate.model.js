const mongoose = require('mongoose');

const advocateSchema = new mongoose.Schema(
    {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
        specialization: {type: String, required: true},
        experience: {type: Number, required: true},
        hourlyRate: {type: Number, required: true},
        availability: [
            {
                date: {type: Date},
                slots: [{type: String}]
            }
        ]
    },
    {timestamps: true}
);

const Advocate = mongoose.model('Advocate', advocateSchema);

module.exports = Advocate;