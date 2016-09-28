'use strict';

var fs = require('fs');

var books = require('./books');

class Chapter {
    constructor() {}
}

class Book {
    constructor(number, name, testament) {
        this.number = number
        this.name = name;
        this.testament = testament;
    }
};

class Bible {
    constructor() {
        this.books = {};
    }
    addBook(number, name, testament) {
        this.books[number] = new Book(number, name, testament);
    }
    readData(books, file) {
        for (var i = 1; i <= 66; i++) {
            this.addBook( parseInt(books[i].book_nr), books[i].book_name, books[i].testament);
        }
        var d = fs.readFileSync(file)
            .toString()
            .replace(/[O,N]\|\|/g, '||')
            .replace(/\r/g, '')
            .split("\n");
        for (i in d) {
            if (d[i] == "") continue;
            var tmp = d[i].split('||');
            var book = this.books[parseInt(tmp[0])];
            if ((book instanceof Book)) {
                var chapter = parseInt(tmp[1]);
                var verse = parseInt(tmp[2]);
                var text = tmp[3];

                if (!(book[chapter] instanceof Chapter)) {
                    book[chapter] = new Chapter();
                }
                book[chapter][verse] = text;
            } else {
                console.log("book could not be found for string: " + d[i]);
            }
        }
    }
};

var bible = new Bible();
bible.readData(books, 'Bibles/German__Elberfelder_(1905)__elberfelder1905__LTR.txt');

module.exports = bible;
