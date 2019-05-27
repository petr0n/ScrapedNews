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