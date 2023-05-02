define([
  'dojo/_base/declare',
  'dijit/_WidgetBase',
  'dijit/_TemplatedMixin',
  'dijit/_WidgetsInTemplateMixin',
  'dojo/text!./PopupPrint.html',
  'dojo/query'
],
function(declare, _WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, template, query) {
  return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
    templateString:template,
    baseClass: 'jimu-popup-printer',
    nls: null,

//    scaleBck: null,
//    titleBck: null,
	authorBck: null,
	commentsBck: null,

    postMixInProperties:function(){
    },

    postCreate:function(){
      this.inherited(arguments);
      this._initPointSection();
      
      //popolo combo orientamento
      var select = this.slcLayout;
	  var option1 = { value: "PORTRAIT", label: this.nls.layoutPortrait, selected: true };
      var option2 = { value: "LANDASCAPE", label: this.nls.layoutLandscape, selected: false };
	  select.addOption([option1, option2]); // add all options at once as an array
    },

    reset: function(){
      this._hideAllSections();
    },

    _hideAllSections: function(){
      query('.symbol-section',this.domNode).style('display','none');
    },

    _showSection:function(type){
      this._hideAllSections();
      var s = '.' + type + '-symbol-section';
      query(s,this.domNode).style('display','block');
    },

    _initPointSection:function(){
      this._showSection('point');
    },

    getPrintConf:function() {
    	var conf = {};
//    	var title = this.txtTitle.get('value');
    	var author = this.txtAuthor.get('value');
    	var comments = this.txtComments.get('value');
    	var layout = this.slcLayout.get('value');
    	var isExportMap = this.ckbMap.get('checked');
//    	var scale = this.txtScale.get('value');
//    	conf.title = title;
    	conf.author = author;
    	conf.layout = layout;
    	conf.isExportMap = isExportMap;
//    	conf.scale = scale;
    	conf.comments = comments;
    	return conf;
    },
    
    ckbExportMap: function(val){
    	if (!val) {
//    		this.titleBck = this.txtTitle.get('value');
    		this.authorBck = this.txtAuthor.get('value');
//        	this.scaleBck = this.txtScale.get('value');
    		this.commentsBck = this.txtComments.get('value');
        	
//        	this.txtTitle.set('value', '');
    		this.txtAuthor.set('value','');
//        	this.txtScale.set('value','');
    		this.txtComments.set('value','');
    	} else {
//    		this.txtTitle.set('value', this.titleBck);
    		this.txtAuthor.set('value', this.authorBck);
//        	this.txtScale.set('value', this.scaleBck);
    		this.txtComments.set('value', this.commentsBck);
    	}
    	
//    	this.txtTitle.setAttribute('disabled',!val);
    	this.txtAuthor.setAttribute('disabled',!val);
//    	this.txtScale.setAttribute('disabled',!val);
    	this.txtComments.setAttribute('disabled',!val);
    },
  });
});