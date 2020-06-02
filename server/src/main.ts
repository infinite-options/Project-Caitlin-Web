import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as debug from 'debug';
import { config } from 'dotenv';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';
import { AddressInfo } from 'net';
import * as path from 'path';
import * as webpack from 'webpack';
import * as https from 'https';
import * as webpack_dev_middleware from 'webpack-dev-middleware';
import * as webpack_hot_middleware from 'webpack-hot-middleware';

import webpackConfig from '../webpack.config';
import errorHandler from './errorHandler';


declare const __basedir;

config();

const app = express();

if ( process.env.NODE_ENV === 'development' )
	app.use( logger( 'dev' ) );
app.use( express.json() );
app.use( express.urlencoded( { extended: false } ) );
app.use( cookieParser() );

app.use( bodyParser.json() ); // <--- Here
app.use( bodyParser.urlencoded( { extended: true } ) ); //for body parser to parse correctly
app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}));

// Connect to firebase to check for matched passwords
const firebase = require( 'firebase' );
const firebaseConfig = {
	apiKey:            'AIzaSyDBgPVcjoV8LbR4hDA7tm3UoP0abMw8guE',
	authDomain:        'project-caitlin-c71a9.firebaseapp.com',
	databaseURL:       'https://project-caitlin-c71a9.firebaseio.com',
	projectId:         'project-caitlin-c71a9',
	storageBucket:     'project-caitlin-c71a9.appspot.com',
	messagingSenderId: '711685546849',
	appId:             '1:711685546849:web:5c7a982748eb3bec35db20',
	measurementId:     'G-DCQF4LY5ZH'
};

firebase.initializeApp( firebaseConfig );
firebase.auth().signInAnonymously().catch( function ( error ) {
	// Handle Errors here.
	const errorCode = error.code;
	const errorMessage = error.message;
	// ...
} );

if ( process.env.NODE_ENV === 'development' ) {
	const compiler = webpack( webpackConfig as any );
	app.use( webpack_dev_middleware( compiler, {
		publicPath: webpackConfig.output.publicPath
	} ) );
	app.use( webpack_hot_middleware( compiler ) );
}

app.use( express.static( path.join( __basedir, 'public' ) ) );

app.set( 'view engine', 'ejs' );
//start of google calendar API stuff
const fs = require( 'fs' );
const opn = require( 'open' );
const readline = require( 'readline' );
const { google } = require( 'googleapis' );
let calenAuth = null,
    calendar  = null;
const calendarID = 'iodevcalendar@gmail.com'; //Change here for some else's calendar
// var calendarID = "pmarathay@gmail.com"
// var calendarID = "jeremyhmanalo@gmail.com"
//Required code for any of the above to work
// If modifying these scopes, delete token.json.
const SCOPES = [ 'https://www.googleapis.com/auth/calendar' ];
const SCOPEUSERS = [ 'https://www.googleapis.com/auth/calendar', 'https://www.googleapis.com/auth/userinfo.email' ];
// The file token.json stores the user's acalendar"ccess and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// setUpAuth(); //sets all the necessary authentication and vars "calenAuth", and "calendar"
//end of calendar API stuff

/*
fullCalByInterval:
Given start and end parameters from request, it will return all events from
the google calendar BUT convert it to the format that is accepted by Full Calendar
*/

app.get( '/fullCalByInterval', function ( req, result ) {
	console.log( 'server get fullCalByInterval' );
	// console.log("passed in params start date "  + req.query.start);
	// console.log("passed in params end date"  + req.query.end);
	// result.json({result: "We have sucessfully sent back "});

	if ( !req.query.start || !req.query.end ) {
		const date = new Date();
		var startParam = new Date( date.getFullYear(), date.getMonth(), 1 );
		var endParam = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
	} else {
		var startParam = new Date( req.query.start as any );
		var endParam = new Date( req.query.end as any );
		console.log(
			'start : ',
			startParam.toISOString(),
			' end:',
			endParam.toISOString()
		);
		startParam.setHours( 0, 0, 0, 0 );
		endParam.setHours( 23, 59, 59, 999 );
	}
	calendar.events.list(
		{
			calendarId:   calendarID,
			timeMin:      startParam.toISOString(),
			timeMax:      endParam.toISOString(),
			maxResults:   999,
			singleEvents: true,
			orderBy:      'startTime'
		},
		( err, res ) => {
			//CallBack
			if ( err ) {
				return result.send( 'The post request returned an error: ' + err );
			}

			const A = []; //The resultant Array
			const B = res.data.items;
			let temp;

			for ( let i = 0; i < B.length; i++ ) {
				if ( B[ i ].start.date == null ) {
					temp = {
						id:    B[ i ].id,
						title: B[ i ].summary,
						start: B[ i ].start.dateTime,
						end:   B[ i ].end.dateTime
					};
				} else {
					const start0 = new Date( B[ i ].start.date );
					const end0 = new Date( B[ i ].start.date );
					start0.setHours( 0, 0, 0, 0 );
					end0.setHours( 23, 59, 59, 59 );
					temp = {
						id:     B[ i ].id,
						allDay: true,
						title:  B[ i ].summary,
						start:  start0,
						end:    end0
					};
				}
				A.push( temp );
			}
			// result.json(res.data.items);
			result.send( A );
		}
	);
} );

app.get( '/x', ( req, res ) => {
	res.sendFile( path.join( __dirname, 'client', 'build', 'index.html' ) );
} );

app.get( '/test', ( req, res ) => {
	res.redirect( '/' );
} );

app.get( '/.well-known/pki-validation/6B573F01F1E6DAF81B7FD85EECA9946B.txt', ( req, res ) => {
	const index = path.join( __basedir, 'auth.txt' );
	console.log(index)
	res.sendFile( index );
} );


//Landing Page
/*
The below does a query to the google calendar API and gets all the events of the current
month and then renders them On the month template
*/
app.get( '/a', function ( req, result ) {
	const date = new Date();
	const firstDayOfMonth = new Date( date.getFullYear(), date.getMonth(), 1 );
	const lastDayOfMonth = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
	calendar.events.list(
		{
			calendarId:   calendarID,
			timeMin:      firstDayOfMonth.toISOString(),
			timeMax:      lastDayOfMonth.toISOString(),
			maxResults:   999,
			singleEvents: true,
			orderBy:      'startTime'
		},
		( err, res ) => {
			//CallBack
			if ( err ) return console.log( 'The API returned an error: ' + err );
			let events = res.data.items;
			result.json( events );
			console.log( events, '/a events' );
			result.render( 'month', { events: events } );
		}
	);
} );

app.get( '/getRecurringRules', ( req, result ) => {
	console.log( req.query.recurringEventId, 'req getRecurringRules' );

	if ( req.query.recurringEventId ) {
		calendar.events.get(
			{
				calendarId: calendarID,
				eventId:    req.query.recurringEventId
			},
			( err, res ) => {
				//CallBack
				if ( err ) {
					return result.send( 'The get request returned an error: ' + err );
				}
				console.log( res.data.recurrence, 'getRecurringRules' );
				result.json( res.data.recurrence );
			}
		);
	}
} );

app.get( '/getRecurringEventInstances', ( req, result ) => {
	console.log(
		req.query.timeMin,
		'getRecurringEventInstances',
		req.query.timeMax
	);

	if ( req.query.recurringEventId ) {
		if ( !req.query.timeMin ) {
			calendar.events.instances(
				{
					calendarId: calendarID,
					eventId:    req.query.recurringEventId
				},
				( err, res ) => {
					//CallBack
					if ( err ) {
						return result.send( 'The get request returned an error: ' + err );
					}
					console.log( res.data, 'getRecurringEventInstances' );
					result.json( res.data.items );
				}
			);
		} else {
			calendar.events.instances(
				{
					calendarId: calendarID,
					eventId:    req.query.recurringEventId,
					timeMin:    req.query.timeMin,
					timeMax:    req.query.timeMax
				},
				( err, res ) => {
					//CallBack
					if ( err ) {
						return result.send( 'The get request returned an error: ' + err );
					}
					console.log( res.data, 'getRecurringEventInstances' );
					result.json( res.data.items );
				}
			);
		}
	}
} );

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
app.get( '/getEventsByInterval', function ( req, result ) {
	console.log( 'passed in params start date ', req.query.start );
	// console.log("passed in params end date", req);

	if ( !req.query.start || !req.query.end ) {
		const date = new Date();
		var startParam = new Date( date.getFullYear(), date.getMonth(), 1 );
		var endParam = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
	} else {
		var startParam = new Date( req.query.start as any );
		var endParam = new Date( req.query.end as any );
		const name = req.query.name;
		var id = req.query.id;
		console.log( 'start : ', startParam, ' end:', endParam );
		startParam.setHours( 0, 0, 0, 0 );
		endParam.setHours( 23, 59, 59, 999 );
		console.log( 'start : ', startParam, ' end:', endParam );
	}

	setUpAuthById( id, ( auth ) => {
		calendar = google.calendar( { version: 'v3', auth } );
		calendar.events.list(
			{
				calendarId:   'primary',
				timeMin:      startParam.toISOString(),
				timeMax:      endParam.toISOString(),
				maxResults:   999,
				singleEvents: true,
				orderBy:      'startTime',
				timeZone:     req.query.timeZone
			},
			( err, res ) => {
				console.log( res );
				//CallBack
				if ( err ) {
					return result.send( 'The post request returned an error: ' + err );
				}
				console.log( res.data, 'geteventsbyinterval' );
				result.json( res.data.items );
			}
		);
	} );
} );

/*
Delete ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.post( '/deleteEvent', function ( req, result ) {
	console.log( 'deleteEvent',req.body.username, req.body.userId, req.body.eventId );
	var id = req.body.userId;
	setUpAuthById(id,(auth) => {
		calendar = google.calendar( { version: 'v3', auth } );
		calendar.events.delete(
		{ auth: auth, calendarId: 'primary', eventId: req.body.eventId },
		req.body.eventId,
		( err, res ) => {
			//CallBack
			if ( err ) {
				console.log('delete error',err);
				return result.send( 'The post request returned an error: ' + err );
			}
			console.log('delete successful');
			result.send( 'delete' );
		}
	);
	})
} );

app.delete( '/deleteRecurringEvent', ( req, result ) => {
	console.log( req.query.eventId, 'deleteRecurringEvent' );
	calendar.events.delete(
		{
			calendarId: calendarID,
			eventId:    req.query.eventId
		},
		( err, res ) => {
			//CallBack
			if ( err ) {
				return result.send( 'The delete request returned an error: ' + err );
			}
			result.send( 'delete' );
		}
	);
} );

/*
getEventsByInterval:
given a start and a end date from req, it will query those In the
google calendar and return events between those dates
*/
app.post( '/getEventsByInterval', function ( req, result ) {
	if ( !req.body.time.start || !req.body.time.end ) {
		//If no parameters is passed, we return the current months events
		const date = new Date();
		var startParam = new Date( date.getFullYear(), date.getMonth(), 1 );
		var endParam = new Date( date.getFullYear(), date.getMonth() + 1, 0 );
	} else {
		var startParam = new Date( req.body.time.start );
		var endParam = new Date( req.body.time.end );
		console.log( 'start : ', startParam, ' end:', endParam );
		startParam.setHours( 0, 0, 0, 0 );
		endParam.setHours( 23, 59, 59, 999 );
	}
	calendar.events.list(
		{
			calendarId:   calendarID,
			timeMin:      startParam.toISOString(),
			timeMax:      endParam.toISOString(),
			maxResults:   999,
			singleEvents: true,
			orderBy:      'startTime'
		},
		( err, res ) => {
			//CallBack
			if ( err ) {
				return result.send( 'The post request returned an error: ' + err );
			}
			result.json( res.data.items );
		}
	);
} );

/*
UPDATE ROUTE:
Given the event's id, it look send it up to google calendar API
and delete it.
*/
app.put( '/updateEvent', function ( req, result ) {
	console.log( 'update request recieved' );
	console.log( req.body.eventId, req.body.extra );
	console.log(req.body.username,req.body.id)
	let newEvent = req.body.extra;
	let id = req.body.id;
  setUpAuthById( id, ( auth ) => {
		calendar = google.calendar( { version: 'v3', auth } );
		calendar.events.update(
			{
				calendarId: 'primary',
				eventId:    req.body.eventId,
				resource:   newEvent
			},
			( err, res ) => {
				//CallBack
				if ( err ) {
					return result.send( 'The post request returned an error: ' + err );
				}
				result.send( 'update' );
			}
		);
	});
} );

/*
create new Event
*/
app.post( '/createNewEvent', function ( req, res ) {
	console.log( req.body );
	console.log( 'inside create event route' );
	console.log( req.body.username, req.body.id);
	let id = req.body.id;
	setUpAuthById( id, ( auth ) => {
		console.log( 'Signed in correctly' );
		calendar = google.calendar( { version: 'v3', auth } );
		console.log( 'Grabbed calendar' );
		calendar.events.insert(
			{
				auth: auth,
				calendarId: 'primary',
				resource:   req.body.newEvent
			},
			function ( err, event ) {
				if ( err ) {
					console.log(
						'There was an error contacting the Calendar service: ' + err
					);
					return;
				}
				console.log( 'Event created: %s', event.htmlLink );
				res.send( 'Evented Created' );
			}
		)})
} );

function formatEmail( email ) {
	email = email.toLowerCase();
	email = email.split( '@' );
	email[ 0 ] = email[ 0 ].split( '.' ).join( '' );
	email[ 0 ] = email[ 0 ].concat( '@' );
	return email[ 0 ].concat( email[ 1 ] );   // The function returns the product of p1 and p2
}

/*
Log in ROUTE:
Attempt to sign in as trusted advisor
*/
app.post( '/TALogIn', function ( req, result ) {
	console.log( req.body.username, req.body.password );
	let emailId = req.body.username;
	let givenPass = req.body.password;
	let emailId1 = emailId.toLowerCase();
	let emailId_final = formatEmail( emailId1 );
	let db = firebase.firestore();
	let TAs = db.collection( 'trusted_advisor' );
	TAs.where( 'email_id', '==', emailId_final ).get()
		.then( ( snapshot ) => {
			//No email matches
			if ( snapshot.empty ) {
				console.log( 'no user' );
				result.json( false );
			} else {
				snapshot.forEach( ( doc ) => {
					//Matching password
					if ( givenPass === doc.data().password_key ) {
						req.session.user = req.body.username;
						result.json( req.body.username );
						return;
					}
				} );
				// Run following when username/passowrd matches
				console.log( 'not matching password' );
				result.json( false );
			}
		} )
		.catch( ( err ) => {
			console.log( 'Error getting documents', err );
			result.json( false );
		} );
} );

/*
Log in social ROUTE:
Attempt to sign in as trusted advisor from social media
*/
app.post( '/TASocialLogIn', function ( req, result ) {
	console.log(req.body.username);
	let emailId = req.body.username;
	let emailId1 = emailId.toLowerCase();
	let emailId_final = formatEmail( emailId1 );
	let db = firebase.firestore();
	let TAs = db.collection( 'trusted_advisor' );
	TAs.where( 'email_id', '==', emailId_final ).get()
		.then( ( snapshot ) => {
				//No email matches
				if ( snapshot.empty ) {
					console.log( 'no user' );
					result.json( false );
				} else {
					snapshot.forEach( ( doc ) => {
						req.session.user = req.body.username;
						result.json( req.body.username );
						return;
					});
				}
			} )
			.catch( ( err ) => {
				console.log( 'Error getting documents', err );
				result.json( false );
			} );
});

/*
Log in status ROUTE:
Check trusted advisor login status
*/
app.get( '/TALogInStatus', function ( req, result ) {
	console.log(req.session);
	if ( req.session.user ) {
		result.json( req.session.user );
	} else {
		result.json( false );
	}
} );

/*
Log out ROUTE:
Trusted advisor log out
*/
app.get( '/TALogOut', function ( req, result ) {
	result.clearCookie('user_sid');
	result.json( 'success' );
} );

/*
TA Sign up ROUTE:
Trusted advisor sign up
*/
app.post( '/TASignUp', function ( req, result ) {
	console.log( req.body );
	let db = firebase.firestore();
	let newTARef = db.collection( 'trusted_advisor' ).doc();
	newTARef
		.set( {
			email_id:     formatEmail( req.body.username ),
			password_key: req.body.password,
			first_name:   req.body.fName,
			last_name:    req.body.lName,
			employer:     req.body.employer,
			users: []
		} )
		.then( () => {
			result.json( true );
		} )
		.catch( ( err ) => {
			console.log( 'Error writing', err );
			result.json( false );
		} );
} );

/*
TA Sign up ROUTE:
Trusted advisor sign up from Social Media
*/
app.post( '/TASocialSignUp', function ( req, result ) {
	console.log( req.body );
	let db = firebase.firestore();
	let newTARef = db.collection( 'trusted_advisor' ).doc();
	newTARef
		.set( {
			email_id:     formatEmail( req.body.username ),
			first_name:   req.body.fName,
			last_name:    req.body.lName,
			employer:     req.body.employer,
			users: []
		} )
		.then( () => {
			result.json( true );
		} )
		.catch( ( err ) => {
			console.log( 'Error writing', err );
			result.json( false );
		} );
} );

app.get( '/auth-url', function ( req, result ) {
	fs.readFile( 'credentials.json', ( err, content ) => {
		if ( err ) return console.log( 'Error loading client secret file:', err );
		// Authorize a client with credentials, then call the Google Calendar API.
		let credentials = JSON.parse( content );
		const { client_secret, client_id, redirect_uris } = credentials.web;
		const oAuth2Client = new google.auth.OAuth2(
			client_id, client_secret, redirect_uris[ 0 ] );
		const authUrl = oAuth2Client.generateAuthUrl( {
			access_type: 'offline',
			prompt:      'consent',
			scope:       SCOPEUSERS
		} );
		result.json( authUrl );
	} );
} );

app.get( '/adduser', function ( req, result ) {
	fs.readFile( 'credentials.json', ( err, content ) => {
		if ( err ) return console.log( 'Error loading client secret file:', err );
		// Authorize a client with credentials, then call the Google Calendar API.
		let credentials = JSON.parse( content );
		const { client_secret, client_id, redirect_uris } = credentials.web;
		const oAuth2Client = new google.auth.OAuth2( client_id, client_secret, redirect_uris[ 0 ] );
		oAuth2Client.getToken( req.query.code, ( err, token ) => {
			if ( err ) {
				console.error( 'Error retrieving access token', err );
				result.json( err );
			}
			oAuth2Client.setCredentials( { access_token: token.access_token } );
			const oauth2 = google.oauth2( {
				auth:    oAuth2Client,
				version: 'v2'
			} );
			oauth2.userinfo.get( ( err, res ) => {
				if ( err ) {
					result.json( err );
				} else {
					let emailId = res.data.email;
					emailId = formatEmail( emailId );

					let db = firebase.firestore();
					let users = db.collection( 'users' );
					users.where( 'email_id', '==', emailId ).get()
						.then( ( snapshot ) => {
							if ( snapshot.empty ) {
								// Add tokens to firebase
								let newClientRef = users.doc();
								newClientRef
									.set( {
										email_id:             emailId,
										google_auth_token:    token.access_token,
										google_refresh_token: token.refresh_token,
										first_name:           'New',
										last_name:            'User'
									} );
								result.redirect( '/main?createUser=true&email='+emailId );
							} else {
//##############################################################################
								// Fix this to give error not update
//##############################################################################
								snapshot.forEach((doc) => {
								  users.doc(doc.id)
								  .update({
								    google_auth_token: token.access_token,
								    google_refresh_token: token.refresh_token,
								    first_name: "New",
								    last_name: "User"
								  });
								})
								result.redirect( '/main?createUser=true&email='+emailId );
							}
						} )
						.catch( ( err ) => {
							console.log( 'Error getting firebase documents', err );
							result.json( err );
						} );
				}
			} );
		} );
	} );
} );

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
function authorize( credentials, callback ) {
	const { client_secret, client_id, redirect_uris } = credentials.web;
	const oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[ 0 ]
	);

	// Check if we have previously stored a token.
	fs.readFile( TOKEN_PATH, ( err, token ) => {
		if ( err ) return getAccessToken( oAuth2Client, callback );
		oAuth2Client.setCredentials( JSON.parse( token ) );
		callback( oAuth2Client );
	} );
}

function authorizeById( credentials, id, callback ) {
	const { client_secret, client_id, redirect_uris } = credentials.web;
	let oAuth2Client = new google.auth.OAuth2(
		client_id,
		client_secret,
		redirect_uris[ 0 ]
	);

	// Store to firebase
	const db = firebase.firestore();
	if ( id ) {
		db.collection( 'users' ).doc( id ).get().then( ( snapshot ) => {
			if ( snapshot.data().google_auth_token ) {
				console.log( snapshot.data().google_auth_token );
				oAuth2Client.setCredentials( {
					access_token:  snapshot.data().google_auth_token,
					refresh_token: snapshot.data().google_refresh_token
				} );
				console.log( {
					access_token:  snapshot.data().google_auth_token,
					refresh_token: snapshot.data().google_refresh_token
				} );
				callback( oAuth2Client );
			}
		} );
	}
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken( oAuth2Client, callback ) {
	const authUrl = oAuth2Client.generateAuthUrl( {
		access_type:     'offline',
		approval_prompt: 'force',
		scope:           SCOPES
	} );
	console.log( 'Authorize this app by visiting this url:', authUrl );
	const rl = readline.createInterface( {
		input:  process.stdin,
		output: process.stdout
	} );
	rl.question( 'Enter the code from that page here: ', ( code ) => {
		rl.close();
		oAuth2Client.getToken( code, ( err, token ) => {
			if ( err ) return console.error( 'Error retrieving access token', err );
			oAuth2Client.setCredentials( token );
			// Store the token to disk for later program executions
			fs.writeFile( TOKEN_PATH, JSON.stringify( token ), ( err ) => {
				if ( err ) return console.error( err );
				console.log( 'Token stored to', TOKEN_PATH );
			} );
			callback( oAuth2Client );
		} );
	} );
}

/**
 * Lists the next 10 events on the user's primary calendar.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
function saveCredentials( auth ) {
	//Tyler: saveCredentials has been altered to just set-up, no listing events
	console.log( 'saveCredentials', auth );

	if ( calenAuth == null ) calenAuth = auth;
	if ( calendar == null ) calendar = google.calendar( { version: 'v3', auth } );
}

function updateCredentials( auth ) {
	//Tyler: saveCredentials has been altered to just set-up, no listing events
	console.log( 'saveCredentials', auth );

	calenAuth = auth;
	calendar = google.calendar( { version: 'v3', auth } );
}

function setUpAuth() {
	// Load client secrets from a local file.
	fs.readFile( 'credentials.json', ( err, content ) => {
		if ( err ) return console.log( 'Error loading client secret file:', err );
		// Authorize a client with credentials, then call the Google Calendar API.
		authorize( JSON.parse( content ), saveCredentials ); //Tyler: saveCredentials has been altered to just set-up, no listing events
	} );
}

function setUpAuthById( id, callback ) {
	fs.readFile( 'credentials.json', ( err, content ) => {
		if ( err ) return console.log( 'Error loading client secret file:', err );
		// Authorize a client with credentials, then call the Google Calendar
		authorizeById( JSON.parse( content ), id, callback ); //Tyler: saveCredentials has been altered to just set-up, no listing events
	} );
}

app.get( '*', ( req, res ) => {
	const index = path.join( __basedir, 'public', 'index.html' );
	res.sendFile( index );
} );

errorHandler( app );

const debugLog = debug( 'server:server' );

/**
 * Get port from environment and store in Express.
 */
const listener = app.listen( process.env.PORT || 80, () => {
	const address = listener.address() as AddressInfo;
	if ( process.env.NODE_ENV === 'development' )
		debugLog( `Listening on ${address.address}:${address.port}` );
} );

var options = {
  key: fs.readFileSync('privatekey.pem'),
  cert: fs.readFileSync('certificate.pem'),
	ca: [
		fs.readFileSync('ca_bundle.crt'),
	]
};

https.createServer(options, app).listen(443);
