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
testSpawnResult = index.testSpawn();

//roomsResult = index.rooms('test');

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

    //Test cases for addNumbers function
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

    //Test cases for roomData
    describe('roomData()', function(){
        roomDataResult = index.roomData('test');
        it('roomData() created a room object', function(){
            assert.isOk(roomDataResult);
        });
    });

    //Test cases for createRoom
    describe('createRoom()', function() {
        createRoomReusult = index.createRoom('createRoomTest');
        it('createRoom() created a room object with the correct name', 
        function() {
            assert.isOk(createRoomReusult['createRoomTest']);
        });
        createTwoRoomsReusult = index.createTwoRooms('twoRoom');
        it('createRoom() correctly handles a duplicate room request', 
        function() {
            assert.isOk(createRoomReusult['twoRoom']);
        });
    });

    //Test cases for createPlayer and createRoom
    describe('createPlayer()', function() {
        createPlayersResult = index.createPlayer('1', 'test', 'testName');
        it('createPlayer() created a player object with correct ID and room', 
        function(){
            assert.isOk(createPlayersResult['test'].players['1']);
        });
    });

    //Test cases for movePlayer
    describe('movePlayer()', function () {
        directions = {
            dataL: {"left" : true, "right" : false, "up" : false, "down" : false},
            dataR: {"left" : false, "right" : true, "up" : false, "down" : false},
            dataU: {"left" : false, "right" : false, "up" : true, "down" : false},
            dataD: {"left" : false, "right" : false, "up" : false, "down" : true},
            dataNE: {"left" : false, "right" : true, "up" : true, "down" : false},
            dataNW: {"left" : true, "right" : false, "up" : true, "down" : false},
            dataSE: {"left" : false, "right" : true, "up" : false, "down" : true},
            dataSW: {"left" : true, "right" : false, "up" : false, "down" : true},
            dataNS: {"left" : false, "right" : false, "up" : true, "down" : true},
            dataEW: {"left" : true, "right" : true, "up" : false, "down" : false}
        };
        index.createRoom("moveRoom");
        for (dir in directions) {
            // console.log(directions[dir])
            direction = directions[dir];
            mov = index.testMovePlayer("moveTest", "moveRoom", "GG", direction);
            start = mov.start;
            end = mov.end;
            speed = mov.speed;
            dx = 0; dy = 0;
            if (direction.left) {
                dx -= speed;
            }
            if (direction.right) {
                dx += speed;
            }
            if (direction.down) {
                dy += speed;
            }
            if (direction.up) {
                dy -= speed;
            }
            it(`movePlayer() ${dir} moved player from [${start}] to [${end}]`,
            function() {
                assert.isOk( (start[0]+dx == end[0]) && 
                             (start[1]+dy == end[1]) );
            });
        }
    });

   //Test cases for movePlayer
    describe('testCollision()', function () {
        collisionDirections = {
            left: {"left" : true, "right" : false, "up" : false, "down" : false},
            right: {"left" : false, "right" : true, "up" : false, "down" : false},
            up: {"left" : false, "right" : false, "up" : true, "down" : false},
        };
        for (dir in collisionDirections) {
            direction = collisionDirections[dir];
            result = index.testCollision(`${dir}Test`, `${dir}Room`, "BC", direction);
            it(`moved player ${dir} 200 units to successfully force collision`,
            function() {
                assert.isOk(result == true);
            });
        }
    });

    // Test cases for spawning Random enemies
    describe('testSpawn()', function(){

        it('testSpawn() exists', function(){
            assert.isOk(testSpawnResult);
        });

        it('testSpawn() is of type int', function(){
            assert.notTypeOf(testSpawnResult, 'string');
        });

        it('testSpawn() is atleast 1', function(){
            assert.equal(testSpawnResult, 1);
        });
    });



    // Test cases for GET as in home page
    describe('GET Home', () => {
        it('Should return found', (done) => {
            chai.request('http://localhost:5000')
                .get('/')
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    // Test cases for GET as in home page
    describe('GET register', () => {
        it('Should return found', (done) => {
            chai.request('http://localhost:5000')
                .get('/register')
                .end(function (err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
    });
    
    // // Test cases for POST as in check Account
    // describe('POST checkAccount, POST logout', () => {
    //     it('/checkAccount post request succesfully logs in user', function(done) {
    //         // chai.request('../index')
    //         chai.request('http://localhost:5000')
    //             .post('/checkAccount')
    //             .send({'username': 'ggiovani', 'password': '12345' })
    //             .end(function(err, res){
    //                 res.should.have.status(200);
    //                 done();
    //             });
    //     });
    //     it('/logout post request successfully logs out user', function(done) {
    //         chai.request('http://localhost:5000')
    //             .post('/logout')
    //             .send({'username': 'ggiovani'})
    //             .end(function(err, res){
    //                 res.should.have.status(200);
    //                 done();
    //             });
    //     });
    // });
});