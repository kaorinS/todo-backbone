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
