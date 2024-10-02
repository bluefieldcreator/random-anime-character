/* Stable Version Of Package */

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const cheerio = require('cheerio');
const myAnimeList = (limit) => `https://myanimelist.net/topanime.php?limit=${limit}`;
/**
 * Variable used for handling cheerio
 */
let $;
/**
 * Pre-declared variable for the japanese name of the character.
 */
let japaneseName;

/**
* randomAnimeCharacter
* @description Fetches a random anime character.
* @param limit - The limit of character ID's to randomize through.
*/
const randomAnimeCharacter = async (limit = 700) => {

    const limitID = Math.floor(Math.random() * limit);
    
    // Fetch random character data and begin scraping.
    const data = await fetch(myAnimeList(limitID));
    const body = await data.text();
    $ = cheerio.load(body);
    
    // Scrape for encoded data
    const encodedData = await fetch(encodeURI($('td[class="title al va-t word-break"] > a')[0].attribs.href)).catch((err) => throw new Error(`There was an error while fetching encoded data. | ${err}`));
    const parsedData = await encodedData.text();
    $ = cheerio.load(parsedData);
    
    const characterID = Math.floor(Math.random() * $('h3[class="h3_characters_voice_actors"] > a').length);
    const title = $('div[class="h1-title"] > div >h1 ')[0].children[0].children[0].data;
    const name = $('h3[class="h3_characters_voice_actors"] > a')[characterID].children[0].data;
    const encodedData2 = await fetch(encodeURI($('h3[class="h3_characters_voice_actors"] > a')[characterID].attribs.href)).catch(err => throw new Error(`There was an error while fetching encoded data. | ${err}`));
    const parsedData2 = await encodedData2.text();
    $ = cheerio.load(parsedData2);


    const image = $('td[class="borderClass"] > div > a')[0].children[0].attribs['data-src'];

    if ($('h2[class="normal_header"] > span >small')[0].children[0].data !== undefined)
        japaneseName = $('h2[class="normal_header"] > span >small')[0].children[0].data;
    else
        japaneseName = "Null";

    const arrayData = [name.split(',')[0], name.split(',')[1]];
    if (arrayData[1] === undefined)
        arrayData[1] = arrayData[0];
    /**
     * 
     */
    const animeCharacter = {
        title,
        name,
        image,
        tags: arrayData,
        japaneseName
    };
    return animeCharacter;

}

module.exports = getRandomChar;
