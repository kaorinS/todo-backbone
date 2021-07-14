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
    editText: "",
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
// keydownCodeは中の関数で使う
var keydownCode = "";
var ListItemView = Backbone.View.extend({
  template: _.template($("#template-todo_list").html()),
  events: {
    "click .js-toggle-done": "toggleDone",
    "click .js-to-remove": "remove",
    "click .js-todo_list-text": "startEdit",
    "focus .js-todo_list-editArea": "selectAll",
    "keydown .js-todo_list-editArea": "getKeydown",
    "keyup .js-todo_list-editArea": "removeFocus",
    "blur .js-todo_list-editArea": "endEdit",
  },
  initialize: function () {
    _.bindAll(
      this,
      "render",
      "toggleDone",
      "remove",
      "startEdit",
      "selectAll",
      "getKeydown",
      "removeFocus",
      "endEdit"
    );
    this.model.bind("change", this.render);
    this.model.bind("destroy", this.remove);
    this.render();
  },
  toggleDone: function () {
    //  isDone反転
    this.model.set({ isDone: !this.model.get("isDone") });
  },
  remove: function () {
    $(this.el).fadeOut("slow", function () {
      this.remove();
    });
    return this;
  },
  startEdit: function () {
    this.model.set({ editMode: true });
    $(".js-todo_list-editArea").show().focus();
    // console.log("this.model", this.model);
    // console.log("keydownCode", this.model.get("keydownCode"));
    // console.log("key", this.model.get("key"));
  },
  selectAll: function () {
    $(".js-todo_list-editArea").select();
  },
  getKeydown: function (e) {
    // e.whichは本来、非推奨
    // keyEvent中にthis.model.set()を使うと、挙動がおかしくなる(勝手にフォーカスが外れる)ため、外にvar keydownCodeを定義して、そこにe.whichの値を入れることに
    // 関数を外に出してみても解決できなかった
    // console.log("e.which", e.which);
    // console.log("e.keyCode", e.keyCode);
    // console.log("e.code", e.code);
    // console.log("e.key", e.key);
    keydownCode = e.which;
  },
  removeFocus: function (e) {
    if (
      (13 === keydownCode && e.which === keydownCode) ||
      (e.keyCode === 13 && e.shiftKey === true)
    ) {
      $(".js-todo_list-editArea").blur();
    }
  },
  endEdit: function () {
    var editArea = $(".js-todo_list-editArea");
    var editAreaVal = editArea.val();
    if (!editAreaVal || editAreaVal === "") {
      editAreaVal = this.model.escape("text");
    }
    this.model.set({ editText: editAreaVal });
    this.model.set({ text: this.model.escape("editText"), editMode: false });
    editArea.hide();
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

// addTodo
var AddTodo = Backbone.View.extend({
  el: $("#js-add_todo"),
  model: addForm,
  template: _.template($("#template-form").html()),
  events: {
    "click .js-add-todo": "addTodo",
  },
  initialize: function () {
    _.bindAll(this, "render", "addTodo");
    this.model.bind("change", this.render);
    this.render();
  },
  addTodo: function () {
    e.preventDefault();

    if (!$(".js-get-val").val() || $(".js-get-val").val() === "") {
      this.model.set({ hasError: true, errorMsg: "入力が空です" });
      $(".js-toggle-error").show();
    } else {
      this.model.set({
        val: $(".js-get-val").val(),
        hasError: false,
        errorMsg: "",
      });
      $(".js-toggle-error").hide();
      listView.addListItem(this.model.escape("val"));
    }
  },
  render: function () {
    var template = this.template(this.model.attributes);
    $(this.el).html(template);
    return this;
  },
});
new AddTodo();
