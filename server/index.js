const express=require('express');
const userRoutes=require('./routes/User');
const paymentRoutes=require('./routes/Payments');
const courseRoutes=require('./routes/Course');
const profileRoutes=require('./routes/Profile');
require('dotenv').config();
const connectDB=require('./config/database');
const cookieParser=require('cookie-parser');
const cors=require('cors');
const {cloudinaryConnect}=require('./config/cloudinary');
const fileUpload=require('express-fileupload');
const dotenv=require('dotenv');

dotenv.config();
const PORT=4000;

//database connect
connectDB();
console.log('database connected successfully')
var  app=express();
//middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))
app.use(fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
}));

//cloudinary connect
cloudinaryConnect();

//routes mounting
app.use('/api/v1/auth',userRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/payment',paymentRoutes);

//default route
app.get("/",(req,res)=>{
    return res.json({
        success:true,
        message:"your server is up and application is running"
    })
})

//activate the server
app.listen(PORT,()=>{
    console.log(`app is running at port: ${PORT}`);
})


