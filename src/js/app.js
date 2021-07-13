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
  // templateのhtmlを取得
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
