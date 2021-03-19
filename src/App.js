
import './App.css';
import BgUpload from './BgUpload';

function App() {
  return (
    <div className="App">

      <h2>R2D23D</h2>
      
        <ul style={{textAlign: 'left'}}>
          <li>2 façon de prononcer : Soit r2d2 ... 3d; soit : R (comme react) 2D to 3D</li>
          <li>r2d23d transforme une image 2D en un objet 3D en attribuant à chaque couleur une hauteur.</li>
          <li>r2d23d est destiné à créer des poinçon pour imprimer des monaies.</li>
          <li>r2d23d est en version "Beta" ! </li>
          <li>Les sources sont ici : <a href="https://github.com/Bertrand82/react2D23D">r2d23d</a> . Les pull requests  sont bienvenus</li>
          <li>Bugs, idées d'amélioration, commentaires sont aussi les bienvenus: bertrand.guiral@gmail.com </li>
          <li>Mode opératoire : Choisir une image , puis processImage, puis render3D, puis get stl.</li>
        </ul>
     


      <BgUpload/>

     vBeta.0.0.1

    </div>
  );
}

export default App;
