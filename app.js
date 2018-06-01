/* Login system from https://www.youtube.com/watch?v=Z1ktxiqyiLA */
const express = require("express");

// BEGIN Login dependencies

const cookie_parser = require('cookie-parser');
const body_parser = require('body-parser');
const express_handlebars = require("express-handlebars");
const express_validator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const passport = require("passport");

// END Login dependencies

const index = require('./routes/index');
const users = require('./routes/users');
const feed_options = require('./routes/feed_options');
const data_route = require('./routes/data');

// Store variables & functions that need to be accessed by all JS files
const globals = require('./functions/globals');

const app = express();

const fetch = require("node-fetch");
const nodemailer = require("nodemailer");

//Config files not pushed to GitHub for security
const email_account = require("./email_account.js");
const db_config = require("./db_config.js");
const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const url = 'mongodb://localhost:27017/';
let db = undefined;

let transporter = nodemailer.createTransport({

    host: email_account.host,
    port: email_account.port,
    secure: email_account.secure, // true for 465, false for other ports
    auth: {
        user: email_account.user,
        pass: email_account.pass
    }
});

//Get full names of departments from their abbreviation
globals.department_full_names = require("./data/department_full_names.json");

// Prevent requesting Discovery API on every run while testing by creating offline copies of previously made requests.
globals.discovery_json = require("./data/discovery.json");
globals.updated_records = require("./data/updated_records.json");
globals.updated_record_departments = require("./data/updated_record_departments.json");
globals.updated_records_amount = 12192;

// view engine
app.set('views', __dirname + '/views');
app.engine('handlebars', express_handlebars({
    defaultLayout: 'layout',
    helpers: require('./functions/handlebar_helpers')
}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: true}));
app.use(cookie_parser());

// Static folder
app.use(express.static(__dirname + '/public'));

// Express session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Enable passport functions
app.use(passport.initialize());
app.use(passport.session());

// Enable validation
app.use(express_validator({
    errorFormatter: function (param, msg, value) {
        let namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Local variables available to the HTTP response;
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');

    // Passport's error message
    res.locals.error = req.flash('error');

    // To check if logged in
    res.locals.user = req.user || null;
    res.locals.url = req.protocol + "://" + req.get('host');

    next();
});


//From these entry point URL's, use the following js files for their routes
app.use('/', index);
app.use('/users', users);
app.use('/feed', feed_options);
app.use('/data', data_route);

app.listen(3000, function (error) {
    if (error) {
        handle_error(error);
    }
    else {
        console.log("Server started")

        /* get_discovery_api();

         // Run every 24 hours.
         setInterval(get_discovery_api, 86400000);*/

        globals.return_object = filter_JSON_data(globals.discovery_json);

    }

   // get_record_updates_MSSQL();

});

const sql = require('mssql');

async function get_record_updates_MSSQL() {
    try {

        await sql.connect(`mssql://${db_config.user}:${db_config.pass}@${db_config.server}/${db_config.db}`);
        const all_collection_records = await sql.query`select * from MongoUpdates`;
        const all_d_records = await sql.query`select * from MongoUpdatesDol`;

        const collection_records_sample = await sql.query`select top 100 * from MongoUpdates`;
        const d_records_sample = await sql.query`select top 1 * from MongoUpdatesDol`;

        globals.updated_records_amount = all_collection_records["recordset"].length + all_d_records["recordset"].length;

        let updated_records = {};
        let updated_record_departments = {};

        await Promise.all(d_records_sample["recordset"].map(async (current_database_row) => {
            let IAID = current_database_row["IAID"];

            await get_JSON_async("http://discovery.nationalarchives.gov.uk/API/records/v1/details/D" + IAID, (error, record) => {

                updated_records["D" + IAID] = {};
                updated_records["D" + IAID]["record"] = record["scopeContent"]["description"];

                let citable_reference = record["citableReference"].split(' ');
                let record_department = citable_reference[0];
                updated_records["D" + IAID]["department"] = record_department;

                if(!(record_department in updated_record_departments)){
                    updated_record_departments[record_department] = 0;
                }

                updated_record_departments[record_department]++;

            });
        }));

        await Promise.all(collection_records_sample["recordset"].map(async (current_database_row) => {
            let IAID = current_database_row["IAID"];

            await get_JSON_async("http://discovery.nationalarchives.gov.uk/API/records/v1/details/C" + IAID, (error, record) => {
                updated_records["C" + IAID] = {};
                updated_records["C" + IAID]["record"] = record["scopeContent"]["description"];

                let citable_reference = record["citableReference"].split(' ');
                let record_department = citable_reference[0];
                updated_records["C" + IAID]["department"] = record_department;


                if(!(record_department in updated_record_departments)){
                    updated_record_departments[record_department] = 0;
                }

                updated_record_departments[record_department]++;

            });

        }));

        globals.updated_records = updated_records;
        globals.updated_record_departments = updated_record_departments;

    } catch (err) {
        console.log(err);
    }
}

function handle_error(error) {
    console.log(error);
}

async function get_JSON_async(url, callback) {

    try {
        const http_response = await fetch(url);
        const return_json = await http_response.json();
        return callback(null, return_json);
    }
    catch (error) {
        return callback(error, null);
    }

}

async function get_discovery_api() {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    globals.next_update = tomorrow;

    //ISO date strings are needed to get todays and yesterdays dates, to display opened records for the previous 24 hours
    let today = new Date();
    let today_ISO_string = today.toISOString().substring(0, 10);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterday_ISO_string = yesterday.toISOString().substring(0, 10);

    const url = `http://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.recordOpeningFromDate=${yesterday_ISO_string}&sps.recordOpeningToDate=${today_ISO_string}&sps.searchQuery=*&sps.sortByOption=DATE_ASCENDING&sps.resultsPageSize=1000`;

    await get_JSON_async(url, function (error, return_json) {
        if (error) {
            handle_error(error);
        }
        else {
            globals.return_object = filter_JSON_data(return_json);
        }

    })

}

function filter_JSON_data(the_json) {

    let places = {};
    let records = {};

    // For each record, push it to the next index in a new object and map it's title, desc, context to the new object.
    the_json["records"].forEach(function (data) {

        records[Object.keys(records).length] = {
            title: data.title,
            description: data.description,
            context: data.context // Different to the record title, usually contains more info about the record.
        };

        data["places"].forEach(function (place) {
            // Some entries have are whitespace, so check if the string still exists after trimmed.
            if (place.trim()) {

                // If place already exists in object, increment by 1, else add it to the object with value of 1.
                if (place in places) {
                    places[place]++;
                }
                else {
                    places[place] = 1;
                }
            }

        });

    });


    // Get every department and map it's count to this object
    let departments = {};
    the_json["departments"].forEach(function (department) {

        // Example output: departments["WO"] = 5 means 5 records opened in the War Office.
        departments[department["code"]] = department["count"];
    });

    return {
        count: the_json["count"], // Amount of records in total
        departments,
        taxonomies: the_json["taxonomySubjects"],
        time_periods: the_json["timePeriods"],
        places,
        records
    };
}

MongoClient.connect(url, function (error, client) {

    // Connect to database
    db = client.db("discovery_feed_login");

    if (error) {
        handle_error(error);
    }
    else {
        send_notifications(db.collection('users'));
    }

    client.close();
});


async function send_notifications(discovery_feed_users) {

    // Map global variables to local variables to improve readability
    let discovery_json_records_count = globals.return_object["count"];
    let discovery_json_records = globals.return_object["records"];
    let discovery_json_departments = globals.return_object["departments"];
    let discovery_department_fullnames = globals.department_full_names;
    let record_updates = globals.updated_records;
    let record_updates_count = globals.updated_records_amount;

    // For each user, create an email for them
    discovery_feed_users.find({}).forEach((user) => {

        // Get the departments and keywords they have subscribed to
        let users_departments = user["department_subscriptions"];
        let users_keywords = user["keyword_subscriptions"];

        // Create an array where each line on the email will be stored.
        let email_data = [];


        Object.keys(users_departments).forEach((department_abbreviation) => {

            // Check if records have been opened in the last 24 hours.
            if (discovery_json_records_count > 0) {

                // If one of the departments has a record opened in the last 24hr, continue
                if (department_abbreviation in discovery_json_departments) {

                    // If the user is subscribed to that record, add the information to the email
                    if (users_departments[department_abbreviation]) {

                        // Example output: "11 records regarding the War Office." because discovery_json_departments looks like {"WO" : 11, "RAIL" : 5 } etc.
                        email_data.push(`${discovery_json_departments[department_abbreviation]} records regarding the ${discovery_department_fullnames[department_abbreviation]}.`);
                    }
                }
            }
        });

        // Track records that match the users keywords using an object. This way we can track the amount of times the keyword has been mentioned, as well as all the titles of the records.
        let user_keyword_opening_matches = {};
        let user_keyword_update_matches = {};

        users_keywords.forEach(function (current_user_keyword) {
            current_user_keyword = current_user_keyword.toLowerCase();

            if (discovery_json_records_count > 0) {

                for (let record in discovery_json_records) {

                    let title = discovery_json_records[record]["title"].toLowerCase();
                    let description = discovery_json_records[record]["description"].toLowerCase();

                    if (description.includes(current_user_keyword) || title.includes(current_user_keyword)) {

                        if (!(current_user_keyword in user_keyword_opening_matches)) {
                            user_keyword_opening_matches[current_user_keyword] = {};
                            user_keyword_opening_matches[current_user_keyword]["count"] = 0;
                            user_keyword_opening_matches[current_user_keyword]["titles"] = [];
                        }

                        user_keyword_opening_matches[current_user_keyword]["count"]++;
                        user_keyword_opening_matches[current_user_keyword]["titles"].push(`${title} <ul><li>${description}</li></ul>`);
                    }

                }
            }

            if(record_updates_count > 0) {

                for(let index in record_updates) {
                    let record_description = record_updates[index]["record"].toLowerCase();

                    if(record_description.includes(current_user_keyword)) {
                        if( !(current_user_keyword in user_keyword_update_matches)){
                            user_keyword_update_matches[current_user_keyword] = {};
                            user_keyword_update_matches[current_user_keyword]["count"] = 0;
                            user_keyword_update_matches[current_user_keyword]["titles"] = [];
                        }

                        user_keyword_update_matches[current_user_keyword]["count"]++;
                        user_keyword_update_matches[current_user_keyword]["titles"].push(record_description);

                    }
                }
            }
        });

        Object.keys(user_keyword_opening_matches).forEach(function (keyword) {
            email_data.push(`${user_keyword_opening_matches[keyword]["count"]} opened records matching your keyword, "${keyword}".`);
        });

        Object.keys(user_keyword_update_matches).forEach(function (keyword) {
            email_data.push(`${user_keyword_update_matches[keyword]["count"]} records updated matching your keyword, "${keyword}".`);
        });

        if (email_data.length > 1) {
            let message = `Hello, ${user.name}. Here are the latest record openings you are subscribed to:`;

            message += '<ul>';
            email_data.map(function (string) {
                message += `<li>${string}</li>`;
            });
            message += '</ul>';

            let mailOptions = {
                from: '"Discovery Feed" <test@localhost>', // sender address
                to: user.email, // list of receivers
                subject: `Discovery Feed: New updates for ${user.username}`, // Subject line
                html: message // html body
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return handle_error(error);
                }
                console.log('Message sent: %s', info.messageId);
                // Preview only available when sending through an Ethereal account
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            });
        }

    })
}
