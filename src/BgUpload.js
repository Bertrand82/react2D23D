
import Bg3d from './Bg3d';
const React = require('react');

const debug = false;


class BgUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            fileName: "No Image",
            display3D: false,

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleProcess = this.handleProcess.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
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
    handleChange(event) {
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

        var width = this.imageData.width;
        var height = this.imageData.height;
        this.filtreImageData(this.imageData);
        this.ctx.putImageData(this.imageData, 0, 0);
        console.log("newImage : ", newImage);
        console.log("newImage width : ", newImage.width);
        console.log("newImage height: ", newImage.height);
        console.log("ImageData.width : ", this.imageData.width);
        console.log("ImageData.height : ", this.imageData.height);
        console.log("ImageData.data.length : ", this.imageData.data.length);

    }

    filtreImageData() {

        console.log("filtreImageData");
        for (var i = 0; i < this.w; i++) {
            for (var j = 0; j < this.h; j++) {
                this.processPixel(i, j);
            }
        }
    }


    processPixel(x, y) {
        var i = 4 * (y * this.w + x);
        var data = this.imageData.data;
        var red = data[i];
        var green = data[i + 1];
        var blue = data[i + 2];
        var alpha = data[i + 3];
        if (red > 0xf0 && green > 0xf0 && blue > 0xf0) {
            data[i] = 0xff;
            data[i + 1] = 0xff;
            data[i + 2] = 0xff;
        } else if (red > 0x80) {
            data[i] = 0xff;
            data[i + 1] = 0;
            data[i + 2] = 0;

        } else if (green > 0x80) {
            data[i] = 0;
            data[i + 1] = 0xff;
            data[i + 2] = 0;

        } else if (blue > 0x80) {
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

    render() {
        if (this.state.display3D) {
            return (
                <div>

                    <Bg3d image2Dsrc={this.ctx.canvas.id} />
                </div>
            )
        } else {
            return (
                <div>

                    <input type="file" onChange={this.handleChange} inputProps={{ accept: 'image/*' }} />
                    <input type="button" onClick={this.handleProcess} value="processImage" />
                    <input type="button" onClick={this.handleDisplay3D} value="render3D" />
                    <img id="imageBg" alt={this.state.fileName} width="100" src={this.state.file} />

                </div>
            );
        }
    }
}

export default BgUpload;