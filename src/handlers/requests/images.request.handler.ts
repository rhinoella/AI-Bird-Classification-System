import { writeFile } from "fs/promises"; // promises = asynchronousy
import { v4 as uuid } from "uuid"; // generates unique identifier for each image

import { script as pyScript } from "../pythonScript";

export const handler = (body: string) => { 
    return new Promise<string>(
       async (resolve, reject) => {
        console.log("Images Handler");
        let result = await pyScript(body).then(data => { // calls python script handler
            return(data);
        }).catch(err => reject(err)) as string;
        resolve(result);
       });
};
