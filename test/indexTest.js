const assert = require('chai').assert;
//const sayHello = require('../index').sayHello;
//const addNumbers = require('../index').addNumbers;
const index = require('../index');

// chai-http and server access
var chai = require('chai');
var chaiHttp = require('chai-http');
var server = require('../index');
var should = chai.should();

chai.use(chaiHttp);

// Results
sayHelloResult = index.sayHello();
addNumbersResult = index.addNumbers(5, 5);

//roomsResult = index.rooms('test');
roomDataResult = index.roomData('test');
createPlayersResult = index.createPlayer('1', 'test', 'testName');

describe('Index', function(){

    // Test cases for sayHello function
    describe('sayHello()', function(){
        
        it('sayHello should return hello', function(){
            //let result = index.sayHello();
            assert.equal(sayHelloResult, 'hello');
        });
    
        it('sayHello should return type string', function(){
            //let result = index.sayHello();
            assert.typeOf(sayHelloResult, 'string');
        });

    });

    // Test cases for addNumbers function
   describe('addNumbers()', function(){

        it('addNumbers should be above 5', function(){
            //let result = index.addNumbers(5, 5);
            assert.isAbove(addNumbersResult, 5);
        });

        it('addNumbers should return type number', function(){
            //let result = index.addNumbers(5, 5);
            assert.typeOf(addNumbersResult, 'number');
        });

   });

   // Test cases for roomData
   describe('roomData()', function(){

        it('rooms exist', function(){
            assert.isOk(roomDataResult);
        });
   });

   // Test cases for createPlayer
   describe('createPlayer()', function(){

        it('player exists', function(){
            assert.isOk(createPlayersResult['test'].players['1']);
        });
   });

   // Test cases for GET as in app.get
   describe('Blobs', function() {
    it('should list ALL blobs on /blobs GET', function(done){
        chai.request(server)
        .get('/pages/login')
        .end(function(err, res){
            res.should.have.status(5000);
            done();
        });
    });
    it('should list a SINGLE blob on /blob/<id> GET');
    it('should add a SINGLE blob on /blobs POST');
    it('should update a SINGLE blob on /blob/<id> PUT');
    it('should delete a SINGLE blob on /blob/<id> DELETE');
  });

});