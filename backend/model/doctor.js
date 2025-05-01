const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    experience: Number,
    modeOfConsult: String,
    rating: Number,
    fees: Number,
    availability: [String],
    image: String
});

doctorSchema.statics.getFeeRanges = function() {
    return [
        { range: '0-500', min: 0, max: 500 },
        { range: '500-1000', min: 500, max: 1000 },
        { range: '1000-1500', min: 1000, max: 1500 },
        { range: '1500+', min: 1500, max: Infinity }
    ];
};

doctorSchema.statics.getExperienceRanges = function() {
    return [
        { range: '0-5 years', min: 0, max: 5 },
        { range: '5-11 years', min: 5, max: 11 },
        { range: '11-16 years', min: 11, max: 16 },
        { range: '16+ years', min: 16, max: 100 }
    ];
};

module.exports= mongoose.model('Doctor',doctorSchema)
