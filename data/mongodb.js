const mongoose = require('mongoose')
const connectDB = async () => {
    // 'mongodb://localhost:27017/crm'
    // const conn = await mongoose.connect("mongodb+srv://Abbos:ikvabs111@cluster0.wevd1.mongodb.net/CRM_UMD?retryWrites=true&w=majority", {   
    const conn = await mongoose.connect("mongodb://localhost:27017/crm", {   
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
};
module.exports = connectDB;
 