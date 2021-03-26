
import { Blending } from 'three';

import Bg3d from './Bg3d';
import { saveAs } from 'file-saver';
const React = require('react');

class BgUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileName: "No Image",
            display3D: false,
            drawTextInput: "Montpezat de Quercy",
            drawCircleRayon: 140,
            colorSelected: '#ff0000',
            drawFontSize: '50px',
            drawFontName: 'carolingia'
        }
        this.handleChangeString = this.handleChangeString.bind(this);
        this.handleChangeLoadImage = this.handleChangeLoadImage.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
        this.handleInverse = this.handleInverse.bind(this);
        this.handleFiltrePixelOrphelin = this.handleFiltrePixelOrphelin.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
        this.handleDrawTextAlongArc = this.handleDrawTextAlongArc.bind(this);
        this.handleDrawCercle = this.handleDrawCercle.bind(this);
        this.handleSelectColor = this.handleSelectColor.bind(this);
        this.handlePatern1 = this.handlePatern1.bind(this);
        this.handlePatern2 = this.handlePatern2.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleSelectFont = this.handleSelectFont.bind(this);
        this.handleClean = this.handleClean.bind(this);
        this.handleFiltreImageSaturation = this.handleFiltreImageSaturation.bind(this);
        this.display = this.display.bind(this);

        this.refCanvas = React.createRef();
        this.ref3d = React.createRef();

        console.log("refCanvas : ", this.refCanvas)


    }
    componentDidMount() {
        this.initCanvasText();
        this.display("2d");

    }
    refCanvas;
    ctx;
    w;
    h;
    imageData;



    handleDisplay3D(event) {
        console.log("handleDisplay3D", event);
        this.setState({
            display3D: !this.state.display3D,
        })
        this.display("3d");
        this.ref3d.current.process3d();
        this.ref3d.current.calcul();
    }

    display(viewToDisplay) {
        console.log("BgUpload diplay value", viewToDisplay)
        console.log("BgUpload diplay ref3d current: ", this.ref3d.current);
        var bg3dDiv = document.getElementById("Bg3dDiv");
        var bg2dDiv = document.getElementById("Bg2dDiv");
        console.log("display : ", viewToDisplay);
        if ("2d" === viewToDisplay) {
            bg3dDiv.style.display = "none";
            bg2dDiv.style.display = "block";
        } else if ("3d" === viewToDisplay) {
            bg2dDiv.style.display = "none";
            bg3dDiv.style.display = "block";
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

    handleClean() {
        this.ctx.rect(0, 0, this.w, this.h);
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
    }


    handleInverse() {
        console.log("handleInverse w:" + this.imageData.width + "h:" + this.imageData.height);
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
                newImageData.data[kk + 4] = this.imageData.data[k + 4];
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
        console.log("handleFiltrePixelOrphelin start " + this.h + " " + this.w);
        var oldImageData = this.ctx.getImageData(0, 0, this.h, this.w);
        var newImageData = new ImageData(this.imageData.width, this.imageData.height);
        console.log("handleFiltrePixelOrphelin start " + newImageData.width + " " + newImageData.height);
        var nbPixelModified = 0;
        var nbPixelModifiedNo = 0;

        for (var i = 0; i < oldImageData.width; i++) {
            for (var j = 0; j < oldImageData.height; j++) {
                var k = 4 * (i * this.w + j);
                var nPixelConnec = this.isPixelIsolated(i, j, this.imageData)
                var k2
                if (nPixelConnec < 2) {
                    k2 = 4 * (i * this.w + j + 1);
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
        console.log("handleFiltrePixelOrphelin done nbPixelModified ", nbPixelModified);
        console.log("handleFiltrePixelOrphelin done nbPixelModifiedNo ", nbPixelModifiedNo);
        this.ctx.putImageData(newImageData, 0, 0);
        this.imageData = newImageData;

    }

    handleSaveImage() {
        var canvas = this.refCanvas.current;
        canvas.toBlob(function (blob) {
            saveAs(blob, "r2d23d_screenshot.png");
        });
    }

    handleDrawTextAlongArc() {
        console.log("handleDrawTextAlongArc " + this.state.drawTextInput);
        var rayon = this.state.drawCircleRayon;
        var angleByChar = 30.0 / rayon;
        this.drawTextAlongArc(this.state.drawTextInput, rayon, angleByChar)
    }

    handleDrawCercle() {

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
        }
        )
        console.log("handleSelectFont A >" + font + "<");
        this.setFont();
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
        console.log(" Font size : " + this.state.drawFontSize)
        var font = this.state.drawFontSize + " " + this.state.drawFontName;
        console.log("Font  : " + font)
        this.ctx.font = font;
    }

    drawTextAlongArc(str, radius, angleByChar) {
        this.setFont();
        var centerX = this.w / 2;
        var centerY = this.h / 2;
        console.log("drawTextAlongArc B >" + this.state.colorSelected + "<");
        var len = str.length, s;
        var angle = len * angleByChar;
        console.log("handleDrawTextAlongArc str " + str);
        console.log("handleDrawTextAlongArc angle " + angle);

        console.log("handleDrawTextAlongArc ", this.ctx);
        this.ctx.save();

        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(-1 * angle / 2);
        this.ctx.rotate(-1 * (angle / len) / 2);
        for (var n = 0; n < len; n++) {
            var angle
            var isUpperCase
            if (str[n] === str[n].toUpperCase()) {
                isUpperCase = true;
                angle = 2.1 * angleByChar;
            } else {
                isUpperCase = false;
                angle = angleByChar;
            }
            console.log("drawTextAlongArc " + str[n] + "  " + isUpperCase)

            this.ctx.save();
            this.ctx.translate(0, -1 * radius);
            s = str[n];
            this.ctx.fillText(s, 0, 0);

            this.ctx.restore();
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

    getColor(i, j, imageData) {
        var k = 4 * (i * this.w + j);
        var red = imageData.data[k];
        var green = imageData.data[k + 1];
        var blue = imageData.data[k + 2];
        var color = red * 0x10000 + green * 0x100 + blue;
        return color;
    }



    filtreImageSaturation() {
        var imageData = this.ctx.getImageData(0, 0, this.w, this.h);
        var data = imageData.data;
        console.log("filtreImageSaturation");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.filtreImageSaturationPixel(i, j, data);
            }
        }
        this.ctx.putImageData(imageData, 0, 0);
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

        this.ctx.rect(0, 0, this.w, this.h);
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

    render() {

        return (

            <div>
                <div  style={{ textAlign: 'left' ,border: '1px solid red'}} id="Bg3dT">
                    <input type="button" onClick={(event) => { console.log("retour from3D", event); this.display("2d") }} value=" 2D" />
                    <input type="button" onClick={(event) => { console.log("retour from3D", event); this.display("3d") }} value=" 3D" />
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
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <select id="selectedColor" onChange={this.handleSelectColor}>
                                                <option value="rgb(255,0,0)">r: ff0000</option>
                                                <option value="rgb(0,255,0)">v: 00ff00</option>
                                                <option value="rgb(0,0,255)">b: 0000ff</option>
                                                <option value="rgb(0,0,0)">n: 000000</option>
                                                <option value="rgb(255,255,255)">b: ffffff</option>
                                            </select>
                                        </td>
                                        <td><input type="button" onClick={this.handleInverse} value="InverseImage" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><input type="button" onClick={this.handleFiltrePixelOrphelin} value="Filtre pixel" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><input type="button" onClick={this.handleFiltreImageSaturation} value="Filtre Sturation" />
                                        </td>
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
                                                <option value="carolingia">carolingia</option>
                                                <option value="crom.regular">crom.regular</option>
                                                <option value="Roman_SD">Roman_SD</option>
                                                <option value="DOMINICA">DOMINICA</option>
                                                <option value="MorrisRomanAlternate-Black">MorrisRomanAlternate-Black</option>
                                                <option value="MorrisRoman-Black">MorrisRoman-Black</option>
                                            </select>
                                        </td>
                                        <td>
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input type="text" id="drawTextInput" value={this.state.drawTextInput} onChange={this.handleChangeString} />

                                        </td>
                                        <td><input type="button" onClick={this.handleDrawTextAlongArc} value="DrawText" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td><input type="text" id="drawCircleRayon" value={this.state.drawCircleRayon} onChange={this.handleChangeString} /></td>
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
                                        <td><input type="button" onClick={this.handlePatern} value="Pattern Predefini 2" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td>
                                        </td>
                                        <td><input type="button" onClick={this.handleSaveImage} value="Save Image" /></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
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
            </div>
        );

    }
}

export default BgUpload;