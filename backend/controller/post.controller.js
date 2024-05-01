import express from "express"
import User from "../models/user.models.js";
import { v2 as cloudinary } from "cloudinary";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js";

export const createPost = async(req,res)=>{
  try {
      const {text} = req.body;
      let {img} = req.body;
      const userId = req.user._id;
  
      const user = await User.findById(userId);
      if(!user) return res.status(404).json({error : "User not found"})
  
      if (!text && !img) {
          return res.status(401).json({message : "Post must have text or img"})
      }
  
      if (img) {
          const uploadedResponse = await cloudinary.uploader.upload(img)
          img : uploadedResponse.secure_url
      }
  
      const newPost = new Post({
          user : userId,
          img,
          text
      })
  
      await newPost.save()
      res.status(201).json({
          message : "New post created",
          newPost
      })
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error : "Internal server error"})
  }

}
export const deletePost = async(req,res)=>{
   try {
     const {id} = req.params;
     const userId = req.user._id;
     const post = await Post.findById(id)
     if(!post) return res.status(404).json({error : "post not found"});
 
     if (post.user.toString() !== userId.toString()) {
         return res.status(400).json({
             error : "You are not authorized to delete this post"
         })
     }
     if (post.img) {
         const imgId = post.img.split("/").pop().split(".")[0];
         await cloudinary.uploader.destroy(imgId)
     }
     await Post.findByIdAndDelete(id)
     res.status(200).json({
         message : "Post deleted successfully"
     })
 
 
   } catch (error) {
    console.log(error.message);
    res.status(500).json({message : "Internal server error"})
   }

}

export const commentOnPost = async(req,res)=>{
  try {
      const {id} = req.params;
      const {text} = req.body;
      const userId = req.user._id;
      if (!text) {
          return res.status(400).json({error : "Text field is required"})
      }
      const post = await Post.findById(id)
  if(!post) return res.status(400).json({error : "post not found"})
     
  const comment = {user : userId, text};
  post.comments.push(comment);
  await post.save()
  res.status(200).json({post})
  
  } catch (error) {
    console.log(error.message);
    res.status(500).json({error : "Internal server error"})
  }
}

export const likeUnLike = async(req,res)=>{
    try {
        const userId = req.user._id;
        const {id} = req.params;
        const post = await Post.findById(id)
        if(!post) return res.status(404).json({error : "Post not found"})

        const userLikedPost = post.likes.includes(userId)
        if (userLikedPost) {
            //unlike post
           await Post.updateOne({_id : id}, {$pull : {likes : userId}})
            await User.updateOne({ _id : userId}, {$pull : {likedPost : id}})
            res.status(200).json({message : "post unlike successfully"})
        }else{
            //like post
            post.likes.push(userId)
           await User.updateOne({_id : userId}, {$push : {likedPost : id}})

            await post.save()

            const notification = new Notification({
                from : userId,
                to : post.user,
                type : 'like'
            })
            await notification.save()
            res.status(200).json({message : "post like successfully"})
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Internal server error"})
    }
}

export const getAllPost = async(req,res) =>{
    try {
        const allPost = await Post.find().sort({createdAt : -1}).populate({
            path : "user",
            select : "-password"
        })
        .populate({
            path : "comments.user",
            select : "-password"
        })
        if (allPost === 0) {
            res.status(200).json([])
        }
        res.status(200).json(allPost)
    } catch (error) {
        console.log(error.message);
        res.status(500).json({error : "Internal server error"})
    }
}

export const userLikedPost =async(req,res)=>{
    const {id : userId} = req.params;
   try {
    const user = await User.findById(userId);
		if (!user) return res.status(404).json({ error: "User not found" });

		const likedPosts = await Post.find({ _id: { $in: user.likedPost } })
			.populate({
				path: "user",
				select: "-password",
			})
			.populate({
				path: "comments.user",
				select: "-password",
			});

		res.status(200).json(likedPosts);
   } catch (error) {
    console.log(error.message);
    res.status(500).json({error : "Internal server error"})
   }
}