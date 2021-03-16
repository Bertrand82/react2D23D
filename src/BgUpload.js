import BgImages from './BgImages';
import Bg3d from './Bg3d';
const React = require('react');

const debug = false;


class BgUpload extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            file: null,
            fileName: "No Image",
            display3D: false,

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleProcess = this.handleProcess.bind(this);
        this.handleDisplay3D = this.handleDisplay3D.bind(this);
        this.initCanvasText();
    }
    ctx;

    

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
        this.ctx.fillStyle = "rgba(255, 255, 255, 1)";
        this.ctx.fill();
        this.ctx.drawImage(img2, 0, 0);
        
        var imageData = this.ctx.getImageData(20, 20, 60, 60);

        var width = imageData.width;
        var height = imageData.height;
        console.log("newImage : ", newImage);
        console.log("newImage width : ", newImage.width);
        console.log("newImage height: ", newImage.height);
        console.log("ImageData.width : ", imageData.width);
        console.log("ImageData.height : ", imageData.height);
        console.log("ImageData.data : ", imageData.data);
        console.log("ImageData.data.length : ", imageData.data.length);

    }

    initCanvasText() {
        var canvas = document.getElementById('bg2dCanvas');
        this.ctx = canvas.getContext('2d');
    
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

                    <input type="file" onChange={this.handleChange} />
                    <input type="button" onClick={this.handleProcess} value="processImage" />
                    <input type="button" onClick={this.handleDisplay3D} value="render3D" />
                    <img id="imageBg" alt={this.state.fileName} width="100" src={this.state.file} />

                </div>
            );
        }
    }
}

export default BgUpload;