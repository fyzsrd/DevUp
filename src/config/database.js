const mongoose=require('mongoose')



const connectDB=async()=>{
    await mongoose.connect(
        'mongodb+srv://hellonode:N9X77wLqniKTHxSf@awaitnode.1oznkhq.mongodb.net/?retryWrites=true&w=majority&appName=AwaitNode'
    )
}

// const connectDB=async ()=>{
//     await mongoose.connect('mongodb://localhost:27017/')
// }


module.exports = connectDB;