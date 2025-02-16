import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    googleId : {
        type : String,
        required : true,
        unique : true,
    } , 
    email : {
        type : String,
        unique : true,
        required : true,
    } , 
    displayName : {
        type : String,
    },
    avatar : {
        type : String,
    }
});

export default mongoose.model('User' , userSchema);