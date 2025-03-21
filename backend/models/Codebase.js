import mongoose from "mongoose";

const codebaseSchema = mongoose.Schema({
    ownerId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },

    title : {
        type : String,
        required : true,
    },
    note : {
        type:String,
    },
    date : {
        type: String,
    },
    code : {
        type : String,
        required : true,
    }
});

const codebase = mongoose.model("codebase" , codebaseSchema);

export default codebase;