
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const Product=require('../models/product');

router.get('/',(req,res,next)=>{

    Product.find()
    .select("_id name price")
    .exec()
    .then(docs=>{
        console.log(docs);
        if(docs.length>0)
        {
            res.status(200).json(docs); 

        }
        else
        {
            res.status(404).json({
                message:"No entries found"
            });
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

});
router.post('/',(req,res,next)=>{

    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price
    });
    product.save().then(result=>{
        console.log(result);
        res.status(201).json({
            message:"Products post request for /products",
            createdProduct:product
        });
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

 
});
router.get('/:productId',(req,res,next)=>{

    Product.findById(req.params.productId)
    .select("_id name price")
    .exec()
    .then(doc=>{
        console.log(doc);
        console.log("From database "+req.params.productId);
        if(doc)
        {
            res.status(200).json(doc);
        }
        else
        {
            res.status(404).json({
                message:"Not found"
            })
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })

   
})
router.patch('/:productId',(req,res,next)=>{

    Product.update({_id:req.params.productId},{$set:{name:req.body.name,price:req.body.price}})
    .exec()
    .then(result=>{
        console.log(result);
        res.status(200).json(result);
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    })

   
})
router.delete('/:productId',(req,res,next)=>{

    Product.remove({_id:req.params.productId})
    .exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        });
    })
   
})
module.exports=router;