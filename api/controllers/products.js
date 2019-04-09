const Orders=require('../models/order');
const Product=require('../models/product');
const mongoose=require('mongoose');

exports.products_get_all=(req,res,next)=>{

    Product.find()
    .select("_id name price")
    .exec()
    .then(docs=>{
        console.log("sorgu");
        if(docs.length>0)
        {
            //console.log(req.token);
            //console.log(req.userData);
          return  res.status(200).json(docs); 


        }
        else
        {
          return  res.status(404).json({
                message:"No entries found"
            });
        }
    }).catch(err=>{
        console.log(err);
        res.status(500).json({
            error:err
        })
    });

}

exports.products_create_product=(req,res,next)=>{

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
}

exports.products_get_product=(req,res,next)=>{

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
}
exports.products_update_product=(req,res,next)=>{

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
}

exports.products_delete_product=(req,res,next)=>{

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
   
}
