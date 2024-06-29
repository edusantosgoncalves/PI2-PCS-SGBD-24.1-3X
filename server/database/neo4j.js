require("dotenv").config();
let neo4j = require("neo4j-driver");
const URI = "neo4j://localhost";
const USER = process.env.NEO4J_USER;
const PASSWORD = process.env.NEO4J_PWD;

let driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
/*const driver = (async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  
  let driver;

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));
    const serverInfo = await driver.getServerInfo();
    console.log("Connection established");
    console.log(serverInfo);
    return driver;
  } catch (err) {
    throw new Error(`Connection error\n${err}\nCause: ${err.cause}`);
    //console.log(`Connection error\n${err}\nCause: ${err.cause}`);
  }
})();*/

module.exports = driver;
