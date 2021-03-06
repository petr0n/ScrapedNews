// app.js


function scrapeNews(event) {
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
    
  });
}
$('.scrape').on('click', scrapeNews);

// hide loader after 3 seconds
const toggleLoader = () => {
  let loader = $('.loader');
  let articles = $('#articles');
  let timer1 = ''
  let timer2 = '';
  let isActive = false;
  if (loader.is(':visible')){
    isActive = true;
    timer1 = setTimeout(function() {
      loader.fadeOut(500, function(){
        articles.fadeIn(200);
      });
    }, 1000);
    // if (timer2)
    //   timer2.clearTimeout();
  } else {
    timer2 = setTimeout(function(){
      loader.fadeIn(400, function(){
        articles.fadeOut(300, function(){
          toggleLoader();
        });
      });
    }, 1000);
    // if (timer1)
    //   timer1.clearTimeout();
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
  if (id) {
    $.ajax({
      url: '/article/' + id,
      type: 'GET'
    }).done(function(res){
      // console.log(res);
      $('.picked-article').html('<h3>' + res.title + '</h3>');
      $('#articleId').val(id);
      $('.add-note').fadeIn(400).animate({'top': (article.offset().top - 180) + 'px'},'slow', function(){
          $('#note').focus();
      });
      let notesEl = $('.article-notes');
      // console.log('res.notes', res.notes);
      if (res.notes.length) {
        let n = res.notes;
        n.forEach((note) => {
          let noteEl = `<div class="note p-3 mb-3 border-solid border-b-2 border-gray-300">
          <h4 class="text-lg font-bold mb-1">${note.title}</h4>
          <p>${note.body}</p>
          <hr></div>`;
          notesEl.append(noteEl);
        });
      } else {
        notesEl.html('');
        // console.log('notesEl', notesEl);
      }
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
  // console.log('articleIdEl', articleIdEl.val());
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
      // console.log('note sent');
      noteTitleEl.val('');
      noteBodyEl.val('');
      articleIdEl.val('');
      $('.add-note').fadeOut(300, function(){
        getNews();
      });
    });
  } else {
    validationMess.html('<p class="text-red-500 my-3">Note required<p>');
  }
}

function getNews(){
  console.log('getNews run');
  $articlesEl = $('#articles');
  $articlesEl.html('');
  // toggleLoader();
  $.ajax({
    type: 'GET',
    url: '/getNews'
  }).then(function(response){
    let source = $('#article-template').html();
    let template = Handlebars.compile(source);
    
    response.forEach(article => {
      $(template(article)).appendTo($articlesEl);
    });
    
  });
}

$.fn.scrollView = function () {
  return this.each(function () {
    $('html, body').animate({
      scrollTop: $(this).offset().top
    }, 1000);
  });
}