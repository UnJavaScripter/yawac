'use strict';


//const express = require('express');
const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
//const app     = express();

console.log(JSON.stringify(process.env.URL))
const baseUrl = process.env.URL;
let route = '/'

let routesToFetch = [route];


const handleError = (err) => {console.error(err)}


const writeJsonFile = (records, fileName) =>{
    fs.writeFile(`${fileName || 'siteData'}.json`, JSON.stringify(records, null, 4), (err) => {
        console.log(`Got ${records.length} records`);
    });
}

let report = [];

const fetchRoute = (route) => {
    let url = baseUrl + route;

    request(url, (err, response, html) => {
        if(!err){
            let $ = cheerio.load(html);
            let linkTag = $('link');
            let scriptTag = $('script');
            let imgTag = $('img');
            let anchorTag = $('a');

            let assets = {
                icon:[],
                stylesheet: [],
                script: [],
                img: []
            };

            let anchors = [];

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
            });

            // Images
            $(imgTag).each((i, img) =>{
                assets.img.push($(img).attr('src'));
            });

            // Links
            $(anchorTag).each((i, a) =>{
                if(/^\//g.test($(a).attr('href')) && routesToFetch.indexOf($(a).attr('href')) === -1 ){
                    anchors.push({
                        text: $(a).text(),
                        link: $(a).attr('href'),
                        parent: route
                    });

                    
                    routesToFetch.push($(a).attr('href'));
                    
                }
            });

            report.push({
                [route]: {
                    route: route,
                    assets: assets,
                    links: anchors
                }
            });



            routesToFetch.forEach((aRoute, i, a)=> {
                console.log("will fetch", aRoute)
                fetchRoute(aRoute);
            });

            console.log('*************************************************************', routesToFetch.length);

        }else{
            handleError(err);
        }
    })
}

fetchRoute(route);


console.log(routesToFetch)
console.log('------------------------------------------------------------------------------------------')
console.log(report)
