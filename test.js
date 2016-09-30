var bibles = require('./bibles');
var bible = bibles.getBible('elberfelder');
console.log(bibles);

console.log(bible.getBook(36));
console.log(bible.getBook('Haggai'));
console.log(bible.searchId("ti"));
console.log(bible.searchId("prediger"));
console.log(bible.getBook('2 Timothy').shortcuts);
console.log(bible.getBook('1 Timothy').shortcuts);
