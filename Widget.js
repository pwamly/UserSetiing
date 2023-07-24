// Your widget JavaScript file (e.g., UserSettings.js)

define([
  'dojo/_base/declare',
  'jimu/BaseWidget',
  'dojo/dom',
  'dojo/on',
  'dojo/dom-construct',
  './helper', // Import the helper module
  'dojo/text!./config.json', // Import the configuration file using dojo/text
  'dojo/domReady!'
], function (declare, BaseWidget, dom, on, domConstruct, helper, config) {

  // Parse the configuration file as a JSON object
  var configObj = JSON.parse(config);

  // To create a widget, you need to derive from BaseWidget.
  return declare([BaseWidget], {

    baseClass: 'jimu-widget-UserSettings',
    name: 'UserSettings',
    className: 'esri.widgets.UserSettings',

    postCreate: function() {
      this.inherited(arguments);

      console.log("Hello, World!");

      // Call the function to add the Start button
      this._addStartButton();
    },

    _addStartButton: function() {
      const wrapperDiv = domConstruct.create(
        "div",
        { class: "wrapper-div" },
        this.domNode
      );
      this.startButton = domConstruct.create(
        "button",
        {
          class: "start-button",
          innerHTML: "Run elaboration",
        },
        wrapperDiv
      );

      // Adding an event listener to the Start button
      on(this.startButton, "click", this._onStartButtonClick.bind(this));
    },

    _onStartButtonClick: function() {
      // Function to be executed when the "Run elaboration" button is clicked
      var inputValue = dom.byId('inputId').value;
      console.log("Input value:...........", configObj.services[0].apiEndpoint);

      // Perform the POST request to the API using the exported function from helper
      helper.postToApi(configObj.services[0].apiEndpoint, { input: inputValue })
        .then(function(response) {
          // Success callback
          console.log('POST request successful:', response);
        })
        .catch(function(error) {
          // Error callback
          console.error('POST request failed:', );
        });
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
