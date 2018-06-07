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
        .catch(function (error) {
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


  })

  const mongoose = require('mongoose');
  const Schema = mongoose.Schema;
  const department_subscriptions_data = require("../data/empty_department_subscriptions.json");
  const taxonomy_subscriptions_data = require("../data/empty_taxonomy_subscriptions.json");

  let User;
  describe('Database Testing', function () {

    before(function (done) {

      User = require('../models/user');

      const db = mongoose.connection;
      db.on('error', console.error.bind(console, 'connection error'));
      db.once('open', function () {
        console.log('DB connection successful');
        done();
      });
    });

    describe('Test mongo database', function () {

      it('should save a new user', function (done) {

        var newUser = new User({
          name: 'Ashley',
          email: 'test@nationalarchives.gov.uk',
          username: 'ash',
          password: '123',
          department_subscriptions: department_subscriptions_data,
          taxonomy_subscriptions: taxonomy_subscriptions_data,
          keyword_subscriptions: []
        });

        User.createUser(newUser, done);
      })


    })


  });

});

