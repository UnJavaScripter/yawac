# YAWAS

## Wut???

Stands for Yet Another Web App Scrapper. It's a simple CLI tool that fetches local routes of a given web(site|app) and creates a JSON file containing a list of the routes with the assets (icons, CSS & JavaScript file references and images) and links inside that page.

## Requirements

- [Nodejs 4 or greater](https://github.com/nodesource/distributions)

## Installation

Clone the repo & _cd_ into the folder:

`$ git clone https://github.com/UnJavaScripter/yawac.git && cd yawac`

Then it's business as usual:

`$ npm install`

## Playing with it

It expects a URL parameter which is the base where it should start scrapping (it can be a subdomain). YAWAS will follow every link inside that first page and the subsequent pages until ther are no more left.
  
  Note that it will only follow local routes like `/cool/things/here` and will skip external links like `http://commitstrip.com`.

Sample: `$ URL='http://unjavascripter.github.io/testrepo' node index.js`

### The report

A `siteData.json` file will be created in the root folder, it will have the following contents for the _testrepo_ sample:

```json
[
    {
        "/": {
            "assets": {
                "icon": [],
                "stylesheet": [],
                "script": [
                    "/theScript.js"
                ],
                "img": [
                    "xomg.jpg"
                ]
            },
            "links": [
                {
                    "text": "Click here",
                    "link": "/noonecanfindme.html",
                    "parent": "/"
                }
            ]
        }
    },
    {
        "/noonecanfindme.html": {
            "assets": {
                "icon": [],
                "stylesheet": [
                    "/styyyyles.css"
                ],
                "script": [],
                "img": []
            },
            "links": []
        }
    }
]

```

## Testing

Run the unit tests with `$ npm test`