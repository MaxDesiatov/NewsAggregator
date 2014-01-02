define(['backbone', 'backbone.marionette', 'jquery', 'underscore', 
  '../views/news', 'moment'], 
  function (Backbone, Marionette, $, _, templates, moment) {

  var NewsModel = Backbone.Model.extend({});

  var NewsCollection =  Backbone.Collection.extend({
    model: NewsModel
  });

  var NewsItemView = Marionette.ItemView.extend({
    className: 'row',
    modelEvents: {
      'change': 'render'
    },

    template: function (data) {
      var date = moment(data['rss:pubdate']['#']).format("ddd, DD MMM YYYY, H:mm:ss")
      var res = _(data).extend({ formattedDate: date });
      return templates.item(res);
    }
  });

  var news = new NewsCollection();

  var Empty = Marionette.ItemView.extend({
    className: 'row',
    template: function () { return 'No news have been loaded.'; }
  });

  var NewsTable = Marionette.CollectionView.extend({
    itemView: NewsItemView,
    emptyView: Empty,
    collection: news,
    collectionEvents: {
      change: 'render'
    },

    appendHtml: function (collectionView, itemView, index) {
      childrenContainer = $(collectionView.childrenContainer || collectionView.el);
      children = childrenContainer.children();
      if (children.size() === index)
        childrenContainer.append(itemView.el);
      else
        childrenContainer.children().eq(index).before(itemView.el);
    },

    onRender: function () { this.delegateEvents(); }
  });

  var newsTable = new NewsTable();

  var IndexLayout = Marionette.Layout.extend({
    regions: {
      table: '#news-table'
    },

    template: function () { return templates.index(); },

    onRender: function () { this.delegateEvents(); }
  });

  indexLayout = new IndexLayout

  var fetchNews = function (url) {
    news.fetch({ 
      url: url,
      success: function () {
        require('app').content.show(indexLayout);
        indexLayout.table.show(newsTable);
      }
    });
  }

  return {
    index: function () {
      fetchNews('/news');
    },
    sky: function () {
      fetchNews('/news?source=sky');
    },
    bbc: function () {
      fetchNews('/news?source=bbc');
    }
  };
});
