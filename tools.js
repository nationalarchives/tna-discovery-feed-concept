exports.get_discovery_api_as_JSON = (yesterday_ISO_string, today_ISO_string, fetch) => {
   const url = `http://discovery.nationalarchives.gov.uk/API/search/records?sps.heldByCode=TNA&sps.recordOpeningFromDate=${yesterday_ISO_string}&sps.recordOpeningToDate=${today_ISO_string}&sps.searchQuery=*&sps.sortByOption=DATE_ASCENDING&sps.resultsPageSize=1000`;

  return fetch(url).then((response) => {
   return response.json();
  });

}
