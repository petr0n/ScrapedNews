// app.js


function getNews(event) {
  event.preventDefault();
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
      // console.log(template(article));
      $(template(article)).appendTo($articlesEl);
    });
    
  })
}
$('.scrape').on('click', getNews);

// hide loader after 3 seconds
const toggleLoader = () =>{
  let loader = $('.loader');
  let articles = $('#articles');
  if (loader.is(':visible')){
    let timer = setTimeout(function() {
      loader.fadeOut(500, function(){
        articles.fadeIn(200);
      });
    }, 2000);
  } else {
    articles.fadeOut(300, function(){
      loader.fadeIn(400, function(){
        setInterval(toggleLoader, 1500);
      });
    });
  }
}
toggleLoader();


$('article').on('click', getArticleNote);

function getArticleNote(event) {
  event.preventDefault();
  $('article').removeClass('bg-gray-300');
  $('.note-error').html('');
  let article = $(this);
  article.addClass('bg-gray-300');
  let id = article.attr('data-articleId');
  console.log('id', id);
  if (id) {
    $.ajax({
      url: '/article/' + id,
      type: 'GET'
    }).done(function(res){
      // console.log(res);
      $('.picked-article').html('<h3>' + res.title + '</h3>');
      $('#articleId').val(id);
      $('.add-note').fadeIn(400).animate({'top': (article.offset().top - 100) + 'px'},'slow', function(){
          $('#note').focus();
      });
    });
  }
}

$('#submit-note').on('click', saveNote);

function saveNote(e){
  e.preventDefault();
  let validationMess = $('.note-error');
  let noteTitleEl = $('#noteTitle');
  let noteBodyEl = $('#noteBody');
  let articleIdEl = $('#articleId');
  console.log('articleIdEl', articleIdEl.val());
  validationMess.html('');
  if (noteTitleEl.val()) {
    $.ajax({
      url: '/saveNote',
      type: 'POST',
      data: {
        title: noteTitleEl.val(),
        body: noteBodyEl.val(),
        id: articleIdEl.val()
      }
    }).done(function(){
      console.log('note sent');
      noteTitleEl.val('');
      noteBodyEl.val('');
      articleIdEl.val('');
      $('.add-note').fadeOut(300);
    });
  } else {
    validationMess.html('<p class="text-red-500 my-3">Note required<p>');
  }
}

$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  });
}