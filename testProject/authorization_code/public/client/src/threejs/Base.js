import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import * as THREE from 'three';
import PropTypes from 'prop-types';
import ScriptTag from 'react-script-tag';
import OrbitControls from './OrbitControls';

// import * as noise from './perlin.js';



var config = {
    frequenz: 1.20, //1.4 for wobble waves 0.2 for sublte rings 0.1 for extreme rings
    speed: 1220, // + slower
    radius: 10,
    widthSeg: 20, //resolution x
    heightSeg: 20, // resolution y
    magnitude:5,
    waveDepth: 0.04
};

let rot = 0;


var counter = 0,
    bgSphere = null,
    bgSphereTwo = null,
    time = 0,
    receiveOnce = 0,
    receiveTwo = 0,
    receiveSecUser = 0,
    secUserLoggedIn = false,
    createdText = false,
    createdTextTwo = false,
    value2d,
    start = Date.now(),
    countup = 1,
    pointLight = null,
    warpVector = new THREE.Vector3(0, 50, 0),
    group = new THREE.Object3D(),
    groupTwo = new THREE.Object3D(),
    groupSpheres = new THREE.Object3D(),
    setColorOnce = false;

class Base extends Component {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true  });



    // controls = new THREE.OrbitControls( this.context.camera );
    constructor(){
        super();
        this.state = {
            width: window.innerWidth,
            height: window.innerHeight,
            firstUserGenres: [],
            secondUserGenres: [],
            speed: null,

        }
    }
    componentDidMount(){

        const { width, height, genres, userOneGenres } = this.props;
        this.updateThree(this.props);
        var screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        this.updateThree(this.props);
        this.renderer.shadowMapEnabled = true;
        this.renderer.shadowMapType = THREE.PCFSoftShadowMap;
        this.renderer.gammaInput = true;
        this.renderer.gammaOutput = true;


        const camera =  buildCamera(screenDimensions);
        this.renderer.setSize(screenDimensions);
        this.refs.anchor.appendChild(this.renderer.domElement);
        this.renderer.render(this.scene, camera);


        function buildCamera({ width, height }) {
            const aspectRatio = width / height;
            const fieldOfView = 60;
            const nearPlane = 4;
            const farPlane = 100;
            const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
            camera.position.z = 40;
            return camera;
        }
        function onWindowResize(renderer) {
            screenDimensions.width = window.innerWidth;
            screenDimensions.height = window.innerHeight;
            camera.aspect = screenDimensions.width / screenDimensions.height;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);

        }
        onWindowResize(this.renderer);
        window.addEventListener( 'resize', onWindowResize(this.renderer), false );



        light(this.scene);
        function light(scene){
            const lightIn = new THREE.PointLight("#fff", 1, 0.0, 0.0000001);
            const lightFront = new THREE.DirectionalLight( "#cdd2ff", 0.8, 0.2 );
            const lightOut = new THREE.AmbientLight( "#583d52", 0.7 );
            "#FF5D96"


            const lightRightRim = new THREE.DirectionalLight( "#ec8dff", 3, 0.7 );
            lightRightRim.position.set(50,-40,-50);
            lightRightRim.rotation.y +=100;
            let helper = new THREE.DirectionalLightHelper( lightRightRim, 2 );
            // scene.add(helper);
            scene.add(lightRightRim);


            const lightLeftRim = new THREE.DirectionalLight( "#726a75", 3, 0.7 );
            lightLeftRim.position.set(-50,-40,-50);
            lightLeftRim.rotation.y +=100;
            let helper2 = new THREE.DirectionalLightHelper( lightLeftRim, 3 );
            // scene.add(helper2);
            scene.add(lightLeftRim);


            const lightBackRim = new THREE.DirectionalLight( "#fff9fb", 10, 0.7 );
            lightBackRim.position.set(30,-10,-58);
            lightBackRim.rotation.x =-6;
            let helper3 = new THREE.DirectionalLightHelper( lightBackRim, 3 );
            // scene.add(helper3);
            scene.add(lightBackRim);

            const lightRedRim = new THREE.DirectionalLight( "#ff7f80", 10, 0.7 );
            lightRedRim.position.set(30,-30,-78);
            lightRedRim.rotation.x =-6;
            let helper4 = new THREE.DirectionalLightHelper( lightBackRim, 3 );
            // scene.add(helper4);
            scene.add(lightRedRim);


            pointLight = new THREE.PointLight( "#a8cbff",3, 20 );
            pointLight.position.set( 10, 20, 10 );
            var sphereSize = 1;
            var pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
            // scene.add( pointLightHelper );
            scene.add( pointLight );




            lightOut.position.set(40,20,40);
            lightIn.position.set(-110,-100,-190);
            lightFront.position.set(40,40,40);


            scene.add(lightIn);//side filler
            scene.add(lightOut);//ambientlight
            scene.add(lightFront);
        }

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// ORBIT CONTROLS
//         const controls = new OrbitControls(camera, ReactDOM.findDOMNode(this.refs.react3));
//         controls.rotateSpeed = 1.0;
//         controls.zoomSpeed = 1.2;


        document.addEventListener("click", function(event){
            let textGenres = document.getElementsByClassName("genre");
            let textGenresTwo = document.getElementsByClassName("genreTwo");
            searchMatch(textGenres);
            searchMatch(textGenresTwo);
            function searchMatch(textGenres){
            for(let i=0; i<textGenres.length; i++){
              let textBox = textGenres[i].getBoundingClientRect();
              if(event.clientX > textBox.left && event.clientX < textBox.right &&
                 event.clientY > textBox.top && event.clientY < textBox.bottom){
                   // console.log(event.clientX + "   " +textBox.left)
                  // textGenres[i].style.color = "#000";
                   textGenres[i].classList.add("boldGenre");
              }
          }
            }
        });




        // console.log(bgSphere.geometry.vertices);
        if(this.props.genres){
            this.setState({firstUserGenres: this.props.genres}, this.forceUpdate());
            // console.log("firstusergenres" + this.state.firstUserGenres);
        }
        if(this.props.userOneGenres){
            this.setState({secondUserGenres: this.props.userOneGenres}, this.forceUpdate());
            // console.log("secondusergenres" + this.state.firstUserGenres);
        }

        this.gridSphere(this.scene);
        groupSpheres.add(bgSphere);
        groupSpheres.add(group);
        this.scene. add(groupSpheres);
        // this.gameLoop(this.renderer, this.scene, this, this.state.speed);


    }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////// CREATE GENRE TEXT
    createText(key, size, secUser){
        let fontSize= 3+(size[key]*3);
        let text2 = document.createElement('span');
        if(!secUser){text2.classList.add("genre");}else{text2.classList.add("genreTwo");}
        text2.style.position = 'absolute';
        text2.style.width = 100+"%";
        text2.style.height = 100;
        text2.style.fontSize = fontSize+"px";
        text2.innerHTML =key;
        let div = document.getElementById("genresBox");
        div.appendChild(text2);
        // let span = document.createElement('span');
        // text2.parentNode.insertBefore(span, text2);
        // span.classList.add("genreSpan");
        // span.appendChild(text2);
    }
    componentDidUpdate(){
        // if(setColorOnce){
        if(this.props.setTheme){
        if(this.props.setTheme === "rapgod"){
            "#000"
            bgSphere.material.color.setHex( 0x191919 );
            if(bgSphereTwo){bgSphereTwo.material.color.setHex( 0x191919 );}
        }
            if(this.props.setTheme === "indiegold"){
                "#d0e930"
                bgSphere.material.color.setHex( 0xe99e11 );
                if(bgSphereTwo){bgSphereTwo.material.color.setHex( 0x7D4FE9 );}
            }
        if(this.props.setTheme === "summervibes"){
            "#e97b0c"
            bgSphere.material.color.setHex( 0xfdfff8 );
            if(bgSphereTwo){bgSphereTwo.material.color.setHex( 0x00D6FD );}
        }}


        if(this.props.switch){
            groupSpheres.rotation.y = 160.9;
            groupSpheres.position.x = 10;
            groupSpheres.position.z = -10;

        }else{
            groupSpheres.position.x = 0;
            groupSpheres.position.z = 0;
            groupSpheres.rotation.y = -150;
        }
    }
    componentWillReceiveProps(){
        let i = 0;
        let j = 75;

        if(secUserLoggedIn === false){
            if(this.props.userOneGenres[0]){receiveSecUser = 1; secUserLoggedIn = true;}
        }

        if(receiveOnce <1 || receiveSecUser === 1){


            if(this.props.userOneGenres[0]){
                for(let key in this.props.userOneGenres[0]) {
                    this.sphere(this.props.userOneGenres[0], key, key[i], i, j, 900, this.scene);
                    receiveSecUser++;
                    if(createdTextTwo === false){
                        this.createText(key, this.props.userOneGenres[0], true);
                    }
                    if(i === 45){ createdTextTwo = true;}
                }
            }

        if(this.props.genres[0]){
            for(let key in this.props.genres[0]){
                this.sphere(this.props.genres[0], key, key[i], i, j, 900, this.scene);
                if(createdText === false){
                    this.createText(key, this.state.firstUserGenres[0], false);
                }
                i++;
                j--;
                // console.log(this.props.genres[0].length +"" +i);
                if(i === 45){ createdText = true;}
            }

            receiveOnce++;

        }

        }

//////////////////////////////////////////////////////////////////////////////////////////
////////////ON SECOND USER LOG IN

        if(this.props.userOneGenres[0]){

            if(receiveTwo <1){
                if(this.props.genres[0]){


                    if (this.props.genres[0]) {


                        var geo = new THREE.IcosahedronGeometry(9, 1);


                        geo.verticesNeedUpdate = true;
                        "#fd9dfa"
                        "#282631"
                        var mat = new THREE.MeshPhongMaterial({
                            color: new THREE.Color(0x00D6FD),
                            transparent: true,
                            shininess: 2,
                            alphaTest: 0.5,
                            shading: THREE.FlatShading,
                            side: THREE.DoubleSide,

                        });


                        bgSphereTwo = new THREE.Mesh(geo, mat);

                        groupTwo.position.x =18;
                        bgSphereTwo.position.x =18;


                        groupSpheres.add(bgSphereTwo);
                        groupSpheres.add(bgSphere);
                        groupSpheres.add(groupTwo);

                        // groupSpheres.position.x -= 10;
                        // groupSpheres.position.z -= 10;


                        // console.log(groupSpheres.children);
                        // this.scene.add(groupSpheres);
                    }





                    for(let key in this.props.genres[0]){
                        let i=0;
                        let textGenres = document.getElementsByClassName("genre");
                        let textGenresTwo = document.getElementsByClassName("genreTwo");

                        for(let secondKey in this.props.userOneGenres[0]){
                            let same = false;
                            if(key === secondKey){
                                same = true;

                                if(textGenres[i]){
                                    textGenres[i].style.color = "#7CFF6C";
                                    textGenresTwo[i].style.color = "#7CFF6C";
                                }

                                if(group.children[i]){
'#FFC9F5'
                                    group.children[i].material.color.setHex(0x7CFF6C);
                                    group.children[i].colorsNeedUpdate = true;
                                    groupTwo.children[i].material.color.setHex(0x7CFF6C);
                                    groupTwo.children[i].colorsNeedUpdate = true;
                                }
                            }

                        // this.sphere(this.state.firstUserGenres[0], key, key[i], i, j, 900, this.scene, group, same);
                        i++;
                        j--;
                        }
                    }
                    receiveTwo++;
                }
        }}

        this.wave(bgSphere);
        if(this.props.userOneGenres[0]){
            this.wave(bgSphereTwo);
        }

        bgSphere.rotation.x +=0.003;
        bgSphere.rotation.y += 0.0004;
        group.rotation.y += 0.0004;
        group.rotation.x += 0.003;
        if(this.props.userOneGenres[0]){
        bgSphereTwo.rotation.x -=0.003;
        bgSphereTwo.rotation.y -= 0.0004;
        groupTwo.rotation.y -= 0.0004;
        groupTwo.rotation.x -= 0.003;
        }
        groupSpheres.rotation.y -= 0.001;
        // groupSpheres.rotation.x -= 0.001;
        // groupSpheres.rotation.z += 0.001;

        group.__dirtyPosition = true;


        // group.rotateOnAxis(axis,90);

        this.mapSpheres(group, bgSphere);
    }
    mapSpheres(group, bgSphere) {
        const { radius } = config;
        if (group.children.length > 1) {
            var textGenres = document.getElementsByClassName("genre");
            var textGenresTwo = document.getElementsByClassName("genreTwo");


            //show only genres, if enough vertices are available
            if (bgSphere.geometry.vertices.length < textGenres.length) {
                let overcount = textGenres.length - bgSphere.geometry.vertices.length;
                for (let i = 1; i < overcount + 1; i++) {
                    textGenres[textGenres.length - i].style.opacity = 0.0;
                }
            }

            if (this.props.userOneGenres[0] && bgSphereTwo.geometry.vertices.length < textGenresTwo.length) {
                let overcount = textGenresTwo.length - bgSphereTwo.geometry.vertices.length;
                for (let i = 1; i < overcount + 1; i++) {
                    textGenresTwo[textGenresTwo.length - i].style.opacity = 0.0;
                }
            }



            let countSphereVertices = 0;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// MAP SPHERES TO BGSPHERE
            for (let i = 0; i < group.children.length; i++) {
                if (group.children[i] && bgSphere.geometry.vertices[countSphereVertices]) {
                    group.children[i].position.set(((bgSphere.geometry.vertices[countSphereVertices].x)), (bgSphere.geometry.vertices[countSphereVertices].y), (bgSphere.geometry.vertices[countSphereVertices].z));
                    if(this.props.userOneGenres[0]  && bgSphereTwo.geometry.vertices[countSphereVertices]){
                        groupTwo.children[i].position.set(((bgSphereTwo.geometry.vertices[countSphereVertices].x)), (bgSphereTwo.geometry.vertices[countSphereVertices].y), (bgSphereTwo.geometry.vertices[countSphereVertices].z));
                        groupTwo.children[i].geometry.verticesNeedUpdate = true;
                    }
                    updateText(textGenres[i], this.props.userOneGenres[0], textGenresTwo[i]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// UPDATE TEXT POSITION FOR BOTH SPHERES
                    function updateText(textGenre, userTwoGenres, textGenreTwo){

                        if (textGenre) {
                            let vector = new THREE.Vector3();
                            vector.setFromMatrixPosition(group.children[i].matrixWorld);

                            if (pointLight) {
                                pointLight.position.set(vector.x, vector.y, vector.z);
                            }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// FIRST USER SPHERE MAPPING

                            if (!userTwoGenres) { //before user two has logged in
                            if (textGenre.innerHTML === group.children[i].name.slice(4)) {
                                textGenre.style.marginLeft = ((vector.x) * radius * 2) + "px";
                                textGenre.style.marginTop = (vector.y * radius * 2) * (-1) + "px";
                            }
                                if (vector.z > 5 && textGenre.innerHTML === group.children[i].name.slice(4)) {
                                    textGenre.style.opacity = 1;
                                } else if (vector.z > 5 && vector.z < 5) {
                                    textGenre.style.opacity = 0.2;
                                }
                                else {
                                    textGenre.style.opacity = 0.0;
                                }

                            }else{ //if user two has logged in

                                if (textGenre.innerHTML === group.children[i].name.slice(4)) {
                                    textGenre.style.marginLeft = ((vector.x) * radius * 2.4) + "px";
                                    textGenre.style.marginTop = (vector.y * radius * 2) * (-1) + "px";

                                }
                                if (vector.z > 2 && textGenre.innerHTML === group.children[i].name.slice(4)) {
                                    textGenre.style.opacity = 1;
                                }
                                else if (vector.z > 2 && vector.z < 2) {
                                    textGenre.style.opacity = 0.2;
                                }
                                else {
                                    textGenre.style.opacity = 0.0;
                                }
                            }
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////// SECOND USER SPHERE MAPPING
                            if (userTwoGenres) {

                                let vectorTwo = new THREE.Vector3();
                                vectorTwo.setFromMatrixPosition(groupTwo.children[i].matrixWorld);


                                if (textGenreTwo.innerHTML === groupTwo.children[i].name.slice(4)) {
                                    textGenreTwo.style.marginLeft = ((vectorTwo.x) * radius * 2.4) + "px";
                                    textGenreTwo.style.marginTop = (vectorTwo.y * radius * 2.8) * (-1) + "px";
                                    // textGenreTwo.style.color = "#41a4ff";

                                }
                                if (vectorTwo.z > 5 && textGenreTwo.innerHTML === groupTwo.children[i].name.slice(4)) {
                                    textGenreTwo.style.opacity = 1;
                                }
                                else if (vectorTwo.z > 5 && vector.z < 6) {
                                    textGenreTwo.style.opacity = 0.2;
                                }
                                else {
                                    textGenreTwo.style.opacity = 0.0;
                                }

                            }
                            }//end "if text genre"


                    }

                    countSphereVertices += 1;
                }
            }
            rot += 0.000001;
        }
    }


    wave(mSphere){
        const { vertices } = mSphere.geometry;
        const { frequenz, speed, radius, magnitude, waveDepth } = config;

        for (let i = 0; i < vertices.length; i++) {
            const v = vertices[i];
            const dist = v.distanceTo(warpVector);
            let waveToUse = (0.8 + (waveDepth*3) * Math.sin(dist / -frequenz + (time/speed*magnitude))) * radius;

            v.normalize().multiplyScalar(waveToUse);

        }

        mSphere.geometry.verticesNeedUpdate = true;

        const warpSine = (Math.sin(time/(speed * 8))) * (radius * 2);
        warpVector.z = warpSine;

        mSphere.geometry.computeVertexNormals();
        mSphere.geometry.computeFaceNormals();
        mSphere.geometry.verticesNeedUpdate = true;
        mSphere.geometry.elementsNeedUpdate = true;
        mSphere.geometry.normalsNeedUpdate = true;
        time++;
    }
    gridSphere(scene) {
        const {widthSeg, heightSeg, radius} = config;

        var geo = new THREE.SphereGeometry(
            radius,
            widthSeg,
            heightSeg);

        // var geo = new THREE.IcosahedronGeometry( (7*Math.random()), 2 );
        var geo = new THREE.IcosahedronGeometry(9, 1);
        // var geo = new THREE.SphereGeometry( 13, 13, 5 );

        geo.verticesNeedUpdate = true;

        var customUniforms = {
            time: { // float initialized to 0
                type: "f",
                value: 0.0
            },
            "color1": {
                type: "c",
                value: new THREE.Color(0xfd9dfa)
            },
            "color2": {
                type: "c",
                value: new THREE.Color(0xffb948)
            },
            light: {type: 'v3', value: new THREE.Vector3()},


        };

        var uniforms = {
            time: {type: "f", value: 1.0},
            resolution: {type: "v2", value: new THREE.Vector2()}
        };
        // var mat = new THREE.ShaderMaterial({
        //     uniforms: customUniforms,
        //     vertexShader: document.getElementById('vertexShader').textContent,
        //     fragmentShader: document.getElementById('fragmentShader').textContent,
        //     // lights: true,
        //     // wireframe: true,
        // });
        // mat.uniforms['time'].value = .0025 * ( Date.now() - start );
        // mat.needsUpdate = true;
        "#fd9dfa"
        "#fdfff8"
        // FD4686
        var mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0xfdfff8),
            transparent: true,
            shininess: 2,
            alphaTest: 0.5,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
            // wireframe: true
        });

        geo.dynamic = true;
        mat.verticesNeedUpdate = true;


        bgSphere = new THREE.Mesh(geo, mat);
        bgSphere.castShadow = true;
        bgSphere.receiveLights = true;
        bgSphere.geometry.dynamic = true;


        bgSphere.material.verticesNeedUpdate = true;
        bgSphere.geometry.verticesNeedUpdate = true;
        bgSphere.updateMatrix();



    }
    sphere(array, key, value, i, j, pos,scene, same) {
        var geometry = new THREE.SphereBufferGeometry(
            (array[key]/8),
            4,
            4);
        "#FF6846"
        "#32DFFF"
        if(key === "indietronica"){
        }
        var color = 0x454347;
        switch(array[key]) {
            case (1 || 2):
                color = 0x363339;
                break;
            case (3):
                color = 0x454347;
                break;
            case (4 || 5 || 6):
                color = 0xE1E1E6;
                break;
            case (7 || 8 || 9):
                color = 0xA8A1A5;
                break;
            case(10 || 11 || 12 || 13 || 14 || 15):
                color = 0xE0DFEA;
                break;
            default:

        }
"#ce0093"
        if(same){

            color = 0xce0093;
        }
        // if(key === "indie poptimism"){
        //     // color = 0xFD4800;
        // }if(key === "vapor soul"){
        //     color = 0xffffff;
        // }
        // if(key === "westcoast rap"){
        //     color = 0xce0093;
        // }
        var mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(color),
            transparent: true,
            shininess: 2,
            side: THREE.DoubleSide,
            shading: THREE.FlatShading,
        });

        var mesh = new THREE.Mesh(geometry, mat);
        mesh.name = "mesh"+key;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.matrixAutoUpdate  = true;

        if(this.props.userOneGenres[0]){
            mesh.position.x += 5.5;
            groupTwo.add(mesh);
        }else{group.add(mesh);}


        counter+=0.5;




    }
    line(scene, x1, y1, z1, x2, y2, z2){
        var material = new THREE.LineBasicMaterial({
            color: 0x2529FD,
            linewidth: 10,
        });

        var geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3( x1, y1, z1 ),
            new THREE.Vector3( x2, y2, z2 )
        );

        var line = new THREE.Line( geometry, material );
        line.linewidth = 7;
        group.add( line );
        // scene.add( line );
    }


    updateThree(props) {
        const { width, height } = props;
    }

    onWindowResize(renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);

    }
    getChildContext() {
        return {
            scene: this.scene,
            renderer: this.renderer
        }
    }
    render(){
        window.addEventListener( 'resize', this.onWindowResize(this.renderer), false );
        return (
            <div ref="anchor">
                <ScriptTag isHydrating={true} type="x-shader/x-vertex" id="">
                    {/*void main()	{*/}
                    {/*gl_Position = vec4( position, 1.0 );*/}
                {/*}*/}
                </ScriptTag>
                {this.props.children}
            </div>

        );
    }
}
Base.childContextTypes = {
    scene: PropTypes.object,
    renderer: PropTypes.object
}
const render = () => {
    requestAnimationFrame(render);
    this.loop();

    this.controls.update();

};

export default Base;