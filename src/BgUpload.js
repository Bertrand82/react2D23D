
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
            colorSelected: '#ff0000'
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeLoadImage = this.handleChangeLoadImage.bind(this);
        this.handleProcess = this.handleProcess.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
        this.handleInverse = this.handleInverse.bind(this);
        this.handleFiltre1 = this.handleFiltre1.bind(this);
        this.handleSaveImage = this.handleSaveImage.bind(this);
        this.handleDrawTextAlongArc = this.handleDrawTextAlongArc.bind(this);
        this.handleDrawCercle = this.handleDrawCercle.bind(this);
        this.handleSelectColor = this.handleSelectColor.bind(this);
        this.initCanvasText();
    }
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
        this.setState({
            file: URL.createObjectURL(event.target.files[0]),
            fileName: event.target.files[0].name
        })

    }

    handleProcess(event) {
        console.log("handleProcess");
        const newImage = new Image();
        newImage.src = this.state.file;
        const img2 = document.getElementById("imageBg");
        console.log("handleProcess ", img2);
        // Je remplis en blanc
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
        this.ctx.drawImage(img2, 0, 0);
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
        var canvas = document.getElementById('bg2dCanvas');
        canvas.toBlob(function (blob) {
            saveAs(blob, "r2d23d_screenshot.png");
        });
    }

    handleDrawTextAlongArc() {
        console.log("handleDrawTextAlongArc " + this.state.drawTextInput);
        var rayon = 100;
        var angleByChar = 30.0 / rayon;
        this.drawTextAlongArc( this.state.drawTextInput, this.w / 2, this.h / 2, rayon, angleByChar)
    }

    handleDrawCercle() {
        console.log("handleDrawCercle ");
        console.log("handleDrawCercle B >"+this.state.colorSelected+"<");
        var rayon = this.state.drawCircleRayon;
        this.ctx.beginPath();

        this.ctx.arc(this.w / 2, this.h / 2, rayon, 0, 2 * Math.PI);
        this.ctx.closePath();
        this.ctx.fill();
    }

    handleSelectColor(event){
        console.log("handleSelectColor A >"+event.target.value+"<");
        this.setState({
            colorSelected: event.target.value
        });
        this.ctx.fillStyle = event.target.value; 
        this.ctx.strokeStyle = event.target.value;
        console.log("handleSelectColor B >"+this.state.colorSelected+"<");
    }
    drawTextAlongArc( str, centerX, centerY, radius, angleByChar) {
        console.log("drawTextAlongArc B >"+this.state.colorSelected+"<");
        var len = str.length,    s;
        var angle = len * angleByChar;
        console.log("handleDrawTextAlongArc str " + str);
        console.log("handleDrawTextAlongArc angle " + angle);
        this.ctx.font = "60px Arial";
        console.log("handleDrawTextAlongArc ", this.ctx);
        this.ctx.save();

        this.ctx.translate(centerX, centerY);
        this.ctx.rotate(-1 * angle / 2);
        this.ctx.rotate(-1 * (angle / len) / 2);
        for (var n = 0; n < len; n++) {
            this.ctx.rotate(angleByChar );
            this.ctx.save();
            this.ctx.translate(0, -1 * radius);
            s = str[n];
            this.ctx.fillStyle = this.state.colorSelected; 
            this.ctx.strokeStyle = this.state.colorSelected;
            this.ctx.fillStyle =this.state.colorSelected;
            this.ctx.fillText(s, 0, 0);
            this.ctx.restore();
        }
        this.ctx.restore();
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
        var canvas = document.getElementById('bg2dCanvas');
        this.ctx = canvas.getContext('2d');
        this.w = canvas.width;
        this.h = canvas.height;
        this.imageData = this.ctx.getImageData(0, 0, this.w, this.h);
        this.ctx.beginPath();
        this.ctx.rect(0, 0, canvas.width, canvas.height);


    }

    handleChange(event) {
        console.log("handleChange event : ", event);
        console.log("handleChange event.target : ", event.target);
        console.log("handleChange event.target.value : ", event.target.value);
        console.log("handleChange event.target.id : ", event.target.id);
        this.setState({
            [event.target.id]: event.target.value
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
                                    <input type="button" onClick={this.handleProcess} value="processImage" />
                                </td>
                                <td>
                                    <input type="button" onClick={this.handleDisplay3D} value="render3D" />

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
                                <td><input type="text" id="drawTextInput" value={this.state.drawTextInput} onChange={this.handleChange} /></td>
                                <td><input type="button" onClick={this.handleDrawTextAlongArc} value="DrawText" />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td><input type="text" id="drawCircleRayon" value={this.state.drawCircleRayon} onChange={this.handleChange} /></td>
                                <td><input type="button" onClick={this.handleDrawCercle} value="DrawCircle" />
                                </td>
                                <td></td>
                            </tr>
                            <tr>
                                <td>
                                    <img id="imageBg" alt={this.state.fileName} width="100" src={this.state.file} />
                                </td>
                                <td><input type="button" onClick={this.handleSaveImage} value="Save Image" /></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>


                </div>
            );
        }
    }
}

export default BgUpload;