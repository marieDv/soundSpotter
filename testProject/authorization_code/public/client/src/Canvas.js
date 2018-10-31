/**
 * setup for the Three.js model
 * includes: Base, Camera, Asteroids
 **/

import React, { Component } from 'react';
import Base from './threejs/Base';
import Asteroids from './threejs/Asteroids';
import Camera from './threejs/Camera';

class Canvas extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render(){
        return(
        <div className={this.props.canvasClasses}>
            <Base width={this.props.width} height={this.props.height}
                  genres={this.props.returnGenres} userOneGenres={this.props.userOneData}
                  switch={this.props.sphereSwitch} setTheme={this.props.bgTheme}
            >
                <Camera fov={415}
                        near={4}
                        aspect={this.props.width / this.props.height}
                        far={600}
                        position={{x: 0, y: 0, z: 40}}></Camera>
                <Asteroids></Asteroids>
            </Base>
        </div>
        )}
}


export default Canvas;