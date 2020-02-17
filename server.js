/*
Project Caitlin Calendar API v.02
---------------------------------------------------------------------------------

Jan 12, 2020:
Alpha stages, we can grab data from google calendar API
to site and also submit a small event. Also we are able to display
a crude calendar currently

Jan 14, 2020:
The Month calendar is showing decent.

Bugs
-----------
1.For the events, if the event we are current looking at doesn't have
a time, it will mess up the calendar display.
*/

var express = require("express");
var app = express();
app.use(express.static(__dirname + '/public'));
var bodyParser = require("body-parser"); //body-parser is use to capture req parameters
app.use(bodyParser.json()); // <--- Here
app.use(bodyParser.urlencoded({ extended: true })); //for body parser to parse correctly

app.set("view engine", "ejs");
//start of google calendar API stuff
const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');
var calenAuth = null, calendar = null;
var calendarID = 'iodevcalendar@gmail.com';  //Change here for some else's calendar
//Required code for any of the above to work
// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/calendar'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
setUpAuth(); //sets all the necessary authentication and vars "calenAuth", and "calendar"
//end of calendar API stuff


// Jerms Code :
/////////
/////////
/////////


const admin = require('firebase-admin');
var serviceAccount = require('./ServiceAccountKey.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
var db = admin.firestore();


app.get("/firebaseGet", function(req, result){
  console.log("FB GET ROUTE")

  result.send("FB GET ROUTE");
})


//End of Jerms code
/////////
/////////
/////////
/////////
/////////





/*
fullCalByInterval:
Given start and end parameters from request, it will return all events from
the google calendar BUT convert it to the format that is accepted by Full Calendar

*/
app.get("/fullCalByInterval", function (req, result) {
  console.log('server get fullCalByInterval')
  // console.log("passed in params start date "  + req.query.start);
  // console.log("passed in params end date"  + req.query.end);
  // result.json({result: "We have sucessfully sent back "});

  if (!req.query.start || !req.query.end) {
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  else {
    var startParam = new Date(req.query.start);
    var endParam = new Date(req.query.end);
    console.log("start : ", startParam, " end:", endParam);
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
  }
  calendar.events.list({
    calendarId: calendarID,
    timeMin: startParam.toISOString(),
    timeMax: endParam.toISOString(),
    maxResults: 999,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    //CallBack
    if (err) {
      return result.send('The post request returned an error: ' + err);
    }

    var A = [] //The resultant Array
    var B = res.data.items;

    for (let i = 0; i < B.length; i++) {
      if (B[i].start.date == null) {
        var temp = {
          id: B[i].id,
          title: B[i].summary,
          start: B[i].start.dateTime,
          end: B[i].end.dateTime
        }
      }
      else {
        var start0 = new Date(B[i].start.date);
        var end0 = new Date(B[i].start.date);
        start0.setHours(0, 0, 0, 0);
        end0.setHours(23, 59, 59, 59);
        var temp = {
          id: B[i].id,
          allDay: true,
          title: B[i].summary,
          start: start0,
          end: end0
        }
      }
      A.push(temp)
    }
    // result.json(res.data.items);
    result.send(A);
  })
}
);

//Landing Page
/*
The below does a query to the google calendar API and gets all the events of the current
month and then renders them On the month template
*/
app.get("/", function (req, result) {
  var date = new Date();
  var firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  var lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  calendar.events.list({
    calendarId: calendarID,
    timeMin: firstDayOfMonth.toISOString(),
    timeMax: lastDayOfMonth.toISOString(),
    maxResults: 999,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    //CallBack
    if (err) return console.log('The API returned an error: ' + err);
    events = res.data.items;
    result.render("month", { events: events });
  });
}
);


/*
TEST FUNCTION
This function below is just to test whether our
get requests previously worked will need to be deleted
in the future.
example for getting all the data for the month
http://localhost:5000/getmonth?foo1=bar1&foo2=bar2
*/
app.get("/getMonth", function (req, result) {
  console.log("passed in params " + req.query.ID);
  result.json({ result: "recieved" });
}
);



/*
*
*
*
getEventsByInterval:
There are two of the same functions here, I just haven't to decide
whether to use the post or get. They are essentially the same but
post is in a way more secure because the user can't see how the
data is retrieve.
*
*
*
*/
app.get("/getEventsByInterval", function (req, result) {

  // console.log("passed in params start date "  + req.query.start);
  // console.log("passed in params end date"  + req.query.end);

  if (!req.query.start || !req.query.end) {
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  else {
    var startParam = new Date(req.query.start);
    var endParam = new Date(req.query.end);
    console.log("start : ", startParam, " end:", endParam);
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
  }
  calendar.events.list({
    calendarId: calendarID,
    timeMin: startParam.toISOString(),
    timeMax: endParam.toISOString(),
    maxResults: 999,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    //CallBack
    if (err) {
      return result.send('The post request returned an error: ' + err);
    }
    result.json(res.data.items);
  })
})



/*
Delete later, temp is a sample template to use for a calendar
*/
app.get("/temp", function (req, result) {
  result.render("temp");
})


/*
Delete ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.post("/deleteEvent", function (req, result) {
  console.log(req.body.ID);
  calendar.events.delete({calendarId: calendarID, eventId: req.body.ID}, req.body.ID
    , (err, res) => {
    //CallBack
    if (err) {
      return result.send('The post request returned an error: ' + err);
    }
    result.send("delete");
  })
})


/*
getEventsByInterval:
given a start and a end date from req, it will query those In the
google calendar and return events between those dates
*/
app.post("/getEventsByInterval", function (req, result) {
  if (!req.body.time.start || !req.body.time.end) { //If no parameters is passed, we return the current months events
    var date = new Date();
    var startParam = new Date(date.getFullYear(), date.getMonth(), 1);
    var endParam = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  }
  else {
    var startParam = new Date(req.body.time.start);
    var endParam = new Date(req.body.time.end);
    console.log("start : ", startParam, " end:", endParam);
    startParam.setHours(0, 0, 0, 0);
    endParam.setHours(23, 59, 59, 999);
  }
  calendar.events.list({
    calendarId: calendarID,
    timeMin: startParam.toISOString(),
    timeMax: endParam.toISOString(),
    maxResults: 999,
    singleEvents: true,
    orderBy: 'startTime',
  }, (err, res) => {
    //CallBack
    if (err) {
      return result.send('The post request returned an error: ' + err);
    }
    result.json(res.data.items);
  })
})



/*
UPDATE ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.post("/updateEvent", function (req, result) {
  console.log("update request recieved");
  console.log(req.body.extra);

  let newEvent = req.body.extra;

  calendar.events.update({calendarId: calendarID, eventId: req.body.ID, resource: newEvent}
    , (err, res) => {
    //CallBack
    if (err) {
      return result.send('The post request returned an error: ' + err);
    }
    result.send("update");
  })

})



/*
app.listen(3001, function):
sets up the localhost with port 3001 as default address
for testing
*/
app.listen(5000, function () {
  console.log('Webpage listening on port 5000, Time: ' + new Date());
});

/*
create new Event
*/
app.post("/createNewEvent", function (req, res) {
  console.log(req.body);
  // console.log((new Date()).toISOString());
  console.log("inside create event route")

/*
  var event = {
    'summary': req.body.title,
    // 'location': '800 Howard St., San Francisco, CA 94103',
    // 'description': 'A chance to hear more about Google\'s developer products.',
    'start': {
      'dateTime': req.body.start,
      'timeZone': 'America/Los_Angeles',
    },
    'end': {
      'dateTime': req.body.end,
      'timeZone': 'America/Los_Angeles',
    }
  };
*/
  var event = req.body.newEvent;

  calendar.events.insert({
    auth: calenAuth,
    // calendarId: 'iodevcalendar@gmail.com',
    calendarId: calendarID,
    resource: req.body.newEvent,
  }, function (err, event) {
    if (err) {
      console.log('There was an error contacting the Calendar service: ' + err);
      return;
    }
    console.log('Event created: %s', event.htmlLink);
    res.send("Evented Created");
  });
});


// Refer to the Node.js quickstart on how to setup the environment:
// https://developers.google.com/calendar/quickstart/node
// Change the scope to 'https://www.googleapis.com/auth/calendar' and delete any
// stored credentials.


////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////
//Below is all the google authorization code


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function saveCredentials(auth) {  //Tyler: saveCredentials has been altered to just set-up, no listing events
  if (calenAuth == null)
    calenAuth = auth
  if (calendar == null)
    calendar = google.calendar({ version: 'v3', auth });
}


function setUpAuth() {
  // Load client secrets from a local file.
  fs.readFile('credentials.json', (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Calendar API.
    authorize(JSON.parse(content), saveCredentials); //Tyler: saveCredentials has been altered to just set-up, no listing events
  });
}

//End of Google Auth Code
