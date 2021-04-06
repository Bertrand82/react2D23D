
import Bg3d from './Bg3d';
import * as BgUtil from './BgUtil.js';
import { saveAs } from 'file-saver';
const React = require('react');

class Bg2d extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileName: "No Image",
            display3D: false,
            drawTextInput: "Art 2 Faire",
            drawCircleRayon: 140,
            colorSelected: '#ff0000',
            drawFontSize: '50px',
            drawFontName: 'carolingia',
            couleurPermutationSource: '0xffffff',
            couleurPermutationDestination: '0xffff00',
            positionTextX: 50,
            positionTextY: 50,
            angleInitial: -85
        }
        this.handleChangeString = this.handleChangeString.bind(this);
        this.handleChangeLoadImage = this.handleChangeLoadImage.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
        this.handleInverse = this.handleInverse.bind(this);
        this.handleFiltrePixelOrphelin = this.handleFiltrePixelOrphelin.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
        this.handleDrawTextAlongArc1 = this.handleDrawTextAlongArc1.bind(this);
        this.handleDrawTextAlongArc2 = this.handleDrawTextAlongArc2.bind(this);
        this.handleDrawCercle = this.handleDrawCercle.bind(this);
        this.handleSelectColor = this.handleSelectColor.bind(this);
        this.handlePatern1 = this.handlePatern1.bind(this);
        this.handlePatern2 = this.handlePatern2.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleSelectFont = this.handleSelectFont.bind(this);
        this.handleClean = this.handleClean.bind(this);
        this.handleFiltreImageSaturation = this.handleFiltreImageSaturation.bind(this);
        this.handleUndo = this.handleUndo.bind(this);
        this.displayView = this.displayView.bind(this);
        this.handlePermuteCouleurs = this.handlePermuteCouleurs.bind(this);
        this.handleExtractionContour = this.handleExtractionContour.bind(this);
        this.handleDrawTextDroit = this.handleDrawTextDroit.bind(this);
        this.refCanvas = React.createRef();
        this.ref3d = React.createRef();

        console.log("refCanvas : ", this.refCanvas)


    }
    componentDidMount() {
        this.initCanvasText();
        this.displayView("2d");
        var color = this.state.colorSelected;
        this.selectColor(color);
    }
    refCanvas;
    ctx;
    w;
    h;
    imageData;
    imageData_Z_1;
    imageData_Z_2;
    imageData_Z_3;
    imageData_Z_4;

    handleDrawTextDroit(event) {
        this.process_Z_1();
        this.log("handleTextDroit : " + this.state.drawTextInput + " X: " + this.state.positionTextX + "  Y: " + this.state.positionTextY);
        this.setFont();
        this.ctx.fillText(this.state.drawTextInput, this.state.positionTextX, this.state.positionTextY)
    }

    handleExtractionContour(event) {
        this.process_Z_1();
        this.log("extraction contour")
        var imageDataCurrent = this.ctx.getImageData(0, 0, this.w, this.h);
        let imageDataNew = BgUtil.extractContours(imageDataCurrent);
        this.ctx.putImageData(imageDataNew, 0, 0);
        this.logAppend('extraction contour done');
    }

    handleDisplay3D(event) {
        console.log("handleDisplay3D", event);
        this.setState({
            display3D: !this.state.display3D,
        })
        this.displayView("3d");
        this.ref3d.current.process3d();
        this.ref3d.current.calcul();
    }

    displayView(viewToDisplay) {
        console.log("Bg2D diplayView viewToDisplay", viewToDisplay)
        console.log("Bg2D displayView ref3d current: ", this.ref3d.current);
        var bg3dDiv = document.getElementById("Bg3dDiv");
        var bg2dDiv = document.getElementById("Bg2dDiv");

        if ("2d" === viewToDisplay) {
            console.log("display 2D")
            bg3dDiv.style.display = "none";
            bg2dDiv.style.display = "block";
        } else if ("3d" === viewToDisplay) {
            console.log("display 3D")
            bg2dDiv.style.display = "none";
            bg3dDiv.style.display = "block";
        } else {
            console.warning("DisplayView Aie !!!! probleme")
        }
    }
    handleChangeLoadImage(event) {
        console.log("fileName", event.target.files[0]);

        var url = URL.createObjectURL(event.target.files[0]);
        this.setState({
            file: url,
            fileName: event.target.files[0].name
        })
        this.displayOnCanvas2(url, "bg2dCanvas");
        this.process_Z_1();
    }

    handlePermuteCouleurs(event) {
        this.log("Permute couleur de " + this.state.couleurPermutationSource + " à " + this.state.couleurPermutationDestination);
        this.permuteCouleurs(this.state.couleurPermutationSource, this.state.couleurPermutationDestination);
    }

    displayOnCanvas2(urlImage, destCanvasId) {
        var canvas = document.getElementById(destCanvasId);
        var context = canvas.getContext('2d');
        var base_image = new Image();
        base_image.src = urlImage;
        base_image.onload = function () {
            context.drawImage(base_image, 0, 0);

        }
    }

    process_Z_1() {
        let imageDataCurrent = this.ctx.getImageData(0, 0, this.w, this.h);
        this.imageData_Z_4 = this.imageData_Z_3;
        this.imageData_Z_3 = this.imageData_Z_2;
        this.imageData_Z_2 = this.imageData_Z_1;
        this.imageData_Z_1 = this.cloneImageData(imageDataCurrent);
    }

    cloneImageData(imageDataCurrent) {
        var imd = new ImageData(
            imageDataCurrent.width,
            imageDataCurrent.height
        );
        for (let i = 0; i < imageDataCurrent.data.length; i++) {
            let v = imageDataCurrent.data[i]
            imd.data[i] = v
        }
        return imd;
    }

    handleClean() {
        this.log("Clean")
        this.process_Z_1();
        this.ctx.rect(0, 0, this.w, this.h);
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
    }

    handleUndo() {
        this.log("Undo");
        var oldImageData = this.ctx.getImageData(0, 0, this.h, this.w);
        this.imageData = this.imageData_Z_1;
        this.imageData_Z_1 = this.imageData_Z_2;
        this.imageData_Z_2 = this.imageData_Z_3;
        this.imageData_Z_3 = this.imageData_Z_4;
        this.imageData_Z_4 = oldImageData
        this.ctx.putImageData(this.imageData, 0, 0);

    }


    handleInverse() {
        this.process_Z_1();
        this.imageData = this.ctx.getImageData(0, 0, this.h, this.w);
        this.log("handleInverse w:" + this.imageData.width + "h:" + this.imageData.height);
        var newImageData = new ImageData(this.imageData.width, this.imageData.height);
        for (var i = 0; i < this.w; i++) {
            //var ii = this.w -i-1;
            var ii = i;
            for (var j = 0; j < this.h; j++) {
                var jj = this.h - j - 1;
                var k = 4 * (i * this.w + j);
                var kk = 4 * (ii * this.w + jj);
                newImageData.data[kk] = this.imageData.data[k];
                newImageData.data[kk + 1] = this.imageData.data[k + 1];
                newImageData.data[kk + 2] = this.imageData.data[k + 2];
                newImageData.data[kk + 3] = this.imageData.data[k + 3];

            }
        }
        console.log("handleInverse done");
        this.imageData = newImageData;
        this.ctx.putImageData(this.imageData, 0, 0);
    }
    handleFiltreImageSaturation() {
        this.filtreImageSaturation();
    }
    handleFiltrePixelOrphelin() {
        this.process_Z_1();
        this.log("handleFiltrePixelOrphelin start " + this.h + " " + this.w);
        var oldImageData = this.ctx.getImageData(0, 0, this.h, this.w);
        var newImageData = new ImageData(this.imageData.width, this.imageData.height);
        console.log("handleFiltrePixelOrphelin start " + newImageData.width + " " + newImageData.height);
        var nbPixelModified = 0;
        var nbPixelModifiedNo = 0;

        for (var i_ = 0; i_ < oldImageData.width; i_++) {
            for (var j_ = 0; j_ < oldImageData.height; j_++) {
                var k = 4 * (i_ * this.w + j_);
                var nPixelConnec = this.isPixelIsolated(i_, j_, oldImageData)
                var k2;
                if (nPixelConnec < 2) {
                    //k2 = 4 * (i_ * this.w + j_ + 1);
                    k2 = this.getkNeareastColor(i_, j_, oldImageData)
                    nbPixelModified++;
                } else {
                    k2 = k;
                    nbPixelModifiedNo++;
                }
                newImageData.data[k] = oldImageData.data[k2];
                newImageData.data[k + 1] = oldImageData.data[k2 + 1];
                newImageData.data[k + 2] = oldImageData.data[k2 + 2];
                newImageData.data[k + 3] = oldImageData.data[k2 + 3];

            }
        }
        this.logAppend("handleFiltrePixelOrphelin done nbPixelModified ", nbPixelModified);
        this.logAppend("handleFiltrePixelOrphelin done nbPixelModifiedNo ", nbPixelModifiedNo);
        this.ctx.putImageData(newImageData, 0, 0);
        this.imageData = newImageData;

    }

    handleSaveImage() {
        var canvas = this.refCanvas.current;
        canvas.toBlob(function (blob) {
            saveAs(blob, "r2d23d_screenshot.png");
        });
    }

    handleDrawTextAlongArc1() {
        this.process_Z_1();
        this.log("handleDrawTextAlongArc1 " + this.state.drawTextInput);
        var rayon = this.state.drawCircleRayon;
        var angleByChar = 5.0 / rayon;
        this.drawTextAlongArc(this.state.drawTextInput, rayon, angleByChar, 1)
    }
    handleDrawTextAlongArc2() {
        this.process_Z_1();
        this.log("handleDrawTextAlongArc " + this.state.drawTextInput);
        var rayon = this.state.drawCircleRayon;
        var angleByChar = 30.0 / rayon;
        this.drawTextAlongArc(this.state.drawTextInput, rayon, angleByChar, -1)
    }

    handleDrawCercle() {
        this.process_Z_1();
        console.log("handleDrawCercle colorSelected :>" + this.state.colorSelected + "<");
        var rayon = this.state.drawCircleRayon;
        this.drawCercleFill(rayon);
    }



    handleSelectColor(event) {
        var color = event.target.value;
        console.log("handleSelectColor A >" + color + "<");
        this.selectColor(color);
    }

    handleSelectFont(event) {
        var font = event.target.value;
        this.setState({
            drawFontName: font
        })
        console.log("handleSelectFont A >" + font + "<");
        this.setFont2(this.state.drawFontSize,font);
    }
    handlePatern1(event) {
        console.log("handlePattern1 start colorSelected:" + this.state.colorSelected)
        var r = 200;
        this.selectColor("rgb(0,0,0)")
        this.drawCercleFill(r);
        this.selectColor("rgb(255,0,0)");
        this.drawCercleFill(r - 20);

    }

    handlePatern2(event) {
        console.log("handlePattern2 start colorSelected:" + this.state.colorSelected)
        var r = 200;
        this.handlePatern1(event);
        this.selectColor("black");
        var text = this.state.drawTextInput;

        this.drawTextAlongArc(text, r - 60, 30.0 / r);
        this.selectColor(this.state.colorSelected);
    }

    drawCercleFill(rayon) {

        console.log("drawCercle color >" + this.state.colorSelected + "< rayon : " + rayon);

        this.ctx.beginPath();
        this.ctx.arc(this.w / 2, this.h / 2, rayon, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }
    setFont() {
        this.logAppend("setFont Font size : " +this.state.drawFontSize+"  name: "+ this.state.drawFontName )
        this.setFont2(this.state.drawFontSize, this.state.drawFontName) ;
       
    } 
    setFont2(fontSize, drawFontName) {
       
        var font2 = "bold " + fontSize + " " + drawFontName;
        this.logAppend("setFont2 Font  : " + font2)
        this.ctx.font = font2;
        this.ctx.fillText(" ",0,0)

    }

    drawTextAlongArc(str, radius, angleByChar, sens) {
        this.log("drawTextAlongArc :" + str + "  radius : " + radius + " sens:   " + sens)
        this.setFont();
        var centerX = this.w / 2;
        var centerY = this.h / 2;
        console.log("drawTextAlongArc B >" + this.state.colorSelected + "<");
        var len = str.length, s;
        var angle = (this.state.angleInitial * 3.14156) / 180;
        console.log("drawTextAlongArc str " + str);
        console.log("drawTextAlongArc angle " + angle);

        console.log("drawTextAlongArc ", this.ctx);
        this.ctx.save();

        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(sens * angle);

        for (var n = 0; n < len; n++) {
            
           
            
            
            var longueurCh = this.ctx.measureText(str[n]).width;
            var angleCh = longueurCh/radius;
            console.log("drawTextAlongArc " + str[n] +  "  longueurCh :"+longueurCh+"  angleCh "+angleCh);
            this.ctx.save();
            this.ctx.translate(0, -1 * sens * radius);
            s = str[n];
            this.ctx.fillText(s, 0, 0);

            this.ctx.restore();
            angle = sens * (angleByChar+angleCh);
            this.ctx.rotate(angle);
        }
        this.ctx.restore();
    }
    selectColor(color1) {
        this.setState({
            colorSelected: color1
        });
        this.ctx.fillStyle = color1;
        this.ctx.strokeStyle = color1;

        console.log("selectColor B >" + color1 + "<");
    }

    isPixelIsolated(i, j, imageData) {
        var color = this.getColor(i, j, imageData);
        var nPixelConnect = 0;
        var color4 = this.getColor(i, j - 1, imageData);
        if (color4 === color) {
            nPixelConnect++;
        }
        var color3 = this.getColor(i, j + 1, imageData);
        if (color3 === color) {
            nPixelConnect++;
        }
        var color2 = this.getColor(i - 1, j, imageData);
        if (color === color2) {
            nPixelConnect++;
        }
        var color1 = this.getColor(i + 1, j, imageData);
        if (color === color1) {
            nPixelConnect++;
        }
        return nPixelConnect;

    }
    getkNeareastColor(i, j, imageData) {
        var color = this.getColor(i, j, imageData);
        var ii, jj, kk;
        ii = i;
        jj = j - 1;
        var color4 = this.getColor(ii, jj, imageData);
        if (color4 !== color) {
            kk = 4 * (ii * this.w + jj);
            return kk;
        }
        ii = i;
        jj = j + 1;
        var color3 = this.getColor(ii, jj, imageData);
        if (color3 !== color) {
            kk = 4 * (ii * this.w + jj);
            return kk;
        }
        ii = i - 1;
        jj = j;
        var color2 = this.getColor(ii, jj, imageData);
        if (color !== color2) {
            kk = 4 * (ii * this.w + jj);
            return kk;
        }
        ii = i + 1;
        jj = j;
        var color1 = this.getColor(ii, jj, imageData);

        if (color !== color1) {
            kk = 4 * (ii * this.w + jj);
            return kk;
        }
        console.warn("should never hapen! ")
        return 4 * (i * this.w + j);;

    }

    getColor(i, j, imageData) {
        var k = 4 * (i * this.w + j);
        var red = imageData.data[k];
        var green = imageData.data[k + 1];
        var blue = imageData.data[k + 2];
        var color = red * 0x10000 + green * 0x100 + blue;
        return color;
    }



    filtreImageSaturation() {
        this.process_Z_1();
        var imageData = this.ctx.getImageData(0, 0, this.w, this.h);
        var data = imageData.data;
        this.log("filtreImageSaturation");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.filtreImageSaturationPixel(i, j, data);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    permuteCouleurs(color1, color2) {
        this.process_Z_1();
        var imageData = this.ctx.getImageData(0, 0, this.w, this.h);
        var colors = BgUtil.getColorsArray(color1);
        var colors2 = BgUtil.getColorsArray(color2);
        this.log('colors ', colors)
        this.log('colors2 ', colors2)
        var data = imageData.data;
        for (var i = 0; i < data.length; i = i + 4) {
            let r = data[i];
            let v = data[i + 1]
            let b = data[i + 1]
            if ((r === colors[0]) && (v === colors[1]) && (b === colors[2])) {
                data[i] = colors2[0];
                data[i + 1] = colors2[1];
                data[i + 2] = colors2[2];
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
        this.log('permuteCouleurs done')
    }


    filtreImageSaturationPixel(x, y, data) {
        var i = 4 * (y * this.w + x);

        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        // eslint-disable-next-line
        var alpha = data[i + 3];
        var seuill = 0xA0;
        if ((red > seuill) && (green > seuill) && (blue > seuill)) {
            data[i] = 0xff;
            data[i + 1] = 0xff;
            data[i + 2] = 0xff;
        } else if (red > seuill) {
            data[i] = 0xff;
            data[i + 1] = 0;
            data[i + 2] = 0;

        } else if (green > seuill) {
            data[i] = 0;
            data[i + 1] = 0xff;
            data[i + 2] = 0;

        } else if (blue > seuill) {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0xff;

        } else {
            data[i] = 0;
            data[i + 1] = 0;
            data[i + 2] = 0;
        }

    }

    initCanvasText() {
        //var canvas = document.getElementById('bg2dCanvas');
        console.log("refCanvas : ", this.refCanvas)
        var canvas = this.refCanvas.current;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.imageData = this.ctx.getImageData(0, 0, this.w, this.h);

        this.ctx.rect(0, 0, this.w + 1, this.h + 1);
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
        //this.handleClean();

        //canvas.addEventListener("dragend", bgListener);


    }


    handleChangeString(event) {
        this.setState({
            [event.target.id]: event.target.value
        })

    }

    handleChangeNumber(event) {
        console.log("handleChangeNumber event : ", event);
        console.log("handleChangeNumber event.target : ", event.target);
        console.log("handleChangeNumber event.target.value : ", event.target.value);
        console.log("handleChangeNumber event.target.id : ", event.target.id);
        console.log("handleChangeNumber event.target.id :isNan() : ", isNaN(event.target.value));
        var value;
        if (event.target.value === 'NaN') {
            value = '0';
        } else if (isNaN(event.target.value)) {
            value = event.target.value;
        } else {
            value = parseInt(event.target.value, 10);
        }
        this.setState({
            [event.target.id]: value
        })

    }

    log(a, b) {
        var element = document.getElementById("log");
        while (element.hasChildNodes()) {
            element.removeChild(element.lastChild);
        }
        this.logAppend(a, b);
    }
    logAppend(a, b) {
        var s;
        if (b) {
            s = a + b;
            console.log(a, b);

        } else {
            s = a;
            console.log(a);
        }
        var element = document.getElementById("log");
        var elemDiv = document.createElement('div');
        elemDiv.innerText = "" + s;
        element.appendChild(elemDiv);
    }

    render() {

        return (

            <div>
                <div style={{ textAlign: 'left', border: '1px solid red' }} id="Bg3dT">
                    <input type="button" onClick={(event) => { console.log("retour from3D", event); this.displayView("2d") }} value=" 2D" />
                    <input type="button" onClick={(event) => { console.log("retour from3D", event); this.displayView("3d") }} value=" 3D" />
                </div>
                <div id="Bg2dDiv">
                    <div class="global">
                        <div class="gauche">
                            <table border="1">
                                <tbody>
                                    <tr>
                                        <td>Etape 1</td>
                                        <td>Etape 2</td>
                                        <td>Etape 3</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="file" onChange={this.handleChangeLoadImage} />
                                        </td>
                                        <td>
                                            <img id="imageBg" alt={this.state.fileName} width="30" src={this.state.file} />

                                        </td>
                                        <td>
                                            <input type="button" onClick={this.handleDisplay3D} value="Process 3D" />

                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td>
                                            <input type="button" onClick={this.handleClean} value="clean / reset" />
                                        </td>
                                        <td>
                                            <input type="button" onClick={this.handleUndo} value="Undo" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td><input type="button" onClick={this.handleInverse} value="InverseImage" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Elimine les pixels isolés</td>
                                        <td><input type="button" onClick={this.handleFiltrePixelOrphelin} value="Filtre pixel" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Limite à 5 couleurs (R V B , noir, blanc)</td>
                                        <td><input type="button" onClick={this.handleFiltreImageSaturation} value="Filtre Saturation" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Permute
                                            <input style={{ width: '40px' }} type="text" value={this.state.couleurPermutationSource}></input> et
                                            <input style={{ width: '40px' }} type="text" value={this.state.couleurPermutationDestination}></input></td>
                                        <td><input type="button" onClick={this.handlePermuteCouleurs} value="Permute Couleurs" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            couleur courante <select id="selectedColor" style={{ color: this.state.colorSelected }} onChange={this.handleSelectColor}>
                                                <option value="rgb(255,0,0)" style={{ color: '#ff0000' }}>r: ff0000</option>
                                                <option value="rgb(0,255,0)" style={{ color: '#00ff00' }}>v: 00ff00</option>
                                                <option value="rgb(0,0,255)" style={{ color: '#0000ff' }}>b: 0000ff</option>
                                                <option value="rgb(0,0,0)">n: 000000</option>
                                                <option value="rgb(255,255,255)">b: ffffff</option>
                                            </select>
                                        </td>
                                        <td></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Font size<input type="text" id="drawFontSize" value={this.state.drawFontSize} onChange={this.handleChangeString} />
                                        </td>
                                        <td>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span> Font  </span>
                                            <select id="drawFontName" onChange={this.handleSelectFont}>
                                                <option value="carolingia">{this.state.in}</option>
                                                <option value="crom.regular">crom.regular</option>
                                                <option value="Roman_SD">Roman_SD</option>
                                                <option value="DOMINICA">DOMINICA</option>
                                                <option value="MorrisRomanAlternate-Black">MorrisRomanAlternate-Black</option>
                                                <option value="MorrisRoman-Black">MorrisRoman-Black</option>
                                                <option value="super-marker">Super-Marker</option>
                                                <option value="Uni Sans Heavy">Uni Sans Heavy</option>
                                            </select>
                                        </td>
                                        <td>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span> Angle Initial (degré) </span>
                                            <input style={{ width: '40px' }} type="number" id="angleInitial" value={this.state.angleInitial} onChange={this.handleChangeString} />
                                        </td>
                                        <td>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            Text:  <input type="text" id="drawTextInput" value={this.state.drawTextInput} onChange={this.handleChangeString} />

                                        </td>
                                        <td><input type="button" onClick={this.handleDrawTextAlongArc1} value="DrawText" />
                                        </td>
                                        <td><input type="button" onClick={this.handleDrawTextAlongArc2} value="DrawText" />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            X:<input style={{ width: '40px' }} type="number" id="positionTextX" value={this.state.positionTextX} onChange={this.handleChangeString} />
                                        Y:<input style={{ width: '40px' }} type="number" id="positionTextY" value={this.state.positionTextY} onChange={this.handleChangeString} />
                                        </td>
                                        <td><input type="button" onClick={this.handleDrawTextDroit} value="DrawText Droit" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>Rayon: <input style={{ width: '80px' }} type="number" id="drawCircleRayon" value={this.state.drawCircleRayon} onChange={this.handleChangeString} /></td>
                                        <td><input type="button" onClick={this.handleDrawCercle} value="DrawCircle" />
                                        </td>
                                        <td></td>
                                    </tr>

                                    <tr>
                                        <td></td>
                                        <td><input type="button" onClick={this.handlePatern1} value="Pattern Predefini 1" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><input type="button" onClick={this.handlePatern2} value="Pattern Predefini 2" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td><input type="button" onClick={this.handleSaveImage} value="Save Image" /></td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td><input type="button" onClick={this.handleExtractionContour} value="Extraction contour" /></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                            <div id="log" style={{ border: "2px solid red", textAlign: "left" }}>

                            </div>
                        </div>

                        <div class="droit">
                            <canvas ref={this.refCanvas} id="bg2dCanvas" width="500" height="500" draggable="true"></canvas>
                        </div>
                    </div>
                </div>
                <div>
                    <div id="Bg3dDiv">
                        <Bg3d ref={this.ref3d} id="Bg3d_" image2Dsrc="bg2dCanvas" fileName={this.state.fileName} />
                    </div>
                </div>
                <div id="bgCollapseKey2" style={{ textAlign: 'left', border: '1px solid red' }} onClick={(event) => { document.getElementById('bgCollapseKey2').style.display = 'none'; document.getElementById('bgCollapse2').style.display = 'block' }}>
                    <h2>+ Fonts Exemples</h2>
                </div>
                <div id="bgCollapse2" style={{ textAlign: 'left' }} class="contentCollapse" onClick={(event) => { document.getElementById('bgCollapse2').style.display = 'none'; document.getElementById('bgCollapseKey2').style.display = 'block' }}>
                    <h2>- Fonts Exemples</h2>
                    <ul id="collapse" >
                        <li><span class="label2">default                  </span> <span style={{ fontSize: "30px", fontWeight: 'bold' }}> {this.state.drawTextInput}</span></li>
                        <li><span class="label2">carolingia                  </span> <span style={{ font: "bold 30px carolingia" }} >{this.state.drawTextInput}</span></li>
                        <li><span class="label2">crom.regular                 </span> <span style={{ font: "bold 30px 'crom.regular'" }} >{this.state.drawTextInput}</span> </li>
                        <li><span class="label2">DOMINICA                    </span> <span style={{ font: "bold 30px DOMINICA", width: '500px' }} >{this.state.drawTextInput}</span></li>
                        <li><span class="label2">MorrisRoman-Black           </span> <span style={{ font: "bold 30px 'MorrisRoman-Black'" }}>{this.state.drawTextInput}</span></li>
                        <li><span class="label2">MorrisRomanAlternate-Black  </span> <span style={{ font: "bold 30px MorrisRomanAlternate-Black" }}>{this.state.drawTextInput}</span></li>
                        <li><span class="label2">Roman_SD                    </span> <span style={{ font: "bold 30px Roman_SD" }}>{this.state.drawTextInput}</span></li>
                        <li><span class="label2">super-marker                </span> <span style={{ font: "bold 30px super-marker" }}>{this.state.drawTextInput}</span></li>
                        <li><span class="label2">Affistory               </span> <span style={{ font: "bold 30px Affistory" }}>{this.state.drawTextInput}</span></li>
                        <li><span class="label2">Uni Sans Heavy               </span> <span style={{ font: "bold 30px 'Uni Sans Heavy'" }}>{this.state.drawTextInput}</span></li>
                    </ul>
                </div>
            </div>
        );

    }
}

export default Bg2d;