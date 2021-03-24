
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
            drawTextInput: "text a ecrire",
            drawCircleRayon: 100,
            colorSelected: '#ff0000',
            drawFontSize: '30px',
            drawFontName: 'carolingia'
        }
        this.handleChangeString = this.handleChangeString.bind(this);
        this.handleChangeLoadImage = this.handleChangeLoadImage.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
        this.handleInverse = this.handleInverse.bind(this);
        this.handleFiltre1 = this.handleFiltre1.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
        this.handleDrawTextAlongArc = this.handleDrawTextAlongArc.bind(this);
        this.handleDrawCercle = this.handleDrawCercle.bind(this);
        this.handleSelectColor = this.handleSelectColor.bind(this);
        this.handlePatern = this.handlePatern.bind(this);
        this.handleChangeNumber = this.handleChangeNumber.bind(this);
        this.handleSelectFont = this.handleSelectFont.bind(this);
        this.handleClean = this.handleClean.bind(this);
        this.refCanvas = React.createRef();
        console.log("refCanvas : ",this.refCanvas)
        
        
    }
    componentDidMount(){
        this.initCanvasText();
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
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
    }

    handleProcess____DEPRECATED(event) {
        console.log("handleProcess");
        const newImage = new Image();
        newImage.src = this.state.file;
        const img2 = document.getElementById("imageBg");
        console.log("handleProcess ", img2);
        // Je remplis en blanc

        console.log("Image ctx : ", this.ctx);
        console.log("Image w: ", this.w);
        console.log("Image h: ", this.h);
        this.imageData = this.ctx.getImageData(0, 0, this.w, this.h);

        this.filtreImageData(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        console.log("newImage : ", newImage);
        console.log("newImage width : ", newImage.width);
        console.log("newImage height: ", newImage.height);
        console.log("ImageData.width : ", this.imageData.width);
        console.log("ImageData.height : ", this.imageData.height);
        console.log("ImageData.data.length : ", this.imageData.data.length);

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

    handleFiltre1() {
        console.log("filtre pixel 1")
        var newImageData = new ImageData(this.imageData.width, this.imageData.height);
        for (var i = 1; i < this.w - 1; i++) {
            for (var j = 1; j < this.h - 1; j++) {
                var k = 4 * (i * this.w + j);
                var nPixelConnec = this.isPixelIsolated(i, j, this.imageData)

                if (nPixelConnec < 2) {
                    var k2 = 4 * (i * this.w + j + 1);
                } else {
                    var k2 = k;
                }
                newImageData.data[k] = this.imageData.data[k2];
                newImageData.data[k + 1] = this.imageData.data[k2 + 1];
                newImageData.data[k + 2] = this.imageData.data[k2 + 2];
                newImageData.data[k + 3] = this.imageData.data[k2 + 3];
                newImageData.data[k + 4] = this.imageData.data[k2 + 4];
            }
        }
        console.log("filtre pixel 1 done");
        this.imageData = newImageData;
        this.ctx.putImageData(this.imageData, 0, 0);
    }

    handleSaveImage() {
        var canvas = this.refCanvas.current;
        canvas.toBlob(function (blob) {
            saveAs(blob, "r2d23d_screenshot.png");
        });
    }

    handleDrawTextAlongArc() {
        console.log("handleDrawTextAlongArc " + this.state.drawTextInput);
        var rayon = 100;
        var angleByChar = 30.0 / rayon;
        this.drawTextAlongArc(this.state.drawTextInput, rayon, angleByChar)
    }

    handleDrawCercle() {
        console.log("handleDrawCercle ");
        console.log("handleDrawCercle B >" + this.state.colorSelected + "<");
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
    handlePatern(event) {
        console.log("Pattern ");
        this.selectColor("rgb(0,0,0)")
        this.drawCercleFill(150);
        this.selectColor("rgb(255,0,0)");
        this.drawCercleFill(140);
        this.selectColor("black");
        var text = this.state.drawTextInput;
        var r = 95;
        this.drawTextAlongArc(text, r, 30.0 / r);
    }
    drawCercleFill(rayon) {
        console.log("drawCercle ");
        console.log("drawCercle B >" + this.state.colorSelected + "<");

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
            this.ctx.rotate(angleByChar);
            this.ctx.save();
            this.ctx.translate(0, -1 * radius);
            s = str[n];
            this.ctx.fillStyle = this.state.colorSelected;
            this.ctx.strokeStyle = this.state.colorSelected;
            this.ctx.fillStyle = this.state.colorSelected;
            this.ctx.fillText(s, 0, 0);
            this.ctx.restore();
        }
        this.ctx.restore();
    }
    selectColor(color) {
        this.setState({
            colorSelected: color
        });
        this.ctx.fillStyle = color;
        this.ctx.strokeStyle = color;

        console.log("selectColor B >" + color + "<");
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



    filtreImageData() {
        console.log("filtreImageData");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.filtreImageDataPixel(i, j);
            }
        }
    }


    filtreImageDataPixel(x, y) {
        var i = 4 * (y * this.w + x);
        var data = this.imageData.data;
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
        console.log("refCanvas : ",this.refCanvas)
        var canvas =  this.refCanvas.current;
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.imageData = this.ctx.getImageData(0, 0, this.w, this.h);
        this.handleClean();
        this.ctx.beginPath();
        this.ctx.rect(0, 0, canvas.width, canvas.height);

        //canvas.addEventListener("dragend", bgListener);
        function bgListener_DEPRECATED(event) {
            console.log("CLICK YES", event);
            console.log("CLICK YES event.clientX", event.clientX);
            console.log("CLICK YES event.clientY", event.clientY);
            var rect = event.target.getBoundingClientRect();
            var x = event.clientX - rect.left; //x position within the element.
            var y = event.clientY - rect.top;  //y position within the element.
            console.log("CLICK YES X", x);
            console.log("CLICK YES Y", y);
        }
        function copyCanvas____DEPRECATED(x, y) {
            console.log("copyCanvas startb   " + canvas);
            var canvas1 =    this.refCanvas.current;
            var context1 = canvas1.getContext('2d');
            var canvas2 = document.getElementById('bgCanvasAuxilliaire');
            var img = document.getElementById('imageBg');
            context1.drawImage(canvas2, x, y);
            console.log("copyCanvas done   ");
        }
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
        if (this.state.display3D) {
            return (
                <div>
                    <Bg3d image2Dsrc={this.ctx.canvas.id} fileName={this.state.fileName} />
                </div>
            )
        } else {
            return (
                <div>
                    <div id="global">
                        <div id="gauche">
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
                                            <input type="button" onClick={this.handleDisplay3D} value="render3D" />

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
                                                <option value="rgb(255,0,0)">r ff0000</option>
                                                <option value="rgb(0,255,0)">v 00ff00</option>
                                                <option value="rgb(0,0,255)">b 0000ff</option>
                                                <option value="rgb(0,0,0)">n 000000</option>
                                                <option value="rgb(255,255,255)">b ffffff</option>
                                            </select>
                                        </td>
                                        <td><input type="button" onClick={this.handleInverse} value="InverseImage" />
                                        </td>
                                        <td></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><input type="button" onClick={this.handleFiltre1} value="Filtre pixel" />
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
                                        <td><input type="button" onClick={this.handlePatern} value="Pattern Predefini" />
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

                        <div id="droit">
                            <canvas ref={this.refCanvas} id="bg2dCanvas" width="500" height="500" draggable="true"></canvas>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

export default BgUpload;