const assert = require('chai').assert;
const sayHello = require('../index').sayHello;
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
});