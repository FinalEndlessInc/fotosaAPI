const TituloMuro = document.querySelector("#TituloMuro");
const ImagenPerfilMuro = document.querySelector("#ImagenPerfilMuro");
const body = document.querySelector("body");


fetch(url_endpoint + "/obtener_perfil_" + sessionStorage.getItem("muro_objetivo")).then( recurso => recurso.json()).then(respuesta => {
    TituloMuro.innerHTML = "Muro de " + respuesta.nombre;
    ImagenPerfilMuro.src = respuesta.imagen;
    body.style.backgroundImage = "url('" + respuesta.fondo + "')";

    if(respuesta.fondo_cover == 1){
        body.style.backgroundSize = "cover";
    }
    
});

// Obtener las fotos
fetch(url_endpoint + "/obtener_id_fotos_" + sessionStorage.getItem("muro_objetivo")).then(recurso => recurso.json()).then(respeusta => {
    console.log(respeusta);
});