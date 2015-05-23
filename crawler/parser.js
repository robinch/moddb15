var fs = require('fs');
var readline = require('readline');
var stream = require('stream');

var instream = fs.createReadStream('../page_links_sv.nt');
var outstream = fs.createWriteStream('out.nq');
var rl = readline.createInterface({
	input: instream, 
	// output: outstream,
	terminal: false});

// Source: 
  // http://werxltd.com/wp/2010/05/13/javascript-implementation
  // -of-javas-string-hashcode-method/
String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};


// Parses the url and return the last
// word.
// IF the word has unicode characters or
// is a file (.*) it returns null
function getName(s){
	if( (index = s.search(/\/[\w\(\)]+(?!\.\w+)\>$/i))  > 0 ){
			return s.substring(index+1, s.length -1);
		}else{
			return null;
		}
	}

/*
	Takes a from page_links and
	return an object {title, link}
*/
function getWikiObject(line){
	// DOES NOT SUPPORT UNICODE
	var split = line.split(" ");
	s = split[0];
	var index
	var parsed;
	var title = getName(split[0]);
	var link = getName(split[2]);

	if(!((title == null )|| (link == null))){
		return {title:title,link:link};
		}
		return null;
}

function read(){
var i = 0;
var wikiObj;
	rl.on('line', function(line) {
	  // process line here
	  if(i<1000){
		wikiObj = getWikiObject(line);
		if(wikiObj != null){
			console.log(wikiObj)
		}
	  	outstream.write(line);
	  	outstream.write('\n');
	  	// console.log(line);
	  	i++;
		}else{
			close();
		}
	});

	rl.on('close', function() {
	  // do something on finish here
	});
}

function close(){
	rl.close();	
}
read();
