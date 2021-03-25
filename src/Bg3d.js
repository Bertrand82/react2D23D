import React, { Component } from 'react';
import TrackballControls from './TrackballControls';

import { saveAs } from 'file-saver';
import Bg3dParam from './Bg3dParam';
import * as THREE from 'three';
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";

initCanvasText();


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
            fileName: props.fileName,
            hauteurNoir: 25,
            hauteurRouge: 25,
            hauteurVert: 20,
            hauteurBleu: 20,
            nbPoints: 200,
            couleurFond: 0xffffff,
            titre: 'r2d23d',
            scale: 0.4

        }
        this.updateParam2 = this.updateParam2.bind(this);
        this.process3d();
    }

    process3d() {
        console.log("process3d start ",this.props);
        this.initImageData(this.props.image2Dsrc);
        
        
       
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
        this.camera.position.z = 200;
        //ADD RENDERER 
        this.renderer = new THREE.WebGLRenderer({ antialias: true })
        this.renderer.setClearColor('#110000');
        this.renderer.setSize(width, height);
        this.mount.appendChild(this.renderer.domElement);
        //ADD Object        
        this.create3D();
        //ADD Control
        this.controls = new TrackballControls(this.camera, this.renderer.domElement);
        this.initControls();
        this.start();
        this.animate();
    }


    imageData;
    w;
    h;
    iMin = 0;
    jMin = 0;
    initImageData(idCanvas) {
        console.log("Init 3D", idCanvas);
        var canvas1 = document.getElementById(idCanvas);
        console.log("Init 3D", canvas1);
        if (canvas1) {
            this.w = canvas1.width;
            this.h = canvas1.height;
            var ctx2 = canvas1.getContext('2d');
            this.imageData = ctx2.getImageData(0, 0, this.w, this.h);
            console.log("Init 3D w " + this.w + "  h: " + this.h);
        }else {
            console.warn("bg NO CANVAS !!!! ")
        }
    }

    init2D23D_light2(sceneInit) {
        var nbPoints = this.state.nbPoints;
        console.log("nbPoints ::", nbPoints);
        var kk = Math.round(this.w / nbPoints);
        console.log("kk ::", kk);
        return this.init2D23D_full(sceneInit, kk, 0, 0);
    }


    init2D23D_full(scene, kk) {  ///  ////////////////////////////////////////////////////////////////////////


        var pointB = false;
        const positionsHaut = [];
        const positionsBas = [];

        const normalsHaut = [];
        const normalsBas = [];


        var plancher = 0;
        console.log(" this.w " + this.w);
        console.log(" this.h " + this.h);
        console.log("init2D23D_full  kk " + kk);
        var scale = this.state.scale;
        var nDisplayable = 0;
        var nDisplayableNo = 0;
        for (var i = 0; i < this.w; i = i + kk) {
            for (var j = 0; j < this.h; j = j + kk) {


                var isDisplayable2 = this.isDisplayableConnex(i, j, kk)
                if (isDisplayable2) {
                    nDisplayable++
                } else {
                    nDisplayableNo++;
                }

                //console.log(" i " + i + " j " + j + "  isDisplayable " + isDisplayable2 + "  isFondImagePixel2 :" + this.isFondImagePixel2(i, j));

                if (isDisplayable2) {

                    var indexPixel = this.getPixelXYIndex(i, j);
                    var pixel = this.getPixelRGB(indexPixel);
                    //console.log("pixelA   i: " + i + " j: "+j);

                    this.processPosition(i, j, positionsHaut, true);
                    this.processPosition(i + kk, j, positionsHaut, true);
                    this.processPosition(i + kk, j + kk, positionsHaut, true);
                    this.processPosition(i, j, positionsHaut, true);
                    this.processPosition(i + kk, j + kk, positionsHaut, true);
                    this.processPosition(i, j + kk, positionsHaut, true);

                    this.processPosition(i, j, positionsBas, false);
                    this.processPosition(i + kk, j, positionsBas, false);
                    this.processPosition(i + kk, j + kk, positionsBas, false);
                    this.processPosition(i, j, positionsBas, false);
                    this.processPosition(i + kk, j + kk, positionsBas, false);
                    this.processPosition(i, j + kk, positionsBas, false);



                    var normalHaut = [0, 0, 1];
                    var normalBas = [0, 0, -1];
                    normalsHaut.push(...normalHaut);
                    normalsHaut.push(...normalHaut);
                    normalsHaut.push(...normalHaut);
                    normalsHaut.push(...normalHaut);
                    normalsHaut.push(...normalHaut);
                    normalsHaut.push(...normalHaut);

                    normalsBas.push(...normalBas);
                    normalsBas.push(...normalBas);
                    normalsBas.push(...normalBas);
                    normalsBas.push(...normalBas);
                    normalsBas.push(...normalBas);
                    normalsBas.push(...normalBas);
                    // if (i,j) is bordure


                }  // End displayable             

            }// Endloop j

        }

        console.log(" nDisplayableNo " + nDisplayableNo + "  nDisplayable " + nDisplayable);

        var positions = positionsHaut.concat(positionsBas);
        var normals = normalsHaut.concat(normalsBas);

        const geometry = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), positionNumComponents));
        geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normalNumComponents));
        const color = 0xffFF88;
        const material = new THREE.MeshBasicMaterial({ color: color, wireframe: true });

        const cube = new THREE.Mesh(geometry, material);
        cube.position.x = 0;
        cube.position.y = 0;
        cube.position.z = 0;
        scene.add(cube);


        return cube;


    }  ///  ///////////////////////////////////////////////////////////////////////

    processPosition(i, j, positions, isHaut) {
        var hauteur = 0;
        if (isHaut) {
            if ((i < this.w) && (j < this.h)) {
                hauteur = this.getHauteurFromColor2(i, j);
            } else {
                hauteur = 0;
            }
        }

        var scale = this.state.scale;
        var positionHaut2 = [i * scale, j * scale, hauteur * scale];
        positions.push(...positionHaut2);
    }
    initMinimums() {
        console.log("initMinimum   ");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                var indexPixel = this.getPixelXYIndex(i, j);
                var pixel = this.getPixelRGB(indexPixel);
                if (!this.isFondImageConnex(pixel)) {
                    if (i < this.iMin) { this.iMin = i; }
                    if (j < this.jMin) { this.jMin = j; }
                }
            }
        }

    }


    init2D23D_full__old(sceneInit, kk) {

        console.log("init2D23D_full  kk " + kk);
        for (var i = 0; i < this.w; i = i + kk) {
            for (var j = 0; j < this.h; j = j + kk) {
                var indexPixel = this.getPixelXYIndex(i, j);
                var pixel = this.getPixelRGB(indexPixel);
                if (!this.isFondImage(pixel)) {
                    var hauteur2 = this.getHauteurFromColor(indexPixel) * this.state.scale;
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

                    const cubeGeometry = new THREE.BoxGeometry(kk, kk, 2 * hauteur2);
                    var geometry = cubeGeometry.translate((i - this.iMin) * this.state.scale, (j - this.jMin) * this.state.scale, hauteur2);
                    const cube = new THREE.Mesh(geometry, material);
                    sceneInit.add(cube);
                }
            }
        }
        console.log("Pixels ::: h :" + this.h + "  w: " + this.w + "  kk :" + kk + " group sceneInit.children.length :" + sceneInit.children.length);
        return sceneInit;
    }


    isFondImagePixel2(i, j) {
        var indexPixel = this.getPixelXYIndex(i, j);
        var pixel = this.getPixelRGB(indexPixel);
        var isFondImage = (pixel === this.state.couleurFond);
        //console.log("isFondImagePixel2 " +i+"  "+j+"  isFondImage "+isFondImage+"  "+pixel+"   "+this.state.couleurFond);
        return isFondImage;
    }

    isDisplayableConnex(i, j, kk) {


        if (!this.isFondImagePixel2(i, j)) {
            return true;
        }
        if ((i + kk) < this.w) {
            if (!this.isFondImagePixel2(i + kk, j)) {
                return true;
            }
            /* if (!this.isFondImagePixel2(i + kk, j + kk)) {
                 return true;
             }*/
        }
        if ((j + kk) < this.h) {
            if (!this.isFondImagePixel2(i, j + kk)) {
                return true;
            }
        }
        return false;

    }

    getHauteurFromColor2(ii, jj) {
        if (ii >= this.w) {
            return 0;
        }
        if (jj > this.h) {
            return 0;
        }
        var k = 4 * (jj * this.imageData.width + ii);
        var data = this.imageData.data;
        var red = data[k];
        var green = data[k + 1];
        var blue = data[k + 2];
        if (red === 0xff && green === 0xff && blue === 0xff) {
            return 0;// Blanc
        } else if (red === 0xff) {
            return this.state.hauteurRouge;
        } else if (green === 0xff) {
            return this.state.hauteurVert;
        } else if (blue === 0xff) {
            return this.state.hauteurBleu;
        } else {
            return this.state.hauteurNoir;
        }

    }
    getPixelRGB(i) {
        var data = this.imageData.data;
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        //var alpha = data[i + 3];
        var pixel = red * 0x10000 + green * 0x100 + blue;
        return pixel;
    }

    getPixelXYIndex(x, y) {
        return 4 * (y * this.imageData.width + x);
    }

    create3D() {
        this.scene = new THREE.Scene()
        this.calcul();

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
        // this.scene.rotation.x += 0.01
        // this.scene.rotation.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);
        this.controls.update();

    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }
    updateParam2 = (hauteurNoir, hauteurRouge, hauteurVert, hauteurBleu, nbPoints, scale) => {
        console.log("updateParam22 1 ----- hauteurNoir: " + hauteurNoir + "  hauteurRouge: " + hauteurRouge + "  nbPoints: " + nbPoints);
        this.setState({
            hauteurNoir: new Number(hauteurNoir),
            hauteurRouge: new Number(hauteurRouge),
            hauteurVert: new Number(hauteurVert),
            hauteurBleu: new Number(hauteurBleu),
            nbPoints: new Number(nbPoints),
            scale: new Number(scale)
        })
        console.log("updateParam22 2 ----- hauteurNoir: " + this.state.hauteurNoir + "  hauteurRouge: " + this.state.hauteurRouge + "  nbPoints: " + nbPoints);


    }

    calcul = () => {
        console.log("calcul start -----");
        this.scene.clear();
        this.init2D23D_light2(this.scene);
        console.log("calcul  scene updated!!!!!!!!");
    }


    getStl = () => {
        console.log("getStl start -----" + THREE);
        // this.initMinimums();
        var exporter = new STLExporter();
        var sceneStl = new THREE.Scene();
        this.init2D23D_full(sceneStl, 1);
        const bufferBinary = exporter.parse(sceneStl, { binary: true });
        const blobBinary = new Blob([bufferBinary], { type: 'application/octet-stream' });
        var fileName = "cube_r2d23d_" + this.getSrcName() + "_" + this.state.hauteurRouge + "V" + this.state.hauteurVert + "B" + this.state.hauteurBleu + "N" + this.state.hauteurNoir
        saveAs(blobBinary, fileName + '.stl');
        console.log("getStl done nb de cubes sceneStl : " + sceneStl.children.length);
    }

    getSrcName = () => {
        return this.state.fileName.split(".")[0];
    }

    

    render() {
        return (

            <div>
                 <Bg3dParam updateParam2={this.updateParam2} calcul={this.calcul} getStl={this.getStl} data={this.state} />
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

class Point {
    constructor(ii, jj) {
        this.i = ii;
        this.j = jj;
    }
    i;
    j;
}
export default Bg3d;