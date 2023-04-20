// recieves raspberry pi data

import http from 'http' // import http protocol package
import { existsSync, readdir } from "fs";
import { readFile } from "fs/promises";
import { handler as imagesHandler } from "./requests/images.request.handler";
import { birdcards, card_thumbnail_generator, get_files } from "./requests/birdcards"
import { stringify } from 'uuid';

function listener(request: http.IncomingMessage, response: http.ServerResponse) { // requests is the input image, response is a callback that tells pi the data has been recieved
    // Request constructor
    let body: string = ""; // Create an empty response by default.

    request.on("data", (chunk) => { // Activates when any length of data is recieved.
        body += chunk; // Appends the current Buffer chunk to the string.
    });

    request.on("end", () => { // Activates when the request has sent all data.
        // filter requests:
        switch(request.url) {
            case "/images" :
                if (body !== "") { // Checks to make sure the body contains data before passing it off.
                    imagesHandler(body).then(async (predictions) => {
                        response.setHeader("Content-Type","application/json")
                        response.writeHead(201); // Respond with the completion code stating that the request sucessfully created a new resource on the server.: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/200
                        console.info("Fully resolved");
                        let predictions_arr = predictions.slice(1, -2).replace(/'/g, '').split(','); // converting into array
                        let jsonResp: any = {}
                        let indivImgs: any = {}

                        jsonResp["overall_prediction"] = predictions_arr[0]
                        for (let i = 1; i < predictions_arr.length; i++) {
                            indivImgs[i + 2] = predictions_arr[i];
                            //else jsonResp[i + 2] = predictions_arr[i];
                        };

                        jsonResp["image_predictions"] = indivImgs;

                        console.log(JSON.stringify(jsonResp));
                        response.write(JSON.stringify(jsonResp));
                        response.end(); // Complete the response.
                    }).catch(err => {
                        console.log(`Error Message@: ${err}`);
                        response.writeHead(400);
                        response.end();
                    });
                } else {
                    response.writeHead(400); // Respond with the error code stating a malformed request: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
                    response.write("Body of request does not contain data."); // Respond with a message descriptive of the error.
                    response.end(); // Complete the response.
                }
            break;

            case "/home" :
            case "/":
                let home_handler = async (response: http.ServerResponse) => {
                    response.writeHead(200);
                    response.write(await readFile(`/root/birdclassifier/public/home.html`));
                    response.write(`<aside><div><h3>Recent Bird Captures</h3></div>`);
                    let files = await get_files();
                    for (let i = files.length - 1; i > -1 ; i-- ) { // grabs first five thumbnails
                        if (i == files.length - 5) break;
                        response.write(card_thumbnail_generator(files[i][0]));
                    }
                    response.write(`</aside></main></body></html>`);
                    response.end()
                };
                home_handler(response);

            break;

            case "/birdcaptures":
                let birdcaptures_handler = async (response: http.ServerResponse) => {
                    response.writeHead(200);
                    response.write(await readFile(`/root/birdclassifier/public/birdcaptures.html`));
                    response.write('<main><section id="birdCaptures_article"><h2>Bird Captures</h2><div id="birdCapturesGrid">');
                    
                    let files = await get_files(); // files is arr of arrays

                    for (let i = files.length - 1; i > -1 ; i-- ) {
                        response.write(await birdcards(files[i])); // sends the generated HTML
                    };
                    response.write('</main></body></section></div></html>');
                    response.end();
                }
                birdcaptures_handler(response);
            break;
    
            default:
                let file_handler = async (request: http.IncomingMessage, response: http.ServerResponse) => {
                    if (!existsSync(`/root/birdclassifier/public${request.url}`)) {
                        response.writeHead(404) // file doesn't exist, send 404 error response
                    } 
                    else {
                        response.writeHead(200);
                        response.write(await readFile(`/root/birdclassifier/public${request.url}`))
                        response.end();
                    };
                };
                file_handler(request, response)
            break;

        }
    });

    request.on("error", () => { //If there was an error recieving the request.
        response.writeHead(400); // Respond with the error code stating a malformed request: https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/400
        response.end(); // Complete the response.
    })
}


export const server = () => {
    const server_api = http.createServer(listener) // creates the http server (can respond to http requests)
    server_api.listen(8080);
    
}
