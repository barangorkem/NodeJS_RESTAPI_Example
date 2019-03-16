const Users=require('../models/user');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
exports.users_get_all=(req,res,next)=>{
    Users.find({})
    .exec()
    .then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        })
    })
}

exports.users_login_user=(req,res,next)=>{
    Users.find({email:req.body.email})
    .exec()
    .then(user=>{
        console.log(user.length);
        if(user.length<1)
        {
            return res.status(401).json({
                message:"Auth failed"
            })
        }
        else
        {
            bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
                if(err)
                {
                    return res.status(401).json({
                        message:"Auth Failed"
                    })
                }
                if(result)
                {
                    const token=jwt.sign({
                        email:user[0].email,
                        password:user[0]._id
                    },"secret",
                    {
                        expiresIn:"1h"
                    })
                    return  res.status(200).json({
                     message:"Auth Successful",
                     token:token
                 });
                 
                }
                  res.status(401).json({
                 message:"Auth Failed"
             })
 
            })
        }
    }).catch(err=>{
            res.status(500).json({
            error:err
        })
    })
}

exports.users_signup_user=(req,res,next)=>{
    
    Users.find({email:req.body.email})
    .exec()
    .then(result=>{
        if(result.length>=1)
        {
            return res.status(409).json({
                message:"Email has been already exists"
            });
            
        }
        else
        {
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err)
                {
                    return   res.status(500).json({
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
}

exports.users_get_user=(req,res,next)=>{
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
};

exports.users_delete_user=(req,res,next)=>{
    Users.remove({_id:req.params.userId}).
    exec()
    .then(result=>{
        res.status(200).json(result);
    }).catch(err=>{
        res.status(500).json({
            error:err
        });
    })
}

exports.users_update_user=(req,res,next)=>{

    Users.findById(req.params.userId)
     .exec()
     .then(result=>{
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
         
     }).catch(err=>{
         res.status(500).json({
             error:err
         });
     })
 }