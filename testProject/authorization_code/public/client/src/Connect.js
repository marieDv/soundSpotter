import React, { Component } from 'react';
import * as SpotifyFunctions from './spotifyFunctions.js'

class ConnectSpotify extends Component {

    render() {
        return (
            <div className="connect">
                <a href={SpotifyFunctions.redirectUrlToSpotifyForLogin()}>
                    <button>Login with Spotify ??????????</button>
                </a>
            </div>
        );
    }
}

export default ConnectSpotify;