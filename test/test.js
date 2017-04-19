//test!
let mongoose = require('mongoose');
let MetaData = require('../ke_modules/metadataSchema').meta;
let SizeData = require('../ke_modules/metadataSchema').log;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../app');
let should = chai.should();
const url = 'https://www.thesun.co.uk/wp-content/uploads/2017/01/nintchdbpict000297357200.jpg?strip=all&w=960';
chai.use(chaiHttp);

describe('Resize',(done)=>{
    before((done)=>{
        MetaData.remove({}, (err)=>{
            console.log('removed meta data');
        });
        SizeData.remove({},(error)=>{
            console.log('removed size data');
            done();  
        });
    });

describe('/GET resize', ()=>{
    it('no URL', done=>{
        chai.request(server)
        .get('/resize')
        .end((err, res)=>{
            res.should.have.status(400);
            done();
        });
    });

    it('new URL & new size', done=>{
        chai.request(server)
        .get('/resize')
        .query({url:url, width:300})
        .end((err, res)=>{
            res.should.have.status(200);
            done();
        });
    });

    it('exist URL & new size', done=>{
        chai.request(server)
        .get('/resize')
        .query({url:url, width:420})
        .end((err, res)=>{
            res.should.have.status(200);
            done();
        });
    });

    it('exist URL & exist size', done=>{
        chai.request(server)
        .get('/resize')
        .query({url:url, width:300})
        .end((err, res)=>{
            res.should.have.status(200);
            done();
        });
    });

    it('exist URL & no size-> expecting original size', done=>{
        chai.request(server)
        .get('/resize')
        .query({url:url})
        .end((err, res)=>{
            console.log(res.header);
            res.should.have.status(200);
            done();
        });
    });


})

})