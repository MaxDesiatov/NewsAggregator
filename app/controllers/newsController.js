var locomotive = require('locomotive'),
    _          = require('underscore'),
    htmlparser = require('htmlparser'),
NewsController = new locomotive.Controller();

_(NewsController).extend({
  index: function () {
    this.res.send({});
    // var parser = new htmlparser.RssHandler(function (error, dom) {
    //   console.log 
    //   this.res.send(dom);
    // });
  },

  show: function () {
    this.res.send({item: 'blah'});
  }
});

module.exports = NewsController;
