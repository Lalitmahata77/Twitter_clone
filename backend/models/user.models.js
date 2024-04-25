import mongoose, {Schema} from "mongoose";

const userSchema = new Schema({
    fullName : {
        type : String,
        required : true,
    },
    username : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true,
        minLength : 6
    },
    email : {
        type : String,
        required : true,
        unique: true,
    },
    profileImg: {
        type: String,
        default: "",
    },
    coverImg: {
        type: String,
        default: "",
    },
    followers : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : []
    },
    following : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        default : []
    },
    bio : {
        type : String,
        default : ""
    },
    link : {
        type : String, 
        default : ""
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema)
export default User