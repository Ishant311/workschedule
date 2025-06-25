const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connnectDB = require('./lib/connectDB');
const leaveRoutes = require('./routes/leaveRoutes');
const dotenv = require('dotenv');
const employeeRoute = require('./routes/employeeRoute');
const authRoute = require('./routes/authRoute');
const managerRoute = require('./routes/managerRoute');
const adminRoute = require('./routes/adminRoute');
const app = express();

dotenv.config();
//connect to database
connnectDB(process.env.MONGOURL);

//middleware
app.use(cookieParser());
app.use(express.json());
app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials:true
    }
))

//routes
app.use('/api/auth',authRoute);
app.use('/api/manager',managerRoute);
app.use('/api/employee',employeeRoute);
app.use('/api/leave', leaveRoutes);
app.use('/api/admin', adminRoute);
app.use('/api/reports', require('./routes/reportRoute'));
app.use('/uploads/reports', express.static('uploads/reports'));


//server start
app.listen(5000,()=>{
    console.log('Server is running on port 5000');
})