import { readdir } from "fs"
import { promisify } from "util"

const readdir_promise = promisify(readdir) // turning readdir into a promise

// gets the bird images and generates HTML
export const birdcards = (filenames : string[])  => {
    return new Promise<string>(
        async(resolve, reject) => {
            let thumbnailFile: string = filenames[0];
            let thumbnailFileSep: string[] = filenames[0].split('_')

            const generate_card = async (filename: string) => {
                let filenameSep: string[] = filename.split('_');
                return `<img src='bird_captures/${filename}' alt='${filenameSep[3]}' width="224" height="224">`;
            }


            let div_end = `</div>`;
            let cardHead = `
                <div class='birdCards'>
                    <div class="cardThumbnail">
                        <img src='bird_captures/${thumbnailFile}' alt='${thumbnailFileSep[3]}' width="224" height="224">
                        <h3>${thumbnailFileSep[3].replace('-', ' ')}</h3>
                        <p>Captured on ${thumbnailFileSep[0]} at ${thumbnailFileSep[1]}</p>
                        <p>Classification probability of xx</p>
                    </div>
                    <div class="cardModal">
                        <div class="cardHead">
                            <button class="close">&times</button>
                            <h2>${thumbnailFileSep[3].replace('-', ' ')}</h2>
                            <p>Captured on ${thumbnailFileSep[0]} at ${thumbnailFileSep[1]}</p>
                            <p>Classification probability of xxx</p>
                        </div>`;
            let cards: string = "";
            for (let filename of filenames) { // for all images in the set
                cards += await generate_card(filename).catch(err => reject(err));

                }
                    
            resolve(`
                ${cardHead} 
                    ${cards} 
                    ${div_end}
                ${div_end}
                `);
            
        }
    )
};

// creates HTML for the thumbnail
export function card_thumbnail_generator (thumbnailFile : string) {
    let thumbnailFileSep = thumbnailFile.split('_');

    return `<div class="thumbnail">
                <img src='bird_captures/${thumbnailFile}' alt='${thumbnailFileSep[3]}' width="224" height="224">
                <p>${thumbnailFileSep[3].replace('-', ' ')}</p>
            </div>`
}


export const get_files = () => { 
    return new Promise<string[][]>( // declaring a pending state, promise is a function with callbacks
        async (resolve, reject) => { // calls the block directly underneath
            await readdir_promise('/root/birdclassifier/public/bird_captures').then(files => {

                let filesArr: string[][] = [];
                for (let i = 0; i < files.length; i ++) {
                    let filenameSep = files[i].split('_'); // files in the form of: date_time_ms_species_imgnumber_totalimgsinset_filetype
                    let filesArrInSet: string[] = [];
                    filesArrInSet.push(files[i]);

                    let done = false;
                    let j = 1;

                    while (done == false) {
                        if (j + i == files.length) {
                            done = true;
                            break;
                        }

                        let subfilesSep = files[j + i].split('_');

                        if (subfilesSep[1] == filenameSep[1] && subfilesSep[2] == filenameSep[2]){ // ensures files are from the same set
                            filesArrInSet.push(files[j + i]);
                            j ++;
                        }
                        else {
                            done = true;
                        }
                    }
                    filesArr.push(filesArrInSet);
                    i += j - 1;

                }
                resolve(filesArr);
            }).catch(err => { 
                reject(err); 
            });
        });
}