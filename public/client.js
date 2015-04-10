$(document).ready(function() {
  content_template = _.template($("#content-template").html());
  doc_template = _.template($("#doc-template").html());
  var server = io.connect();
  server.on('message', function(data) {
    console.log('client received: ' + JSON.stringify(data));
    var html = '';
    var doc = ''
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
    } else if(data.type == 'doc') {
      doc = data.data;
    }
    if (html) insertContent(html);
    if (doc) insertDoc(doc);
    // $('#insert-here').html(html);
  });
});

var insertContent = function(html) {
  console.log('insert:' + html);
  var x = content_template({html: html});
  // console.log(x);
  $('#target').prepend(x);
};

var insertDoc = function(html) {
  console.log('insert doc:' + html);
  var x = doc_template({html: html});
  // console.log(x);
  $('#target').prepend(x);
};
