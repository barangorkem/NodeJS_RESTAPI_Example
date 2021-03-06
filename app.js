const express=require('express');
const app=express();
const morgan=require('morgan');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const productRoutes=require('./api/routes/product');
const orderRoutes=require('./api/routes/orders'); 
const userRoutes=require('./api/routes/users');
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extented:false}));
app.use(bodyParser.json());
//Routes
app.use('/products',productRoutes);
app.use('/orders',orderRoutes);
app.use('/users',userRoutes);

//MongoDB
mongoose.connect("mongodb://localhost:27017/nodeshop")

app.use((req,res,next)=>{
    res.header("Access-Control-Allow-Origin","*");
    res.header(
        "Access-Control-Allow-Header",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    if(req.method=== 'OPTIONS'){
        res.header("Access-Control-Allow-Methods","PUT, POST, PATCH , DELETE, GET");
        return res.status(200).json();
    }
    next();
})

app.use((req,res,next)=>{
    const error=new Error('Not found');
    error.status=404;
    next(error);
})

app.use((error,req,res,next)=>{
    
    res.status(error.status || 500);
    res.json({
        error:{
            message:error.message
        }
    });
})

module.exports=app;