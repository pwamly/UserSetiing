///////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2018 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
///////////////////////////////////////////////////////////////////////////

define([
    'dojo/_base/declare',
    'dijit/_WidgetsInTemplateMixin',
    'dijit/form/Textarea',
    'jimu/BaseWidgetSetting'
      ],
  function(
    declare,
    _WidgetsInTemplateMixin,
    Textarea,
    BaseWidgetSetting) {
    /*jscs: disable maximumLineLength*/
    return declare([BaseWidgetSetting, _WidgetsInTemplateMixin], {
      //these two properties is defined in the BaseWidget
      baseClass: 'jimu-widget-about-setting',

      postCreate: function() {
        this.inherited(arguments);
        this.textarea = new Textarea({
        name: "configarea",
        value: JSON.stringify(this.config),
        style: "width:100%;"
    	}, this.myarea)
        this.textarea.startup();

        this.setConfig(this.config);
      },

      startup: function() {
        this.inherited(arguments);
      },
      
      setConfig: function(config) {
        this.config = config;

        this.textarea.set('value', JSON.stringify(config));

      },

      getConfig: function() {
        this.config = JSON.parse(this.textarea.get('value'));
        return this.config;
      }
    });
  });