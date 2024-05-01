import Notification from "../models/notification.model.js";

export const getAllNotification =async(req,res)=>{
   try {
     const userId = req.user._id;
     const notification = await Notification.find({to : userId})
     .populate({
         path : "from",
         select : "username profileImg"
     })
 
     await Notification.updateMany({to :userId}, {read : true})
     res.status(200).json(notification)
 
   } catch (error) {
    console.log(error.meassage);
    res.status(500).json({ error : "Internal server error"})
   }
}

export const deleteNotification = async(req,res)=>{
    try {
        const userId = req.user._id;
     const deletedNotification =   await Notification.deleteMany({to : userId})
        res.status(200).json({ meassage : "Notification deleted successfully", deletedNotification})
    } catch (error) {
        console.log(error.meassage);
        res.status(500).json({ error : "Internal server error"})
    }
}