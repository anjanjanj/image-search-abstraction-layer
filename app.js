import express from 'express';
import storage from 'node-persist';

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

// for new urls to shorten
app.get('/api/imagesearch/:term', (req, res) => {
  console.log(req.params.term);
  console.log(req.query);

  // 1. do the search
  //  2. return results
  //  3. log the search
});

const port = process.env.PORT || 8080;
app.listen(port, () =>
	console.log('Node.js listening on port ' + port + '...')
);