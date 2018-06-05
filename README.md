# Record Notification Feed  
Concept for notification feed for The National Archives. The system should be able to:

* Display records opened in the past 24 hours
* Display records updated recently (e.g. description changes)
* Display records transferred to the building that are now available to the public
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
* [mocha](https://www.npmjs.com/package/mocha) - unit testing
* assert - built in node assertion library

This project uses EditorConfig to standardize text editor configuration. http://editorconfig.org
    
Installation:  

1. Install NodeJS and MongoDB.
2. Call "npm install" in your terminal.
3. Install mocha globally by calling "npm i -g mocha"
4. Download and install MongoDB to your computer.
5. Download FakeSMTP and listen on port 465 to view sent emails.
6. Download and install MSSQLExpress or MSSQL Developer.
7. Download Microsoft SQL Server Management Studio.
8. Open SQL Server Management Studio and connect to your server.
9. Enable TCP on the server. Enable Windows & SQL User Authentication.
10. Create a database called DiscoveryDB.
11. Create a table in the DB called MongoUpdates. Have at least one column called IAID.
12. Create a table in the DB called MongoUpdatesDol. Have at least one column called IAID.
13. Create a db_config.js file in the root of this project. Export variables for user, password, server and database.
Example db_config.js:

exports.user = "sa";
exports.pass = "SystemAdmin123";
exports.server = "MyPC\\SQLExpress";
exports.db = "DiscoveryDB";

14. Call "mocha" to run unit tests.
15. Call "mongod" in your terminal to run Mongo. You cannot run step 15 without this being called first.
16. Call "nodemon" in your terminal to run the application on localhost:3000.  