const mongoose = require('mongoose');

const db = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.MONGO_URL);
        console.log('DB connected');
    } catch (error) {
        console.error('DB Connection Error:', error.message); // Log the actual error message
        process.exit(1); // Exit the process with failure status
    }
};

module.exports = { db };
