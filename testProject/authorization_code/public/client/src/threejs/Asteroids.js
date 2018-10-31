import React, { Component } from 'react';
import * as THREE from 'three';
import PropTypes from 'prop-types';

var counter = 0,
    group = new THREE.Object3D();

class Asteroids extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

        for(let i=0; i<20; i++){
            this.createAsteroid(this.context.scene);
        }

        this.context.scene.add(group);

    }
    createAsteroid(scene){
        var geometry = new THREE.SphereBufferGeometry(
            (Math.random(1.5, 11.5)),
            2,
            2);
        "#fbf9ff"


        var mat = new THREE.MeshPhongMaterial({
            color: new THREE.Color(0x08070F),
            transparent: true,
            shininess: 0.1,
            side: THREE.DoubleSide,
        });

        var mesh = new THREE.Mesh(geometry, mat);
        mesh.name = "asteroid"+counter;
        mesh.geometry.verticesNeedUpdate = true;
        mesh.matrixAutoUpdate  = true;
        mesh.position.set(Math.floor(Math.random() * (20 - 90)) + 30,
            Math.floor(Math.random() * (20 - 90)) + 30,
            Math.floor(Math.random() * (20 - 90)) + 30);
        counter++;
        mesh.rotation.x = (Math.random() * (20 - 90));
        group.add(mesh);



    }
    componentWillReceiveProps() {
        group.rotation.y +=0.002;
    }

    render() {
        return null;
    }

}
const render = () => {
    requestAnimationFrame(render);
    this.loop();
};
Asteroids.contextTypes = {
    scene: PropTypes.object,
    renderer: PropTypes.object
}

export default Asteroids;