
import Bg3d from './Bg3d';
const React = require('react');

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
        this.handleInverse = this.handleInverse.bind(this);
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
        console.log("handleInverse w:"+this.imageData.width+"h:"+this.imageData.height);
        var newImageData = new ImageData(this.imageData.width, this.imageData.height);
        for (var i = 0; i < this.w; i++) {
            //var ii = this.w -i-1;
            var ii = i;
            for (var j = 0; j < this.h; j++) {
                var jj = this.h-j-1;
                var k = 4 * (i * this.w + j);
                var kk = 4 * (ii * this.w + jj);
                newImageData.data[kk]=this.imageData.data[k];
                newImageData.data[kk+1]=this.imageData.data[k+1];
                newImageData.data[kk+2]=this.imageData.data[k+2];
                newImageData.data[kk+3]=this.imageData.data[k+3];
                newImageData.data[kk+4]=this.imageData.data[k+4];
            }
        }
        console.log("handleInverse done");
        this.imageData = newImageData;
        this.ctx.putImageData(this.imageData, 0, 0);
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
                            <input type="file" onChange={this.handleChange} inputProps={{ accept: 'image/*' }} />
                            </td>
                            <td>
                            <input type="button" onClick={this.handleProcess} value="processImage" />
                            </td>
                            <td>
                            <input type="button" onClick={this.handleDisplay3D} value="render3D" />
                   
                            </td>
                        </tr>
                        <tr>
                            <td></td>
                            <td><input type="button" onClick={this.handleInverse} value="InverseImage" />
                            </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>
                            <img id="imageBg" alt={this.state.fileName} width="100" src={this.state.file} />
                            </td>
                            <td></td>
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