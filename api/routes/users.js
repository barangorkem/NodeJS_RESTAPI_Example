
const express=require('express');
const router=express.Router();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const Users=require('../models/user');


router.get("/",(req,res,next)=>{
    Users.find({})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
})

router.post('/signup',(req,res,next)=>{
    
    Users.find({email:req.body.email})
    .exec()
    .then(result=>{
        if(result.length>=1)
        {
            res.status(409).json({
                message:"Email has been already exists"
            });
            
        }
        else
        {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err)
                {
                    res.status(500).json({
                        error:err
                    })
                }
                else
                {
                    const users=new Users({
                        _id:mongoose.Types.ObjectId(),
                        email:req.body.email,
                        password:hash
                    });
                    users.save()
                    .then(result=>{
                        console.log(result);
                        res.status(200).json(result);
                    }).catch(err=>{
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        }
    })
});

router.get('/:userId',(req,res,next)=>{
    Users.findById(req.params.userId)
    .exec()
    .then(result=>{
        console.log(result.length);
        if(result)
        {
            res.status(200).json(result);
        }
        else
        {
            res.status(404).json({
                message:"Users Not found"
            })
        }
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    })
});

router.delete('/:userId',(req,res,next)=>{
    Users.remove({_id:req.params.userId}).
    exec()
    .then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    })
})
router.patch('/:userId',(req,res,next)=>{

   Users.find({email:req.body.email})
    .exec()
    .then(result=>{
        if(result.length>=1)
        {
            res.status(409).json({
                message:"Email has been already exists"
            });
            
        }
        else
        {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err)
                {
                    res.status(500).json({
                        error:err
                    })
                }
                else
                {
                   
                    Users.update({_id:req.params.userId},{email:req.body.email,password:hash})
                    .exec()
                    .then(result=>{
                        console.log(result);
                        res.status(200).json(result);
                    }).catch(err=>{
                        res.status(500).json({
                            error:err
                        });
                    });
                }
            })
        }
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    })
})

module.exports=router;