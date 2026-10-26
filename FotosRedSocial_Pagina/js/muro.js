const TituloMuro = document.querySelector("#TituloMuro");
const ImagenPerfilMuro = document.querySelector("#ImagenPerfilMuro");
const body = document.querySelector("body");

const plantilla_imagen = document.querySelector(".ElementoImagen");
const ColeccionImagenes = document.querySelector("#ColeccionImagenes");
plantilla_imagen.remove();


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

    for(i = 0; i < respeusta.ids.length; i++){
        const clon = plantilla_imagen.cloneNode(true);
        ColeccionImagenes.appendChild(clon);

        fetch(url_endpoint + "/obtener_foto_muro_" + respeusta.ids[i]).then(recurso => recurso.blob()).then(imagen => {
            const imagen_url = URL.createObjectURL(imagen);
            console.log(imagen_url);
            clon.style.backgroundImage = "url(" + imagen_url + ")";
        });
    }
});