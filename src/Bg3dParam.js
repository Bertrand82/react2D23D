import 'react-dat-gui/dist/index.css';


import React, { Component } from 'react';

class Bg3dParam extends Component {
    constructor(props) {
        super(props);
        console.log("Bg3dParam  props :",props)
        this.state = {           
            epaisseurBase: props.data.epaisseurBase,
            couleurFond: props.data.couleurFond,
            nbPoints: props.data.nbPoints,
            coefGrey: props.data.coefGrey,
            titre: '2D23D',

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
        this.props.updateParam(this.state.epaisseurBase, this.state.couleurFond, this.state.nbPoints,this.state.coefGrey);
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
                            <td>Epaisseur Base:</td>
                            <td><input type="text" id="epaisseurBase" value={this.state.epaisseurBase} onChange={this.handleChange} /> </td>
                            <td>epaisseur 2 base</td>
                        </tr>
                        <tr>
                            <td>Couleur fond:</td>
                            <td> <input type="text" id="couleurFond" value={this.state.couleurFond} onChange={this.handleChange} /> </td>
                            <td>Couleur du fond d'image </td>
                        </tr>
                        <tr>
                            <td>Nombre de points:</td>
                            <td> <input type="text" id="nbPoints" value={this.state.nbPoints} onChange={this.handleChange} /> </td>
                            <td>Nombre de points du maillage</td>
                        </tr>
                        <tr>
                            <td>coefGrey:</td>
                            <td> <input type="text" id="coefGrey" value={this.state.coefGrey} onMouseLeave={this.handleChange} onChange={this.handleChange} /> </td>
                            <td>coefGrey</td>
                        </tr>

                        <tr>
                            <td><input type="button" onClick={this.handleUpdate} value="Update" /> </td>
                            <td> <input type="button" onClick={this.handleButtonClick1} value="Calcul" /> </td>
                            <td><input type="button" onClick={this.handleButtonClick2} value="getStl" /></td>
                        </tr>

                    </tbody>
                </table>

            </div>
        );
    }
}
export default Bg3dParam;