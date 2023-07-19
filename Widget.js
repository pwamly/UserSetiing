define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/dom',
  'dojo/on',
  'dojo/domReady!'
],
function (declare, BaseWidget, dom, on) {
  // To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

      baseClass: 'jimu-widget-UserSettings',
      name: 'UserSettings',
      className: 'esri.widgets.UserSettings',

      postCreate: function() {
          this.inherited(arguments);

          console.log("Hello, World!");
      },

      startup: function() {
          this.inherited(arguments);

          // Your widget startup code goes here
      },

      onClose: function() {
          // Your widget cleanup code goes here

          this.inherited(arguments);
      }
  });
});
