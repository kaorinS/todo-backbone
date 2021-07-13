var Backbone = require("backbone");
var $ = require("jquery");
var _ = require("underscore");

// =====================================
// Model
// =====================================
// タスク
var ListItem = Backbone.Model.extend({
  defaults: {
    text: "",
    isDone: false,
    editMode: false,
    isShow: true,
  },
});
// TODO追加用フォーム
var AddForm = Backbone.Model.extend({
  defaults: {
    val: "",
    hasError: false,
    errorMsg: "",
  },
});
var addForm = new AddForm();
// 検索用
var Search = Backbone.Model.extend({
  defaults: {
    val: "",
  },
});
var search = new Search();

// =====================================
// Collection
// =====================================
// TODOリスト表示用
var TODOLIST = Backbone.Collection.extend({
  model: ListItem,
});

// タスクModelインスタンス化
var listItem1 = new ListItem({ text: "サンプルTODOタスク" });
var listItem2 = new ListItem({ text: "サンプルDONEタスク", isDone: true });
// Collectionインスタンス化
var todoList = new TODOLIST([listItem1, listItem2]);

// =====================================
// View
// =====================================
// todo
var ListItemView = Backbone.View.extend({
  template: _.template($("#template-todo_list").html()),
  events: {
    "click .js-toggle-done": "toggleDone",
    "click .js-to-remove": "remove",
  },
  initialize: function () {
    _.bindAll(this, "render", "toggleDone", "remove");
    this.model.bind("change", this.render);
    this.model.bind("destroy", this.remove);
    this.render();
  },
  toggleDone: function () {
    //  isDone反転
    this.model.set({ isDone: !this.model.get("isDone") });
  },
  remove: function () {
    $(this.el).remove();
    return this;
  },
  render: function () {
    var template = this.template(this.model.attributes);
    $(this.el).html(template);
    return this;
  },
});

// todoリスト
var ListView = Backbone.View.extend({
  el: $("#js-todo_list"),
  collection: todoList,
  initialize: function () {
    _.bindAll(this, "render", "addListItem", "appendListItem");
    this.collection.bind("add", this.appendListItem);
    this.render();
  },
  //   新Model追加用
  addListItem: function (text) {
    var model = new ListItem({ text: text });
    this.collection.add(model);
  },
  //   新Model、ulタグ追加用
  appendListItem: function (model) {
    var listItemView = new ListItemView({ model: model });
    $(this.el).append(listItemView.el);
  },
  render: function () {
    var that = this;
    this.collection.each(function (model, i) {
      that.appendListItem(model);
    });
    return this;
  },
});
var listView = new ListView({ collection: todoList });
