import 'react-dat-gui/dist/index.css';


import React, { Component } from 'react';

class Bg3dParam extends Component {
    constructor(props) {
        super(props);
        
        this.state = {           
            hauteurNoir: props.data.hauteurNoir,
            hauteurRouge: props.data.hauteurRouge,
            hauteurVert: props.data.hauteurVert,
            hauteurBleu: props.data.hauteurBleu,
            nbPoints: props.data.nbPoints,
            titre: props.data.titre,
            scale: props.data.scale
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick2 = this.handleButtonClick2.bind(this);
        this.handleUpdate = this.handleUpdate.bind(this);
    }

    handleButtonClick1 = (event) => {
        console.log("Button Calcul was clicked.");
        this.handleUpdate(event);
        this.props.calcul();
    };
    handleButtonClick2 = (event) => {
        console.log("Button Stl was clicked.");
        this.props.getStl();
    };

    handleChange(event) {
        console.log("handleChangeEpaisseur event : ", event);
        console.log("handleChangeEpaisseur event.target : ", event.target);
        console.log("handleChangeEpaisseur event.target.value : ", event.target.value);
        console.log("handleChangeEpaisseur event.target.id : ", event.target.id);
        this.setState({
            [event.target.id]: event.target.value
        })
        this.handleUpdate(event);
    }

    handleUpdate(event){
        this.props.updateParam2(this.state.hauteurNoir, this.state.hauteurRouge,this.state.hauteurVert, this.state.hauteurBleu,this.state.nbPoints,this.state.scale);
    }

    render() {
        return (
            <div>
                <h2>Params</h2>
                <table border="1">
                    <tbody>
                        <tr>
                            <td>titre:</td>
                            <td> {this.state.titre}</td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Hauteur Noir:</td>
                            <td><input type="text" id="hauteurNoir" value={this.state.hauteurNoir} onChange={this.handleChange} /> </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Hauteur Rouge:</td>
                            <td><input type="number" id="hauteurRouge" value={this.state.hauteurRouge} onChange={this.handleChange} /> </td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Hauteur Vert:</td>
                            <td> <input type="number" id="hauteurVert" value={this.state.hauteurVert} onChange={this.handleChange} /> </td>
                            <td></td>
                      </tr>
                        <tr>
                            <td>Hauteur Bleu:</td>
                            <td> <input type="number" id="hauteurBleu" value={this.state.hauteurBleu} onChange={this.handleChange} /> </td>
                            <td></td>
                      </tr>
                        <tr>
                            <td>Nombre de points de maillage (1 coté):</td>
                            <td> <input type="number" id="nbPoints" value={this.state.nbPoints} onChange={this.handleChange} /> </td>
                            <td></td>
                       </tr>
                        <tr>
                            <td>Echelle sortie:</td>
                            <td> <input type="number" id="scale" value={this.state.scale} onChange={this.handleChange} /> </td>
                            <td></td>
                       </tr>
                         <tr>
                            <td><input type="button" onClick={this.handleUpdate} value="Update" /> </td>
                            <td> <input type="button" onClick={this.handleButtonClick1} value="Calcul" /> </td>
                            <td><input type="button" style={{border: '3px solid red'}} onClick={this.handleButtonClick2} value="getStl" /></td>
                        </tr>

                    </tbody>
                </table>

            </div>
        );
    }
}
export default Bg3dParam;