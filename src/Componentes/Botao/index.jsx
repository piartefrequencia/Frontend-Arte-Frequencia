function Botao ({cor, nome, funcao}) {
    return (
        <>
        <button type="button" className={`btn btn -${cor}`} onClick={funcao}>{nome}</button>
        
        <button onClick={musicaAnterior}><i className="fas fa-backward"></i></button>

        <button onClick={togglePlayPause}><i id="playPauseIcon" className="fas fa-play"></i></button>

        <button onClick={pararAudio}><i className="fas fa-stop"></i></button>

        <button onClick={proximaMusica}><i className="fas fa-forward"></i></button>

        <button onClick={toggleMute}><i id="muteIcon" className="fas fa-volume-up"></i></button>
        </>
    )
}
export default Botao;