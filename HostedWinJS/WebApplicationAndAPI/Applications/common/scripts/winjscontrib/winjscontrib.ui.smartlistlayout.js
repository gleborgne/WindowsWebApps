﻿/* 
 * WinJS Contrib v2.1.0.2
 * licensed under MIT license (see http://opensource.org/licenses/MIT)
 * sources available at https://github.com/gleborgne/winjscontrib
 */

(function () {
    "use strict";

    WinJS.Namespace.define("WinJSContrib.UI", {
        SmartListLayout: WinJS.Class.define(
            /**
             * Control to set ListView layout based on media queries
             * @class WinJSContrib.UI.SmartListLayout
             * @param {HTMLElement} element DOM element containing the control
             * @param {Object} options
             * @example
             *  {@lang xml}
             *  <div id="mylistview" data-win-control="WinJS.UI.ListView" data-win-options="{
             *      itemTemplate: select('#listitemtemplate'),
             *      itemDataSource: DummyDataSource
             *   }"></div>
             * 
             *  <div id="listlayout" data-win-control="WinJSContrib.UI.SmartListLayout" data-win-options="{
             *          listView: select('#mylistview'),
             *          layouts:{
             *              default : { layout : WinJS.UI.GridLayout, query: '(orientation: landscape)'},
             *              vert : { layout : WinJS.UI.GridLayout, query: '(orientation: portrait) and (min-width: 600px)', options: { orientation : 'vertical'}},
             *              snap : { layout : WinJS.UI.ListLayout, query: '(orientation: portrait) and (max-width: 600px)'},
             *          }
             * }"></div>
             */
            function ctor(element, options) {
                this._element = element || document.createElement("div");
                this._element.className = this._element.className + ' win-disposable mcn-layout-ctrl';
                this._element.winControl = this;
                this.queries = [];
                this.listView = options ? options.listView : undefined;
                this.layouts = options.layouts;

                if (this.listView && this.listView.winControl && options.layouts) {
                    this.initQueries(options.layouts);
                    this.applyPendingLayout();
                }
            },
            /**
             * @lends WinJSContrib.UI.SmartListLayout
             */
            {
                /**
                 * listview target by smart layout
                 * @field
                 * @type WinJS.UI.ListView
                 */
                listView: {
                    get: function () {
                        return this._listview;
                    },
                    set: function (val) {
                        if (val && val.element && val.forceLayout)
                            this._listview = val.element;
                        else
                        	this._listview = val;

                        if (val) {
                        	this.initQueries(this.layouts);
                        	this.applyPendingLayout();
                        }
                    }
                },

                initQueries: function (layouts) {
                    var ctrl = this;
                    for (var name in layouts) {
                        if (layouts.hasOwnProperty(name)) {
                            ctrl.add(layouts[name]);
                        }
                    }
                },

                /**
                 * add a layout declaration
                 * @param {Object} layout layout declaration
                 */
                add: function (layout) {
                    var ctrl = this;

                    if (layout && layout.query && layout.layout) {
                        var query = {
                            ctrl: ctrl,
                            mediaquery: layout.query,
                            layout: layout.layout,
                            options: layout.options,
                            mq: undefined,
                            bindedCallback: undefined
                        };

                        query.bindedCallback = ctrl.processQuery.bind(query);
                        ctrl.queries.push(query);

                        query.mq = window.matchMedia(layout.query);
                        //query.mq.addListener(function (mq) {
                        //	var t = mq;
                        //});
                        query.mq.addListener(query.bindedCallback);
                        if (query.mq.matches)
                            ctrl.applyQuery(query);
                    }
                },

                processQuery: function (mq) {
                    var query = this;
                    query.ctrl.applyQuery(query);
                },

                applyQuery: function (query) {
                    var ctrl = this;
                    if (query.mq.matches && ctrl.listView && ctrl.listView.winControl) {
                        if (!ctrl.pendingLayout) {
                            ctrl.listView.style.opacity = 0;
                            //this makes layout change only once, whatever queries are matching (last matching query will win)
                            setImmediate(function () {
                                ctrl.applyPendingLayout();
                            });
                        }
                        ctrl.pendingLayout = new query.layout(query.options);						
                    }
                },

                applyPendingLayout: function () {
                    var ctrl = this;
                    if (ctrl.pendingLayout) {
                        ctrl.listView.winControl.layout = ctrl.pendingLayout;
                        ctrl.listView.style.opacity = 1;                        
                        ctrl.listView.winControl.forceLayout(); //win 8
                        ctrl.pendingLayout = undefined;
                    }
                },

                updateLayout : function(){
                    var ctrl = this;
                    //if (ctrl.listView) {
                    //    ctrl.listView.winControl.forceLayout();
                    //}
                },

                contentReady: function(){
                    var ctrl = this;
                    //if (ctrl.listView) {
                    //    ctrl.listView.winControl.forceLayout();
                    //}
                },

                dispose: function () {
                    var ctrl = this;
                    //remove listeners for media queries
                    ctrl.queries.forEach(function (query) {
                        query.mq.removeListener(query.bindedCallback);
                    });
                }
            })
    });

    if (WinJSContrib.UI.WebComponents) {
    	WinJSContrib.UI.WebComponents.register('mcn-smartlistlayout', WinJSContrib.UI.SmartListLayout, {
    		properties: ['listView', 'layouts']
    	});
    }
})();