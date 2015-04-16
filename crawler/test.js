var fs        = require('fs')
    ,path    = require('path')
    ,XmlStream = require('xml-stream')
    ,wtfWiki = require('wtf_wikipedia');

var stream = fs.createReadStream(path.join(__dirname, 'test.xml'));
var xml = new XmlStream(stream);


var start = new Date();

xml.preserve('verse', true);
xml.collect('line');
xml.on('endElement: verse', function(verse) {
  console.log(verse);
});

xml.on('endElement: root', function() {
  var end = new Date() - start;
  console.log("Execution time %dms", end);
});