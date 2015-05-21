var db = require("seraph")({
  user: 'neo4j',
  pass: 'fiskis'
});

// db.save({ name: "Test-Man", age: 40 }, function(err, node) {
//   if (err) throw err;
//   console.log("Test-Man inserted.");

//   // db.delete(node, function(err) {
//   //   if (err) throw err;
//   //   console.log("Test-Man away!");
//   // });
// });

function addNewArticle(article) {
  db.save(article, 'Article', function(err, node) {
    console.log('Inserted node with id: ' + article.id);
  });
}

function createOrUpdateArticle(properties, title) {
  var cypher= "MERGE (art:Article "
            + "{"
            + "title: '" + (title || properties.title)
            + "'}"
            + ") RETURN art";
  db.query(cypher, function(err, result) {
    if (err) throw err;
    console.log("Added ", result);
    properties.links.forEach(function(link) {
      createLink(properties.title, link);
    });
  });
}
// + "', wikiId: " + article.wikiId
// + ", text: '" + article.text
function createLink(art1, art2, callback) {
  console.log('ARTICLES ',art1, art2)
  var cypher= "MATCH (art1:Article "
            + "{"
            + "title: '" + art1
            + "'})"
            + "MERGE (art2:Article "
            + "{"
            + "title: '" + art2
            + "'})"
            + "MERGE (art1)-[:LINKS]-(art2) "
            + "RETURN art1, art2";
  db.query(cypher, function(err, result) {
    if (err) throw err;
    console.log("Added relation ", result);
  });
}

testArticles = [
  {
    title: 'Batman',
    wikiId: 1,
    text: 'Lorem ipsum dolor',
    links: ['Robin', 'Superman']
  },
  {
    title: 'Robin',
    wikiId: 2,
    text: 'Lorem ipsum dolor',
    links: ['Batman', 'Joker']
  },
  {
    title: 'Superman',
    wikiId: 3,
    text: 'Lorem ipsum dolor',
    links: ['Batman']
  },
  {
    title: 'Joker',
    wikiId: 4,
    text: 'Lorem ipsum dolor',
    links: ['Batman']
  },
  {
    title: 'Two-Face',
    wikiId: 5,
    text: 'Lorem ipsum dolor',
    links: ['Joker']
  }
];


testArticles.forEach(function(art) {
  createOrUpdateArticle(art);
  // art.links.forEach(function(artLink) {
  //   createLink(art.title, artLink);
  // });
});