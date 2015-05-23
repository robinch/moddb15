var db = require("seraph")({
  user: 'neo4j',
  pass: 'fiskis'
});

function createOrUpdateArticles(list) {
  properties = list.shift();
  var cypher= "MERGE (art:Article "
            + "{"
            + "title: '" + properties.title
            + "'}) "
            + "SET "
            + "art.wikiId = " + properties.wikiId
            + " RETURN art";
  db.query(cypher, function(err, result) {
    if (err) throw err;
    console.log("Added article", result);
    createLink(properties.title, properties.links, function() {
      if(list.length>0) {
        createOrUpdateArticles(list);
      }
    });
  });
}

function createLink(art1, list, callback) {
  var art2 = list.shift();
  var cypher= "MATCH (art1:Article "
            + "{"
            + "title: '" + art1
            + "'})"
            + "MERGE (art2:Article "
            + "{"
            + "title: '" + art2
            + "'})"
            + "MERGE (art1)-[r:LINKS]->(art2) "
            + "RETURN r";
  db.query(cypher, function(err, result) {
    if (err) throw err;
    console.log("Added relation ", result);
    if(list.length>0) {
      createLink(art1, list, callback);
    } else {
      callback();
    }
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

// To clean up graph
// MATCH (n:Article)-[r]-()
// DELETE n, r
createOrUpdateArticles(testArticles);
