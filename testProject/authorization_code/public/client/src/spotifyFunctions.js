
// import Spotify from 'spotify-web-api-js';
// import uniq from 'lodash.uniq';
// import flatten from 'lodash.flatten';
// import chunk from 'lodash.chunk';
var spotifyApi = require('spotify-web-api-node');


export function redirectUrlToSpotifyForLogin(){
    const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
    const REDIRECT_URI =
        process.env.NODE_ENV === "production"
            ? process.env.REACT_APP_SPOTIFY_PRODUCTION_REDIRECT_URI
            : process.env.REACT_APP_SPOTIFY_DEVELOPMENT_REDIRECT_URI;
    const scopes = [
        "user-modify-playback-state",
        "user-library-read",
        "user-library-modify",
        "playlist-read-private",
        "playlist-modify-public",
        "playlist-modify-private"];
    return 'https://accounts.spotify.com/authorize?client_id=' + CLIENT_ID +
        '&redirect_uri=' + encodeURIComponent(REDIRECT_URI) +
        '&scope=' + encodeURIComponent(scopes.join(' ')) +
        '&response_type=token';
}

export function checkUrlForSpotifyAccessToken(){
    const params = getHashParams();
    const accessToken = params.access_token
    if (!accessToken) {
        return false
    }
    else {
        return accessToken
    }
}

function getHashParams() {
    //helper function to parse the query string that spotify sends back when you log in
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    // eslint-disable-next-line
    while ( e = r.exec(q)) {
        hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
}
let globalAccessToken = "";
export function setAccessToken(accessToken) {
    //since using spotifyApi as helper library you can set the access code once
    //you get it and then not have to include it in every request
    spotifyApi.setAccessToken(accessToken);
    globalAccessToken = accessToken;
}