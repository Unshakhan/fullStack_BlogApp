import mongoose from "mongoose"

const connectDb = async()=>{
   try{ console.log("connectDB ki process.env.MONGO_URI------->",process.env.MONGO_URI);

   await  mongoose.connect(process.env.MONGO_URI)
       console.log('mongo db connected');}
       catch(err){
console.log('error in db-->',err);
       }
}

export default connectDb