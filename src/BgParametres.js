import React from 'react';
import PropTypes from 'prop-types';




var diagonale = function (data) {
  var dia2 = data.cote_a * data.cote_a + data.cote_b * data.cote_b;
  var dia = Math.sqrt(dia2);
  return Number.parseFloat(dia).toFixed(0);
}
var hauteur = function (data) {
  var h = diagonale(data) / 2;
  return h;
}

var centre = function (cote, hauteur) {
  var a = cote / 2;
  var rTierPoint = (a * a + hauteur * hauteur) / (2 * a);
  return Number.parseFloat(rTierPoint).toFixed(0);
}
var rayon = function (cote, hauteur, e) {
  var centre_ = centre(cote, hauteur);
  var r = centre_ - e;
  return r;
}

const Stats = ({ data }) => (
  <section>
    <h2>Paramètres :</h2>
    <table border="1">
      <tr>
        <td>titre:</td><td> {data.titre}</td><td></td>
      </tr>
      <tr>
        <td>Coté a:</td>
        <td> {data.cote_a}</td>
        <td>Longueur d'un coté en cm (extrados)</td>
      </tr>
      <tr>
        <td>Coté b:</td>
        <td> {data.cote_b}</td>
        <td>Longueur de l'autre coté en cm (extrados) </td>
      </tr>
      <tr>
        <td>Epaisseur Nervure:</td>
        <td> {data.e_nervure}</td>
        <td>Epaisseur des nervures en cm</td>
      </tr>
      <tr>
        <td>Diagonale :</td>
        <td> {diagonale(data)}</td>
        <td>Longueur de la diagonale (extrados)</td>
      </tr>
      <tr>
        <td>Hauteur :</td><td> {hauteur(data)}</td>
        <td>Hauteur (extrados)</td>
      </tr>
      <tr>
        <td>Position centre a : </td><td> {centre(data.cote_a, hauteur(data))}</td><td></td>
      </tr>
      <tr>
        <td>Position centre b :</td><td>  {centre(data.cote_b, hauteur(data))}</td><td></td>
      </tr>
      <tr>
        <td>rayon  a :</td><td>{rayon(data.cote_a, hauteur(data), data.e_nervure)}</td><td></td>
      </tr>
      <tr>
        <td>rayon  b :</td><td>{rayon(data.cote_b, hauteur(data), data.e_nervure)}</td><td></td>
      </tr>


    </table>
  </section>
);



Stats.propTypes = {
  data: PropTypes.object.isRequired
};



export default Stats;