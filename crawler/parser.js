var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var db = require('./database');

// File directory here
var instream = fs.createReadStream('../page_links_sv.nt');
var outstream = fs.createWriteStream('out.nq');
var rl = readline.createInterface({
	input: instream, 
	// output: outstream,
	terminal: false});

var NR_OF_ARTICLES = 1000;


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
	return an object that is
	configured after database.js
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
		return {id:title,links:[link]};
		}
		return null;
}

function read(){
var i = 0;
var wikiObj;
	rl.on('line', function(line) {
	  // process line here
	  if(i < NR_OF_ARTICLES){
		wikiObj = getWikiObject(line);
		if(wikiObj != null){
			console.log(wikiObj)
			db.createOrUpdateArticles(wikiObj);
		}
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
