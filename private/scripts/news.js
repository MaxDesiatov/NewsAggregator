define(['backbone', 'backbone.marionette', 'jquery', 'underscore', 
  '../views/news', 'moment'], 
  function (Backbone, Marionette, $, _, templates, moment) {

  var NewsModel = Backbone.Model.extend({});

  var NewsCollection =  Backbone.Collection.extend({
    model: NewsModel,
    url: '/news'
  });

  var NewsItemView = Marionette.ItemView.extend({
    className: 'row',
    modelEvents: {
      'change': 'render'
    },

    template: function (data) {
      var res = _(data).extend({ formattedDate: data['rss:pubdate']['#'] });
      return templates.item(res);
    }
  });

  window.news = new NewsCollection();

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

  return {
    index: function () {
      news.fetch({ 
        success: function () {
          require('app').content.show(indexLayout);
          indexLayout.table.show(newsTable);
        }
      })
    }
  };
});
