import React, { Component } from 'react';
import TrackballControls from './TrackballControls';

import Bg3dParam from './Bg3dParam';
import * as THREE from 'three';

const ctx = initCanvasText();
const debug = false;

function initCanvasText() {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.canvas.width = 200;
    ctx.canvas.height = 200;
    ctx.font = '12px Arial';
    document.body.appendChild(ctx.canvas);
    return ctx;
}
class Bg3d extends Component {
    constructor(props) {
        super(props)
        this.state = {
            image2Dsrc: props.image2Dsrc,
            epaisseurBase: 4,
            couleurFond: 0xffffff,
            nbPoints: 20
        }
        this.initImageData(props.image2Dsrc);
        this.updateParam = this.updateParam.bind(this);
    }

    componentDidMount() {
        const width = 2 * this.mount.clientWidth;
        const height = 2 * this.mount.clientHeight;

        //ADD SCENE
        this.scene = new THREE.Scene();
        //ADD CAMERA
        this.camera = new THREE.PerspectiveCamera(
            100,
            1,
            0.1,
            5000
        );
        // Grosseur initiale de l'objet
        this.camera.position.z = 400;
        //ADD RENDERER 
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#110000');
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        //ADD CROISEE        
        this.create3D();
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.initControls();
        this.start();
    }

    cubes;
    imageData;
    w;
    h;
    initImageData(idCanvas) {
        console.log("Init 3D", idCanvas);
        var canvas1 = document.getElementById(idCanvas);
        console.log("canvas1 ", canvas1);
        console.log("canvas1 width ", canvas1.width);
        console.log("canvas1 height ", canvas1.height);
        this.w = canvas1.width;
        this.h = canvas1.height;
        var ctx2 = canvas1.getContext('2d');
        this.imageData = ctx2.getImageData(0, 0, this.w, this.h);
        console.log("Init 3D canvas1 ", canvas1);
        console.log("Init 3D canvas1 ctx ", ctx2);

        console.log("Init 3D w " + this.w + "  h: " + this.h);
    }

    init2D23D() {
        var nbPoints = this.state.nbPoints;
        console.log("nbPoints ::",nbPoints);
        var kk = Math.round(this.w / nbPoints);

        var rangee;
        for (var i = 0; i < this.w; i = i + kk) {
            var cube_z_1;
            for (var j = 0; j < this.h; j = j + kk) {
                var pixel = this.getPixelXY(this.imageData, i, j);
                //console.log("pixelA   0h" + pixel.toString(16) + "  fond: " + this.isFondImage(pixel));
                if (!this.isFondImage(pixel)) {

                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
                    var epaisseur = 4 + Math.floor(this.state.epaisseurBase * pixel / 0xffffff);
                    const cubeGeometry = new THREE.BoxGeometry(kk, kk, 2 * epaisseur);
                    cubeGeometry.translate(i, j, epaisseur);
                    const cube = new THREE.Mesh(cubeGeometry, material);

                    if (cube_z_1) {
                        cube.add(cube_z_1);
                    }
                    cube_z_1 = cube;
                }
            }
            if (rangee) {
                if (cube_z_1) {
                    cube_z_1.add(rangee);
                }
            }
            if (cube_z_1) {
                rangee = cube_z_1;
            }
            cube_z_1 = null;

        }
        console.log("Pixels ::: h :" + this.h + "  w: " + this.w + "  kk :" + kk + "  rangee :", rangee);
        return rangee;
    }

    isFondImage(pixel) {
        //return (pixel == 0xffffff);
        return (pixel == this.state.couleurFond);
    }
    getPixel(imgData, index) {
        var i = index * 4;
        var data = imgData.data;
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];
        var pixel = red * 0x10000 + green * 0x100 + blue;
        return pixel;
    }



    getPixelXY(imgData, x, y) {
        return this.getPixel(imgData, y * imgData.width + x);
    }

    create3D() {

        this.cubes = this.init2D23D();
        this.scene.add(this.cubes);
        console.log("cubes", this.cubes);
        console.log("scene", this.scene);

    }



    initControls() {
        this.controls.rotateSpeed = 2.0;
        this.controls.zoomSpeed = 1.4;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [65, 83, 68];

        //this.controls.addEventListener( 'change',  );
        this.controls.handleResize();
    }
    componentWillUnmount() {
        this.stop()
        this.mount.removeChild(this.renderer.domElement)
    }
    start = () => {
        if (!this.frameId) {
            this.frameId = requestAnimationFrame(this.animate)
        }
    }
    stop = () => {
        cancelAnimationFrame(this.frameId)
    }
    animate = () => {
        // this.cylindre.rotation.x += 0.01
        // this.cylindre.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);
        this.controls.update();

    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }
    updateParam = (epaisseurBase, couleurFond, nbPoints) => {
        console.log("updateParam ----- epaisseurBase: " + epaisseurBase + "  couleurFond: " + couleurFond + "  nbPoints: " + nbPoints);
        this.setState({
            epaisseurBase: epaisseurBase,
            couleurFond: couleurFond,
            nbPoints: epaisseurBase
        })
        this.scene.remove(this.cubes);
        this.cubes = this.init2D23D();        
        this.scene.add(this.cubes);
        console.log("updateParam  scene updated!!!!!!!!");
    }
    render() {
        return (

            <div>
                <Bg3dParam updateParam={this.updateParam} data="{data}" />
                <div style={{ width: '600px', height: '600px' }}>
                    <div
                        style={{ width: '300px', height: '300px', backgroundColor: "yellow" }}
                        ref={(mount) => { this.mount = mount }}
                    />
                </div>
            </div>
        )
    }
}
export default Bg3d;