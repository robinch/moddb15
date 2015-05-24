var fs = require('fs');
var readline = require('readline');
var stream = require('stream');
var db = require('./database');

// File directory here
var instream = fs.createReadStream('../page_links_sv.nt');
// var outstream = fs.createWriteStream('out.nq');
var rl = readline.createInterface({
	input: instream, 
	// output: outstream,
	terminal: false});

/*  CHANGE THIS TO INSERT MORE ARTICLES
    INTO THE DATABASE!!!
*/
var NR_OF_ARTICLES = 1000;


/*  Parses the url and return the last
    word.
    IF the word has unicode characters or
    is a file (.*) it returns null
*/
function getName(s){
	if( (index = s.search(/\/[\w\(\)åäö]+(?!\.\w+)\>$/i))  > 0 ){
		return s.substring(index+1, s.length -1);
	}else{
		return null;
	}
}


/*
    decodes unicode to char
    ex. \u00E5 to å
*/
function decode(s){
	if(s == null) return null;
	var r = /\\u([\d\w]{4})/gi;
	s = s.replace(r, function (match, grp) {
		return String.fromCharCode(parseInt(grp, 16)); } );
	s = unescape(s);
	return s;
}

/*
	Takes a from page_links and
	return an object that is
	configured after database.js
*/
function getWikiObject(line){
	line = decode(line);
	var split = line.split(" ");
	var title = getName(split[0]);
	var link = getName(split[2]);
	if(!((title == null )|| (link == null))){
		return {wikiId:title,link:link};
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
	  		db.linkArticles(wikiObj.wikiId, wikiObj.link);
            // console.log(wikiObj);
	  	}

	  	i++;

	  }else{
	  	rl.close();
	  }
	});

    rl.on('close', function() {
        console.log("Closed the stream");
        return;
    });
}

function close(){
	rl.close();	
}

read();