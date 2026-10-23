const http = require("node:http");
const basesdatos= require("mysql");

const puerto = 3000;

const server = http.createServer((request, response) => {
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");

    const mysql = basesdatos.createConnection({
        host: "localhost",
        user: "root",
        password: "",
        database: "mi_fotoredsocial"
    });
    
    switch(request.method){
        case "GET":

            switch(request.url){
                case "/obtener_id_perfiles":
                    mysql.query("SELECT id FROM usuarios", (err, resultado) => {
                    if(err){
                        console.log(err);
                        mysql.end();
                        return;
                    }

                    const arreglo_ids =  {
                        ids: resultado
                    }
                    
                    response.statusCode = 200;
                    response.setHeader('Content-Type', 'application/json');
                    response.end(JSON.stringify(arreglo_ids));

                    mysql.end();
                });
                break;

                default:
                    if(request.url.startsWith("/obtener_perfil_")){
                        const id = request.url.replace("/obtener_perfil_", "");
                        mysql.query("SELECT nombre, imagen, fondo, fondo_cover FROM usuarios WHERE id = " + id, (err, respuesta) => {
                            if(err){
                                console.log(err);
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "Error, no vale esa peticion"
                                }));
                                mysql.end();
                                return;
                            }

                            if(respuesta.length == 0){
                                response.statusCode = 404;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No existe un usuario con ese id"
                                }));
                                mysql.end();
                                return;
                            }
                            
                            const perfil = {
                                nombre: respuesta[0].nombre,
                                imagen: "data:;base64," + respuesta[0].imagen.toString("base64"),
                                fondo: "data:;base64," + respuesta[0].fondo.toString("base64"),
                                fondo_cover: respuesta[0].fondo_cover
                            }

                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(perfil));
                            mysql.end();
                        });
                    }
                    else if(request.url.startsWith("/obtener_id_fotos_")){
                        const id = request.url.replace("/obtener_id_fotos_", "");
                        
                        mysql.query("SELECT id FROM `fotos` WHERE id_usuario = " + id, (err, resultado) => {
                            if(err){
                                console.log(err);
                                mysql.end();

                                response.statusCode = 400;
                                response.setHeader('Content-Type', 'application/json');
                                response.end(JSON.stringify({
                                    mensaje: "No existe un usuario con ese id"
                                }));

                                return;
                            }
                            console.log(resultado);

                            const ids_fotos = {
                                "ids": []
                            }

                            for(i = 0; i < resultado.length; i++){
                                ids_fotos.ids.push(resultado[i].id)
                            }
                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(ids_fotos));
                            mysql.end();
                        })
                    }            
                break;
            }
            
            
        break;
        case "POST":
            
        break;
        case "PUT":
            
        break;
        case "OPTIONS":
            response.writeHead(204);
            response.end();
        break;
    }

    /*
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(JSON.stringify({}));
    */
});

server.listen(puerto, () =>{
    console.log("Servidor a la escucha en http://localhost:" + puerto);
});