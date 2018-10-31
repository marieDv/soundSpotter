/**
 * USER-INFORMATION
 * displays information about the current user: favorite artists, name and matches
 **/

import React, { Component } from 'react';


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
                    <h1 id={"allArtists"} className={"headline-xxl-sub  t-indent"}></h1>
                    {this.props.returnGenres[0] &&
                    <h2 id="matches" className={"headline-xxl-sub t-indent"}>matches:<br/></h2>
                    }
                </div>
                {!this.props.returnGenres[0] &&
                <div>
                    <h2 className={"headline-xxl-sub t-indent"}>connect through</h2>
                    <h1 className={"headline-xxl t-indent"}>SOUND</h1>
                </div>
                }


                {this.props.currentUser.name &&
                <h1 className={"headline-xl"}><em className={"emphasized"}>{this.props.currentUser.name}'s</em>
                    favorite music</h1>
                }
                {!this.props.currentUser.name &&
                <h1 className={"headline-xl"}><em className={"emphasized"}>see your</em> favorite music</h1>
                }

                <h2 className={"headline-lg"}>- done with the Spotify WEB API -</h2>
                <h2 className={"headline-lg"}> © marie dvorzak </h2>
                <br></br>
                {!this.props.returnGenres[0] &&
                <a href="http://localhost:8888">
                    <button><p className={"text-login"}>Login with
                        Spotify</p></button>
                </a>
                }

            </div>
        )}
}


export default UserInfo;