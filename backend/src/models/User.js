import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    phone: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String },
    createdAt: { type: Date, default: Date.now },
    password:{type:String,required:true}
});

const User = mongoose.model("User", userSchema)

export default User;