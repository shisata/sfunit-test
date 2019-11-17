const assert = require('chai').assert;
//const sayHello = require('../index').sayHello;
//const addNumbers = require('../index').addNumbers;
const index = require('../index');

// Variables
var rooms = {};

// Results
sayHelloResult = index.sayHello();
addNumbersResult = index.addNumbers(5, 5);

//roomsResult = index.rooms('test');
roomDataResult = index.roomData('test')

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
            //assert.isOk(rooms['room']);
            //console.log(roomsResult);
        });
   });

});