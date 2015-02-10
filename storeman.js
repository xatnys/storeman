define(['underscore'], function (_) {

  // StoreMan - Builds a namespaced object tree within localStorage
  //            API is the same as localStorage (setItem, getItem)
  //
  // Namespace: the namespace is a period-delimited string,
  //            with the "root" being the first item
  //            e.g. 'foo.bar.baz' -> root is _storeMan/foo
  //
  // StoreMan will either return or create
  // an object for each namespace "key"
  // e.g. 'foo.bar.baz' -> _storeMan/foo : { bar: { baz: { STAGING_OBJECT } } }
  //
  // setItem and getItem operate within the STAGING_OBJECT


  if (!window.localStorage) {
    console.warn('localStorage not supported');
    return;
  }
  var ls = window.localStorage;

  var StoreMan = function (namespace) {
    namespace = namespace || 'app';
    namespace = '_storeman/' + namespace;
    this._keys = namespace.split('.');
    this._root = this._keys.shift();
  };

  StoreMan.prototype = {
    _getRoot: function () {
      var root = this._root;
      var rootStr = '{}';
      if (ls.getItem(root) !== null) {
        rootStr = ls.getItem(root);
      } else {
        ls.setItem(root, rootStr);
      }
      return JSON.parse(rootStr);
    },
    _setStage: function (params) {
      var rootObj = this._getRoot(),
          root = this._root;

      var stage = _.reduce(this._keys, function (obj, key) {
        if (!obj[key]) {
          obj[key] = {};
        }
        return obj[key];
      }, rootObj);
      stage = _.extend(stage, params);

      this._setBase(rootObj);
      return stage;
    },
    _getStage: function () {
      var rootObj = this._getRoot();

      return _.reduce(this._keys, function (obj, key) {
        if (!obj[key]) {
          obj[key] = {};
        }
        return obj[key];
      }, rootObj);
    },
    _setBase: function (obj) {
      var rootObj = obj,
          root = this._root;

      var rootStr = JSON.stringify(rootObj);
      ls.setItem(root, rootStr);
      console.log(rootStr);
    },
    setItem: function (key, value) {
      var params = {};
      params[key] = value;
      this._setStage(params);
    },
    getItem: function (key) {
      var stage = this._getStage();
      if (stage[key]) {
        return stage[key];
      }
      return null;
    }
  };

  return StoreMan;
});
