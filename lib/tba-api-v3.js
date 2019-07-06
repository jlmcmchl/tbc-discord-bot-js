const req = require('superagent');
const Throttle = require('superagent-throttle');

let throttle = new Throttle({
  active: true,
  rate: 4,
  ratePer: 1000,
  concurrent: 1
});

const isDefined = variable => (typeof variable !== 'undefined' && variable !== null);

// you have to set a header in order to get the request methods
class initTBA {

  constructor(token) {
    // all TBA API v2 requests go to this root uri
    this.ROOT_URL = 'https://www.thebluealliance.com/api/v3';
    this.headers = { 'X-TBA-Auth-Key': null };
    // set header or throw error
    if (isDefined(token)) {
      this.headers['X-TBA-Auth-Key'] = token;
    } else {
      return new Error('can not set header with null or undefined values');
    }
  }

  /*********************************************
  ************** Helper Functions **************
  **********************************************/

  // MVF - Most Valuable Function! in library
  // sends a request to the given url and then calls the callback
  tbaRequest(url, callback) {
    callback = callback || function (err, info) { console.log(err, info); }; // safety

    url = url.replace(/\/\//, '/'); // replaced for missing inputs
    url = url.replace(/\/$/, ''); // remove end /

    req.get(this.ROOT_URL + url)
      .use(throttle.plugin())
      .set(this.headers)
      .end((err, res) => { if (err) console.error(err); else callback(err, res.body) });
  }


  /*********************************************
  ************* TBA Library Methods ************
  **********************************************/

  // /district/{district_key}/events/(/(keys|simple))?
  DistrictEvents(district_key, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/district/${district_key}/events/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /district/{district_key}/rankings
  DistrictRankings(district_key, callback) {
    // Argument validation

    var url = `/district/${district_key}/rankings`;
    this.tbaRequest(url, callback);
  }

  // /district/{district_key}/teams/(/(keys|simple))?
  DistrictTeams(district_key, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/district/${district_key}/teams/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /districts/{year}
  Districts(year, callback) {
    // Argument validation

    var url = `/districts/${year}`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}(/simple)?
  Event(event_key, mode, callback) { // restricted to simple
    // Argument validation
    mode = mode == 'simple' ? mode : '';

    var url = `/event/${event_key}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/alliances
  EventAlliances(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/alliances`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/awards
  EventAwards(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/awards`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/district_points
  EventDistrictPoints(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/district_points`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/insights
  EventInsights(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/insights`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/matches/(/(keys|simple))?
  EventMatches(event_key, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/event/${event_key}/matches/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/oprs
  EventOprs(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/oprs`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/predictions
  EventPredictions(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/predictions`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/rankings
  EventRankings(event_key, callback) {
    // Argument validation

    var url = `/event/${event_key}/rankings`;
    this.tbaRequest(url, callback);
  }

  // /event/{event_key}/teams(/(keys|simple))?
  EventTeams(event_key, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/event/${event_key}/teams/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /events/{year}/(keys|simple)?
  Events(year, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/events/${year}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /match/{match_key}(/simple)?
  Match(match_key, mode, callback) { // restricted to simple
    // Argument validation
    mode = mode == 'simple' ? mode : '';

    var url = `/match/${match_key}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /status
  Status(callback) {
    // Argument validation

    var url = `/status`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}(/simple)?
  Team(team_key, mode, callback) { // restricted to simple
    // Argument validation
    mode = mode == 'simple' ? mode : '';

    var url = `/team/frc${team_key}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/awards(/{year})?
  TeamAwards(team_key, year, callback) {
    // Argument validation
    year = year || '';

    var url = `/team/${team_key}/awards/${year}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/districts
  TeamDistricts(team_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/districts`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/event/{event_key}/awards
  TeamEventAwards(team_key, event_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/event/${event_key}/awards`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/event/{event_key}/matches(/(keys|simple))?
  TeamEventMatches(team_key, event_key, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/team/frc${team_key}/event/${event_key}/matches/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/event/{event_key}/status
  TeamEventStatus(team_key, event_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/event/${event_key}/status`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/events(/{year})?(/(keys|simple))?
  TeamEvents(team_key, year, mode, callback) {
    // Argument validation
    year = year || '';
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/team/frc${team_key}/events/${year}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/matches/{year}(/(keys|simple))?
  TeamMatches(team_key, year, mode, callback) {
    // Argument validation
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/team/frc${team_key}/matches/${year}/${mode}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/media/{year}
  TeamMedia(team_key, year, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/media/${year}`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/robots
  TeamRobots(team_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/robots`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/social_media
  TeamSocialMedia(team_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/social_media`;
    this.tbaRequest(url, callback);
  }

  // /team/{team_key}/years_participated
  TeamYearsParticipated(team_key, callback) {
    // Argument validation

    var url = `/team/frc${team_key}/years_participated`;
    this.tbaRequest(url, callback);
  }

  // /teams(/{year})?/{page_num}(/(keys|simple))?
  Teams(year, page_num, mode, callback) {
    // Argument validation
    year = year || '';
    mode = mode == 'simple' || mode == 'keys' ? mode : '';

    var url = `/teams/${year}/${page_num}/${mode}`;
    this.tbaRequest(url, callback);
  }
};

module.exports = initTBA;