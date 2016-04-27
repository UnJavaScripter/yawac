'use strict';


//const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
//const app     = express();

console.log(JSON.stringify(process.env.URL))
const baseUrl = process.env.URL;
let url = baseUrl + '/';

const handleError = (err) => {console.log(err)}


const writeJsonFile = (records, fileName) =>{
    fs.writeFile(`${fileName || 'siteData'}.json`, JSON.stringify(records, null, 4), (err) => {
        console.log(`Got ${records.length} records`);
    });
}




request(url, (err, response, html) => {
    if(!err){
        let $ = cheerio.load(html);
        let linkTag = $('link');
        let scriptTag = $('script');
        let imgTag = $('img');

        let assets = {
            icon:[],
            stylesheet: [],
            script: [],
            img: []
        };

        // Stylesheets & icons
        $(linkTag).each((i, link) => {
            if($(link).attr('rel') === 'stylesheet' || $(link).attr('rel') === 'icon'){
                assets[$(link).attr('rel')].push($(link).attr('href'));
            }
        });

        // Scripts
        $(scriptTag).each((i, script) =>{
            if($(script).attr('src')){
                assets.script.push($(script).attr('src'));
            }
        })

        // Images
        $(imgTag).each((i, img) =>{
            if($(img).attr('src')){
                assets.img.push($(img).attr('src'));
            }
        })

        console.log(assets)
    }else{
        handleError(err);
    }


});
