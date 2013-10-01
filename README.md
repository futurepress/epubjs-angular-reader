Epub.js Reader
================================

![FuturePress Views](http://fchasen.com/futurepress/fp.png)

Epub.js is a JavaScript library for rendering ePub documents in the browser, across many devices.

Epub.js provides common ebook functions (such as persistence and pagination) without the need to develop a dedicated application or plugin.

Unlike an application, our HTML/JavaScript reader can be hosted anywhere and can be easily customized using JavaScript, such as changing the interface or adding annotation functionality.

[Try it while reading Moby Dick](http://epubjs-reader.appspot.com/)

Getting Started
-------------------------

Rendering is handled by [Epub.js](http://futurepress.github.com/epub.js/)

Deploying to App Engine
-------------------------

Update the app.yaml with you application id.

Then run:
```
appcfg.py update .
```