import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
import User from "../models/user.models.js"
import becrypt from "bcryptjs"
export const signup = async(req,res) =>{
	try {
		const { fullName, username, email, password } = req.body;

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: "Invalid email format" });
		}
		

		const existingUser = await User.findOne({ username });
		if (existingUser) {
			return res.status(400).json({ error: "Username is already taken" });
		}

		const existingEmail = await User.findOne({ email });
		if (existingEmail) {
			return res.status(400).json({ error: "Email is already taken" });
		}

		if (password.length < 6) {
			return res.status(400).json({ error: "Password must be at least 6 characters long" });
		}
	

		const salt = await becrypt.genSalt(10);
		const hashedPassword = await becrypt.hash(password, salt);

		const newUser = new User({
			fullName,
			username,
			email,
			password: hashedPassword,
		});

		if (newUser) {
			generateTokenAndSetCookie(newUser._id, res);
			await newUser.save();

			res.status(201).json({
				_id: newUser._id,
				fullName: newUser.fullName,
				username: newUser.username,
				email: newUser.email,
				followers: newUser.followers,
				following: newUser.following,
				profileImg: newUser.profileImg,
				coverImg: newUser.coverImg,
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
		}
	} catch (error) {
		console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}
   }




export const login = async(req,res) =>{
	try {
		const {username, password} = req.body;

		const user = await User.findOne({username})

		const isCorrectPassword = await becrypt.compare(password, user?.password || "")

		if (!user || !isCorrectPassword) {
			res.status(400).json({
				message : "Invalid username & password"
			})
		}

		generateTokenAndSetCookie(user._id, res)

		res.status(200).json({
			_id : user._id,
			username : user.username,
			password : user.password,
			fullName : user.fullName,
			email : user.email,
			followers : user.followers,
			following : user.following,
			coverImg : user.coverImg,
			profileImg : user.profileImg
		})

		
	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}

}
export const logout = (req,res) =>{
	try {
		res.cookie("jwt","", {maxAge : 0})
		res.status(200).json({
			message : "User logout successfully"
		})
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
	}

}

export const getMe = async(req,res)=>{
	try {
		const user = await User.findById(req.user._id).select("-password")
		res.status(200).json({
			user
		})
	} catch (error) {
		console.log(error.message);
		res.status(500).json({
			message : "Internal server error"
		})
	}
}

