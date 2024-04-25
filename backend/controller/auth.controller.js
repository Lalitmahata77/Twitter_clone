import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js"
import becrypt from "bcryptjs"
export const signup = async(req,res) =>{
  try {
	 const {fullName, username, email, password} = req.body
	   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(email)) {
				return res.status(400).json({ error: "Invalid email format" });
			}
	const existedUsername = await User.findOne({username})
	if (existedUsername) {
		res.status(200).json({
			message : "User already exist"
		})
	}
	   const existedEmail = await User.findOne({email})
	   if (existedEmail) {
		res.status(200).json({
			message : ' Email already exist'
		})
	   }
	
	   if (password.length < 6) {
		res.status(400).json({
			message : "Password must be at least 6 character log"
		})
	   }
	const salt = await becrypt.genSalt(10)
	const hashedPassword = await becrypt.hash(password, salt)
	
	   const newUser = new User({
		fullName,
		email,
		username,
		password : hashedPassword
	   })
	
	   if (newUser) {
		generateTokenAndSetCookie(newUser._id, res)
		await newUser.save()
		res.status(201).json({
			_id : newUser._id,
			fullName : newUser.fullName,
			username : newUser.username,
			email : newUser.email,
			following : newUser.following,
			followers : newUser.followers,
			bio : newUser.bio,
			link : newUser.link,
			profileImg : newUser.profileImg,
			coverImg : newUser.coverImg
		})
		}else{
			res.status(400).json({
				message : "Invalid user data"
			})
		}
  } catch (error) {
	res.status(500).json({
		message : "Internal server error"
	})
	
  }
   }




export const login = (req,res) =>{

}
export const logout = (req,res) =>{

}

