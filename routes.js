let db = require('./models');

let axios = require('axios');
let cheerio = require('cheerio');


// Routes
// =============================================================
module.exports = function(app) {

  // html route 
  app.get('/', function(req, res){
    res.render("index");
  });

  // api route
  app.get('/scrape', function(req, res) {
    let siteUrl = 'https://www.washingtonpost.com/';
    axios.get(siteUrl)
      .then(function(response) {
    
    let $ = cheerio.load(response.data);

    let articles = [];
    // strib h3 a.tease-headline
    $('.headline').each(function(i, element) {

        let title = $(this).children('a').text();
        let description = $(this).next('.blurb').text();
        if (title && description) {
          result = {};
          result.title = title;
          result.url = $(this).children('a').attr('href');
          result.description = description;
          // console.log(result);
          articles.push(result);
          
          // Create a new Article using the `result` object built from scraping
          db.Article.findOneAndUpdate(
            { title: result.title },
            { result },
            { upsert: true, new: true }
            ).then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              // If an error occurred, log it
              console.log(err);
            });
        }
      });
      res.json(JSON.parse(JSON.stringify(articles)));
    });
  });

}
