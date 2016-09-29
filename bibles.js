'use strict';
var fs = require('fs');
var HashMap = require('hashmap');
var booksData = require('./booksData');
var biblesData = require('./biblesData');
var books = booksData.books;

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
        if (bookObj.number && booksData.numbered[bookObj.numbered]) {
            booksData.numered_add.forEach(function(add){
                this.shortcuts.push(add.replace('X', bookObj.number) + bookObj.numbered)
            }, this);
            booksData.numbered[bookObj.numbered].forEach(function(s){
                booksData.numered_add.forEach(function(add){
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

    constructor(bibleObj) {
        this.id = bibleObj.id;
        this.name = bibleObj.name;
        this.language = bibleObj.language;
        this.direction = bibleObj.direction;
        this.books = new HashMap();
        this.bookIds = new HashMap();
        this.shortcuts = new HashMap();
        this.loaded = false;
    }

    getName() {
        return this.name.replace('_', ' ');
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

    readData(file) {
        if (! this.loaded) {
            books.forEach(function (book) {
                this.addBook(book);
            }, this);

            var d = fs.readFileSync(__dirname + '/Bibles/' + this.language + '__' + this.name + '__' + this.id + '__' + this.direction + '.txt')
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
            this.loaded = true;
        }
    }

};

class Bibles {

    constructor() {
        this.bibles = new HashMap();
        this.shortcuts = new HashMap();
        biblesData.forEach(function(b){
            var bible = new Bible(b);
            this.bibles.set(b.id, bible);
            b.shortcuts.forEach(function(s) {
                this.shortcuts.set(s.toLowerCase(), b.id);
            }, this);
        }, this);
    }

    getBible(b) {
        var bible = this.bibles.get(this.shortcuts.get(b.toLowerCase()));
        if (! bible.loaded) {
            try {
                bible.readData();
            } catch (e) {
                console.log("can not load bible " + b);
                return undefined;
            }
        }
        return bible;
    }

}

module.exports = new Bibles();
