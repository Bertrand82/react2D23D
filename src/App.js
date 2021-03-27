
import './App.css';
import Bg2d from './Bg2d';

function App() {
  return (
    <div className="App">
      <div>

        <div id="bgCollapseKey" style={{ textAlign: 'left' ,border: '1px solid red'}} onClick={(event) => { document.getElementById('bgCollapseKey').style.display = 'none'; document.getElementById('bgCollapse').style.display = 'block' }}>
          <h2>+ R2D23D</h2>
        </div>
        <div id="bgCollapse" style={{ textAlign: 'left' }} class="contentCollapse" onClick={(event) => {  document.getElementById('bgCollapse').style.display = 'none';  document.getElementById('bgCollapseKey').style.display = 'block' }}>
          <h2>- R2D23D</h2>
          <ul id="collapse" >
            <li>2 façon de prononcer : Soit façon starwar r2d2 ... 3d; soit : R (comme react) 2D to 3D</li>
            <li>r2d23d transforme une image 2D en un objet 3D en attribuant à chaque couleur une hauteur.</li>
            <li>r2d23d est destiné à créer des poinçons pour imprimer des monnaies.</li>
            <li>r2d23d est en version "Beta" ! </li>
            <li>Les sources sont ici : <a href="https://github.com/Bertrand82/react2D23D">r2d23d</a> . Les pull requests  sont bienvenus</li>
            <li>Bugs, idées d'amélioration, commentaires sont aussi les bienvenus: bertrand.guiral@gmail.com </li>
            <li>Mode opératoire : Choisir une image , puis processImage, puis render3D, puis getStl.</li>
            <li>Il est possible de modifier la hauteur des couleurs Noir, r,g,b. Le blanc est la couleur du fond.</li>
          </ul>
        </div>
      </div>


      <Bg2d />



    </div>
  );
}

export default App;
