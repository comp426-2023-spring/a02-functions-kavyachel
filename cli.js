#!/usr/bin/env node

import  minimist  from 'minimist'
import  moment  from 'moment-timezone'
import  fetch  from 'node-fetch'
//import exit from 'node:process'

const timezone = moment.tz.guess();
const args = minimist(process.argv.slice(2));

if (args.h) {
    console.log("Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE\n")
    console.log("-h            Show this help message and exit.\n")
    console.log("-n, -s        Latitude: N positive; S negative.\n")
    console.log("-e, -w        Longitude: E positive; W negative.\n")
    console.log("-z            Time zone: uses tz.guess() from moment-timezone by default.\n")
    console.log("-d 0-6        Day to retrieve weather: 0 is today; defaults to 1.\n")
    console.log("-j            Echo pretty JSON from open-meteo API and exit.\n")
    process.exit(0)
}

//Latitude variable
let latitude;

if(args.n && args.s) {
    console.log("Enter only input one latitude argument. Either north (n) or south (s).");
    process.exit(0);
}
if (args.n) {
    latitude = args.n
} else if (args.s) {
    latitude = 0 - args.s
} else {
    latitude = 35.9
}

//Longitude variable
let longitude;

if(args.w && args.e) {
    console.log("Enter only input one longitude argument. Either west (w) or east (e).");
    process.exit(0);
}
if (args.e) {
    longitude = args.e
} else if (args.w) {
    longitude = 0 - args.w
} else {
    longitude = -79.04
}

//Days constant
const days = args.n || 1;

//Construct url
const url = "https://api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&timezone=" + timezone + "&daily=precipitation_hours";
const response = await fetch(url)
const data = await response.json()

let message; 
if (data.daily.precipitation_hours[days] > 0 && data.daily.precipitation_hours[days] < 3) {
    message = "Grab an umbrella!"
} else if (data.daily.precipitation_hours[days] >= 3) {
    message = "You may need an umbrella"
} else {
    message = "It's a great day! Go outside!"
}

if (days == 0) {
    console.log("today.\n")
  } else if (days > 1) {
    console.log("in " + days + " days.\n")
  } else {
    console.log("tomorrow.\n")
}

if (args.j) {
    console.log(data);
    process.exit(0)
} 
else {
    console.log(message);
}


