import './Cabecalho.css'; // Arquivo CSS, se desejar estilizar separado

function Cabecalho() {
  return (
    <header className="cabecalho">
      <img 
        src="Assets/img/Logo_AF.png" 
        alt="Logo do Arte & Frequência" 
        className="logo"
      />
    </header>
  );
}

export default Cabecalho;