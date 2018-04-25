# Record Notification Feed  
Concept for notification feed for The National Archives. The system should be able to:

* Display records notified in the past 24 hours
* Display records updated recently
* Display records transferred to/from the building
* Allow users to sign up for notifications depending on a record department, taxonomy or according to their own defined keywords
  
Current technologies:  
  
* [NodeJS](http://nodejs.org/) - runtime engine  
* [express](https://www.npmjs.com/package/express) - handles HTTP requests and responses  
* [node-fetch](https://www.npmjs.com/package/node-fetch) - handles the fetching of the Discovery API as a JSON  
* [express-handlebars](https://www.npmjs.com/package/express-handlebars) - HTML templating engine  
* [cookie-parser](https://www.npmjs.com/package/cookie-parser) - enables signed cookies  
* [body-parser](https://www.npmjs.com/package/body-parser) - allows access to user inputs from forms  
* [passport](https://www.npmjs.com/package/passport) - user authentication  
* [flash](https://www.npmjs.com/package/flash) - allows us to display messages on the page via global variables  
* [bcrypt](https://www.npmjs.com/package/bcrypt) - password hashing  
* [express-validator](https://www.npmjs.com/package/express-validator) - easy form validation  
* [mongoDB](https://www.npmjs.com/package/mongodb) - storing of user data  
* [mongoose](https://www.npmjs.com/package/mongoose) - object schema tool for better data storage  
* [express-session](https://www.npmjs.com/package/express-session) - server side storage of user session  
* [nodemon](https://www.npmjs.com/package/nodemon) - auto reload the server after code changes  
* [nodemailer](https://www.npmjs.com/package/nodemailer) - send emails to users  
* [mssql](https://www.npmjs.com/package/mssql) - connects to a mssql database to pull record updates
    
Installation:  

1. Install NodeJS and MongoDB.
2. Call "npm install" in your terminal.
3. Call "mongod" in your terminal to run Mongo.
3. Call "nodemon" in your terminal to run the application on localhost:3000.  
4. Download FakeSMTP and listen on port 465 to view sent emails.
5. Download and install MSSQLExpress or MSSQL Developer.
6. Download Microsoft SQL Server Management Studio.
7. Open SQL Server Management Studio and connect to your server.
8. Enable TCP on the server. Enable Windows & SQL User Authentication.
9. Create a database called DiscoveryDB.
10. Create a table in the DB called MongoUpdates. Have at least one column called IAID.
11. Create a table in the DB called MongoUpdatesDol. Have at least one column called IAID.
12. Create a db_config.js file in the root of this project. Export variables for user, password, server and database.
Example db_config.js:

exports.user = "sa";
exports.pass = "SystemAdmin123";
exports.server = "MyPC\\SQLExpress";
exports.db = "DiscoveryDB";