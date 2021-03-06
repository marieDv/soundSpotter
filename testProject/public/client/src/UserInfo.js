/**
 * USER-INFORMATION
 * displays information about the current user: favorite artists, name and matches
 **/

import React, { Component } from 'react';
import logo from './img/Spotify_Logo.png';

class UserInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        return(
            <div className={this.props.positionClasses}>

                <div className={"greetings"}>
                    {this.props.currentUser.name &&
                    <h1 className={"favArtist"}><em className={"emphasized"}>{this.props.currentUser.name}'s</em>
                        favorite artists:</h1>
                    }
                    {/*{!this.props.currentUser.name &&*/}
                    {/*<h1 className={"favArtist"}><em className={"emphasized"}>see your</em> favorite music</h1>*/}
                    {/*}*/}
                    <h1 id={"allArtists"} className={"headline-xxl-sub  "}></h1>
                    {this.props.returnGenres[0] &&
                    <h2 id="matches" className={"headline-xxl-sub "}><br/></h2>
                    }
                </div>
                {!this.props.returnGenres[0] &&
                <div>
                    <h2 className={"headline-xxl-sub "}>connect through</h2>
                    <h1 className={"headline-xxl "}>SOUND</h1>
                </div>
                }




                <h2 className={"headline-lg"}>- done with the Spotify WEB API -</h2>
                <h2 className={"headline-lg"}> ©marie dvorzak </h2>
                <div><img class="img" src={logo} alt="spotify_logo"></img></div>
                <br></br>
                {!this.props.returnGenres[0] &&
                <a href="/login">
                    <button><p className={"text-login"}>Login with
                        Spotify</p></button>
                </a>
                }

            </div>
        )}
}


export default UserInfo;