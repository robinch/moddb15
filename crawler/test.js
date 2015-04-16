var fs        = require('fs')
,path    = require('path')
,XmlStream = require('xml-stream')
,wtfWiki = require('wtf_wikipedia');

var stream = fs.createReadStream(path.join(__dirname, 'test.xml'));
var xml = new XmlStream(stream);

xml.preserve('item', true);
xml.collect('subitem');
xml.on('endElement: item', function(item) {
  console.log(item);
});