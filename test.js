var bibles = require('./bibles');
var bible = bibles.getBible('elberfelder');
console.log(bibles);

console.log(bible.getBook(36));
console.log(bible.getBook('Haggai'));
console.log(bible.searchId("ti"));
console.log(bible.searchId("prediger"));
