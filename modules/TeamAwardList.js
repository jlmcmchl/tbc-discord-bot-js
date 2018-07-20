const AbstractModule = require('./AbstractModule');
const TBAPI = require('../lib/tba-api-v3');
const async = require('async');
const fs = require('fs');
const req = require('superagent');



var resource = team => `https://es01.usfirst.org/teams_v2/team/_search?source={"query":{"bool":{"must":[{"term":{"team_number_yearly":${team}}},{"term":{"profile_year":2018}},{"term":{"team_type":"FRC"}}]}}}&_source=awards.award,awards.eventcode_cache,awards.event_season`;



class TeamAwardList extends AbstractModule {
  constructor() {
    super();

    this.tbapi = new TBAPI(process.env.XTBAAUTHKEY || '');
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
    var teams = [];

    async.map(
      [...Array(15).keys()], 
      (i, callback) => this.tbapi.Teams(2018, i, 'keys', callback),
      (err, res) => {
        res.map(teams => fs.appendFileSync('teams.csv', `${teams.join('\n')}\n`));
        console.log('Done!');
      });

    /*
    // Teams registered for more than 2 in-district events
    this.tbapi.Districts(2018, (err, res) => {
      var districts = res.reduce((agg, district) => { agg[district.key] = {key: district.key}; return agg; }, {});

      async.parallel([
        (cb) => async.map(
          districts, 
          (district, callback) => {
            this.tbapi.DistrictTeams(district.key, 'keys', (err, res) => { console.log(district.key); districts[district.key].teams = res; callback(err, res); });
          },
          cb
        ),
        (cb) => async.map(
          districts,
          (district, callback) => {
            this.tbapi.DistrictEvents(district.key, 'keys', (err, res) => { console.log(district.key); districts[district.key].events = res; callback(err, res); });
          },
          cb
        )],
        (err,res) => async.map(
          districts, 
          (district, callback) => 
            async.map(district.teams, (team, callback) =>
              this.tbapi.TeamEvents(team.substring(3), 2018, 'keys', (err, res) => {
                  if (2 < res.length) {
                    console.log(team + " is attending " + res);
                  } 
                }))));
    });*/

    /* Team Outside Home-District Events 2018
    
    this.tbapi.Districts(2018, (err, res) => {
      var districts = res.reduce((agg, district) => { agg[district.key] = {key: district.key}; return agg; }, {});
      console.log(districts);

      async.parallel([
        (cb) => async.map(
          res, 
          (district, callback) => {
            this.tbapi.DistrictTeams(district.key, 'keys', (err, res) => { console.log(district.key); districts[district.key].teams = res; callback(err, res); });
          },
          cb
        ),
        (cb) => async.map(
          res,
          (district, callback) => {
            this.tbapi.DistrictEvents(district.key, 'keys', (err, res) => { console.log(district.key); districts[district.key].events = res; callback(err, res); });
          },
          cb
        )],
        (err,res) => async.map(
          districts, 
          (district, callback) => 
            async.map(district.teams, (team, callback) =>
              this.tbapi.TeamEvents(team.substring(3), 2018, 'keys', (err, res) => {
                res.map(key => {
                  if (!district.events.includes(key)) {
                    console.log(team + " is attending " + key);
                  }
                });
              }))));
    });*/


    /* Team Awards 2014 - 2017
    
    fs.readFile('./teams.txt', 'utf8', (err, data) => {
      var team = /(\d+)/g;
      var keys = [];

      var key;
      while (key = team.exec(data)) {
        keys.push(key[1]);
      }

      async.mapLimit(keys, 5, (nTeam, callback) => {
        req.get(resource(nTeam))
        .set({ 'Content-Type': 'application/json' })
        .end((err, res) => {
          console.log(nTeam);
          if (err) callback(err);

          var team = {"team": nTeam, "years": {"2014": {}, "2015": {}, "2016": {}, "2017": {}}}
          if (res.body.hits.hits[0]) {
            var awards = res.body.hits.hits[0]._source.awards;
            awards.map(award => {
              if (!["2014", "2015", "2016", "2017"].includes(award.event_season)) return;
              if (!team.years[award.event_season][award.eventcode_cache]) team.years[award.event_season][award.eventcode_cache] = [];
              team.years[award.event_season][award.eventcode_cache].push(award.award);
            });
          }
          callback(err, team);
        });
      }, (err, res) => {
        if (err) console.log(err);

        var teams = {}
        res.map(team => {
          teams[team.team] = team.years;
        });

        fs.writeFile('./teamAwards.tsv', 'Team\t2014\t2015\t2016\t2017\n', console.log);
        async.map(Object.keys(teams), (team, callback) => {
          var awards = {'2014':[], '2015':[], '2016':[], '2017':[]}
          Object.keys(teams[team]).map(year => {
            awards[year] = Object.keys(teams[team][year]).reduce((acc, event) => {
              acc.push(`${event}: ${teams[team][year][event].join(',')}`);
              return acc;
            }, []);
          });
          console.log(team, awards['2014'].join(', '));
          fs.appendFile('./teamAwards.tsv', `${team}\t${awards['2014'].join(', ')}\t${awards['2015'].join(', ')}\t${awards['2016'].join(', ')}\t${awards['2017'].join(', ')}\n`, () => {});
        });
      });
    });*/
  }
}

module.exports = TeamAwardList;