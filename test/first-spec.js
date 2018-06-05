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






  })



});

