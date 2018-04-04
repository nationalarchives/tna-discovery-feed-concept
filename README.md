
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
  

Installation:  

  
1. Install NodeJS and MongoDB  
2. Call "npm install" in your terminal  
3. Call "mongod" in your terminal to run Mongo  
3. Call "nodemon" in your terminal to run the application on localhost:3000  
4. Create an email_account.js in the project root. Paste the following and add data to the lets to send emails:  

    let host = 'smtp.example';  
    let port = 587;  
    let user = 'example@nationalarchives.gov.uk';  
    let pass = 'password';  
    let secure = false; //true for port 465 only  
          
    exports.host = host;  
    exports.port = port;  
    exports.user = user;  
    exports.pass = pass;  
    exports.secure = secure;
