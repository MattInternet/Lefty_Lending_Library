# Lefty Lending Library

<div style="float: left">
  <img src="./public/images/SLCDSA1.png" width="200"/>
</div>

Heyo welcome to the Lefty Lending Library (LLL) source code. Theres not much to this README yet but eventually Id like to document how to setup this project with your own firebase instance and make it easy to template so other DSA chapters (or anyone else) can setup a similar system on their own.

Currently trying to sync a Google Sheet with this Library. Using Google APIs in an OAuth context.

- enable OAuth on your firebase project, and download associated key file

- add directory, `src/firebasesecrets`, and put your firebase config and key files in there. Ensure this directory gets git-ignored.

- change the filename in `src/config/auth.config.ts`

- `functions/src/index` -- googleoauthcaller uses firebase functions to pass an Express app, which handles the google Sheets API call.

- googleoauthcaller is called by `src/stores/auth.store.ts`, but I've been getting a byte array and not knowing if I'm parsing it correctly because the server console log eludes me.


