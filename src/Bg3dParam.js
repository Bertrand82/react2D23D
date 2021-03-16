import 'react-dat-gui/dist/index.css';


import React, { Component } from 'react';

class Bg3dParam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            data: "initialState",
            epaisseurBase: 5,
            couleurFond: '0xFFFFFF',
            nbPoints: 20,
            e_nervure: 1,
            titre: 'Params ',

        };
        this.handleChange = this.handleChange.bind(this);
        this.handleButtonClick2 = this.handleButtonClick2.bind(this);
    }

    handleButtonClick2 = (event) => {
        console.log("Button was clicked.");
        this.props.updateParam(this.state.epaisseurBase, this.state.couleurFond, this.state.nbPoints);
        
    };

    handleChange(event){
        console.log("handleChangeEpaisseur event : ",event);
        console.log("handleChangeEpaisseur event.target : ",event.target);
        console.log("handleChangeEpaisseur event.target.value : ",event.target.value);
        console.log("handleChangeEpaisseur event.target.id : ",event.target.id);
        this.setState({          
            [event.target.id]: event.target.value
        })
    }

    render() {
        return (
            <div>
                <h2>Params</h2>
                <table border="1">
                    <tr>
                        <td>titre:</td><td> {this.state.data.titre}</td><td></td>
                    </tr>
                    <tr>
                        <td>Epaisseur:</td>
                        <td><input type="text" id="epaisseurBase"  defaultValue ={this.state.epaisseurBase} onChange={this.handleChange}/> </td>
                        <td>epaisseur 2 base</td>
                    </tr>
                    <tr>
                        <td>Couleur fond:</td>
                        <td> <input type="text" id="couleurFond"  defaultValue={this.state.couleurFond} onChange={this.handleChange}/> </td>
                        <td>Couleur du fond d'image </td>
                    </tr>
                    <tr>
                        <td>Nombre de points:</td>
                        <td> <input type="text" id="nbPoints"  defaultValue={this.state.nbPoints} onChange={this.handleChange}/> </td>
                        <td>Nombre de points du maillage</td>
                    </tr>

                    <tr>
                        <td></td>
                        <td> <input type="button" onClick={this.handleButtonClick2} value="Envoi" /> </td>
                        <td></td>
                    </tr>


                </table>
                
            </div>
        );
    }
}
export default Bg3dParam;