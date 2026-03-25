import { Link } from "react-router-dom"; // Importante para links internos
import "./Carousel.css"; // Certifique-se de criar um arquivo CSS para os estilos do carrossel

function Carousel() {
  const images = [
    { src: "Assets/img/HVL_0003.jpeg", alt: "Imagem_1", link: "/caminho-1" },
    { src: "Assets/img/HVL_0002.jpeg", alt: "Imagem_2", link: "/musicalizacao" },
    { src: "Assets/img/HVL_0001.jpeg", alt: "Imagem_3", link: "/galeria" },
    { src: "Assets/img/HVL_0004.jpeg", alt: "Imagem_4", link: "https://youtu.be/fIFbDPtJbtc?si=QOtmYImSW-0ocZU6" },
  ];

  return (
    <div className="carousel-infinite-container">
      <div className="carousel-track">
        {[...images, ...images].map((img, index) => {
          // Verifica se o link começa com "http" (Link Externo)
          const isExternal = img.link.startsWith("http");

          if (isExternal) {
            return (
              <a key={index} href={img.link} target="_blank" rel="noreferrer" className="carousel-slide">
                <img src={img.src} alt={img.alt} />
              </a>
            );
          }

          // Se não começar com http, trata como Link Interno
          return (
            <Link key={index} to={img.link} className="carousel-slide">
              <img src={img.src} alt={img.alt} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Carousel;
