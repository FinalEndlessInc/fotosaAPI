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
                        mysql.query("SELECT nombre, imagen FROM usuarios WHERE id = " + id, (err, respuesta) => {
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
                                imagen: "data:;base64," + respuesta[0].imagen.toString("base64")
                            }

                            response.statusCode = 200;
                            response.setHeader('Content-Type', 'application/json');
                            response.end(JSON.stringify(perfil));
                            mysql.end();
                        });
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