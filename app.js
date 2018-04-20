/* Login system from https://www.youtube.com/watch?v=Z1ktxiqyiLA */
const assert = require('assert');
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

const globals = require('./functions/globals');
const app = express();

const fetch = require("node-fetch");
const nodemailer = require("nodemailer");
const email_account = require("./email_account.js");
const tests = require("./tests");


let transporter = nodemailer.createTransport({

    host: email_account.host,
    port: email_account.port,
    secure: email_account.secure, // true for 465, false for other ports
    auth: {
        user: email_account.user,
        pass: email_account.pass
    }
});


globals.departments_json = require("./data/departments.json");
globals.discovery_json = require("./data/discovery.json");

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

app.use(passport.initialize());
app.use(passport.session());

app.use(express_validator({
    errorFormatter: function (param, msg, value) {
        var namespace = param.split('.'),
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
app.use('/users', users)
app.use('/feed', feed_options)
app.use('/data', data_route);

app.set('port', 3000);

app.listen(app.get('port'), function (error) {
    if (error) {
        handle_error(error);
    }
    else {
        console.log("Server started")

        /* get_discovery_api();

         // Run every 24 hours.
         setInterval(get_discovery_api, 86400000);*/

        tests.test_discovery_json(globals.discovery_json);

        globals.return_object = filter_JSON_data(globals.discovery_json);

        tests.test_filtered_json(globals.return_object);

    }

})

function handle_error(error) {
    console.log(error);
}

async function get_JSON_async(url, callback) {
    const get_JSON = async url => {
        try {
            const http_response = await fetch(url);
            const return_json = await http_response.json();
            assert.ok(typeof return_json === 'object');
            return callback(null, return_json);
        }
        catch (error) {
            return callback(error, null);
        }
    }
    get_JSON(url);
}

function get_discovery_api() {

    let tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    globals.next_update = tomorrow;

    //ISO date strings are needed to get todays and yesterdays dates, for the previous 24 hours
    let today = new Date();
    let today_ISO_string = today.toISOString().substring(0, 10);

    let yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    let yesterday_ISO_string = yesterday.toISOString().substring(0, 10);

    const url = `http://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.recordOpeningFromDate=${yesterday_ISO_string}&sps.recordOpeningToDate=${today_ISO_string}&sps.searchQuery=*&sps.sortByOption=DATE_ASCENDING&sps.resultsPageSize=1000`

    get_JSON_async(url, function (error, return_json) {
        if (error) {
            handle_error(error);
        }
        else {
            globals.return_object = filter_JSON_data(return_json);
        }

    })

}

function filter_JSON_data(the_json) {

    let places = {}
    let records = {};

    the_json["records"].forEach(function (data) {


        records[Object.keys(records).length] = {
            title: data.title,
            description: data.description,
            context: data.context
        };

        data["places"].forEach(function (place) {

            // Some entries have are just whitespace, so check if the string still exists after trimmed.
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

    let departments = {};
    the_json["departments"].forEach(function (data) {
        departments[data["code"]] = data["count"];
    })

    return {
        count: the_json["count"],
        departments: departments,
        taxonomies: the_json["taxonomySubjects"],
        time_periods: the_json["timePeriods"],
        places,
        records
    };
}

const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;
const url = 'mongodb://localhost:27017/';
let db, discovery_feed_users = undefined;

MongoClient.connect(url, function (error, client) {

    db = client.db("discovery_feed_login");

    if (error) {
        handle_error(error);
    }
    else {
        discovery_feed_users = db.collection('users');
        send_notifications();
    }

    client.close();
})

async function send_notifications() {

    let discovery_json_records_count = globals.return_object["count"];

    let discovery_json_records = globals.return_object["records"];
    let discovery_json_departments = globals.return_object["departments"];
    let discovery_department_fullnames = globals.departments_json;

    discovery_feed_users.find({}).forEach((user) => {

        let users_departments = user["department_subscriptions"];
        let users_keywords = user["keyword_subscriptions"];

        let email_data = [];

            Object.keys(users_departments).forEach((department_abbreviation) => {

                if (discovery_json_records_count > 0) {

                    if (department_abbreviation in discovery_json_departments) {

                        if (users_departments[department_abbreviation]) {
                            // Example output: "11 records regarding the War Office."
                            email_data.push(`${discovery_json_departments[department_abbreviation]} records regarding the ${discovery_department_fullnames[department_abbreviation]}.`);
                        }
                    }
                }
            });

        // Track records that match the users keywords
        let user_keyword_tracker = {}

        users_keywords.forEach(function (current_user_keyword) {
            current_user_keyword = current_user_keyword.toLowerCase();

            if (discovery_json_records_count > 0) {

                for (let record in discovery_json_records) {

                    let title = discovery_json_records[record]["title"].toLowerCase();
                    let description = discovery_json_records[record]["description"].toLowerCase();

                    if (description.includes(current_user_keyword) || title.includes(current_user_keyword)) {

                        if (!(current_user_keyword in user_keyword_tracker)) {
                            user_keyword_tracker[current_user_keyword] = {};
                            user_keyword_tracker[current_user_keyword]["count"] = 0;
                            user_keyword_tracker[current_user_keyword]["titles"] = [];
                        }

                        user_keyword_tracker[current_user_keyword]["count"]++;
                        user_keyword_tracker[current_user_keyword]["titles"].push(`${title} <ul><li>${description}</li></ul>`);
                    }

                }
            }

        });



        Object.keys(user_keyword_tracker).forEach(function (keyword) {
            email_data.push(`${user_keyword_tracker[keyword]["count"]} keyword matches for your keyword, "${keyword}".`);
        })

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

