/**
 * We declare here our nodejs server, that will produce the REST api and connect onto the MongoDB instance
 * @version 1.0
 * @since 1.0
 * @author Julien Roche
 * 
 * @see http://coenraets.org/blog/2012/10/creating-a-rest-api-using-node-js-express-and-mongodb/
 * @see http://mongodb.github.io/node-mongodb-native/
 */

console.log("Start to initialize our server");

// First, load required modules
var 
    /**
     * Express instance to have some tools to produce easily our REST api
     * @type {Express}
     */
    express = require("express"),
    
    /**
     * Mongo instance to communicate with the MongoDB instance
     * @type {MongoDB}
     */
    mongo = require('mongodb'),
    
    /**
     * Express application instance
     * @type {Application}
     */
    app = express(),
    
    /**
     * Instance for the Mongo Server
     * @type {MongoServer}
     */
    mongoServer = mongo.Server("localhost", 27017, { auto_reconnect: true }),
    
    /**
     * Instance for ou database
     */
    database = new mongo.Db("marsAttack", mongoServer, { w: 1 });
    
console.log("Open the database");
database.open(function(err){
    if(err){
        process.exit(1);
    }
    
    console.log("Database opened");
    console.log("Start to initialize our REST api");

    // REST api definition
    app.use(express.bodyParser()); // Set that we will use the Express parser (try to parse into JSON / form-url-encoded ...). See http://expressjs.com/api.html#bodyParser
    
    /**
     * Get a battle map
     */
    app.get("/maps/:id", function(req, res) {
        console.log("A request is done on /maps/:id");
        database.collection("maps", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }
            
            collection.find().toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                }
                
                res.send(items);
            });
        });
    });
    
    /**
     * Get all towers
     */
    app.get("/towers", function(req, res) {
        console.log("A request is done on /towers on GET");
        database.collection("towers", function(err, collection) {
            if(err){
                res.send(400);
                return;
            }
            
            collection.find({ }).toArray(function(err, items){
                if(err){
                    res.send(400);
                    return;
                }
                
                res.send(items);
            });
        });
    });
    
    /**
     * Put a new tower
     */
    app.put("/towers", function(req, res) {
        console.log("A request is done on /towers on PUT");
        
        if(!req.body) {
            res.send(400);
            return;
        }
        
        database.collection("towers", function(err, collection) {
            collection.insert(req.body, { safe:true }, function(err, result) {
                res.send(err ? 500 : result[0]);
            });
        });
    });
    
    /**
     * Update a tower
     */
    app.post("/towers/:id", function(req, res) {
        console.log("A request is done on /towers on POST");
        
        database.collection("towers", function(err, collection) {
            collection.update({ "_id": new mongo.BSONPure.ObjectID(id) }, req.body, { safe:true }, function(err, result) {
                res.send(err ? 500 : req.body);
            });
        });
    });
    
    /**
     * Remove a tower
     */
    app["delete"]("/towers/:id", function(req, res) {
        console.log("A request is done on /towers on DELETE");
        
        database.collection("towers", function(err, collection) {
            collection.remove({ "_id": new mongo.BSONPure.ObjectID(req.params.id) }, { safe:true }, function(err, result) {
                res.send(err ? 500 : req.body);
            });
        });
    });
    
    // And finally, run the server
    app.listen(8080);
    
    console.log("Server started on port 8080");
});
