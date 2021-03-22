import React, { Component } from 'react';
import TrackballControls from './TrackballControls';

import { saveAs } from 'file-saver';
import Bg3dParam from './Bg3dParam';
import * as THREE from 'three';
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { IcosahedronGeometry } from 'three';

const ctx = initCanvasText();


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
        this.initImageData(props.image2Dsrc);
        this.updateParam2 = this.updateParam2.bind(this);

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

    init2D23D_light2(sceneInit) {
        var nbPoints = this.state.nbPoints;
        console.log("nbPoints ::", nbPoints);
        var kk = Math.round(this.w / nbPoints);
        console.log("kk ::", kk);
        return this.init2D23D_full(sceneInit, kk, 0, 0);
    }


    init2D23D_full(scene, kk) {
        ///  ////////////////////////////////////////////////////////////////////////

        const listPBordureA = [];
        const listPBordureB = [];
        let listPBordureC = [];
        var pointB = false;
        const positionsHaut = [];
        const positionsBas = [];
        const positionsBordure = [];
        const normalsHaut = [];
        const normalsBas = [];
        const normalsBordure = [];
        var nBordure = 0;

        var plancher = 0;
        console.log(" this.w " + this.w);
        console.log(" this.h " + this.h);
        console.log("init2D23D_full  kk " + kk);
        var scale = this.state.scale;
        for (var i = 0; i < this.w; i = i + kk) {
            listPBordureC = [];
            var isBorderA = true;
            var isBorderB = false;
            for (var j = 0; j < this.h; j = j + kk) {               
                var indexPixel = this.getPixelXYIndex(i, j);
                var pixel = this.getPixelRGB(indexPixel);
                var isDisplayable = !this.isFondImage(pixel);
                if (isDisplayable) {
                    //console.log("pixelA   0h" + pixel.toString(16) + "  fond: " + this.isFondImage(pixel));
                    var hauteurPixel = this.getHauteurFromColor(indexPixel) * this.state.scale;
                    var hauteur =  hauteurPixel;
                    var positionHaut1 = [i * scale, j* scale, hauteur* scale];
                    var positionHaut2 = [(i + kk)* scale, j* scale, hauteur* scale];
                    var positionHaut3 = [(i + kk)* scale, (j + kk)* scale, hauteur* scale];
                    positionsHaut.push(...positionHaut1);
                    positionsHaut.push(...positionHaut2);
                    positionsHaut.push(...positionHaut3);

                    var positionHaut4 = [i * scale, j* scale, hauteur* scale];
                    var positionHaut5 = [(i + kk)* scale, (j+kk)* scale, hauteur* scale];
                    var positionHaut6 = [(i )* scale, (j + kk)* scale, hauteur* scale];

                    positionsHaut.push(...positionHaut4);
                    positionsHaut.push(...positionHaut5);
                    positionsHaut.push(...positionHaut6);

                    var positionBas1 = [i* scale, j* scale, plancher* scale];
                    var positionBas2 = [(i + kk)* scale, j* scale, plancher* scale];
                    var positionBas3 = [(i+kk)* scale, (j + kk)* scale, plancher* scale];

                    var positionBas4 = [i* scale, j* scale, plancher* scale];
                    var positionBas5 = [(i + kk)* scale, (j+kk)* scale, plancher* scale];
                    var positionBas6 = [i* scale, (j + kk)* scale, plancher* scale];
                 
                    positionsBas.push(...positionBas1);
                    positionsBas.push(...positionBas2);
                    positionsBas.push(...positionBas3);

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
                    if (isBorderA) {
                        console.log("Border A : i: ",i,"  j :",j)
                        isBorderA = false;
                        var pointA = [i* scale, j* scale, hauteur* scale];
                        listPBordureA.push(...pointA);
                        nBordure++;
                    }
                    pointB = [i* scale, (j + kk)* scale, hauteur* scale];
                    listPBordureC.push(... [(i + kk)* scale, (j )* scale, hauteur* scale]);
                }  // End displayable             

            }// Endloop j
            
            if (pointB) {
                var pointBB = [pointB[0], pointB[1], pointB[2]];
                listPBordureB.push(...pointBB);
                pointB = false;
            }
        }
        for (var iB = 0; iB < nBordure; iB++) {
            if (iB === 0) {
                var pZ_1 = [listPBordureB[0], listPBordureB[1], listPBordureB[2]]
            } else {
                var pZ_1 = [listPBordureA[3 * (iB - 1)], listPBordureA[3 * (iB - 1) + 1], listPBordureA[3 * (iB - 1) + 2]];
            }

            var pZ_0 = [listPBordureA[3 * (iB)], listPBordureA[3 * (iB) + 1], listPBordureA[3 * (iB) + 2]];
            this.processBordure(pZ_1, pZ_0, positionsBordure, normalsBordure);

        }
        for (var iC = 0; iC < nBordure; iC++) {
            // var iB = nBordure-iC-1;

            if (iC === (nBordure - 1)) {
                var pZ_0 = [listPBordureA[3 * iC], listPBordureA[3 * iC + 1], listPBordureA[3 * iC + 2]]
            } else {
                var pZ_0 = [listPBordureB[3 * (iC + 1)], listPBordureB[3 * (iC + 1) + 1], listPBordureB[3 * (iC + 1) + 2]];
            }
            var pZ_1 = [listPBordureB[3 * iC], listPBordureB[(3 * iC) + 1], listPBordureB[(3 * iC) + 2]];
            this.processBordure(pZ_0, pZ_1, positionsBordure, normalsBordure);

        }
        for (var iC = 0; iC < listPBordureC.length; iC++) {
            if (iC === (listPBordureC.length - 1)) {
                var pZ_0 = [listPBordureA[3 * (nBordure-1)], listPBordureB[3 * (nBordure-1) + 1], listPBordureB[3 * (nBordure-1) + 2]]
            } else {
                var pZ_0 = [listPBordureB[3 * (iC + 1)], listPBordureB[3 * (iC + 1) + 1], listPBordureB[3 * (iC + 1) + 2]];
            }
            var pZ_1 = [listPBordureC[3 * iC], listPBordureC[(3 * iC) + 1], listPBordureC[(3 * iC) + 2]];
            this.processBordure(pZ_0, pZ_1, positionsBordure, normalsBordure);
        }
        
        var positions = positionsHaut.concat(positionsBas).concat(positionsBordure);
        var normals = normalsHaut.concat(normalsBas).concat(normalsBordure);

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

        ///  ///////////////////////////////////////////////////////////////////////

    }
    processBordure(pZ_1, pZ_0, positionsBordure, normalsBordure) {

        console.log("bordure  pZ_0:, ", pZ_0, "  pZ_1", pZ_1);
        var positionBordure1 = [pZ_0[0], pZ_0[1], 0];
        var positionBordure2 = [pZ_0[0], pZ_0[1], pZ_0[2]];
        var positionBordure3 = [pZ_1[0], pZ_1[1], pZ_1[2]];
        var positionBordure4 = [pZ_1[0], pZ_1[1], pZ_1[2]];
        var positionBordure5 = [pZ_1[0], pZ_1[1], 0];
        var positionBordure6 = [pZ_0[0], pZ_0[1], 0];
        positionsBordure.push(...positionBordure1);
        positionsBordure.push(...positionBordure2);
        positionsBordure.push(...positionBordure3);
        positionsBordure.push(...positionBordure4);
        positionsBordure.push(...positionBordure5);
        positionsBordure.push(...positionBordure6);
        var dx = pZ_0[0] - pZ_1[0];
        var dy = pZ_0[1] - pZ_1[1];
        var yNormal;
        if (dy === 0) {
            yNormal = 20;
        } else {
            yNormal = -dx / dy;
        }

        var normalBordure = [1, yNormal, 0];

        normalsBordure.push(...normalBordure)
        normalsBordure.push(...normalBordure)
        normalsBordure.push(...normalBordure)
        normalsBordure.push(...normalBordure)
        normalsBordure.push(...normalBordure)
        normalsBordure.push(...normalBordure)
    }
    initMinimums() {

        console.log("initMinimum   ");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                var indexPixel = this.getPixelXYIndex(i, j);
                var pixel = this.getPixelRGB(indexPixel);
                if (!this.isFondImage(pixel)) {
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
                //console.log("pixelA   0h" + pixel.toString(16) + "  fond: " + this.isFondImage(pixel));
                if (!this.isFondImage(pixel)) {
                    var hauteur2 = this.getHauteurFromColor(indexPixel) * this.state.scale;
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });

                    const cubeGeometry = new THREE.BoxGeometry(kk, kk, 2 * hauteur2);
                    var geometry = cubeGeometry.translate((i - this.iMin) * this.state.scale, (j - this.jMin) * this.state.scale, hauteur2);
                    //console.log(" geometry ",geometry)
                    const cube = new THREE.Mesh(geometry, material);
                    sceneInit.add(cube);
                }
            }
        }
        console.log("Pixels ::: h :" + this.h + "  w: " + this.w + "  kk :" + kk + " group sceneInit.children.length :" + sceneInit.children.length);
        return sceneInit;
    }

    isFondImage(pixel) {
        //return (pixel == 0xffffff);
        return (pixel === this.state.couleurFond);
    }

    getHauteurFromColor(i) {
        var data = this.imageData.data;
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        if (red === 0xff && green === 0xff && blue === 0xff) {
            // blanc ... Should nor happen;
            return 1;
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
        var hauteurNoir = this.state.hauteurNoir;

        this.scene.clear();
        this.init2D23D_light2(this.scene);
        console.log("calcul  scene updated!!!!!!!!");
    }


    getStl = () => {
        console.log("getStl start -----" + THREE);
        this.initMinimums();
        //var exporter = new STLExporter();
        var exporter = new STLExporter();
        //var sceneStl = new THREE.Scene();
        var sceneStl = new THREE.Scene();
        this.init2D23D_full(sceneStl, 1);
        const bufferBinary = exporter.parse(sceneStl, { binary: true });
        //const bufferAscee = exporter.parse( sceneStl, { binary: false } );
        const blobBinary = new Blob([bufferBinary], { type: 'application/octet-stream' });
        //const blobAscee = new Blob([bufferAscee], { type: 'plain/text' });
        var fileName = "cube_r2d23d_" + this.getSrcName() + "_" + this.state.hauteurRouge + "V" + this.state.hauteurVert + "B" + this.state.hauteurBleu + "N" + this.state.hauteurNoir
        saveAs(blobBinary, fileName + '.stl');
        //saveAs(blobAscee, 'cubeAscee'+this.state.nbPoints+'x'+this.state.nbPoints+'.stl');
        console.log("getStl done nb de cubes sceneStl : " + sceneStl.children.length);
    }

    getSrcName = () => {
        console.log("getSrcName ", this.state.fileName);
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