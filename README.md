# Live Meeting Transcriber

The idea is to offer a simplistic keyboard only transcriber app with real time streaming and support for insterting bible verses.

Using the `bcc-code/bible-server` we currently support the Norwegian bible.

## Setup Signal Server

Used for setting up the real time communication between clients

 - `npm install`
 - `npm start`

## Setup Frontend

 - `cd frontend`
 - `npm install`
 - `npm start`

Open browser and visit http://localhost:3000/?admin to be the transcriber.
In a different browser visit http://localhost:3000 to be the viewer.


## Implemented

-[x] Real time communication between clients
-[x] Transcriber can insert bible verses (Norwegian)

### Todo

- Add support for multiple languages
- Add support for multiple bible versions
- Add support for multiple simultaneous meetings
- Authenticate users
- Analytics