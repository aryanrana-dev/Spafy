import User from "../models/User.js";
import bcrypt from "bcrypt"
import { generateToken } from "../lib/utils.js";
import  dotenv from "dotenv";
dotenv.config();

export const signup = async (req,res)=>{
    const {fullName,email,password} = req.body
    try{
        if(!fullName || !email ||!password){
return res.status(400).json({message:"All fields are required"})
        }
if(password.length<6){
return res.status(400).json({message:"Password must be atleast 6 characters"})

}
//check if email is valid or not
const emailRogex =/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailRogex.test(email)){
    return res.status(400).json({message:"invalid email format"})
}

const user= await User.findOne({email});
if(user){
    return res.status(400).json({message:"Email already exist"})
}

const salt = await bcrypt.genSalt(10)
const hashedPassword = await bcrypt.hash(password,salt)

const newUser = new User({
fullName,
email,
password:hashedPassword
}
)

if(newUser){
   const savedUser = await newUser.save()

    generateToken(savedUser._id,res)
    res.status(201).json({
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic,


        
    })


}
else{
    res.status(400).json({
        message:"invalid user data"
    })
}

    }catch(err){
console.log(err)
res.status(500).json({message:"Internal server error"})
    }
}
export const login = async(req,res)=>{
const {email,password} = req.body;
if(!email||!password){
    return res.status(400).json({
        message:"Email and password are required"
    })
}
try {
    const user = await User.findOne({email})
    if(!user){
        return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    const isPasswordCorrect = await bcrypt.compare(password,user.password)
    if(!isPasswordCorrect){
          return res.status(400).json({
            message:"Invalid Credentials"
        })
    }
    generateToken(user._id,res);
    res.status(200).json({
        _id:user._id,
        fullName:user.fullName,
        email:user.email,
        profilePic:user.profilePic
    });
} catch (error) {
    console.log(error);
    res.status(500).json({
        message:"internal server eror"
    })
}
}
export const logout = async(req,res)=>{
res.cookie("jwt","",{maxAge:0})
res.status(200).json({
    message:"logged out succesfully"
})
}
export const updateProfile = async(req,res)=>{
    try {
        const {profilePic} = req.body;
        if(!profilePic){
            return res.status(400).json({
                message:"Profile pic is required"
            })
        }
        const userId = req.user._id;
   const uploadResponse =     await cloudinary.uploader.upload(profilePic)
 const updatedUser =  await User.findByIdAndUpdate(userId,{profilepic:uploadResponse.secure_url},{new:true})
 res.status(200).json(updatedUser)
    } catch (error) {
        console.log("error in update profile",error)
        res.status(500).json({message:"Internal server error"})
        
    }
}