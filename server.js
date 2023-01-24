import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';



  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Define the API KEY
  const API_KEY = "Udacity";
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async(req, res) => {
    let {image_url } = req.query;
    let http = /http/gi;
    let https = /https/gi;
    let theAPIKey = req.header("X-API-Key");

    if (!theAPIKey) {
      return res.status(422).send({message: 'The API Key parameter is required. Please refer to the README.md file to find the API key.'});
    }
    if (theAPIKey != API_KEY) {
      return res.status(422).send({message: 'The API Key parameter is incorrect. Please refer to the README.md file to find the API key.'});
    }
    if (!image_url) {
      return res.status(422).send({message: 'The image_url parameter is required.'});
    }
    if (image_url.search(http) == -1 && image_url.search(https) == -1) { 
      return res.status(422).send({message: 'The image_url is incorrect.'});
    }
    if (! (image_url.endsWith('.png') || image_url.endsWith('.PNG') || image_url.endsWith('.jpg')
           || image_url.endsWith('.JPG') || image_url.endsWith('.gif') || image_url.endsWith('.GIF')
           || image_url.endsWith('.bmp') || image_url.endsWith('.BMP') || image_url.endsWith('.jpeg')
           || image_url.endsWith('.JPEG')) ) { 

      return res.status(422).send({message: 'Please provide a URL address of an image in the JPG/PNG/JPEG/BMP/GIF format.'});
    }

    let filteredpath = await filterImageFromURL(image_url);
    res.status(200).sendFile(filteredpath), () => {
      deleteLocalFiles([filteredpath]);
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}     | The API KEY is \"Udacity\"      | by Sepid M.")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
