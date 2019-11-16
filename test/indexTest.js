const assert = require('chai').assert;
const sayHello = require('../index').sayHello;
const addNumbers = require('../index').addNumbers;
//const index = require('../index');

describe('Index', function(){
    it('sayHello should return hello', function(){
        let result = sayHello();
        assert.equal(result, 'hello');
    });

    it('sayHello should return type string', function(){
        let result = sayHello();
        assert.typeOf(result, 'string');
    });

    it('addNumbers should be above 5', function(){
        let result = addNumbers(5, 5);
        assert.isAbove(result, 5);
    });

    it('addNumbers should return type number', function(){
        let result = addNumbers(5, 5);
        assert.typeOf(result, 'number');
    });
});