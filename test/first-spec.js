let tools = require('../tools.js');
let data = require('./data.js');
let assert = require('assert');

describe("testing the discovery API", function () {

  describe("get_the_discovery_api_as_JSON()", function () {

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
          assert.ok(!json["mocked"]);
          done()
        })
        .catch((err) => {
          done(err)
        });

    })
  })
});

