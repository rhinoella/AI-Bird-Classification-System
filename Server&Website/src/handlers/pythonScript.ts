// handing the data off to the python script and dealing with the result

import { spawn } from 'child_process'; // let us create python processes and run python 

export const script = (imb64: string) => { // this block can be imported from another file
    return new Promise<string>(async (resolve, reject) => { // Create a new function that has callbacks for a failure or completion of the code under it. reject and resolve respectively.
        // run python script
        console.log("PyScript");
        console.log(imb64.length)
        let pythonScript = spawn("/usr/bin/python3", [ // spawn a new process of python3 (to run model)
            "/root/birdclassifier/src/model/deployModel.py", // Add the python script filename as the first argument.
            imb64 // Add the path to the image base64 as the second argument
        ]);

        // deal with model output
        let modelResult: string = ""; // Declares the variables datatype as string
        let pythonError: string = "";
        // data is the event, 'chunk' will contain the output on the console
        pythonScript.stdout.on("data", (consoleOutput) => { // Listenener for when the python process puts any output out to console.
            modelResult += consoleOutput; // Appends this string data to the string outside of the listeners scope/context.
        });

        console.log("modres" + modelResult);

        pythonScript.on("error", (err) => { // Listener for when the process exits with an exit code that isn't 0 - an error. (Any exit code that isn't 0 usualy means there was an error.)
            console.log('pythonscript error')
            reject(err); // If there's an error. quit out of this function with the error message as the parameter. - resolve (everything went well)
        });

        pythonScript.stdio[2].on("data", (data) => { // Listener for when the python process puts any output to console
            pythonError += data; // 
        });

        pythonScript.on("close", (exitcode) => {
            // checks to make sure its exitcode 0
            if (exitcode === 0) { // three '===' means that it will do generic check and type check
                resolve(modelResult); // No errors so we resolve- finish the function and return modelResult
            } else {
                reject(exitcode);
            }
        });
    });
}