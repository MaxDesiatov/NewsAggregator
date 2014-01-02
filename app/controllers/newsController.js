var locomotive = require('locomotive'),
    _          = require('underscore'),
    FeedParser = require('feedparser'),
    request    = require('request'),
NewsController = new locomotive.Controller();

_(NewsController).extend({
  index: function () {
    var that = this;
    var items = [];
    request('http://feeds.bbci.co.uk/news/rss.xml').pipe(new FeedParser())
    .on('readable', function () {
      var stream = this, item;
      while (item = stream.read()) {
        items.push(item);
      }
    })
    .on('end', function () {
          that.res.send(items);
    });
  },

  show: function () {
    this.res.send({item: 'blah'});
  }
});

module.exports = NewsController;
