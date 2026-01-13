/*import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Carousel.css';

function Carousel() {
  return (
    <div className="container mt-4">
      <div id="demo" className="carousel slide" data-bs-ride="carousel">

        <div className="carousel-indicators">
          <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="3"></button>
        </div>
      
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="Assets/img/HVL_0003.jpeg" alt="Imagem_1" className="d-block w-100"/>
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0002.jpeg" alt="Imagem_2" className="d-block w-100"/>
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0001.jpeg" alt="Imagem_3" className="d-block w-100"/>
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0004.jpeg" alt="Imagem_4" className="d-block w-100"/>
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;*/


import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Carousel.css';

function Carousel() {
  return (
    <div className="carousel-container">
      <div id="demo" className="carousel slide" data-bs-ride="carousel">

        <div className="carousel-indicators">
          <button type="button" data-bs-target="#demo" data-bs-slide-to="0" className="active"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="1"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="2"></button>
          <button type="button" data-bs-target="#demo" data-bs-slide-to="3"></button>
        </div>
      
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="Assets/img/HVL_0003.jpeg" alt="Imagem_1" />
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0002.jpeg" alt="Imagem_2" />
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0001.jpeg" alt="Imagem_3" />
          </div>
          <div className="carousel-item">
            <img src="Assets/img/HVL_0004.jpeg" alt="Imagem_4" />
          </div>
        </div>

        <button className="carousel-control-prev" type="button" data-bs-target="#demo" data-bs-slide="prev">
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#demo" data-bs-slide="next">
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>
    </div>
  );
}

export default Carousel;
