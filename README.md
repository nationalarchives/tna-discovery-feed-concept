
# tna-discovery-feed-concept  
Concept for a discovery notification feed.  
  
Current technologies:  
  
* NodeJS - runtime engine  
* express - handles HTTP requests and responses  
* node-fetch - handles the fetching of the Discovery API as a JSON  
* express-handlebars - HTML templating engine  
* cookie-parser - enables signed cookies  
* body-parser - allows access to user inputs from forms  
* passport - user authentication  
* flash - allows us to display messages on the page via global variables  
* bcrypt - password hashing  
* express-validator - easy form validation  
* mongoDB - storing of user data  
* mongoose - object schema tool for better data storage  
* express-session  
* nodemon - auto reload the server after code changes  
* nodemailer - send emails to users  
* mssql - connects to a mssql database to pull record updates
  

Installation:  

1. Install NodeJS and MongoDB  
2. Call "npm install" in your terminal  
3. Call "mongod" in your terminal to run Mongo  
3. Call "nodemon" in your terminal to run the application on localhost:3000  
4. Download FakeSMTP and listen on port 465 to view sent emails
5. Download and install MSSQLExpress or MSSQL Developer.
6. Download Microsoft SQL Server Management Studio.
7. Open SQL Server Management Studio and connect to your server.
8. Enable TCP on the server
6. Create a database called DiscoveryDB