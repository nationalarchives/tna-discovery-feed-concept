let tools = require('../tools.js');
let data = require('./data.js');
let assert = require('assert');

describe("testing the discovery API", function () {

  describe("get and filter the discovery JSON", function () {

    before(function () {
      let fetch = require('node-fetch');
      let fetch_mock = require('fetch-mock');
      fetch_mock.get('*', data.discovery);
    });

    it('should get the discovery api JSON', function (done) {


      let today = new Date();
      let today_ISO_string = today.toISOString().substring(0, 10);

      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      let yesterday_ISO_string = yesterday.toISOString().substring(0, 10);

      tools.get_discovery_api_as_JSON(yesterday_ISO_string, today_ISO_string, fetch)
        .then(function (json) {
          assert.ok(json["mocked"]);

          done();
        })
        .catch( function (error){
          done(error);
        });

    });

      it('should filter the discovery api JSON', function (done) {
          let mocked_json = JSON.parse(data.discovery);
          let filtered_json = tools.filter_JSON_data(mocked_json);
          assert.ok("records" in filtered_json, "no records in the filtered json");
          assert.ok("places" in filtered_json, "no places in the filtered json");
          assert.ok("count" in filtered_json, "no count in the filtered json");
          assert.ok("taxonomies" in filtered_json, "no taxonomies in the filtered json");
          assert.ok("time_periods" in filtered_json, "no time_periods in the filtered json");
          assert.equal(filtered_json["count"], 24);
          done();
      });


      const mongoose = require('mongoose');
      const Schema = mongoose.Schema;
      const user_schema = new Schema({
      name: {type: String},
      email: {type: String},
      username:{type: String},
      password: {type: String},
      department_subscriptions: require("../data/empty_department_subscriptions.json"),
      taxonomy_subscriptions: require("../data/empty_taxonomy_subscriptions.json"),
      keyword_subscriptions: []
    })
    const User = mongoose.model('User', user_schema);

      describe('Database Testing', function () {

        before(function (done) {

          mongoose.connect('mongodb://localhost/notification_feed_test_db');

          const db = mongoose.connection;
          db.on('error', console.error.bind(console, 'connection error'));
          db.once('open', function () {
            console.log('DB connection successful');
            done();
          });
        });

        describe('Test mongo database', function () {

          it('should save a new user', function (done) {
            var test_user = User({
              name: 'unit test'
            });

            test_user.save(done);

          })

        })


      });





  })



});

