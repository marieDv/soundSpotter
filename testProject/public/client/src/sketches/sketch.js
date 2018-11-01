import {Sphere} from './sphere.js';

export default function sketch (p) {
    let rotation = 0;
    let genres = [];
    let userOneGenres = [];
    let setupCircles = true;
    let randomPos = [];
    let lastPosX = 0;
    let lastPosY = 0;

    var userOneLength =0;

    p.setup = function () {
        p.createCanvas(window.innerWidth, window.innerHeight);
        //, p.WEBGL



    };

    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
        if (props.rotation){
            rotation = props.rotation * Math.PI / 180;
        }

        if(props.genres){
            genres = props.genres;
        }

        if(props.userOneGenres){
            userOneGenres = props.userOneGenres;
            // console.log(userOneGenres[0].length);
        }

        for(let i=0; i<67;i++){
            // console.log("randomlänge");
            // randomPos[i] = p.random(-200, 200);
            randomPos[i] = p.random(-20, 20);
        }
        // userOneLength = userOneGenres[0].length;
        // console.log(userOneLength);

    };

    p.drawGenresCircles = function (){
        if(setupCircles){
        // for(let i=0; i<genres[0].length; i++){
            for(let key in genres[0]){
             // console.log("entered" +genres[0][key] +key);
                p.push();

                p.ellipse(genres[0][key], genres[0][key], 20);
                p.pop();
            // console.log("drawing an ellipse yaay");
            if(genres[0][key] === 3){
                setupCircles = false;
            }
        }}
        // setupCircles = false;
    }

    p.draw = function () {
        p.background(40);
        p.noStroke();
        p.push();
        let i=0;
        let j=randomPos.length-1;



        for(let key in genres[0]){

            p.noStroke();
            //////////////////////////////////////////////////////////
            //web gl:
            // p.ellipse(((randomPos[i]-genres[0][key]*20))+200, randomPos[j]*10, (genres[0][key]*5));
            sphere(genres, key, key[i], i, j, 900);

            i++;
            j--;

        }
        let iOne=0;
        let jTwo=45;

        for(let key in userOneGenres[0]){
            p.noStroke();
            //////////////////////////////////////////////////////////
            //web gl:
            // p.ellipse(((randomPos[iOne]-userOneGenres[0][key]*20)-300), randomPos[jTwo]*10, (userOneGenres[0][key]*5));


            sphere(userOneGenres, key, key[iOne], iOne, jTwo, 400);

            iOne++;
            jTwo--;

        }

            p.drawGenresCircles();
        p.pop();
    };

    function sphere(array, key, value, i, j, pos) {

        //compare the data to the second array to save pos for connection
        // for(let compareKey in genres[0]){
        //     // if(key === compareKey){
        //     //     p.line((randomPos[i]-array[0][key]*20)+pos), ((randomPos[j]*10)+300), ((randomPos[i]-array[0][key]*20)+900), ((randomPos[j]*10)+300));
        //
        //         p.stroke(255);
        //         // p.line(200, 300, 900, 200);
        //     }
        // }

        var lastConnect = key-1;
        p.text(key, (randomPos[i]-array[0][key]*20)+(pos+15), (randomPos[j]*10)+300);
        p.ellipse(((randomPos[i]-array[0][key]*20)+pos), (randomPos[j]*10)+300, (array[0][key]*5));


        // this.connect = function() {
        //     console.log("asdsad");
        //     // if(lastConnect === key){
        //     //     p.line(agents[i].pos.x, agents[i].pos.y, agents[i].lastPos.x, agents[i].lastPos.y);
        //     //
        //     // }
        // };
    }
};