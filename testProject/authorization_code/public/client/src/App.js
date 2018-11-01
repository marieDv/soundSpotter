/**
 * APP
 * root component of the React Application - contains functions for the fetching of the Spotify data and passes it to
 * the Three.js model - also responsible for the user-managment(saving of data to the session-storage)
 **/
import React, {Component} from 'react';
import './App.css';
import sketch from './sketches/sketch';
import Canvas from './Canvas';
import UserInfo from './UserInfo';
import Spotify from 'spotify-web-api-js';

const spotifyWebApi = new Spotify();


class App extends Component {

    constructor() {
        super();
        const params = this.getHashParams();

        const token = params.access_token;
        if (token) {
            spotifyWebApi.setAccessToken(token);
        }
        this.state = {
            loggedIn: token ? true : false,
            nowPlaying: {name: 'Not Checked', albumArt: ''},
            topArtists: {genres: [], items: []},
            topArtistsSec: {genres: [], items: []},
            artists: [],
            nmbArtist: 0,
            soloGenres: {genre: [{name: [], commonness: []}]},
            returnGenres: [],
            total: 0,
            clicked: false,
            dataLoaded: false,
            secondUserId: "",
            userOneData: [],
            stateSketch: sketch,
            count: 0,
            secUserLoggedIn: false,
            currentUser: {name: ""},
            displayedUser: {name: ""},
            logIns: 0,
            canvasClasses: "canvas-blur",
            themeClasses: "bg",
            setTheme_theme: "setTheme_theme",
            positionClasses: "pos-absolute",
            sphereSwitch: false,
            bgTheme: "rapgod",
            callSecondArrrayOnce: false,
            callSecondSwitch: false,

            // threejs related
            width: window.innerWidth,
            height: window.innerHeight,
            rotationSpeed: 0.01,
        }
        this.toggleClasses = this.toggleClasses.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
        this.setTheme = this.setTheme.bind(this);


    }


    componentWillMount() {
        this.updateDimensions();
    }


    componentDidMount() {
        const script = document.createElement("script");
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.6.0/p5.js";
        script.async = true;
        document.body.appendChild(script);

        this.init();
        this.gameLoop();
        window.addEventListener("resize", this.updateDimensions);


        /**
         * event listener for text zoom
         **/
        var items = null;
        if (this.state.topArtists) {
            items = this.state.topArtists;
        }
        document.addEventListener("click", function (event) {

            let favArtist = document.getElementsByClassName("favArtist");
            for (var i = 0; i < favArtist.length; i++) {
                console.log(favArtist[0]);
                let textBox = favArtist[i].getBoundingClientRect();
                if (event.clientX > textBox.left && event.clientX < textBox.right &&
                    event.clientY > textBox.top && event.clientY < textBox.bottom) {
                    if (items) {
                        console.log(items);
                    }
                }

            }
        });


        // const script2 = document.createElement("script");
        // script2.src = "https://use.typekit.net/foobar.js";
        // script2.async = true;
        // document.body.appendChild(script2);
    }

    /**
     * called after each mount
     **/
    init() {

        this.getTopArtists();
        this.toggleClasses();
    }

    /**
     * save hash for access
     **/
    getHashParams() {
        var hashParams = {};
        var e, r = /([^&;=]+)=?([^&;]*)/g,
            q = window.location.hash.substring(1);
        e = r.exec(q)
        while (e) {
            hashParams[e[1]] = decodeURIComponent(e[2]);
            e = r.exec(q);
        }
        return hashParams;
    }

    /**
     * get the track that the logged in user
     * is currently playing
     **/
    getNowPlaying() {

        spotifyWebApi.getMyCurrentPlaybackState()
            .then((response) => {
                this.setState({
                    nowPlaying: {
                        name: response.item.name,
                        albumArt: response.item.album.images[0].url
                    }
                });
            })
    }

    /**
     * saves the favorite artists
     * to a two dimensional array
     **/
    printArtists(reprintMatches) {

        var string = "";
        var genres = "";
        var secArray = null;
        var secondArray = [];

        //second user logged in -> print second sphere info
        if (this.state.sphereSwitch && this.state.returnGenres) {

            for (let key in Object.keys(sessionStorage)) {
                // console.log(Object.keys(sessionStorage)[key]);
                if ((Object.keys(sessionStorage)[key].includes("saveFirstUserArtists"))
                    && !(Object.keys(sessionStorage)[key].includes(this.state.currentUser.name))
                ) {
                    secArray = JSON.parse(sessionStorage.getItem(Object.keys(sessionStorage)[key]));
                }
            }

            var copiedArray = [{genres: []}];
            if (secArray[0]) {
                for (let i = 0; i < secArray.length; i++) {
                    copiedArray[i] = secArray[i].name;
                    secondArray[i] = copiedArray[i];
                }
            }

            changeArtists(copiedArray, this.state.soloGenres.genre[0].name, copiedArray.length, true);
        }
        //print first sphere info
        if (this.state.sphereSwitch === false) {
            changeArtists(this.state.topArtists.items, this.state.soloGenres.genre[0].name, this.state.topArtists.items.length, false);
        }

        //print artists to the page
        function changeArtists(mTopArtists, soloGenre, length, switched) {

            var wait = true;
            if (length > 1 && mTopArtists[0] && wait) {
                for (let i = 0; i < 20; i++) {
                    if (i < 5) {
                        let artistsArrayName = mTopArtists[i].name;


                        switched === false ? (artistsArrayName = mTopArtists[i].name) : (artistsArrayName = mTopArtists[i]);
                        string += "<li class='favArtist'>" + artistsArrayName
                            + "</li>";
                    }
                    genres += mTopArtists[i].genres;
                    if (!(genres.substr(genres.length - 1) === ",")) {
                        genres += ",";
                    }

                }
                let allArtists = document.getElementById("allArtists");
                if (allArtists) {
                    allArtists.innerHTML = string;
                }
                var msoloGenres = genres.split(",");
                soloGenre.push(msoloGenres);
            }
        }

        //count categories
        this.countCategories();
        //compare categories
        compareArtists(secondArray, this.state.topArtists.items);

        function compareArtists(copiedArray, topArtistsItems) {
            if (copiedArray) {

                for (let i = 0; i < copiedArray.length; i++) {
                    for (let j = 0; j < topArtistsItems.length; j++) {
                        if (copiedArray[i] === topArtistsItems[j].name) {
                            let genresTest = document.getElementsByClassName("favArtist");
                            let matches = document.getElementById("matches");
                            for (let o = 0; o < genresTest.length; o++) {
                                if (genresTest[o].innerHTML === copiedArray[i] || genresTest[o].innerHTML === topArtistsItems[j].name) {
                                    console.log(matches);
                                    if (!reprintMatches) {
                                        matches.innerHTML += "<br>" + copiedArray[i] + " [" + (j + 1) + "] [" + (i + 1) + "]";
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }


    /**
     * count artists genres and sage them to array
     * @returnGenres
     **/
    countCategories() {
        var countUp = new Array(this.state.soloGenres.genre[0].name[0].length + 1);
        var filteredGenres = [];
        filteredGenres.push(this.state.soloGenres.genre[0].name[0]);

        this.state.soloGenres.genre[0].name[0].sort();


        var current = this.state.soloGenres.genre[0].name[0][0];
        let song = 1;
        for (var i = 0; i < countUp.length - 1;) {
            if (current === this.state.soloGenres.genre[0].name[0][i]) {
                song += 1;
                countUp[this.state.soloGenres.genre[0].name[0][i]] = song;
            } else {

                song = 1;
                countUp[this.state.soloGenres.genre[0].name[0][i]] = song;
            }
            current = this.state.soloGenres.genre[0].name[0][i];
            i++;
        }
        this.state.returnGenres.push(countUp);

        sessionStorage.setItem(this.state.currentUser.name, JSON.stringify(this.splitArray(this.state.returnGenres[0], false)));
        sessionStorage.setItem(this.state.currentUser.name + "freq", JSON.stringify(this.splitArray(this.state.returnGenres[0], true)));
    }

    /**
     * save user data to sessionstorage
     **/

    saveAllUserData() {
        var saveToStorage = "";

        for (let key in Object.keys(sessionStorage)) {

            if (!(String(this.state.currentUser.name) === String(Object.keys(sessionStorage)[key])) &&
                !(Object.keys(sessionStorage)[key].includes("freq")) && Object.keys(sessionStorage)[key] != ""
                && !(Object.keys(sessionStorage)[key].includes("saveFirstUserArtists"))) {


                if (Object.keys(sessionStorage)[key] === null) {
                    saveToStorage = "null";
                } else {
                    saveToStorage = String(Object.keys(sessionStorage)[key]);
                }
            }
        }

        if (Object.keys(sessionStorage).length > 3) {
            let jsonGenres = JSON.parse(sessionStorage[saveToStorage]);
            saveToStorage += "freq";


            let jsonFrequency = JSON.parse(sessionStorage[saveToStorage]);
            this.concatArray(jsonGenres, jsonFrequency);

        }
        this.setState({clicked: true});
    }

    concatArray(genres, frequency) {
        let a = [];
        let i = 0;
        for (let key in genres) {
            a[genres[key]] = frequency[i];
            i++;
        }

        if (!(sessionStorage[this.state.currentUser.name] === this.state.currentUser.name)) {
            this.state.userOneData.push(a);
        }
    }

    splitArray(array, v) {
        let value = [];
        let i = 0;

        for (let key in array) {
            value[i] = (v === true ? array[key] : key);
            i++;
        }

        return value;
    }

    updateDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
    }

    /**
     * connect to the Spotify-Web-Api to change state of topArtist
     **/
    getTopArtists() {


        spotifyWebApi.getMe()
            .then((response) => {
                this.setState({
                    currentUser: {
                        name: response.display_name,
                    },
                    displayedUser: {
                        name: response.display_name,
                    }

                });

            });

        spotifyWebApi.getMyTopArtists()
            .then((response) => {
                this.setState(prevState => ({
                    topArtists: {
                        genres: [prevState.genres, response.items[0].name],
                        items: response.items,
                    }
                }));
                this.setState({nmbArtist: this.state.nmbArtist + 1});
                this.setState({total: response.total});

                if (response) {
                    if ((!this.state.secUserLoggedIn) && this.state.topArtists.items[0]) {
                        this.setState({topArtistsSec: this.state.topArtists});
                        this.setState({secUserLoggedIn: true});
                        sessionStorage.setItem(this.state.currentUser.name + "_saveFirstUserArtists", JSON.stringify(this.splitArray(this.state.topArtistsSec.items, true)));

                    }
                    this.printArtists();

                } else {
                    console.log("ERR: data could not be fetched");
                }
            })


    }

    /**
     * count login's
     **/
    countLogIns() {
        console.log(this.state.currentUser);
        this.setState({logIns: this.state.logIns + 1});
    }

    componentDidUpdate() {

        /**
         * pass data after the second user has logged in
         **/
        if (this.state.returnGenres[0] && this.state.callSecondArrrayOnce === false && Object.keys(sessionStorage).length > 5) {
            this.saveAllUserData();
            this.setState({callSecondArrrayOnce: true});
            let printMatches = false;
            this.printArtists(printMatches);
        }
    }

    gameLoop = () => {

        setTimeout(() => {
            requestAnimationFrame(this.gameLoop);
            this.setState({rotationSpeed: this.state.rotationSpeed + 0.001});
        }, 1000 / 30);

    }

    toggleClasses() {
        this.state.returnGenres[0] ? this.setState({canvasClasses: ""}) : this.setState({canvasClasses: ""});
        this.state.returnGenres[0] ? this.setState({positionClasses: "pos-absolute"}) : this.setState({positionClasses: "pos-absolute"});
    }

    setTheme(themeClass, i) {
        this.setState({themeClasses: "bg " + themeClass});
        this.setState({bgTheme: themeClass});
        let theme = document.getElementsByClassName("setTheme_theme");
        if (theme[i]) {
            theme[i].classList.add("currentTheme");
        }
        for (let j = 0; j < theme.length; j++) {
            if (!(i === j) && theme[j].classList.contains("setTheme_theme")) {
                theme[j].classList.remove("currentTheme");
            }
        }

    }

    switchSpheres() {


        let tempString;
        for (let key in Object.keys(sessionStorage)) {
            tempString = (Object.keys(sessionStorage)[0]);
            if(this.state.displayedUser.name === this.state.currentUser.name){
                this.setState({displayedUser: {
                    name: tempString,
                }});
            }else{
                this.setState({displayedUser: {
                    name: this.state.currentUser.name,
                }});
            }
        }


        if (this.state.returnGenres[0] && Object.keys(sessionStorage).length > 4) {
            this.state.sphereSwitch === false ? this.state.sphereSwitch = true : this.state.sphereSwitch = false;
            this.printArtists(this.state.callSecondSwitch);
            this.setState({callSecondSwitch: true});
        }

    }

    secondUserLoggedIn() {
        this.saveAllUserData();
    }

    render() {
        return (
            <div className="App">
                <div className={this.state.themeClasses}>
                    <div className="setTheme">
                        <p className={"headline-xxl-sub"}><strong>change theme:</strong></p>
                        <ul>
                            <li onClick={() => this.setTheme("rapgod", 0)} className={"setTheme_theme"}>rapgod</li>
                            <li onClick={() => this.setTheme("summervibes", 1)} className={"setTheme_theme"}>summervibes</li>
                            <li onClick={() => this.setTheme("indiegold", 2)} className={"setTheme_theme"}>indiegold</li>
                        </ul>
                    </div>


                    <div id="genresBox"></div>
                    <div className="blurVignette"></div>

                    <UserInfo positionClasses={this.state.positionClasses}
                    returnGenres={this.state.returnGenres} currentUser={this.state.displayedUser}/>




                    <div className={this.state.positionClasses}>
                        {this.state.returnGenres[0] &&
                        <div className={"switchbuttons"}>
                            <a href="/loginpage.html">
                                <button onClick={() => this.countLogIns()}>second user login</button>
                            </a>
                            <button className="switchButton" onClick={() => this.switchSpheres()}>switch</button>
                        </div>
                        }
                    </div>


                    <Canvas width={this.state.width} canvasClasses={this.state.canvasClasses}
                            height={this.state.height} returnGenres={this.state.returnGenres}
                            userOneData={this.state.userOneData}
                            sphereSwitch={this.state.sphereSwitch} bgTheme={this.state.bgTheme}
                    />
                </div>
            </div>
        );

    }
}

export default App;
