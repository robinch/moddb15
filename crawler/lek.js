var fs = require('fs');
var readline = require('readline');
var stream = require('stream');


var instream = fs.createReadStream('../page_links_sv.nq');
var outstream = fs.createWriteStream('out.nq');
var rl = readline.createInterface({
	input: instream, 
	output: outstream,
	terminal: false});

var i = 0;


// {
//     title: 'Batman',
//     wikiId: 1,
//     text: 'Lorem ipsum dolor',
//     links: [2, 3]
//   }

// function formatLine(line){
// 	var s = line.split(" ");

// }

function read(){

	rl.on('line', function(line) {
	  // process line here
	  if(i<200){
	  	outstream.write(line);
	  	outstream.write('\n');
	  	// var out = fs.writeFile('out.nq', line+'\n', function(err){
	  	// 	if (err) console.log(err);
	  	// });
	  	console.log(line);
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
