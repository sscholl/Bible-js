'use strict';
var fs = require('fs');
var HashMap = require('hashmap');
var bookData = require('./bookData');
var books = bookData.books;

class Chapter {

    constructor() {}

}

class Book {

    constructor(bookObj) {
        this.id = parseInt(bookObj.id);
        this.name = bookObj.book_name;
        if (Array.isArray(bookObj.shortcuts))
            this.shortcuts = bookObj.shortcuts;
        else
            this.shortcuts = [];
        if (bookObj.number && bookData.numbered[bookObj.numbered]) {
            bookData.numered_add.forEach(function(add){
                this.shortcuts.push(add.replace('X', bookObj.number) + bookObj.numbered)
            }, this);
            bookData.numbered[bookObj.numbered].forEach(function(s){
                bookData.numered_add.forEach(function(add){
                    this.shortcuts.push(add.replace('X', bookObj.number) + s)
                }, this);
            }, this);
        } else {
            this.shortcuts.push(this.name.toLowerCase());
        }
        this.testament = bookObj.testament;
    }

};

class Bible {

    constructor() {
        this.books = new HashMap();
        this.bookIds = new HashMap();
        this.shortcuts = new HashMap();
    }

    getBook(i) {
        if (Number.isInteger(i)) {
            return this.books.get(i);
        } else {
            return this.books.get(this.bookIds.get(i));
        }
    }

    // returns number of book, corresonding to the given shortcut
    searchId(shortcut) {
        return this.shortcuts.get(shortcut.toLowerCase());
    }

    addBook(bookObj) {
        var book = new Book(bookObj);
        this.books.set(book.id, book);
        this.bookIds.set(book.name, book.id);
        book.shortcuts.forEach(function(s) {
            this.shortcuts.set(s, book.id);
        }, this);
    }

    readData(books, file) {
        books.forEach(function (book) {
            this.addBook(book);
        }, this);

        var d = fs.readFileSync(file)
            .toString()
            .replace(/[O,N]\|\|/g, '||')
            .replace(/\r/g, '')
            .split("\n");
        for (var i in d) {
            if (d[i] == '') continue;
            var tmp = d[i].split('||');
            var book = this.getBook(parseInt(tmp[0]));
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
bible.readData(books, __dirname + '/Bibles/German__Elberfelder_(1905)__elberfelder1905__LTR.txt');

module.exports = bible;
