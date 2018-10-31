import React, {Component} from 'react';
import './App.css';
import P5Wrapper from 'react-p5-wrapper';
import sketch from './sketches/sketch';
import Base from './threejs/Base';
import Asteroids from './threejs/Asteroids';
import Camera from './threejs/Camera';
// import OrbitControls from 'expo-three-orbit-controls';
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

    updateDimensions() {
        this.setState({width: window.innerWidth, height: window.innerHeight});
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


////////////////////////////////////////////////////////////////////////////////////////////////////
//////// CLICK EVENT LISTENER FOR TEXT ZOOM PER ARTISTS
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


        const script2 = document.createElement("script");
        script2.src = "https://use.typekit.net/foobar.js";
        script2.async = true;
        document.body.appendChild(script2);
    }

////////////////////////////////////////////////////////////////////////
//init functions
    init() {

        this.getTopArtists();
        this.toggleClasses();
    }

////////////////////////////////////////////////////////////////////////
//get has for access
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

////////////////////////////////////////////////////////////////////////
//get currently playing track
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

////////////////////////////////////////////////////////////////////////
//safe favorite genres to two dimensional array
    printArtists(reprintMatches) {

        var string = "";
        var genres = "";
        var rap = 0;
        var secArray = null;
        var secondArray = [];

        //second user logged in … print second sphere info
        if (this.state.sphereSwitch && this.state.returnGenres) {

            for (let key in Object.keys(sessionStorage)) {
                console.log(Object.keys(sessionStorage)[key]);
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
                            // +" genre: " +this.state.topArtists.items[i].genres
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
                // +"genres:</br>rap:"+rap;
                var msoloGenres = genres.split(",");
                soloGenre.push(msoloGenres);

////////////////////////////////////////////////////////////////////////
//CATEGORY PRINT
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

////////////////////////////////////////////////////////////////////////
//COUNT ARTISTS GENRES AND SAFE THEM TO AN ASSOCIATIVE ARRAY
// @returnGenres
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

////////////////////////////////////////////////////////////////////////
//SAVE USER DATA TO SESSIONSTORAGE
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
        console.log("USERONEDATA:");
        console.log(this.state.userOneData[0]);

    }

    splitArray(array, v) {
        let value = [];
        let i = 0;


        // console.log(this.state.returnGenres[0]);
        for (let key in array) {
            value[i] = (v === true ? array[key] : key);
            i++;
        }

        return value;
    }

///////////////////////////////////////////////////////
//connect to spotify web api and safe data to topArtist
    getTopArtists() {


        spotifyWebApi.getMe()
            .then((response) => {
                this.setState({
                    currentUser: {
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

////
//// COUNT NUMBER OF LOG INS
    countLogIns() {
        this.setState({logIns: this.state.logIns + 1});
        console.log("LOG INS:");
        console.log(this.state.logIns);


    }

    componentDidUpdate() {

///////////////////////////////////////////////////////
///// PASS DATA AFTER SECOND USER HAS LOGGED IN
        if (this.state.returnGenres[0] && this.state.callSecondArrrayOnce === false && Object.keys(sessionStorage).length > 5) {
            this.saveAllUserData();
            this.setState({callSecondArrrayOnce: true});
            let printMatches = false;
            this.printArtists(printMatches);
        }
    }

    gameLoop = () => {

        setTimeout(() => {
            const {rotationSpeed} = this.state;
            requestAnimationFrame(this.gameLoop);
            this.setState({rotationSpeed: this.state.rotationSpeed + 0.001});
        }, 1000 / 30);

    }

    toggleClasses() {
        console.log("toggleCLasses");
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
                        <p className={"headline-xxl-sub"}><strong>change theme</strong></p>
                        <ul>
                            <li onClick={() => this.setTheme("rapgod", 0)} className={"setTheme_theme"}>rapgod</li>
                            <li onClick={() => this.setTheme("summervibes", 1)} className={"setTheme_theme"}>
                                summervibes
                            </li>
                            <li onClick={() => this.setTheme("indiegold", 2)} className={"setTheme_theme"}>indiegold
                            </li>

                        </ul>
                    </div>
                    <div className="playing">
                        {/*Now Playing: {this.state.nowPlaying.name}*/}
                    </div>
                    <div className="">
                        <img src={this.state.nowPlaying.albumArt} alt="" width="100px"/>
                    </div>
                    <div className="playing">
                        {/*Favorite Artist: {this.state.topArtists.genres}*/}
                        {/*<ul id={"allArtists"}>*/}

                        {/*</ul>*/}

                    </div>
                    <div className={"greetings"}>
                        {/*<h1 id={"allArtists"} className={"headline-xxl-sub"}></h1>*/}
                        {!this.state.currentUser.name &&
                        <div>
                            {/*<h2 className={"headline-xxl-sub"}>favorite artists:</h2>*/}

                        </div>
                        }
                        {(this.state.currentUser.name || this.state.returnGenres[0]) &&
                        <div>
                            {/*<h2 className={"headline-xxl-sub"}>favorite artists:</h2>*/}
                            {/*<h1 id={"allArtists"} className={"headline-xxl-sub"}></h1>*/}
                            {/*{this.state.returnGenres[0] &&*/}
                            {/*<h2 id="matches" className={"headline-xxl-sub"}>matches:</h2>*/}
                            {/*}*/}

                        </div>
                        }
                    </div>
                    <div id="genresBox"></div>
                    <div className="blurVignette"></div>
                    <div className={this.state.positionClasses}>
                        <div className={"greetings"}>
                            <h1 id={"allArtists"} className={"headline-xxl-sub  t-indent"}></h1>
                            {this.state.returnGenres[0] &&
                            <h2 id="matches" className={"headline-xxl-sub t-indent"}>matches:<br/></h2>
                            }
                        </div>
                        {!this.state.returnGenres[0] &&
                        <div>
                            <h2 className={"headline-xxl-sub t-indent"}>connect through</h2>
                            <h1 className={"headline-xxl t-indent"}>SOUND</h1>
                        </div>
                        }


                        {this.state.currentUser.name &&
                        <h1 className={"headline-xl"}><em className={"emphasized"}>{this.state.currentUser.name}'s</em>
                            favorite music</h1>
                        }
                        {!this.state.currentUser.name &&
                        <h1 className={"headline-xl"}><em className={"emphasized"}>see your</em> favorite music</h1>
                        }

                        <h2 className={"headline-lg"}>- done with the Spotify WEB API -</h2>
                        <h2 className={"headline-lg"}> © marie dvorzak </h2>
                        <br></br>
                        {!this.state.returnGenres[0] &&
                        <a href="http://localhost:8888">
                            <button onClick={() => this.countLogIns()}><p className={"text-login"}>Login with
                                Spotify</p></button>
                        </a>
                        }
                        {this.state.returnGenres[0] &&
                        <div>
                            <a href="http://localhost:8888">
                                <button onClick={() => this.countLogIns()}>second user login</button>
                            </a>
                            <button className="switchButton" onClick={() => this.switchSpheres()}>switch</button>
                        </div>
                        }


                    </div>


                        <div className={this.state.canvasClasses}>
                        <Base width={this.state.width} height={this.state.height}
                        genres={this.state.returnGenres} userOneGenres={this.state.userOneData}
                        switch={this.state.sphereSwitch} setTheme={this.state.bgTheme}
                        >
                        <Camera fov={415}
                        near={4}
                        aspect={this.state.width / this.state.height}
                        far={600}
                        position={{x: 0, y: 0, z: 40}}></Camera>
                        <Asteroids></Asteroids>
                        </Base>
                        </div>

                    {/* <P5Wrapper sketch={this.state.stateSketch} genres={this.state.returnGenres} userOneGenres={this.state.userOneData}/>*/}

                    {this.state.loggedIn &&
                    <div>

                    </div>
                    }
                </div>
            </div>
        );

    }
}

export default App;
