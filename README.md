Epub.js Reader
================================

![Demo](http://fchasen.com/futurepress/epubjs-reader_moby-dick.png)

[Try it while reading Moby Dick](http://epubjs-reader.appspot.com/)

About the Reader
-------------------------
This reader came out of the Berkeley Future of eBooks classes in Fall & Spring 2013.
It renders a ePub version of the TDO book using the [Epub.js](https://github.com/futurepress/epub.js) library.

It is very much still a work in progress, so please bear with us. We would greatly appreciate reports on any bug or issues you come across

Getting Started
-------------------------

All the rendering is encapsulated within Angular directives.

```<epubreader>``` has only a src attribute and will render the complete reader.

```html
<epubreader src="/moby-dick/"></epubreader>
```

```<epubviewer>``` has several more attributes, requiring only only a src and will display just the basic epub, without the rest of the interface elements.

```html
<epubviewer src="{{src}}"></epubviewer>
```

Other available attributes are:

* on-ready
* on-chapter-displayed
* on-page-changed
* path
* cfi
* metadata
* toc

Annotations with Hypothes.is
-------------------------

[hypothes.is/what-is-it/](http://hypothes.is/what-is-it/)

Hypothes.is is the nonprofit that has developed the annotation platform you can use in combination with the reader.

In order to use the annotation tool, you must sign up for a Hypothes.is account.

* Click the dialogue icon dialogue on the right.
* Select the “Create an account” tab.
* Select a username and password.


Deploying to App Engine
-------------------------

Update the app.yaml with you application id.

Then run:
```
appcfg.py update .
```

Additional Resources
-------------------------

[Epub.js Developer Mailing List](https://groups.google.com/forum/#!forum/epubjs)

IRC Server: freenode.net Channel: #epub.js

Follow us on twitter: @Epubjs

+ http://twitter.com/#!/Epubjs

Other
-------------------------

EPUB is a registered trademark of the [IDPF](http://idpf.org/). 
