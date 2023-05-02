define([
  'dojo/_base/declare',
  'dojo/on',
  'dojo/query',
  'dojo/_base/lang',
  'dojo/_base/array',
  'dojo/_base/html',
  "dojo/_base/Color",
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'jimu/dijit/TabContainer',
  'jimu/dijit/DrawBox',
  "esri/graphic",
  "esri/config",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/PictureMarkerSymbol",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/layers/GraphicsLayer",
  "esri/geometry/jsonUtils",
  "esri/tasks/RelationParameters",
  "dijit/form/Select",
  'dijit/ProgressBar',
  'jimu/LayerInfos/LayerInfoFactory',
  'jimu/LayerInfos/LayerInfos',
  "dojo/dom-construct",
  "dojo/dom-style",
  "dojo/dom-attr",
  "dojo/dom-class",
  "dijit/Toolbar",
  "dijit/DropDownMenu",
  "dijit/form/DropDownButton",
  "dijit/form/Button",
  "dijit/MenuItem",
  'dijit/layout/TabContainer',
  "dijit/layout/ContentPane",
  'jimu/utils',
  "dojo/store/Memory",
  "dgrid/OnDemandGrid",
  "dgrid/Selection",
  "dgrid/extensions/Pagination",
  "dgrid/extensions/ColumnHider",
  'jimu/dijit/Popup',
  'jimu/dijit/Message',
  "dojo/dom",
  "esri/graphicsUtils",
  "dojo/has",
  "dijit/form/HorizontalSlider",
  "esri/symbols/jsonUtils",
  'esri/tasks/BufferParameters',
  'esri/tasks/GeometryService',
  'esri/tasks/PrintTask',
  'esri/tasks/PrintParameters',
  'esri/tasks/PrintTemplate',
  'dijit/form/CheckBox',
  './PopupPrint',
  'dojo/request',
  'jimu/dijit/LoadingShelter',
  'dijit/form/Textarea',
  "dojo/aspect",
  'dojo/dom-geometry'
],
function(declare,on,query, lang, array, html, Color, _WidgetsInTemplateMixin,BaseWidget, TabContainer,DrawBox,Graphic,
         esriConfig, SimpleFillSymbol, SimpleLineSymbol, SimpleMarkerSymbol, PictureMarkerSymbol, Query, QueryTask,GraphicsLayer,
         geometryJsonUtils, RelationParameters, Select,ProgressBar, LayerInfoFactory, LayerInfos, domConstruct, domStyle, domAttr,
         domClass, Toolbar, DropDownMenu, DropDownButton, Button, MenuItem, TabContainerData, ContentPane, utils,
         Memory, OnDemandGrid, Selection, Pagination, ColumnHider, Popup, Message, dom, graphicsUtils, has,
         HorizontalSlider, symbolJsonUtils, BufferParameters, GeometryService, PrintTask, PrintParameters, PrintTemplate,
         CheckBox, PopupPrint, request, LoadingShelter, Textarea, aspect, domGeom) {

  return declare([BaseWidget,_WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-search',
    name: 'Search',
    layerToQuery: [],

    wWidget : null,
    hwidget: null,
    flagOperation: null,

    postCreate: function() {
      this.inherited(arguments);
      this._initSelectTab();

      this.shelter = new LoadingShelter({
        hidden: true,
        loadingText: this.nls.msgBuildPrint,
      });
      this.shelter.placeAt(dom.byId("main-page"));
      this.shelter.startup();
    },

    startup: function() {
      dojo.subscribe("/dojo/resize/stop", function(inst){
        var divobj = dom.byId(this.id+"_panel");

        var contentBox = domGeom.getContentBox(divobj);
        wWidget = contentBox.w;
        hwidget = contentBox.h;

        query('.jimu-widget-attributetable-main').forEach(function(node) {
          var h = (hwidget-110);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassATD {height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassATD');
        });

        query('.dgrid').forEach(function(node) {
          var h = (hwidget-190);
          var w = (wWidget-60);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassGrid {width: "+w+"px !important; height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassGrid');
        });

        query('.dijitTabPaneWrapper').forEach(function(node) {
          var h = (hwidget-170);
          var w = (wWidget-40);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassWrap {width: "+w+"px !important; height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassWrap');
        });

        query('#tabCD_tablist').forEach(function(node) {
          var w = (wWidget-40);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassTC {width: "+w+"px !important;}"});
          dojo.addClass(node, 'myCssClassTC');
        });

        query('#tabCD_tablist_menuBtn').forEach(function(node) {
          var l = (wWidget-67);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassMBtn {display: block !important; left: "+l+"px !important;}"});
          dojo.addClass(node, 'myCssClassMBtn');
        });

        query('#tabCD_tablist_rightBtn').forEach(function(node) {
          var l = (wWidget-91);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassRBtn {display: block !important; left: "+l+"px !important;}"});
          dojo.addClass(node, 'myCssClassRBtn');
          dojo.removeClass(node, 'dijitTabDisabled');
          dojo.removeClass(node, 'tabStripButtonDisabled');
          dojo.removeClass(node, 'dijitDisabled');
          dojo.removeClass(node, 'dijitTabFocused');
          dojo.removeClass(node, 'tabStripButtonFocused');
          dojo.removeClass(node, 'dijitTabDisabledFocused');
          dojo.removeClass(node, 'tabStripButtonDisabledFocused');
          dojo.removeClass(node, 'dijitDisabledFocused');
          dojo.removeClass(node, 'dijitFocused');
        });

        query('#tabCD_tablist_leftBtn').forEach(function(node) {
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassLBtn {display: block !important;}"});
          dojo.addClass(node, 'myCssClassLBtn');

          dojo.removeClass(node, 'dijitTabDisabled');
          dojo.removeClass(node, 'tabStripButtonDisabled');
          dojo.removeClass(node, 'dijitDisabled');
          dojo.removeClass(node, 'dijitTabFocused');
          dojo.removeClass(node, 'tabStripButtonFocused');
          dojo.removeClass(node, 'dijitTabDisabledFocused');
          dojo.removeClass(node, 'tabStripButtonDisabledFocused');
          dojo.removeClass(node, 'dijitDisabledFocused');
          dojo.removeClass(node, 'dijitFocused');
        });

        query('.dijitTabListWrapper').forEach(function(node) {
          var w = (wWidget-116);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassList {left: 23px; width: "+w+"px !important;}"});
          dojo.addClass(node, 'myCssClassList');
        });
      });

      //panel risultati
      this.AttributeTableDiv = null;
      this.layers = [];
      this.grids = [];
      this.tabContainer = null;
      this.tabPages = [];
      this.tableDiv = null;
      this.zoomButton = null;
      this.exportButtonCSV = null;
      this.exportButtonPDF = null;
      this.selectionMenu = null;
      this.layersIndex = -1;
      this.graphicsLayers = [];
      this.isFirst = true;

      this._userGeometry = null;
      this.isMenu = true;
      this.findValue = false;
      this.indexTab = -1;
      this.contQuery = 0;
      this.layerToQueryTab = [];
      this.graphicsLayersUserSelection = null;
      this.graphicsLayersUserSelectionCopy = null;
      this.drawPoint = false;
      this.showBuffer = false;
      this.userPoint = null;

      //Patch buffer/remove graphics
      this.userPointCopy = null;

      this.distanzaBuffer;
      this.graphicsLayersBuffer = null;
      this.paramsPrint = null;
      this.firstCallGPPrint = false;

      this.inherited(arguments);
      this.tabContainerMenu = new TabContainer({
        tabs:[{
          title:this.nls.freeHand,
          content:this.freeHandNode
        },{
          title:this.nls.buffer,
          content:this.bufferNode
        },{
          title:this.nls.results,
          content:this.resultsTabNode
        }],
        selected:this.nls.freeHand
      },this.content);
      this.tabContainerMenu.startup();

      html.addClass(this.btnBuffer, 'jimu-state-disabled');
      html.addClass(this.btnSearch, 'jimu-state-disabled');

      var valPred = 2000;
      new HorizontalSlider({
        name: "slider",
        value: valPred,
        minimum: 100,
        maximum: 10000,
        intermediateChanges: true,
        discreteValues: 100,
        style: "width:100%;",
        onChange: function(value){
          dom.byId("textboxBuffer").value = value;
        }
      }, "slider").startup();
      dom.byId("textboxBuffer").value = valPred;

      // recupero token per servizi ags
      /*
      var timestamp = new Date().getTime();
      request(this.appConfig.httpProxy.url+'?http://services1.arcgis.com/?tk=kkk' + timestamp).then(lang.hitch(this,
          function(rData) {
              this.token = rData;
      }),
      function(err) {
          //def.reject(err);
      });
      */
    },

    setDimensionGrid:function(){
      var divobj = dom.byId("d77b0e2b0b024a2fa0deff61e4316f47_51_panel");
      if (divobj) {
        var contentBox = domGeom.getContentBox(divobj);
        wWidget = contentBox.w;
        hwidget = contentBox.h;

        query('.jimu-widget-attributetable-main').forEach(function(node) {
          var h = (hwidget-110);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassATD {height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassATD');
        });

        query('.dgrid').forEach(function(node) {
          var h = (hwidget-190);
          var w = (wWidget-50);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassGrid {width: "+w+"px !important; height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassGrid');
        });

        query('.dijitTabPaneWrapper').forEach(function(node) {
          var h = (hwidget-170);
          var w = (wWidget-40);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassWrap {width: "+w+"px !important; height: "+h+"px !important;}"});
          dojo.addClass(node, 'myCssClassWrap');
        });

        query('#tabCD_tablist').forEach(function(node) {
          var w = (wWidget-40);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassTC {width: "+w+"px !important;}"});
          dojo.addClass(node, 'myCssClassTC');
        });

        query('#tabCD_tablist_menuBtn').forEach(function(node) {
          var l = (wWidget-67);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassMBtn {display: block !important; left: "+l+"px !important;}"});
          dojo.addClass(node, 'myCssClassMBtn');
        });

        query('#tabCD_tablist_rightBtn').forEach(function(node) {
          var l = (wWidget-91);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassRBtn {display: block !important; left: "+l+"px !important;}"});
          dojo.addClass(node, 'myCssClassRBtn');
          dojo.removeClass(node, 'dijitTabDisabled');
          dojo.removeClass(node, 'tabStripButtonDisabled');
          dojo.removeClass(node, 'dijitDisabled');
          dojo.removeClass(node, 'dijitTabFocused');
          dojo.removeClass(node, 'tabStripButtonFocused');
          dojo.removeClass(node, 'dijitTabDisabledFocused');
          dojo.removeClass(node, 'tabStripButtonDisabledFocused');
          dojo.removeClass(node, 'dijitDisabledFocused');
          dojo.removeClass(node, 'dijitFocused');
        });

        query('#tabCD_tablist_leftBtn').forEach(function(node) {
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassLBtn {display: block !important;}"});
          dojo.addClass(node, 'myCssClassLBtn');

          dojo.removeClass(node, 'dijitTabDisabled');
          dojo.removeClass(node, 'tabStripButtonDisabled');
          dojo.removeClass(node, 'dijitDisabled');
          dojo.removeClass(node, 'dijitTabFocused');
          dojo.removeClass(node, 'tabStripButtonFocused');
          dojo.removeClass(node, 'dijitTabDisabledFocused');
          dojo.removeClass(node, 'tabStripButtonDisabledFocused');
          dojo.removeClass(node, 'dijitDisabledFocused');
          dojo.removeClass(node, 'dijitFocused');
        });

        query('.dijitTabListWrapper').forEach(function(node) {
          var w = (wWidget-116);
          var style = dojo.create("style",{type:"text/css"},node);
          dojo.attr(style, {innerHTML:".myCssClassList {left: 23px; width: "+w+"px !important;}"});
          dojo.addClass(node, 'myCssClassList');
        });
      }
    },

    onClose:function(){
      this.drawBoxPoly.deactivate();
      this.drawBox.deactivate();
      this.destroyUser();
      this.clearUserSelectionCopy();
    },

    onOpen: function(){
      if (this.tabContainerMenu != null)
        this.tabContainerMenu.selectTab(this.nls.freeHand);
    },

    destroy: function() {
      this.destroyUser();
      this.clearUserSelectionCopy();
    },

    destroyUser: function() {
      var len, i;
      len = this.tabPages.length;
      for (i = 0; i < len; i++) {
        this.tabPages[i].destroy();
      }
      this.tabPages.length = 0;
      if(this.tabContainer){
        this.tabContainer.destroy();
      }

      this.layers.length = 0;
      this.grids.length = 0;
      this.layersIndex = -1;
      this.tableDiv = null;
      this.zoomButton = null;
      this.exportButtonCSV = null;
      this.exportButtonPDF = null;
      if (this.selectionMenu) {
        this.selectionMenu.destroy();
      }
      this.selectionMenu = null;
//			if(this.AttributeTableDiv){
//				domConstruct.empty(this.AttributeTableDiv);
//				this.AttributeTableDiv = null;
//			}
      var node = dom.byId("divAttributeTableData");
      if (node != null) {
        domConstruct.empty(node);
        domConstruct.destroy("divAttributeTableData");
        node = null;
      }

//			if (this.zoomButton != null)
//				this.zoomButton.set('disabled', true);

      len = this.graphicsLayers.length;
      for (i = 0; i < len; i++) {
        this.map.removeLayer(this.graphicsLayers[i]);
      }

      if (this.graphicsLayersUserSelection != null) {
        this.map.removeLayer(this.graphicsLayersUserSelection);
        this.graphicsLayersUserSelection = null;
      }

      if (this.graphicsLayersBuffer != null) {
        this.map.removeLayer(this.graphicsLayersBuffer);
        this.graphicsLayersBuffer = null;
      }

      this.inherited(arguments);
    },

    _initSelectTab:function(){
      this._initDraw();
    },

    _initLayerSelect:function(){
      this.layerToQuery = [];

      if (this.map.itemId) {
        LayerInfos.getInstance(this.map, this.map.itemInfo).then(lang.hitch(this, function(operLayerInfos) {
          this.operLayerInfos = operLayerInfos;
          console.log(this.operLayerInfos);
        }));
      } else {
        var itemInfo = this._obtainMapLayers();
        LayerInfos.create(this.map, itemInfo).then(lang.hitch(this, function(operLayerInfos) {
          this.operLayerInfos = operLayerInfos;
        }));
      }

      array.forEach(this.operLayerInfos.getLayerInfoArray(), function(layerInfo) {
        //se configurato, verificare se devo analizzare il servizio di mappa
        if(this.config.services.length != 0){
          for(var i=0;i<this.config.services.length;i++){
            var srv = this.config.services[i];
//						alert("srv.id: "+srv.id +"   layerInfo.id: "+layerInfo.id)
            if (srv.id==layerInfo.id) {
//							alert("conf trovata:"+srv.layers)
              //configurato, procedo, solo nel caso di servizio di mappa visibile
              if (layerInfo.isVisible()) {
                if (layerInfo.originOperLayer && layerInfo.originOperLayer.layers) {
//									alert("conf - elenco layer conf popup: "+layerInfo.originOperLayer.layers)
                  this.extractLayer(layerInfo, srv.layers, layerInfo.originOperLayer.layers, true);
                } else {
                  if(layerInfo.newSubLayers != null) {
                    this.extractLayer(layerInfo, null, [layerInfo.originOperLayer], true);
                  }
                }
              }
            }
          }
        } else {
          console.log(layerInfo);
          if (layerInfo.isVisible()) {
            if (layerInfo.originOperLayer && layerInfo.originOperLayer.layers) {
              console.log("entrato nell'if");
//							alert("no conf - elenco layer conf popup: "+layerInfo.originOperLayer.layers)
              this.extractLayer(layerInfo, null, layerInfo.originOperLayer.layers, true);
            } else {
              console.log("entrato nell'else");
              if(layerInfo.newSubLayers != null) {
                this.extractLayer(layerInfo, null, [layerInfo.originOperLayer], true);
              }
            }
          }
        }
      }, this);
    },

    extractLayer: function(layerInfo, layersConf, popupConf) {
      if(layerInfo.newSubLayers.length === 0) {
//				alert("layer da analizzare: "+layerInfo.id+" vis:"+layerInfo.isVisible())
        if (layerInfo.isVisible()) {
          if (layersConf != null) {
//						alert("cercare se layer configurato")
            for(var i=0;i<layersConf.length;i++){
              var layID = layersConf[i];
              var layerID = layerInfo.id.substring(layerInfo.id.lastIndexOf('_')+1);
              if (layerID==layID) {
                var l = this.buildLayertoQuery(layerInfo, popupConf, layerID);
                if (l != null) {
                  this.layerToQuery.push(l);
                }
              }
            }
          } else {
//						alert("nessuna configurazione")
            var layerID = layerInfo.id.substring(layerInfo.id.lastIndexOf('_')+1);

            if (layerInfo.originOperLayer.layers) {
              //popupconf
              popupConf=layerInfo.originOperLayer.layers;
            } else if (layerInfo.originOperLayer.popupInfo) {
              var popupConfApp=layerInfo.originOperLayer.popupInfo;

              popupConf = [{id:layerID, popupInfo:popupConfApp}];

            } else if (layerInfo.originOperLayer.featureCollection && layerInfo.originOperLayer.featureCollection.layers) {
              //popupconf
              popupConf=layerInfo.originOperLayer.featureCollection.layers;
            } else if (
                layerInfo.originOperLayer.collection &&
                layerInfo.originOperLayer.collection.layerInfo &&
                layerInfo.originOperLayer.collection.layerInfo.originOperLayer &&
                layerInfo.originOperLayer.collection.layerInfo.originOperLayer.featureCollection &&
                layerInfo.originOperLayer.collection.layerInfo.originOperLayer.featureCollection.layers) {
              //popupconf
              popupConf=layerInfo.originOperLayer.collection.layerInfo.originOperLayer.featureCollection.layers;
              layerID = layerInfo.id;
              layerInfo = layerInfo.originOperLayer.collection.layerInfo.originOperLayer;
            }
//						else {
//							alert("oggetto già completo delle informazioni")
//						}

            var l = this.buildLayertoQuery(layerInfo, popupConf, layerID);
            if (l != null) {
              this.layerToQuery.push(l);
            }

          }
        }
        return;
      }

      array.forEach(layerInfo.newSubLayers, lang.hitch(this ,function(layersConf, popupConf, subLayerInfo){
        this.extractLayer(subLayerInfo, layersConf, popupConf);
      }, layersConf, popupConf));
    },

    buildLayertoQuery:function(layerInfo, popupConf, layerID) {
      var layerToReturn = null;
  var control = false;
      for(var k=0; k < popupConf.length; k++){
        var popup = popupConf[k];
        if (layerID == popup.id) {

          var lay = null;

          lay = this.map.getLayer(layerInfo.id);
    
    /*NON LAVORA*/
          /*if (lay == null) {
            var arrSup = layerInfo.id.split("_");
            arrSup.pop();

            lay = this.map.getLayer(arrSup.join("_"));
    control = true;
    
          }*/
    
          if (lay == null) {
            lay = this.map.getLayer(layerID);
          }


          if (lay == null)
          {
            var regex = /^(\D+_\d+)_(\d+)$/gi;
            var m;
            var layerId_parent;

            while ((m = regex.exec(layerInfo.id)) !== null) {
              // This is necessary to avoid infinite loops with zero-width matches
              if (m.index === regex.lastIndex) {
                regex.lastIndex++;
              }
              layerId_parent = m[1];
            }
            //var layerId_parent = layerInfo.id.substring(0, layerInfo.id.lastIndexOf("_"));
            LayerInfos.getInstance(this.map, this.map.itemInfo).then(lang.hitch(this, function(operLayerInfos) {
              array.forEach(operLayerInfos.getLayerInfoArray(), function(parent, idx) {
                if(parent.id === layerId_parent)
                {
                  array.forEach(parent.getSubLayers(), function(groupLayer, idx1) {
                    if(groupLayer.getSubLayers().length > 0)
                    {
                      array.forEach(groupLayer.getSubLayers(), function(item, idx2) {
                        if (item.id === layerInfo.id)
                          lay = item;
                      });
                    }
                    else
                    {
                      if (groupLayer.id === layerInfo.id)
                        lay = groupLayer;
                    }
                  });
                }
              });
            }));
          }

          if (lay == null) {
            //this.popupMessage(this.nls.msgErrorQueryLayer + " " + layerInfo.id);
            return;
          }

          lay.title = layerInfo.title; 	//metto nell'oggetto layer il title che deriva da arcgiscom
          lay.popup = popup;				//metto nell'oggetto layer le informazioni relative alla conf popup di arcgiscom
          if (this.config.onlyPoint) {
            if (lay.geometryType == "esriGeometryPoint") {
              if (layerInfo.featureCollection) {
                lay = layerInfo;
              }
              layerToReturn = lay;
            }
          } else {
            if (layerInfo.featureCollection && layerInfo.featureCollection.layers) {
//							lay = layerInfo;

              for(var f=0;f<layerInfo.featureCollection.layers.length;f++){
                var lfc = layerInfo.featureCollection.layers[f];
                if (lfc.id == layerID) {
                  lay = {"featureCollection":lfc, "title": lay.name};
                  break;
                }
              }


            }
            layerToReturn = lay;
          }
        }
      }
  
  if(control){
  layerToReturn.layerID = layerID;
  }
  
      return layerToReturn;
    },

    _onBtnClearPoly: function(){
      html.addClass(this.btnBuffer, 'jimu-state-disabled');
      html.addClass(this.btnSearch, 'jimu-state-disabled');
      this.drawPoint = false;
      this.destroyUser();
      if (this.flagOperation != "SEARCH_POINT") {
        this.clearUserSelectionCopy();
      }
      this.flagOperation = null;
      this.showBuffer = false;
      this.userPoint = null;

      //Patch buffer/remove graphics
      this.userPointCopy = null;


//			this.textboxX.value = "";
//			this.textboxY.value = "";
      this.textboxX.set('value', "");
      this.textboxY.set('value', "");
    },

    _initDraw:function(){
      this.drawBoxPoly.setMap(this.map);
      this.drawBox.setMap(this.map);

//			var pointSys = {"style":"esriSMSCircle","color":[0,0,128,128],"name":"Circle","outline":{"color":[0,0,128,255],"width":1},"type":"esriSMS","size":10};
////		    var lineSys = {"style":"esriSLSSolid","color":[79,129,189,255],"width":3,"name":"Blue 1","type":"esriSLS"};
////		    var polygonSys = {"style":"esriSFSSolid","color":[79,129,189,128],"type":"esriSFS","outline":{"style":"esriSLSSolid","color":[54,93,141,255],"width":1.5,"type":"esriSLS"}};
//			var pointSym = symbolJsonUtils.fromJson(pointSys);
//			this.drawBox.setPointSymbol(pointSym);

      var pointSym = this.getDrawPointSymbol();
      this.drawBox.setPointSymbol(pointSym);

      var polySym = this.getDrawFillSymbol();
      this.drawBoxPoly.setPolygonSymbol(polySym);

      this.own(on(this.drawBoxPoly,'Clear',lang.hitch(this,function(){
      })));

      this.own(on(this.drawBox,'Clear',lang.hitch(this,function(){
        html.addClass(this.btnBuffer, 'jimu-state-disabled');
        html.addClass(this.btnSearch, 'jimu-state-disabled');
        this.drawPoint = false;
        this.destroyUser();
        if (this.flagOperation != "SEARCH_POINT") {
          this.clearUserSelectionCopy();
        }
        this.flagOperation = null;
        this.showBuffer = false;
        this.userPoint = null;

        //Patch buffer/remove graphics
        this.userPointCopy = null;

//				this.textboxX.value = "";
//				this.textboxY.value = "";
        this.textboxX.set('value', "");
        this.textboxY.set('value', "");
      })));

      this.own(on(this.drawBoxPoly,'DrawEnd',lang.hitch(this,function(graphic,geotype,commontype){/*jshint unused: false*/
        this.drawBoxPoly.deactivate();
        this._clearPoly();
        this._clearPoint();
        this._initLayerSelect();		//cerco i layer da interrogare alla fine della selezione geografica
        this._userGeometry = graphic.geometry;
        this.layersIndex = -1;
        this.destroyUser();
        this.clearUserSelectionCopy();

        //creo una copia della selezione, prima elimino la precedente se presente
        var symbol = this.getDrawFillSymbolCopy();
        var graphic = new Graphic(this._userGeometry, symbol );
        this.graphicsLayersUserSelectionCopy = new GraphicsLayer();
        this.graphicsLayersUserSelectionCopy.add(graphic);
        this.map.addLayer(this.graphicsLayersUserSelectionCopy);

        this.isMenu = true;
        this.findValue = false;
        this.indexTab = -1;
        this.contQuery = 0;
        this.layerToQueryTab = [];
        this._doQuery();
      })));

      this.own(on(this.drawBox,'DrawEnd',lang.hitch(this,function(graphic,geotype,commontype){/*jshint unused: false*/
        this.drawBox.deactivate();
        this.userPoint = graphic.geometry;
        this.destroyUser();
        this.clearUserSelectionCopy();


        //Patch buffer/remove graphics
        if (this.userPointCopy){
          this.drawBox.removeGraphic(this.userPointCopy);
        }
        this.userPointCopy = graphic;


//				this.textboxX.value = graphic.geometry.x;
//				this.textboxY.value = graphic.geometry.y;
        this.textboxX.set('value', parseInt(graphic.geometry.x));
        this.textboxY.set('value', parseInt(graphic.geometry.y));

        this.drawPoint = true;
        this.showBuffer = false;
        html.removeClass(this.btnBuffer, 'jimu-state-disabled');
      })));
    },

    _clearPoly:function(){
      this.drawBoxPoly.clear();
    },

    _clearPoint:function(){
      this.drawBox.clear();
    },

    _showError:function(errMsg){
      console.error(errMsg);
    },

    _getHighLightColorOutline:function(){
      var color = new Color('#f5f50e');
      if(this.config && this.config.highLightColorOutline){
        color = new Color(this.config.highLightColorOutline);
      }
      return color;
    },

    _getHighLightColorUserOutline:function(){
      var color = new Color('#f5f50e');
      if(this.config && this.config.highLightColorUserOutline){
        color = new Color(this.config.highLightColorUserOutline);
      }
      return color;
    },

    getDrawPointColor:function(){
      var color = new Color('#000080');
      if(this.config && this.config.pointColor){
        color = new Color(this.config.pointColor);
      }
      return color;
    },

    getDrawOutlineColor:function(){
      var color = new Color('#000080');
      if(this.config && this.config.outlineColor){
        color = new Color(this.config.outlineColor);
      }
      return color;
    },

    getDrawFillColor:function(){
      var color = new Color('#000080');
      if(this.config && this.config.fillColor){
        color = new Color(this.config.fillColor);
      }
      return color;
    },

    getBufferColor:function(){
      var color = new Color('#000080');
      if(this.config && this.config.bufferColor){
        color = new Color(this.config.bufferColor);
      }
      return color;
    },

    getDrawPointSymbol:function(){
      var style = SimpleMarkerSymbol.STYLE_CIRCLE;
      var size = 15;
      var color = this.getDrawPointColor();
      color.a = 0.5;

      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this.getDrawOutlineColor();
      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);

      var symbol = new SimpleMarkerSymbol(style, size, outlineSymbol, color);
      return symbol;
    },

    getDrawFillSymbol:function(type){
      var style = SimpleFillSymbol.STYLE_SOLID;
      var color = this.getDrawFillColor();
      color.a = 0.5;
      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this.getDrawOutlineColor();
      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);
      var symbol = new SimpleFillSymbol(style, outlineSymbol, color);
      return symbol;
    },

    getDrawFillSymbolCopy:function(){
      var style = SimpleFillSymbol.STYLE_SOLID;
      var color = this.getDrawFillColor();
      color.a = 0.2;
      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this.getDrawOutlineColor();
      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);
      var symbol = new SimpleFillSymbol(style, outlineSymbol, color);
      return symbol;
    },

    getBufferFillSymbol:function(type){
      var style = SimpleFillSymbol.STYLE_SOLID;
      var color = this.getBufferColor();
      color.a = 0.5;
      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this.getDrawOutlineColor();
      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);
      var symbol = new SimpleFillSymbol(style, outlineSymbol, color);
      return symbol;
    },

    _getHighLightColorFill:function(){
      var color = new Color('#f5f50e');
      if(this.config && this.config.highLightColorFill){
        color = new Color(this.config.highLightColorFill);
      }
      return color;
    },

    _getHighLightColorUserFill:function(){
      var color = new Color('#f5f50e');
      if(this.config && this.config.highLightColorUserFill){
        color = new Color(this.config.highLightColorUserFill);
      }
      return color;
    },

    _setHightLightSymbol:function(g, type){
      switch(g.geometry.type){
        case 'extent':
        case 'polygon':
          g.setSymbol(this._getHightLightFillSymbol(type));
          break;
        case 'polyline':
          g.setSymbol(this._getHightLightLineSymbol(type));
          break;
        default:
          g.setSymbol(this._getHightLightMarkerSymbol(type));
          break;
      }
    },

    _getHightLightMarkerSymbol:function(type){
      var style = SimpleMarkerSymbol.STYLE_CIRCLE;
      var size = 15;
      var color = this._getHighLightColorFill();
      if (type=="USER")
        color = this._getHighLightColorUserFill();
      color.a = 0.5;

      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this._getHighLightColorOutline();
      if (type=="USER")
        outlineColor = this._getHighLightColorUserOutline();

      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);

      var symbol = new SimpleMarkerSymbol(style, size, outlineSymbol, color);
      return symbol;
    },

    _getHightLightLineSymbol:function(type){
      var symbol = new SimpleLineSymbol();
      var style = SimpleLineSymbol.STYLE_SOLID;
      var color = this._getHighLightColorOutline();
      if (type=="USER")
        outlineColor = this._getHighLightColorUserOutline();
      color.a = 0.5;
      var width = 2;
      symbol.setStyle(style);
      symbol.setColor(color);
      symbol.setWidth(width);
      return symbol;
    },

    _getHightLightFillSymbol:function(type){
      var style = SimpleFillSymbol.STYLE_SOLID;
      var color = this._getHighLightColorFill();
      if (type=="USER")
        color = this._getHighLightColorUserFill();
      color.a = 0.5;
      var outlineSymbol = new SimpleLineSymbol();
      var outlineColor = this._getHighLightColorOutline();
      if (type=="USER")
        outlineColor = this._getHighLightColorUserOutline();
      var outlineWidth = 1;
      outlineSymbol.setStyle(SimpleLineSymbol.STYLE_SOLID);
      outlineSymbol.setColor(outlineColor);
      outlineSymbol.setWidth(outlineWidth);
      var symbol = new SimpleFillSymbol(style, outlineSymbol, color);
      return symbol;
    },

    _doQuery:function(){
      if (this.layerToQuery.length == 0) {
        this.popupMessage(this.nls.msgNoLayerToQuery);
        return;
      }

      this.tabContainerMenu.selectTab(this.nls.results);
      html.setStyle(this.progressBar.domNode,'display','block');
      html.setStyle(this.resultsSection,'display','none');
      html.setStyle(this.noresultsSection,'display','none');

      for (var i = 0; i < this.layerToQuery.length; i++) {
        var layerInfo = this.layerToQuery[i];
        if (layerInfo.url || layerInfo.layerObject.url) {
          this._doQueryByUrl(i, layerInfo, layerInfo.popup, this._userGeometry);
        } else if (layerInfo.featureCollection) {
          this._doQueryByfeatureSet(i, layerInfo, this._userGeometry);
        } else {
          this._onQueryError("wrong layer define: " + layerInfo.name);
        }
      }
    },

    _doQueryByUrl: function(index, layerInfo, popup, geometry){
      fields = [];
  var sendPop = null;
  if(popup && popup.popupInfo && popup.popupInfo.fieldInfos){
    for (var i = 0; i < popup.popupInfo.fieldInfos.length; i++) {
    var field = popup.popupInfo.fieldInfos[i];
    if (field.visible) {
      fields.push(field.fieldName);
    }
    }
    sendPop = popup.popupInfo;
  }else{
    fields = ["*"];
  }
      

      var url = layerInfo.url ? layerInfo.url : layerInfo.layerObject.url;
  if(layerInfo.layerID){
    url +="/"+layerInfo.layerID;
  }
      var queryTask = new QueryTask(url);
      var q = new Query();
      q.returnGeometry = true;
      q.outFields = fields;
      q.geometry = geometry;
      queryTask.execute(q, lang.hitch(this, this._onQueryComplete, index, sendPop), lang.hitch(this, this._onQueryError));
    },

    _doQueryByfeatureSet: function(index, layerInfo, geometry) {
//			alert("_doQueryByfeatureSet featureCollection")
//			var featureSet = layerInfo.featureCollection.featureSet;
      var layers = layerInfo.featureCollection;
      var featureSet = layers.featureSet;
      var fieldsColl = layers.layerDefinition.fields;
      var popup = layers.popupInfo;
      if (popup == null || popup.fieldInfos == null) {
//				alert("salto - error")
        this._onQueryError("popup non configurata");
        return;
      }

      fields = [];
      for (var i = 0; i < popup.fieldInfos.length; i++) {
        var field = popup.fieldInfos[i];
        if (field.visible) {
          for (var t = 0; t < fieldsColl.length; t++) {
            if(fieldsColl[t].name == field.fieldName) {
              fields.push(fieldsColl[t]);
            }
          }
        }
      }

      var resultFeatures = [];
      if(geometry.type === 'extent'){
        array.forEach(featureSet.features, function(feature){
          var g = geometryJsonUtils.fromJson(feature.geometry);
          if(geometry.intersects(g)){
            resultFeatures.push(feature);
          }
        });
        this._displayResult(resultFeatures, fields, index, popup);
      }else if(geometry.type === 'polygon'){
        if(featureSet.geometryType === 'esriGeometryPoint'){
          array.forEach(featureSet.features, function(feature){
            var g = geometryJsonUtils.fromJson(feature.geometry);
            if(geometry.contains(g)){
              resultFeatures.push(feature);
            }
          });
          this._displayResult(resultFeatures, fields, index, popup);
        }else{
          var geometries = array.map(featureSet.features, function(feature){
            return geometryJsonUtils.fromJson(feature.geometry);
          });

          var params = new RelationParameters();
          params.geometries1 = geometries;
          params.geometries2 = [geometry];
          params.relation = RelationParameters.SPATIAL_REL_INTERSECTION;

          var geometryService = new GeometryService(this.appConfig.geometryService);
          var myObj = {
            fields: fields,
            index: index,
            popup: popup,
            featureSet: featureSet,
            parent: this
          };
//					geometryService.relation(params).then(lang.hitch(myObj, this.responseRelations));
          geometryService.relation(params).then(lang.hitch(myObj, function(relations) {
            var rFeatures = [];
            array.forEach(relations, function(relation) {
              var f = featureSet.features[relation.geometry1Index];
              rFeatures.push(f);
            });
            myObj.parent._displayResult(rFeatures, myObj.fields, myObj.index, myObj.popup);
          }));
        }
      }else{
        this._onQueryError("unsupport geometry type: " + geometry.type);
        return;
      }
    },

//		responseRelations:function(relations){
//			var rFeatures = [];
//			for (var i = 0; i < relations.length; i++) {
//				var relation = relations[i];
//				var f = this.featureSet.features[relation.geometry1Index];
//				rFeatures.push(f);
//			}
//			
//			this.parent._displayResult(rFeatures, this.fields, this.index, this.popup);
//		},

    _onQueryComplete:function(index, popup, response){
      var features = response.features;
      this._displayResult(features, response.fields, index, popup);
    },

    _displayResult: function(features, fields, index, popup) {
//			alert("_displayResult trovati: "+features.length)
      this.contQuery = this.contQuery + 1;
      var length = features.length;
      if(length > 0){
        if (this.isMenu) {
          this.initDiv();
          this._clearPoly();
          this.isMenu = false;
        }

        this.findValue = true;
        this.indexTab = this.indexTab + 1;
        this.layerToQueryTab.push(this.layerToQuery[index]);

        this.graphicsLayers[this.indexTab] = new GraphicsLayer();
        this.map.addLayer(this.graphicsLayers[this.indexTab]);

        var json = {};
        var div = domConstruct.create("div");
        json.id = this.layerToQuery[index].id;
        var name = this.layerToQuery[index].title;
        if (name == null || name == "undefined")
          name = this.layerToQuery[index].name;
        json.title = name;
        json.name = name;
        json.content = div;
        //json.closable = true;
        json.style = "height: 100%; width: 100%; overflow: visible;";
        var cp = new ContentPane(json);
        this.tabPages.push(cp);
        this.tabContainer.addChild(cp);

        data = [];
        var columns = {};
        var value;
        var type;
        var myid = 0;
        var fieldLink = null;
        array.map(features, lang.hitch(this, function(fields, feature) {
          for (var attr in feature.attributes) {
            value = feature.attributes[attr];
            if (attr === this.layerToQuery[index].typeIdField && this.layerToQuery[index].types) {
              value = this.getTypeName(value, this.layerToQuery[index].types);
              feature.attributes[attr] = value;
            }
            type = this.getFieldType(attr, fields);
            if (value && type === "esriFieldTypeDate") {
              var sDateate = new Date(value);
              value = sDateate.toLocaleString();
              feature.attributes[attr] = value;
            }

            if (value != null && value.toString().indexOf("http")==0) {
              fieldLink = attr;
            }
          }

          feature.attributes.myid = myid;
          myid = myid + 1;

    if(feature.geometry){
      var geom = geometryJsonUtils.fromJson(feature.geometry);
            feature.attributes.geometryApp = geom;
            var graphic = new Graphic(geom);
            // simbolo
            this._setHightLightSymbol(graphic, "ALL");
            this.graphicsLayers[this.indexTab].add(graphic);
    }
          

          data.push(feature.attributes);
        }, fields));

        if (fields != null) {
          var len = fields.length;
          for (var i = 0; i < len; i++) {
            if (popup) {
              for (var z = 0; z < popup.fieldInfos.length; z++) {
                var fld = popup.fieldInfos[z];
                if (fld.visible && fld.fieldName == fields[i].name) {
                  columns[fields[i].name] = {
                    label: fld.label
                  };
                  break;
                }
              }
            } else {
              columns[fields[i].name] = {
                label: fields[i].alias
              };
            }

            if (fields[i].alias == fieldLink) {
              var url = "";
              columns[fields[i].name].renderCell = lang.hitch(this, this.renderCell, url);
            }
          }
        }
        this.createTable(columns, data, index, this.indexTab);
      }
      this.checkShowResult();
    },

    checkShowResult: function(){
      if (this.contQuery == this.layerToQuery.length) {
        //se sono alla fine
        html.setStyle(this.progressBar.domNode,'display','none');
        if (this.findValue) {
          this.tabContainer.startup();
          utils.setVerticalCenter(this.tabContainer.domNode);
          this.tabChanged();
          html.setStyle(this.noresultsSection,'display','none');
          html.setStyle(this.resultsSection,'display','block');
        } else {
          var node = dom.byId("divAttributeTableData");
          if (node != null) {
            domConstruct.empty(node);
            domConstruct.destroy("divAttributeTableData");
            node = null;
          }
          html.setStyle(this.resultsSection,'display','none');
          html.setStyle(this.noresultsSection,'display','block');
        }
      }
    },

    renderCell: function(url, object, value, node) {
      var href = "";
      if (url.endWith("/")) {
        href = value;
      } else {
//	          href = url + "/" + value;
        href = value;
      }
      node.innerHTML = "<a target='_blank' href='" + href + "'>" + value + "</a>";
    },

    getTypeName: function(value, types) {
      var len = types.length;
      for (var i = 0; i < len; i++) {
        if (value === types[i].id) {
          return types[i].name;
        }
      }
      return "";
    },

    getFieldType: function(name, fields) {
      if (fields==null) return "";
      var len = fields.length;
      for (var i = 0; i < len; i++) {
        if (name === fields[i].name) {
          return fields[i].type;
        }
      }
      return "";
    },

    createTable: function(columns, data, index, indexTab) {
      var memStore = new Memory({
        data: data,
        idProperty: "myid"
      });

      var json = {};
      json.bufferRows = Infinity;
      json.columns = columns;
      json.store = memStore;
      json.pagingTextBox = true;
      json.firstLastArrows = true;
      var grid = new(declare([OnDemandGrid, Selection, Pagination, ColumnHider]))(json, domConstruct.create("div"));
//			var grid = new(declare([OnDemandGrid, Selection, Pagination, ColumnHider]))(json, domConstruct.create("div", { id: "divDataGRID" }));
      domConstruct.place(grid.domNode, this.tabPages[indexTab].content);
      grid.startup();
      this.grids[indexTab] = grid;
      this.own(on(grid, "click", lang.hitch(this, this.onRowClick)));
      this.own(on(grid, "dblclick", lang.hitch(this, this.onZoomButton)));
      this.setDimensionGrid();
    },

    onRowClick: function(zoomIds) {
      var rows = this.getSelectedRowsData();
      if (rows == null) {
//				this.zoomButton.set('disabled', true);
        if (this.graphicsLayersUserSelection != null) {
          this.graphicsLayersUserSelection.clear();
        }
      } else {
//				this.zoomButton.set('disabled', false);
        if (this.graphicsLayersUserSelection != null) {
          this.graphicsLayersUserSelection.clear();
        } else {
          this.graphicsLayersUserSelection = new GraphicsLayer();
          this.map.addLayer(this.graphicsLayersUserSelection);
        }

        for (var i = 0; i < rows.length; i++) {
          var row = rows[i];
          var graphic = new Graphic(row.geometryApp);
          // simbolo
          this._setHightLightSymbol(graphic, "USER");
          this.graphicsLayersUserSelection.add(graphic);
        }
      }
    },

    _onQueryError:function(error){
      this.contQuery = this.contQuery + 1;
      html.setStyle(this.progressBar.domNode,'display','none');
      this._clearPoly();
      console.error("SearchWidget query failed",error);
      this._showError("Error");
      this.checkShowResult();
//			html.setStyle(this.resultsSection,'display','none');
//			html.setStyle(this.noresultsSection,'display','block');
    },

    initDiv: function() {
      var node = dom.byId("divAttributeTableData");
      if (node != null) {
        domConstruct.empty(node);
        domConstruct.destroy("divAttributeTableData");
        node = null;
      }

      this.AttributeTableDiv = domConstruct.create("div", {"id":"divAttributeTableData"}, this.resultsTabNode);
      domClass.add(this.AttributeTableDiv, "jimu-widget-attributetable-main");

      var toolbarDiv = domConstruct.create("div");
      var toolbar = new Toolbar({}, domConstruct.create("div"));

      var menus = new DropDownMenu();

      var columns = new MenuItem({
        label: this.nls.columns,
        iconClass: "esriAttributeTableColumnsImage",
        onClick: lang.hitch(this, this.toggleColumns)
      });
      menus.addChild(columns);

      if (!this.config.hideExportButtonCSV) {
        this.exportButtonCSV = new MenuItem({
          label: this.nls.exportFilesCSV,
          showLabel: true,
          iconClass: "esriAttributeTableExportImage",
          onClick: lang.hitch(this, this.onExportButtonCSV)
        });
        menus.addChild(this.exportButtonCSV);
      }

      if (!this.config.hideExportButtonPDF) {
        this.exportButtonPDF = new MenuItem({
          label: this.nls.exportFilesPDF,
          showLabel: true,
          iconClass: "esriAttributeTableExportImage",
          onClick: lang.hitch(this, this.onExportButtonPDF)
        });
        menus.addChild(this.exportButtonPDF);
      }

      this.selectionMenu = new DropDownButton({
        label: this.nls.options,
        iconClass: "esriAttributeTableOptionsImage",
        dropDown: menus
      });
      toolbar.addChild(this.selectionMenu);

      this.zoomButton = new Button({
        label: this.nls.zoomto,
        iconClass: "esriAttributeTableZoomImage",
        onClick: lang.hitch(this, this.onZoomButton)
      });
//			this.zoomButton.set('disabled', true);
      toolbar.addChild(this.zoomButton);

      var clearSelectionButton = new Button({
        label: this.nls.clearSelection,
        iconClass: "esriAttributeTableClearImage",
        onClick: lang.hitch(this, this.clearSelection)
      });
      toolbar.addChild(clearSelectionButton);

      domConstruct.place(toolbar.domNode, toolbarDiv);
      domConstruct.place(toolbarDiv, this.AttributeTableDiv);

      var tabDiv = domConstruct.create("div");
      this.tableDiv = domConstruct.create("div");
      domConstruct.place(this.tableDiv, tabDiv);
      domConstruct.place(tabDiv, this.AttributeTableDiv);

      this.tabContainer = new TabContainerData({id:'tabCD',
        style: "height: 100%; width: 100%;"
      }, tabDiv);

      this.own(on(this.tabContainer, "click", lang.hitch(this, this.tabChanged)));
    },

    onExportButtonPDF: function() {
      var div = domConstruct.create("div", {
        style: "background-color:white;"
      });
      var printDialog = new PopupPrint({
        nls: this.nls,
        config: this.config
      });

      domConstruct.place(printDialog.domNode, div);

      var popup = new Popup({
        content: div,
        titleLabel: this.nls.titlePopup,
        id: 'popUpPrint',
        width: "450",
        height: "200",
        buttons: [{
          label: this.nls.print,
          onClick: lang.hitch(this, function() {
            this.shelter.show();
            if (printDialog) {
              var printConf = printDialog.getPrintConf();
              this.exportToPDF(printConf);
            }

            popup.close();
          })
        }, {
          label: this.nls.cancel,
          onClick: lang.hitch(this, function() {
            if (this.printDialog) {
              printDialog.destroy();
              printDialog = null;
            }
            popup.close();
          })
        }]
      });
    },

    clearSelection: function() {
      this.grids[this.layersIndex].clearSelection();
//			this.zoomButton.set('disabled', true);
      if (this.graphicsLayersUserSelection != null) {
        this.map.removeLayer(this.graphicsLayersUserSelection);
        this.graphicsLayersUserSelection = null;
      }
    },

    onZoomButton: function() {
      var rows = this.getSelectedRowsData();
      if (rows == null) return;
      if (rows.length == 0) {
        this.popupMessage(this.nls.msgSelectRecord);
        return;
      }

      grps = [];
      for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        grps.push(new Graphic(row.geometryApp));
      }

      if (grps.length == 1 && grps[0].geometry.type == 'point') {
        this.map.setScale(10000);
        this.map.centerAt(grps[0].geometry);
      } else {
        var myZoomExtent = graphicsUtils.graphicsExtent(grps);
        this.map.setExtent(myZoomExtent, true);
      }
    },

    onExportButtonCSV: function() {
      if (!this.layerToQueryTab || this.layerToQueryTab.length === 0) {
        return;
      }
      var popup = new Message({
        message: this.nls.msgExportMessageCSV,
        titleLabel: this.nls.exportFilesCSV,
        buttons: [{
          label: this.nls.ok,
          onClick: lang.hitch(this, function() {
            this.exportToCSV();
            popup.close();
          })
        }, {
          label: this.nls.cancel,
          onClick: lang.hitch(this, function() {
            popup.close();
          })
        }]
      });
    },

    tabChanged: function() {
      if (this.tabContainer && this.tabContainer.selectedChildWidget) {
        var idTab = this.tabContainer.selectedChildWidget.params.id;
        var len = this.layerToQueryTab.length;
        for (var i = 0; i < len; i++) {
          if (this.layerToQueryTab[i].id === idTab) {
            this.layersIndex = i;
            break;
          }
        }
      }
    },

    toggleColumns: function() {
      if (this.layersIndex > -1 && this.grids[this.layersIndex]) {
        this.grids[this.layersIndex]._toggleColumnHiderMenu();
      }
    },

    popupMessage: function(message) {
      var popup = new Message({
        message: message,
        buttons: [{
          label: this.nls.ok,
          onClick: lang.hitch(this, function() {
            popup.close();
          })
        }]
      });
    },

    getSelectedRowsData: function() {
      if (!this.grids.length) {
        return null;
      }
      if (!this.grids[this.layersIndex]) {
        return null;
      }
      var data = this.grids[this.layersIndex].store.data;
      var idProperty = this.grids[this.layersIndex].store.idProperty;
      var len = data.length;
      var rows = [];
      var selection = this.grids[this.layersIndex].selection;
      for (var attr in selection) {
        for (var i = 0; i < len; i++) {
          if (attr === String(data[i][idProperty])) {
            rows.push(data[i]);
          }
        }
      }
      return rows;
    },

//		getSelectedRows: function() {
//			var rows = [];
//			if (!this.grids.length) {
//				return rows;
//			}
//			if (!this.grids[this.layersIndex]) {
//				return rows;
//			}
//			var selection = this.grids[this.layersIndex].selection;
//			for (var id in selection) {
//				if (selection[id]) {
//					rows.push(id);
//				}
//			}
//			return rows;
//		},

    exportToCSV: function() {
      if (!this.layerToQueryTab || this.layerToQueryTab.length === 0) {
        return;
      }
      var content = "";
      var len = 0,
          n = 0,
          comma = "",
          value = "",
          arrayCol = [];
      var columns = this.grids[this.layersIndex].columns;
      var data = this.grids[this.layersIndex].store.data;

      for (var column in columns) {
        content = content + comma + column;
        comma = ",";
        arrayCol.push(column);
      }
      content = content + "\r\n";
      len = data.length;
      n = arrayCol.length;
      for (var i = 0; i < len; i++) {
        comma = "";
        for (var m = 0; m < n; m++) {
          value = data[i][arrayCol[m]];
          if (!value) {
            value = "";
          }
          content = content + comma + value;
          comma = ",";
        }
        content = content + "\r\n";
      }
  
  var nameFile = this.layerToQueryTab[this.layersIndex].name ? this.layerToQueryTab[this.layersIndex].name:
  "EsportCsv"
      this.download(nameFile + ".csv", content);
    },

    exportToPDF: function(printConf) {
      if (!this.layerToQueryTab || this.layerToQueryTab.length === 0) {
        return;
      }
      printConf.parent = this;
      if (printConf.isExportMap) {
        this.firstCallGPPrint = true;
        //genero la mappa prima di chiamare il BE
        this.paramsPrint = new PrintParameters();
        this.paramsPrint.map = this.map;

        // inserisco token negli url dei layer
        if (this.token) {
          for (var i=0; i<this.map.graphicsLayerIds.length; i++) {
            var l = this.map.getLayer(this.map.graphicsLayerIds[i]);
            if (l && l._url && l._url.path && l._url.path.indexOf('arcgis.com') != -1 && l._url.path.indexOf('token=') == -1) {
              l._url.path += '?token=' + this.token;
            }
          }
        }

        for (var i=0; i<this.map.layerIds.length; i++) {
          var l = this.map.getLayer(this.map.layerIds[i]);
          if (l && l.url && l.url.indexOf('arcgis.com') != -1 && l.url.indexOf('token=') == -1) {
            l.url += '?token=' + this.token;
          }
        }
//				this.paramsPrint.format = "PNG32";

        var w = this.config.widthMapExportPort;
        var h = this.config.heightMapExportPort;
        var d = this.config.dpi;
        if (printConf.layout == "LANDASCAPE") {
          w = this.config.widthMapExportLand;
          h = this.config.heightMapExportLand;
        }

        var template = new PrintTemplate();
        template.exportOptions = {
          width: w,
          height: h,
          dpi: d
        };
//				template.label = printConf.title;
        template.format = "PNG32";
//				template.format = "PDF";
        template.layout = "MAP_ONLY";
//				template.layout = "A4 Landscape";
//				template.layout = "A4 Portrait";
//				if (printConf.layout == "LANDASCAPE") {
//					template.layout = "A4 Landscape";
//				} 
        template.preserveScale = false;

//		        template.layoutOptions = {
//		           authorText: printConf.author,
////		           copyrightText: "copyrightText",
////		           legendLayers: [],
//		           titleText: printConf.title
//		        };
        this.paramsPrint.template = template;

        var urlPrintTask = this.config.urlPrintTask;
        var printTask = new PrintTask(urlPrintTask);
        printTask.execute(this.paramsPrint, lang.hitch(this, this.printResult, printConf), lang.hitch(this, this.printError, this.firstCallGPPrint, printConf));
      } else {
        //no export mappa, chiamo il BE
        this.callServletPrint(printConf, null);
      }
    },

    printResult: function (printConf, result){
//	        alert(result.url)
      this.callServletPrint(printConf, result.url);
    },

    secondCall:function(firstCallGPPrint, printConf, thisApp) {
      var urlPrintTask = thisApp.config.urlPrintTask;
      var printTask = new PrintTask(urlPrintTask);
      printTask.execute(thisApp.paramsPrint, lang.hitch(thisApp, thisApp.printResult, printConf), lang.hitch(thisApp, thisApp.printError, !firstCallGPPrint, printConf));
    },

    printError: function (firstCallGPPrint, printConf, result) {
//	    	alert("printError")
      if (firstCallGPPrint) {
        setTimeout(this.secondCall, 2000, firstCallGPPrint, printConf, this);

//	    		alert("riprovo recupero mappa")
//	    		this.popupMessage(this.nls.msgErrorPrintTaskTryAgain);
//	    		var urlPrintTask = this.config.urlPrintTask; 
//				var printTask = new PrintTask(urlPrintTask);
//				printTask.execute(this.paramsPrint, lang.hitch(this, this.printResult, printConf), lang.hitch(this, this.printError, !firstCallGPPrint, printConf));
      } else {
        this.shelter.hide();
//		        alert(result)   
//		        this.popupMessage(this.nls.msgErrorPrintTask+" \n"+result);
        this.popupMessage(this.nls.msgErrorPrintTask);
      }
      console.log(result);
    },

    callServletPrint: function(printConf, urlMap) {
      var json = {};
      json.urlMap = urlMap;
//			json.title = printConf.title;
      json.author = printConf.author;
      json.layout = printConf.layout;
      json.comments = printConf.comments;
      json.currentScale = this.map.getScale();
      jsonArrData = [];
      var lenLay = this.layerToQueryTab.length;
      for (var l = 0; l < lenLay; l++) {
        var jsondata = {};
//				var nameLayer = this.layerToQueryTab[l].name;
        var nameLayer = this.layerToQueryTab[l].title;
        if (nameLayer == null || nameLayer == "undefined")
          nameLayer = this.layerToQueryTab[l].name;

        var columns = this.grids[l].columns;
        var data = this.grids[l].store.data;

        arrayArrayData = [];
        arrayCol = [];
        arrayColNameField = [];
        for (var column in columns) {
          var obj = columns[column];
          arrayCol.push(obj.label);
          arrayColNameField.push(obj.field);
        }

        var len = data.length;
        var n = arrayCol.length;
        for (var i = 0; i < len; i++) {

          arrayData = [];
          for (var m = 0; m < n; m++) {
            value = data[i][arrayCol[m]];
            if (!value) {
              //provo ad estrarre il nome usando il field
              value = data[i][arrayColNameField[m]];
              if (!value) {
                value = "";
              }
            }
            arrayData.push(value);
          }
          arrayArrayData.push(arrayData);
        }
        jsondata.nameLayer = encodeURI(nameLayer);
        jsondata.columns = arrayCol;
        jsondata.values = arrayArrayData;
        jsonArrData.push(jsondata);
      }
      json.table = jsonArrData;

//			var urlServlet = this.config.urlPrintServlet;
//			jsonDataCod = JSON.stringify(json);
//			var f = dojo.doc.createElement("form");
//			dojo.style(f, {
//				position: "absolute",
//				width: "5em",
//				height: "10em",
//				display: "none",
//				zIndex: "-10000"
//			});
//			
//			//Set the url to trigger the download.
//			dojo.attr(f, {
//				action: urlServlet + "?exportData="+jsonDataCod+"&nocache="+new Date().getTime(),
//				method: "post"}
//			);
//			dojo.body().appendChild(f);
//			f.submit();
//			dojo.body().removeChild(f);
//			
//			this.shelter.hide();

//			http://comments.gmane.org/gmane.comp.web.dojo.user/37050
      var urlServlet = this.config.urlPrintServlet;
      jsonDataCod = JSON.stringify(json);
      var f = dojo.doc.createElement("form");
      dojo.style(f, {
        position: "absolute",
        width: "5em",
        height: "10em",
        display: "none",
        zIndex: "-10000"
      });

      var input1=dojo.doc.createElement("input");
      dojo.style(input1, {
        position: "absolute",
        width: "5em",
        height: "10em",
        display: "none",
        zIndex: "-10000"
      });

      input1.name="exportData";
      input1.value=jsonDataCod;
      f.appendChild(input1);

      //Set the url to trigger the download.
      dojo.attr(f, {
        action: urlServlet + "?nocache="+new Date().getTime(),
        method: "post"}
      );
      dojo.body().appendChild(f);
      f.submit();

      f.removeChild(input1);
      dojo.body().removeChild(f);

      this.shelter.hide();
    },

    convArrToObj: function(array) {
      var thisEleObj = new Object();
      if(typeof array == "object"){
        for(var i in array){
          var thisEle = this.convArrToObj(array[i]);
          thisEleObj[i] = thisEle;
        }
      }else {
        thisEleObj = array;
      }
      return thisEleObj;
    },

    download: function(filename, text) {
      if (has("ie")) {
        var oWin = window.open("about:blank", "_blank");
        oWin.document.write(text);
        oWin.document.close();
        oWin.document.execCommand('SaveAs', true, filename);
        oWin.close();
      } else {
        var link = domConstruct.create("a", {
          href: 'data:text/plain;charset=utf-8,' + encodeURIComponent(text),
          download: filename
        }, dojo.body());
        link.click();
        domConstruct.destroy(link);
      }
    },

    _onBufferClick: function(){
      if (this.drawPoint) {
        this.clearBufferSelection();
        this.distanzaBuffer = dom.byId("textboxBuffer").value;
        this.buffer();
      }
    },

    _onSearchClick: function(){
      if (this.showBuffer) {
        this.flagOperation = "SEARCH_POINT";
        this._clearPoint();
        this.clearBufferSelection();
        this._initLayerSelect();		//cerco i layer da interrogare alla fine della selezione geografica
        this.layersIndex = -1;
        this.destroyUser();
        this.isMenu = true;
        this.findValue = false;
        this.indexTab = -1;
        this.contQuery = 0;
        this.layerToQueryTab = [];
        this._doQuery();
      }
    },

    buffer: function(){
      this.clearBufferSelection();


      //Patch buffer/remove graphics
      this.clearUserSelectionCopy();


      var params = new BufferParameters();
      params.geometries  = [this.userPoint];
      params.distances = [this.distanzaBuffer];
      params.unit = GeometryService.UNIT_METER;
      params.bufferSpatialReference = this.map.spatialReference;
      params.outSpatialReference = this.map.spatialReference;


      //Patch buffer/remove graphics
      params.geodesic = true;


      var service = new GeometryService(this.appConfig.geometryService);
      this.queryCount = 0;
      this.queryResults = {};

      service.buffer(params, lang.hitch(this, function(res) {
        var geometry = res[0];
        this._userGeometry = geometry;
        this.map.graphics.clear();
        var symbol = this.getBufferFillSymbol();
        var graphic = new Graphic(geometry, symbol );

        this.graphicsLayersBuffer = new GraphicsLayer();
        this.graphicsLayersBuffer.add(graphic);
        this.map.addLayer(this.graphicsLayersBuffer);

        //creo una copia della selezione, prima elimino la precedente se presente
        var symbolCopy = this.getDrawFillSymbolCopy();
        var graphicCopy = new Graphic(geometry, symbolCopy );
        this.graphicsLayersUserSelectionCopy = new GraphicsLayer();
        this.graphicsLayersUserSelectionCopy.add(graphicCopy);
        this.map.addLayer(this.graphicsLayersUserSelectionCopy);
        this.showBuffer = true;
        html.removeClass(this.btnSearch, 'jimu-state-disabled');
      }));

    },

    clearBufferSelection: function() {
      if (this.graphicsLayersBuffer != null) {
        this.map.removeLayer(this.graphicsLayersBuffer);
        this.graphicsLayersBuffer = null;
      }
    },

    clearUserSelectionCopy: function() {
      if (this.graphicsLayersUserSelectionCopy != null) {
        this.map.removeLayer(this.graphicsLayersUserSelectionCopy);
        this.graphicsLayersUserSelectionCopy = null;
      }
    }
  });
});