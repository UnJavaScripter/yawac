'use strict';


const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');


console.log(JSON.stringify(process.env.URL))
const baseUrl = process.env.URL;


const handleError = (err) => {console.error(err)}

const writeJsonFile = (records, fileName) =>{
    fs.writeFile(`${fileName || 'siteData'}.json`, JSON.stringify(records, null, 4), (err) => {
        console.log(`Got ${records.length} records`);
    });
}
/****************************************************************/
/****************************************************************/
/****************************************************************/


let routesToFetch = ['/'];
let alreadyFetched = [];

let indexer = 0;


let report = [];

const cheerioStuff = ($, route) => {
    
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
        if($(a).attr('href') && /^\//i.test($(a).attr('href'))){

            let localRoute = $(a).attr('href').match(/(.+(?=#))|(.+)/g)[0];

            if(routesToFetch.indexOf(localRoute) === -1 && alreadyFetched.indexOf(localRoute) === -1){
                routesToFetch.push(localRoute);
            }

            anchors.push({
                text: $(a).text(),
                link: localRoute,
                parent: route
            });
        }
    });


    console.log("routesToFetch: ", routesToFetch.length);
    console.log("alreadyFetched: ", alreadyFetched.length);
    console.log("-----------");
    console.log("cheerio end");

    return {
        route: route,
        assets: assets,
        links: anchors
    };
}










const fetchRoute = () => {
    
    let i = 0;

    
    let fetchIt = () =>{
        

        let route = routesToFetch[i];
        
        let options = {
            uri: baseUrl + route,
            transform: function (body) {
                return cheerio.load(body);
            }
        };


        rp(options)
            .then(function ($) {
                console.log(`Fetching ${options.uri}`);
                console.log("first then");
                return cheerioStuff($, route);
            })
            .then((e) => {
                report.push({
                    [e.route]: {
                        assets: e.assets,
                        links: e.links
                    }
                });

            })
            .then(() => {
                alreadyFetched.push(route);
            })
            .finally(() => {
                i += 1;
                console.log("finally: ", i, routesToFetch.length, (i <= routesToFetch.length - 1));
                if(i <= routesToFetch.length - 1){
                    console.log("On pos: ", i);
                    fetchIt();
                }else{
                    writeJsonFile(report);
                }
            })
            .catch(function (err) {
                console.log("💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀");
                console.log("Something went wrong and I broke, I'm sorry :( ", err);
                console.log("💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀💀");
            });
        
    }
    
    fetchIt();
}


fetchRoute();
