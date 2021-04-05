import React, { Component } from 'react';
import TrackballControls from './TrackballControls';

import * as BgUtil from './BgUtil.js';
import * as Bg3dUtil from './Bg3dUtil';
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
            hauteurNoir: 30,
            hauteurRouge: 28,
            hauteurVert: 30,
            hauteurBleu: 29,
            bombageNoir: 0.4,
            bombageRouge: 0,
            bombageVert: 0,
            bombageBleu: 0.6,
            nbPoints: 100,
            couleurFond: 0xffffff,
            titre: 'r2d23d',
            scale: 0.4

        }
        this.updateParam3 = this.updateParam3.bind(this);
        this.process3d();
    }

    process3d() {
        console.log("process3d start ", this.props);

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
    arrondi = true;

    initImageData(idCanvas) {
        console.log("Init 3D", idCanvas);
        var canvas1 = document.getElementById(idCanvas);
        console.log("Init 3D", canvas1);
        if (canvas1) {
            this.w = canvas1.width;
            this.h = canvas1.height;
            let ctx2 = canvas1.getContext('2d');
            this.imageData = ctx2.getImageData(0, 0, this.w, this.h);
            console.log("Init 3D w " + this.w + "  h: " + this.h);
        } else {
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
        

        const positionsHaut = [];
        const positionsBas = [];

        const normalsHaut = [];
        const normalsBas = [];

        console.log(" this.w " + this.w);
        console.log(" this.h " + this.h);
        console.log("init2D23D_full  kk " + kk);
        var nDisplayable = 0
        var nDisplayableNo = 0;
        for (var i = 1; i < this.w - kk; i = i + kk) {
            for (var j = 1; j < this.h - kk; j = j + kk) {
                var isDisplayable2 = this.isDisplayableConnex(i, j, kk) > 0
                if (isDisplayable2) {
                    nDisplayable++
                } else {
                    nDisplayableNo++;
                }

                if (isDisplayable2) {

                    
                    let p1 = this.processPosition(i, j, positionsHaut, true);
                    let p2 = this.processPosition(i + kk, j, positionsHaut, true);
                    let p3 = this.processPosition(i + kk, j + kk, positionsHaut, true);
                    let p4 = this.processPosition(i, j, positionsHaut, true);
                    let p5 = this.processPosition(i + kk, j + kk, positionsHaut, true);
                    let p6 = this.processPosition(i, j + kk, positionsHaut, true);

                    this.processPosition(i, j, positionsBas, false);
                    this.processPosition(i + kk, j, positionsBas, false);
                    this.processPosition(i + kk, j + kk, positionsBas, false);
                    this.processPosition(i, j, positionsBas, false);
                    this.processPosition(i + kk, j + kk, positionsBas, false);
                    this.processPosition(i, j + kk, positionsBas, false);



                    var normalHaut1 = Bg3dUtil.getNormal(p1, p2, p3);
                    var normalHaut2 = Bg3dUtil.getNormal(p4, p5, p6);
                    //console.log("normaleHaut 1 et 2 :", normalHaut1,normalHaut2);
                    var normalBas = [0, 0, -1];
                    //console.log(" normalHaut1 ",normalHaut1, " normalhaut2 ",normalHaut2," normalBas",normalBas)
                    normalsHaut.push(...normalHaut1);
                    normalsHaut.push(...normalHaut1);
                    normalsHaut.push(...normalHaut1);
                    normalsHaut.push(...normalHaut2);
                    normalsHaut.push(...normalHaut2);
                    normalsHaut.push(...normalHaut2);

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

        // var positions = positionsHaut.concat(positionsBas);
        //   var normals = normalsHaut.concat(normalsBas);

        const geometryHaut = new THREE.BufferGeometry();
        const geometryBas = new THREE.BufferGeometry();
        const positionNumComponents = 3;
        const normalNumComponents = 3;
        geometryHaut.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionsHaut), positionNumComponents));
        geometryBas.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positionsBas), positionNumComponents));
        geometryHaut.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normalsHaut), normalNumComponents));
        geometryBas.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normalsBas), normalNumComponents));
        const colorHAut = 0xffff88;
        const colorBas = 0x88ffff;
        const materialHaut = new THREE.MeshBasicMaterial({ color: colorHAut, wireframe: true });
        const materialBas = new THREE.MeshBasicMaterial({ color: colorBas, wireframe: true });

        const cubeHaut = new THREE.Mesh(geometryHaut, materialHaut);
        const cubeBas = new THREE.Mesh(geometryBas, materialBas);

        cubeHaut.updateMatrix();
        cubeBas.updateMatrix();
        //cubeBas.updateMatrix();
        var cubes = [cubeHaut,cubeBas];
        // THREE.GeometryUtils.merge(geometryBas,cube); // Deprecated

        
        
        scene.add(cubeHaut);
        scene.add(cubeBas);
       



        return cubes;


    }  ///  ///////////////////////////////////////////////////////////////////////
    distanceBordArray;

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
        return positionHaut2;
    }





    isFondImagePixel2(i, j) {
        if (i >= this.w) {
            return true;
        }
        if (j >= this.h) {
            return true;
        }
        if (i < 0) {
            return true;
        } if (j < 0) {
            return true;
        }
        var indexPixel = this.getPixelXYIndex(i, j);
        var pixel = this.getPixelRGB(indexPixel);
        var isFondImage = (pixel === this.state.couleurFond);
        return isFondImage;
    }

    isDisplayableConnex(i, j, kk) {

        if (!this.isFondImagePixel2(i, j)) {
            return 1;
        }
        if ((i + kk) < this.w) {
            if (!this.isFondImagePixel2(i + kk, j)) {
                return 2;
            }
        }
        if ((i - kk) >= 0) {
            if (!this.isFondImagePixel2(i - kk, j)) {
                return 3;
            }
        }
        if ((j + kk) < this.h) {
            if (!this.isFondImagePixel2(i, j + kk)) {
                return 4;
            }
        }
        if ((j - kk) >= 0) {
            if (!this.isFondImagePixel2(i, j - kk)) {
                return 5;
            }
        }
        if (((j + kk) < this.h) && ((i + kk) < this.w)) {
            if (!this.isFondImagePixel2(i + kk, j + kk)) {
                return 6;
            }
        }
        if (((j - kk) >= 0) && ((i - kk) >= 0)) {
            if (!this.isFondImagePixel2(i - kk, j - kk)) {
                return 7;
            }
        }

        return 0;

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
        }
        let distanceBord = 0;
        if (this.arrondi) {
            distanceBord = BgUtil.getDistanceBorder(ii, jj, this.imageData);
        }
        if (red === 0xff) {
            return this.state.hauteurRouge + distanceBord * this.state.bombageRouge;
        } else if (green === 0xff) {
            return this.state.hauteurVert + distanceBord * this.state.bombageVert;
        } else if (blue === 0xff) {
            return this.state.hauteurBleu + distanceBord * this.state.bombageBleu;
        } else {
            return this.state.hauteurNoir + distanceBord * this.state.bombageNoir;
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
        return 4 * ((y * this.imageData.width) + x);
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
    
    updateParam3 = (data) => {
        console.log(" updateParam3 data ",data);
        this.setState({
            hauteurNoir: data.hauteurNoir,
            hauteurRouge: data.hauteurRouge,
            hauteurVert: data.hauteurVert,
            hauteurBleu: data.hauteurBleu,
            nbPoints: data.nbPoints,
            scale: data.scale,
            bombageNoir: data.bombageNoir,
            bombageRouge: data.bombageRouge,
            bombageVert: data.bombageVert,
            bombageBleu: data.bombageBleu
        })
    }

    calcul = () => {
        console.log("calcul start -----");
        this.scene.clear();
        this.init2D23D_light2(this.scene);
        console.log("calcul  scene updated!!!!!!!!");
    }


    getStl = () => {
        console.log("getStl start -----" + THREE);
        var exporter = new STLExporter();
        const sceneStl = new THREE.Scene();
        let cubes = this.init2D23D_full(sceneStl, 2);
        cubes.forEach((c)=>sceneStl.add(c));
        const bufferBinary = exporter.parse(sceneStl, { binary: false });
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

            <div class="global">
                <div class="gauche">
                    <Bg3dParam updateParam3={this.updateParam3} calcul={this.calcul} getStl={this.getStl} data={this.state} />
                </div>
                <div class="droit">
                    <div
                        style={{ width: '400px', height: '400px', backgroundColor: "yellow", border: "3px solid red" }}
                        ref={(mount) => { this.mount = mount }}
                    />
                </div>
            </div>
        )
    }
}


export default Bg3d;