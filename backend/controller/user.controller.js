import Notification from "../models/notification.model.js"
import User from "../models/user.models.js"

export const getUserProfile = async(req,res) =>{
const {username} = req.params
try {
    
    const user = await User.findOne({username}).select("-password")
    if (!user) {
        return res.status(401).json({message : "User not found"})
    }
    
    res.status(200).json({user})
    
} catch (error) {
    console.log(error.message);
    res.status(500).json({message : "Internal server error"})
}
}

export const followUnfollowUser = async(req,res)=>{
    const {id} = req.params;
    const isModify = await User.findById(id)
    const currentUser = await User.findById(req.user._id)

    if (id === req.user._id.toString()) {
     return  res.status(404).json({error : "You can't follow or unfollow yourself"})
        
    }

    if (!isModify || !currentUser) {
        return res.status(400).json({error : "User not found"})
    }

    const isFollowing = currentUser.following.includes(id)

    if (isFollowing) {
        //unfollowing the user
        await User.findByIdAndUpdate(id, {$pull : {followers : req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$pull : {following : id}})
        res.status(200).json({message : "Unfollow successfully"})
        
    }else{
        //following the user
        await User.findByIdAndUpdate(id, {$push: {followers : req.user._id}})
        await User.findByIdAndUpdate(req.user._id, {$push : {following : id}})
        //notification 
        const newNotification = new Notification({
            type : "follow",
            from : req.user._id,
            to : isModify._id
        })
        await newNotification.save()


        res.status(200).json({message : "follow successfully"})
    }


}