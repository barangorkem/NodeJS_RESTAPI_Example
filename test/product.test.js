
const Product = require('../api/models/product');
const app = require('../app');
const should = require('chai').should();
const mongoose = require('mongoose');
const request = require('supertest');

describe('Product', () => {
    before('connect', function () {
        return mongoose.createConnection('mongodb://localhost:27017/nodeshop')
    })
    describe('getProducts', () => {
        it('Fetch All Product', (done) => {

            request(app)
                .get('/products')
                .end((err, res) => {
                    res.should.have.property('status', 200);
                    res.body.should.be.a('array');

                    done();
                })

        })
    });
    
    describe('postProduct',()=>{
        it('Post Product',(done)=>{
            let product = {
                name: "Product9",
                price: "5000"
            }
    
            request(app)
            .post('/products')
            .send(product)
            .end((err,res)=>{
                console.log("posttttt",res.body);
                res.should.have.property('status', 201);
                res.body.createdProduct.should.be.a('object');
                res.body.createdProduct.should.have.property('name');
                res.body.createdProduct.should.have.property('price');
    
                done();
            })
           
    })
    });
    
    
    describe('getProduct',()=>{
        it('Get Product',(done)=>{
            let product = new Product({ name:'Product6',price:100});
    
    
            request(app)
            .post('/products')
            .send(product)
            .end((err,res)=>{
                request(app)
                .get('/products/'+res.body.createdProduct._id)
                .end((err,res)=>{
                    res.should.have.property('status', 200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('name');
                    res.body.should.have.property('price');
                    res.body.should.have.property('_id').eql(res.body._id);
                    done();
                })
            })   
    })
    });
    
    describe('putProduct', () => {
        it('Put Product', (done) => {
            let product = new Product({_id:new mongoose.Types.ObjectId(), name: 'Product19', price: 135 });

            product.save().then(res => {
          
                console.log("dsdsa",res._id);
                request(app)
                .patch('/products/'+res._id)
                .send({name:'Product20',price:99})
                .end((err,res)=>{
                    console.log("posttttt",res.body);
                 
                    res.body.should.have.property('n').eql(1);
                    res.body.should.have.property('ok').eql(1);
                    done();
                })

            });
        });

    }); 
    describe('deleteProduct', () => {
        it('Delete Product', (done) => {
            let product = new Product({_id:new mongoose.Types.ObjectId(), name: 'Product19', price: 135 });

            product.save().then(res => {
          
                console.log("dsdsa",res._id);
                request(app)
                .delete('/products/'+res._id)
                .send({name:'Product20',price:99})
                .end((err,res)=>{
                    console.log("delete",res.body);
                    res.body.should.have.property('n').eql(1);
                    res.body.should.have.property('ok').eql(1);
        
                    done();
                })

            });
        });

    });
});



