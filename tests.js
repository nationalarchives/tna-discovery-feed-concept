const assert = require("assert");

module.exports.test_filtered_json = (filtered_json) => {
    this.is_JSON(filtered_json);
    assert.ok("count" in filtered_json);
    assert.ok("departments" in filtered_json);
    assert.ok("taxonomies" in filtered_json);
    assert.ok("time_periods" in filtered_json);
    assert.ok("places" in filtered_json);
    assert.ok("records" in filtered_json);
}

module.exports.is_JSON = (json) => {
    assert.ok(typeof json === 'object');
}

module.exports.test_discovery_json = (discovery_json) => {
    this.is_JSON(discovery_json);
    assert.ok("count" in discovery_json);
    assert.ok("records" in discovery_json);
    assert.ok("taxonomySubjects" in discovery_json);
    assert.ok("timePeriods" in discovery_json);
    assert.ok("departments" in discovery_json);
    assert.ok("catalogueLevels" in discovery_json);
    assert.ok("sources" in discovery_json);
    assert.ok("repositories" in discovery_json);
    assert.ok("heldByReps" in discovery_json);
    assert.ok("referenceFirstLetters" in discovery_json);
    assert.ok("titleFirstLetters" in discovery_json);
    assert.ok("nextBatchMark" in discovery_json);
}