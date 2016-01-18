import express from 'express';
import storage from 'node-persist';
import request from 'request';

// Google API key and Custom Search Engine ID
import config from './config.json';

const app = express();
require('dotenv').load();

storage.initSync({
  dir:'store'
});

// get the list of the 10 latest searches
app.get('/api/latest/imagesearch', (req, res) => {
  // 1. search db for url linked to id param
  let lastTenSearches = storage.getItemSync('lastTenSearches');
  res.send(lastTenSearches);
  /*
    [
      {
        term: "dogs",
        when: "2016-01-18T03:04:40.368Z"
      },
      ...
    ]
  */
});

// for an image search
app.get('/api/imagesearch/:term', (req, res) => {
  // console.log(req.params.term);
  // console.log(req.query.offset);
  
  const offset = req.query.offset ? Number(req.query.offset) * 10 + 1 : 1
  
  // 1. do the search
  
  // GET https://www.googleapis.com/customsearch/v1?q={QUERY}&searchType=image&key={YOUR_API_KEY}
  // this gets 10 results
  request(`https://www.googleapis.com/customsearch/v1?searchType=image&start=${offset}&key=${config.key}&cx=${config.cx}&q=${req.params.term}`, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      // User Story: I can get the image URLs, alt text and page urls for a set of images relating to a given search string.
      let responseObj = JSON.parse(body);
      
      let requiredFields = responseObj.items.map((item) => {
        return {
          imageUrl: item.link,
          alt: item.title,
          pageUrl: item.contextLink
        }
      });
      
      //  2. return results
      res.json(requiredFields);
      
      //  3. log the search
    }
    else {
      res.send('An error occured when performing the image search!', 500);
    }
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () =>
  console.log('Node.js listening on port ' + port + '...')
);