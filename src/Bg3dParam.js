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
            bombageNoir: props.data.bombageNoir,
            bombageRouge: props.data.bombageRouge,
            bombageVert: props.data.bombageVert,
            bombageBleu: props.data.bombageBleu,
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
                            <td> Noir:</td>
                            <td>Hauteur: <input style={{width:'60px'}} type="text" id="hauteurNoir" value={this.state.hauteurNoir} onChange={this.handleChange} /> </td>
                            <td>Bombage<input style={{width:'30px'}} type="text" id="bombageNoir" value={this.state.bombageNoir} onChange={this.handleChange} /></td>
                        </tr>
                        <tr>
                            <td> Rouge:</td>
                            <td>Hauteur <input style={{width:'60px'}} type="number" id="hauteurRouge" value={this.state.hauteurRouge} onChange={this.handleChange} /> </td>
                            <td>Bombage<input style={{width:'30px'}} type="text" id="bombageRouge" value={this.state.bombageRouge} onChange={this.handleChange} /></td>
                        </tr>
                        <tr>
                            <td> Vert:</td>
                            <td>Hauteur <input style={{width:'60px'}} type="number" id="hauteurVert" value={this.state.hauteurVert} onChange={this.handleChange} /> </td>
                            <td>Bombage<input style={{width:'30px'}} type="text" id="bombageVert" value={this.state.bombageVert} onChange={this.handleChange} /> </td>
                      </tr>
                        <tr>
                            <td>Bleu:</td>
                            <td>Hauteur  <input style={{width:'60px'}} type="number" id="hauteurBleu" value={this.state.hauteurBleu} onChange={this.handleChange} /> </td>
                            <td>Bombage <input style={{width:'30px'}} type="text" id="bombageBleu" value={this.state.bombageBleu} onChange={this.handleChange} /></td>
                      </tr>
                        <tr>
                            <td>Nombre de points de maillage (1 coté):</td>
                            <td> <input style={{width:'60px'}} type="number" id="nbPoints" value={this.state.nbPoints} onChange={this.handleChange} /> </td>
                            <td></td>
                       </tr>
                        <tr>
                            <td>Echelle sortie:</td>
                            <td> <input style={{width:'60px'}} type="number" id="scale" value={this.state.scale} onChange={this.handleChange} /> </td>
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