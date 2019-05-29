// app.js

$('.scrape').on('click', getNews);

function getNews(e){
  e.preventDefault();
  $articlesEl = $('#articles');
  $.ajax({
    type: 'GET',
    url: '/scrape'
  }).then(function(response){
    // console.log('response', response);
    // articlesEl.html('');
    let source = $('#article-template').html();
    let template = Handlebars.compile(source);

    response.forEach(article => {
      console.log(template(article));
      $(template(article)).appendTo($articlesEl);
    });
  
  })
}

// hide loader after 3 seconds
function toggleLoader(){
  let loader = $('.loader');
  let articles = $('#articles');
  if (loader.is(':visible')){
    loader.fadeOut(300, function(){
      articles.fadeIn(400);
    });
  } else {
    articles.fadeOut(300, function(){
      articles.fadeIn(400, function(){
        setInterval(3000, toggleLoader);
      });
    });
  }
} 
toggleLoader();
