const express = require('express')

const connectDB = require('./config/database');
const User = require('./models/userSchema');
const cookieParser = require('cookie-parser')


const app = express();
app.use(express.json())
app.use(cookieParser())

const PORT = 3000;


const authRouter=require('./routes/authRouter')
app.use('/',authRouter)

const profileRouter=require('./routes/ProfileRouter')
app.use('/',profileRouter)

const requestRouter=require('./routes/requestRouter')
app.use('/',requestRouter)

const userRouter=require('./routes/userRouter')
app.use('/',userRouter)




connectDB().then(() => {
  console.log('connected');
  app.listen(PORT, () => {
    console.log(`server running at http://localhost:${PORT}/`)
  });

}).catch(err => console.log('db cannot be cannectod'))