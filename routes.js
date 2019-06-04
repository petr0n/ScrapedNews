let db = require('./models');

let axios = require('axios');
let cheerio = require('cheerio');


// Routes
// =============================================================
module.exports = function(app) {

  // html route 
  app.get('/', function(req, res){
    db.Article.find()
    .populate('notes')
    .then(function(articles){
      // console.log(articles);
      res.render("index", {articles});
    })
    .catch(function(err){
      res.json(err);
    })
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
        let blurb = $(this).next('.blurb').text();
        if (title && blurb) {
          result = {
            title: title,
            url: $(this).children('a').attr('href'),
            blurb: blurb
          };
          // console.log('result', result);
          articles.push(result);
          
          // Create a new Article using the `result` object built from scraping
          db.Article.findOneAndUpdate(
            { title: result.title },
            { $set: result },
            { upsert: true, new: true }
            ).then(function(dbArticle) {
              // console.log('dbArticle', dbArticle);
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


  app.get('/article/:id', function(req, res){
    db.Article.findOne({ _id: req.params.id })
      .populate('notes')
      .exec((err, notes) => {
        // console.log('notes', notes);
        res.json(JSON.parse(JSON.stringify(notes)));
      });
  });


  app.post('/saveNote', function (req, res){
    // console.log('req.body.id', req.body.id);
    // console.log('req.body.title', req.body.title);
    // console.log('req.body.body', req.body.body);
    db.Note.create(req.body)
      .then(function(dbNote) {
        // console.log('dbNote', dbNote)
        return db.Article.findOneAndUpdate(
          { 
            _id: req.body.id
          }, 
          { 
            $push: { 
              notes: dbNote._id
            } 
          }, { upsert: true, new: true, setDefaultsOnInsert: true });
      })
      .then(function(article) {
        res.json(article);
      })
      .catch(function(err) {
        res.json(err);
      });
  });


  app.get('/getNews', function(req, res){
    db.Article.find()
    .populate('notes')
    .then(function(articles){
      // console.log(articles);
      res.json(JSON.parse(JSON.stringify(articles)));
    })
    .catch(function(err){
      res.json(err);
    })
  });

}
