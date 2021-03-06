'use strict';

let self = this;
self.baseUrl = process.env.URL;

const fs = require('fs');
const rp = require('request-promise');
const cheerio = require('cheerio');
const Promise = require('promise');


let routesToFetch = ['/'];
let alreadyFetched = [];


const handleError = (err) => {
    console.error(`
        💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀
        Something went wrong and I broke, I'm sorry :(\n
        ${(()=>{if(err.name === 'RequestError'){return "Make sure you type the url with protocol, like 'http://gocardless.com'"}})()} \n
        ${err}\n
        💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀 💀\n`
    );
}

const writeJsonFile = (records, fileName) =>{
    fs.writeFile(`${fileName || 'siteData'}.json`, JSON.stringify(records, null, 4), (err) => {
        console.log(`Report created with ${records.length} records`);
    });
}






const actuallyGettingDOMStuff = ($, route) => {
    
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

            // Listing what needs to be fetched
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


    return {
        route: route,
        assets: assets,
        links: anchors
    };
}




self.fetchRoute = () => {
    
    let i = 0;
    let report = [];


    return new Promise((fulfill, reject) => {
    
        let fetchIt = () =>{


            let route = routesToFetch[i];
            
            let options = {
                uri: self.baseUrl + route,
                transform: (body) => {
                    return cheerio.load(body);
                }
            };


            rp(options)
                .then(($) => {
                    console.log(`Fetching ${options.uri}`);
                    return actuallyGettingDOMStuff($, route);
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
                    
                    console.log(`Checking ${i} of ${routesToFetch.length}`);

                    if(i <= routesToFetch.length - 1){
                        fetchIt();
                    }else{
                        writeJsonFile(report);
                        fulfill(report);
                    }
                })
                .catch((err) => {
                    handleError(err);
                    reject(err);
                });
            
        }
        fetchIt();
    })
    
}
