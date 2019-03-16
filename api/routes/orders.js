
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Orders=require('../models/order');
const Products=require('../models/product');

router.get('/',(req,res,next)=>{
    Orders.find({})
    .select("_id product quantity")
    .populate("product",'name') //Bağlantıda olduğu tablonun verilerini getirir(Products).
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    });
});

router.post('/',(req,res,next)=>{

    Products.findById(req.body.productId)
    .exec()
    .then(result=>{
        if(result)
        {
            const order=new Orders({
                _id:mongoose.Types.ObjectId(),
                product:req.body.productId,
                quantity:req.body.quantity
            });
            order.save()
            .then(result=>{
                console.log(result);
                res.status(200).json(result);
            }).catch(err=>{
                res.status(500).json({
                    error:err
                })
            })
        }
        else
        {
            res.status(404).json={
                message:"Not found"
            }
        }
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })

    
    
});

router.get('/:orderId',(req,res,next)=>{
    Orders.findById(req.params.orderId)
    .select("_id product quantity")
    .populate("product") //Bağlantıda olduğu tablonun verilerini getirir.
    .exec()
    .then(result=>{
        if(result)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(404).json({
                message:"Order not found"
            });
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    });
   
})
router.delete('/:orderId',(req,res,next)=>{
    Orders.remove({_id:req.params.orderId})
    .exec()
    .then(result=>{
     
       if(result)
       {
        res.status(200).json(result);
       }
       else
       {
           res.status(404).json({
               message:"Order not found"
           });
       }
        
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
 
})

module.exports=router;