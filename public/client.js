$(document).ready(function() {
  var server = io.connect();
  server.on('message', function(data) {
    console.log('client received: ' + JSON.stringify(data));
    var html = '';
    if(data.type == 'html') {
      html = data.data;
    } else if (data.type == 'image') {
      html = '<img class="img-responsive" src="' + data.data + '"/>';      
    } else if (data.type == 'link') {
      html = '<a href="' + data.data + '">Link</a>';
    } else if (data.type == 'selection') {
      html = data.data;
    } else if (data.type == 'page') {
      html = '<iframe type="text/html" src="' + data.data
       + '" frameborder="0" allowfullscreen="" webkitallowfullscreen=""></iframe>';
    }
    if (html) insertContent(html);
    // $('#insert-here').html(html);
  });
});

var insertContent = function(html) {
  console.log('insert:' + html);
  var template = _.template($("#content-template").html());
  var x = template({html: html});
  // console.log(x);
  $('#target').prepend(x);
};