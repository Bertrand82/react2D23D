import React, { Component } from 'react';
import TrackballControls from './TrackballControls';

import { saveAs } from 'file-saver';
import Bg3dParam from './Bg3dParam';
import * as THREE from 'three';
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";

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
            hauteurNoir: 12,
            hauteurRouge: 10,
            hauteurVert: 11,
            hauteurBleu: 13,
            nbPoints: 20,
            couleurFond: 0xffffff,
            titre: 'r2d23d'
            
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
    }

  
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

    init2D23D_light2(sceneInit) {
        var nbPoints = this.state.nbPoints;
        console.log("nbPoints ::", nbPoints);
        var kk = Math.round(this.w / nbPoints);
        return this.init2D23D_full(sceneInit,kk);
    }

    init2D23D_full(sceneInit,kk) {
       
        console.log("init2D23D_full  kk " + kk);       
        for (var i = 0; i < this.w; i = i + kk) {            
            for (var j = 0; j < this.h; j = j + kk) {
                var indexPixel = this.getPixelXYIndex(i, j);
                var pixel = this.getPixelRGB(indexPixel);                
                //console.log("pixelA   0h" + pixel.toString(16) + "  fond: " + this.isFondImage(pixel));
                if (!this.isFondImage(pixel)) {
                    var hauteur2 = this.getHauteurFromColor(indexPixel);
                    var material = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true });
                   
                    const cubeGeometry = new THREE.BoxGeometry(kk, kk, 2 * hauteur2);
                    var geometry  = cubeGeometry.translate(i, j, hauteur2);
                    //console.log(" geometry ",geometry)
                    const cube = new THREE.Mesh(geometry, material);
                    sceneInit.add(cube);  
                }
            }           
        }
        console.log("Pixels ::: h :" + this.h + "  w: " + this.w + "  kk :" + kk +" group sceneInit.children.length :"+sceneInit.children.length);
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
        if (red === 0xff && green ===0xff && blue===0xff){
            // blanc ... Should nor happen;
            return 1;
        }else if (red===0xff){
            return this.state.hauteurRouge;
        }else if (green===0xff){
            return this.state.hauteurVert;
        }else if (blue===0xff){
            return this.state.hauteurBleu;
        }else {
            return this.state.hauteurNoir;
        }
        
    }
    getPixelRGB(i) {
        var data = this.imageData.data;
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];
        var pixel = red * 0x10000 + green * 0x100 + blue;
        return pixel;
    }

    getPixelXYIndex(x, y) {
        return 4 * (y * this.imageData.width + x);
    }

    create3D() {
        this.scene =  new THREE.Scene()
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
        // this.cylindre.rotation.x += 0.01
        // this.cylindre.rotation.y += 0.01
        this.renderScene()
        this.frameId = window.requestAnimationFrame(this.animate);
        this.controls.update();

    }
    renderScene = () => {
        this.renderer.render(this.scene, this.camera)
    }
    updateParam2 = (hauteurNoir, hauteurRouge, hauteurVert,hauteurBleu, nbPoints) => {
        console.log("updateParam2 1 ----- hauteurNoir: " + hauteurNoir + "  hauteurRouge: " + hauteurRouge + "  nbPoints: " +nbPoints);
        this.setState({
            hauteurNoir: new Number(hauteurNoir),
            hauteurRouge: new Number(hauteurRouge),
            hauteurVert: new Number(hauteurVert),
            hauteurBleu: new Number(hauteurBleu),
            nbPoints: new Number(nbPoints)            
        })
        console.log("updateParam2 2 ----- hauteurNoir: " + this.state.hauteurNoir + "  hauteurRouge: " + this.state.hauteurRouge + "  nbPoints: "+nbPoints );
        

    }

    calcul = () => {
        console.log("calcul start -----");
        var hauteurNoir = this.state.hauteurNoir;
        console.log("updateParam2 2 ----- hauteurNoir: isNaN ::" + isNaN(hauteurNoir)+"  "+hauteurNoir,(hauteurNoir instanceof Number) );
       
        this.scene.clear();
        this.init2D23D_light2(this.scene);        
        console.log("calcul  scene updated!!!!!!!!");
    }

    
    getStl = () => {
        console.log("getStl start -----"+THREE);
        //var exporter = new STLExporter();
        var exporter  = new STLExporter();
        //var sceneStl = new THREE.Scene();
        var  sceneStl = new THREE.Group();
        this.init2D23D_full(sceneStl,1);     
        const bufferBinary = exporter.parse( sceneStl, { binary: true } );
        //const bufferAscee = exporter.parse( sceneStl, { binary: false } );
        const blobBinary = new Blob([bufferBinary], { type: 'application/octet-stream' });
        //const blobAscee = new Blob([bufferAscee], { type: 'plain/text' });
        var fileName = "cube_r2d23d_R"+this.state.hauteurRouge+"V"+this.state.hauteurVert+"B"+this.state.hauteurBleu+"N"+this.state.hauteurNoir
        saveAs(blobBinary, fileName+'.stl');
        //saveAs(blobAscee, 'cubeAscee'+this.state.nbPoints+'x'+this.state.nbPoints+'.stl');
        console.log("getStl done nb de cubes sceneStl : "+sceneStl.children.length);
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
export default Bg3d;