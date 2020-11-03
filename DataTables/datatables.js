/*
 * This combined file was created by the DataTables downloader builder:
 *   https://datatables.net/download
 *
 * To rebuild or modify this file with the latest versions of the included
 * software please visit:
 *   https://datatables.net/download/#bs4/dt-1.10.22/e-1.9.5
 *
 * Included libraries:
 *   DataTables 1.10.22, Editor 1.9.5
 */

/*! DataTables 1.10.22
 * ©2008-2020 SpryMedia Ltd - datatables.net/license
 */

/**
 * @summary     DataTables
 * @description Paginate, search and order HTML tables
 * @version     1.10.22
 * @file        jquery.dataTables.js
 * @author      SpryMedia Ltd
 * @contact     www.datatables.net
 * @copyright   Copyright 2008-2020 SpryMedia Ltd.
 *
 * This source file is free software, available under the following license:
 *   MIT license - http://datatables.net/license
 *
 * This source file is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
 * or FITNESS FOR A PARTICULAR PURPOSE. See the license files for details.
 *
 * For details please refer to: http://www.datatables.net
 */

/*jslint evil: true, undef: true, browser: true */
/*globals $,require,jQuery,define,_selector_run,_selector_opts,_selector_first,_selector_row_indexes,_ext,_Api,_api_register,_api_registerPlural,_re_new_lines,_re_html,_re_formatted_numeric,_re_escape_regex,_empty,_intVal,_numToDecimal,_isNumber,_isHtml,_htmlNumeric,_pluck,_pluck_order,_range,_stripHtml,_unique,_fnBuildAjax,_fnAjaxUpdate,_fnAjaxParameters,_fnAjaxUpdateDraw,_fnAjaxDataSrc,_fnAddColumn,_fnColumnOptions,_fnAdjustColumnSizing,_fnVisibleToColumnIndex,_fnColumnIndexToVisible,_fnVisbleColumns,_fnGetColumns,_fnColumnTypes,_fnApplyColumnDefs,_fnHungarianMap,_fnCamelToHungarian,_fnLanguageCompat,_fnBrowserDetect,_fnAddData,_fnAddTr,_fnNodeToDataIndex,_fnNodeToColumnIndex,_fnGetCellData,_fnSetCellData,_fnSplitObjNotation,_fnGetObjectDataFn,_fnSetObjectDataFn,_fnGetDataMaster,_fnClearTable,_fnDeleteIndex,_fnInvalidate,_fnGetRowElements,_fnCreateTr,_fnBuildHead,_fnDrawHead,_fnDraw,_fnReDraw,_fnAddOptionsHtml,_fnDetectHeader,_fnGetUniqueThs,_fnFeatureHtmlFilter,_fnFilterComplete,_fnFilterCustom,_fnFilterColumn,_fnFilter,_fnFilterCreateSearch,_fnEscapeRegex,_fnFilterData,_fnFeatureHtmlInfo,_fnUpdateInfo,_fnInfoMacros,_fnInitialise,_fnInitComplete,_fnLengthChange,_fnFeatureHtmlLength,_fnFeatureHtmlPaginate,_fnPageChange,_fnFeatureHtmlProcessing,_fnProcessingDisplay,_fnFeatureHtmlTable,_fnScrollDraw,_fnApplyToChildren,_fnCalculateColumnWidths,_fnThrottle,_fnConvertToWidth,_fnGetWidestNode,_fnGetMaxLenString,_fnStringToCss,_fnSortFlatten,_fnSort,_fnSortAria,_fnSortListener,_fnSortAttachListener,_fnSortingClasses,_fnSortData,_fnSaveState,_fnLoadState,_fnSettingsFromNode,_fnLog,_fnMap,_fnBindAction,_fnCallbackReg,_fnCallbackFire,_fnLengthOverflow,_fnRenderer,_fnDataSource,_fnRowAttributes*/

(function( factory ) {
	"use strict";

	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				// CommonJS environments without a window global must pass a
				// root. This will give an error otherwise
				root = window;
			}

			if ( ! $ ) {
				$ = typeof window !== 'undefined' ? // jQuery's factory checks for a global window
					require('jquery') :
					require('jquery')( root );
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}
(function( $, window, document, undefined ) {
	"use strict";

	/**
	 * DataTables is a plug-in for the jQuery Javascript library. It is a highly
	 * flexible tool, based upon the foundations of progressive enhancement,
	 * which will add advanced interaction controls to any HTML table. For a
	 * full list of features please refer to
	 * [DataTables.net](href="http://datatables.net).
	 *
	 * Note that the `DataTable` object is not a global variable but is aliased
	 * to `jQuery.fn.DataTable` and `jQuery.fn.dataTable` through which it may
	 * be  accessed.
	 *
	 *  @class
	 *  @param {object} [init={}] Configuration object for DataTables. Options
	 *    are defined by {@link DataTable.defaults}
	 *  @requires jQuery 1.7+
	 *
	 *  @example
	 *    // Basic initialisation
	 *    $(document).ready( function {
	 *      $('#example').dataTable();
	 *    } );
	 *
	 *  @example
	 *    // Initialisation with configuration options - in this case, disable
	 *    // pagination and sorting.
	 *    $(document).ready( function {
	 *      $('#example').dataTable( {
	 *        "paginate": false,
	 *        "sort": false
	 *      } );
	 *    } );
	 */
	var DataTable = function ( options )
	{
		/**
		 * Perform a jQuery selector action on the table's TR elements (from the tbody) and
		 * return the resulting jQuery object.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select TR elements that meet the current filter
		 *    criterion ("applied") or all TR elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the TR elements in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {object} jQuery object, filtered by the given selector.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Highlight every second row
		 *      oTable.$('tr:odd').css('backgroundColor', 'blue');
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to rows with 'Webkit' in them, add a background colour and then
		 *      // remove the filter, thus highlighting the 'Webkit' rows only.
		 *      oTable.fnFilter('Webkit');
		 *      oTable.$('tr', {"search": "applied"}).css('backgroundColor', 'blue');
		 *      oTable.fnFilter('');
		 *    } );
		 */
		this.$ = function ( sSelector, oOpts )
		{
			return this.api(true).$( sSelector, oOpts );
		};
		
		
		/**
		 * Almost identical to $ in operation, but in this case returns the data for the matched
		 * rows - as such, the jQuery selector used should match TR row nodes or TD/TH cell nodes
		 * rather than any descendants, so the data can be obtained for the row/cell. If matching
		 * rows are found, the data returned is the original data array/object that was used to
		 * create the row (or a generated array if from a DOM source).
		 *
		 * This method is often useful in-combination with $ where both functions are given the
		 * same parameters and the array indexes will match identically.
		 *  @param {string|node|jQuery} sSelector jQuery selector or node collection to act on
		 *  @param {object} [oOpts] Optional parameters for modifying the rows to be included
		 *  @param {string} [oOpts.filter=none] Select elements that meet the current filter
		 *    criterion ("applied") or all elements (i.e. no filter).
		 *  @param {string} [oOpts.order=current] Order of the data in the processed array.
		 *    Can be either 'current', whereby the current sorting of the table is used, or
		 *    'original' whereby the original order the data was read into the table is used.
		 *  @param {string} [oOpts.page=all] Limit the selection to the currently displayed page
		 *    ("current") or not ("all"). If 'current' is given, then order is assumed to be
		 *    'current' and filter is 'applied', regardless of what they might be given as.
		 *  @returns {array} Data for the matched elements. If any elements, as a result of the
		 *    selector, were not TR, TD or TH elements in the DataTable, they will have a null
		 *    entry in the array.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the data from the first row in the table
		 *      var data = oTable._('tr:first');
		 *
		 *      // Do something useful with the data
		 *      alert( "First cell is: "+data[0] );
		 *    } );
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Filter to 'Webkit' and get all data for
		 *      oTable.fnFilter('Webkit');
		 *      var data = oTable._('tr', {"search": "applied"});
		 *
		 *      // Do something with the data
		 *      alert( data.length+" rows matched the search" );
		 *    } );
		 */
		this._ = function ( sSelector, oOpts )
		{
			return this.api(true).rows( sSelector, oOpts ).data();
		};
		
		
		/**
		 * Create a DataTables Api instance, with the currently selected tables for
		 * the Api's context.
		 * @param {boolean} [traditional=false] Set the API instance's context to be
		 *   only the table referred to by the `DataTable.ext.iApiIndex` option, as was
		 *   used in the API presented by DataTables 1.9- (i.e. the traditional mode),
		 *   or if all tables captured in the jQuery object should be used.
		 * @return {DataTables.Api}
		 */
		this.api = function ( traditional )
		{
			return traditional ?
				new _Api(
					_fnSettingsFromNode( this[ _ext.iApiIndex ] )
				) :
				new _Api( this );
		};
		
		
		/**
		 * Add a single new row or multiple rows of data to the table. Please note
		 * that this is suitable for client-side processing only - if you are using
		 * server-side processing (i.e. "bServerSide": true), then to add data, you
		 * must add it to the data source, i.e. the server-side, through an Ajax call.
		 *  @param {array|object} data The data to be added to the table. This can be:
		 *    <ul>
		 *      <li>1D array of data - add a single row with the data provided</li>
		 *      <li>2D array of arrays - add multiple rows in a single call</li>
		 *      <li>object - data object when using <i>mData</i></li>
		 *      <li>array of objects - multiple data objects when using <i>mData</i></li>
		 *    </ul>
		 *  @param {bool} [redraw=true] redraw the table or not
		 *  @returns {array} An array of integers, representing the list of indexes in
		 *    <i>aoData</i> ({@link DataTable.models.oSettings}) that have been added to
		 *    the table.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Global var for counter
		 *    var giCount = 2;
		 *
		 *    $(document).ready(function() {
		 *      $('#example').dataTable();
		 *    } );
		 *
		 *    function fnClickAddRow() {
		 *      $('#example').dataTable().fnAddData( [
		 *        giCount+".1",
		 *        giCount+".2",
		 *        giCount+".3",
		 *        giCount+".4" ]
		 *      );
		 *
		 *      giCount++;
		 *    }
		 */
		this.fnAddData = function( data, redraw )
		{
			var api = this.api( true );
		
			/* Check if we want to add multiple rows or not */
			var rows = Array.isArray(data) && ( Array.isArray(data[0]) || $.isPlainObject(data[0]) ) ?
				api.rows.add( data ) :
				api.row.add( data );
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return rows.flatten().toArray();
		};
		
		
		/**
		 * This function will make DataTables recalculate the column sizes, based on the data
		 * contained in the table and the sizes applied to the columns (in the DOM, CSS or
		 * through the sWidth parameter). This can be useful when the width of the table's
		 * parent element changes (for example a window resize).
		 *  @param {boolean} [bRedraw=true] Redraw the table or not, you will typically want to
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable( {
		 *        "sScrollY": "200px",
		 *        "bPaginate": false
		 *      } );
		 *
		 *      $(window).on('resize', function () {
		 *        oTable.fnAdjustColumnSizing();
		 *      } );
		 *    } );
		 */
		this.fnAdjustColumnSizing = function ( bRedraw )
		{
			var api = this.api( true ).columns.adjust();
			var settings = api.settings()[0];
			var scroll = settings.oScroll;
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw( false );
			}
			else if ( scroll.sX !== "" || scroll.sY !== "" ) {
				/* If not redrawing, but scrolling, we want to apply the new column sizes anyway */
				_fnScrollDraw( settings );
			}
		};
		
		
		/**
		 * Quickly and simply clear a table
		 *  @param {bool} [bRedraw=true] redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately 'nuke' the current rows (perhaps waiting for an Ajax callback...)
		 *      oTable.fnClearTable();
		 *    } );
		 */
		this.fnClearTable = function( bRedraw )
		{
			var api = this.api( true ).clear();
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
		};
		
		
		/**
		 * The exact opposite of 'opening' a row, this function will close any rows which
		 * are currently 'open'.
		 *  @param {node} nTr the table row to 'close'
		 *  @returns {int} 0 on success, or 1 if failed (can't find the row)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnClose = function( nTr )
		{
			this.api( true ).row( nTr ).child.hide();
		};
		
		
		/**
		 * Remove a row for the table
		 *  @param {mixed} target The index of the row from aoData to be deleted, or
		 *    the TR element you want to delete
		 *  @param {function|null} [callBack] Callback function
		 *  @param {bool} [redraw=true] Redraw the table or not
		 *  @returns {array} The row that was deleted
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Immediately remove the first row
		 *      oTable.fnDeleteRow( 0 );
		 *    } );
		 */
		this.fnDeleteRow = function( target, callback, redraw )
		{
			var api = this.api( true );
			var rows = api.rows( target );
			var settings = rows.settings()[0];
			var data = settings.aoData[ rows[0][0] ];
		
			rows.remove();
		
			if ( callback ) {
				callback.call( this, settings, data );
			}
		
			if ( redraw === undefined || redraw ) {
				api.draw();
			}
		
			return data;
		};
		
		
		/**
		 * Restore the table to it's original state in the DOM by removing all of DataTables
		 * enhancements, alterations to the DOM structure of the table and event listeners.
		 *  @param {boolean} [remove=false] Completely remove the table from the DOM
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      // This example is fairly pointless in reality, but shows how fnDestroy can be used
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnDestroy();
		 *    } );
		 */
		this.fnDestroy = function ( remove )
		{
			this.api( true ).destroy( remove );
		};
		
		
		/**
		 * Redraw the table
		 *  @param {bool} [complete=true] Re-filter and resort (if enabled) the table before the draw.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Re-draw the table - you wouldn't want to do it here, but it's an example :-)
		 *      oTable.fnDraw();
		 *    } );
		 */
		this.fnDraw = function( complete )
		{
			// Note that this isn't an exact match to the old call to _fnDraw - it takes
			// into account the new data, but can hold position.
			this.api( true ).draw( complete );
		};
		
		
		/**
		 * Filter the input based on data
		 *  @param {string} sInput String to filter the table on
		 *  @param {int|null} [iColumn] Column to limit filtering to
		 *  @param {bool} [bRegex=false] Treat as regular expression or not
		 *  @param {bool} [bSmart=true] Perform smart filtering or not
		 *  @param {bool} [bShowGlobal=true] Show the input global filter in it's input box(es)
		 *  @param {bool} [bCaseInsensitive=true] Do case-insensitive matching (true) or not (false)
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sometime later - filter...
		 *      oTable.fnFilter( 'test string' );
		 *    } );
		 */
		this.fnFilter = function( sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive )
		{
			var api = this.api( true );
		
			if ( iColumn === null || iColumn === undefined ) {
				api.search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
			else {
				api.column( iColumn ).search( sInput, bRegex, bSmart, bCaseInsensitive );
			}
		
			api.draw();
		};
		
		
		/**
		 * Get the data for the whole table, an individual row or an individual cell based on the
		 * provided parameters.
		 *  @param {int|node} [src] A TR row node, TD/TH cell node or an integer. If given as
		 *    a TR node then the data source for the whole row will be returned. If given as a
		 *    TD/TH cell node then iCol will be automatically calculated and the data for the
		 *    cell returned. If given as an integer, then this is treated as the aoData internal
		 *    data index for the row (see fnGetPosition) and the data for that row used.
		 *  @param {int} [col] Optional column index that you want the data of.
		 *  @returns {array|object|string} If mRow is undefined, then the data for all rows is
		 *    returned. If mRow is defined, just data for that row, and is iCol is
		 *    defined, only data for the designated cell is returned.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    // Row data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('tr').click( function () {
		 *        var data = oTable.fnGetData( this );
		 *        // ... do something with the array / object of data for the row
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Individual cell data
		 *    $(document).ready(function() {
		 *      oTable = $('#example').dataTable();
		 *
		 *      oTable.$('td').click( function () {
		 *        var sData = oTable.fnGetData( this );
		 *        alert( 'The cell clicked on had the value of '+sData );
		 *      } );
		 *    } );
		 */
		this.fnGetData = function( src, col )
		{
			var api = this.api( true );
		
			if ( src !== undefined ) {
				var type = src.nodeName ? src.nodeName.toLowerCase() : '';
		
				return col !== undefined || type == 'td' || type == 'th' ?
					api.cell( src, col ).data() :
					api.row( src ).data() || null;
			}
		
			return api.data().toArray();
		};
		
		
		/**
		 * Get an array of the TR nodes that are used in the table's body. Note that you will
		 * typically want to use the '$' API method in preference to this as it is more
		 * flexible.
		 *  @param {int} [iRow] Optional row index for the TR element you want
		 *  @returns {array|node} If iRow is undefined, returns an array of all TR elements
		 *    in the table's body, or iRow is defined, just the TR element requested.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Get the nodes from the table
		 *      var nNodes = oTable.fnGetNodes( );
		 *    } );
		 */
		this.fnGetNodes = function( iRow )
		{
			var api = this.api( true );
		
			return iRow !== undefined ?
				api.row( iRow ).node() :
				api.rows().nodes().flatten().toArray();
		};
		
		
		/**
		 * Get the array indexes of a particular cell from it's DOM element
		 * and column index including hidden columns
		 *  @param {node} node this can either be a TR, TD or TH in the table's body
		 *  @returns {int} If nNode is given as a TR, then a single index is returned, or
		 *    if given as a cell, an array of [row index, column index (visible),
		 *    column index (all)] is given.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      $('#example tbody td').click( function () {
		 *        // Get the position of the current data from the node
		 *        var aPos = oTable.fnGetPosition( this );
		 *
		 *        // Get the data array for this row
		 *        var aData = oTable.fnGetData( aPos[0] );
		 *
		 *        // Update the data array and return the value
		 *        aData[ aPos[1] ] = 'clicked';
		 *        this.innerHTML = 'clicked';
		 *      } );
		 *
		 *      // Init DataTables
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnGetPosition = function( node )
		{
			var api = this.api( true );
			var nodeName = node.nodeName.toUpperCase();
		
			if ( nodeName == 'TR' ) {
				return api.row( node ).index();
			}
			else if ( nodeName == 'TD' || nodeName == 'TH' ) {
				var cell = api.cell( node ).index();
		
				return [
					cell.row,
					cell.columnVisible,
					cell.column
				];
			}
			return null;
		};
		
		
		/**
		 * Check to see if a row is 'open' or not.
		 *  @param {node} nTr the table row to check
		 *  @returns {boolean} true if the row is currently open, false otherwise
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnIsOpen = function( nTr )
		{
			return this.api( true ).row( nTr ).child.isShown();
		};
		
		
		/**
		 * This function will place a new row directly after a row which is currently
		 * on display on the page, with the HTML contents that is passed into the
		 * function. This can be used, for example, to ask for confirmation that a
		 * particular record should be deleted.
		 *  @param {node} nTr The table row to 'open'
		 *  @param {string|node|jQuery} mHtml The HTML to put into the row
		 *  @param {string} sClass Class to give the new TD cell
		 *  @returns {node} The row opened. Note that if the table row passed in as the
		 *    first parameter, is not found in the table, this method will silently
		 *    return.
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable;
		 *
		 *      // 'open' an information row when a row is clicked on
		 *      $('#example tbody tr').click( function () {
		 *        if ( oTable.fnIsOpen(this) ) {
		 *          oTable.fnClose( this );
		 *        } else {
		 *          oTable.fnOpen( this, "Temporary row opened", "info_row" );
		 *        }
		 *      } );
		 *
		 *      oTable = $('#example').dataTable();
		 *    } );
		 */
		this.fnOpen = function( nTr, mHtml, sClass )
		{
			return this.api( true )
				.row( nTr )
				.child( mHtml, sClass )
				.show()
				.child()[0];
		};
		
		
		/**
		 * Change the pagination - provides the internal logic for pagination in a simple API
		 * function. With this function you can have a DataTables table go to the next,
		 * previous, first or last pages.
		 *  @param {string|int} mAction Paging action to take: "first", "previous", "next" or "last"
		 *    or page number to jump to (integer), note that page 0 is the first page.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnPageChange( 'next' );
		 *    } );
		 */
		this.fnPageChange = function ( mAction, bRedraw )
		{
			var api = this.api( true ).page( mAction );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw(false);
			}
		};
		
		
		/**
		 * Show a particular column
		 *  @param {int} iCol The column whose display should be changed
		 *  @param {bool} bShow Show (true) or hide (false) the column
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Hide the second column after initialisation
		 *      oTable.fnSetColumnVis( 1, false );
		 *    } );
		 */
		this.fnSetColumnVis = function ( iCol, bShow, bRedraw )
		{
			var api = this.api( true ).column( iCol ).visible( bShow );
		
			if ( bRedraw === undefined || bRedraw ) {
				api.columns.adjust().draw();
			}
		};
		
		
		/**
		 * Get the settings for a particular table for external manipulation
		 *  @returns {object} DataTables settings object. See
		 *    {@link DataTable.models.oSettings}
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      var oSettings = oTable.fnSettings();
		 *
		 *      // Show an example parameter from the settings
		 *      alert( oSettings._iDisplayStart );
		 *    } );
		 */
		this.fnSettings = function()
		{
			return _fnSettingsFromNode( this[_ext.iApiIndex] );
		};
		
		
		/**
		 * Sort the table by a particular column
		 *  @param {int} iCol the data index to sort on. Note that this will not match the
		 *    'display index' if you have hidden data entries
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort immediately with columns 0 and 1
		 *      oTable.fnSort( [ [0,'asc'], [1,'asc'] ] );
		 *    } );
		 */
		this.fnSort = function( aaSort )
		{
			this.api( true ).order( aaSort ).draw();
		};
		
		
		/**
		 * Attach a sort listener to an element for a given column
		 *  @param {node} nNode the element to attach the sort listener to
		 *  @param {int} iColumn the column that a click on this node will sort on
		 *  @param {function} [fnCallback] callback function when sort is run
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *
		 *      // Sort on column 1, when 'sorter' is clicked on
		 *      oTable.fnSortListener( document.getElementById('sorter'), 1 );
		 *    } );
		 */
		this.fnSortListener = function( nNode, iColumn, fnCallback )
		{
			this.api( true ).order.listener( nNode, iColumn, fnCallback );
		};
		
		
		/**
		 * Update a table cell or row - this method will accept either a single value to
		 * update the cell with, an array of values with one element for each column or
		 * an object in the same format as the original data source. The function is
		 * self-referencing in order to make the multi column updates easier.
		 *  @param {object|array|string} mData Data to update the cell/row with
		 *  @param {node|int} mRow TR element you want to update or the aoData index
		 *  @param {int} [iColumn] The column to update, give as null or undefined to
		 *    update a whole row.
		 *  @param {bool} [bRedraw=true] Redraw the table or not
		 *  @param {bool} [bAction=true] Perform pre-draw actions or not
		 *  @returns {int} 0 on success, 1 on error
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      oTable.fnUpdate( 'Example update', 0, 0 ); // Single cell
		 *      oTable.fnUpdate( ['a', 'b', 'c', 'd', 'e'], $('tbody tr')[0] ); // Row
		 *    } );
		 */
		this.fnUpdate = function( mData, mRow, iColumn, bRedraw, bAction )
		{
			var api = this.api( true );
		
			if ( iColumn === undefined || iColumn === null ) {
				api.row( mRow ).data( mData );
			}
			else {
				api.cell( mRow, iColumn ).data( mData );
			}
		
			if ( bAction === undefined || bAction ) {
				api.columns.adjust();
			}
		
			if ( bRedraw === undefined || bRedraw ) {
				api.draw();
			}
			return 0;
		};
		
		
		/**
		 * Provide a common method for plug-ins to check the version of DataTables being used, in order
		 * to ensure compatibility.
		 *  @param {string} sVersion Version string to check for, in the format "X.Y.Z". Note that the
		 *    formats "X" and "X.Y" are also acceptable.
		 *  @returns {boolean} true if this version of DataTables is greater or equal to the required
		 *    version, or false if this version of DataTales is not suitable
		 *  @method
		 *  @dtopt API
		 *  @deprecated Since v1.10
		 *
		 *  @example
		 *    $(document).ready(function() {
		 *      var oTable = $('#example').dataTable();
		 *      alert( oTable.fnVersionCheck( '1.9.0' ) );
		 *    } );
		 */
		this.fnVersionCheck = _ext.fnVersionCheck;
		

		var _that = this;
		var emptyInit = options === undefined;
		var len = this.length;

		if ( emptyInit ) {
			options = {};
		}

		this.oApi = this.internal = _ext.internal;

		// Extend with old style plug-in API methods
		for ( var fn in DataTable.ext.internal ) {
			if ( fn ) {
				this[fn] = _fnExternApiFunc(fn);
			}
		}

		this.each(function() {
			// For each initialisation we want to give it a clean initialisation
			// object that can be bashed around
			var o = {};
			var oInit = len > 1 ? // optimisation for single table case
				_fnExtend( o, options, true ) :
				options;

			/*global oInit,_that,emptyInit*/
			var i=0, iLen, j, jLen, k, kLen;
			var sId = this.getAttribute( 'id' );
			var bInitHandedOff = false;
			var defaults = DataTable.defaults;
			var $this = $(this);
			
			
			/* Sanity check */
			if ( this.nodeName.toLowerCase() != 'table' )
			{
				_fnLog( null, 0, 'Non-table node initialisation ('+this.nodeName+')', 2 );
				return;
			}
			
			/* Backwards compatibility for the defaults */
			_fnCompatOpts( defaults );
			_fnCompatCols( defaults.column );
			
			/* Convert the camel-case defaults to Hungarian */
			_fnCamelToHungarian( defaults, defaults, true );
			_fnCamelToHungarian( defaults.column, defaults.column, true );
			
			/* Setting up the initialisation object */
			_fnCamelToHungarian( defaults, $.extend( oInit, $this.data() ), true );
			
			
			
			/* Check to see if we are re-initialising a table */
			var allSettings = DataTable.settings;
			for ( i=0, iLen=allSettings.length ; i<iLen ; i++ )
			{
				var s = allSettings[i];
			
				/* Base check on table node */
				if (
					s.nTable == this ||
					(s.nTHead && s.nTHead.parentNode == this) ||
					(s.nTFoot && s.nTFoot.parentNode == this)
				) {
					var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
					var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
			
					if ( emptyInit || bRetrieve )
					{
						return s.oInstance;
					}
					else if ( bDestroy )
					{
						s.oInstance.fnDestroy();
						break;
					}
					else
					{
						_fnLog( s, 0, 'Cannot reinitialise DataTable', 3 );
						return;
					}
				}
			
				/* If the element we are initialising has the same ID as a table which was previously
				 * initialised, but the table nodes don't match (from before) then we destroy the old
				 * instance by simply deleting it. This is under the assumption that the table has been
				 * destroyed by other methods. Anyone using non-id selectors will need to do this manually
				 */
				if ( s.sTableId == this.id )
				{
					allSettings.splice( i, 1 );
					break;
				}
			}
			
			/* Ensure the table has an ID - required for accessibility */
			if ( sId === null || sId === "" )
			{
				sId = "DataTables_Table_"+(DataTable.ext._unique++);
				this.id = sId;
			}
			
			/* Create the settings object for this table and set some of the default parameters */
			var oSettings = $.extend( true, {}, DataTable.models.oSettings, {
				"sDestroyWidth": $this[0].style.width,
				"sInstance":     sId,
				"sTableId":      sId
			} );
			oSettings.nTable = this;
			oSettings.oApi   = _that.internal;
			oSettings.oInit  = oInit;
			
			allSettings.push( oSettings );
			
			// Need to add the instance after the instance after the settings object has been added
			// to the settings array, so we can self reference the table instance if more than one
			oSettings.oInstance = (_that.length===1) ? _that : $this.dataTable();
			
			// Backwards compatibility, before we apply all the defaults
			_fnCompatOpts( oInit );
			_fnLanguageCompat( oInit.oLanguage );
			
			// If the length menu is given, but the init display length is not, use the length menu
			if ( oInit.aLengthMenu && ! oInit.iDisplayLength )
			{
				oInit.iDisplayLength = Array.isArray( oInit.aLengthMenu[0] ) ?
					oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
			}
			
			// Apply the defaults and init options to make a single init object will all
			// options defined from defaults and instance options.
			oInit = _fnExtend( $.extend( true, {}, defaults ), oInit );
			
			
			// Map the initialisation options onto the settings object
			_fnMap( oSettings.oFeatures, oInit, [
				"bPaginate",
				"bLengthChange",
				"bFilter",
				"bSort",
				"bSortMulti",
				"bInfo",
				"bProcessing",
				"bAutoWidth",
				"bSortClasses",
				"bServerSide",
				"bDeferRender"
			] );
			_fnMap( oSettings, oInit, [
				"asStripeClasses",
				"ajax",
				"fnServerData",
				"fnFormatNumber",
				"sServerMethod",
				"aaSorting",
				"aaSortingFixed",
				"aLengthMenu",
				"sPaginationType",
				"sAjaxSource",
				"sAjaxDataProp",
				"iStateDuration",
				"sDom",
				"bSortCellsTop",
				"iTabIndex",
				"fnStateLoadCallback",
				"fnStateSaveCallback",
				"renderer",
				"searchDelay",
				"rowId",
				[ "iCookieDuration", "iStateDuration" ], // backwards compat
				[ "oSearch", "oPreviousSearch" ],
				[ "aoSearchCols", "aoPreSearchCols" ],
				[ "iDisplayLength", "_iDisplayLength" ]
			] );
			_fnMap( oSettings.oScroll, oInit, [
				[ "sScrollX", "sX" ],
				[ "sScrollXInner", "sXInner" ],
				[ "sScrollY", "sY" ],
				[ "bScrollCollapse", "bCollapse" ]
			] );
			_fnMap( oSettings.oLanguage, oInit, "fnInfoCallback" );
			
			/* Callback functions which are array driven */
			_fnCallbackReg( oSettings, 'aoDrawCallback',       oInit.fnDrawCallback,      'user' );
			_fnCallbackReg( oSettings, 'aoServerParams',       oInit.fnServerParams,      'user' );
			_fnCallbackReg( oSettings, 'aoStateSaveParams',    oInit.fnStateSaveParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoadParams',    oInit.fnStateLoadParams,   'user' );
			_fnCallbackReg( oSettings, 'aoStateLoaded',        oInit.fnStateLoaded,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCallback',        oInit.fnRowCallback,       'user' );
			_fnCallbackReg( oSettings, 'aoRowCreatedCallback', oInit.fnCreatedRow,        'user' );
			_fnCallbackReg( oSettings, 'aoHeaderCallback',     oInit.fnHeaderCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoFooterCallback',     oInit.fnFooterCallback,    'user' );
			_fnCallbackReg( oSettings, 'aoInitComplete',       oInit.fnInitComplete,      'user' );
			_fnCallbackReg( oSettings, 'aoPreDrawCallback',    oInit.fnPreDrawCallback,   'user' );
			
			oSettings.rowIdFn = _fnGetObjectDataFn( oInit.rowId );
			
			/* Browser support detection */
			_fnBrowserDetect( oSettings );
			
			var oClasses = oSettings.oClasses;
			
			$.extend( oClasses, DataTable.ext.classes, oInit.oClasses );
			$this.addClass( oClasses.sTable );
			
			
			if ( oSettings.iInitDisplayStart === undefined )
			{
				/* Display start point, taking into account the save saving */
				oSettings.iInitDisplayStart = oInit.iDisplayStart;
				oSettings._iDisplayStart = oInit.iDisplayStart;
			}
			
			if ( oInit.iDeferLoading !== null )
			{
				oSettings.bDeferLoading = true;
				var tmp = Array.isArray( oInit.iDeferLoading );
				oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
				oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
			}
			
			/* Language definitions */
			var oLanguage = oSettings.oLanguage;
			$.extend( true, oLanguage, oInit.oLanguage );
			
			if ( oLanguage.sUrl )
			{
				/* Get the language definitions from a file - because this Ajax call makes the language
				 * get async to the remainder of this function we use bInitHandedOff to indicate that
				 * _fnInitialise will be fired by the returned Ajax handler, rather than the constructor
				 */
				$.ajax( {
					dataType: 'json',
					url: oLanguage.sUrl,
					success: function ( json ) {
						_fnLanguageCompat( json );
						_fnCamelToHungarian( defaults.oLanguage, json );
						$.extend( true, oLanguage, json );
						_fnInitialise( oSettings );
					},
					error: function () {
						// Error occurred loading language file, continue on as best we can
						_fnInitialise( oSettings );
					}
				} );
				bInitHandedOff = true;
			}
			
			/*
			 * Stripes
			 */
			if ( oInit.asStripeClasses === null )
			{
				oSettings.asStripeClasses =[
					oClasses.sStripeOdd,
					oClasses.sStripeEven
				];
			}
			
			/* Remove row stripe classes if they are already on the table row */
			var stripeClasses = oSettings.asStripeClasses;
			var rowOne = $this.children('tbody').find('tr').eq(0);
			if ( $.inArray( true, $.map( stripeClasses, function(el, i) {
				return rowOne.hasClass(el);
			} ) ) !== -1 ) {
				$('tbody tr', this).removeClass( stripeClasses.join(' ') );
				oSettings.asDestroyStripes = stripeClasses.slice();
			}
			
			/*
			 * Columns
			 * See if we should load columns automatically or use defined ones
			 */
			var anThs = [];
			var aoColumnsInit;
			var nThead = this.getElementsByTagName('thead');
			if ( nThead.length !== 0 )
			{
				_fnDetectHeader( oSettings.aoHeader, nThead[0] );
				anThs = _fnGetUniqueThs( oSettings );
			}
			
			/* If not given a column array, generate one with nulls */
			if ( oInit.aoColumns === null )
			{
				aoColumnsInit = [];
				for ( i=0, iLen=anThs.length ; i<iLen ; i++ )
				{
					aoColumnsInit.push( null );
				}
			}
			else
			{
				aoColumnsInit = oInit.aoColumns;
			}
			
			/* Add the columns */
			for ( i=0, iLen=aoColumnsInit.length ; i<iLen ; i++ )
			{
				_fnAddColumn( oSettings, anThs ? anThs[i] : null );
			}
			
			/* Apply the column definitions */
			_fnApplyColumnDefs( oSettings, oInit.aoColumnDefs, aoColumnsInit, function (iCol, oDef) {
				_fnColumnOptions( oSettings, iCol, oDef );
			} );
			
			/* HTML5 attribute detection - build an mData object automatically if the
			 * attributes are found
			 */
			if ( rowOne.length ) {
				var a = function ( cell, name ) {
					return cell.getAttribute( 'data-'+name ) !== null ? name : null;
				};
			
				$( rowOne[0] ).children('th, td').each( function (i, cell) {
					var col = oSettings.aoColumns[i];
			
					if ( col.mData === i ) {
						var sort = a( cell, 'sort' ) || a( cell, 'order' );
						var filter = a( cell, 'filter' ) || a( cell, 'search' );
			
						if ( sort !== null || filter !== null ) {
							col.mData = {
								_:      i+'.display',
								sort:   sort !== null   ? i+'.@data-'+sort   : undefined,
								type:   sort !== null   ? i+'.@data-'+sort   : undefined,
								filter: filter !== null ? i+'.@data-'+filter : undefined
							};
			
							_fnColumnOptions( oSettings, i );
						}
					}
				} );
			}
			
			var features = oSettings.oFeatures;
			var loadedInit = function () {
				/*
				 * Sorting
				 * @todo For modularisation (1.11) this needs to do into a sort start up handler
				 */
			
				// If aaSorting is not defined, then we use the first indicator in asSorting
				// in case that has been altered, so the default sort reflects that option
				if ( oInit.aaSorting === undefined ) {
					var sorting = oSettings.aaSorting;
					for ( i=0, iLen=sorting.length ; i<iLen ; i++ ) {
						sorting[i][1] = oSettings.aoColumns[ i ].asSorting[0];
					}
				}
			
				/* Do a first pass on the sorting classes (allows any size changes to be taken into
				 * account, and also will apply sorting disabled classes if disabled
				 */
				_fnSortingClasses( oSettings );
			
				if ( features.bSort ) {
					_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
						if ( oSettings.bSorted ) {
							var aSort = _fnSortFlatten( oSettings );
							var sortedColumns = {};
			
							$.each( aSort, function (i, val) {
								sortedColumns[ val.src ] = val.dir;
							} );
			
							_fnCallbackFire( oSettings, null, 'order', [oSettings, aSort, sortedColumns] );
							_fnSortAria( oSettings );
						}
					} );
				}
			
				_fnCallbackReg( oSettings, 'aoDrawCallback', function () {
					if ( oSettings.bSorted || _fnDataSource( oSettings ) === 'ssp' || features.bDeferRender ) {
						_fnSortingClasses( oSettings );
					}
				}, 'sc' );
			
			
				/*
				 * Final init
				 * Cache the header, body and footer as required, creating them if needed
				 */
			
				// Work around for Webkit bug 83867 - store the caption-side before removing from doc
				var captions = $this.children('caption').each( function () {
					this._captionSide = $(this).css('caption-side');
				} );
			
				var thead = $this.children('thead');
				if ( thead.length === 0 ) {
					thead = $('<thead/>').appendTo($this);
				}
				oSettings.nTHead = thead[0];
			
				var tbody = $this.children('tbody');
				if ( tbody.length === 0 ) {
					tbody = $('<tbody/>').appendTo($this);
				}
				oSettings.nTBody = tbody[0];
			
				var tfoot = $this.children('tfoot');
				if ( tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") ) {
					// If we are a scrolling table, and no footer has been given, then we need to create
					// a tfoot element for the caption element to be appended to
					tfoot = $('<tfoot/>').appendTo($this);
				}
			
				if ( tfoot.length === 0 || tfoot.children().length === 0 ) {
					$this.addClass( oClasses.sNoFooter );
				}
				else if ( tfoot.length > 0 ) {
					oSettings.nTFoot = tfoot[0];
					_fnDetectHeader( oSettings.aoFooter, oSettings.nTFoot );
				}
			
				/* Check if there is data passing into the constructor */
				if ( oInit.aaData ) {
					for ( i=0 ; i<oInit.aaData.length ; i++ ) {
						_fnAddData( oSettings, oInit.aaData[ i ] );
					}
				}
				else if ( oSettings.bDeferLoading || _fnDataSource( oSettings ) == 'dom' ) {
					/* Grab the data from the page - only do this when deferred loading or no Ajax
					 * source since there is no point in reading the DOM data if we are then going
					 * to replace it with Ajax data
					 */
					_fnAddTr( oSettings, $(oSettings.nTBody).children('tr') );
				}
			
				/* Copy the data index array */
				oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
			
				/* Initialisation complete - table can be drawn */
				oSettings.bInitialised = true;
			
				/* Check if we need to initialise the table (it might not have been handed off to the
				 * language processor)
				 */
				if ( bInitHandedOff === false ) {
					_fnInitialise( oSettings );
				}
			};
			
			/* Must be done after everything which can be overridden by the state saving! */
			if ( oInit.bStateSave )
			{
				features.bStateSave = true;
				_fnCallbackReg( oSettings, 'aoDrawCallback', _fnSaveState, 'state_save' );
				_fnLoadState( oSettings, oInit, loadedInit );
			}
			else {
				loadedInit();
			}
			
		} );
		_that = null;
		return this;
	};

	
	/*
	 * It is useful to have variables which are scoped locally so only the
	 * DataTables functions can access them and they don't leak into global space.
	 * At the same time these functions are often useful over multiple files in the
	 * core and API, so we list, or at least document, all variables which are used
	 * by DataTables as private variables here. This also ensures that there is no
	 * clashing of variable names and that they can easily referenced for reuse.
	 */
	
	
	// Defined else where
	//  _selector_run
	//  _selector_opts
	//  _selector_first
	//  _selector_row_indexes
	
	var _ext; // DataTable.ext
	var _Api; // DataTable.Api
	var _api_register; // DataTable.Api.register
	var _api_registerPlural; // DataTable.Api.registerPlural
	
	var _re_dic = {};
	var _re_new_lines = /[\r\n\u2028]/g;
	var _re_html = /<.*?>/g;
	
	// This is not strict ISO8601 - Date.parse() is quite lax, although
	// implementations differ between browsers.
	var _re_date = /^\d{2,4}[\.\/\-]\d{1,2}[\.\/\-]\d{1,2}([T ]{1}\d{1,2}[:\.]\d{2}([\.:]\d{2})?)?$/;
	
	// Escape regular expression special characters
	var _re_escape_regex = new RegExp( '(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[', ']', '{', '}', '\\', '$', '^', '-' ].join('|\\') + ')', 'g' );
	
	// http://en.wikipedia.org/wiki/Foreign_exchange_market
	// - \u20BD - Russian ruble.
	// - \u20a9 - South Korean Won
	// - \u20BA - Turkish Lira
	// - \u20B9 - Indian Rupee
	// - R - Brazil (R$) and South Africa
	// - fr - Swiss Franc
	// - kr - Swedish krona, Norwegian krone and Danish krone
	// - \u2009 is thin space and \u202F is narrow no-break space, both used in many
	// - Ƀ - Bitcoin
	// - Ξ - Ethereum
	//   standards as thousands separators.
	var _re_formatted_numeric = /['\u00A0,$£€¥%\u2009\u202F\u20BD\u20a9\u20BArfkɃΞ]/gi;
	
	
	var _empty = function ( d ) {
		return !d || d === true || d === '-' ? true : false;
	};
	
	
	var _intVal = function ( s ) {
		var integer = parseInt( s, 10 );
		return !isNaN(integer) && isFinite(s) ? integer : null;
	};
	
	// Convert from a formatted number with characters other than `.` as the
	// decimal place, to a Javascript number
	var _numToDecimal = function ( num, decimalPoint ) {
		// Cache created regular expressions for speed as this function is called often
		if ( ! _re_dic[ decimalPoint ] ) {
			_re_dic[ decimalPoint ] = new RegExp( _fnEscapeRegex( decimalPoint ), 'g' );
		}
		return typeof num === 'string' && decimalPoint !== '.' ?
			num.replace( /\./g, '' ).replace( _re_dic[ decimalPoint ], '.' ) :
			num;
	};
	
	
	var _isNumber = function ( d, decimalPoint, formatted ) {
		var strType = typeof d === 'string';
	
		// If empty return immediately so there must be a number if it is a
		// formatted string (this stops the string "k", or "kr", etc being detected
		// as a formatted number for currency
		if ( _empty( d ) ) {
			return true;
		}
	
		if ( decimalPoint && strType ) {
			d = _numToDecimal( d, decimalPoint );
		}
	
		if ( formatted && strType ) {
			d = d.replace( _re_formatted_numeric, '' );
		}
	
		return !isNaN( parseFloat(d) ) && isFinite( d );
	};
	
	
	// A string without HTML in it can be considered to be HTML still
	var _isHtml = function ( d ) {
		return _empty( d ) || typeof d === 'string';
	};
	
	
	var _htmlNumeric = function ( d, decimalPoint, formatted ) {
		if ( _empty( d ) ) {
			return true;
		}
	
		var html = _isHtml( d );
		return ! html ?
			null :
			_isNumber( _stripHtml( d ), decimalPoint, formatted ) ?
				true :
				null;
	};
	
	
	var _pluck = function ( a, prop, prop2 ) {
		var out = [];
		var i=0, ien=a.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[i] && a[i][ prop ] ) {
					out.push( a[i][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				if ( a[i] ) {
					out.push( a[i][ prop ] );
				}
			}
		}
	
		return out;
	};
	
	
	// Basically the same as _pluck, but rather than looping over `a` we use `order`
	// as the indexes to pick from `a`
	var _pluck_order = function ( a, order, prop, prop2 )
	{
		var out = [];
		var i=0, ien=order.length;
	
		// Could have the test in the loop for slightly smaller code, but speed
		// is essential here
		if ( prop2 !== undefined ) {
			for ( ; i<ien ; i++ ) {
				if ( a[ order[i] ][ prop ] ) {
					out.push( a[ order[i] ][ prop ][ prop2 ] );
				}
			}
		}
		else {
			for ( ; i<ien ; i++ ) {
				out.push( a[ order[i] ][ prop ] );
			}
		}
	
		return out;
	};
	
	
	var _range = function ( len, start )
	{
		var out = [];
		var end;
	
		if ( start === undefined ) {
			start = 0;
			end = len;
		}
		else {
			end = start;
			start = len;
		}
	
		for ( var i=start ; i<end ; i++ ) {
			out.push( i );
		}
	
		return out;
	};
	
	
	var _removeEmpty = function ( a )
	{
		var out = [];
	
		for ( var i=0, ien=a.length ; i<ien ; i++ ) {
			if ( a[i] ) { // careful - will remove all falsy values!
				out.push( a[i] );
			}
		}
	
		return out;
	};
	
	
	var _stripHtml = function ( d ) {
		return d.replace( _re_html, '' );
	};
	
	
	/**
	 * Determine if all values in the array are unique. This means we can short
	 * cut the _unique method at the cost of a single loop. A sorted array is used
	 * to easily check the values.
	 *
	 * @param  {array} src Source array
	 * @return {boolean} true if all unique, false otherwise
	 * @ignore
	 */
	var _areAllUnique = function ( src ) {
		if ( src.length < 2 ) {
			return true;
		}
	
		var sorted = src.slice().sort();
		var last = sorted[0];
	
		for ( var i=1, ien=sorted.length ; i<ien ; i++ ) {
			if ( sorted[i] === last ) {
				return false;
			}
	
			last = sorted[i];
		}
	
		return true;
	};
	
	
	/**
	 * Find the unique elements in a source array.
	 *
	 * @param  {array} src Source array
	 * @return {array} Array of unique items
	 * @ignore
	 */
	var _unique = function ( src )
	{
		if ( _areAllUnique( src ) ) {
			return src.slice();
		}
	
		// A faster unique method is to use object keys to identify used values,
		// but this doesn't work with arrays or objects, which we must also
		// consider. See jsperf.com/compare-array-unique-versions/4 for more
		// information.
		var
			out = [],
			val,
			i, ien=src.length,
			j, k=0;
	
		again: for ( i=0 ; i<ien ; i++ ) {
			val = src[i];
	
			for ( j=0 ; j<k ; j++ ) {
				if ( out[j] === val ) {
					continue again;
				}
			}
	
			out.push( val );
			k++;
		}
	
		return out;
	};
	
	// Surprisingly this is faster than [].concat.apply
	// https://jsperf.com/flatten-an-array-loop-vs-reduce/2
	var _flatten = function (out, val) {
		if (Array.isArray(val)) {
			for (var i=0 ; i<val.length ; i++) {
				_flatten(out, val[i]);
			}
		}
		else {
			out.push(val);
		}
	  
		return out;
	}
	
	// Array.isArray polyfill.
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray
	if (! Array.isArray) {
	    Array.isArray = function(arg) {
	        return Object.prototype.toString.call(arg) === '[object Array]';
	    };
	}
	
	// .trim() polyfill
	// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/trim
	if (!String.prototype.trim) {
	  String.prototype.trim = function () {
	    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	  };
	}
	
	/**
	 * DataTables utility methods
	 * 
	 * This namespace provides helper methods that DataTables uses internally to
	 * create a DataTable, but which are not exclusively used only for DataTables.
	 * These methods can be used by extension authors to save the duplication of
	 * code.
	 *
	 *  @namespace
	 */
	DataTable.util = {
		/**
		 * Throttle the calls to a function. Arguments and context are maintained
		 * for the throttled function.
		 *
		 * @param {function} fn Function to be called
		 * @param {integer} freq Call frequency in mS
		 * @return {function} Wrapped function
		 */
		throttle: function ( fn, freq ) {
			var
				frequency = freq !== undefined ? freq : 200,
				last,
				timer;
	
			return function () {
				var
					that = this,
					now  = +new Date(),
					args = arguments;
	
				if ( last && now < last + frequency ) {
					clearTimeout( timer );
	
					timer = setTimeout( function () {
						last = undefined;
						fn.apply( that, args );
					}, frequency );
				}
				else {
					last = now;
					fn.apply( that, args );
				}
			};
		},
	
	
		/**
		 * Escape a string such that it can be used in a regular expression
		 *
		 *  @param {string} val string to escape
		 *  @returns {string} escaped string
		 */
		escapeRegex: function ( val ) {
			return val.replace( _re_escape_regex, '\\$1' );
		}
	};
	
	
	
	/**
	 * Create a mapping object that allows camel case parameters to be looked up
	 * for their Hungarian counterparts. The mapping is stored in a private
	 * parameter called `_hungarianMap` which can be accessed on the source object.
	 *  @param {object} o
	 *  @memberof DataTable#oApi
	 */
	function _fnHungarianMap ( o )
	{
		var
			hungarian = 'a aa ai ao as b fn i m o s ',
			match,
			newKey,
			map = {};
	
		$.each( o, function (key, val) {
			match = key.match(/^([^A-Z]+?)([A-Z])/);
	
			if ( match && hungarian.indexOf(match[1]+' ') !== -1 )
			{
				newKey = key.replace( match[0], match[2].toLowerCase() );
				map[ newKey ] = key;
	
				if ( match[1] === 'o' )
				{
					_fnHungarianMap( o[key] );
				}
			}
		} );
	
		o._hungarianMap = map;
	}
	
	
	/**
	 * Convert from camel case parameters to Hungarian, based on a Hungarian map
	 * created by _fnHungarianMap.
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 *  @memberof DataTable#oApi
	 */
	function _fnCamelToHungarian ( src, user, force )
	{
		if ( ! src._hungarianMap ) {
			_fnHungarianMap( src );
		}
	
		var hungarianKey;
	
		$.each( user, function (key, val) {
			hungarianKey = src._hungarianMap[ key ];
	
			if ( hungarianKey !== undefined && (force || user[hungarianKey] === undefined) )
			{
				// For objects, we need to buzz down into the object to copy parameters
				if ( hungarianKey.charAt(0) === 'o' )
				{
					// Copy the camelCase options over to the hungarian
					if ( ! user[ hungarianKey ] ) {
						user[ hungarianKey ] = {};
					}
					$.extend( true, user[hungarianKey], user[key] );
	
					_fnCamelToHungarian( src[hungarianKey], user[hungarianKey], force );
				}
				else {
					user[hungarianKey] = user[ key ];
				}
			}
		} );
	}
	
	
	/**
	 * Language compatibility - when certain options are given, and others aren't, we
	 * need to duplicate the values over, in order to provide backwards compatibility
	 * with older language files.
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnLanguageCompat( lang )
	{
		// Note the use of the Hungarian notation for the parameters in this method as
		// this is called after the mapping of camelCase to Hungarian
		var defaults = DataTable.defaults.oLanguage;
	
		// Default mapping
		var defaultDecimal = defaults.sDecimal;
		if ( defaultDecimal ) {
			_addNumericSort( defaultDecimal );
		}
	
		if ( lang ) {
			var zeroRecords = lang.sZeroRecords;
	
			// Backwards compatibility - if there is no sEmptyTable given, then use the same as
			// sZeroRecords - assuming that is given.
			if ( ! lang.sEmptyTable && zeroRecords &&
				defaults.sEmptyTable === "No data available in table" )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sEmptyTable' );
			}
	
			// Likewise with loading records
			if ( ! lang.sLoadingRecords && zeroRecords &&
				defaults.sLoadingRecords === "Loading..." )
			{
				_fnMap( lang, lang, 'sZeroRecords', 'sLoadingRecords' );
			}
	
			// Old parameter name of the thousands separator mapped onto the new
			if ( lang.sInfoThousands ) {
				lang.sThousands = lang.sInfoThousands;
			}
	
			var decimal = lang.sDecimal;
			if ( decimal && defaultDecimal !== decimal ) {
				_addNumericSort( decimal );
			}
		}
	}
	
	
	/**
	 * Map one parameter onto another
	 *  @param {object} o Object to map
	 *  @param {*} knew The new parameter name
	 *  @param {*} old The old parameter name
	 */
	var _fnCompatMap = function ( o, knew, old ) {
		if ( o[ knew ] !== undefined ) {
			o[ old ] = o[ knew ];
		}
	};
	
	
	/**
	 * Provide backwards compatibility for the main DT options. Note that the new
	 * options are mapped onto the old parameters, so this is an external interface
	 * change only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatOpts ( init )
	{
		_fnCompatMap( init, 'ordering',      'bSort' );
		_fnCompatMap( init, 'orderMulti',    'bSortMulti' );
		_fnCompatMap( init, 'orderClasses',  'bSortClasses' );
		_fnCompatMap( init, 'orderCellsTop', 'bSortCellsTop' );
		_fnCompatMap( init, 'order',         'aaSorting' );
		_fnCompatMap( init, 'orderFixed',    'aaSortingFixed' );
		_fnCompatMap( init, 'paging',        'bPaginate' );
		_fnCompatMap( init, 'pagingType',    'sPaginationType' );
		_fnCompatMap( init, 'pageLength',    'iDisplayLength' );
		_fnCompatMap( init, 'searching',     'bFilter' );
	
		// Boolean initialisation of x-scrolling
		if ( typeof init.sScrollX === 'boolean' ) {
			init.sScrollX = init.sScrollX ? '100%' : '';
		}
		if ( typeof init.scrollX === 'boolean' ) {
			init.scrollX = init.scrollX ? '100%' : '';
		}
	
		// Column search objects are in an array, so it needs to be converted
		// element by element
		var searchCols = init.aoSearchCols;
	
		if ( searchCols ) {
			for ( var i=0, ien=searchCols.length ; i<ien ; i++ ) {
				if ( searchCols[i] ) {
					_fnCamelToHungarian( DataTable.models.oSearch, searchCols[i] );
				}
			}
		}
	}
	
	
	/**
	 * Provide backwards compatibility for column options. Note that the new options
	 * are mapped onto the old parameters, so this is an external interface change
	 * only.
	 *  @param {object} init Object to map
	 */
	function _fnCompatCols ( init )
	{
		_fnCompatMap( init, 'orderable',     'bSortable' );
		_fnCompatMap( init, 'orderData',     'aDataSort' );
		_fnCompatMap( init, 'orderSequence', 'asSorting' );
		_fnCompatMap( init, 'orderDataType', 'sortDataType' );
	
		// orderData can be given as an integer
		var dataSort = init.aDataSort;
		if ( typeof dataSort === 'number' && ! Array.isArray( dataSort ) ) {
			init.aDataSort = [ dataSort ];
		}
	}
	
	
	/**
	 * Browser feature detection for capabilities, quirks
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBrowserDetect( settings )
	{
		// We don't need to do this every time DataTables is constructed, the values
		// calculated are specific to the browser and OS configuration which we
		// don't expect to change between initialisations
		if ( ! DataTable.__browser ) {
			var browser = {};
			DataTable.__browser = browser;
	
			// Scrolling feature / quirks detection
			var n = $('<div/>')
				.css( {
					position: 'fixed',
					top: 0,
					left: $(window).scrollLeft()*-1, // allow for scrolling
					height: 1,
					width: 1,
					overflow: 'hidden'
				} )
				.append(
					$('<div/>')
						.css( {
							position: 'absolute',
							top: 1,
							left: 1,
							width: 100,
							overflow: 'scroll'
						} )
						.append(
							$('<div/>')
								.css( {
									width: '100%',
									height: 10
								} )
						)
				)
				.appendTo( 'body' );
	
			var outer = n.children();
			var inner = outer.children();
	
			// Numbers below, in order, are:
			// inner.offsetWidth, inner.clientWidth, outer.offsetWidth, outer.clientWidth
			//
			// IE6 XP:                           100 100 100  83
			// IE7 Vista:                        100 100 100  83
			// IE 8+ Windows:                     83  83 100  83
			// Evergreen Windows:                 83  83 100  83
			// Evergreen Mac with scrollbars:     85  85 100  85
			// Evergreen Mac without scrollbars: 100 100 100 100
	
			// Get scrollbar width
			browser.barWidth = outer[0].offsetWidth - outer[0].clientWidth;
	
			// IE6/7 will oversize a width 100% element inside a scrolling element, to
			// include the width of the scrollbar, while other browsers ensure the inner
			// element is contained without forcing scrolling
			browser.bScrollOversize = inner[0].offsetWidth === 100 && outer[0].clientWidth !== 100;
	
			// In rtl text layout, some browsers (most, but not all) will place the
			// scrollbar on the left, rather than the right.
			browser.bScrollbarLeft = Math.round( inner.offset().left ) !== 1;
	
			// IE8- don't provide height and width for getBoundingClientRect
			browser.bBounding = n[0].getBoundingClientRect().width ? true : false;
	
			n.remove();
		}
	
		$.extend( settings.oBrowser, DataTable.__browser );
		settings.oScroll.iBarWidth = DataTable.__browser.barWidth;
	}
	
	
	/**
	 * Array.prototype reduce[Right] method, used for browsers which don't support
	 * JS 1.6. Done this way to reduce code size, since we iterate either way
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnReduce ( that, fn, init, start, end, inc )
	{
		var
			i = start,
			value,
			isSet = false;
	
		if ( init !== undefined ) {
			value = init;
			isSet = true;
		}
	
		while ( i !== end ) {
			if ( ! that.hasOwnProperty(i) ) {
				continue;
			}
	
			value = isSet ?
				fn( value, that[i], i, that ) :
				that[i];
	
			isSet = true;
			i += inc;
		}
	
		return value;
	}
	
	/**
	 * Add a column to the list used for the table with default values
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nTh The th element for this column
	 *  @memberof DataTable#oApi
	 */
	function _fnAddColumn( oSettings, nTh )
	{
		// Add column to aoColumns array
		var oDefaults = DataTable.defaults.column;
		var iCol = oSettings.aoColumns.length;
		var oCol = $.extend( {}, DataTable.models.oColumn, oDefaults, {
			"nTh": nTh ? nTh : document.createElement('th'),
			"sTitle":    oDefaults.sTitle    ? oDefaults.sTitle    : nTh ? nTh.innerHTML : '',
			"aDataSort": oDefaults.aDataSort ? oDefaults.aDataSort : [iCol],
			"mData": oDefaults.mData ? oDefaults.mData : iCol,
			idx: iCol
		} );
		oSettings.aoColumns.push( oCol );
	
		// Add search object for column specific search. Note that the `searchCols[ iCol ]`
		// passed into extend can be undefined. This allows the user to give a default
		// with only some of the parameters defined, and also not give a default
		var searchCols = oSettings.aoPreSearchCols;
		searchCols[ iCol ] = $.extend( {}, DataTable.models.oSearch, searchCols[ iCol ] );
	
		// Use the default column options function to initialise classes etc
		_fnColumnOptions( oSettings, iCol, $(nTh).data() );
	}
	
	
	/**
	 * Apply options for a column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iCol column index to consider
	 *  @param {object} oOptions object with sType, bVisible and bSearchable etc
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnOptions( oSettings, iCol, oOptions )
	{
		var oCol = oSettings.aoColumns[ iCol ];
		var oClasses = oSettings.oClasses;
		var th = $(oCol.nTh);
	
		// Try to get width information from the DOM. We can't get it from CSS
		// as we'd need to parse the CSS stylesheet. `width` option can override
		if ( ! oCol.sWidthOrig ) {
			// Width attribute
			oCol.sWidthOrig = th.attr('width') || null;
	
			// Style attribute
			var t = (th.attr('style') || '').match(/width:\s*(\d+[pxem%]+)/);
			if ( t ) {
				oCol.sWidthOrig = t[1];
			}
		}
	
		/* User specified column options */
		if ( oOptions !== undefined && oOptions !== null )
		{
			// Backwards compatibility
			_fnCompatCols( oOptions );
	
			// Map camel case parameters to their Hungarian counterparts
			_fnCamelToHungarian( DataTable.defaults.column, oOptions, true );
	
			/* Backwards compatibility for mDataProp */
			if ( oOptions.mDataProp !== undefined && !oOptions.mData )
			{
				oOptions.mData = oOptions.mDataProp;
			}
	
			if ( oOptions.sType )
			{
				oCol._sManualType = oOptions.sType;
			}
	
			// `class` is a reserved word in Javascript, so we need to provide
			// the ability to use a valid name for the camel case input
			if ( oOptions.className && ! oOptions.sClass )
			{
				oOptions.sClass = oOptions.className;
			}
			if ( oOptions.sClass ) {
				th.addClass( oOptions.sClass );
			}
	
			$.extend( oCol, oOptions );
			_fnMap( oCol, oOptions, "sWidth", "sWidthOrig" );
	
			/* iDataSort to be applied (backwards compatibility), but aDataSort will take
			 * priority if defined
			 */
			if ( oOptions.iDataSort !== undefined )
			{
				oCol.aDataSort = [ oOptions.iDataSort ];
			}
			_fnMap( oCol, oOptions, "aDataSort" );
		}
	
		/* Cache the data get and set functions for speed */
		var mDataSrc = oCol.mData;
		var mData = _fnGetObjectDataFn( mDataSrc );
		var mRender = oCol.mRender ? _fnGetObjectDataFn( oCol.mRender ) : null;
	
		var attrTest = function( src ) {
			return typeof src === 'string' && src.indexOf('@') !== -1;
		};
		oCol._bAttrSrc = $.isPlainObject( mDataSrc ) && (
			attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter)
		);
		oCol._setter = null;
	
		oCol.fnGetData = function (rowData, type, meta) {
			var innerData = mData( rowData, type, undefined, meta );
	
			return mRender && type ?
				mRender( innerData, type, rowData, meta ) :
				innerData;
		};
		oCol.fnSetData = function ( rowData, val, meta ) {
			return _fnSetObjectDataFn( mDataSrc )( rowData, val, meta );
		};
	
		// Indicate if DataTables should read DOM data as an object or array
		// Used in _fnGetRowElements
		if ( typeof mDataSrc !== 'number' ) {
			oSettings._rowReadObject = true;
		}
	
		/* Feature sorting overrides column specific when off */
		if ( !oSettings.oFeatures.bSort )
		{
			oCol.bSortable = false;
			th.addClass( oClasses.sSortableNone ); // Have to add class here as order event isn't called
		}
	
		/* Check that the class assignment is correct for sorting */
		var bAsc = $.inArray('asc', oCol.asSorting) !== -1;
		var bDesc = $.inArray('desc', oCol.asSorting) !== -1;
		if ( !oCol.bSortable || (!bAsc && !bDesc) )
		{
			oCol.sSortingClass = oClasses.sSortableNone;
			oCol.sSortingClassJUI = "";
		}
		else if ( bAsc && !bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableAsc;
			oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
		}
		else if ( !bAsc && bDesc )
		{
			oCol.sSortingClass = oClasses.sSortableDesc;
			oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
		}
		else
		{
			oCol.sSortingClass = oClasses.sSortable;
			oCol.sSortingClassJUI = oClasses.sSortJUI;
		}
	}
	
	
	/**
	 * Adjust the table column widths for new data. Note: you would probably want to
	 * do a redraw after calling this function!
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAdjustColumnSizing ( settings )
	{
		/* Not interested in doing column width calculation if auto-width is disabled */
		if ( settings.oFeatures.bAutoWidth !== false )
		{
			var columns = settings.aoColumns;
	
			_fnCalculateColumnWidths( settings );
			for ( var i=0 , iLen=columns.length ; i<iLen ; i++ )
			{
				columns[i].nTh.style.width = columns[i].sWidth;
			}
		}
	
		var scroll = settings.oScroll;
		if ( scroll.sY !== '' || scroll.sX !== '')
		{
			_fnScrollDraw( settings );
		}
	
		_fnCallbackFire( settings, null, 'column-sizing', [settings] );
	}
	
	
	/**
	 * Covert the index of a visible column to the index in the data array (take account
	 * of hidden columns)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iMatch Visible column index to lookup
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnVisibleToColumnIndex( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
	
		return typeof aiVis[iMatch] === 'number' ?
			aiVis[iMatch] :
			null;
	}
	
	
	/**
	 * Covert the index of an index in the data array and convert it to the visible
	 *   column index (take account of hidden columns)
	 *  @param {int} iMatch Column index to lookup
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the data index
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnIndexToVisible( oSettings, iMatch )
	{
		var aiVis = _fnGetColumns( oSettings, 'bVisible' );
		var iPos = $.inArray( iMatch, aiVis );
	
		return iPos !== -1 ? iPos : null;
	}
	
	
	/**
	 * Get the number of visible columns
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {int} i the number of visible columns
	 *  @memberof DataTable#oApi
	 */
	function _fnVisbleColumns( oSettings )
	{
		var vis = 0;
	
		// No reduce in IE8, use a loop for now
		$.each( oSettings.aoColumns, function ( i, col ) {
			if ( col.bVisible && $(col.nTh).css('display') !== 'none' ) {
				vis++;
			}
		} );
	
		return vis;
	}
	
	
	/**
	 * Get an array of column indexes that match a given property
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sParam Parameter in aoColumns to look for - typically
	 *    bVisible or bSearchable
	 *  @returns {array} Array of indexes with matched properties
	 *  @memberof DataTable#oApi
	 */
	function _fnGetColumns( oSettings, sParam )
	{
		var a = [];
	
		$.map( oSettings.aoColumns, function(val, i) {
			if ( val[sParam] ) {
				a.push( i );
			}
		} );
	
		return a;
	}
	
	
	/**
	 * Calculate the 'type' of a column
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnColumnTypes ( settings )
	{
		var columns = settings.aoColumns;
		var data = settings.aoData;
		var types = DataTable.ext.type.detect;
		var i, ien, j, jen, k, ken;
		var col, cell, detectedType, cache;
	
		// For each column, spin over the 
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			col = columns[i];
			cache = [];
	
			if ( ! col.sType && col._sManualType ) {
				col.sType = col._sManualType;
			}
			else if ( ! col.sType ) {
				for ( j=0, jen=types.length ; j<jen ; j++ ) {
					for ( k=0, ken=data.length ; k<ken ; k++ ) {
						// Use a cache array so we only need to get the type data
						// from the formatter once (when using multiple detectors)
						if ( cache[k] === undefined ) {
							cache[k] = _fnGetCellData( settings, k, i, 'type' );
						}
	
						detectedType = types[j]( cache[k], settings );
	
						// If null, then this type can't apply to this column, so
						// rather than testing all cells, break out. There is an
						// exception for the last type which is `html`. We need to
						// scan all rows since it is possible to mix string and HTML
						// types
						if ( ! detectedType && j !== types.length-1 ) {
							break;
						}
	
						// Only a single match is needed for html type since it is
						// bottom of the pile and very similar to string
						if ( detectedType === 'html' ) {
							break;
						}
					}
	
					// Type is valid for all data points in the column - use this
					// type
					if ( detectedType ) {
						col.sType = detectedType;
						break;
					}
				}
	
				// Fall back - if no type was detected, always use string
				if ( ! col.sType ) {
					col.sType = 'string';
				}
			}
		}
	}
	
	
	/**
	 * Take the column definitions and static columns arrays and calculate how
	 * they relate to column indexes. The callback function will then apply the
	 * definition found for a column to a suitable configuration object.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aoColDefs The aoColumnDefs array that is to be applied
	 *  @param {array} aoCols The aoColumns array that defines columns individually
	 *  @param {function} fn Callback function - takes two parameters, the calculated
	 *    column index and the definition for that column.
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyColumnDefs( oSettings, aoColDefs, aoCols, fn )
	{
		var i, iLen, j, jLen, k, kLen, def;
		var columns = oSettings.aoColumns;
	
		// Column definitions with aTargets
		if ( aoColDefs )
		{
			/* Loop over the definitions array - loop in reverse so first instance has priority */
			for ( i=aoColDefs.length-1 ; i>=0 ; i-- )
			{
				def = aoColDefs[i];
	
				/* Each definition can target multiple columns, as it is an array */
				var aTargets = def.targets !== undefined ?
					def.targets :
					def.aTargets;
	
				if ( ! Array.isArray( aTargets ) )
				{
					aTargets = [ aTargets ];
				}
	
				for ( j=0, jLen=aTargets.length ; j<jLen ; j++ )
				{
					if ( typeof aTargets[j] === 'number' && aTargets[j] >= 0 )
					{
						/* Add columns that we don't yet know about */
						while( columns.length <= aTargets[j] )
						{
							_fnAddColumn( oSettings );
						}
	
						/* Integer, basic index */
						fn( aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'number' && aTargets[j] < 0 )
					{
						/* Negative integer, right to left column counting */
						fn( columns.length+aTargets[j], def );
					}
					else if ( typeof aTargets[j] === 'string' )
					{
						/* Class name matching on TH element */
						for ( k=0, kLen=columns.length ; k<kLen ; k++ )
						{
							if ( aTargets[j] == "_all" ||
							     $(columns[k].nTh).hasClass( aTargets[j] ) )
							{
								fn( k, def );
							}
						}
					}
				}
			}
		}
	
		// Statically defined columns array
		if ( aoCols )
		{
			for ( i=0, iLen=aoCols.length ; i<iLen ; i++ )
			{
				fn( i, aoCols[i] );
			}
		}
	}
	
	/**
	 * Add a data array to the table, creating DOM node etc. This is the parallel to
	 * _fnGatherData, but for adding rows from a Javascript source, rather than a
	 * DOM source.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {array} aData data array to be added
	 *  @param {node} [nTr] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @returns {int} >=0 if successful (index of new aoData entry), -1 if failed
	 *  @memberof DataTable#oApi
	 */
	function _fnAddData ( oSettings, aDataIn, nTr, anTds )
	{
		/* Create the object for storing information about this new row */
		var iRow = oSettings.aoData.length;
		var oData = $.extend( true, {}, DataTable.models.oRow, {
			src: nTr ? 'dom' : 'data',
			idx: iRow
		} );
	
		oData._aData = aDataIn;
		oSettings.aoData.push( oData );
	
		/* Create the cells */
		var nTd, sThisType;
		var columns = oSettings.aoColumns;
	
		// Invalidate the column types as the new data needs to be revalidated
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			columns[i].sType = null;
		}
	
		/* Add to the display array */
		oSettings.aiDisplayMaster.push( iRow );
	
		var id = oSettings.rowIdFn( aDataIn );
		if ( id !== undefined ) {
			oSettings.aIds[ id ] = oData;
		}
	
		/* Create the DOM information, or register it if already present */
		if ( nTr || ! oSettings.oFeatures.bDeferRender )
		{
			_fnCreateTr( oSettings, iRow, nTr, anTds );
		}
	
		return iRow;
	}
	
	
	/**
	 * Add one or more TR elements to the table. Generally we'd expect to
	 * use this for reading data from a DOM sourced table, but it could be
	 * used for an TR element. Note that if a TR is given, it is used (i.e.
	 * it is not cloned).
	 *  @param {object} settings dataTables settings object
	 *  @param {array|node|jQuery} trs The TR element(s) to add to the table
	 *  @returns {array} Array of indexes for the added rows
	 *  @memberof DataTable#oApi
	 */
	function _fnAddTr( settings, trs )
	{
		var row;
	
		// Allow an individual node to be passed in
		if ( ! (trs instanceof $) ) {
			trs = $(trs);
		}
	
		return trs.map( function (i, el) {
			row = _fnGetRowElements( settings, el );
			return _fnAddData( settings, row.data, el, row.cells );
		} );
	}
	
	
	/**
	 * Take a TR element and convert it to an index in aoData
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} n the TR element to find
	 *  @returns {int} index if the node is found, null if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToDataIndex( oSettings, n )
	{
		return (n._DT_RowIndex!==undefined) ? n._DT_RowIndex : null;
	}
	
	
	/**
	 * Take a TD element and convert it into a column data index (not the visible index)
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow The row number the TD/TH can be found in
	 *  @param {node} n The TD/TH element to find
	 *  @returns {int} index if the node is found, -1 if not
	 *  @memberof DataTable#oApi
	 */
	function _fnNodeToColumnIndex( oSettings, iRow, n )
	{
		return $.inArray( n, oSettings.aoData[ iRow ].anCells );
	}
	
	
	/**
	 * Get the data for a given cell from the internal cache, taking into account data mapping
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {string} type data get type ('display', 'type' 'filter' 'sort')
	 *  @returns {*} Cell data
	 *  @memberof DataTable#oApi
	 */
	function _fnGetCellData( settings, rowIdx, colIdx, type )
	{
		var draw           = settings.iDraw;
		var col            = settings.aoColumns[colIdx];
		var rowData        = settings.aoData[rowIdx]._aData;
		var defaultContent = col.sDefaultContent;
		var cellData       = col.fnGetData( rowData, type, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		} );
	
		if ( cellData === undefined ) {
			if ( settings.iDrawError != draw && defaultContent === null ) {
				_fnLog( settings, 0, "Requested unknown parameter "+
					(typeof col.mData=='function' ? '{function}' : "'"+col.mData+"'")+
					" for row "+rowIdx+", column "+colIdx, 4 );
				settings.iDrawError = draw;
			}
			return defaultContent;
		}
	
		// When the data source is null and a specific data type is requested (i.e.
		// not the original data), we can use default column data
		if ( (cellData === rowData || cellData === null) && defaultContent !== null && type !== undefined ) {
			cellData = defaultContent;
		}
		else if ( typeof cellData === 'function' ) {
			// If the data source is a function, then we run it and use the return,
			// executing in the scope of the data object (for instances)
			return cellData.call( rowData );
		}
	
		if ( cellData === null && type == 'display' ) {
			return '';
		}
		return cellData;
	}
	
	
	/**
	 * Set the value for a specific cell, into the internal data cache
	 *  @param {object} settings dataTables settings object
	 *  @param {int} rowIdx aoData row id
	 *  @param {int} colIdx Column index
	 *  @param {*} val Value to set
	 *  @memberof DataTable#oApi
	 */
	function _fnSetCellData( settings, rowIdx, colIdx, val )
	{
		var col     = settings.aoColumns[colIdx];
		var rowData = settings.aoData[rowIdx]._aData;
	
		col.fnSetData( rowData, val, {
			settings: settings,
			row:      rowIdx,
			col:      colIdx
		}  );
	}
	
	
	// Private variable that is used to match action syntax in the data property object
	var __reArray = /\[.*?\]$/;
	var __reFn = /\(\)$/;
	
	/**
	 * Split string on periods, taking into account escaped periods
	 * @param  {string} str String to split
	 * @return {array} Split string
	 */
	function _fnSplitObjNotation( str )
	{
		return $.map( str.match(/(\\.|[^\.])+/g) || [''], function ( s ) {
			return s.replace(/\\\./g, '.');
		} );
	}
	
	
	/**
	 * Return a function that can be used to get data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data get function
	 *  @memberof DataTable#oApi
	 */
	function _fnGetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Build an object of get functions, and wrap them in a single call */
			var o = {};
			$.each( mSource, function (key, val) {
				if ( val ) {
					o[key] = _fnGetObjectDataFn( val );
				}
			} );
	
			return function (data, type, row, meta) {
				var t = o[type] || o._;
				return t !== undefined ?
					t(data, type, row, meta) :
					data;
			};
		}
		else if ( mSource === null )
		{
			/* Give an empty string for rendering / sorting etc */
			return function (data) { // type, row and meta also passed, but not used
				return data;
			};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, type, row, meta) {
				return mSource( data, type, row, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* If there is a . in the source string then the data source is in a
			 * nested object so we loop over the data for each level to get the next
			 * level down. On each loop we test for undefined, and if found immediately
			 * return. This allows entire objects to be missing and sDefaultContent to
			 * be used if defined, rather than throwing an error
			 */
			var fetchData = function (data, type, src) {
				var arrayNotation, funcNotation, out, innerSrc;
	
				if ( src !== "" )
				{
					var a = _fnSplitObjNotation( src );
	
					for ( var i=0, iLen=a.length ; i<iLen ; i++ )
					{
						// Check if we are dealing with special notation
						arrayNotation = a[i].match(__reArray);
						funcNotation = a[i].match(__reFn);
	
						if ( arrayNotation )
						{
							// Array notation
							a[i] = a[i].replace(__reArray, '');
	
							// Condition allows simply [] to be passed in
							if ( a[i] !== "" ) {
								data = data[ a[i] ];
							}
							out = [];
	
							// Get the remainder of the nested object to get
							a.splice( 0, i+1 );
							innerSrc = a.join('.');
	
							// Traverse each entry in the array getting the properties requested
							if ( Array.isArray( data ) ) {
								for ( var j=0, jLen=data.length ; j<jLen ; j++ ) {
									out.push( fetchData( data[j], type, innerSrc ) );
								}
							}
	
							// If a string is given in between the array notation indicators, that
							// is used to join the strings together, otherwise an array is returned
							var join = arrayNotation[0].substring(1, arrayNotation[0].length-1);
							data = (join==="") ? out : out.join(join);
	
							// The inner call to fetchData has already traversed through the remainder
							// of the source requested, so we exit from the loop
							break;
						}
						else if ( funcNotation )
						{
							// Function call
							a[i] = a[i].replace(__reFn, '');
							data = data[ a[i] ]();
							continue;
						}
	
						if ( data === null || data[ a[i] ] === undefined )
						{
							return undefined;
						}
						data = data[ a[i] ];
					}
				}
	
				return data;
			};
	
			return function (data, type) { // row and meta also passed, but not used
				return fetchData( data, type, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, type) { // row and meta also passed, but not used
				return data[mSource];
			};
		}
	}
	
	
	/**
	 * Return a function that can be used to set data from a source object, taking
	 * into account the ability to use nested objects as a source
	 *  @param {string|int|function} mSource The data source for the object
	 *  @returns {function} Data set function
	 *  @memberof DataTable#oApi
	 */
	function _fnSetObjectDataFn( mSource )
	{
		if ( $.isPlainObject( mSource ) )
		{
			/* Unlike get, only the underscore (global) option is used for for
			 * setting data since we don't know the type here. This is why an object
			 * option is not documented for `mData` (which is read/write), but it is
			 * for `mRender` which is read only.
			 */
			return _fnSetObjectDataFn( mSource._ );
		}
		else if ( mSource === null )
		{
			/* Nothing to do when the data source is null */
			return function () {};
		}
		else if ( typeof mSource === 'function' )
		{
			return function (data, val, meta) {
				mSource( data, 'set', val, meta );
			};
		}
		else if ( typeof mSource === 'string' && (mSource.indexOf('.') !== -1 ||
			      mSource.indexOf('[') !== -1 || mSource.indexOf('(') !== -1) )
		{
			/* Like the get, we need to get data from a nested object */
			var setData = function (data, val, src) {
				var a = _fnSplitObjNotation( src ), b;
				var aLast = a[a.length-1];
				var arrayNotation, funcNotation, o, innerSrc;
	
				for ( var i=0, iLen=a.length-1 ; i<iLen ; i++ )
				{
					// Protect against prototype pollution
					if (a[i] === '__proto__') {
						throw new Error('Cannot set prototype values');
					}
	
					// Check if we are dealing with an array notation request
					arrayNotation = a[i].match(__reArray);
					funcNotation = a[i].match(__reFn);
	
					if ( arrayNotation )
					{
						a[i] = a[i].replace(__reArray, '');
						data[ a[i] ] = [];
	
						// Get the remainder of the nested object to set so we can recurse
						b = a.slice();
						b.splice( 0, i+1 );
						innerSrc = b.join('.');
	
						// Traverse each entry in the array setting the properties requested
						if ( Array.isArray( val ) )
						{
							for ( var j=0, jLen=val.length ; j<jLen ; j++ )
							{
								o = {};
								setData( o, val[j], innerSrc );
								data[ a[i] ].push( o );
							}
						}
						else
						{
							// We've been asked to save data to an array, but it
							// isn't array data to be saved. Best that can be done
							// is to just save the value.
							data[ a[i] ] = val;
						}
	
						// The inner call to setData has already traversed through the remainder
						// of the source and has set the data, thus we can exit here
						return;
					}
					else if ( funcNotation )
					{
						// Function call
						a[i] = a[i].replace(__reFn, '');
						data = data[ a[i] ]( val );
					}
	
					// If the nested object doesn't currently exist - since we are
					// trying to set the value - create it
					if ( data[ a[i] ] === null || data[ a[i] ] === undefined )
					{
						data[ a[i] ] = {};
					}
					data = data[ a[i] ];
				}
	
				// Last item in the input - i.e, the actual set
				if ( aLast.match(__reFn ) )
				{
					// Function call
					data = data[ aLast.replace(__reFn, '') ]( val );
				}
				else
				{
					// If array notation is used, we just want to strip it and use the property name
					// and assign the value. If it isn't used, then we get the result we want anyway
					data[ aLast.replace(__reArray, '') ] = val;
				}
			};
	
			return function (data, val) { // meta is also passed in, but not used
				return setData( data, val, mSource );
			};
		}
		else
		{
			/* Array or flat object mapping */
			return function (data, val) { // meta is also passed in, but not used
				data[mSource] = val;
			};
		}
	}
	
	
	/**
	 * Return an array with the full table data
	 *  @param {object} oSettings dataTables settings object
	 *  @returns array {array} aData Master data array
	 *  @memberof DataTable#oApi
	 */
	function _fnGetDataMaster ( settings )
	{
		return _pluck( settings.aoData, '_aData' );
	}
	
	
	/**
	 * Nuke the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnClearTable( settings )
	{
		settings.aoData.length = 0;
		settings.aiDisplayMaster.length = 0;
		settings.aiDisplay.length = 0;
		settings.aIds = {};
	}
	
	
	 /**
	 * Take an array of integers (index array) and remove a target integer (value - not
	 * the key!)
	 *  @param {array} a Index array to target
	 *  @param {int} iTarget value to find
	 *  @memberof DataTable#oApi
	 */
	function _fnDeleteIndex( a, iTarget, splice )
	{
		var iTargetIndex = -1;
	
		for ( var i=0, iLen=a.length ; i<iLen ; i++ )
		{
			if ( a[i] == iTarget )
			{
				iTargetIndex = i;
			}
			else if ( a[i] > iTarget )
			{
				a[i]--;
			}
		}
	
		if ( iTargetIndex != -1 && splice === undefined )
		{
			a.splice( iTargetIndex, 1 );
		}
	}
	
	
	/**
	 * Mark cached data as invalid such that a re-read of the data will occur when
	 * the cached data is next requested. Also update from the data source object.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {int}    rowIdx   Row index to invalidate
	 * @param {string} [src]    Source to invalidate from: undefined, 'auto', 'dom'
	 *     or 'data'
	 * @param {int}    [colIdx] Column index to invalidate. If undefined the whole
	 *     row will be invalidated
	 * @memberof DataTable#oApi
	 *
	 * @todo For the modularisation of v1.11 this will need to become a callback, so
	 *   the sort and filter methods can subscribe to it. That will required
	 *   initialisation options for sorting, which is why it is not already baked in
	 */
	function _fnInvalidate( settings, rowIdx, src, colIdx )
	{
		var row = settings.aoData[ rowIdx ];
		var i, ien;
		var cellWrite = function ( cell, col ) {
			// This is very frustrating, but in IE if you just write directly
			// to innerHTML, and elements that are overwritten are GC'ed,
			// even if there is a reference to them elsewhere
			while ( cell.childNodes.length ) {
				cell.removeChild( cell.firstChild );
			}
	
			cell.innerHTML = _fnGetCellData( settings, rowIdx, col, 'display' );
		};
	
		// Are we reading last data from DOM or the data object?
		if ( src === 'dom' || ((! src || src === 'auto') && row.src === 'dom') ) {
			// Read the data from the DOM
			row._aData = _fnGetRowElements(
					settings, row, colIdx, colIdx === undefined ? undefined : row._aData
				)
				.data;
		}
		else {
			// Reading from data object, update the DOM
			var cells = row.anCells;
	
			if ( cells ) {
				if ( colIdx !== undefined ) {
					cellWrite( cells[colIdx], colIdx );
				}
				else {
					for ( i=0, ien=cells.length ; i<ien ; i++ ) {
						cellWrite( cells[i], i );
					}
				}
			}
		}
	
		// For both row and cell invalidation, the cached data for sorting and
		// filtering is nulled out
		row._aSortData = null;
		row._aFilterData = null;
	
		// Invalidate the type for a specific column (if given) or all columns since
		// the data might have changed
		var cols = settings.aoColumns;
		if ( colIdx !== undefined ) {
			cols[ colIdx ].sType = null;
		}
		else {
			for ( i=0, ien=cols.length ; i<ien ; i++ ) {
				cols[i].sType = null;
			}
	
			// Update DataTables special `DT_*` attributes for the row
			_fnRowAttributes( settings, row );
		}
	}
	
	
	/**
	 * Build a data source object from an HTML row, reading the contents of the
	 * cells that are in the row.
	 *
	 * @param {object} settings DataTables settings object
	 * @param {node|object} TR element from which to read data or existing row
	 *   object from which to re-read the data from the cells
	 * @param {int} [colIdx] Optional column index
	 * @param {array|object} [d] Data source object. If `colIdx` is given then this
	 *   parameter should also be given and will be used to write the data into.
	 *   Only the column in question will be written
	 * @returns {object} Object with two parameters: `data` the data read, in
	 *   document order, and `cells` and array of nodes (they can be useful to the
	 *   caller, so rather than needing a second traversal to get them, just return
	 *   them from here).
	 * @memberof DataTable#oApi
	 */
	function _fnGetRowElements( settings, row, colIdx, d )
	{
		var
			tds = [],
			td = row.firstChild,
			name, col, o, i=0, contents,
			columns = settings.aoColumns,
			objectRead = settings._rowReadObject;
	
		// Allow the data object to be passed in, or construct
		d = d !== undefined ?
			d :
			objectRead ?
				{} :
				[];
	
		var attr = function ( str, td  ) {
			if ( typeof str === 'string' ) {
				var idx = str.indexOf('@');
	
				if ( idx !== -1 ) {
					var attr = str.substring( idx+1 );
					var setter = _fnSetObjectDataFn( str );
					setter( d, td.getAttribute( attr ) );
				}
			}
		};
	
		// Read data from a cell and store into the data object
		var cellProcess = function ( cell ) {
			if ( colIdx === undefined || colIdx === i ) {
				col = columns[i];
				contents = (cell.innerHTML).trim();
	
				if ( col && col._bAttrSrc ) {
					var setter = _fnSetObjectDataFn( col.mData._ );
					setter( d, contents );
	
					attr( col.mData.sort, cell );
					attr( col.mData.type, cell );
					attr( col.mData.filter, cell );
				}
				else {
					// Depending on the `data` option for the columns the data can
					// be read to either an object or an array.
					if ( objectRead ) {
						if ( ! col._setter ) {
							// Cache the setter function
							col._setter = _fnSetObjectDataFn( col.mData );
						}
						col._setter( d, contents );
					}
					else {
						d[i] = contents;
					}
				}
			}
	
			i++;
		};
	
		if ( td ) {
			// `tr` element was passed in
			while ( td ) {
				name = td.nodeName.toUpperCase();
	
				if ( name == "TD" || name == "TH" ) {
					cellProcess( td );
					tds.push( td );
				}
	
				td = td.nextSibling;
			}
		}
		else {
			// Existing row object passed in
			tds = row.anCells;
	
			for ( var j=0, jen=tds.length ; j<jen ; j++ ) {
				cellProcess( tds[j] );
			}
		}
	
		// Read the ID from the DOM if present
		var rowNode = row.firstChild ? row : row.nTr;
	
		if ( rowNode ) {
			var id = rowNode.getAttribute( 'id' );
	
			if ( id ) {
				_fnSetObjectDataFn( settings.rowId )( d, id );
			}
		}
	
		return {
			data: d,
			cells: tds
		};
	}
	/**
	 * Create a new TR element (and it's TD children) for a row
	 *  @param {object} oSettings dataTables settings object
	 *  @param {int} iRow Row to consider
	 *  @param {node} [nTrIn] TR element to add to the table - optional. If not given,
	 *    DataTables will create a row automatically
	 *  @param {array} [anTds] Array of TD|TH elements for the row - must be given
	 *    if nTr is.
	 *  @memberof DataTable#oApi
	 */
	function _fnCreateTr ( oSettings, iRow, nTrIn, anTds )
	{
		var
			row = oSettings.aoData[iRow],
			rowData = row._aData,
			cells = [],
			nTr, nTd, oCol,
			i, iLen, create;
	
		if ( row.nTr === null )
		{
			nTr = nTrIn || document.createElement('tr');
	
			row.nTr = nTr;
			row.anCells = cells;
	
			/* Use a private property on the node to allow reserve mapping from the node
			 * to the aoData array for fast look up
			 */
			nTr._DT_RowIndex = iRow;
	
			/* Special parameters can be given by the data source to be used on the row */
			_fnRowAttributes( oSettings, row );
	
			/* Process each column */
			for ( i=0, iLen=oSettings.aoColumns.length ; i<iLen ; i++ )
			{
				oCol = oSettings.aoColumns[i];
				create = nTrIn ? false : true;
	
				nTd = create ? document.createElement( oCol.sCellType ) : anTds[i];
				nTd._DT_CellIndex = {
					row: iRow,
					column: i
				};
				
				cells.push( nTd );
	
				// Need to create the HTML if new, or if a rendering function is defined
				if ( create || ((!nTrIn || oCol.mRender || oCol.mData !== i) &&
					 (!$.isPlainObject(oCol.mData) || oCol.mData._ !== i+'.display')
				)) {
					nTd.innerHTML = _fnGetCellData( oSettings, iRow, i, 'display' );
				}
	
				/* Add user defined class */
				if ( oCol.sClass )
				{
					nTd.className += ' '+oCol.sClass;
				}
	
				// Visibility - add or remove as required
				if ( oCol.bVisible && ! nTrIn )
				{
					nTr.appendChild( nTd );
				}
				else if ( ! oCol.bVisible && nTrIn )
				{
					nTd.parentNode.removeChild( nTd );
				}
	
				if ( oCol.fnCreatedCell )
				{
					oCol.fnCreatedCell.call( oSettings.oInstance,
						nTd, _fnGetCellData( oSettings, iRow, i ), rowData, iRow, i
					);
				}
			}
	
			_fnCallbackFire( oSettings, 'aoRowCreatedCallback', null, [nTr, rowData, iRow, cells] );
		}
	
		// Remove once webkit bug 131819 and Chromium bug 365619 have been resolved
		// and deployed
		row.nTr.setAttribute( 'role', 'row' );
	}
	
	
	/**
	 * Add attributes to a row based on the special `DT_*` parameters in a data
	 * source object.
	 *  @param {object} settings DataTables settings object
	 *  @param {object} DataTables row object for the row to be modified
	 *  @memberof DataTable#oApi
	 */
	function _fnRowAttributes( settings, row )
	{
		var tr = row.nTr;
		var data = row._aData;
	
		if ( tr ) {
			var id = settings.rowIdFn( data );
	
			if ( id ) {
				tr.id = id;
			}
	
			if ( data.DT_RowClass ) {
				// Remove any classes added by DT_RowClass before
				var a = data.DT_RowClass.split(' ');
				row.__rowc = row.__rowc ?
					_unique( row.__rowc.concat( a ) ) :
					a;
	
				$(tr)
					.removeClass( row.__rowc.join(' ') )
					.addClass( data.DT_RowClass );
			}
	
			if ( data.DT_RowAttr ) {
				$(tr).attr( data.DT_RowAttr );
			}
	
			if ( data.DT_RowData ) {
				$(tr).data( data.DT_RowData );
			}
		}
	}
	
	
	/**
	 * Create the HTML header for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnBuildHead( oSettings )
	{
		var i, ien, cell, row, column;
		var thead = oSettings.nTHead;
		var tfoot = oSettings.nTFoot;
		var createHeader = $('th, td', thead).length === 0;
		var classes = oSettings.oClasses;
		var columns = oSettings.aoColumns;
	
		if ( createHeader ) {
			row = $('<tr/>').appendTo( thead );
		}
	
		for ( i=0, ien=columns.length ; i<ien ; i++ ) {
			column = columns[i];
			cell = $( column.nTh ).addClass( column.sClass );
	
			if ( createHeader ) {
				cell.appendTo( row );
			}
	
			// 1.11 move into sorting
			if ( oSettings.oFeatures.bSort ) {
				cell.addClass( column.sSortingClass );
	
				if ( column.bSortable !== false ) {
					cell
						.attr( 'tabindex', oSettings.iTabIndex )
						.attr( 'aria-controls', oSettings.sTableId );
	
					_fnSortAttachListener( oSettings, column.nTh, i );
				}
			}
	
			if ( column.sTitle != cell[0].innerHTML ) {
				cell.html( column.sTitle );
			}
	
			_fnRenderer( oSettings, 'header' )(
				oSettings, cell, column, classes
			);
		}
	
		if ( createHeader ) {
			_fnDetectHeader( oSettings.aoHeader, thead );
		}
		
		/* ARIA role for the rows */
		$(thead).children('tr').attr('role', 'row');
	
		/* Deal with the footer - add classes if required */
		$(thead).children('tr').children('th, td').addClass( classes.sHeaderTH );
		$(tfoot).children('tr').children('th, td').addClass( classes.sFooterTH );
	
		// Cache the footer cells. Note that we only take the cells from the first
		// row in the footer. If there is more than one row the user wants to
		// interact with, they need to use the table().foot() method. Note also this
		// allows cells to be used for multiple columns using colspan
		if ( tfoot !== null ) {
			var cells = oSettings.aoFooter[0];
	
			for ( i=0, ien=cells.length ; i<ien ; i++ ) {
				column = columns[i];
				column.nTf = cells[i].cell;
	
				if ( column.sClass ) {
					$(column.nTf).addClass( column.sClass );
				}
			}
		}
	}
	
	
	/**
	 * Draw the header (or footer) element based on the column visibility states. The
	 * methodology here is to use the layout array from _fnDetectHeader, modified for
	 * the instantaneous column visibility, to construct the new layout. The grid is
	 * traversed over cell at a time in a rows x columns grid fashion, although each
	 * cell insert can cover multiple elements in the grid - which is tracks using the
	 * aApplied array. Cell inserts in the grid will only occur where there isn't
	 * already a cell in that position.
	 *  @param {object} oSettings dataTables settings object
	 *  @param array {objects} aoSource Layout array from _fnDetectHeader
	 *  @param {boolean} [bIncludeHidden=false] If true then include the hidden columns in the calc,
	 *  @memberof DataTable#oApi
	 */
	function _fnDrawHead( oSettings, aoSource, bIncludeHidden )
	{
		var i, iLen, j, jLen, k, kLen, n, nLocalTr;
		var aoLocal = [];
		var aApplied = [];
		var iColumns = oSettings.aoColumns.length;
		var iRowspan, iColspan;
	
		if ( ! aoSource )
		{
			return;
		}
	
		if (  bIncludeHidden === undefined )
		{
			bIncludeHidden = false;
		}
	
		/* Make a copy of the master layout array, but without the visible columns in it */
		for ( i=0, iLen=aoSource.length ; i<iLen ; i++ )
		{
			aoLocal[i] = aoSource[i].slice();
			aoLocal[i].nTr = aoSource[i].nTr;
	
			/* Remove any columns which are currently hidden */
			for ( j=iColumns-1 ; j>=0 ; j-- )
			{
				if ( !oSettings.aoColumns[j].bVisible && !bIncludeHidden )
				{
					aoLocal[i].splice( j, 1 );
				}
			}
	
			/* Prep the applied array - it needs an element for each row */
			aApplied.push( [] );
		}
	
		for ( i=0, iLen=aoLocal.length ; i<iLen ; i++ )
		{
			nLocalTr = aoLocal[i].nTr;
	
			/* All cells are going to be replaced, so empty out the row */
			if ( nLocalTr )
			{
				while( (n = nLocalTr.firstChild) )
				{
					nLocalTr.removeChild( n );
				}
			}
	
			for ( j=0, jLen=aoLocal[i].length ; j<jLen ; j++ )
			{
				iRowspan = 1;
				iColspan = 1;
	
				/* Check to see if there is already a cell (row/colspan) covering our target
				 * insert point. If there is, then there is nothing to do.
				 */
				if ( aApplied[i][j] === undefined )
				{
					nLocalTr.appendChild( aoLocal[i][j].cell );
					aApplied[i][j] = 1;
	
					/* Expand the cell to cover as many rows as needed */
					while ( aoLocal[i+iRowspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i+iRowspan][j].cell )
					{
						aApplied[i+iRowspan][j] = 1;
						iRowspan++;
					}
	
					/* Expand the cell to cover as many columns as needed */
					while ( aoLocal[i][j+iColspan] !== undefined &&
					        aoLocal[i][j].cell == aoLocal[i][j+iColspan].cell )
					{
						/* Must update the applied array over the rows for the columns */
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aApplied[i+k][j+iColspan] = 1;
						}
						iColspan++;
					}
	
					/* Do the actual expansion in the DOM */
					$(aoLocal[i][j].cell)
						.attr('rowspan', iRowspan)
						.attr('colspan', iColspan);
				}
			}
		}
	}
	
	
	/**
	 * Insert the required TR nodes into the table for display
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnDraw( oSettings )
	{
		/* Provide a pre-callback function which can be used to cancel the draw is false is returned */
		var aPreDraw = _fnCallbackFire( oSettings, 'aoPreDrawCallback', 'preDraw', [oSettings] );
		if ( $.inArray( false, aPreDraw ) !== -1 )
		{
			_fnProcessingDisplay( oSettings, false );
			return;
		}
	
		var i, iLen, n;
		var anRows = [];
		var iRowCount = 0;
		var asStripeClasses = oSettings.asStripeClasses;
		var iStripes = asStripeClasses.length;
		var iOpenRows = oSettings.aoOpenRows.length;
		var oLang = oSettings.oLanguage;
		var iInitDisplayStart = oSettings.iInitDisplayStart;
		var bServerSide = _fnDataSource( oSettings ) == 'ssp';
		var aiDisplay = oSettings.aiDisplay;
	
		oSettings.bDrawing = true;
	
		/* Check and see if we have an initial draw position from state saving */
		if ( iInitDisplayStart !== undefined && iInitDisplayStart !== -1 )
		{
			oSettings._iDisplayStart = bServerSide ?
				iInitDisplayStart :
				iInitDisplayStart >= oSettings.fnRecordsDisplay() ?
					0 :
					iInitDisplayStart;
	
			oSettings.iInitDisplayStart = -1;
		}
	
		var iDisplayStart = oSettings._iDisplayStart;
		var iDisplayEnd = oSettings.fnDisplayEnd();
	
		/* Server-side processing draw intercept */
		if ( oSettings.bDeferLoading )
		{
			oSettings.bDeferLoading = false;
			oSettings.iDraw++;
			_fnProcessingDisplay( oSettings, false );
		}
		else if ( !bServerSide )
		{
			oSettings.iDraw++;
		}
		else if ( !oSettings.bDestroying && !_fnAjaxUpdate( oSettings ) )
		{
			return;
		}
	
		if ( aiDisplay.length !== 0 )
		{
			var iStart = bServerSide ? 0 : iDisplayStart;
			var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
	
			for ( var j=iStart ; j<iEnd ; j++ )
			{
				var iDataIndex = aiDisplay[j];
				var aoData = oSettings.aoData[ iDataIndex ];
				if ( aoData.nTr === null )
				{
					_fnCreateTr( oSettings, iDataIndex );
				}
	
				var nRow = aoData.nTr;
	
				/* Remove the old striping classes and then add the new one */
				if ( iStripes !== 0 )
				{
					var sStripe = asStripeClasses[ iRowCount % iStripes ];
					if ( aoData._sRowStripe != sStripe )
					{
						$(nRow).removeClass( aoData._sRowStripe ).addClass( sStripe );
						aoData._sRowStripe = sStripe;
					}
				}
	
				// Row callback functions - might want to manipulate the row
				// iRowCount and j are not currently documented. Are they at all
				// useful?
				_fnCallbackFire( oSettings, 'aoRowCallback', null,
					[nRow, aoData._aData, iRowCount, j, iDataIndex] );
	
				anRows.push( nRow );
				iRowCount++;
			}
		}
		else
		{
			/* Table is empty - create a row with an empty message in it */
			var sZero = oLang.sZeroRecords;
			if ( oSettings.iDraw == 1 &&  _fnDataSource( oSettings ) == 'ajax' )
			{
				sZero = oLang.sLoadingRecords;
			}
			else if ( oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0 )
			{
				sZero = oLang.sEmptyTable;
			}
	
			anRows[ 0 ] = $( '<tr/>', { 'class': iStripes ? asStripeClasses[0] : '' } )
				.append( $('<td />', {
					'valign':  'top',
					'colSpan': _fnVisbleColumns( oSettings ),
					'class':   oSettings.oClasses.sRowEmpty
				} ).html( sZero ) )[0];
		}
	
		/* Header and footer callbacks */
		_fnCallbackFire( oSettings, 'aoHeaderCallback', 'header', [ $(oSettings.nTHead).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		_fnCallbackFire( oSettings, 'aoFooterCallback', 'footer', [ $(oSettings.nTFoot).children('tr')[0],
			_fnGetDataMaster( oSettings ), iDisplayStart, iDisplayEnd, aiDisplay ] );
	
		var body = $(oSettings.nTBody);
	
		body.children().detach();
		body.append( $(anRows) );
	
		/* Call all required callback functions for the end of a draw */
		_fnCallbackFire( oSettings, 'aoDrawCallback', 'draw', [oSettings] );
	
		/* Draw is complete, sorting and filtering must be as well */
		oSettings.bSorted = false;
		oSettings.bFiltered = false;
		oSettings.bDrawing = false;
	}
	
	
	/**
	 * Redraw the table - taking account of the various features which are enabled
	 *  @param {object} oSettings dataTables settings object
	 *  @param {boolean} [holdPosition] Keep the current paging position. By default
	 *    the paging is reset to the first page
	 *  @memberof DataTable#oApi
	 */
	function _fnReDraw( settings, holdPosition )
	{
		var
			features = settings.oFeatures,
			sort     = features.bSort,
			filter   = features.bFilter;
	
		if ( sort ) {
			_fnSort( settings );
		}
	
		if ( filter ) {
			_fnFilterComplete( settings, settings.oPreviousSearch );
		}
		else {
			// No filtering, so we want to just use the display master
			settings.aiDisplay = settings.aiDisplayMaster.slice();
		}
	
		if ( holdPosition !== true ) {
			settings._iDisplayStart = 0;
		}
	
		// Let any modules know about the draw hold position state (used by
		// scrolling internally)
		settings._drawHold = holdPosition;
	
		_fnDraw( settings );
	
		settings._drawHold = false;
	}
	
	
	/**
	 * Add the options to the page HTML for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnAddOptionsHtml ( oSettings )
	{
		var classes = oSettings.oClasses;
		var table = $(oSettings.nTable);
		var holding = $('<div/>').insertBefore( table ); // Holding element for speed
		var features = oSettings.oFeatures;
	
		// All DataTables are wrapped in a div
		var insert = $('<div/>', {
			id:      oSettings.sTableId+'_wrapper',
			'class': classes.sWrapper + (oSettings.nTFoot ? '' : ' '+classes.sNoFooter)
		} );
	
		oSettings.nHolding = holding[0];
		oSettings.nTableWrapper = insert[0];
		oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
	
		/* Loop over the user set positioning and place the elements as needed */
		var aDom = oSettings.sDom.split('');
		var featureNode, cOption, nNewNode, cNext, sAttr, j;
		for ( var i=0 ; i<aDom.length ; i++ )
		{
			featureNode = null;
			cOption = aDom[i];
	
			if ( cOption == '<' )
			{
				/* New container div */
				nNewNode = $('<div/>')[0];
	
				/* Check to see if we should append an id and/or a class name to the container */
				cNext = aDom[i+1];
				if ( cNext == "'" || cNext == '"' )
				{
					sAttr = "";
					j = 2;
					while ( aDom[i+j] != cNext )
					{
						sAttr += aDom[i+j];
						j++;
					}
	
					/* Replace jQuery UI constants @todo depreciated */
					if ( sAttr == "H" )
					{
						sAttr = classes.sJUIHeader;
					}
					else if ( sAttr == "F" )
					{
						sAttr = classes.sJUIFooter;
					}
	
					/* The attribute can be in the format of "#id.class", "#id" or "class" This logic
					 * breaks the string into parts and applies them as needed
					 */
					if ( sAttr.indexOf('.') != -1 )
					{
						var aSplit = sAttr.split('.');
						nNewNode.id = aSplit[0].substr(1, aSplit[0].length-1);
						nNewNode.className = aSplit[1];
					}
					else if ( sAttr.charAt(0) == "#" )
					{
						nNewNode.id = sAttr.substr(1, sAttr.length-1);
					}
					else
					{
						nNewNode.className = sAttr;
					}
	
					i += j; /* Move along the position array */
				}
	
				insert.append( nNewNode );
				insert = $(nNewNode);
			}
			else if ( cOption == '>' )
			{
				/* End container div */
				insert = insert.parent();
			}
			// @todo Move options into their own plugins?
			else if ( cOption == 'l' && features.bPaginate && features.bLengthChange )
			{
				/* Length */
				featureNode = _fnFeatureHtmlLength( oSettings );
			}
			else if ( cOption == 'f' && features.bFilter )
			{
				/* Filter */
				featureNode = _fnFeatureHtmlFilter( oSettings );
			}
			else if ( cOption == 'r' && features.bProcessing )
			{
				/* pRocessing */
				featureNode = _fnFeatureHtmlProcessing( oSettings );
			}
			else if ( cOption == 't' )
			{
				/* Table */
				featureNode = _fnFeatureHtmlTable( oSettings );
			}
			else if ( cOption ==  'i' && features.bInfo )
			{
				/* Info */
				featureNode = _fnFeatureHtmlInfo( oSettings );
			}
			else if ( cOption == 'p' && features.bPaginate )
			{
				/* Pagination */
				featureNode = _fnFeatureHtmlPaginate( oSettings );
			}
			else if ( DataTable.ext.feature.length !== 0 )
			{
				/* Plug-in features */
				var aoFeatures = DataTable.ext.feature;
				for ( var k=0, kLen=aoFeatures.length ; k<kLen ; k++ )
				{
					if ( cOption == aoFeatures[k].cFeature )
					{
						featureNode = aoFeatures[k].fnInit( oSettings );
						break;
					}
				}
			}
	
			/* Add to the 2D features array */
			if ( featureNode )
			{
				var aanFeatures = oSettings.aanFeatures;
	
				if ( ! aanFeatures[cOption] )
				{
					aanFeatures[cOption] = [];
				}
	
				aanFeatures[cOption].push( featureNode );
				insert.append( featureNode );
			}
		}
	
		/* Built our DOM structure - replace the holding div with what we want */
		holding.replaceWith( insert );
		oSettings.nHolding = null;
	}
	
	
	/**
	 * Use the DOM source to create up an array of header cells. The idea here is to
	 * create a layout grid (array) of rows x columns, which contains a reference
	 * to the cell that that point in the grid (regardless of col/rowspan), such that
	 * any column / row could be removed and the new grid constructed
	 *  @param array {object} aLayout Array to store the calculated layout in
	 *  @param {node} nThead The header/footer element for the table
	 *  @memberof DataTable#oApi
	 */
	function _fnDetectHeader ( aLayout, nThead )
	{
		var nTrs = $(nThead).children('tr');
		var nTr, nCell;
		var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
		var bUnique;
		var fnShiftCol = function ( a, i, j ) {
			var k = a[i];
	                while ( k[j] ) {
				j++;
			}
			return j;
		};
	
		aLayout.splice( 0, aLayout.length );
	
		/* We know how many rows there are in the layout - so prep it */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			aLayout.push( [] );
		}
	
		/* Calculate a layout array */
		for ( i=0, iLen=nTrs.length ; i<iLen ; i++ )
		{
			nTr = nTrs[i];
			iColumn = 0;
	
			/* For every cell in the row... */
			nCell = nTr.firstChild;
			while ( nCell ) {
				if ( nCell.nodeName.toUpperCase() == "TD" ||
				     nCell.nodeName.toUpperCase() == "TH" )
				{
					/* Get the col and rowspan attributes from the DOM and sanitise them */
					iColspan = nCell.getAttribute('colspan') * 1;
					iRowspan = nCell.getAttribute('rowspan') * 1;
					iColspan = (!iColspan || iColspan===0 || iColspan===1) ? 1 : iColspan;
					iRowspan = (!iRowspan || iRowspan===0 || iRowspan===1) ? 1 : iRowspan;
	
					/* There might be colspan cells already in this row, so shift our target
					 * accordingly
					 */
					iColShifted = fnShiftCol( aLayout, i, iColumn );
	
					/* Cache calculation for unique columns */
					bUnique = iColspan === 1 ? true : false;
	
					/* If there is col / rowspan, copy the information into the layout grid */
					for ( l=0 ; l<iColspan ; l++ )
					{
						for ( k=0 ; k<iRowspan ; k++ )
						{
							aLayout[i+k][iColShifted+l] = {
								"cell": nCell,
								"unique": bUnique
							};
							aLayout[i+k].nTr = nTr;
						}
					}
				}
				nCell = nCell.nextSibling;
			}
		}
	}
	
	
	/**
	 * Get an array of unique th elements, one for each column
	 *  @param {object} oSettings dataTables settings object
	 *  @param {node} nHeader automatically detect the layout from this node - optional
	 *  @param {array} aLayout thead/tfoot layout from _fnDetectHeader - optional
	 *  @returns array {node} aReturn list of unique th's
	 *  @memberof DataTable#oApi
	 */
	function _fnGetUniqueThs ( oSettings, nHeader, aLayout )
	{
		var aReturn = [];
		if ( !aLayout )
		{
			aLayout = oSettings.aoHeader;
			if ( nHeader )
			{
				aLayout = [];
				_fnDetectHeader( aLayout, nHeader );
			}
		}
	
		for ( var i=0, iLen=aLayout.length ; i<iLen ; i++ )
		{
			for ( var j=0, jLen=aLayout[i].length ; j<jLen ; j++ )
			{
				if ( aLayout[i][j].unique &&
					 (!aReturn[j] || !oSettings.bSortCellsTop) )
				{
					aReturn[j] = aLayout[i][j].cell;
				}
			}
		}
	
		return aReturn;
	}
	
	/**
	 * Create an Ajax call based on the table's settings, taking into account that
	 * parameters can have multiple forms, and backwards compatibility.
	 *
	 * @param {object} oSettings dataTables settings object
	 * @param {array} data Data to send to the server, required by
	 *     DataTables - may be augmented by developer callbacks
	 * @param {function} fn Callback function to run when data is obtained
	 */
	function _fnBuildAjax( oSettings, data, fn )
	{
		// Compatibility with 1.9-, allow fnServerData and event to manipulate
		_fnCallbackFire( oSettings, 'aoServerParams', 'serverParams', [data] );
	
		// Convert to object based for 1.10+ if using the old array scheme which can
		// come from server-side processing or serverParams
		if ( data && Array.isArray(data) ) {
			var tmp = {};
			var rbracket = /(.*?)\[\]$/;
	
			$.each( data, function (key, val) {
				var match = val.name.match(rbracket);
	
				if ( match ) {
					// Support for arrays
					var name = match[0];
	
					if ( ! tmp[ name ] ) {
						tmp[ name ] = [];
					}
					tmp[ name ].push( val.value );
				}
				else {
					tmp[val.name] = val.value;
				}
			} );
			data = tmp;
		}
	
		var ajaxData;
		var ajax = oSettings.ajax;
		var instance = oSettings.oInstance;
		var callback = function ( json ) {
			_fnCallbackFire( oSettings, null, 'xhr', [oSettings, json, oSettings.jqXHR] );
			fn( json );
		};
	
		if ( $.isPlainObject( ajax ) && ajax.data )
		{
			ajaxData = ajax.data;
	
			var newData = typeof ajaxData === 'function' ?
				ajaxData( data, oSettings ) :  // fn can manipulate data or return
				ajaxData;                      // an object object or array to merge
	
			// If the function returned something, use that alone
			data = typeof ajaxData === 'function' && newData ?
				newData :
				$.extend( true, data, newData );
	
			// Remove the data property as we've resolved it already and don't want
			// jQuery to do it again (it is restored at the end of the function)
			delete ajax.data;
		}
	
		var baseAjax = {
			"data": data,
			"success": function (json) {
				var error = json.error || json.sError;
				if ( error ) {
					_fnLog( oSettings, 0, error );
				}
	
				oSettings.json = json;
				callback( json );
			},
			"dataType": "json",
			"cache": false,
			"type": oSettings.sServerMethod,
			"error": function (xhr, error, thrown) {
				var ret = _fnCallbackFire( oSettings, null, 'xhr', [oSettings, null, oSettings.jqXHR] );
	
				if ( $.inArray( true, ret ) === -1 ) {
					if ( error == "parsererror" ) {
						_fnLog( oSettings, 0, 'Invalid JSON response', 1 );
					}
					else if ( xhr.readyState === 4 ) {
						_fnLog( oSettings, 0, 'Ajax error', 7 );
					}
				}
	
				_fnProcessingDisplay( oSettings, false );
			}
		};
	
		// Store the data submitted for the API
		oSettings.oAjaxData = data;
	
		// Allow plug-ins and external processes to modify the data
		_fnCallbackFire( oSettings, null, 'preXhr', [oSettings, data] );
	
		if ( oSettings.fnServerData )
		{
			// DataTables 1.9- compatibility
			oSettings.fnServerData.call( instance,
				oSettings.sAjaxSource,
				$.map( data, function (val, key) { // Need to convert back to 1.9 trad format
					return { name: key, value: val };
				} ),
				callback,
				oSettings
			);
		}
		else if ( oSettings.sAjaxSource || typeof ajax === 'string' )
		{
			// DataTables 1.9- compatibility
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, {
				url: ajax || oSettings.sAjaxSource
			} ) );
		}
		else if ( typeof ajax === 'function' )
		{
			// Is a function - let the caller define what needs to be done
			oSettings.jqXHR = ajax.call( instance, data, callback, oSettings );
		}
		else
		{
			// Object to extend the base settings
			oSettings.jqXHR = $.ajax( $.extend( baseAjax, ajax ) );
	
			// Restore for next time around
			ajax.data = ajaxData;
		}
	}
	
	
	/**
	 * Update the table using an Ajax call
	 *  @param {object} settings dataTables settings object
	 *  @returns {boolean} Block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdate( settings )
	{
		if ( settings.bAjaxDataGet ) {
			settings.iDraw++;
			_fnProcessingDisplay( settings, true );
	
			_fnBuildAjax(
				settings,
				_fnAjaxParameters( settings ),
				function(json) {
					_fnAjaxUpdateDraw( settings, json );
				}
			);
	
			return false;
		}
		return true;
	}
	
	
	/**
	 * Build up the parameters in an object needed for a server-side processing
	 * request. Note that this is basically done twice, is different ways - a modern
	 * method which is used by default in DataTables 1.10 which uses objects and
	 * arrays, or the 1.9- method with is name / value pairs. 1.9 method is used if
	 * the sAjaxSource option is used in the initialisation, or the legacyAjax
	 * option is set.
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {bool} block the table drawing or not
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxParameters( settings )
	{
		var
			columns = settings.aoColumns,
			columnCount = columns.length,
			features = settings.oFeatures,
			preSearch = settings.oPreviousSearch,
			preColSearch = settings.aoPreSearchCols,
			i, data = [], dataProp, column, columnSearch,
			sort = _fnSortFlatten( settings ),
			displayStart = settings._iDisplayStart,
			displayLength = features.bPaginate !== false ?
				settings._iDisplayLength :
				-1;
	
		var param = function ( name, value ) {
			data.push( { 'name': name, 'value': value } );
		};
	
		// DataTables 1.9- compatible method
		param( 'sEcho',          settings.iDraw );
		param( 'iColumns',       columnCount );
		param( 'sColumns',       _pluck( columns, 'sName' ).join(',') );
		param( 'iDisplayStart',  displayStart );
		param( 'iDisplayLength', displayLength );
	
		// DataTables 1.10+ method
		var d = {
			draw:    settings.iDraw,
			columns: [],
			order:   [],
			start:   displayStart,
			length:  displayLength,
			search:  {
				value: preSearch.sSearch,
				regex: preSearch.bRegex
			}
		};
	
		for ( i=0 ; i<columnCount ; i++ ) {
			column = columns[i];
			columnSearch = preColSearch[i];
			dataProp = typeof column.mData=="function" ? 'function' : column.mData ;
	
			d.columns.push( {
				data:       dataProp,
				name:       column.sName,
				searchable: column.bSearchable,
				orderable:  column.bSortable,
				search:     {
					value: columnSearch.sSearch,
					regex: columnSearch.bRegex
				}
			} );
	
			param( "mDataProp_"+i, dataProp );
	
			if ( features.bFilter ) {
				param( 'sSearch_'+i,     columnSearch.sSearch );
				param( 'bRegex_'+i,      columnSearch.bRegex );
				param( 'bSearchable_'+i, column.bSearchable );
			}
	
			if ( features.bSort ) {
				param( 'bSortable_'+i, column.bSortable );
			}
		}
	
		if ( features.bFilter ) {
			param( 'sSearch', preSearch.sSearch );
			param( 'bRegex', preSearch.bRegex );
		}
	
		if ( features.bSort ) {
			$.each( sort, function ( i, val ) {
				d.order.push( { column: val.col, dir: val.dir } );
	
				param( 'iSortCol_'+i, val.col );
				param( 'sSortDir_'+i, val.dir );
			} );
	
			param( 'iSortingCols', sort.length );
		}
	
		// If the legacy.ajax parameter is null, then we automatically decide which
		// form to use, based on sAjaxSource
		var legacy = DataTable.ext.legacy.ajax;
		if ( legacy === null ) {
			return settings.sAjaxSource ? data : d;
		}
	
		// Otherwise, if legacy has been specified then we use that to decide on the
		// form
		return legacy ? data : d;
	}
	
	
	/**
	 * Data the data from the server (nuking the old) and redraw the table
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} json json data return from the server.
	 *  @param {string} json.sEcho Tracking flag for DataTables to match requests
	 *  @param {int} json.iTotalRecords Number of records in the data set, not accounting for filtering
	 *  @param {int} json.iTotalDisplayRecords Number of records in the data set, accounting for filtering
	 *  @param {array} json.aaData The data to display on this page
	 *  @param {string} [json.sColumns] Column ordering (sName, comma separated)
	 *  @memberof DataTable#oApi
	 */
	function _fnAjaxUpdateDraw ( settings, json )
	{
		// v1.10 uses camelCase variables, while 1.9 uses Hungarian notation.
		// Support both
		var compat = function ( old, modern ) {
			return json[old] !== undefined ? json[old] : json[modern];
		};
	
		var data = _fnAjaxDataSrc( settings, json );
		var draw            = compat( 'sEcho',                'draw' );
		var recordsTotal    = compat( 'iTotalRecords',        'recordsTotal' );
		var recordsFiltered = compat( 'iTotalDisplayRecords', 'recordsFiltered' );
	
		if ( draw !== undefined ) {
			// Protect against out of sequence returns
			if ( draw*1 < settings.iDraw ) {
				return;
			}
			settings.iDraw = draw * 1;
		}
	
		_fnClearTable( settings );
		settings._iRecordsTotal   = parseInt(recordsTotal, 10);
		settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
	
		for ( var i=0, ien=data.length ; i<ien ; i++ ) {
			_fnAddData( settings, data[i] );
		}
		settings.aiDisplay = settings.aiDisplayMaster.slice();
	
		settings.bAjaxDataGet = false;
		_fnDraw( settings );
	
		if ( ! settings._bInitComplete ) {
			_fnInitComplete( settings, json );
		}
	
		settings.bAjaxDataGet = true;
		_fnProcessingDisplay( settings, false );
	}
	
	
	/**
	 * Get the data from the JSON data source to use for drawing a table. Using
	 * `_fnGetObjectDataFn` allows the data to be sourced from a property of the
	 * source object, or from a processing function.
	 *  @param {object} oSettings dataTables settings object
	 *  @param  {object} json Data source object / array from the server
	 *  @return {array} Array of data to use
	 */
	function _fnAjaxDataSrc ( oSettings, json )
	{
		var dataSrc = $.isPlainObject( oSettings.ajax ) && oSettings.ajax.dataSrc !== undefined ?
			oSettings.ajax.dataSrc :
			oSettings.sAjaxDataProp; // Compatibility with 1.9-.
	
		// Compatibility with 1.9-. In order to read from aaData, check if the
		// default has been changed, if not, check for aaData
		if ( dataSrc === 'data' ) {
			return json.aaData || json[dataSrc];
		}
	
		return dataSrc !== "" ?
			_fnGetObjectDataFn( dataSrc )( json ) :
			json;
	}
	
	/**
	 * Generate the node required for filtering text
	 *  @returns {node} Filter control element
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlFilter ( settings )
	{
		var classes = settings.oClasses;
		var tableId = settings.sTableId;
		var language = settings.oLanguage;
		var previousSearch = settings.oPreviousSearch;
		var features = settings.aanFeatures;
		var input = '<input type="search" class="'+classes.sFilterInput+'"/>';
	
		var str = language.sSearch;
		str = str.match(/_INPUT_/) ?
			str.replace('_INPUT_', input) :
			str+input;
	
		var filter = $('<div/>', {
				'id': ! features.f ? tableId+'_filter' : null,
				'class': classes.sFilter
			} )
			.append( $('<label/>' ).append( str ) );
	
		var searchFn = function() {
			/* Update all other filter input elements for the new display */
			var n = features.f;
			var val = !this.value ? "" : this.value; // mental IE8 fix :-(
	
			/* Now do the filter */
			if ( val != previousSearch.sSearch ) {
				_fnFilterComplete( settings, {
					"sSearch": val,
					"bRegex": previousSearch.bRegex,
					"bSmart": previousSearch.bSmart ,
					"bCaseInsensitive": previousSearch.bCaseInsensitive
				} );
	
				// Need to redraw, without resorting
				settings._iDisplayStart = 0;
				_fnDraw( settings );
			}
		};
	
		var searchDelay = settings.searchDelay !== null ?
			settings.searchDelay :
			_fnDataSource( settings ) === 'ssp' ?
				400 :
				0;
	
		var jqFilter = $('input', filter)
			.val( previousSearch.sSearch )
			.attr( 'placeholder', language.sSearchPlaceholder )
			.on(
				'keyup.DT search.DT input.DT paste.DT cut.DT',
				searchDelay ?
					_fnThrottle( searchFn, searchDelay ) :
					searchFn
			)
			.on( 'mouseup', function(e) {
				// Edge fix! Edge 17 does not trigger anything other than mouse events when clicking
				// on the clear icon (Edge bug 17584515). This is safe in other browsers as `searchFn`
				// checks the value to see if it has changed. In other browsers it won't have.
				setTimeout( function () {
					searchFn.call(jqFilter[0]);
				}, 10);
			} )
			.on( 'keypress.DT', function(e) {
				/* Prevent form submission */
				if ( e.keyCode == 13 ) {
					return false;
				}
			} )
			.attr('aria-controls', tableId);
	
		// Update the input elements whenever the table is filtered
		$(settings.nTable).on( 'search.dt.DT', function ( ev, s ) {
			if ( settings === s ) {
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame...
				try {
					if ( jqFilter[0] !== document.activeElement ) {
						jqFilter.val( previousSearch.sSearch );
					}
				}
				catch ( e ) {}
			}
		} );
	
		return filter[0];
	}
	
	
	/**
	 * Filter the table using both the global filter and column based filtering
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oSearch search information
	 *  @param {int} [iForce] force a research of the master array (1) or not (undefined or 0)
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterComplete ( oSettings, oInput, iForce )
	{
		var oPrevSearch = oSettings.oPreviousSearch;
		var aoPrevSearch = oSettings.aoPreSearchCols;
		var fnSaveFilter = function ( oFilter ) {
			/* Save the filtering values */
			oPrevSearch.sSearch = oFilter.sSearch;
			oPrevSearch.bRegex = oFilter.bRegex;
			oPrevSearch.bSmart = oFilter.bSmart;
			oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
		};
		var fnRegex = function ( o ) {
			// Backwards compatibility with the bEscapeRegex option
			return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
		};
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo As per sort - can this be moved into an event handler?
		_fnColumnTypes( oSettings );
	
		/* In server-side processing all filtering is done by the server, so no point hanging around here */
		if ( _fnDataSource( oSettings ) != 'ssp' )
		{
			/* Global filter */
			_fnFilter( oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive );
			fnSaveFilter( oInput );
	
			/* Now do the individual column filter */
			for ( var i=0 ; i<aoPrevSearch.length ; i++ )
			{
				_fnFilterColumn( oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]),
					aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive );
			}
	
			/* Custom filtering */
			_fnFilterCustom( oSettings );
		}
		else
		{
			fnSaveFilter( oInput );
		}
	
		/* Tell the draw function we have been filtering */
		oSettings.bFiltered = true;
		_fnCallbackFire( oSettings, null, 'search', [oSettings] );
	}
	
	
	/**
	 * Apply custom filtering functions
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCustom( settings )
	{
		var filters = DataTable.ext.search;
		var displayRows = settings.aiDisplay;
		var row, rowIdx;
	
		for ( var i=0, ien=filters.length ; i<ien ; i++ ) {
			var rows = [];
	
			// Loop over each row and see if it should be included
			for ( var j=0, jen=displayRows.length ; j<jen ; j++ ) {
				rowIdx = displayRows[ j ];
				row = settings.aoData[ rowIdx ];
	
				if ( filters[i]( settings, row._aFilterData, rowIdx, row._aData, j ) ) {
					rows.push( rowIdx );
				}
			}
	
			// So the array reference doesn't break set the results into the
			// existing array
			displayRows.length = 0;
			$.merge( displayRows, rows );
		}
	}
	
	
	/**
	 * Filter the table on a per-column basis
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sInput string to filter on
	 *  @param {int} iColumn column to filter
	 *  @param {bool} bRegex treat search string as a regular expression or not
	 *  @param {bool} bSmart use smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterColumn ( settings, searchStr, colIdx, regex, smart, caseInsensitive )
	{
		if ( searchStr === '' ) {
			return;
		}
	
		var data;
		var out = [];
		var display = settings.aiDisplay;
		var rpSearch = _fnFilterCreateSearch( searchStr, regex, smart, caseInsensitive );
	
		for ( var i=0 ; i<display.length ; i++ ) {
			data = settings.aoData[ display[i] ]._aFilterData[ colIdx ];
	
			if ( rpSearch.test( data ) ) {
				out.push( display[i] );
			}
		}
	
		settings.aiDisplay = out;
	}
	
	
	/**
	 * Filter the data table based on user input and draw the table
	 *  @param {object} settings dataTables settings object
	 *  @param {string} input string to filter on
	 *  @param {int} force optional - force a research of the master array (1) or not (undefined or 0)
	 *  @param {bool} regex treat as a regular expression or not
	 *  @param {bool} smart perform smart filtering or not
	 *  @param {bool} caseInsensitive Do case insenstive matching or not
	 *  @memberof DataTable#oApi
	 */
	function _fnFilter( settings, input, force, regex, smart, caseInsensitive )
	{
		var rpSearch = _fnFilterCreateSearch( input, regex, smart, caseInsensitive );
		var prevSearch = settings.oPreviousSearch.sSearch;
		var displayMaster = settings.aiDisplayMaster;
		var display, invalidated, i;
		var filtered = [];
	
		// Need to take account of custom filtering functions - always filter
		if ( DataTable.ext.search.length !== 0 ) {
			force = true;
		}
	
		// Check if any of the rows were invalidated
		invalidated = _fnFilterData( settings );
	
		// If the input is blank - we just want the full data set
		if ( input.length <= 0 ) {
			settings.aiDisplay = displayMaster.slice();
		}
		else {
			// New search - start from the master array
			if ( invalidated ||
				 force ||
				 regex ||
				 prevSearch.length > input.length ||
				 input.indexOf(prevSearch) !== 0 ||
				 settings.bSorted // On resort, the display master needs to be
				                  // re-filtered since indexes will have changed
			) {
				settings.aiDisplay = displayMaster.slice();
			}
	
			// Search the display array
			display = settings.aiDisplay;
	
			for ( i=0 ; i<display.length ; i++ ) {
				if ( rpSearch.test( settings.aoData[ display[i] ]._sFilterRow ) ) {
					filtered.push( display[i] );
				}
			}
	
			settings.aiDisplay = filtered;
		}
	}
	
	
	/**
	 * Build a regular expression object suitable for searching a table
	 *  @param {string} sSearch string to search for
	 *  @param {bool} bRegex treat as a regular expression or not
	 *  @param {bool} bSmart perform smart filtering or not
	 *  @param {bool} bCaseInsensitive Do case insensitive matching or not
	 *  @returns {RegExp} constructed object
	 *  @memberof DataTable#oApi
	 */
	function _fnFilterCreateSearch( search, regex, smart, caseInsensitive )
	{
		search = regex ?
			search :
			_fnEscapeRegex( search );
		
		if ( smart ) {
			/* For smart filtering we want to allow the search to work regardless of
			 * word order. We also want double quoted text to be preserved, so word
			 * order is important - a la google. So this is what we want to
			 * generate:
			 * 
			 * ^(?=.*?\bone\b)(?=.*?\btwo three\b)(?=.*?\bfour\b).*$
			 */
			var a = $.map( search.match( /"[^"]+"|[^ ]+/g ) || [''], function ( word ) {
				if ( word.charAt(0) === '"' ) {
					var m = word.match( /^"(.*)"$/ );
					word = m ? m[1] : word;
				}
	
				return word.replace('"', '');
			} );
	
			search = '^(?=.*?'+a.join( ')(?=.*?' )+').*$';
		}
	
		return new RegExp( search, caseInsensitive ? 'i' : '' );
	}
	
	
	/**
	 * Escape a string such that it can be used in a regular expression
	 *  @param {string} sVal string to escape
	 *  @returns {string} escaped string
	 *  @memberof DataTable#oApi
	 */
	var _fnEscapeRegex = DataTable.util.escapeRegex;
	
	var __filter_div = $('<div>')[0];
	var __filter_div_textContent = __filter_div.textContent !== undefined;
	
	// Update the filtering data for each row if needed (by invalidation or first run)
	function _fnFilterData ( settings )
	{
		var columns = settings.aoColumns;
		var column;
		var i, j, ien, jen, filterData, cellData, row;
		var fomatters = DataTable.ext.type.search;
		var wasInvalidated = false;
	
		for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aFilterData ) {
				filterData = [];
	
				for ( j=0, jen=columns.length ; j<jen ; j++ ) {
					column = columns[j];
	
					if ( column.bSearchable ) {
						cellData = _fnGetCellData( settings, i, j, 'filter' );
	
						if ( fomatters[ column.sType ] ) {
							cellData = fomatters[ column.sType ]( cellData );
						}
	
						// Search in DataTables 1.10 is string based. In 1.11 this
						// should be altered to also allow strict type checking.
						if ( cellData === null ) {
							cellData = '';
						}
	
						if ( typeof cellData !== 'string' && cellData.toString ) {
							cellData = cellData.toString();
						}
					}
					else {
						cellData = '';
					}
	
					// If it looks like there is an HTML entity in the string,
					// attempt to decode it so sorting works as expected. Note that
					// we could use a single line of jQuery to do this, but the DOM
					// method used here is much faster http://jsperf.com/html-decode
					if ( cellData.indexOf && cellData.indexOf('&') !== -1 ) {
						__filter_div.innerHTML = cellData;
						cellData = __filter_div_textContent ?
							__filter_div.textContent :
							__filter_div.innerText;
					}
	
					if ( cellData.replace ) {
						cellData = cellData.replace(/[\r\n\u2028]/g, '');
					}
	
					filterData.push( cellData );
				}
	
				row._aFilterData = filterData;
				row._sFilterRow = filterData.join('  ');
				wasInvalidated = true;
			}
		}
	
		return wasInvalidated;
	}
	
	
	/**
	 * Convert from the internal Hungarian notation to camelCase for external
	 * interaction
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToCamel ( obj )
	{
		return {
			search:          obj.sSearch,
			smart:           obj.bSmart,
			regex:           obj.bRegex,
			caseInsensitive: obj.bCaseInsensitive
		};
	}
	
	
	
	/**
	 * Convert from camelCase notation to the internal Hungarian. We could use the
	 * Hungarian convert function here, but this is cleaner
	 *  @param {object} obj Object to convert
	 *  @returns {object} Inverted object
	 *  @memberof DataTable#oApi
	 */
	function _fnSearchToHung ( obj )
	{
		return {
			sSearch:          obj.search,
			bSmart:           obj.smart,
			bRegex:           obj.regex,
			bCaseInsensitive: obj.caseInsensitive
		};
	}
	
	/**
	 * Generate the node required for the info display
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Information element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlInfo ( settings )
	{
		var
			tid = settings.sTableId,
			nodes = settings.aanFeatures.i,
			n = $('<div/>', {
				'class': settings.oClasses.sInfo,
				'id': ! nodes ? tid+'_info' : null
			} );
	
		if ( ! nodes ) {
			// Update display on each draw
			settings.aoDrawCallback.push( {
				"fn": _fnUpdateInfo,
				"sName": "information"
			} );
	
			n
				.attr( 'role', 'status' )
				.attr( 'aria-live', 'polite' );
	
			// Table is described by our info div
			$(settings.nTable).attr( 'aria-describedby', tid+'_info' );
		}
	
		return n[0];
	}
	
	
	/**
	 * Update the information elements in the display
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnUpdateInfo ( settings )
	{
		/* Show information about the table */
		var nodes = settings.aanFeatures.i;
		if ( nodes.length === 0 ) {
			return;
		}
	
		var
			lang  = settings.oLanguage,
			start = settings._iDisplayStart+1,
			end   = settings.fnDisplayEnd(),
			max   = settings.fnRecordsTotal(),
			total = settings.fnRecordsDisplay(),
			out   = total ?
				lang.sInfo :
				lang.sInfoEmpty;
	
		if ( total !== max ) {
			/* Record set after filtering */
			out += ' ' + lang.sInfoFiltered;
		}
	
		// Convert the macros
		out += lang.sInfoPostFix;
		out = _fnInfoMacros( settings, out );
	
		var callback = lang.fnInfoCallback;
		if ( callback !== null ) {
			out = callback.call( settings.oInstance,
				settings, start, end, max, total, out
			);
		}
	
		$(nodes).html( out );
	}
	
	
	function _fnInfoMacros ( settings, str )
	{
		// When infinite scrolling, we are always starting at 1. _iDisplayStart is used only
		// internally
		var
			formatter  = settings.fnFormatNumber,
			start      = settings._iDisplayStart+1,
			len        = settings._iDisplayLength,
			vis        = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return str.
			replace(/_START_/g, formatter.call( settings, start ) ).
			replace(/_END_/g,   formatter.call( settings, settings.fnDisplayEnd() ) ).
			replace(/_MAX_/g,   formatter.call( settings, settings.fnRecordsTotal() ) ).
			replace(/_TOTAL_/g, formatter.call( settings, vis ) ).
			replace(/_PAGE_/g,  formatter.call( settings, all ? 1 : Math.ceil( start / len ) ) ).
			replace(/_PAGES_/g, formatter.call( settings, all ? 1 : Math.ceil( vis / len ) ) );
	}
	
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnInitialise ( settings )
	{
		var i, iLen, iAjaxStart=settings.iInitDisplayStart;
		var columns = settings.aoColumns, column;
		var features = settings.oFeatures;
		var deferLoading = settings.bDeferLoading; // value modified by the draw
	
		/* Ensure that the table data is fully initialised */
		if ( ! settings.bInitialised ) {
			setTimeout( function(){ _fnInitialise( settings ); }, 200 );
			return;
		}
	
		/* Show the display HTML options */
		_fnAddOptionsHtml( settings );
	
		/* Build and draw the header / footer for the table */
		_fnBuildHead( settings );
		_fnDrawHead( settings, settings.aoHeader );
		_fnDrawHead( settings, settings.aoFooter );
	
		/* Okay to show that something is going on now */
		_fnProcessingDisplay( settings, true );
	
		/* Calculate sizes for columns */
		if ( features.bAutoWidth ) {
			_fnCalculateColumnWidths( settings );
		}
	
		for ( i=0, iLen=columns.length ; i<iLen ; i++ ) {
			column = columns[i];
	
			if ( column.sWidth ) {
				column.nTh.style.width = _fnStringToCss( column.sWidth );
			}
		}
	
		_fnCallbackFire( settings, null, 'preInit', [settings] );
	
		// If there is default sorting required - let's do it. The sort function
		// will do the drawing for us. Otherwise we draw the table regardless of the
		// Ajax source - this allows the table to look initialised for Ajax sourcing
		// data (show 'loading' message possibly)
		_fnReDraw( settings );
	
		// Server-side processing init complete is done by _fnAjaxUpdateDraw
		var dataSrc = _fnDataSource( settings );
		if ( dataSrc != 'ssp' || deferLoading ) {
			// if there is an ajax source load the data
			if ( dataSrc == 'ajax' ) {
				_fnBuildAjax( settings, [], function(json) {
					var aData = _fnAjaxDataSrc( settings, json );
	
					// Got the data - add it to the table
					for ( i=0 ; i<aData.length ; i++ ) {
						_fnAddData( settings, aData[i] );
					}
	
					// Reset the init display for cookie saving. We've already done
					// a filter, and therefore cleared it before. So we need to make
					// it appear 'fresh'
					settings.iInitDisplayStart = iAjaxStart;
	
					_fnReDraw( settings );
	
					_fnProcessingDisplay( settings, false );
					_fnInitComplete( settings, json );
				}, settings );
			}
			else {
				_fnProcessingDisplay( settings, false );
				_fnInitComplete( settings );
			}
		}
	}
	
	
	/**
	 * Draw the table for the first time, adding all required features
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} [json] JSON from the server that completed the table, if using Ajax source
	 *    with client-side processing (optional)
	 *  @memberof DataTable#oApi
	 */
	function _fnInitComplete ( settings, json )
	{
		settings._bInitComplete = true;
	
		// When data was added after the initialisation (data or Ajax) we need to
		// calculate the column sizing
		if ( json || settings.oInit.aaData ) {
			_fnAdjustColumnSizing( settings );
		}
	
		_fnCallbackFire( settings, null, 'plugin-init', [settings, json] );
		_fnCallbackFire( settings, 'aoInitComplete', 'init', [settings, json] );
	}
	
	
	function _fnLengthChange ( settings, val )
	{
		var len = parseInt( val, 10 );
		settings._iDisplayLength = len;
	
		_fnLengthOverflow( settings );
	
		// Fire length change event
		_fnCallbackFire( settings, null, 'length', [settings, len] );
	}
	
	
	/**
	 * Generate the node required for user display length changing
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Display length feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlLength ( settings )
	{
		var
			classes  = settings.oClasses,
			tableId  = settings.sTableId,
			menu     = settings.aLengthMenu,
			d2       = Array.isArray( menu[0] ),
			lengths  = d2 ? menu[0] : menu,
			language = d2 ? menu[1] : menu;
	
		var select = $('<select/>', {
			'name':          tableId+'_length',
			'aria-controls': tableId,
			'class':         classes.sLengthSelect
		} );
	
		for ( var i=0, ien=lengths.length ; i<ien ; i++ ) {
			select[0][ i ] = new Option(
				typeof language[i] === 'number' ?
					settings.fnFormatNumber( language[i] ) :
					language[i],
				lengths[i]
			);
		}
	
		var div = $('<div><label/></div>').addClass( classes.sLength );
		if ( ! settings.aanFeatures.l ) {
			div[0].id = tableId+'_length';
		}
	
		div.children().append(
			settings.oLanguage.sLengthMenu.replace( '_MENU_', select[0].outerHTML )
		);
	
		// Can't use `select` variable as user might provide their own and the
		// reference is broken by the use of outerHTML
		$('select', div)
			.val( settings._iDisplayLength )
			.on( 'change.DT', function(e) {
				_fnLengthChange( settings, $(this).val() );
				_fnDraw( settings );
			} );
	
		// Update node value whenever anything changes the table's length
		$(settings.nTable).on( 'length.dt.DT', function (e, s, len) {
			if ( settings === s ) {
				$('select', div).val( len );
			}
		} );
	
		return div[0];
	}
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Note that most of the paging logic is done in
	 * DataTable.ext.pager
	 */
	
	/**
	 * Generate the node required for default pagination
	 *  @param {object} oSettings dataTables settings object
	 *  @returns {node} Pagination feature node
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlPaginate ( settings )
	{
		var
			type   = settings.sPaginationType,
			plugin = DataTable.ext.pager[ type ],
			modern = typeof plugin === 'function',
			redraw = function( settings ) {
				_fnDraw( settings );
			},
			node = $('<div/>').addClass( settings.oClasses.sPaging + type )[0],
			features = settings.aanFeatures;
	
		if ( ! modern ) {
			plugin.fnInit( settings, node, redraw );
		}
	
		/* Add a draw callback for the pagination on first instance, to update the paging display */
		if ( ! features.p )
		{
			node.id = settings.sTableId+'_paginate';
	
			settings.aoDrawCallback.push( {
				"fn": function( settings ) {
					if ( modern ) {
						var
							start      = settings._iDisplayStart,
							len        = settings._iDisplayLength,
							visRecords = settings.fnRecordsDisplay(),
							all        = len === -1,
							page = all ? 0 : Math.ceil( start / len ),
							pages = all ? 1 : Math.ceil( visRecords / len ),
							buttons = plugin(page, pages),
							i, ien;
	
						for ( i=0, ien=features.p.length ; i<ien ; i++ ) {
							_fnRenderer( settings, 'pageButton' )(
								settings, features.p[i], i, buttons, page, pages
							);
						}
					}
					else {
						plugin.fnUpdate( settings, redraw );
					}
				},
				"sName": "pagination"
			} );
		}
	
		return node;
	}
	
	
	/**
	 * Alter the display settings to change the page
	 *  @param {object} settings DataTables settings object
	 *  @param {string|int} action Paging action to take: "first", "previous",
	 *    "next" or "last" or page number to jump to (integer)
	 *  @param [bool] redraw Automatically draw the update or not
	 *  @returns {bool} true page has changed, false - no change
	 *  @memberof DataTable#oApi
	 */
	function _fnPageChange ( settings, action, redraw )
	{
		var
			start     = settings._iDisplayStart,
			len       = settings._iDisplayLength,
			records   = settings.fnRecordsDisplay();
	
		if ( records === 0 || len === -1 )
		{
			start = 0;
		}
		else if ( typeof action === "number" )
		{
			start = action * len;
	
			if ( start > records )
			{
				start = 0;
			}
		}
		else if ( action == "first" )
		{
			start = 0;
		}
		else if ( action == "previous" )
		{
			start = len >= 0 ?
				start - len :
				0;
	
			if ( start < 0 )
			{
			  start = 0;
			}
		}
		else if ( action == "next" )
		{
			if ( start + len < records )
			{
				start += len;
			}
		}
		else if ( action == "last" )
		{
			start = Math.floor( (records-1) / len) * len;
		}
		else
		{
			_fnLog( settings, 0, "Unknown paging action: "+action, 5 );
		}
	
		var changed = settings._iDisplayStart !== start;
		settings._iDisplayStart = start;
	
		if ( changed ) {
			_fnCallbackFire( settings, null, 'page', [settings] );
	
			if ( redraw ) {
				_fnDraw( settings );
			}
		}
	
		return changed;
	}
	
	
	
	/**
	 * Generate the node required for the processing node
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Processing element
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlProcessing ( settings )
	{
		return $('<div/>', {
				'id': ! settings.aanFeatures.r ? settings.sTableId+'_processing' : null,
				'class': settings.oClasses.sProcessing
			} )
			.html( settings.oLanguage.sProcessing )
			.insertBefore( settings.nTable )[0];
	}
	
	
	/**
	 * Display or hide the processing indicator
	 *  @param {object} settings dataTables settings object
	 *  @param {bool} show Show the processing indicator (true) or not (false)
	 *  @memberof DataTable#oApi
	 */
	function _fnProcessingDisplay ( settings, show )
	{
		if ( settings.oFeatures.bProcessing ) {
			$(settings.aanFeatures.r).css( 'display', show ? 'block' : 'none' );
		}
	
		_fnCallbackFire( settings, null, 'processing', [settings, show] );
	}
	
	/**
	 * Add any control elements for the table - specifically scrolling
	 *  @param {object} settings dataTables settings object
	 *  @returns {node} Node to add to the DOM
	 *  @memberof DataTable#oApi
	 */
	function _fnFeatureHtmlTable ( settings )
	{
		var table = $(settings.nTable);
	
		// Add the ARIA grid role to the table
		table.attr( 'role', 'grid' );
	
		// Scrolling from here on in
		var scroll = settings.oScroll;
	
		if ( scroll.sX === '' && scroll.sY === '' ) {
			return settings.nTable;
		}
	
		var scrollX = scroll.sX;
		var scrollY = scroll.sY;
		var classes = settings.oClasses;
		var caption = table.children('caption');
		var captionSide = caption.length ? caption[0]._captionSide : null;
		var headerClone = $( table[0].cloneNode(false) );
		var footerClone = $( table[0].cloneNode(false) );
		var footer = table.children('tfoot');
		var _div = '<div/>';
		var size = function ( s ) {
			return !s ? null : _fnStringToCss( s );
		};
	
		if ( ! footer.length ) {
			footer = null;
		}
	
		/*
		 * The HTML structure that we want to generate in this function is:
		 *  div - scroller
		 *    div - scroll head
		 *      div - scroll head inner
		 *        table - scroll head table
		 *          thead - thead
		 *    div - scroll body
		 *      table - table (master table)
		 *        thead - thead clone for sizing
		 *        tbody - tbody
		 *    div - scroll foot
		 *      div - scroll foot inner
		 *        table - scroll foot table
		 *          tfoot - tfoot
		 */
		var scroller = $( _div, { 'class': classes.sScrollWrapper } )
			.append(
				$(_div, { 'class': classes.sScrollHead } )
					.css( {
						overflow: 'hidden',
						position: 'relative',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollHeadInner } )
							.css( {
								'box-sizing': 'content-box',
								width: scroll.sXInner || '100%'
							} )
							.append(
								headerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'top' ? caption : null )
									.append(
										table.children('thead')
									)
							)
					)
			)
			.append(
				$(_div, { 'class': classes.sScrollBody } )
					.css( {
						position: 'relative',
						overflow: 'auto',
						width: size( scrollX )
					} )
					.append( table )
			);
	
		if ( footer ) {
			scroller.append(
				$(_div, { 'class': classes.sScrollFoot } )
					.css( {
						overflow: 'hidden',
						border: 0,
						width: scrollX ? size(scrollX) : '100%'
					} )
					.append(
						$(_div, { 'class': classes.sScrollFootInner } )
							.append(
								footerClone
									.removeAttr('id')
									.css( 'margin-left', 0 )
									.append( captionSide === 'bottom' ? caption : null )
									.append(
										table.children('tfoot')
									)
							)
					)
			);
		}
	
		var children = scroller.children();
		var scrollHead = children[0];
		var scrollBody = children[1];
		var scrollFoot = footer ? children[2] : null;
	
		// When the body is scrolled, then we also want to scroll the headers
		if ( scrollX ) {
			$(scrollBody).on( 'scroll.DT', function (e) {
				var scrollLeft = this.scrollLeft;
	
				scrollHead.scrollLeft = scrollLeft;
	
				if ( footer ) {
					scrollFoot.scrollLeft = scrollLeft;
				}
			} );
		}
	
		$(scrollBody).css('max-height', scrollY);
		if (! scroll.bCollapse) {
			$(scrollBody).css('height', scrollY);
		}
	
		settings.nScrollHead = scrollHead;
		settings.nScrollBody = scrollBody;
		settings.nScrollFoot = scrollFoot;
	
		// On redraw - align columns
		settings.aoDrawCallback.push( {
			"fn": _fnScrollDraw,
			"sName": "scrolling"
		} );
	
		return scroller[0];
	}
	
	
	
	/**
	 * Update the header, footer and body tables for resizing - i.e. column
	 * alignment.
	 *
	 * Welcome to the most horrible function DataTables. The process that this
	 * function follows is basically:
	 *   1. Re-create the table inside the scrolling div
	 *   2. Take live measurements from the DOM
	 *   3. Apply the measurements to align the columns
	 *   4. Clean up
	 *
	 *  @param {object} settings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnScrollDraw ( settings )
	{
		// Given that this is such a monster function, a lot of variables are use
		// to try and keep the minimised size as small as possible
		var
			scroll         = settings.oScroll,
			scrollX        = scroll.sX,
			scrollXInner   = scroll.sXInner,
			scrollY        = scroll.sY,
			barWidth       = scroll.iBarWidth,
			divHeader      = $(settings.nScrollHead),
			divHeaderStyle = divHeader[0].style,
			divHeaderInner = divHeader.children('div'),
			divHeaderInnerStyle = divHeaderInner[0].style,
			divHeaderTable = divHeaderInner.children('table'),
			divBodyEl      = settings.nScrollBody,
			divBody        = $(divBodyEl),
			divBodyStyle   = divBodyEl.style,
			divFooter      = $(settings.nScrollFoot),
			divFooterInner = divFooter.children('div'),
			divFooterTable = divFooterInner.children('table'),
			header         = $(settings.nTHead),
			table          = $(settings.nTable),
			tableEl        = table[0],
			tableStyle     = tableEl.style,
			footer         = settings.nTFoot ? $(settings.nTFoot) : null,
			browser        = settings.oBrowser,
			ie67           = browser.bScrollOversize,
			dtHeaderCells  = _pluck( settings.aoColumns, 'nTh' ),
			headerTrgEls, footerTrgEls,
			headerSrcEls, footerSrcEls,
			headerCopy, footerCopy,
			headerWidths=[], footerWidths=[],
			headerContent=[], footerContent=[],
			idx, correction, sanityWidth,
			zeroOut = function(nSizer) {
				var style = nSizer.style;
				style.paddingTop = "0";
				style.paddingBottom = "0";
				style.borderTopWidth = "0";
				style.borderBottomWidth = "0";
				style.height = 0;
			};
	
		// If the scrollbar visibility has changed from the last draw, we need to
		// adjust the column sizes as the table width will have changed to account
		// for the scrollbar
		var scrollBarVis = divBodyEl.scrollHeight > divBodyEl.clientHeight;
		
		if ( settings.scrollBarVis !== scrollBarVis && settings.scrollBarVis !== undefined ) {
			settings.scrollBarVis = scrollBarVis;
			_fnAdjustColumnSizing( settings );
			return; // adjust column sizing will call this function again
		}
		else {
			settings.scrollBarVis = scrollBarVis;
		}
	
		/*
		 * 1. Re-create the table inside the scrolling div
		 */
	
		// Remove the old minimised thead and tfoot elements in the inner table
		table.children('thead, tfoot').remove();
	
		if ( footer ) {
			footerCopy = footer.clone().prependTo( table );
			footerTrgEls = footer.find('tr'); // the original tfoot is in its own table and must be sized
			footerSrcEls = footerCopy.find('tr');
		}
	
		// Clone the current header and footer elements and then place it into the inner table
		headerCopy = header.clone().prependTo( table );
		headerTrgEls = header.find('tr'); // original header is in its own table
		headerSrcEls = headerCopy.find('tr');
		headerCopy.find('th, td').removeAttr('tabindex');
	
	
		/*
		 * 2. Take live measurements from the DOM - do not alter the DOM itself!
		 */
	
		// Remove old sizing and apply the calculated column widths
		// Get the unique column headers in the newly created (cloned) header. We want to apply the
		// calculated sizes to this header
		if ( ! scrollX )
		{
			divBodyStyle.width = '100%';
			divHeader[0].style.width = '100%';
		}
	
		$.each( _fnGetUniqueThs( settings, headerCopy ), function ( i, el ) {
			idx = _fnVisibleToColumnIndex( settings, i );
			el.style.width = settings.aoColumns[idx].sWidth;
		} );
	
		if ( footer ) {
			_fnApplyToChildren( function(n) {
				n.style.width = "";
			}, footerSrcEls );
		}
	
		// Size the table as a whole
		sanityWidth = table.outerWidth();
		if ( scrollX === "" ) {
			// No x scrolling
			tableStyle.width = "100%";
	
			// IE7 will make the width of the table when 100% include the scrollbar
			// - which is shouldn't. When there is a scrollbar we need to take this
			// into account.
			if ( ie67 && (table.find('tbody').height() > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( table.outerWidth() - barWidth);
			}
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
		else if ( scrollXInner !== "" ) {
			// legacy x scroll inner has been given - use it
			tableStyle.width = _fnStringToCss(scrollXInner);
	
			// Recalculate the sanity width
			sanityWidth = table.outerWidth();
		}
	
		// Hidden header should have zero height, so remove padding and borders. Then
		// set the width based on the real headers
	
		// Apply all styles in one pass
		_fnApplyToChildren( zeroOut, headerSrcEls );
	
		// Read all widths in next pass
		_fnApplyToChildren( function(nSizer) {
			headerContent.push( nSizer.innerHTML );
			headerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
		}, headerSrcEls );
	
		// Apply all widths in final pass
		_fnApplyToChildren( function(nToSize, i) {
			// Only apply widths to the DataTables detected header cells - this
			// prevents complex headers from having contradictory sizes applied
			if ( $.inArray( nToSize, dtHeaderCells ) !== -1 ) {
				nToSize.style.width = headerWidths[i];
			}
		}, headerTrgEls );
	
		$(headerSrcEls).height(0);
	
		/* Same again with the footer if we have one */
		if ( footer )
		{
			_fnApplyToChildren( zeroOut, footerSrcEls );
	
			_fnApplyToChildren( function(nSizer) {
				footerContent.push( nSizer.innerHTML );
				footerWidths.push( _fnStringToCss( $(nSizer).css('width') ) );
			}, footerSrcEls );
	
			_fnApplyToChildren( function(nToSize, i) {
				nToSize.style.width = footerWidths[i];
			}, footerTrgEls );
	
			$(footerSrcEls).height(0);
		}
	
	
		/*
		 * 3. Apply the measurements
		 */
	
		// "Hide" the header and footer that we used for the sizing. We need to keep
		// the content of the cell so that the width applied to the header and body
		// both match, but we want to hide it completely. We want to also fix their
		// width to what they currently are
		_fnApplyToChildren( function(nSizer, i) {
			nSizer.innerHTML = '<div class="dataTables_sizing">'+headerContent[i]+'</div>';
			nSizer.childNodes[0].style.height = "0";
			nSizer.childNodes[0].style.overflow = "hidden";
			nSizer.style.width = headerWidths[i];
		}, headerSrcEls );
	
		if ( footer )
		{
			_fnApplyToChildren( function(nSizer, i) {
				nSizer.innerHTML = '<div class="dataTables_sizing">'+footerContent[i]+'</div>';
				nSizer.childNodes[0].style.height = "0";
				nSizer.childNodes[0].style.overflow = "hidden";
				nSizer.style.width = footerWidths[i];
			}, footerSrcEls );
		}
	
		// Sanity check that the table is of a sensible width. If not then we are going to get
		// misalignment - try to prevent this by not allowing the table to shrink below its min width
		if ( table.outerWidth() < sanityWidth )
		{
			// The min width depends upon if we have a vertical scrollbar visible or not */
			correction = ((divBodyEl.scrollHeight > divBodyEl.offsetHeight ||
				divBody.css('overflow-y') == "scroll")) ?
					sanityWidth+barWidth :
					sanityWidth;
	
			// IE6/7 are a law unto themselves...
			if ( ie67 && (divBodyEl.scrollHeight >
				divBodyEl.offsetHeight || divBody.css('overflow-y') == "scroll")
			) {
				tableStyle.width = _fnStringToCss( correction-barWidth );
			}
	
			// And give the user a warning that we've stopped the table getting too small
			if ( scrollX === "" || scrollXInner !== "" ) {
				_fnLog( settings, 1, 'Possible column misalignment', 6 );
			}
		}
		else
		{
			correction = '100%';
		}
	
		// Apply to the container elements
		divBodyStyle.width = _fnStringToCss( correction );
		divHeaderStyle.width = _fnStringToCss( correction );
	
		if ( footer ) {
			settings.nScrollFoot.style.width = _fnStringToCss( correction );
		}
	
	
		/*
		 * 4. Clean up
		 */
		if ( ! scrollY ) {
			/* IE7< puts a vertical scrollbar in place (when it shouldn't be) due to subtracting
			 * the scrollbar height from the visible display, rather than adding it on. We need to
			 * set the height in order to sort this. Don't want to do it in any other browsers.
			 */
			if ( ie67 ) {
				divBodyStyle.height = _fnStringToCss( tableEl.offsetHeight+barWidth );
			}
		}
	
		/* Finally set the width's of the header and footer tables */
		var iOuterWidth = table.outerWidth();
		divHeaderTable[0].style.width = _fnStringToCss( iOuterWidth );
		divHeaderInnerStyle.width = _fnStringToCss( iOuterWidth );
	
		// Figure out if there are scrollbar present - if so then we need a the header and footer to
		// provide a bit more space to allow "overflow" scrolling (i.e. past the scrollbar)
		var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css('overflow-y') == "scroll";
		var padding = 'padding' + (browser.bScrollbarLeft ? 'Left' : 'Right' );
		divHeaderInnerStyle[ padding ] = bScrolling ? barWidth+"px" : "0px";
	
		if ( footer ) {
			divFooterTable[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style.width = _fnStringToCss( iOuterWidth );
			divFooterInner[0].style[padding] = bScrolling ? barWidth+"px" : "0px";
		}
	
		// Correct DOM ordering for colgroup - comes before the thead
		table.children('colgroup').insertBefore( table.children('thead') );
	
		/* Adjust the position of the header in case we loose the y-scrollbar */
		divBody.trigger('scroll');
	
		// If sorting or filtering has occurred, jump the scrolling back to the top
		// only if we aren't holding the position
		if ( (settings.bSorted || settings.bFiltered) && ! settings._drawHold ) {
			divBodyEl.scrollTop = 0;
		}
	}
	
	
	
	/**
	 * Apply a given function to the display child nodes of an element array (typically
	 * TD children of TR rows
	 *  @param {function} fn Method to apply to the objects
	 *  @param array {nodes} an1 List of elements to look through for display children
	 *  @param array {nodes} an2 Another list (identical structure to the first) - optional
	 *  @memberof DataTable#oApi
	 */
	function _fnApplyToChildren( fn, an1, an2 )
	{
		var index=0, i=0, iLen=an1.length;
		var nNode1, nNode2;
	
		while ( i < iLen ) {
			nNode1 = an1[i].firstChild;
			nNode2 = an2 ? an2[i].firstChild : null;
	
			while ( nNode1 ) {
				if ( nNode1.nodeType === 1 ) {
					if ( an2 ) {
						fn( nNode1, nNode2, index );
					}
					else {
						fn( nNode1, index );
					}
	
					index++;
				}
	
				nNode1 = nNode1.nextSibling;
				nNode2 = an2 ? nNode2.nextSibling : null;
			}
	
			i++;
		}
	}
	
	
	
	var __re_html_remove = /<.*?>/g;
	
	
	/**
	 * Calculate the width of columns for the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnCalculateColumnWidths ( oSettings )
	{
		var
			table = oSettings.nTable,
			columns = oSettings.aoColumns,
			scroll = oSettings.oScroll,
			scrollY = scroll.sY,
			scrollX = scroll.sX,
			scrollXInner = scroll.sXInner,
			columnCount = columns.length,
			visibleColumns = _fnGetColumns( oSettings, 'bVisible' ),
			headerCells = $('th', oSettings.nTHead),
			tableWidthAttr = table.getAttribute('width'), // from DOM element
			tableContainer = table.parentNode,
			userInputs = false,
			i, column, columnIdx, width, outerWidth,
			browser = oSettings.oBrowser,
			ie67 = browser.bScrollOversize;
	
		var styleWidth = table.style.width;
		if ( styleWidth && styleWidth.indexOf('%') !== -1 ) {
			tableWidthAttr = styleWidth;
		}
	
		/* Convert any user input sizes into pixel sizes */
		for ( i=0 ; i<visibleColumns.length ; i++ ) {
			column = columns[ visibleColumns[i] ];
	
			if ( column.sWidth !== null ) {
				column.sWidth = _fnConvertToWidth( column.sWidthOrig, tableContainer );
	
				userInputs = true;
			}
		}
	
		/* If the number of columns in the DOM equals the number that we have to
		 * process in DataTables, then we can use the offsets that are created by
		 * the web- browser. No custom sizes can be set in order for this to happen,
		 * nor scrolling used
		 */
		if ( ie67 || ! userInputs && ! scrollX && ! scrollY &&
		     columnCount == _fnVisbleColumns( oSettings ) &&
		     columnCount == headerCells.length
		) {
			for ( i=0 ; i<columnCount ; i++ ) {
				var colIdx = _fnVisibleToColumnIndex( oSettings, i );
	
				if ( colIdx !== null ) {
					columns[ colIdx ].sWidth = _fnStringToCss( headerCells.eq(i).width() );
				}
			}
		}
		else
		{
			// Otherwise construct a single row, worst case, table with the widest
			// node in the data, assign any user defined widths, then insert it into
			// the DOM and allow the browser to do all the hard work of calculating
			// table widths
			var tmpTable = $(table).clone() // don't use cloneNode - IE8 will remove events on the main table
				.css( 'visibility', 'hidden' )
				.removeAttr( 'id' );
	
			// Clean up the table body
			tmpTable.find('tbody tr').remove();
			var tr = $('<tr/>').appendTo( tmpTable.find('tbody') );
	
			// Clone the table header and footer - we can't use the header / footer
			// from the cloned table, since if scrolling is active, the table's
			// real header and footer are contained in different table tags
			tmpTable.find('thead, tfoot').remove();
			tmpTable
				.append( $(oSettings.nTHead).clone() )
				.append( $(oSettings.nTFoot).clone() );
	
			// Remove any assigned widths from the footer (from scrolling)
			tmpTable.find('tfoot th, tfoot td').css('width', '');
	
			// Apply custom sizing to the cloned header
			headerCells = _fnGetUniqueThs( oSettings, tmpTable.find('thead')[0] );
	
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				column = columns[ visibleColumns[i] ];
	
				headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== '' ?
					_fnStringToCss( column.sWidthOrig ) :
					'';
	
				// For scrollX we need to force the column width otherwise the
				// browser will collapse it. If this width is smaller than the
				// width the column requires, then it will have no effect
				if ( column.sWidthOrig && scrollX ) {
					$( headerCells[i] ).append( $('<div/>').css( {
						width: column.sWidthOrig,
						margin: 0,
						padding: 0,
						border: 0,
						height: 1
					} ) );
				}
			}
	
			// Find the widest cell for each column and put it into the table
			if ( oSettings.aoData.length ) {
				for ( i=0 ; i<visibleColumns.length ; i++ ) {
					columnIdx = visibleColumns[i];
					column = columns[ columnIdx ];
	
					$( _fnGetWidestNode( oSettings, columnIdx ) )
						.clone( false )
						.append( column.sContentPadding )
						.appendTo( tr );
				}
			}
	
			// Tidy the temporary table - remove name attributes so there aren't
			// duplicated in the dom (radio elements for example)
			$('[name]', tmpTable).removeAttr('name');
	
			// Table has been built, attach to the document so we can work with it.
			// A holding element is used, positioned at the top of the container
			// with minimal height, so it has no effect on if the container scrolls
			// or not. Otherwise it might trigger scrolling when it actually isn't
			// needed
			var holder = $('<div/>').css( scrollX || scrollY ?
					{
						position: 'absolute',
						top: 0,
						left: 0,
						height: 1,
						right: 0,
						overflow: 'hidden'
					} :
					{}
				)
				.append( tmpTable )
				.appendTo( tableContainer );
	
			// When scrolling (X or Y) we want to set the width of the table as 
			// appropriate. However, when not scrolling leave the table width as it
			// is. This results in slightly different, but I think correct behaviour
			if ( scrollX && scrollXInner ) {
				tmpTable.width( scrollXInner );
			}
			else if ( scrollX ) {
				tmpTable.css( 'width', 'auto' );
				tmpTable.removeAttr('width');
	
				// If there is no width attribute or style, then allow the table to
				// collapse
				if ( tmpTable.width() < tableContainer.clientWidth && tableWidthAttr ) {
					tmpTable.width( tableContainer.clientWidth );
				}
			}
			else if ( scrollY ) {
				tmpTable.width( tableContainer.clientWidth );
			}
			else if ( tableWidthAttr ) {
				tmpTable.width( tableWidthAttr );
			}
	
			// Get the width of each column in the constructed table - we need to
			// know the inner width (so it can be assigned to the other table's
			// cells) and the outer width so we can calculate the full width of the
			// table. This is safe since DataTables requires a unique cell for each
			// column, but if ever a header can span multiple columns, this will
			// need to be modified.
			var total = 0;
			for ( i=0 ; i<visibleColumns.length ; i++ ) {
				var cell = $(headerCells[i]);
				var border = cell.outerWidth() - cell.width();
	
				// Use getBounding... where possible (not IE8-) because it can give
				// sub-pixel accuracy, which we then want to round up!
				var bounding = browser.bBounding ?
					Math.ceil( headerCells[i].getBoundingClientRect().width ) :
					cell.outerWidth();
	
				// Total is tracked to remove any sub-pixel errors as the outerWidth
				// of the table might not equal the total given here (IE!).
				total += bounding;
	
				// Width for each column to use
				columns[ visibleColumns[i] ].sWidth = _fnStringToCss( bounding - border );
			}
	
			table.style.width = _fnStringToCss( total );
	
			// Finished with the table - ditch it
			holder.remove();
		}
	
		// If there is a width attr, we want to attach an event listener which
		// allows the table sizing to automatically adjust when the window is
		// resized. Use the width attr rather than CSS, since we can't know if the
		// CSS is a relative value or absolute - DOM read is always px.
		if ( tableWidthAttr ) {
			table.style.width = _fnStringToCss( tableWidthAttr );
		}
	
		if ( (tableWidthAttr || scrollX) && ! oSettings._reszEvt ) {
			var bindResize = function () {
				$(window).on('resize.DT-'+oSettings.sInstance, _fnThrottle( function () {
					_fnAdjustColumnSizing( oSettings );
				} ) );
			};
	
			// IE6/7 will crash if we bind a resize event handler on page load.
			// To be removed in 1.11 which drops IE6/7 support
			if ( ie67 ) {
				setTimeout( bindResize, 1000 );
			}
			else {
				bindResize();
			}
	
			oSettings._reszEvt = true;
		}
	}
	
	
	/**
	 * Throttle the calls to a function. Arguments and context are maintained for
	 * the throttled function
	 *  @param {function} fn Function to be called
	 *  @param {int} [freq=200] call frequency in mS
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#oApi
	 */
	var _fnThrottle = DataTable.util.throttle;
	
	
	/**
	 * Convert a CSS unit width to pixels (e.g. 2em)
	 *  @param {string} width width to be converted
	 *  @param {node} parent parent to get the with for (required for relative widths) - optional
	 *  @returns {int} width in pixels
	 *  @memberof DataTable#oApi
	 */
	function _fnConvertToWidth ( width, parent )
	{
		if ( ! width ) {
			return 0;
		}
	
		var n = $('<div/>')
			.css( 'width', _fnStringToCss( width ) )
			.appendTo( parent || document.body );
	
		var val = n[0].offsetWidth;
		n.remove();
	
		return val;
	}
	
	
	/**
	 * Get the widest node
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {node} widest table node
	 *  @memberof DataTable#oApi
	 */
	function _fnGetWidestNode( settings, colIdx )
	{
		var idx = _fnGetMaxLenString( settings, colIdx );
		if ( idx < 0 ) {
			return null;
		}
	
		var data = settings.aoData[ idx ];
		return ! data.nTr ? // Might not have been created when deferred rendering
			$('<td/>').html( _fnGetCellData( settings, idx, colIdx, 'display' ) )[0] :
			data.anCells[ colIdx ];
	}
	
	
	/**
	 * Get the maximum strlen for each data column
	 *  @param {object} settings dataTables settings object
	 *  @param {int} colIdx column of interest
	 *  @returns {string} max string length for each column
	 *  @memberof DataTable#oApi
	 */
	function _fnGetMaxLenString( settings, colIdx )
	{
		var s, max=-1, maxIdx = -1;
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			s = _fnGetCellData( settings, i, colIdx, 'display' )+'';
			s = s.replace( __re_html_remove, '' );
			s = s.replace( /&nbsp;/g, ' ' );
	
			if ( s.length > max ) {
				max = s.length;
				maxIdx = i;
			}
		}
	
		return maxIdx;
	}
	
	
	/**
	 * Append a CSS unit (only if required) to a string
	 *  @param {string} value to css-ify
	 *  @returns {string} value with css unit
	 *  @memberof DataTable#oApi
	 */
	function _fnStringToCss( s )
	{
		if ( s === null ) {
			return '0px';
		}
	
		if ( typeof s == 'number' ) {
			return s < 0 ?
				'0px' :
				s+'px';
		}
	
		// Check it has a unit character already
		return s.match(/\d$/) ?
			s+'px' :
			s;
	}
	
	
	
	function _fnSortFlatten ( settings )
	{
		var
			i, iLen, k, kLen,
			aSort = [],
			aiOrig = [],
			aoColumns = settings.aoColumns,
			aDataSort, iCol, sType, srcCol,
			fixed = settings.aaSortingFixed,
			fixedObj = $.isPlainObject( fixed ),
			nestedSort = [],
			add = function ( a ) {
				if ( a.length && ! Array.isArray( a[0] ) ) {
					// 1D array
					nestedSort.push( a );
				}
				else {
					// 2D array
					$.merge( nestedSort, a );
				}
			};
	
		// Build the sort array, with pre-fix and post-fix options if they have been
		// specified
		if ( Array.isArray( fixed ) ) {
			add( fixed );
		}
	
		if ( fixedObj && fixed.pre ) {
			add( fixed.pre );
		}
	
		add( settings.aaSorting );
	
		if (fixedObj && fixed.post ) {
			add( fixed.post );
		}
	
		for ( i=0 ; i<nestedSort.length ; i++ )
		{
			srcCol = nestedSort[i][0];
			aDataSort = aoColumns[ srcCol ].aDataSort;
	
			for ( k=0, kLen=aDataSort.length ; k<kLen ; k++ )
			{
				iCol = aDataSort[k];
				sType = aoColumns[ iCol ].sType || 'string';
	
				if ( nestedSort[i]._idx === undefined ) {
					nestedSort[i]._idx = $.inArray( nestedSort[i][1], aoColumns[iCol].asSorting );
				}
	
				aSort.push( {
					src:       srcCol,
					col:       iCol,
					dir:       nestedSort[i][1],
					index:     nestedSort[i]._idx,
					type:      sType,
					formatter: DataTable.ext.type.order[ sType+"-pre" ]
				} );
			}
		}
	
		return aSort;
	}
	
	/**
	 * Change the order of the table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 *  @todo This really needs split up!
	 */
	function _fnSort ( oSettings )
	{
		var
			i, ien, iLen, j, jLen, k, kLen,
			sDataType, nTh,
			aiOrig = [],
			oExtSort = DataTable.ext.type.order,
			aoData = oSettings.aoData,
			aoColumns = oSettings.aoColumns,
			aDataSort, data, iCol, sType, oSort,
			formatters = 0,
			sortCol,
			displayMaster = oSettings.aiDisplayMaster,
			aSort;
	
		// Resolve any column types that are unknown due to addition or invalidation
		// @todo Can this be moved into a 'data-ready' handler which is called when
		//   data is going to be used in the table?
		_fnColumnTypes( oSettings );
	
		aSort = _fnSortFlatten( oSettings );
	
		for ( i=0, ien=aSort.length ; i<ien ; i++ ) {
			sortCol = aSort[i];
	
			// Track if we can use the fast sort algorithm
			if ( sortCol.formatter ) {
				formatters++;
			}
	
			// Load the data needed for the sort, for each cell
			_fnSortData( oSettings, sortCol.col );
		}
	
		/* No sorting required if server-side or no sorting array */
		if ( _fnDataSource( oSettings ) != 'ssp' && aSort.length !== 0 )
		{
			// Create a value - key array of the current row positions such that we can use their
			// current position during the sort, if values match, in order to perform stable sorting
			for ( i=0, iLen=displayMaster.length ; i<iLen ; i++ ) {
				aiOrig[ displayMaster[i] ] = i;
			}
	
			/* Do the sort - here we want multi-column sorting based on a given data source (column)
			 * and sorting function (from oSort) in a certain direction. It's reasonably complex to
			 * follow on it's own, but this is what we want (example two column sorting):
			 *  fnLocalSorting = function(a,b){
			 *    var iTest;
			 *    iTest = oSort['string-asc']('data11', 'data12');
			 *      if (iTest !== 0)
			 *        return iTest;
			 *    iTest = oSort['numeric-desc']('data21', 'data22');
			 *    if (iTest !== 0)
			 *      return iTest;
			 *    return oSort['numeric-asc']( aiOrig[a], aiOrig[b] );
			 *  }
			 * Basically we have a test for each sorting column, if the data in that column is equal,
			 * test the next column. If all columns match, then we use a numeric sort on the row
			 * positions in the original data array to provide a stable sort.
			 *
			 * Note - I know it seems excessive to have two sorting methods, but the first is around
			 * 15% faster, so the second is only maintained for backwards compatibility with sorting
			 * methods which do not have a pre-sort formatting function.
			 */
			if ( formatters === aSort.length ) {
				// All sort types have formatting functions
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, test, sort,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						test = x<y ? -1 : x>y ? 1 : 0;
						if ( test !== 0 ) {
							return sort.dir === 'asc' ? test : -test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
			else {
				// Depreciated - remove in 1.11 (providing a plug-in option)
				// Not all sort types have formatting methods, so we have to call their sorting
				// methods.
				displayMaster.sort( function ( a, b ) {
					var
						x, y, k, l, test, sort, fn,
						len=aSort.length,
						dataA = aoData[a]._aSortData,
						dataB = aoData[b]._aSortData;
	
					for ( k=0 ; k<len ; k++ ) {
						sort = aSort[k];
	
						x = dataA[ sort.col ];
						y = dataB[ sort.col ];
	
						fn = oExtSort[ sort.type+"-"+sort.dir ] || oExtSort[ "string-"+sort.dir ];
						test = fn( x, y );
						if ( test !== 0 ) {
							return test;
						}
					}
	
					x = aiOrig[a];
					y = aiOrig[b];
					return x<y ? -1 : x>y ? 1 : 0;
				} );
			}
		}
	
		/* Tell the draw function that we have sorted the data */
		oSettings.bSorted = true;
	}
	
	
	function _fnSortAria ( settings )
	{
		var label;
		var nextSort;
		var columns = settings.aoColumns;
		var aSort = _fnSortFlatten( settings );
		var oAria = settings.oLanguage.oAria;
	
		// ARIA attributes - need to loop all columns, to update all (removing old
		// attributes as needed)
		for ( var i=0, iLen=columns.length ; i<iLen ; i++ )
		{
			var col = columns[i];
			var asSorting = col.asSorting;
			var sTitle = col.sTitle.replace( /<.*?>/g, "" );
			var th = col.nTh;
	
			// IE7 is throwing an error when setting these properties with jQuery's
			// attr() and removeAttr() methods...
			th.removeAttribute('aria-sort');
	
			/* In ARIA only the first sorting column can be marked as sorting - no multi-sort option */
			if ( col.bSortable ) {
				if ( aSort.length > 0 && aSort[0].col == i ) {
					th.setAttribute('aria-sort', aSort[0].dir=="asc" ? "ascending" : "descending" );
					nextSort = asSorting[ aSort[0].index+1 ] || asSorting[0];
				}
				else {
					nextSort = asSorting[0];
				}
	
				label = sTitle + ( nextSort === "asc" ?
					oAria.sSortAscending :
					oAria.sSortDescending
				);
			}
			else {
				label = sTitle;
			}
	
			th.setAttribute('aria-label', label);
		}
	}
	
	
	/**
	 * Function to run on user sort request
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {boolean} [append=false] Append the requested sort to the existing
	 *    sort if true (i.e. multi-column sort)
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortListener ( settings, colIdx, append, callback )
	{
		var col = settings.aoColumns[ colIdx ];
		var sorting = settings.aaSorting;
		var asSorting = col.asSorting;
		var nextSortIdx;
		var next = function ( a, overflow ) {
			var idx = a._idx;
			if ( idx === undefined ) {
				idx = $.inArray( a[1], asSorting );
			}
	
			return idx+1 < asSorting.length ?
				idx+1 :
				overflow ?
					null :
					0;
		};
	
		// Convert to 2D array if needed
		if ( typeof sorting[0] === 'number' ) {
			sorting = settings.aaSorting = [ sorting ];
		}
	
		// If appending the sort then we are multi-column sorting
		if ( append && settings.oFeatures.bSortMulti ) {
			// Are we already doing some kind of sort on this column?
			var sortIdx = $.inArray( colIdx, _pluck(sorting, '0') );
	
			if ( sortIdx !== -1 ) {
				// Yes, modify the sort
				nextSortIdx = next( sorting[sortIdx], true );
	
				if ( nextSortIdx === null && sorting.length === 1 ) {
					nextSortIdx = 0; // can't remove sorting completely
				}
	
				if ( nextSortIdx === null ) {
					sorting.splice( sortIdx, 1 );
				}
				else {
					sorting[sortIdx][1] = asSorting[ nextSortIdx ];
					sorting[sortIdx]._idx = nextSortIdx;
				}
			}
			else {
				// No sort on this column yet
				sorting.push( [ colIdx, asSorting[0], 0 ] );
				sorting[sorting.length-1]._idx = 0;
			}
		}
		else if ( sorting.length && sorting[0][0] == colIdx ) {
			// Single column - already sorting on this column, modify the sort
			nextSortIdx = next( sorting[0] );
	
			sorting.length = 1;
			sorting[0][1] = asSorting[ nextSortIdx ];
			sorting[0]._idx = nextSortIdx;
		}
		else {
			// Single column - sort only on this column
			sorting.length = 0;
			sorting.push( [ colIdx, asSorting[0] ] );
			sorting[0]._idx = 0;
		}
	
		// Run the sort by calling a full redraw
		_fnReDraw( settings );
	
		// callback used for async user interaction
		if ( typeof callback == 'function' ) {
			callback( settings );
		}
	}
	
	
	/**
	 * Attach a sort handler (click) to a node
	 *  @param {object} settings dataTables settings object
	 *  @param {node} attachTo node to attach the handler to
	 *  @param {int} colIdx column sorting index
	 *  @param {function} [callback] callback function
	 *  @memberof DataTable#oApi
	 */
	function _fnSortAttachListener ( settings, attachTo, colIdx, callback )
	{
		var col = settings.aoColumns[ colIdx ];
	
		_fnBindAction( attachTo, {}, function (e) {
			/* If the column is not sortable - don't to anything */
			if ( col.bSortable === false ) {
				return;
			}
	
			// If processing is enabled use a timeout to allow the processing
			// display to be shown - otherwise to it synchronously
			if ( settings.oFeatures.bProcessing ) {
				_fnProcessingDisplay( settings, true );
	
				setTimeout( function() {
					_fnSortListener( settings, colIdx, e.shiftKey, callback );
	
					// In server-side processing, the draw callback will remove the
					// processing display
					if ( _fnDataSource( settings ) !== 'ssp' ) {
						_fnProcessingDisplay( settings, false );
					}
				}, 0 );
			}
			else {
				_fnSortListener( settings, colIdx, e.shiftKey, callback );
			}
		} );
	}
	
	
	/**
	 * Set the sorting classes on table's body, Note: it is safe to call this function
	 * when bSort and bSortClasses are false
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSortingClasses( settings )
	{
		var oldSort = settings.aLastSort;
		var sortClass = settings.oClasses.sSortColumn;
		var sort = _fnSortFlatten( settings );
		var features = settings.oFeatures;
		var i, ien, colIdx;
	
		if ( features.bSort && features.bSortClasses ) {
			// Remove old sorting classes
			for ( i=0, ien=oldSort.length ; i<ien ; i++ ) {
				colIdx = oldSort[i].src;
	
				// Remove column sorting
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.removeClass( sortClass + (i<2 ? i+1 : 3) );
			}
	
			// Add new column sorting
			for ( i=0, ien=sort.length ; i<ien ; i++ ) {
				colIdx = sort[i].src;
	
				$( _pluck( settings.aoData, 'anCells', colIdx ) )
					.addClass( sortClass + (i<2 ? i+1 : 3) );
			}
		}
	
		settings.aLastSort = sort;
	}
	
	
	// Get the data to sort a column, be it from cache, fresh (populating the
	// cache), or from a sort formatter
	function _fnSortData( settings, idx )
	{
		// Custom sorting function - provided by the sort data type
		var column = settings.aoColumns[ idx ];
		var customSort = DataTable.ext.order[ column.sSortDataType ];
		var customData;
	
		if ( customSort ) {
			customData = customSort.call( settings.oInstance, settings, idx,
				_fnColumnIndexToVisible( settings, idx )
			);
		}
	
		// Use / populate cache
		var row, cellData;
		var formatter = DataTable.ext.type.order[ column.sType+"-pre" ];
	
		for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
			row = settings.aoData[i];
	
			if ( ! row._aSortData ) {
				row._aSortData = [];
			}
	
			if ( ! row._aSortData[idx] || customSort ) {
				cellData = customSort ?
					customData[i] : // If there was a custom sort function, use data from there
					_fnGetCellData( settings, i, idx, 'sort' );
	
				row._aSortData[ idx ] = formatter ?
					formatter( cellData ) :
					cellData;
			}
		}
	}
	
	
	
	/**
	 * Save the state of a table
	 *  @param {object} oSettings dataTables settings object
	 *  @memberof DataTable#oApi
	 */
	function _fnSaveState ( settings )
	{
		if ( !settings.oFeatures.bStateSave || settings.bDestroying )
		{
			return;
		}
	
		/* Store the interesting variables */
		var state = {
			time:    +new Date(),
			start:   settings._iDisplayStart,
			length:  settings._iDisplayLength,
			order:   $.extend( true, [], settings.aaSorting ),
			search:  _fnSearchToCamel( settings.oPreviousSearch ),
			columns: $.map( settings.aoColumns, function ( col, i ) {
				return {
					visible: col.bVisible,
					search: _fnSearchToCamel( settings.aoPreSearchCols[i] )
				};
			} )
		};
	
		_fnCallbackFire( settings, "aoStateSaveParams", 'stateSaveParams', [settings, state] );
	
		settings.oSavedState = state;
		settings.fnStateSaveCallback.call( settings.oInstance, settings, state );
	}
	
	
	/**
	 * Attempt to load a saved table state
	 *  @param {object} oSettings dataTables settings object
	 *  @param {object} oInit DataTables init object so we can override settings
	 *  @param {function} callback Callback to execute when the state has been loaded
	 *  @memberof DataTable#oApi
	 */
	function _fnLoadState ( settings, oInit, callback )
	{
		var i, ien;
		var columns = settings.aoColumns;
		var loaded = function ( s ) {
			if ( ! s || ! s.time ) {
				callback();
				return;
			}
	
			// Allow custom and plug-in manipulation functions to alter the saved data set and
			// cancelling of loading by returning false
			var abStateLoad = _fnCallbackFire( settings, 'aoStateLoadParams', 'stateLoadParams', [settings, s] );
			if ( $.inArray( false, abStateLoad ) !== -1 ) {
				callback();
				return;
			}
	
			// Reject old data
			var duration = settings.iStateDuration;
			if ( duration > 0 && s.time < +new Date() - (duration*1000) ) {
				callback();
				return;
			}
	
			// Number of columns have changed - all bets are off, no restore of settings
			if ( s.columns && columns.length !== s.columns.length ) {
				callback();
				return;
			}
	
			// Store the saved state so it might be accessed at any time
			settings.oLoadedState = $.extend( true, {}, s );
	
			// Restore key features - todo - for 1.11 this needs to be done by
			// subscribed events
			if ( s.start !== undefined ) {
				settings._iDisplayStart    = s.start;
				settings.iInitDisplayStart = s.start;
			}
			if ( s.length !== undefined ) {
				settings._iDisplayLength   = s.length;
			}
	
			// Order
			if ( s.order !== undefined ) {
				settings.aaSorting = [];
				$.each( s.order, function ( i, col ) {
					settings.aaSorting.push( col[0] >= columns.length ?
						[ 0, col[1] ] :
						col
					);
				} );
			}
	
			// Search
			if ( s.search !== undefined ) {
				$.extend( settings.oPreviousSearch, _fnSearchToHung( s.search ) );
			}
	
			// Columns
			//
			if ( s.columns ) {
				for ( i=0, ien=s.columns.length ; i<ien ; i++ ) {
					var col = s.columns[i];
	
					// Visibility
					if ( col.visible !== undefined ) {
						columns[i].bVisible = col.visible;
					}
	
					// Search
					if ( col.search !== undefined ) {
						$.extend( settings.aoPreSearchCols[i], _fnSearchToHung( col.search ) );
					}
				}
			}
	
			_fnCallbackFire( settings, 'aoStateLoaded', 'stateLoaded', [settings, s] );
			callback();
		};
	
		if ( ! settings.oFeatures.bStateSave ) {
			callback();
			return;
		}
	
		var state = settings.fnStateLoadCallback.call( settings.oInstance, settings, loaded );
	
		if ( state !== undefined ) {
			loaded( state );
		}
		// otherwise, wait for the loaded callback to be executed
	}
	
	
	/**
	 * Return the settings object for a particular table
	 *  @param {node} table table we are using as a dataTable
	 *  @returns {object} Settings object - or null if not found
	 *  @memberof DataTable#oApi
	 */
	function _fnSettingsFromNode ( table )
	{
		var settings = DataTable.settings;
		var idx = $.inArray( table, _pluck( settings, 'nTable' ) );
	
		return idx !== -1 ?
			settings[ idx ] :
			null;
	}
	
	
	/**
	 * Log an error message
	 *  @param {object} settings dataTables settings object
	 *  @param {int} level log error messages, or display them to the user
	 *  @param {string} msg error message
	 *  @param {int} tn Technical note id to get more information about the error.
	 *  @memberof DataTable#oApi
	 */
	function _fnLog( settings, level, msg, tn )
	{
		msg = 'DataTables warning: '+
			(settings ? 'table id='+settings.sTableId+' - ' : '')+msg;
	
		if ( tn ) {
			msg += '. For more information about this error, please see '+
			'http://datatables.net/tn/'+tn;
		}
	
		if ( ! level  ) {
			// Backwards compatibility pre 1.10
			var ext = DataTable.ext;
			var type = ext.sErrMode || ext.errMode;
	
			if ( settings ) {
				_fnCallbackFire( settings, null, 'error', [ settings, tn, msg ] );
			}
	
			if ( type == 'alert' ) {
				alert( msg );
			}
			else if ( type == 'throw' ) {
				throw new Error(msg);
			}
			else if ( typeof type == 'function' ) {
				type( settings, tn, msg );
			}
		}
		else if ( window.console && console.log ) {
			console.log( msg );
		}
	}
	
	
	/**
	 * See if a property is defined on one object, if so assign it to the other object
	 *  @param {object} ret target object
	 *  @param {object} src source object
	 *  @param {string} name property
	 *  @param {string} [mappedName] name to map too - optional, name used if not given
	 *  @memberof DataTable#oApi
	 */
	function _fnMap( ret, src, name, mappedName )
	{
		if ( Array.isArray( name ) ) {
			$.each( name, function (i, val) {
				if ( Array.isArray( val ) ) {
					_fnMap( ret, src, val[0], val[1] );
				}
				else {
					_fnMap( ret, src, val );
				}
			} );
	
			return;
		}
	
		if ( mappedName === undefined ) {
			mappedName = name;
		}
	
		if ( src[name] !== undefined ) {
			ret[mappedName] = src[name];
		}
	}
	
	
	/**
	 * Extend objects - very similar to jQuery.extend, but deep copy objects, and
	 * shallow copy arrays. The reason we need to do this, is that we don't want to
	 * deep copy array init values (such as aaSorting) since the dev wouldn't be
	 * able to override them, but we do want to deep copy arrays.
	 *  @param {object} out Object to extend
	 *  @param {object} extender Object from which the properties will be applied to
	 *      out
	 *  @param {boolean} breakRefs If true, then arrays will be sliced to take an
	 *      independent copy with the exception of the `data` or `aaData` parameters
	 *      if they are present. This is so you can pass in a collection to
	 *      DataTables and have that used as your data source without breaking the
	 *      references
	 *  @returns {object} out Reference, just for convenience - out === the return.
	 *  @memberof DataTable#oApi
	 *  @todo This doesn't take account of arrays inside the deep copied objects.
	 */
	function _fnExtend( out, extender, breakRefs )
	{
		var val;
	
		for ( var prop in extender ) {
			if ( extender.hasOwnProperty(prop) ) {
				val = extender[prop];
	
				if ( $.isPlainObject( val ) ) {
					if ( ! $.isPlainObject( out[prop] ) ) {
						out[prop] = {};
					}
					$.extend( true, out[prop], val );
				}
				else if ( breakRefs && prop !== 'data' && prop !== 'aaData' && Array.isArray(val) ) {
					out[prop] = val.slice();
				}
				else {
					out[prop] = val;
				}
			}
		}
	
		return out;
	}
	
	
	/**
	 * Bind an event handers to allow a click or return key to activate the callback.
	 * This is good for accessibility since a return on the keyboard will have the
	 * same effect as a click, if the element has focus.
	 *  @param {element} n Element to bind the action to
	 *  @param {object} oData Data object to pass to the triggered function
	 *  @param {function} fn Callback function for when the event is triggered
	 *  @memberof DataTable#oApi
	 */
	function _fnBindAction( n, oData, fn )
	{
		$(n)
			.on( 'click.DT', oData, function (e) {
					$(n).trigger('blur'); // Remove focus outline for mouse users
					fn(e);
				} )
			.on( 'keypress.DT', oData, function (e){
					if ( e.which === 13 ) {
						e.preventDefault();
						fn(e);
					}
				} )
			.on( 'selectstart.DT', function () {
					/* Take the brutal approach to cancelling text selection */
					return false;
				} );
	}
	
	
	/**
	 * Register a callback function. Easily allows a callback function to be added to
	 * an array store of callback functions that can then all be called together.
	 *  @param {object} oSettings dataTables settings object
	 *  @param {string} sStore Name of the array storage for the callbacks in oSettings
	 *  @param {function} fn Function to be called back
	 *  @param {string} sName Identifying name for the callback (i.e. a label)
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackReg( oSettings, sStore, fn, sName )
	{
		if ( fn )
		{
			oSettings[sStore].push( {
				"fn": fn,
				"sName": sName
			} );
		}
	}
	
	
	/**
	 * Fire callback functions and trigger events. Note that the loop over the
	 * callback array store is done backwards! Further note that you do not want to
	 * fire off triggers in time sensitive applications (for example cell creation)
	 * as its slow.
	 *  @param {object} settings dataTables settings object
	 *  @param {string} callbackArr Name of the array storage for the callbacks in
	 *      oSettings
	 *  @param {string} eventName Name of the jQuery custom event to trigger. If
	 *      null no trigger is fired
	 *  @param {array} args Array of arguments to pass to the callback function /
	 *      trigger
	 *  @memberof DataTable#oApi
	 */
	function _fnCallbackFire( settings, callbackArr, eventName, args )
	{
		var ret = [];
	
		if ( callbackArr ) {
			ret = $.map( settings[callbackArr].slice().reverse(), function (val, i) {
				return val.fn.apply( settings.oInstance, args );
			} );
		}
	
		if ( eventName !== null ) {
			var e = $.Event( eventName+'.dt' );
	
			$(settings.nTable).trigger( e, args );
	
			ret.push( e.result );
		}
	
		return ret;
	}
	
	
	function _fnLengthOverflow ( settings )
	{
		var
			start = settings._iDisplayStart,
			end = settings.fnDisplayEnd(),
			len = settings._iDisplayLength;
	
		/* If we have space to show extra rows (backing up from the end point - then do so */
		if ( start >= end )
		{
			start = end - len;
		}
	
		// Keep the start record on the current page
		start -= (start % len);
	
		if ( len === -1 || start < 0 )
		{
			start = 0;
		}
	
		settings._iDisplayStart = start;
	}
	
	
	function _fnRenderer( settings, type )
	{
		var renderer = settings.renderer;
		var host = DataTable.ext.renderer[type];
	
		if ( $.isPlainObject( renderer ) && renderer[type] ) {
			// Specific renderer for this type. If available use it, otherwise use
			// the default.
			return host[renderer[type]] || host._;
		}
		else if ( typeof renderer === 'string' ) {
			// Common renderer - if there is one available for this type use it,
			// otherwise use the default
			return host[renderer] || host._;
		}
	
		// Use the default
		return host._;
	}
	
	
	/**
	 * Detect the data source being used for the table. Used to simplify the code
	 * a little (ajax) and to make it compress a little smaller.
	 *
	 *  @param {object} settings dataTables settings object
	 *  @returns {string} Data source
	 *  @memberof DataTable#oApi
	 */
	function _fnDataSource ( settings )
	{
		if ( settings.oFeatures.bServerSide ) {
			return 'ssp';
		}
		else if ( settings.ajax || settings.sAjaxSource ) {
			return 'ajax';
		}
		return 'dom';
	}
	

	
	
	/**
	 * Computed structure of the DataTables API, defined by the options passed to
	 * `DataTable.Api.register()` when building the API.
	 *
	 * The structure is built in order to speed creation and extension of the Api
	 * objects since the extensions are effectively pre-parsed.
	 *
	 * The array is an array of objects with the following structure, where this
	 * base array represents the Api prototype base:
	 *
	 *     [
	 *       {
	 *         name:      'data'                -- string   - Property name
	 *         val:       function () {},       -- function - Api method (or undefined if just an object
	 *         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	 *         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	 *       },
	 *       {
	 *         name:     'row'
	 *         val:       {},
	 *         methodExt: [ ... ],
	 *         propExt:   [
	 *           {
	 *             name:      'data'
	 *             val:       function () {},
	 *             methodExt: [ ... ],
	 *             propExt:   [ ... ]
	 *           },
	 *           ...
	 *         ]
	 *       }
	 *     ]
	 *
	 * @type {Array}
	 * @ignore
	 */
	var __apiStruct = [];
	
	
	/**
	 * `Array.prototype` reference.
	 *
	 * @type object
	 * @ignore
	 */
	var __arrayProto = Array.prototype;
	
	
	/**
	 * Abstraction for `context` parameter of the `Api` constructor to allow it to
	 * take several different forms for ease of use.
	 *
	 * Each of the input parameter types will be converted to a DataTables settings
	 * object where possible.
	 *
	 * @param  {string|node|jQuery|object} mixed DataTable identifier. Can be one
	 *   of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 *   * `DataTables.Api` - API instance
	 * @return {array|null} Matching DataTables settings objects. `null` or
	 *   `undefined` is returned if no matching DataTable is found.
	 * @ignore
	 */
	var _toSettings = function ( mixed )
	{
		var idx, jq;
		var settings = DataTable.settings;
		var tables = $.map( settings, function (el, i) {
			return el.nTable;
		} );
	
		if ( ! mixed ) {
			return [];
		}
		else if ( mixed.nTable && mixed.oApi ) {
			// DataTables settings object
			return [ mixed ];
		}
		else if ( mixed.nodeName && mixed.nodeName.toLowerCase() === 'table' ) {
			// Table node
			idx = $.inArray( mixed, tables );
			return idx !== -1 ? [ settings[idx] ] : null;
		}
		else if ( mixed && typeof mixed.settings === 'function' ) {
			return mixed.settings().toArray();
		}
		else if ( typeof mixed === 'string' ) {
			// jQuery selector
			jq = $(mixed);
		}
		else if ( mixed instanceof $ ) {
			// jQuery object (also DataTables instance)
			jq = mixed;
		}
	
		if ( jq ) {
			return jq.map( function(i) {
				idx = $.inArray( this, tables );
				return idx !== -1 ? settings[idx] : null;
			} ).toArray();
		}
	};
	
	
	/**
	 * DataTables API class - used to control and interface with  one or more
	 * DataTables enhanced tables.
	 *
	 * The API class is heavily based on jQuery, presenting a chainable interface
	 * that you can use to interact with tables. Each instance of the API class has
	 * a "context" - i.e. the tables that it will operate on. This could be a single
	 * table, all tables on a page or a sub-set thereof.
	 *
	 * Additionally the API is designed to allow you to easily work with the data in
	 * the tables, retrieving and manipulating it as required. This is done by
	 * presenting the API class as an array like interface. The contents of the
	 * array depend upon the actions requested by each method (for example
	 * `rows().nodes()` will return an array of nodes, while `rows().data()` will
	 * return an array of objects or arrays depending upon your table's
	 * configuration). The API object has a number of array like methods (`push`,
	 * `pop`, `reverse` etc) as well as additional helper methods (`each`, `pluck`,
	 * `unique` etc) to assist your working with the data held in a table.
	 *
	 * Most methods (those which return an Api instance) are chainable, which means
	 * the return from a method call also has all of the methods available that the
	 * top level object had. For example, these two calls are equivalent:
	 *
	 *     // Not chained
	 *     api.row.add( {...} );
	 *     api.draw();
	 *
	 *     // Chained
	 *     api.row.add( {...} ).draw();
	 *
	 * @class DataTable.Api
	 * @param {array|object|string|jQuery} context DataTable identifier. This is
	 *   used to define which DataTables enhanced tables this API will operate on.
	 *   Can be one of:
	 *
	 *   * `string` - jQuery selector. Any DataTables' matching the given selector
	 *     with be found and used.
	 *   * `node` - `TABLE` node which has already been formed into a DataTable.
	 *   * `jQuery` - A jQuery object of `TABLE` nodes.
	 *   * `object` - DataTables settings object
	 * @param {array} [data] Data to initialise the Api instance with.
	 *
	 * @example
	 *   // Direct initialisation during DataTables construction
	 *   var api = $('#example').DataTable();
	 *
	 * @example
	 *   // Initialisation using a DataTables jQuery object
	 *   var api = $('#example').dataTable().api();
	 *
	 * @example
	 *   // Initialisation as a constructor
	 *   var api = new $.fn.DataTable.Api( 'table.dataTable' );
	 */
	_Api = function ( context, data )
	{
		if ( ! (this instanceof _Api) ) {
			return new _Api( context, data );
		}
	
		var settings = [];
		var ctxSettings = function ( o ) {
			var a = _toSettings( o );
			if ( a ) {
				settings.push.apply( settings, a );
			}
		};
	
		if ( Array.isArray( context ) ) {
			for ( var i=0, ien=context.length ; i<ien ; i++ ) {
				ctxSettings( context[i] );
			}
		}
		else {
			ctxSettings( context );
		}
	
		// Remove duplicates
		this.context = _unique( settings );
	
		// Initial data
		if ( data ) {
			$.merge( this, data );
		}
	
		// selector
		this.selector = {
			rows: null,
			cols: null,
			opts: null
		};
	
		_Api.extend( this, this, __apiStruct );
	};
	
	DataTable.Api = _Api;
	
	// Don't destroy the existing prototype, just extend it. Required for jQuery 2's
	// isPlainObject.
	$.extend( _Api.prototype, {
		any: function ()
		{
			return this.count() !== 0;
		},
	
	
		concat:  __arrayProto.concat,
	
	
		context: [], // array of table settings objects
	
	
		count: function ()
		{
			return this.flatten().length;
		},
	
	
		each: function ( fn )
		{
			for ( var i=0, ien=this.length ; i<ien; i++ ) {
				fn.call( this, this[i], i, this );
			}
	
			return this;
		},
	
	
		eq: function ( idx )
		{
			var ctx = this.context;
	
			return ctx.length > idx ?
				new _Api( ctx[idx], this[idx] ) :
				null;
		},
	
	
		filter: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.filter ) {
				a = __arrayProto.filter.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					if ( fn.call( this, this[i], i, this ) ) {
						a.push( this[i] );
					}
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		flatten: function ()
		{
			var a = [];
			return new _Api( this.context, a.concat.apply( a, this.toArray() ) );
		},
	
	
		join:    __arrayProto.join,
	
	
		indexOf: __arrayProto.indexOf || function (obj, start)
		{
			for ( var i=(start || 0), ien=this.length ; i<ien ; i++ ) {
				if ( this[i] === obj ) {
					return i;
				}
			}
			return -1;
		},
	
		iterator: function ( flatten, type, fn, alwaysNew ) {
			var
				a = [], ret,
				i, ien, j, jen,
				context = this.context,
				rows, items, item,
				selector = this.selector;
	
			// Argument shifting
			if ( typeof flatten === 'string' ) {
				alwaysNew = fn;
				fn = type;
				type = flatten;
				flatten = false;
			}
	
			for ( i=0, ien=context.length ; i<ien ; i++ ) {
				var apiInst = new _Api( context[i] );
	
				if ( type === 'table' ) {
					ret = fn.call( apiInst, context[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'columns' || type === 'rows' ) {
					// this has same length as context - one entry for each table
					ret = fn.call( apiInst, context[i], this[i], i );
	
					if ( ret !== undefined ) {
						a.push( ret );
					}
				}
				else if ( type === 'column' || type === 'column-rows' || type === 'row' || type === 'cell' ) {
					// columns and rows share the same structure.
					// 'this' is an array of column indexes for each context
					items = this[i];
	
					if ( type === 'column-rows' ) {
						rows = _selector_row_indexes( context[i], selector.opts );
					}
	
					for ( j=0, jen=items.length ; j<jen ; j++ ) {
						item = items[j];
	
						if ( type === 'cell' ) {
							ret = fn.call( apiInst, context[i], item.row, item.column, i, j );
						}
						else {
							ret = fn.call( apiInst, context[i], item, i, j, rows );
						}
	
						if ( ret !== undefined ) {
							a.push( ret );
						}
					}
				}
			}
	
			if ( a.length || alwaysNew ) {
				var api = new _Api( context, flatten ? a.concat.apply( [], a ) : a );
				var apiSelector = api.selector;
				apiSelector.rows = selector.rows;
				apiSelector.cols = selector.cols;
				apiSelector.opts = selector.opts;
				return api;
			}
			return this;
		},
	
	
		lastIndexOf: __arrayProto.lastIndexOf || function (obj, start)
		{
			// Bit cheeky...
			return this.indexOf.apply( this.toArray.reverse(), arguments );
		},
	
	
		length:  0,
	
	
		map: function ( fn )
		{
			var a = [];
	
			if ( __arrayProto.map ) {
				a = __arrayProto.map.call( this, fn, this );
			}
			else {
				// Compatibility for browsers without EMCA-252-5 (JS 1.6)
				for ( var i=0, ien=this.length ; i<ien ; i++ ) {
					a.push( fn.call( this, this[i], i ) );
				}
			}
	
			return new _Api( this.context, a );
		},
	
	
		pluck: function ( prop )
		{
			return this.map( function ( el ) {
				return el[ prop ];
			} );
		},
	
		pop:     __arrayProto.pop,
	
	
		push:    __arrayProto.push,
	
	
		// Does not return an API instance
		reduce: __arrayProto.reduce || function ( fn, init )
		{
			return _fnReduce( this, fn, init, 0, this.length, 1 );
		},
	
	
		reduceRight: __arrayProto.reduceRight || function ( fn, init )
		{
			return _fnReduce( this, fn, init, this.length-1, -1, -1 );
		},
	
	
		reverse: __arrayProto.reverse,
	
	
		// Object with rows, columns and opts
		selector: null,
	
	
		shift:   __arrayProto.shift,
	
	
		slice: function () {
			return new _Api( this.context, this );
		},
	
	
		sort:    __arrayProto.sort, // ? name - order?
	
	
		splice:  __arrayProto.splice,
	
	
		toArray: function ()
		{
			return __arrayProto.slice.call( this );
		},
	
	
		to$: function ()
		{
			return $( this );
		},
	
	
		toJQuery: function ()
		{
			return $( this );
		},
	
	
		unique: function ()
		{
			return new _Api( this.context, _unique(this) );
		},
	
	
		unshift: __arrayProto.unshift
	} );
	
	
	_Api.extend = function ( scope, obj, ext )
	{
		// Only extend API instances and static properties of the API
		if ( ! ext.length || ! obj || ( ! (obj instanceof _Api) && ! obj.__dt_wrapper ) ) {
			return;
		}
	
		var
			i, ien,
			struct,
			methodScoping = function ( scope, fn, struc ) {
				return function () {
					var ret = fn.apply( scope, arguments );
	
					// Method extension
					_Api.extend( ret, ret, struc.methodExt );
					return ret;
				};
			};
	
		for ( i=0, ien=ext.length ; i<ien ; i++ ) {
			struct = ext[i];
	
			// Value
			obj[ struct.name ] = struct.type === 'function' ?
				methodScoping( scope, struct.val, struct ) :
				struct.type === 'object' ?
					{} :
					struct.val;
	
			obj[ struct.name ].__dt_wrapper = true;
	
			// Property extension
			_Api.extend( scope, obj[ struct.name ], struct.propExt );
		}
	};
	
	
	// @todo - Is there need for an augment function?
	// _Api.augment = function ( inst, name )
	// {
	// 	// Find src object in the structure from the name
	// 	var parts = name.split('.');
	
	// 	_Api.extend( inst, obj );
	// };
	
	
	//     [
	//       {
	//         name:      'data'                -- string   - Property name
	//         val:       function () {},       -- function - Api method (or undefined if just an object
	//         methodExt: [ ... ],              -- array    - Array of Api object definitions to extend the method result
	//         propExt:   [ ... ]               -- array    - Array of Api object definitions to extend the property
	//       },
	//       {
	//         name:     'row'
	//         val:       {},
	//         methodExt: [ ... ],
	//         propExt:   [
	//           {
	//             name:      'data'
	//             val:       function () {},
	//             methodExt: [ ... ],
	//             propExt:   [ ... ]
	//           },
	//           ...
	//         ]
	//       }
	//     ]
	
	_Api.register = _api_register = function ( name, val )
	{
		if ( Array.isArray( name ) ) {
			for ( var j=0, jen=name.length ; j<jen ; j++ ) {
				_Api.register( name[j], val );
			}
			return;
		}
	
		var
			i, ien,
			heir = name.split('.'),
			struct = __apiStruct,
			key, method;
	
		var find = function ( src, name ) {
			for ( var i=0, ien=src.length ; i<ien ; i++ ) {
				if ( src[i].name === name ) {
					return src[i];
				}
			}
			return null;
		};
	
		for ( i=0, ien=heir.length ; i<ien ; i++ ) {
			method = heir[i].indexOf('()') !== -1;
			key = method ?
				heir[i].replace('()', '') :
				heir[i];
	
			var src = find( struct, key );
			if ( ! src ) {
				src = {
					name:      key,
					val:       {},
					methodExt: [],
					propExt:   [],
					type:      'object'
				};
				struct.push( src );
			}
	
			if ( i === ien-1 ) {
				src.val = val;
				src.type = typeof val === 'function' ?
					'function' :
					$.isPlainObject( val ) ?
						'object' :
						'other';
			}
			else {
				struct = method ?
					src.methodExt :
					src.propExt;
			}
		}
	};
	
	_Api.registerPlural = _api_registerPlural = function ( pluralName, singularName, val ) {
		_Api.register( pluralName, val );
	
		_Api.register( singularName, function () {
			var ret = val.apply( this, arguments );
	
			if ( ret === this ) {
				// Returned item is the API instance that was passed in, return it
				return this;
			}
			else if ( ret instanceof _Api ) {
				// New API instance returned, want the value from the first item
				// in the returned array for the singular result.
				return ret.length ?
					Array.isArray( ret[0] ) ?
						new _Api( ret.context, ret[0] ) : // Array results are 'enhanced'
						ret[0] :
					undefined;
			}
	
			// Non-API return - just fire it back
			return ret;
		} );
	};
	
	
	/**
	 * Selector for HTML tables. Apply the given selector to the give array of
	 * DataTables settings objects.
	 *
	 * @param {string|integer} [selector] jQuery selector string or integer
	 * @param  {array} Array of DataTables settings objects to be filtered
	 * @return {array}
	 * @ignore
	 */
	var __table_selector = function ( selector, a )
	{
		if ( Array.isArray(selector) ) {
			return $.map( selector, function (item) {
				return __table_selector(item, a);
			} );
		}
	
		// Integer is used to pick out a table by index
		if ( typeof selector === 'number' ) {
			return [ a[ selector ] ];
		}
	
		// Perform a jQuery selector on the table nodes
		var nodes = $.map( a, function (el, i) {
			return el.nTable;
		} );
	
		return $(nodes)
			.filter( selector )
			.map( function (i) {
				// Need to translate back from the table node to the settings
				var idx = $.inArray( this, nodes );
				return a[ idx ];
			} )
			.toArray();
	};
	
	
	
	/**
	 * Context selector for the API's context (i.e. the tables the API instance
	 * refers to.
	 *
	 * @name    DataTable.Api#tables
	 * @param {string|integer} [selector] Selector to pick which tables the iterator
	 *   should operate on. If not given, all tables in the current context are
	 *   used. This can be given as a jQuery selector (for example `':gt(0)'`) to
	 *   select multiple tables or as an integer to select a single table.
	 * @returns {DataTable.Api} Returns a new API instance if a selector is given.
	 */
	_api_register( 'tables()', function ( selector ) {
		// A new instance is created if there was a selector specified
		return selector !== undefined && selector !== null ?
			new _Api( __table_selector( selector, this.context ) ) :
			this;
	} );
	
	
	_api_register( 'table()', function ( selector ) {
		var tables = this.tables( selector );
		var ctx = tables.context;
	
		// Truncate to the first matched table
		return ctx.length ?
			new _Api( ctx[0] ) :
			tables;
	} );
	
	
	_api_registerPlural( 'tables().nodes()', 'table().node()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTable;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().body()', 'table().body()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTBody;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().header()', 'table().header()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTHead;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().footer()', 'table().footer()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTFoot;
		}, 1 );
	} );
	
	
	_api_registerPlural( 'tables().containers()', 'table().container()' , function () {
		return this.iterator( 'table', function ( ctx ) {
			return ctx.nTableWrapper;
		}, 1 );
	} );
	
	
	
	/**
	 * Redraw the tables in the current context.
	 */
	_api_register( 'draw()', function ( paging ) {
		return this.iterator( 'table', function ( settings ) {
			if ( paging === 'page' ) {
				_fnDraw( settings );
			}
			else {
				if ( typeof paging === 'string' ) {
					paging = paging === 'full-hold' ?
						false :
						true;
				}
	
				_fnReDraw( settings, paging===false );
			}
		} );
	} );
	
	
	
	/**
	 * Get the current page index.
	 *
	 * @return {integer} Current page index (zero based)
	 *//**
	 * Set the current page.
	 *
	 * Note that if you attempt to show a page which does not exist, DataTables will
	 * not throw an error, but rather reset the paging.
	 *
	 * @param {integer|string} action The paging action to take. This can be one of:
	 *  * `integer` - The page index to jump to
	 *  * `string` - An action to take:
	 *    * `first` - Jump to first page.
	 *    * `next` - Jump to the next page
	 *    * `previous` - Jump to previous page
	 *    * `last` - Jump to the last page.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page()', function ( action ) {
		if ( action === undefined ) {
			return this.page.info().page; // not an expensive call
		}
	
		// else, have an action to take on all tables
		return this.iterator( 'table', function ( settings ) {
			_fnPageChange( settings, action );
		} );
	} );
	
	
	/**
	 * Paging information for the first table in the current context.
	 *
	 * If you require paging information for another table, use the `table()` method
	 * with a suitable selector.
	 *
	 * @return {object} Object with the following properties set:
	 *  * `page` - Current page index (zero based - i.e. the first page is `0`)
	 *  * `pages` - Total number of pages
	 *  * `start` - Display index for the first record shown on the current page
	 *  * `end` - Display index for the last record shown on the current page
	 *  * `length` - Display length (number of records). Note that generally `start
	 *    + length = end`, but this is not always true, for example if there are
	 *    only 2 records to show on the final page, with a length of 10.
	 *  * `recordsTotal` - Full data set length
	 *  * `recordsDisplay` - Data set length once the current filtering criterion
	 *    are applied.
	 */
	_api_register( 'page.info()', function ( action ) {
		if ( this.context.length === 0 ) {
			return undefined;
		}
	
		var
			settings   = this.context[0],
			start      = settings._iDisplayStart,
			len        = settings.oFeatures.bPaginate ? settings._iDisplayLength : -1,
			visRecords = settings.fnRecordsDisplay(),
			all        = len === -1;
	
		return {
			"page":           all ? 0 : Math.floor( start / len ),
			"pages":          all ? 1 : Math.ceil( visRecords / len ),
			"start":          start,
			"end":            settings.fnDisplayEnd(),
			"length":         len,
			"recordsTotal":   settings.fnRecordsTotal(),
			"recordsDisplay": visRecords,
			"serverSide":     _fnDataSource( settings ) === 'ssp'
		};
	} );
	
	
	/**
	 * Get the current page length.
	 *
	 * @return {integer} Current page length. Note `-1` indicates that all records
	 *   are to be shown.
	 *//**
	 * Set the current page length.
	 *
	 * @param {integer} Page length to set. Use `-1` to show all records.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'page.len()', function ( len ) {
		// Note that we can't call this function 'length()' because `length`
		// is a Javascript property of functions which defines how many arguments
		// the function expects.
		if ( len === undefined ) {
			return this.context.length !== 0 ?
				this.context[0]._iDisplayLength :
				undefined;
		}
	
		// else, set the page length
		return this.iterator( 'table', function ( settings ) {
			_fnLengthChange( settings, len );
		} );
	} );
	
	
	
	var __reload = function ( settings, holdPosition, callback ) {
		// Use the draw event to trigger a callback
		if ( callback ) {
			var api = new _Api( settings );
	
			api.one( 'draw', function () {
				callback( api.ajax.json() );
			} );
		}
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			_fnReDraw( settings, holdPosition );
		}
		else {
			_fnProcessingDisplay( settings, true );
	
			// Cancel an existing request
			var xhr = settings.jqXHR;
			if ( xhr && xhr.readyState !== 4 ) {
				xhr.abort();
			}
	
			// Trigger xhr
			_fnBuildAjax( settings, [], function( json ) {
				_fnClearTable( settings );
	
				var data = _fnAjaxDataSrc( settings, json );
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					_fnAddData( settings, data[i] );
				}
	
				_fnReDraw( settings, holdPosition );
				_fnProcessingDisplay( settings, false );
			} );
		}
	};
	
	
	/**
	 * Get the JSON response from the last Ajax request that DataTables made to the
	 * server. Note that this returns the JSON from the first table in the current
	 * context.
	 *
	 * @return {object} JSON received from the server.
	 */
	_api_register( 'ajax.json()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].json;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Get the data submitted in the last Ajax request
	 */
	_api_register( 'ajax.params()', function () {
		var ctx = this.context;
	
		if ( ctx.length > 0 ) {
			return ctx[0].oAjaxData;
		}
	
		// else return undefined;
	} );
	
	
	/**
	 * Reload tables from the Ajax data source. Note that this function will
	 * automatically re-draw the table when the remote data has been loaded.
	 *
	 * @param {boolean} [reset=true] Reset (default) or hold the current paging
	 *   position. A full re-sort and re-filter is performed when this method is
	 *   called, which is why the pagination reset is the default action.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.reload()', function ( callback, resetPaging ) {
		return this.iterator( 'table', function (settings) {
			__reload( settings, resetPaging===false, callback );
		} );
	} );
	
	
	/**
	 * Get the current Ajax URL. Note that this returns the URL from the first
	 * table in the current context.
	 *
	 * @return {string} Current Ajax source URL
	 *//**
	 * Set the Ajax URL. Note that this will set the URL for all tables in the
	 * current context.
	 *
	 * @param {string} url URL to set.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url()', function ( url ) {
		var ctx = this.context;
	
		if ( url === undefined ) {
			// get
			if ( ctx.length === 0 ) {
				return undefined;
			}
			ctx = ctx[0];
	
			return ctx.ajax ?
				$.isPlainObject( ctx.ajax ) ?
					ctx.ajax.url :
					ctx.ajax :
				ctx.sAjaxSource;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( $.isPlainObject( settings.ajax ) ) {
				settings.ajax.url = url;
			}
			else {
				settings.ajax = url;
			}
			// No need to consider sAjaxSource here since DataTables gives priority
			// to `ajax` over `sAjaxSource`. So setting `ajax` here, renders any
			// value of `sAjaxSource` redundant.
		} );
	} );
	
	
	/**
	 * Load data from the newly set Ajax URL. Note that this method is only
	 * available when `ajax.url()` is used to set a URL. Additionally, this method
	 * has the same effect as calling `ajax.reload()` but is provided for
	 * convenience when setting a new URL. Like `ajax.reload()` it will
	 * automatically redraw the table once the remote data has been loaded.
	 *
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'ajax.url().load()', function ( callback, resetPaging ) {
		// Same as a reload, but makes sense to present it for easy access after a
		// url change
		return this.iterator( 'table', function ( ctx ) {
			__reload( ctx, resetPaging===false, callback );
		} );
	} );
	
	
	
	
	var _selector_run = function ( type, selector, selectFn, settings, opts )
	{
		var
			out = [], res,
			a, i, ien, j, jen,
			selectorType = typeof selector;
	
		// Can't just check for isArray here, as an API or jQuery instance might be
		// given with their array like look
		if ( ! selector || selectorType === 'string' || selectorType === 'function' || selector.length === undefined ) {
			selector = [ selector ];
		}
	
		for ( i=0, ien=selector.length ; i<ien ; i++ ) {
			// Only split on simple strings - complex expressions will be jQuery selectors
			a = selector[i] && selector[i].split && ! selector[i].match(/[\[\(:]/) ?
				selector[i].split(',') :
				[ selector[i] ];
	
			for ( j=0, jen=a.length ; j<jen ; j++ ) {
				res = selectFn( typeof a[j] === 'string' ? (a[j]).trim() : a[j] );
	
				if ( res && res.length ) {
					out = out.concat( res );
				}
			}
		}
	
		// selector extensions
		var ext = _ext.selector[ type ];
		if ( ext.length ) {
			for ( i=0, ien=ext.length ; i<ien ; i++ ) {
				out = ext[i]( settings, opts, out );
			}
		}
	
		return _unique( out );
	};
	
	
	var _selector_opts = function ( opts )
	{
		if ( ! opts ) {
			opts = {};
		}
	
		// Backwards compatibility for 1.9- which used the terminology filter rather
		// than search
		if ( opts.filter && opts.search === undefined ) {
			opts.search = opts.filter;
		}
	
		return $.extend( {
			search: 'none',
			order: 'current',
			page: 'all'
		}, opts );
	};
	
	
	var _selector_first = function ( inst )
	{
		// Reduce the API instance to the first item found
		for ( var i=0, ien=inst.length ; i<ien ; i++ ) {
			if ( inst[i].length > 0 ) {
				// Assign the first element to the first item in the instance
				// and truncate the instance and context
				inst[0] = inst[i];
				inst[0].length = 1;
				inst.length = 1;
				inst.context = [ inst.context[i] ];
	
				return inst;
			}
		}
	
		// Not found - return an empty instance
		inst.length = 0;
		return inst;
	};
	
	
	var _selector_row_indexes = function ( settings, opts )
	{
		var
			i, ien, tmp, a=[],
			displayFiltered = settings.aiDisplay,
			displayMaster = settings.aiDisplayMaster;
	
		var
			search = opts.search,  // none, applied, removed
			order  = opts.order,   // applied, current, index (original - compatibility with 1.9)
			page   = opts.page;    // all, current
	
		if ( _fnDataSource( settings ) == 'ssp' ) {
			// In server-side processing mode, most options are irrelevant since
			// rows not shown don't exist and the index order is the applied order
			// Removed is a special case - for consistency just return an empty
			// array
			return search === 'removed' ?
				[] :
				_range( 0, displayMaster.length );
		}
		else if ( page == 'current' ) {
			// Current page implies that order=current and fitler=applied, since it is
			// fairly senseless otherwise, regardless of what order and search actually
			// are
			for ( i=settings._iDisplayStart, ien=settings.fnDisplayEnd() ; i<ien ; i++ ) {
				a.push( displayFiltered[i] );
			}
		}
		else if ( order == 'current' || order == 'applied' ) {
			if ( search == 'none') {
				a = displayMaster.slice();
			}
			else if ( search == 'applied' ) {
				a = displayFiltered.slice();
			}
			else if ( search == 'removed' ) {
				// O(n+m) solution by creating a hash map
				var displayFilteredMap = {};
	
				for ( var i=0, ien=displayFiltered.length ; i<ien ; i++ ) {
					displayFilteredMap[displayFiltered[i]] = null;
				}
	
				a = $.map( displayMaster, function (el) {
					return ! displayFilteredMap.hasOwnProperty(el) ?
						el :
						null;
				} );
			}
		}
		else if ( order == 'index' || order == 'original' ) {
			for ( i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				if ( search == 'none' ) {
					a.push( i );
				}
				else { // applied | removed
					tmp = $.inArray( i, displayFiltered );
	
					if ((tmp === -1 && search == 'removed') ||
						(tmp >= 0   && search == 'applied') )
					{
						a.push( i );
					}
				}
			}
		}
	
		return a;
	};
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Rows
	 *
	 * {}          - no selector - use all available rows
	 * {integer}   - row aoData index
	 * {node}      - TR node
	 * {string}    - jQuery selector to apply to the TR elements
	 * {array}     - jQuery array of nodes, or simply an array of TR nodes
	 *
	 */
	var __row_selector = function ( settings, selector, opts )
	{
		var rows;
		var run = function ( sel ) {
			var selInt = _intVal( sel );
			var i, ien;
			var aoData = settings.aoData;
	
			// Short cut - selector is a number and no options provided (default is
			// all records, so no need to check if the index is in there, since it
			// must be - dev error if the index doesn't exist).
			if ( selInt !== null && ! opts ) {
				return [ selInt ];
			}
	
			if ( ! rows ) {
				rows = _selector_row_indexes( settings, opts );
			}
	
			if ( selInt !== null && $.inArray( selInt, rows ) !== -1 ) {
				// Selector - integer
				return [ selInt ];
			}
			else if ( sel === null || sel === undefined || sel === '' ) {
				// Selector - none
				return rows;
			}
	
			// Selector - function
			if ( typeof sel === 'function' ) {
				return $.map( rows, function (idx) {
					var row = aoData[ idx ];
					return sel( idx, row._aData, row.nTr ) ? idx : null;
				} );
			}
	
			// Selector - node
			if ( sel.nodeName ) {
				var rowIdx = sel._DT_RowIndex;  // Property added by DT for fast lookup
				var cellIdx = sel._DT_CellIndex;
	
				if ( rowIdx !== undefined ) {
					// Make sure that the row is actually still present in the table
					return aoData[ rowIdx ] && aoData[ rowIdx ].nTr === sel ?
						[ rowIdx ] :
						[];
				}
				else if ( cellIdx ) {
					return aoData[ cellIdx.row ] && aoData[ cellIdx.row ].nTr === sel.parentNode ?
						[ cellIdx.row ] :
						[];
				}
				else {
					var host = $(sel).closest('*[data-dt-row]');
					return host.length ?
						[ host.data('dt-row') ] :
						[];
				}
			}
	
			// ID selector. Want to always be able to select rows by id, regardless
			// of if the tr element has been created or not, so can't rely upon
			// jQuery here - hence a custom implementation. This does not match
			// Sizzle's fast selector or HTML4 - in HTML5 the ID can be anything,
			// but to select it using a CSS selector engine (like Sizzle or
			// querySelect) it would need to need to be escaped for some characters.
			// DataTables simplifies this for row selectors since you can select
			// only a row. A # indicates an id any anything that follows is the id -
			// unescaped.
			if ( typeof sel === 'string' && sel.charAt(0) === '#' ) {
				// get row index from id
				var rowObj = settings.aIds[ sel.replace( /^#/, '' ) ];
				if ( rowObj !== undefined ) {
					return [ rowObj.idx ];
				}
	
				// need to fall through to jQuery in case there is DOM id that
				// matches
			}
			
			// Get nodes in the order from the `rows` array with null values removed
			var nodes = _removeEmpty(
				_pluck_order( settings.aoData, rows, 'nTr' )
			);
	
			// Selector - jQuery selector string, array of nodes or jQuery object/
			// As jQuery's .filter() allows jQuery objects to be passed in filter,
			// it also allows arrays, so this will cope with all three options
			return $(nodes)
				.filter( sel )
				.map( function () {
					return this._DT_RowIndex;
				} )
				.toArray();
		};
	
		return _selector_run( 'row', selector, run, settings, opts );
	};
	
	
	_api_register( 'rows()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __row_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in __row_selector?
		inst.selector.rows = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_register( 'rows().nodes()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return settings.aoData[ row ].nTr || undefined;
		}, 1 );
	} );
	
	_api_register( 'rows().data()', function () {
		return this.iterator( true, 'rows', function ( settings, rows ) {
			return _pluck_order( settings.aoData, rows, '_aData' );
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().cache()', 'row().cache()', function ( type ) {
		return this.iterator( 'row', function ( settings, row ) {
			var r = settings.aoData[ row ];
			return type === 'search' ? r._aFilterData : r._aSortData;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().invalidate()', 'row().invalidate()', function ( src ) {
		return this.iterator( 'row', function ( settings, row ) {
			_fnInvalidate( settings, row, src );
		} );
	} );
	
	_api_registerPlural( 'rows().indexes()', 'row().index()', function () {
		return this.iterator( 'row', function ( settings, row ) {
			return row;
		}, 1 );
	} );
	
	_api_registerPlural( 'rows().ids()', 'row().id()', function ( hash ) {
		var a = [];
		var context = this.context;
	
		// `iterator` will drop undefined values, but in this case we want them
		for ( var i=0, ien=context.length ; i<ien ; i++ ) {
			for ( var j=0, jen=this[i].length ; j<jen ; j++ ) {
				var id = context[i].rowIdFn( context[i].aoData[ this[i][j] ]._aData );
				a.push( (hash === true ? '#' : '' )+ id );
			}
		}
	
		return new _Api( context, a );
	} );
	
	_api_registerPlural( 'rows().remove()', 'row().remove()', function () {
		var that = this;
	
		this.iterator( 'row', function ( settings, row, thatIdx ) {
			var data = settings.aoData;
			var rowData = data[ row ];
			var i, ien, j, jen;
			var loopRow, loopCells;
	
			data.splice( row, 1 );
	
			// Update the cached indexes
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				loopRow = data[i];
				loopCells = loopRow.anCells;
	
				// Rows
				if ( loopRow.nTr !== null ) {
					loopRow.nTr._DT_RowIndex = i;
				}
	
				// Cells
				if ( loopCells !== null ) {
					for ( j=0, jen=loopCells.length ; j<jen ; j++ ) {
						loopCells[j]._DT_CellIndex.row = i;
					}
				}
			}
	
			// Delete from the display arrays
			_fnDeleteIndex( settings.aiDisplayMaster, row );
			_fnDeleteIndex( settings.aiDisplay, row );
			_fnDeleteIndex( that[ thatIdx ], row, false ); // maintain local indexes
	
			// For server-side processing tables - subtract the deleted row from the count
			if ( settings._iRecordsDisplay > 0 ) {
				settings._iRecordsDisplay--;
			}
	
			// Check for an 'overflow' they case for displaying the table
			_fnLengthOverflow( settings );
	
			// Remove the row's ID reference if there is one
			var id = settings.rowIdFn( rowData._aData );
			if ( id !== undefined ) {
				delete settings.aIds[ id ];
			}
		} );
	
		this.iterator( 'table', function ( settings ) {
			for ( var i=0, ien=settings.aoData.length ; i<ien ; i++ ) {
				settings.aoData[i].idx = i;
			}
		} );
	
		return this;
	} );
	
	
	_api_register( 'rows.add()', function ( rows ) {
		var newRows = this.iterator( 'table', function ( settings ) {
				var row, i, ien;
				var out = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
						out.push( _fnAddTr( settings, row )[0] );
					}
					else {
						out.push( _fnAddData( settings, row ) );
					}
				}
	
				return out;
			}, 1 );
	
		// Return an Api.rows() extended instance, so rows().nodes() etc can be used
		var modRows = this.rows( -1 );
		modRows.pop();
		$.merge( modRows, newRows );
	
		return modRows;
	} );
	
	
	
	
	
	/**
	 *
	 */
	_api_register( 'row()', function ( selector, opts ) {
		return _selector_first( this.rows( selector, opts ) );
	} );
	
	
	_api_register( 'row().data()', function ( data ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// Get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._aData :
				undefined;
		}
	
		// Set
		var row = ctx[0].aoData[ this[0] ];
		row._aData = data;
	
		// If the DOM has an id, and the data source is an array
		if ( Array.isArray( data ) && row.nTr && row.nTr.id ) {
			_fnSetObjectDataFn( ctx[0].rowId )( data, row.nTr.id );
		}
	
		// Automatically invalidate
		_fnInvalidate( ctx[0], this[0], 'data' );
	
		return this;
	} );
	
	
	_api_register( 'row().node()', function () {
		var ctx = this.context;
	
		return ctx.length && this.length ?
			ctx[0].aoData[ this[0] ].nTr || null :
			null;
	} );
	
	
	_api_register( 'row.add()', function ( row ) {
		// Allow a jQuery object to be passed in - only a single row is added from
		// it though - the first element in the set
		if ( row instanceof $ && row.length ) {
			row = row[0];
		}
	
		var rows = this.iterator( 'table', function ( settings ) {
			if ( row.nodeName && row.nodeName.toUpperCase() === 'TR' ) {
				return _fnAddTr( settings, row )[0];
			}
			return _fnAddData( settings, row );
		} );
	
		// Return an Api.rows() extended instance, with the newly added row selected
		return this.row( rows[0] );
	} );
	
	
	
	var __details_add = function ( ctx, row, data, klass )
	{
		// Convert to array of TR elements
		var rows = [];
		var addRow = function ( r, k ) {
			// Recursion to allow for arrays of jQuery objects
			if ( Array.isArray( r ) || r instanceof $ ) {
				for ( var i=0, ien=r.length ; i<ien ; i++ ) {
					addRow( r[i], k );
				}
				return;
			}
	
			// If we get a TR element, then just add it directly - up to the dev
			// to add the correct number of columns etc
			if ( r.nodeName && r.nodeName.toLowerCase() === 'tr' ) {
				rows.push( r );
			}
			else {
				// Otherwise create a row with a wrapper
				var created = $('<tr><td></td></tr>').addClass( k );
				$('td', created)
					.addClass( k )
					.html( r )
					[0].colSpan = _fnVisbleColumns( ctx );
	
				rows.push( created[0] );
			}
		};
	
		addRow( data, klass );
	
		if ( row._details ) {
			row._details.detach();
		}
	
		row._details = $(rows);
	
		// If the children were already shown, that state should be retained
		if ( row._detailsShow ) {
			row._details.insertAfter( row.nTr );
		}
	};
	
	
	var __details_remove = function ( api, idx )
	{
		var ctx = api.context;
	
		if ( ctx.length ) {
			var row = ctx[0].aoData[ idx !== undefined ? idx : api[0] ];
	
			if ( row && row._details ) {
				row._details.remove();
	
				row._detailsShow = undefined;
				row._details = undefined;
			}
		}
	};
	
	
	var __details_display = function ( api, show ) {
		var ctx = api.context;
	
		if ( ctx.length && api.length ) {
			var row = ctx[0].aoData[ api[0] ];
	
			if ( row._details ) {
				row._detailsShow = show;
	
				if ( show ) {
					row._details.insertAfter( row.nTr );
				}
				else {
					row._details.detach();
				}
	
				__details_events( ctx[0] );
			}
		}
	};
	
	
	var __details_events = function ( settings )
	{
		var api = new _Api( settings );
		var namespace = '.dt.DT_details';
		var drawEvent = 'draw'+namespace;
		var colvisEvent = 'column-visibility'+namespace;
		var destroyEvent = 'destroy'+namespace;
		var data = settings.aoData;
	
		api.off( drawEvent +' '+ colvisEvent +' '+ destroyEvent );
	
		if ( _pluck( data, '_details' ).length > 0 ) {
			// On each draw, insert the required elements into the document
			api.on( drawEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				api.rows( {page:'current'} ).eq(0).each( function (idx) {
					// Internal data grab
					var row = data[ idx ];
	
					if ( row._detailsShow ) {
						row._details.insertAfter( row.nTr );
					}
				} );
			} );
	
			// Column visibility change - update the colspan
			api.on( colvisEvent, function ( e, ctx, idx, vis ) {
				if ( settings !== ctx ) {
					return;
				}
	
				// Update the colspan for the details rows (note, only if it already has
				// a colspan)
				var row, visible = _fnVisbleColumns( ctx );
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					row = data[i];
	
					if ( row._details ) {
						row._details.children('td[colspan]').attr('colspan', visible );
					}
				}
			} );
	
			// Table destroyed - nuke any child rows
			api.on( destroyEvent, function ( e, ctx ) {
				if ( settings !== ctx ) {
					return;
				}
	
				for ( var i=0, ien=data.length ; i<ien ; i++ ) {
					if ( data[i]._details ) {
						__details_remove( api, i );
					}
				}
			} );
		}
	};
	
	// Strings for the method names to help minification
	var _emp = '';
	var _child_obj = _emp+'row().child';
	var _child_mth = _child_obj+'()';
	
	// data can be:
	//  tr
	//  string
	//  jQuery or array of any of the above
	_api_register( _child_mth, function ( data, klass ) {
		var ctx = this.context;
	
		if ( data === undefined ) {
			// get
			return ctx.length && this.length ?
				ctx[0].aoData[ this[0] ]._details :
				undefined;
		}
		else if ( data === true ) {
			// show
			this.child.show();
		}
		else if ( data === false ) {
			// remove
			__details_remove( this );
		}
		else if ( ctx.length && this.length ) {
			// set
			__details_add( ctx[0], ctx[0].aoData[ this[0] ], data, klass );
		}
	
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.show()',
		_child_mth+'.show()' // only when `child()` was called with parameters (without
	], function ( show ) {   // it returns an object and this method is not executed)
		__details_display( this, true );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.hide()',
		_child_mth+'.hide()' // only when `child()` was called with parameters (without
	], function () {         // it returns an object and this method is not executed)
		__details_display( this, false );
		return this;
	} );
	
	
	_api_register( [
		_child_obj+'.remove()',
		_child_mth+'.remove()' // only when `child()` was called with parameters (without
	], function () {           // it returns an object and this method is not executed)
		__details_remove( this );
		return this;
	} );
	
	
	_api_register( _child_obj+'.isShown()', function () {
		var ctx = this.context;
	
		if ( ctx.length && this.length ) {
			// _detailsShown as false or undefined will fall through to return false
			return ctx[0].aoData[ this[0] ]._detailsShow || false;
		}
		return false;
	} );
	
	
	
	/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
	 * Columns
	 *
	 * {integer}           - column index (>=0 count from left, <0 count from right)
	 * "{integer}:visIdx"  - visible column index (i.e. translate to column index)  (>=0 count from left, <0 count from right)
	 * "{integer}:visible" - alias for {integer}:visIdx  (>=0 count from left, <0 count from right)
	 * "{string}:name"     - column name
	 * "{string}"          - jQuery selector on column header nodes
	 *
	 */
	
	// can be an array of these items, comma separated list, or an array of comma
	// separated lists
	
	var __re_column_selector = /^([^:]+):(name|visIdx|visible)$/;
	
	
	// r1 and r2 are redundant - but it means that the parameters match for the
	// iterator callback in columns().data()
	var __columnData = function ( settings, column, r1, r2, rows ) {
		var a = [];
		for ( var row=0, ien=rows.length ; row<ien ; row++ ) {
			a.push( _fnGetCellData( settings, rows[row], column ) );
		}
		return a;
	};
	
	
	var __column_selector = function ( settings, selector, opts )
	{
		var
			columns = settings.aoColumns,
			names = _pluck( columns, 'sName' ),
			nodes = _pluck( columns, 'nTh' );
	
		var run = function ( s ) {
			var selInt = _intVal( s );
	
			// Selector - all
			if ( s === '' ) {
				return _range( columns.length );
			}
	
			// Selector - index
			if ( selInt !== null ) {
				return [ selInt >= 0 ?
					selInt : // Count from left
					columns.length + selInt // Count from right (+ because its a negative value)
				];
			}
	
			// Selector = function
			if ( typeof s === 'function' ) {
				var rows = _selector_row_indexes( settings, opts );
	
				return $.map( columns, function (col, idx) {
					return s(
							idx,
							__columnData( settings, idx, 0, 0, rows ),
							nodes[ idx ]
						) ? idx : null;
				} );
			}
	
			// jQuery or string selector
			var match = typeof s === 'string' ?
				s.match( __re_column_selector ) :
				'';
	
			if ( match ) {
				switch( match[2] ) {
					case 'visIdx':
					case 'visible':
						var idx = parseInt( match[1], 10 );
						// Visible index given, convert to column index
						if ( idx < 0 ) {
							// Counting from the right
							var visColumns = $.map( columns, function (col,i) {
								return col.bVisible ? i : null;
							} );
							return [ visColumns[ visColumns.length + idx ] ];
						}
						// Counting from the left
						return [ _fnVisibleToColumnIndex( settings, idx ) ];
	
					case 'name':
						// match by name. `names` is column index complete and in order
						return $.map( names, function (name, i) {
							return name === match[1] ? i : null;
						} );
	
					default:
						return [];
				}
			}
	
			// Cell in the table body
			if ( s.nodeName && s._DT_CellIndex ) {
				return [ s._DT_CellIndex.column ];
			}
	
			// jQuery selector on the TH elements for the columns
			var jqResult = $( nodes )
				.filter( s )
				.map( function () {
					return $.inArray( this, nodes ); // `nodes` is column index complete and in order
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise a node which might have a `dt-column` data attribute, or be
			// a child or such an element
			var host = $(s).closest('*[data-dt-column]');
			return host.length ?
				[ host.data('dt-column') ] :
				[];
		};
	
		return _selector_run( 'column', selector, run, settings, opts );
	};
	
	
	var __setColumnVis = function ( settings, column, vis ) {
		var
			cols = settings.aoColumns,
			col  = cols[ column ],
			data = settings.aoData,
			row, cells, i, ien, tr;
	
		// Get
		if ( vis === undefined ) {
			return col.bVisible;
		}
	
		// Set
		// No change
		if ( col.bVisible === vis ) {
			return;
		}
	
		if ( vis ) {
			// Insert column
			// Need to decide if we should use appendChild or insertBefore
			var insertBefore = $.inArray( true, _pluck(cols, 'bVisible'), column+1 );
	
			for ( i=0, ien=data.length ; i<ien ; i++ ) {
				tr = data[i].nTr;
				cells = data[i].anCells;
	
				if ( tr ) {
					// insertBefore can act like appendChild if 2nd arg is null
					tr.insertBefore( cells[ column ], cells[ insertBefore ] || null );
				}
			}
		}
		else {
			// Remove column
			$( _pluck( settings.aoData, 'anCells', column ) ).detach();
		}
	
		// Common actions
		col.bVisible = vis;
	};
	
	
	_api_register( 'columns()', function ( selector, opts ) {
		// argument shifting
		if ( selector === undefined ) {
			selector = '';
		}
		else if ( $.isPlainObject( selector ) ) {
			opts = selector;
			selector = '';
		}
	
		opts = _selector_opts( opts );
	
		var inst = this.iterator( 'table', function ( settings ) {
			return __column_selector( settings, selector, opts );
		}, 1 );
	
		// Want argument shifting here and in _row_selector?
		inst.selector.cols = selector;
		inst.selector.opts = opts;
	
		return inst;
	} );
	
	_api_registerPlural( 'columns().header()', 'column().header()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTh;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().footer()', 'column().footer()', function ( selector, opts ) {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].nTf;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().data()', 'column().data()', function () {
		return this.iterator( 'column-rows', __columnData, 1 );
	} );
	
	_api_registerPlural( 'columns().dataSrc()', 'column().dataSrc()', function () {
		return this.iterator( 'column', function ( settings, column ) {
			return settings.aoColumns[column].mData;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().cache()', 'column().cache()', function ( type ) {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows,
				type === 'search' ? '_aFilterData' : '_aSortData', column
			);
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().nodes()', 'column().nodes()', function () {
		return this.iterator( 'column-rows', function ( settings, column, i, j, rows ) {
			return _pluck_order( settings.aoData, rows, 'anCells', column ) ;
		}, 1 );
	} );
	
	_api_registerPlural( 'columns().visible()', 'column().visible()', function ( vis, calc ) {
		var that = this;
		var ret = this.iterator( 'column', function ( settings, column ) {
			if ( vis === undefined ) {
				return settings.aoColumns[ column ].bVisible;
			} // else
			__setColumnVis( settings, column, vis );
		} );
	
		// Group the column visibility changes
		if ( vis !== undefined ) {
			this.iterator( 'table', function ( settings ) {
				// Redraw the header after changes
				_fnDrawHead( settings, settings.aoHeader );
				_fnDrawHead( settings, settings.aoFooter );
		
				// Update colspan for no records display. Child rows and extensions will use their own
				// listeners to do this - only need to update the empty table item here
				if ( ! settings.aiDisplay.length ) {
					$(settings.nTBody).find('td[colspan]').attr('colspan', _fnVisbleColumns(settings));
				}
		
				_fnSaveState( settings );
	
				// Second loop once the first is done for events
				that.iterator( 'column', function ( settings, column ) {
					_fnCallbackFire( settings, null, 'column-visibility', [settings, column, vis, calc] );
				} );
	
				if ( calc === undefined || calc ) {
					that.columns.adjust();
				}
			});
		}
	
		return ret;
	} );
	
	_api_registerPlural( 'columns().indexes()', 'column().index()', function ( type ) {
		return this.iterator( 'column', function ( settings, column ) {
			return type === 'visible' ?
				_fnColumnIndexToVisible( settings, column ) :
				column;
		}, 1 );
	} );
	
	_api_register( 'columns.adjust()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnAdjustColumnSizing( settings );
		}, 1 );
	} );
	
	_api_register( 'column.index()', function ( type, idx ) {
		if ( this.context.length !== 0 ) {
			var ctx = this.context[0];
	
			if ( type === 'fromVisible' || type === 'toData' ) {
				return _fnVisibleToColumnIndex( ctx, idx );
			}
			else if ( type === 'fromData' || type === 'toVisible' ) {
				return _fnColumnIndexToVisible( ctx, idx );
			}
		}
	} );
	
	_api_register( 'column()', function ( selector, opts ) {
		return _selector_first( this.columns( selector, opts ) );
	} );
	
	var __cell_selector = function ( settings, selector, opts )
	{
		var data = settings.aoData;
		var rows = _selector_row_indexes( settings, opts );
		var cells = _removeEmpty( _pluck_order( data, rows, 'anCells' ) );
		var allCells = $(_flatten( [], cells ));
		var row;
		var columns = settings.aoColumns.length;
		var a, i, ien, j, o, host;
	
		var run = function ( s ) {
			var fnSelector = typeof s === 'function';
	
			if ( s === null || s === undefined || fnSelector ) {
				// All cells and function selectors
				a = [];
	
				for ( i=0, ien=rows.length ; i<ien ; i++ ) {
					row = rows[i];
	
					for ( j=0 ; j<columns ; j++ ) {
						o = {
							row: row,
							column: j
						};
	
						if ( fnSelector ) {
							// Selector - function
							host = data[ row ];
	
							if ( s( o, _fnGetCellData(settings, row, j), host.anCells ? host.anCells[j] : null ) ) {
								a.push( o );
							}
						}
						else {
							// Selector - all
							a.push( o );
						}
					}
				}
	
				return a;
			}
			
			// Selector - index
			if ( $.isPlainObject( s ) ) {
				// Valid cell index and its in the array of selectable rows
				return s.column !== undefined && s.row !== undefined && $.inArray( s.row, rows ) !== -1 ?
					[s] :
					[];
			}
	
			// Selector - jQuery filtered cells
			var jqResult = allCells
				.filter( s )
				.map( function (i, el) {
					return { // use a new object, in case someone changes the values
						row:    el._DT_CellIndex.row,
						column: el._DT_CellIndex.column
	 				};
				} )
				.toArray();
	
			if ( jqResult.length || ! s.nodeName ) {
				return jqResult;
			}
	
			// Otherwise the selector is a node, and there is one last option - the
			// element might be a child of an element which has dt-row and dt-column
			// data attributes
			host = $(s).closest('*[data-dt-row]');
			return host.length ?
				[ {
					row: host.data('dt-row'),
					column: host.data('dt-column')
				} ] :
				[];
		};
	
		return _selector_run( 'cell', selector, run, settings, opts );
	};
	
	
	
	
	_api_register( 'cells()', function ( rowSelector, columnSelector, opts ) {
		// Argument shifting
		if ( $.isPlainObject( rowSelector ) ) {
			// Indexes
			if ( rowSelector.row === undefined ) {
				// Selector options in first parameter
				opts = rowSelector;
				rowSelector = null;
			}
			else {
				// Cell index objects in first parameter
				opts = columnSelector;
				columnSelector = null;
			}
		}
		if ( $.isPlainObject( columnSelector ) ) {
			opts = columnSelector;
			columnSelector = null;
		}
	
		// Cell selector
		if ( columnSelector === null || columnSelector === undefined ) {
			return this.iterator( 'table', function ( settings ) {
				return __cell_selector( settings, rowSelector, _selector_opts( opts ) );
			} );
		}
	
		// The default built in options need to apply to row and columns
		var internalOpts = opts ? {
			page: opts.page,
			order: opts.order,
			search: opts.search
		} : {};
	
		// Row + column selector
		var columns = this.columns( columnSelector, internalOpts );
		var rows = this.rows( rowSelector, internalOpts );
		var i, ien, j, jen;
	
		var cellsNoOpts = this.iterator( 'table', function ( settings, idx ) {
			var a = [];
	
			for ( i=0, ien=rows[idx].length ; i<ien ; i++ ) {
				for ( j=0, jen=columns[idx].length ; j<jen ; j++ ) {
					a.push( {
						row:    rows[idx][i],
						column: columns[idx][j]
					} );
				}
			}
	
			return a;
		}, 1 );
	
		// There is currently only one extension which uses a cell selector extension
		// It is a _major_ performance drag to run this if it isn't needed, so this is
		// an extension specific check at the moment
		var cells = opts && opts.selected ?
			this.cells( cellsNoOpts, opts ) :
			cellsNoOpts;
	
		$.extend( cells.selector, {
			cols: columnSelector,
			rows: rowSelector,
			opts: opts
		} );
	
		return cells;
	} );
	
	
	_api_registerPlural( 'cells().nodes()', 'cell().node()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			var data = settings.aoData[ row ];
	
			return data && data.anCells ?
				data.anCells[ column ] :
				undefined;
		}, 1 );
	} );
	
	
	_api_register( 'cells().data()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().cache()', 'cell().cache()', function ( type ) {
		type = type === 'search' ? '_aFilterData' : '_aSortData';
	
		return this.iterator( 'cell', function ( settings, row, column ) {
			return settings.aoData[ row ][ type ][ column ];
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().render()', 'cell().render()', function ( type ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return _fnGetCellData( settings, row, column, type );
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().indexes()', 'cell().index()', function () {
		return this.iterator( 'cell', function ( settings, row, column ) {
			return {
				row: row,
				column: column,
				columnVisible: _fnColumnIndexToVisible( settings, column )
			};
		}, 1 );
	} );
	
	
	_api_registerPlural( 'cells().invalidate()', 'cell().invalidate()', function ( src ) {
		return this.iterator( 'cell', function ( settings, row, column ) {
			_fnInvalidate( settings, row, src, column );
		} );
	} );
	
	
	
	_api_register( 'cell()', function ( rowSelector, columnSelector, opts ) {
		return _selector_first( this.cells( rowSelector, columnSelector, opts ) );
	} );
	
	
	_api_register( 'cell().data()', function ( data ) {
		var ctx = this.context;
		var cell = this[0];
	
		if ( data === undefined ) {
			// Get
			return ctx.length && cell.length ?
				_fnGetCellData( ctx[0], cell[0].row, cell[0].column ) :
				undefined;
		}
	
		// Set
		_fnSetCellData( ctx[0], cell[0].row, cell[0].column, data );
		_fnInvalidate( ctx[0], cell[0].row, 'data', cell[0].column );
	
		return this;
	} );
	
	
	
	/**
	 * Get current ordering (sorting) that has been applied to the table.
	 *
	 * @returns {array} 2D array containing the sorting information for the first
	 *   table in the current context. Each element in the parent array represents
	 *   a column being sorted upon (i.e. multi-sorting with two columns would have
	 *   2 inner arrays). The inner arrays may have 2 or 3 elements. The first is
	 *   the column index that the sorting condition applies to, the second is the
	 *   direction of the sort (`desc` or `asc`) and, optionally, the third is the
	 *   index of the sorting order from the `column.sorting` initialisation array.
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {integer} order Column index to sort upon.
	 * @param {string} direction Direction of the sort to be applied (`asc` or `desc`)
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 1D array of sorting information to be applied.
	 * @param {array} [...] Optional additional sorting conditions
	 * @returns {DataTables.Api} this
	 *//**
	 * Set the ordering for the table.
	 *
	 * @param {array} order 2D array of sorting information to be applied.
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order()', function ( order, dir ) {
		var ctx = this.context;
	
		if ( order === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].aaSorting :
				undefined;
		}
	
		// set
		if ( typeof order === 'number' ) {
			// Simple column / direction passed in
			order = [ [ order, dir ] ];
		}
		else if ( order.length && ! Array.isArray( order[0] ) ) {
			// Arguments passed in (list of 1D arrays)
			order = Array.prototype.slice.call( arguments );
		}
		// otherwise a 2D array was passed in
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSorting = order.slice();
		} );
	} );
	
	
	/**
	 * Attach a sort listener to an element for a given column
	 *
	 * @param {node|jQuery|string} node Identifier for the element(s) to attach the
	 *   listener to. This can take the form of a single DOM node, a jQuery
	 *   collection of nodes or a jQuery selector which will identify the node(s).
	 * @param {integer} column the column that a click on this node will sort on
	 * @param {function} [callback] callback function when sort is run
	 * @returns {DataTables.Api} this
	 */
	_api_register( 'order.listener()', function ( node, column, callback ) {
		return this.iterator( 'table', function ( settings ) {
			_fnSortAttachListener( settings, node, column, callback );
		} );
	} );
	
	
	_api_register( 'order.fixed()', function ( set ) {
		if ( ! set ) {
			var ctx = this.context;
			var fixed = ctx.length ?
				ctx[0].aaSortingFixed :
				undefined;
	
			return Array.isArray( fixed ) ?
				{ pre: fixed } :
				fixed;
		}
	
		return this.iterator( 'table', function ( settings ) {
			settings.aaSortingFixed = $.extend( true, {}, set );
		} );
	} );
	
	
	// Order by the selected column(s)
	_api_register( [
		'columns().order()',
		'column().order()'
	], function ( dir ) {
		var that = this;
	
		return this.iterator( 'table', function ( settings, i ) {
			var sort = [];
	
			$.each( that[i], function (j, col) {
				sort.push( [ col, dir ] );
			} );
	
			settings.aaSorting = sort;
		} );
	} );
	
	
	
	_api_register( 'search()', function ( input, regex, smart, caseInsen ) {
		var ctx = this.context;
	
		if ( input === undefined ) {
			// get
			return ctx.length !== 0 ?
				ctx[0].oPreviousSearch.sSearch :
				undefined;
		}
	
		// set
		return this.iterator( 'table', function ( settings ) {
			if ( ! settings.oFeatures.bFilter ) {
				return;
			}
	
			_fnFilterComplete( settings, $.extend( {}, settings.oPreviousSearch, {
				"sSearch": input+"",
				"bRegex":  regex === null ? false : regex,
				"bSmart":  smart === null ? true  : smart,
				"bCaseInsensitive": caseInsen === null ? true : caseInsen
			} ), 1 );
		} );
	} );
	
	
	_api_registerPlural(
		'columns().search()',
		'column().search()',
		function ( input, regex, smart, caseInsen ) {
			return this.iterator( 'column', function ( settings, column ) {
				var preSearch = settings.aoPreSearchCols;
	
				if ( input === undefined ) {
					// get
					return preSearch[ column ].sSearch;
				}
	
				// set
				if ( ! settings.oFeatures.bFilter ) {
					return;
				}
	
				$.extend( preSearch[ column ], {
					"sSearch": input+"",
					"bRegex":  regex === null ? false : regex,
					"bSmart":  smart === null ? true  : smart,
					"bCaseInsensitive": caseInsen === null ? true : caseInsen
				} );
	
				_fnFilterComplete( settings, settings.oPreviousSearch, 1 );
			} );
		}
	);
	
	/*
	 * State API methods
	 */
	
	_api_register( 'state()', function () {
		return this.context.length ?
			this.context[0].oSavedState :
			null;
	} );
	
	
	_api_register( 'state.clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			// Save an empty object
			settings.fnStateSaveCallback.call( settings.oInstance, settings, {} );
		} );
	} );
	
	
	_api_register( 'state.loaded()', function () {
		return this.context.length ?
			this.context[0].oLoadedState :
			null;
	} );
	
	
	_api_register( 'state.save()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnSaveState( settings );
		} );
	} );
	
	
	
	/**
	 * Provide a common method for plug-ins to check the version of DataTables being
	 * used, in order to ensure compatibility.
	 *
	 *  @param {string} version Version string to check for, in the format "X.Y.Z".
	 *    Note that the formats "X" and "X.Y" are also acceptable.
	 *  @returns {boolean} true if this version of DataTables is greater or equal to
	 *    the required version, or false if this version of DataTales is not
	 *    suitable
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    alert( $.fn.dataTable.versionCheck( '1.9.0' ) );
	 */
	DataTable.versionCheck = DataTable.fnVersionCheck = function( version )
	{
		var aThis = DataTable.version.split('.');
		var aThat = version.split('.');
		var iThis, iThat;
	
		for ( var i=0, iLen=aThat.length ; i<iLen ; i++ ) {
			iThis = parseInt( aThis[i], 10 ) || 0;
			iThat = parseInt( aThat[i], 10 ) || 0;
	
			// Parts are the same, keep comparing
			if (iThis === iThat) {
				continue;
			}
	
			// Parts are different, return immediately
			return iThis > iThat;
		}
	
		return true;
	};
	
	
	/**
	 * Check if a `<table>` node is a DataTable table already or not.
	 *
	 *  @param {node|jquery|string} table Table node, jQuery object or jQuery
	 *      selector for the table to test. Note that if more than more than one
	 *      table is passed on, only the first will be checked
	 *  @returns {boolean} true the table given is a DataTable, or false otherwise
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    if ( ! $.fn.DataTable.isDataTable( '#example' ) ) {
	 *      $('#example').dataTable();
	 *    }
	 */
	DataTable.isDataTable = DataTable.fnIsDataTable = function ( table )
	{
		var t = $(table).get(0);
		var is = false;
	
		if ( table instanceof DataTable.Api ) {
			return true;
		}
	
		$.each( DataTable.settings, function (i, o) {
			var head = o.nScrollHead ? $('table', o.nScrollHead)[0] : null;
			var foot = o.nScrollFoot ? $('table', o.nScrollFoot)[0] : null;
	
			if ( o.nTable === t || head === t || foot === t ) {
				is = true;
			}
		} );
	
		return is;
	};
	
	
	/**
	 * Get all DataTable tables that have been initialised - optionally you can
	 * select to get only currently visible tables.
	 *
	 *  @param {boolean} [visible=false] Flag to indicate if you want all (default)
	 *    or visible tables only.
	 *  @returns {array} Array of `table` nodes (not DataTable instances) which are
	 *    DataTables
	 *  @static
	 *  @dtopt API-Static
	 *
	 *  @example
	 *    $.each( $.fn.dataTable.tables(true), function () {
	 *      $(table).DataTable().columns.adjust();
	 *    } );
	 */
	DataTable.tables = DataTable.fnTables = function ( visible )
	{
		var api = false;
	
		if ( $.isPlainObject( visible ) ) {
			api = visible.api;
			visible = visible.visible;
		}
	
		var a = $.map( DataTable.settings, function (o) {
			if ( !visible || (visible && $(o.nTable).is(':visible')) ) {
				return o.nTable;
			}
		} );
	
		return api ?
			new _Api( a ) :
			a;
	};
	
	
	/**
	 * Convert from camel case parameters to Hungarian notation. This is made public
	 * for the extensions to provide the same ability as DataTables core to accept
	 * either the 1.9 style Hungarian notation, or the 1.10+ style camelCase
	 * parameters.
	 *
	 *  @param {object} src The model object which holds all parameters that can be
	 *    mapped.
	 *  @param {object} user The object to convert from camel case to Hungarian.
	 *  @param {boolean} force When set to `true`, properties which already have a
	 *    Hungarian value in the `user` object will be overwritten. Otherwise they
	 *    won't be.
	 */
	DataTable.camelToHungarian = _fnCamelToHungarian;
	
	
	
	/**
	 *
	 */
	_api_register( '$()', function ( selector, opts ) {
		var
			rows   = this.rows( opts ).nodes(), // Get all rows
			jqRows = $(rows);
	
		return $( [].concat(
			jqRows.filter( selector ).toArray(),
			jqRows.find( selector ).toArray()
		) );
	} );
	
	
	// jQuery functions to operate on the tables
	$.each( [ 'on', 'one', 'off' ], function (i, key) {
		_api_register( key+'()', function ( /* event, handler */ ) {
			var args = Array.prototype.slice.call(arguments);
	
			// Add the `dt` namespace automatically if it isn't already present
			args[0] = $.map( args[0].split( /\s/ ), function ( e ) {
				return ! e.match(/\.dt\b/) ?
					e+'.dt' :
					e;
				} ).join( ' ' );
	
			var inst = $( this.tables().nodes() );
			inst[key].apply( inst, args );
			return this;
		} );
	} );
	
	
	_api_register( 'clear()', function () {
		return this.iterator( 'table', function ( settings ) {
			_fnClearTable( settings );
		} );
	} );
	
	
	_api_register( 'settings()', function () {
		return new _Api( this.context, this.context );
	} );
	
	
	_api_register( 'init()', function () {
		var ctx = this.context;
		return ctx.length ? ctx[0].oInit : null;
	} );
	
	
	_api_register( 'data()', function () {
		return this.iterator( 'table', function ( settings ) {
			return _pluck( settings.aoData, '_aData' );
		} ).flatten();
	} );
	
	
	_api_register( 'destroy()', function ( remove ) {
		remove = remove || false;
	
		return this.iterator( 'table', function ( settings ) {
			var orig      = settings.nTableWrapper.parentNode;
			var classes   = settings.oClasses;
			var table     = settings.nTable;
			var tbody     = settings.nTBody;
			var thead     = settings.nTHead;
			var tfoot     = settings.nTFoot;
			var jqTable   = $(table);
			var jqTbody   = $(tbody);
			var jqWrapper = $(settings.nTableWrapper);
			var rows      = $.map( settings.aoData, function (r) { return r.nTr; } );
			var i, ien;
	
			// Flag to note that the table is currently being destroyed - no action
			// should be taken
			settings.bDestroying = true;
	
			// Fire off the destroy callbacks for plug-ins etc
			_fnCallbackFire( settings, "aoDestroyCallback", "destroy", [settings] );
	
			// If not being removed from the document, make all columns visible
			if ( ! remove ) {
				new _Api( settings ).columns().visible( true );
			}
	
			// Blitz all `DT` namespaced events (these are internal events, the
			// lowercase, `dt` events are user subscribed and they are responsible
			// for removing them
			jqWrapper.off('.DT').find(':not(tbody *)').off('.DT');
			$(window).off('.DT-'+settings.sInstance);
	
			// When scrolling we had to break the table up - restore it
			if ( table != thead.parentNode ) {
				jqTable.children('thead').detach();
				jqTable.append( thead );
			}
	
			if ( tfoot && table != tfoot.parentNode ) {
				jqTable.children('tfoot').detach();
				jqTable.append( tfoot );
			}
	
			settings.aaSorting = [];
			settings.aaSortingFixed = [];
			_fnSortingClasses( settings );
	
			$( rows ).removeClass( settings.asStripeClasses.join(' ') );
	
			$('th, td', thead).removeClass( classes.sSortable+' '+
				classes.sSortableAsc+' '+classes.sSortableDesc+' '+classes.sSortableNone
			);
	
			// Add the TR elements back into the table in their original order
			jqTbody.children().detach();
			jqTbody.append( rows );
	
			// Remove the DataTables generated nodes, events and classes
			var removedMethod = remove ? 'remove' : 'detach';
			jqTable[ removedMethod ]();
			jqWrapper[ removedMethod ]();
	
			// If we need to reattach the table to the document
			if ( ! remove && orig ) {
				// insertBefore acts like appendChild if !arg[1]
				orig.insertBefore( table, settings.nTableReinsertBefore );
	
				// Restore the width of the original table - was read from the style property,
				// so we can restore directly to that
				jqTable
					.css( 'width', settings.sDestroyWidth )
					.removeClass( classes.sTable );
	
				// If the were originally stripe classes - then we add them back here.
				// Note this is not fool proof (for example if not all rows had stripe
				// classes - but it's a good effort without getting carried away
				ien = settings.asDestroyStripes.length;
	
				if ( ien ) {
					jqTbody.children().each( function (i) {
						$(this).addClass( settings.asDestroyStripes[i % ien] );
					} );
				}
			}
	
			/* Remove the settings object from the settings array */
			var idx = $.inArray( settings, DataTable.settings );
			if ( idx !== -1 ) {
				DataTable.settings.splice( idx, 1 );
			}
		} );
	} );
	
	
	// Add the `every()` method for rows, columns and cells in a compact form
	$.each( [ 'column', 'row', 'cell' ], function ( i, type ) {
		_api_register( type+'s().every()', function ( fn ) {
			var opts = this.selector.opts;
			var api = this;
	
			return this.iterator( type, function ( settings, arg1, arg2, arg3, arg4 ) {
				// Rows and columns:
				//  arg1 - index
				//  arg2 - table counter
				//  arg3 - loop counter
				//  arg4 - undefined
				// Cells:
				//  arg1 - row index
				//  arg2 - column index
				//  arg3 - table counter
				//  arg4 - loop counter
				fn.call(
					api[ type ](
						arg1,
						type==='cell' ? arg2 : opts,
						type==='cell' ? opts : undefined
					),
					arg1, arg2, arg3, arg4
				);
			} );
		} );
	} );
	
	
	// i18n method for extensions to be able to use the language object from the
	// DataTable
	_api_register( 'i18n()', function ( token, def, plural ) {
		var ctx = this.context[0];
		var resolved = _fnGetObjectDataFn( token )( ctx.oLanguage );
	
		if ( resolved === undefined ) {
			resolved = def;
		}
	
		if ( plural !== undefined && $.isPlainObject( resolved ) ) {
			resolved = resolved[ plural ] !== undefined ?
				resolved[ plural ] :
				resolved._;
		}
	
		return resolved.replace( '%d', plural ); // nb: plural might be undefined,
	} );
	/**
	 * Version string for plug-ins to check compatibility. Allowed format is
	 * `a.b.c-d` where: a:int, b:int, c:int, d:string(dev|beta|alpha). `d` is used
	 * only for non-release builds. See http://semver.org/ for more information.
	 *  @member
	 *  @type string
	 *  @default Version number
	 */
	DataTable.version = "1.10.22";

	/**
	 * Private data store, containing all of the settings objects that are
	 * created for the tables on a given page.
	 *
	 * Note that the `DataTable.settings` object is aliased to
	 * `jQuery.fn.dataTableExt` through which it may be accessed and
	 * manipulated, or `jQuery.fn.dataTable.settings`.
	 *  @member
	 *  @type array
	 *  @default []
	 *  @private
	 */
	DataTable.settings = [];

	/**
	 * Object models container, for the various models that DataTables has
	 * available to it. These models define the objects that are used to hold
	 * the active state and configuration of the table.
	 *  @namespace
	 */
	DataTable.models = {};
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * search information for the global filter and individual column filters.
	 *  @namespace
	 */
	DataTable.models.oSearch = {
		/**
		 * Flag to indicate if the filtering should be case insensitive or not
		 *  @type boolean
		 *  @default true
		 */
		"bCaseInsensitive": true,
	
		/**
		 * Applied search term
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sSearch": "",
	
		/**
		 * Flag to indicate if the search term should be interpreted as a
		 * regular expression (true) or not (false) and therefore and special
		 * regex characters escaped.
		 *  @type boolean
		 *  @default false
		 */
		"bRegex": false,
	
		/**
		 * Flag to indicate if DataTables is to use its smart filtering or not.
		 *  @type boolean
		 *  @default true
		 */
		"bSmart": true
	};
	
	
	
	
	/**
	 * Template object for the way in which DataTables holds information about
	 * each individual row. This is the object format used for the settings
	 * aoData array.
	 *  @namespace
	 */
	DataTable.models.oRow = {
		/**
		 * TR element for the row
		 *  @type node
		 *  @default null
		 */
		"nTr": null,
	
		/**
		 * Array of TD elements for each row. This is null until the row has been
		 * created.
		 *  @type array nodes
		 *  @default []
		 */
		"anCells": null,
	
		/**
		 * Data object from the original data source for the row. This is either
		 * an array if using the traditional form of DataTables, or an object if
		 * using mData options. The exact type will depend on the passed in
		 * data from the data source, or will be an array if using DOM a data
		 * source.
		 *  @type array|object
		 *  @default []
		 */
		"_aData": [],
	
		/**
		 * Sorting data cache - this array is ostensibly the same length as the
		 * number of columns (although each index is generated only as it is
		 * needed), and holds the data that is used for sorting each column in the
		 * row. We do this cache generation at the start of the sort in order that
		 * the formatting of the sort data need be done only once for each cell
		 * per sort. This array should not be read from or written to by anything
		 * other than the master sorting methods.
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aSortData": null,
	
		/**
		 * Per cell filtering data cache. As per the sort data cache, used to
		 * increase the performance of the filtering in DataTables
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_aFilterData": null,
	
		/**
		 * Filtering data cache. This is the same as the cell filtering cache, but
		 * in this case a string rather than an array. This is easily computed with
		 * a join on `_aFilterData`, but is provided as a cache so the join isn't
		 * needed on every search (memory traded for performance)
		 *  @type array
		 *  @default null
		 *  @private
		 */
		"_sFilterRow": null,
	
		/**
		 * Cache of the class name that DataTables has applied to the row, so we
		 * can quickly look at this variable rather than needing to do a DOM check
		 * on className for the nTr property.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *  @private
		 */
		"_sRowStripe": "",
	
		/**
		 * Denote if the original data source was from the DOM, or the data source
		 * object. This is used for invalidating data, so DataTables can
		 * automatically read data from the original source, unless uninstructed
		 * otherwise.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"src": null,
	
		/**
		 * Index in the aoData array. This saves an indexOf lookup when we have the
		 * object, but want to know the index
		 *  @type integer
		 *  @default -1
		 *  @private
		 */
		"idx": -1
	};
	
	
	/**
	 * Template object for the column information object in DataTables. This object
	 * is held in the settings aoColumns array and contains all the information that
	 * DataTables needs about each individual column.
	 *
	 * Note that this object is related to {@link DataTable.defaults.column}
	 * but this one is the internal data store for DataTables's cache of columns.
	 * It should NOT be manipulated outside of DataTables. Any configuration should
	 * be done through the initialisation options.
	 *  @namespace
	 */
	DataTable.models.oColumn = {
		/**
		 * Column index. This could be worked out on-the-fly with $.inArray, but it
		 * is faster to just hold it as a variable
		 *  @type integer
		 *  @default null
		 */
		"idx": null,
	
		/**
		 * A list of the columns that sorting should occur on when this column
		 * is sorted. That this property is an array allows multi-column sorting
		 * to be defined for a column (for example first name / last name columns
		 * would benefit from this). The values are integers pointing to the
		 * columns to be sorted on (typically it will be a single integer pointing
		 * at itself, but that doesn't need to be the case).
		 *  @type array
		 */
		"aDataSort": null,
	
		/**
		 * Define the sorting directions that are applied to the column, in sequence
		 * as the column is repeatedly sorted upon - i.e. the first value is used
		 * as the sorting direction when the column if first sorted (clicked on).
		 * Sort it again (click again) and it will move on to the next index.
		 * Repeat until loop.
		 *  @type array
		 */
		"asSorting": null,
	
		/**
		 * Flag to indicate if the column is searchable, and thus should be included
		 * in the filtering or not.
		 *  @type boolean
		 */
		"bSearchable": null,
	
		/**
		 * Flag to indicate if the column is sortable or not.
		 *  @type boolean
		 */
		"bSortable": null,
	
		/**
		 * Flag to indicate if the column is currently visible in the table or not
		 *  @type boolean
		 */
		"bVisible": null,
	
		/**
		 * Store for manual type assignment using the `column.type` option. This
		 * is held in store so we can manipulate the column's `sType` property.
		 *  @type string
		 *  @default null
		 *  @private
		 */
		"_sManualType": null,
	
		/**
		 * Flag to indicate if HTML5 data attributes should be used as the data
		 * source for filtering or sorting. True is either are.
		 *  @type boolean
		 *  @default false
		 *  @private
		 */
		"_bAttrSrc": false,
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} nTd The TD node that has been created
		 *  @param {*} sData The Data for the cell
		 *  @param {array|object} oData The data for the whole row
		 *  @param {int} iRow The row index for the aoData data store
		 *  @default null
		 */
		"fnCreatedCell": null,
	
		/**
		 * Function to get data from a cell in a column. You should <b>never</b>
		 * access data directly through _aData internally in DataTables - always use
		 * the method attached to this property. It allows mData to function as
		 * required. This function is automatically assigned by the column
		 * initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {string} sSpecific The specific data type you want to get -
		 *    'display', 'type' 'filter' 'sort'
		 *  @returns {*} The data for the cell from the given row's data
		 *  @default null
		 */
		"fnGetData": null,
	
		/**
		 * Function to set data for a cell in the column. You should <b>never</b>
		 * set the data directly to _aData internally in DataTables - always use
		 * this method. It allows mData to function as required. This function
		 * is automatically assigned by the column initialisation method
		 *  @type function
		 *  @param {array|object} oData The data array/object for the array
		 *    (i.e. aoData[]._aData)
		 *  @param {*} sValue Value to set
		 *  @default null
		 */
		"fnSetData": null,
	
		/**
		 * Property to read the value for the cells in the column from the data
		 * source array / object. If null, then the default content is used, if a
		 * function is given then the return from the function is used.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mData": null,
	
		/**
		 * Partner property to mData which is used (only when defined) to get
		 * the data - i.e. it is basically the same as mData, but without the
		 * 'set' option, and also the data fed to it is the result from mData.
		 * This is the rendering method to match the data method of mData.
		 *  @type function|int|string|null
		 *  @default null
		 */
		"mRender": null,
	
		/**
		 * Unique header TH/TD element for this column - this is what the sorting
		 * listener is attached to (if sorting is enabled.)
		 *  @type node
		 *  @default null
		 */
		"nTh": null,
	
		/**
		 * Unique footer TH/TD element for this column (if there is one). Not used
		 * in DataTables as such, but can be used for plug-ins to reference the
		 * footer for each column.
		 *  @type node
		 *  @default null
		 */
		"nTf": null,
	
		/**
		 * The class to apply to all TD elements in the table's TBODY for the column
		 *  @type string
		 *  @default null
		 */
		"sClass": null,
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 *  @type string
		 */
		"sContentPadding": null,
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because mData
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 */
		"sDefaultContent": null,
	
		/**
		 * Name for the column, allowing reference to the column by name as well as
		 * by index (needs a lookup to work by name).
		 *  @type string
		 */
		"sName": null,
	
		/**
		 * Custom sorting data type - defines which of the available plug-ins in
		 * afnSortData the custom sorting will use - if any is defined.
		 *  @type string
		 *  @default std
		 */
		"sSortDataType": 'std',
	
		/**
		 * Class to be applied to the header element when sorting on this column
		 *  @type string
		 *  @default null
		 */
		"sSortingClass": null,
	
		/**
		 * Class to be applied to the header element when sorting on this column -
		 * when jQuery UI theming is used.
		 *  @type string
		 *  @default null
		 */
		"sSortingClassJUI": null,
	
		/**
		 * Title of the column - what is seen in the TH element (nTh).
		 *  @type string
		 */
		"sTitle": null,
	
		/**
		 * Column sorting and filtering type
		 *  @type string
		 *  @default null
		 */
		"sType": null,
	
		/**
		 * Width of the column
		 *  @type string
		 *  @default null
		 */
		"sWidth": null,
	
		/**
		 * Width of the column when it was first "encountered"
		 *  @type string
		 *  @default null
		 */
		"sWidthOrig": null
	};
	
	
	/*
	 * Developer note: The properties of the object below are given in Hungarian
	 * notation, that was used as the interface for DataTables prior to v1.10, however
	 * from v1.10 onwards the primary interface is camel case. In order to avoid
	 * breaking backwards compatibility utterly with this change, the Hungarian
	 * version is still, internally the primary interface, but is is not documented
	 * - hence the @name tags in each doc comment. This allows a Javascript function
	 * to create a map from Hungarian notation to camel case (going the other direction
	 * would require each property to be listed, which would add around 3K to the size
	 * of DataTables, while this method is about a 0.5K hit).
	 *
	 * Ultimately this does pave the way for Hungarian notation to be dropped
	 * completely, but that is a massive amount of work and will break current
	 * installs (therefore is on-hold until v2).
	 */
	
	/**
	 * Initialisation options that can be given to DataTables at initialisation
	 * time.
	 *  @namespace
	 */
	DataTable.defaults = {
		/**
		 * An array of data to use for the table, passed in at initialisation which
		 * will be used in preference to any data which is already in the DOM. This is
		 * particularly useful for constructing tables purely in Javascript, for
		 * example with a custom Ajax call.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.data
		 *
		 *  @example
		 *    // Using a 2D array data source
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          ['Trident', 'Internet Explorer 4.0', 'Win 95+', 4, 'X'],
		 *          ['Trident', 'Internet Explorer 5.0', 'Win 95+', 5, 'C'],
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine" },
		 *          { "title": "Browser" },
		 *          { "title": "Platform" },
		 *          { "title": "Version" },
		 *          { "title": "Grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using an array of objects as a data source (`data`)
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "data": [
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 4.0",
		 *            "platform": "Win 95+",
		 *            "version":  4,
		 *            "grade":    "X"
		 *          },
		 *          {
		 *            "engine":   "Trident",
		 *            "browser":  "Internet Explorer 5.0",
		 *            "platform": "Win 95+",
		 *            "version":  5,
		 *            "grade":    "C"
		 *          }
		 *        ],
		 *        "columns": [
		 *          { "title": "Engine",   "data": "engine" },
		 *          { "title": "Browser",  "data": "browser" },
		 *          { "title": "Platform", "data": "platform" },
		 *          { "title": "Version",  "data": "version" },
		 *          { "title": "Grade",    "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"aaData": null,
	
	
		/**
		 * If ordering is enabled, then DataTables will perform a first pass sort on
		 * initialisation. You can define which column(s) the sort is performed
		 * upon, and the sorting direction, with this variable. The `sorting` array
		 * should contain an array for each column to be sorted initially containing
		 * the column's index and a direction string ('asc' or 'desc').
		 *  @type array
		 *  @default [[0,'asc']]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.order
		 *
		 *  @example
		 *    // Sort by 3rd column first, and then 4th column
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": [[2,'asc'], [3,'desc']]
		 *      } );
		 *    } );
		 *
		 *    // No initial sorting
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "order": []
		 *      } );
		 *    } );
		 */
		"aaSorting": [[0,'asc']],
	
	
		/**
		 * This parameter is basically identical to the `sorting` parameter, but
		 * cannot be overridden by user interaction with the table. What this means
		 * is that you could have a column (visible or hidden) which the sorting
		 * will always be forced on first - any sorting after that (from the user)
		 * will then be performed as required. This can be useful for grouping rows
		 * together.
		 *  @type array
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.orderFixed
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderFixed": [[0,'asc']]
		 *      } );
		 *    } )
		 */
		"aaSortingFixed": [],
	
	
		/**
		 * DataTables can be instructed to load data to display in the table from a
		 * Ajax source. This option defines how that Ajax call is made and where to.
		 *
		 * The `ajax` property has three different modes of operation, depending on
		 * how it is defined. These are:
		 *
		 * * `string` - Set the URL from where the data should be loaded from.
		 * * `object` - Define properties for `jQuery.ajax`.
		 * * `function` - Custom data get function
		 *
		 * `string`
		 * --------
		 *
		 * As a string, the `ajax` property simply defines the URL from which
		 * DataTables will load data.
		 *
		 * `object`
		 * --------
		 *
		 * As an object, the parameters in the object are passed to
		 * [jQuery.ajax](http://api.jquery.com/jQuery.ajax/) allowing fine control
		 * of the Ajax request. DataTables has a number of default parameters which
		 * you can override using this option. Please refer to the jQuery
		 * documentation for a full description of the options available, although
		 * the following parameters provide additional options in DataTables or
		 * require special consideration:
		 *
		 * * `data` - As with jQuery, `data` can be provided as an object, but it
		 *   can also be used as a function to manipulate the data DataTables sends
		 *   to the server. The function takes a single parameter, an object of
		 *   parameters with the values that DataTables has readied for sending. An
		 *   object may be returned which will be merged into the DataTables
		 *   defaults, or you can add the items to the object that was passed in and
		 *   not return anything from the function. This supersedes `fnServerParams`
		 *   from DataTables 1.9-.
		 *
		 * * `dataSrc` - By default DataTables will look for the property `data` (or
		 *   `aaData` for compatibility with DataTables 1.9-) when obtaining data
		 *   from an Ajax source or for server-side processing - this parameter
		 *   allows that property to be changed. You can use Javascript dotted
		 *   object notation to get a data source for multiple levels of nesting, or
		 *   it my be used as a function. As a function it takes a single parameter,
		 *   the JSON returned from the server, which can be manipulated as
		 *   required, with the returned value being that used by DataTables as the
		 *   data source for the table. This supersedes `sAjaxDataProp` from
		 *   DataTables 1.9-.
		 *
		 * * `success` - Should not be overridden it is used internally in
		 *   DataTables. To manipulate / transform the data returned by the server
		 *   use `ajax.dataSrc`, or use `ajax` as a function (see below).
		 *
		 * `function`
		 * ----------
		 *
		 * As a function, making the Ajax call is left up to yourself allowing
		 * complete control of the Ajax request. Indeed, if desired, a method other
		 * than Ajax could be used to obtain the required data, such as Web storage
		 * or an AIR database.
		 *
		 * The function is given four parameters and no return is required. The
		 * parameters are:
		 *
		 * 1. _object_ - Data to send to the server
		 * 2. _function_ - Callback function that must be executed when the required
		 *    data has been obtained. That data should be passed into the callback
		 *    as the only parameter
		 * 3. _object_ - DataTables settings object for the table
		 *
		 * Note that this supersedes `fnServerData` from DataTables 1.9-.
		 *
		 *  @type string|object|function
		 *  @default null
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.ajax
		 *  @since 1.10.0
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax.
		 *   // Note DataTables expects data in the form `{ data: [ ...data... ] }` by default).
		 *   $('#example').dataTable( {
		 *     "ajax": "data.json"
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to change
		 *   // `data` to `tableData` (i.e. `{ tableData: [ ...data... ] }`)
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": "tableData"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get JSON data from a file via Ajax, using `dataSrc` to read data
		 *   // from a plain array rather than an array in an object
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": ""
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Manipulate the data returned from the server - add a link to data
		 *   // (note this can, should, be done using `render` for the column - this
		 *   // is just a simple example of how the data can be manipulated).
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "dataSrc": function ( json ) {
		 *         for ( var i=0, ien=json.length ; i<ien ; i++ ) {
		 *           json[i][0] = '<a href="/message/'+json[i][0]+'>View message</a>';
		 *         }
		 *         return json;
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Add data to the request
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "data": function ( d ) {
		 *         return {
		 *           "extra_search": $('#extra').val()
		 *         };
		 *       }
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Send request as POST
		 *   $('#example').dataTable( {
		 *     "ajax": {
		 *       "url": "data.json",
		 *       "type": "POST"
		 *     }
		 *   } );
		 *
		 * @example
		 *   // Get the data from localStorage (could interface with a form for
		 *   // adding, editing and removing rows).
		 *   $('#example').dataTable( {
		 *     "ajax": function (data, callback, settings) {
		 *       callback(
		 *         JSON.parse( localStorage.getItem('dataTablesData') )
		 *       );
		 *     }
		 *   } );
		 */
		"ajax": null,
	
	
		/**
		 * This parameter allows you to readily specify the entries in the length drop
		 * down menu that DataTables shows when pagination is enabled. It can be
		 * either a 1D array of options which will be used for both the displayed
		 * option and the value, or a 2D array which will use the array in the first
		 * position as the value, and the array in the second position as the
		 * displayed options (useful for language strings such as 'All').
		 *
		 * Note that the `pageLength` property will be automatically set to the
		 * first value given in this array, unless `pageLength` is also provided.
		 *  @type array
		 *  @default [ 10, 25, 50, 100 ]
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.lengthMenu
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]]
		 *      } );
		 *    } );
		 */
		"aLengthMenu": [ 10, 25, 50, 100 ],
	
	
		/**
		 * The `columns` option in the initialisation parameter allows you to define
		 * details about the way individual columns behave. For a full list of
		 * column options that can be set, please see
		 * {@link DataTable.defaults.column}. Note that if you use `columns` to
		 * define your columns, you must have an entry in the array for every single
		 * column that you have in your table (these can be null if you don't which
		 * to specify any options).
		 *  @member
		 *
		 *  @name DataTable.defaults.column
		 */
		"aoColumns": null,
	
		/**
		 * Very similar to `columns`, `columnDefs` allows you to target a specific
		 * column, multiple columns, or all columns, using the `targets` property of
		 * each object in the array. This allows great flexibility when creating
		 * tables, as the `columnDefs` arrays can be of any length, targeting the
		 * columns you specifically want. `columnDefs` may use any of the column
		 * options available: {@link DataTable.defaults.column}, but it _must_
		 * have `targets` defined in each object in the array. Values in the `targets`
		 * array may be:
		 *   <ul>
		 *     <li>a string - class name will be matched on the TH for the column</li>
		 *     <li>0 or a positive integer - column index counting from the left</li>
		 *     <li>a negative integer - column index counting from the right</li>
		 *     <li>the string "_all" - all columns (i.e. assign a default)</li>
		 *   </ul>
		 *  @member
		 *
		 *  @name DataTable.defaults.columnDefs
		 */
		"aoColumnDefs": null,
	
	
		/**
		 * Basically the same as `search`, this parameter defines the individual column
		 * filtering state at initialisation time. The array must be of the same size
		 * as the number of columns, and each element be an object with the parameters
		 * `search` and `escapeRegex` (the latter is optional). 'null' is also
		 * accepted and the default will be used.
		 *  @type array
		 *  @default []
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.searchCols
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchCols": [
		 *          null,
		 *          { "search": "My filter" },
		 *          null,
		 *          { "search": "^[0-9]", "escapeRegex": false }
		 *        ]
		 *      } );
		 *    } )
		 */
		"aoSearchCols": [],
	
	
		/**
		 * An array of CSS classes that should be applied to displayed rows. This
		 * array may be of any length, and DataTables will apply each class
		 * sequentially, looping when required.
		 *  @type array
		 *  @default null <i>Will take the values determined by the `oClasses.stripe*`
		 *    options</i>
		 *
		 *  @dtopt Option
		 *  @name DataTable.defaults.stripeClasses
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stripeClasses": [ 'strip1', 'strip2', 'strip3' ]
		 *      } );
		 *    } )
		 */
		"asStripeClasses": null,
	
	
		/**
		 * Enable or disable automatic column width calculation. This can be disabled
		 * as an optimisation (it takes some time to calculate the widths) if the
		 * tables widths are passed in using `columns`.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.autoWidth
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "autoWidth": false
		 *      } );
		 *    } );
		 */
		"bAutoWidth": true,
	
	
		/**
		 * Deferred rendering can provide DataTables with a huge speed boost when you
		 * are using an Ajax or JS data source for the table. This option, when set to
		 * true, will cause DataTables to defer the creation of the table elements for
		 * each row until they are needed for a draw - saving a significant amount of
		 * time.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.deferRender
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajax": "sources/arrays.txt",
		 *        "deferRender": true
		 *      } );
		 *    } );
		 */
		"bDeferRender": false,
	
	
		/**
		 * Replace a DataTable which matches the given selector and replace it with
		 * one which has the properties of the new initialisation object passed. If no
		 * table matches the selector, then the new DataTable will be constructed as
		 * per normal.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.destroy
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "srollY": "200px",
		 *        "paginate": false
		 *      } );
		 *
		 *      // Some time later....
		 *      $('#example').dataTable( {
		 *        "filter": false,
		 *        "destroy": true
		 *      } );
		 *    } );
		 */
		"bDestroy": false,
	
	
		/**
		 * Enable or disable filtering of data. Filtering in DataTables is "smart" in
		 * that it allows the end user to input multiple words (space separated) and
		 * will match a row containing those words, even if not in the order that was
		 * specified (this allow matching across multiple columns). Note that if you
		 * wish to use filtering in DataTables this must remain 'true' - to remove the
		 * default filtering input box and retain filtering abilities, please use
		 * {@link DataTable.defaults.dom}.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.searching
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "searching": false
		 *      } );
		 *    } );
		 */
		"bFilter": true,
	
	
		/**
		 * Enable or disable the table information display. This shows information
		 * about the data that is currently visible on the page, including information
		 * about filtered data if that action is being performed.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.info
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "info": false
		 *      } );
		 *    } );
		 */
		"bInfo": true,
	
	
		/**
		 * Allows the end user to select the size of a formatted page from a select
		 * menu (sizes are 10, 25, 50 and 100). Requires pagination (`paginate`).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.lengthChange
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "lengthChange": false
		 *      } );
		 *    } );
		 */
		"bLengthChange": true,
	
	
		/**
		 * Enable or disable pagination.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.paging
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "paging": false
		 *      } );
		 *    } );
		 */
		"bPaginate": true,
	
	
		/**
		 * Enable or disable the display of a 'processing' indicator when the table is
		 * being processed (e.g. a sort). This is particularly useful for tables with
		 * large amounts of data where it can take a noticeable amount of time to sort
		 * the entries.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.processing
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "processing": true
		 *      } );
		 *    } );
		 */
		"bProcessing": false,
	
	
		/**
		 * Retrieve the DataTables object for the given selector. Note that if the
		 * table has already been initialised, this parameter will cause DataTables
		 * to simply return the object that has already been set up - it will not take
		 * account of any changes you might have made to the initialisation object
		 * passed to DataTables (setting this parameter to true is an acknowledgement
		 * that you understand this). `destroy` can be used to reinitialise a table if
		 * you need.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.retrieve
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      initTable();
		 *      tableActions();
		 *    } );
		 *
		 *    function initTable ()
		 *    {
		 *      return $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false,
		 *        "retrieve": true
		 *      } );
		 *    }
		 *
		 *    function tableActions ()
		 *    {
		 *      var table = initTable();
		 *      // perform API operations with oTable
		 *    }
		 */
		"bRetrieve": false,
	
	
		/**
		 * When vertical (y) scrolling is enabled, DataTables will force the height of
		 * the table's viewport to the given height at all times (useful for layout).
		 * However, this can look odd when filtering data down to a small data set,
		 * and the footer is left "floating" further down. This parameter (when
		 * enabled) will cause DataTables to collapse the table's viewport down when
		 * the result set will fit within the given Y height.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollCollapse
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200",
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"bScrollCollapse": false,
	
	
		/**
		 * Configure DataTables to use server-side processing. Note that the
		 * `ajax` parameter must also be given in order to give DataTables a
		 * source to obtain the required data for each draw.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverSide
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "xhr.php"
		 *      } );
		 *    } );
		 */
		"bServerSide": false,
	
	
		/**
		 * Enable or disable sorting of columns. Sorting of individual columns can be
		 * disabled by the `sortable` option for each column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.ordering
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "ordering": false
		 *      } );
		 *    } );
		 */
		"bSort": true,
	
	
		/**
		 * Enable or display DataTables' ability to sort multiple columns at the
		 * same time (activated by shift-click by the user).
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderMulti
		 *
		 *  @example
		 *    // Disable multiple column sorting ability
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderMulti": false
		 *      } );
		 *    } );
		 */
		"bSortMulti": true,
	
	
		/**
		 * Allows control over whether DataTables should use the top (true) unique
		 * cell that is found for a single column, or the bottom (false - default).
		 * This is useful when using complex headers.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.orderCellsTop
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "orderCellsTop": true
		 *      } );
		 *    } );
		 */
		"bSortCellsTop": false,
	
	
		/**
		 * Enable or disable the addition of the classes `sorting\_1`, `sorting\_2` and
		 * `sorting\_3` to the columns which are currently being sorted on. This is
		 * presented as a feature switch as it can increase processing time (while
		 * classes are removed and added) so for large data sets you might want to
		 * turn this off.
		 *  @type boolean
		 *  @default true
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.orderClasses
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "orderClasses": false
		 *      } );
		 *    } );
		 */
		"bSortClasses": true,
	
	
		/**
		 * Enable or disable state saving. When enabled HTML5 `localStorage` will be
		 * used to save table display information such as pagination information,
		 * display length, filtering and sorting. As such when the end user reloads
		 * the page the display display will match what thy had previously set up.
		 *
		 * Due to the use of `localStorage` the default state saving is not supported
		 * in IE6 or 7. If state saving is required in those browsers, use
		 * `stateSaveCallback` to provide a storage solution such as cookies.
		 *  @type boolean
		 *  @default false
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.stateSave
		 *
		 *  @example
		 *    $(document).ready( function () {
		 *      $('#example').dataTable( {
		 *        "stateSave": true
		 *      } );
		 *    } );
		 */
		"bStateSave": false,
	
	
		/**
		 * This function is called when a TR element is created (and all TD child
		 * elements have been inserted), or registered if using a DOM source, allowing
		 * manipulation of the TR element (adding classes etc).
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} dataIndex The index of this row in the internal aoData array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.createdRow
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "createdRow": function( row, data, dataIndex ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" )
		 *          {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnCreatedRow": null,
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify any aspect you want about the created DOM.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.drawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "drawCallback": function( settings ) {
		 *          alert( 'DataTables has redrawn the table' );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnDrawCallback": null,
	
	
		/**
		 * Identical to fnHeaderCallback() but for the table footer this function
		 * allows you to modify the table footer on every 'draw' event.
		 *  @type function
		 *  @param {node} foot "TR" element for the footer
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.footerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "footerCallback": function( tfoot, data, start, end, display ) {
		 *          tfoot.getElementsByTagName('th')[0].innerHTML = "Starting index is "+start;
		 *        }
		 *      } );
		 *    } )
		 */
		"fnFooterCallback": null,
	
	
		/**
		 * When rendering large numbers in the information element for the table
		 * (i.e. "Showing 1 to 10 of 57 entries") DataTables will render large numbers
		 * to have a comma separator for the 'thousands' units (e.g. 1 million is
		 * rendered as "1,000,000") to help readability for the end user. This
		 * function will override the default method DataTables uses.
		 *  @type function
		 *  @member
		 *  @param {int} toFormat number to be formatted
		 *  @returns {string} formatted string for DataTables to show the number
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.formatNumber
		 *
		 *  @example
		 *    // Format a number using a single quote for the separator (note that
		 *    // this can also be done with the language.thousands option)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "formatNumber": function ( toFormat ) {
		 *          return toFormat.toString().replace(
		 *            /\B(?=(\d{3})+(?!\d))/g, "'"
		 *          );
		 *        };
		 *      } );
		 *    } );
		 */
		"fnFormatNumber": function ( toFormat ) {
			return toFormat.toString().replace(
				/\B(?=(\d{3})+(?!\d))/g,
				this.oLanguage.sThousands
			);
		},
	
	
		/**
		 * This function is called on every 'draw' event, and allows you to
		 * dynamically modify the header row. This can be used to calculate and
		 * display useful information about the table.
		 *  @type function
		 *  @param {node} head "TR" element for the header
		 *  @param {array} data Full table data (as derived from the original HTML)
		 *  @param {int} start Index for the current display starting point in the
		 *    display array
		 *  @param {int} end Index for the current display ending point in the
		 *    display array
		 *  @param {array int} display Index array to translate the visual position
		 *    to the full data array
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.headerCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "fheaderCallback": function( head, data, start, end, display ) {
		 *          head.getElementsByTagName('th')[0].innerHTML = "Displaying "+(end-start)+" records";
		 *        }
		 *      } );
		 *    } )
		 */
		"fnHeaderCallback": null,
	
	
		/**
		 * The information element can be used to convey information about the current
		 * state of the table. Although the internationalisation options presented by
		 * DataTables are quite capable of dealing with most customisations, there may
		 * be times where you wish to customise the string further. This callback
		 * allows you to do exactly that.
		 *  @type function
		 *  @param {object} oSettings DataTables settings object
		 *  @param {int} start Starting position in data for the draw
		 *  @param {int} end End position in data for the draw
		 *  @param {int} max Total number of rows in the table (regardless of
		 *    filtering)
		 *  @param {int} total Total number of rows in the data set, after filtering
		 *  @param {string} pre The string that DataTables has formatted using it's
		 *    own rules
		 *  @returns {string} The string to be displayed in the information element.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.infoCallback
		 *
		 *  @example
		 *    $('#example').dataTable( {
		 *      "infoCallback": function( settings, start, end, max, total, pre ) {
		 *        return start +" to "+ end;
		 *      }
		 *    } );
		 */
		"fnInfoCallback": null,
	
	
		/**
		 * Called when the table has been initialised. Normally DataTables will
		 * initialise sequentially and there will be no need for this function,
		 * however, this does not hold true when using external language information
		 * since that is obtained using an async XHR call.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} json The JSON object request from the server - only
		 *    present if client-side Ajax sourced data is used
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.initComplete
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "initComplete": function(settings, json) {
		 *          alert( 'DataTables has finished its initialisation.' );
		 *        }
		 *      } );
		 *    } )
		 */
		"fnInitComplete": null,
	
	
		/**
		 * Called at the very start of each table draw and can be used to cancel the
		 * draw by returning false, any other return (including undefined) results in
		 * the full draw occurring).
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @returns {boolean} False will cancel the draw, anything else (including no
		 *    return) will allow it to complete.
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.preDrawCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "preDrawCallback": function( settings ) {
		 *          if ( $('#test').val() == 1 ) {
		 *            return false;
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnPreDrawCallback": null,
	
	
		/**
		 * This function allows you to 'post process' each row after it have been
		 * generated for each table draw, but before it is rendered on screen. This
		 * function might be used for setting the row class name etc.
		 *  @type function
		 *  @param {node} row "TR" element for the current row
		 *  @param {array} data Raw data array for this row
		 *  @param {int} displayIndex The display index for the current table draw
		 *  @param {int} displayIndexFull The index of the data in the full list of
		 *    rows (after filtering)
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.rowCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "rowCallback": function( row, data, displayIndex, displayIndexFull ) {
		 *          // Bold the grade for all 'A' grade browsers
		 *          if ( data[4] == "A" ) {
		 *            $('td:eq(4)', row).html( '<b>A</b>' );
		 *          }
		 *        }
		 *      } );
		 *    } );
		 */
		"fnRowCallback": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * This parameter allows you to override the default function which obtains
		 * the data from the server so something more suitable for your application.
		 * For example you could use POST data, or pull information from a Gears or
		 * AIR database.
		 *  @type function
		 *  @member
		 *  @param {string} source HTTP source to obtain the data from (`ajax`)
		 *  @param {array} data A key/value pair object containing the data to send
		 *    to the server
		 *  @param {function} callback to be called on completion of the data get
		 *    process that will draw the data on the page.
		 *  @param {object} settings DataTables settings object
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverData
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerData": null,
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 *  It is often useful to send extra data to the server when making an Ajax
		 * request - for example custom filtering information, and this callback
		 * function makes it trivial to send extra information to the server. The
		 * passed in parameter is the data set that has been constructed by
		 * DataTables, and you can add to this or modify it as you require.
		 *  @type function
		 *  @param {array} data Data array (array of objects which are name/value
		 *    pairs) that has been constructed by DataTables and will be sent to the
		 *    server. In the case of Ajax sourced data with server-side processing
		 *    this will be an empty array, for server-side processing there will be a
		 *    significant number of parameters!
		 *  @returns {undefined} Ensure that you modify the data array passed in,
		 *    as this is passed by reference.
		 *
		 *  @dtopt Callbacks
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverParams
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"fnServerParams": null,
	
	
		/**
		 * Load the table state. With this function you can define from where, and how, the
		 * state of a table is loaded. By default DataTables will load from `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} callback Callback that can be executed when done. It
		 *    should be passed the loaded state object.
		 *  @return {object} The DataTables state object to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadCallback": function (settings, callback) {
		 *          $.ajax( {
		 *            "url": "/state_load",
		 *            "dataType": "json",
		 *            "success": function (json) {
		 *              callback( json );
		 *            }
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadCallback": function ( settings ) {
			try {
				return JSON.parse(
					(settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem(
						'DataTables_'+settings.sInstance+'_'+location.pathname
					)
				);
			} catch (e) {
				return {};
			}
		},
	
	
		/**
		 * Callback which allows modification of the saved state prior to loading that state.
		 * This callback is called when the table is loading state from the stored data, but
		 * prior to the settings object being modified by the saved state. Note that for
		 * plug-in authors, you should use the `stateLoadParams` event to load parameters for
		 * a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that is to be loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoadParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never loaded
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Disallow state loading by returning false
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoadParams": function (settings, data) {
		 *          return false;
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoadParams": null,
	
	
		/**
		 * Callback that is called when the state has been loaded from the state saving method
		 * and the DataTables settings object has been modified as a result of the loaded state.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object that was loaded
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateLoaded
		 *
		 *  @example
		 *    // Show an alert with the filtering value that was saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateLoaded": function (settings, data) {
		 *          alert( 'Saved filter was: '+data.oSearch.sSearch );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateLoaded": null,
	
	
		/**
		 * Save the table state. This function allows you to define where and how the state
		 * information for the table is stored By default DataTables will use `localStorage`
		 * but you might wish to use a server-side database or cookies.
		 *  @type function
		 *  @member
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveCallback
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveCallback": function (settings, data) {
		 *          // Send an Ajax request to the server with the state object
		 *          $.ajax( {
		 *            "url": "/state_save",
		 *            "data": data,
		 *            "dataType": "json",
		 *            "method": "POST"
		 *            "success": function () {}
		 *          } );
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveCallback": function ( settings, data ) {
			try {
				(settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem(
					'DataTables_'+settings.sInstance+'_'+location.pathname,
					JSON.stringify( data )
				);
			} catch (e) {}
		},
	
	
		/**
		 * Callback which allows modification of the state to be saved. Called when the table
		 * has changed state a new state save is required. This method allows modification of
		 * the state saving object prior to actually doing the save, including addition or
		 * other state properties or modification. Note that for plug-in authors, you should
		 * use the `stateSaveParams` event to save parameters for a plug-in.
		 *  @type function
		 *  @param {object} settings DataTables settings object
		 *  @param {object} data The state object to be saved
		 *
		 *  @dtopt Callbacks
		 *  @name DataTable.defaults.stateSaveParams
		 *
		 *  @example
		 *    // Remove a saved filter, so filtering is never saved
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateSave": true,
		 *        "stateSaveParams": function (settings, data) {
		 *          data.oSearch.sSearch = "";
		 *        }
		 *      } );
		 *    } );
		 */
		"fnStateSaveParams": null,
	
	
		/**
		 * Duration for which the saved state information is considered valid. After this period
		 * has elapsed the state will be returned to the default.
		 * Value is given in seconds.
		 *  @type int
		 *  @default 7200 <i>(2 hours)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.stateDuration
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "stateDuration": 60*60*24; // 1 day
		 *      } );
		 *    } )
		 */
		"iStateDuration": 7200,
	
	
		/**
		 * When enabled DataTables will not make a request to the server for the first
		 * page draw - rather it will use the data already on the page (no sorting etc
		 * will be applied to it), thus saving on an XHR at load time. `deferLoading`
		 * is used to indicate that deferred loading is required, but it is also used
		 * to tell DataTables how many records there are in the full table (allowing
		 * the information element and pagination to be displayed correctly). In the case
		 * where a filtering is applied to the table on initial load, this can be
		 * indicated by giving the parameter as an array, where the first element is
		 * the number of records available after filtering and the second element is the
		 * number of records without filtering (allowing the table information element
		 * to be shown correctly).
		 *  @type int | array
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.deferLoading
		 *
		 *  @example
		 *    // 57 records available in the table, no filtering applied
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": 57
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // 57 records after filtering, 100 without filtering (an initial filter applied)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "serverSide": true,
		 *        "ajax": "scripts/server_processing.php",
		 *        "deferLoading": [ 57, 100 ],
		 *        "search": {
		 *          "search": "my_filter"
		 *        }
		 *      } );
		 *    } );
		 */
		"iDeferLoading": null,
	
	
		/**
		 * Number of rows to display on a single page when using pagination. If
		 * feature enabled (`lengthChange`) then the end user will be able to override
		 * this to a custom setting using a pop-up menu.
		 *  @type int
		 *  @default 10
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pageLength
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pageLength": 50
		 *      } );
		 *    } )
		 */
		"iDisplayLength": 10,
	
	
		/**
		 * Define the starting point for data display when using DataTables with
		 * pagination. Note that this parameter is the number of records, rather than
		 * the page number, so if you have 10 records per page and want to start on
		 * the third page, it should be "20".
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.displayStart
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "displayStart": 20
		 *      } );
		 *    } )
		 */
		"iDisplayStart": 0,
	
	
		/**
		 * By default DataTables allows keyboard navigation of the table (sorting, paging,
		 * and filtering) by adding a `tabindex` attribute to the required elements. This
		 * allows you to tab through the controls and press the enter key to activate them.
		 * The tabindex is default 0, meaning that the tab follows the flow of the document.
		 * You can overrule this using this parameter if you wish. Use a value of -1 to
		 * disable built-in keyboard navigation.
		 *  @type int
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.tabIndex
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "tabIndex": 1
		 *      } );
		 *    } );
		 */
		"iTabIndex": 0,
	
	
		/**
		 * Classes that DataTables assigns to the various components and features
		 * that it adds to the HTML table. This allows classes to be configured
		 * during initialisation in addition to through the static
		 * {@link DataTable.ext.oStdClasses} object).
		 *  @namespace
		 *  @name DataTable.defaults.classes
		 */
		"oClasses": {},
	
	
		/**
		 * All strings that DataTables uses in the user interface that it creates
		 * are defined in this object, allowing you to modified them individually or
		 * completely replace them all as required.
		 *  @namespace
		 *  @name DataTable.defaults.language
		 */
		"oLanguage": {
			/**
			 * Strings that are used for WAI-ARIA labels and controls only (these are not
			 * actually visible on the page, but will be read by screenreaders, and thus
			 * must be internationalised as well).
			 *  @namespace
			 *  @name DataTable.defaults.language.aria
			 */
			"oAria": {
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted ascending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortAscending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortAscending": " - click/return to sort ascending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortAscending": ": activate to sort column ascending",
	
				/**
				 * ARIA label that is added to the table headers when the column may be
				 * sorted descending by activing the column (click or return when focused).
				 * Note that the column header is prefixed to this string.
				 *  @type string
				 *  @default : activate to sort column ascending
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.aria.sortDescending
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "aria": {
				 *            "sortDescending": " - click/return to sort descending"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sSortDescending": ": activate to sort column descending"
			},
	
			/**
			 * Pagination string used by DataTables for the built-in pagination
			 * control types.
			 *  @namespace
			 *  @name DataTable.defaults.language.paginate
			 */
			"oPaginate": {
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the first page.
				 *  @type string
				 *  @default First
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.first
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "first": "First page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sFirst": "First",
	
	
				/**
				 * Text to use when using the 'full_numbers' type of pagination for the
				 * button to take the user to the last page.
				 *  @type string
				 *  @default Last
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.last
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "last": "Last page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sLast": "Last",
	
	
				/**
				 * Text to use for the 'next' pagination button (to take the user to the
				 * next page).
				 *  @type string
				 *  @default Next
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.next
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "next": "Next page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sNext": "Next",
	
	
				/**
				 * Text to use for the 'previous' pagination button (to take the user to
				 * the previous page).
				 *  @type string
				 *  @default Previous
				 *
				 *  @dtopt Language
				 *  @name DataTable.defaults.language.paginate.previous
				 *
				 *  @example
				 *    $(document).ready( function() {
				 *      $('#example').dataTable( {
				 *        "language": {
				 *          "paginate": {
				 *            "previous": "Previous page"
				 *          }
				 *        }
				 *      } );
				 *    } );
				 */
				"sPrevious": "Previous"
			},
	
			/**
			 * This string is shown in preference to `zeroRecords` when the table is
			 * empty of data (regardless of filtering). Note that this is an optional
			 * parameter - if it is not given, the value of `zeroRecords` will be used
			 * instead (either the default or given value).
			 *  @type string
			 *  @default No data available in table
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.emptyTable
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "emptyTable": "No data available in table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sEmptyTable": "No data available in table",
	
	
			/**
			 * This string gives information to the end user about the information
			 * that is current on display on the page. The following tokens can be
			 * used in the string and will be dynamically replaced as the table
			 * display updates. This tokens can be placed anywhere in the string, or
			 * removed as needed by the language requires:
			 *
			 * * `\_START\_` - Display index of the first record on the current page
			 * * `\_END\_` - Display index of the last record on the current page
			 * * `\_TOTAL\_` - Number of records in the table after filtering
			 * * `\_MAX\_` - Number of records in the table without filtering
			 * * `\_PAGE\_` - Current page number
			 * * `\_PAGES\_` - Total number of pages of data in the table
			 *
			 *  @type string
			 *  @default Showing _START_ to _END_ of _TOTAL_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.info
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "info": "Showing page _PAGE_ of _PAGES_"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfo": "Showing _START_ to _END_ of _TOTAL_ entries",
	
	
			/**
			 * Display information string for when the table is empty. Typically the
			 * format of this string should match `info`.
			 *  @type string
			 *  @default Showing 0 to 0 of 0 entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoEmpty
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoEmpty": "No entries to show"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoEmpty": "Showing 0 to 0 of 0 entries",
	
	
			/**
			 * When a user filters the information in a table, this string is appended
			 * to the information (`info`) to give an idea of how strong the filtering
			 * is. The variable _MAX_ is dynamically updated.
			 *  @type string
			 *  @default (filtered from _MAX_ total entries)
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoFiltered
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoFiltered": " - filtering from _MAX_ records"
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoFiltered": "(filtered from _MAX_ total entries)",
	
	
			/**
			 * If can be useful to append extra information to the info string at times,
			 * and this variable does exactly that. This information will be appended to
			 * the `info` (`infoEmpty` and `infoFiltered` in whatever combination they are
			 * being used) at all times.
			 *  @type string
			 *  @default <i>Empty string</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.infoPostFix
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "infoPostFix": "All records shown are derived from real information."
			 *        }
			 *      } );
			 *    } );
			 */
			"sInfoPostFix": "",
	
	
			/**
			 * This decimal place operator is a little different from the other
			 * language options since DataTables doesn't output floating point
			 * numbers, so it won't ever use this for display of a number. Rather,
			 * what this parameter does is modify the sort methods of the table so
			 * that numbers which are in a format which has a character other than
			 * a period (`.`) as a decimal place will be sorted numerically.
			 *
			 * Note that numbers with different decimal places cannot be shown in
			 * the same table and still be sortable, the table must be consistent.
			 * However, multiple different tables on the page can use different
			 * decimal place characters.
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.decimal
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "decimal": ","
			 *          "thousands": "."
			 *        }
			 *      } );
			 *    } );
			 */
			"sDecimal": "",
	
	
			/**
			 * DataTables has a build in number formatter (`formatNumber`) which is
			 * used to format large numbers that are used in the table information.
			 * By default a comma is used, but this can be trivially changed to any
			 * character you wish with this parameter.
			 *  @type string
			 *  @default ,
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.thousands
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "thousands": "'"
			 *        }
			 *      } );
			 *    } );
			 */
			"sThousands": ",",
	
	
			/**
			 * Detail the action that will be taken when the drop down menu for the
			 * pagination length option is changed. The '_MENU_' variable is replaced
			 * with a default select list of 10, 25, 50 and 100, and can be replaced
			 * with a custom select box if required.
			 *  @type string
			 *  @default Show _MENU_ entries
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.lengthMenu
			 *
			 *  @example
			 *    // Language change only
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": "Display _MENU_ records"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Language and options change
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "lengthMenu": 'Display <select>'+
			 *            '<option value="10">10</option>'+
			 *            '<option value="20">20</option>'+
			 *            '<option value="30">30</option>'+
			 *            '<option value="40">40</option>'+
			 *            '<option value="50">50</option>'+
			 *            '<option value="-1">All</option>'+
			 *            '</select> records'
			 *        }
			 *      } );
			 *    } );
			 */
			"sLengthMenu": "Show _MENU_ entries",
	
	
			/**
			 * When using Ajax sourced data and during the first draw when DataTables is
			 * gathering the data, this message is shown in an empty row in the table to
			 * indicate to the end user the the data is being loaded. Note that this
			 * parameter is not used when loading data by server-side processing, just
			 * Ajax sourced data with client-side processing.
			 *  @type string
			 *  @default Loading...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.loadingRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "loadingRecords": "Please wait - loading..."
			 *        }
			 *      } );
			 *    } );
			 */
			"sLoadingRecords": "Loading...",
	
	
			/**
			 * Text which is displayed when the table is processing a user action
			 * (usually a sort command or similar).
			 *  @type string
			 *  @default Processing...
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.processing
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "processing": "DataTables is currently busy"
			 *        }
			 *      } );
			 *    } );
			 */
			"sProcessing": "Processing...",
	
	
			/**
			 * Details the actions that will be taken when the user types into the
			 * filtering input text box. The variable "_INPUT_", if used in the string,
			 * is replaced with the HTML text box for the filtering input allowing
			 * control over where it appears in the string. If "_INPUT_" is not given
			 * then the input box is appended to the string automatically.
			 *  @type string
			 *  @default Search:
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.search
			 *
			 *  @example
			 *    // Input text box will be appended at the end automatically
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Filter records:"
			 *        }
			 *      } );
			 *    } );
			 *
			 *  @example
			 *    // Specify where the filter should appear
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "search": "Apply filter _INPUT_ to table"
			 *        }
			 *      } );
			 *    } );
			 */
			"sSearch": "Search:",
	
	
			/**
			 * Assign a `placeholder` attribute to the search `input` element
			 *  @type string
			 *  @default 
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.searchPlaceholder
			 */
			"sSearchPlaceholder": "",
	
	
			/**
			 * All of the language information can be stored in a file on the
			 * server-side, which DataTables will look up if this parameter is passed.
			 * It must store the URL of the language file, which is in a JSON format,
			 * and the object has the same properties as the oLanguage object in the
			 * initialiser object (i.e. the above parameters). Please refer to one of
			 * the example language files to see how this works in action.
			 *  @type string
			 *  @default <i>Empty string - i.e. disabled</i>
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.url
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "url": "http://www.sprymedia.co.uk/dataTables/lang.txt"
			 *        }
			 *      } );
			 *    } );
			 */
			"sUrl": "",
	
	
			/**
			 * Text shown inside the table records when the is no information to be
			 * displayed after filtering. `emptyTable` is shown when there is simply no
			 * information in the table at all (regardless of filtering).
			 *  @type string
			 *  @default No matching records found
			 *
			 *  @dtopt Language
			 *  @name DataTable.defaults.language.zeroRecords
			 *
			 *  @example
			 *    $(document).ready( function() {
			 *      $('#example').dataTable( {
			 *        "language": {
			 *          "zeroRecords": "No records to display"
			 *        }
			 *      } );
			 *    } );
			 */
			"sZeroRecords": "No matching records found"
		},
	
	
		/**
		 * This parameter allows you to have define the global filtering state at
		 * initialisation time. As an object the `search` parameter must be
		 * defined, but all other parameters are optional. When `regex` is true,
		 * the search string will be treated as a regular expression, when false
		 * (default) it will be treated as a straight string. When `smart`
		 * DataTables will use it's smart filtering methods (to word match at
		 * any point in the data), when false this will not be done.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.search
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "search": {"search": "Initial search"}
		 *      } );
		 *    } )
		 */
		"oSearch": $.extend( {}, DataTable.models.oSearch ),
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * By default DataTables will look for the property `data` (or `aaData` for
		 * compatibility with DataTables 1.9-) when obtaining data from an Ajax
		 * source or for server-side processing - this parameter allows that
		 * property to be changed. You can use Javascript dotted object notation to
		 * get a data source for multiple levels of nesting.
		 *  @type string
		 *  @default data
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxDataProp
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxDataProp": "data",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * You can instruct DataTables to load data from an external
		 * source using this parameter (use aData if you want to pass data in you
		 * already have). Simply provide a url a JSON object can be obtained from.
		 *  @type string
		 *  @default null
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.ajaxSource
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sAjaxSource": null,
	
	
		/**
		 * This initialisation variable allows you to specify exactly where in the
		 * DOM you want DataTables to inject the various controls it adds to the page
		 * (for example you might want the pagination controls at the top of the
		 * table). DIV elements (with or without a custom class) can also be added to
		 * aid styling. The follow syntax is used:
		 *   <ul>
		 *     <li>The following options are allowed:
		 *       <ul>
		 *         <li>'l' - Length changing</li>
		 *         <li>'f' - Filtering input</li>
		 *         <li>'t' - The table!</li>
		 *         <li>'i' - Information</li>
		 *         <li>'p' - Pagination</li>
		 *         <li>'r' - pRocessing</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following constants are allowed:
		 *       <ul>
		 *         <li>'H' - jQueryUI theme "header" classes ('fg-toolbar ui-widget-header ui-corner-tl ui-corner-tr ui-helper-clearfix')</li>
		 *         <li>'F' - jQueryUI theme "footer" classes ('fg-toolbar ui-widget-header ui-corner-bl ui-corner-br ui-helper-clearfix')</li>
		 *       </ul>
		 *     </li>
		 *     <li>The following syntax is expected:
		 *       <ul>
		 *         <li>'&lt;' and '&gt;' - div elements</li>
		 *         <li>'&lt;"class" and '&gt;' - div with a class</li>
		 *         <li>'&lt;"#id" and '&gt;' - div with an ID</li>
		 *       </ul>
		 *     </li>
		 *     <li>Examples:
		 *       <ul>
		 *         <li>'&lt;"wrapper"flipt&gt;'</li>
		 *         <li>'&lt;lf&lt;t&gt;ip&gt;'</li>
		 *       </ul>
		 *     </li>
		 *   </ul>
		 *  @type string
		 *  @default lfrtip <i>(when `jQueryUI` is false)</i> <b>or</b>
		 *    <"H"lfr>t<"F"ip> <i>(when `jQueryUI` is true)</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.dom
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "dom": '&lt;"top"i&gt;rt&lt;"bottom"flp&gt;&lt;"clear"&gt;'
		 *      } );
		 *    } );
		 */
		"sDom": "lfrtip",
	
	
		/**
		 * Search delay option. This will throttle full table searches that use the
		 * DataTables provided search input element (it does not effect calls to
		 * `dt-api search()`, providing a delay before the search is made.
		 *  @type integer
		 *  @default 0
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.searchDelay
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "searchDelay": 200
		 *      } );
		 *    } )
		 */
		"searchDelay": null,
	
	
		/**
		 * DataTables features six different built-in options for the buttons to
		 * display for pagination control:
		 *
		 * * `numbers` - Page number buttons only
		 * * `simple` - 'Previous' and 'Next' buttons only
		 * * 'simple_numbers` - 'Previous' and 'Next' buttons, plus page numbers
		 * * `full` - 'First', 'Previous', 'Next' and 'Last' buttons
		 * * `full_numbers` - 'First', 'Previous', 'Next' and 'Last' buttons, plus page numbers
		 * * `first_last_numbers` - 'First' and 'Last' buttons, plus page numbers
		 *  
		 * Further methods can be added using {@link DataTable.ext.oPagination}.
		 *  @type string
		 *  @default simple_numbers
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.pagingType
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "pagingType": "full_numbers"
		 *      } );
		 *    } )
		 */
		"sPaginationType": "simple_numbers",
	
	
		/**
		 * Enable horizontal scrolling. When a table is too wide to fit into a
		 * certain layout, or you have a large number of columns in the table, you
		 * can enable x-scrolling to show the table in a viewport, which can be
		 * scrolled. This property can be `true` which will allow the table to
		 * scroll horizontally when needed, or any CSS unit, or a number (in which
		 * case it will be treated as a pixel measurement). Setting as simply `true`
		 * is recommended.
		 *  @type boolean|string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollX
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": true,
		 *        "scrollCollapse": true
		 *      } );
		 *    } );
		 */
		"sScrollX": "",
	
	
		/**
		 * This property can be used to force a DataTable to use more width than it
		 * might otherwise do when x-scrolling is enabled. For example if you have a
		 * table which requires to be well spaced, this parameter is useful for
		 * "over-sizing" the table, and thus forcing scrolling. This property can by
		 * any CSS unit, or a number (in which case it will be treated as a pixel
		 * measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Options
		 *  @name DataTable.defaults.scrollXInner
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollX": "100%",
		 *        "scrollXInner": "110%"
		 *      } );
		 *    } );
		 */
		"sScrollXInner": "",
	
	
		/**
		 * Enable vertical scrolling. Vertical scrolling will constrain the DataTable
		 * to the given height, and enable scrolling for any data which overflows the
		 * current viewport. This can be used as an alternative to paging to display
		 * a lot of data in a small area (although paging and scrolling can both be
		 * enabled at the same time). This property can be any CSS unit, or a number
		 * (in which case it will be treated as a pixel measurement).
		 *  @type string
		 *  @default <i>blank string - i.e. disabled</i>
		 *
		 *  @dtopt Features
		 *  @name DataTable.defaults.scrollY
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "scrollY": "200px",
		 *        "paginate": false
		 *      } );
		 *    } );
		 */
		"sScrollY": "",
	
	
		/**
		 * __Deprecated__ The functionality provided by this parameter has now been
		 * superseded by that provided through `ajax`, which should be used instead.
		 *
		 * Set the HTTP method that is used to make the Ajax call for server-side
		 * processing or Ajax sourced data.
		 *  @type string
		 *  @default GET
		 *
		 *  @dtopt Options
		 *  @dtopt Server-side
		 *  @name DataTable.defaults.serverMethod
		 *
		 *  @deprecated 1.10. Please use `ajax` for this functionality now.
		 */
		"sServerMethod": "GET",
	
	
		/**
		 * DataTables makes use of renderers when displaying HTML elements for
		 * a table. These renderers can be added or modified by plug-ins to
		 * generate suitable mark-up for a site. For example the Bootstrap
		 * integration plug-in for DataTables uses a paging button renderer to
		 * display pagination buttons in the mark-up required by Bootstrap.
		 *
		 * For further information about the renderers available see
		 * DataTable.ext.renderer
		 *  @type string|object
		 *  @default null
		 *
		 *  @name DataTable.defaults.renderer
		 *
		 */
		"renderer": null,
	
	
		/**
		 * Set the data property name that DataTables should use to get a row's id
		 * to set as the `id` property in the node.
		 *  @type string
		 *  @default DT_RowId
		 *
		 *  @name DataTable.defaults.rowId
		 */
		"rowId": "DT_RowId"
	};
	
	_fnHungarianMap( DataTable.defaults );
	
	
	
	/*
	 * Developer note - See note in model.defaults.js about the use of Hungarian
	 * notation and camel case.
	 */
	
	/**
	 * Column options that can be given to DataTables at initialisation time.
	 *  @namespace
	 */
	DataTable.defaults.column = {
		/**
		 * Define which column(s) an order will occur on for this column. This
		 * allows a column's ordering to take multiple columns into account when
		 * doing a sort or use the data from a different column. For example first
		 * name / last name columns make sense to do a multi-column sort over the
		 * two columns.
		 *  @type array|int
		 *  @default null <i>Takes the value of the column index automatically</i>
		 *
		 *  @name DataTable.defaults.column.orderData
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderData": [ 0, 1 ], "targets": [ 0 ] },
		 *          { "orderData": [ 1, 0 ], "targets": [ 1 ] },
		 *          { "orderData": 2, "targets": [ 2 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderData": [ 0, 1 ] },
		 *          { "orderData": [ 1, 0 ] },
		 *          { "orderData": 2 },
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"aDataSort": null,
		"iDataSort": -1,
	
	
		/**
		 * You can control the default ordering direction, and even alter the
		 * behaviour of the sort handler (i.e. only allow ascending ordering etc)
		 * using this parameter.
		 *  @type array
		 *  @default [ 'asc', 'desc' ]
		 *
		 *  @name DataTable.defaults.column.orderSequence
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderSequence": [ "asc" ], "targets": [ 1 ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ], "targets": [ 2 ] },
		 *          { "orderSequence": [ "desc" ], "targets": [ 3 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          { "orderSequence": [ "asc" ] },
		 *          { "orderSequence": [ "desc", "asc", "asc" ] },
		 *          { "orderSequence": [ "desc" ] },
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"asSorting": [ 'asc', 'desc' ],
	
	
		/**
		 * Enable or disable filtering on the data in this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.searchable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "searchable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "searchable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSearchable": true,
	
	
		/**
		 * Enable or disable ordering on this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.orderable
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderable": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "orderable": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bSortable": true,
	
	
		/**
		 * Enable or disable the display of this column.
		 *  @type boolean
		 *  @default true
		 *
		 *  @name DataTable.defaults.column.visible
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "visible": false, "targets": [ 0 ] }
		 *        ] } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "visible": false },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ] } );
		 *    } );
		 */
		"bVisible": true,
	
	
		/**
		 * Developer definable function that is called whenever a cell is created (Ajax source,
		 * etc) or processed for input (DOM source). This can be used as a compliment to mRender
		 * allowing you to modify the DOM element (add background colour for example) when the
		 * element is available.
		 *  @type function
		 *  @param {element} td The TD node that has been created
		 *  @param {*} cellData The Data for the cell
		 *  @param {array|object} rowData The data for the whole row
		 *  @param {int} row The row index for the aoData data store
		 *  @param {int} col The column index for aoColumns
		 *
		 *  @name DataTable.defaults.column.createdCell
		 *  @dtopt Columns
		 *
		 *  @example
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [3],
		 *          "createdCell": function (td, cellData, rowData, row, col) {
		 *            if ( cellData == "1.7" ) {
		 *              $(td).css('color', 'blue')
		 *            }
		 *          }
		 *        } ]
		 *      });
		 *    } );
		 */
		"fnCreatedCell": null,
	
	
		/**
		 * This parameter has been replaced by `data` in DataTables to ensure naming
		 * consistency. `dataProp` can still be used, as there is backwards
		 * compatibility in DataTables for this option, but it is strongly
		 * recommended that you use `data` in preference to `dataProp`.
		 *  @name DataTable.defaults.column.dataProp
		 */
	
	
		/**
		 * This property can be used to read data from any data source property,
		 * including deeply nested objects / properties. `data` can be given in a
		 * number of different ways which effect its behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object. Note that
		 *      function notation is recommended for use in `render` rather than
		 *      `data` as it is much simpler to use as a renderer.
		 * * `null` - use the original data source for the row rather than plucking
		 *   data directly from it. This action has effects on two other
		 *   initialisation options:
		 *    * `defaultContent` - When null is given as the `data` option and
		 *      `defaultContent` is specified for the column, the value defined by
		 *      `defaultContent` will be used for the cell.
		 *    * `render` - When null is used for the `data` option and the `render`
		 *      option is specified for the column, the whole data source for the
		 *      row is used for the renderer.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * `{array|object}` The data source for the row
		 *      * `{string}` The type call data requested - this will be 'set' when
		 *        setting data or 'filter', 'display', 'type', 'sort' or undefined
		 *        when gathering data. Note that when `undefined` is given for the
		 *        type DataTables expects to get the raw data for the object back<
		 *      * `{*}` Data to set when the second parameter is 'set'.
		 *    * Return:
		 *      * The return value from the function is not required when 'set' is
		 *        the type of call, but otherwise the return is what will be used
		 *        for the data requested.
		 *
		 * Note that `data` is a getter and setter option. If you just require
		 * formatting of data for output, you will likely want to use `render` which
		 * is simply a getter and thus simpler to use.
		 *
		 * Note that prior to DataTables 1.9.2 `data` was called `mDataProp`. The
		 * name change reflects the flexibility of this property and is consistent
		 * with the naming of mRender. If 'mDataProp' is given, then it will still
		 * be used by DataTables, as it automatically maps the old name to the new
		 * if required.
		 *
		 *  @type string|int|function|null
		 *  @default null <i>Use automatically calculated column index</i>
		 *
		 *  @name DataTable.defaults.column.data
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Read table data from objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {value},
		 *    //      "version": {value},
		 *    //      "grade": {value}
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/objects.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform" },
		 *          { "data": "version" },
		 *          { "data": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Read information from deeply nested objects
		 *    // JSON structure for each row:
		 *    //   {
		 *    //      "engine": {value},
		 *    //      "browser": {value},
		 *    //      "platform": {
		 *    //         "inner": {value}
		 *    //      },
		 *    //      "details": [
		 *    //         {value}, {value}
		 *    //      ]
		 *    //   }
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          { "data": "platform.inner" },
		 *          { "data": "details.0" },
		 *          { "data": "details.1" }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `data` as a function to provide different information for
		 *    // sorting, filtering and display. In this case, currency (price)
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": function ( source, type, val ) {
		 *            if (type === 'set') {
		 *              source.price = val;
		 *              // Store the computed dislay and filter values for efficiency
		 *              source.price_display = val=="" ? "" : "$"+numberFormat(val);
		 *              source.price_filter  = val=="" ? "" : "$"+numberFormat(val)+" "+val;
		 *              return;
		 *            }
		 *            else if (type === 'display') {
		 *              return source.price_display;
		 *            }
		 *            else if (type === 'filter') {
		 *              return source.price_filter;
		 *            }
		 *            // 'sort', 'type' and undefined all just use the integer
		 *            return source.price;
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using default content
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null,
		 *          "defaultContent": "Click to edit"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using array notation - outputting a list from an array
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "name[, ]"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 */
		"mData": null,
	
	
		/**
		 * This property is the rendering partner to `data` and it is suggested that
		 * when you want to manipulate data for display (including filtering,
		 * sorting etc) without altering the underlying data for the table, use this
		 * property. `render` can be considered to be the the read only companion to
		 * `data` which is read / write (then as such more complex). Like `data`
		 * this option can be given in a number of different ways to effect its
		 * behaviour:
		 *
		 * * `integer` - treated as an array index for the data source. This is the
		 *   default that DataTables uses (incrementally increased for each column).
		 * * `string` - read an object property from the data source. There are
		 *   three 'special' options that can be used in the string to alter how
		 *   DataTables reads the data from the source object:
		 *    * `.` - Dotted Javascript notation. Just as you use a `.` in
		 *      Javascript to read from nested objects, so to can the options
		 *      specified in `data`. For example: `browser.version` or
		 *      `browser.name`. If your object parameter name contains a period, use
		 *      `\\` to escape it - i.e. `first\\.name`.
		 *    * `[]` - Array notation. DataTables can automatically combine data
		 *      from and array source, joining the data with the characters provided
		 *      between the two brackets. For example: `name[, ]` would provide a
		 *      comma-space separated list from the source array. If no characters
		 *      are provided between the brackets, the original array source is
		 *      returned.
		 *    * `()` - Function notation. Adding `()` to the end of a parameter will
		 *      execute a function of the name given. For example: `browser()` for a
		 *      simple function on the data source, `browser.version()` for a
		 *      function in a nested property or even `browser().version` to get an
		 *      object property if the function called returns an object.
		 * * `object` - use different data for the different data types requested by
		 *   DataTables ('filter', 'display', 'type' or 'sort'). The property names
		 *   of the object is the data type the property refers to and the value can
		 *   defined using an integer, string or function using the same rules as
		 *   `render` normally does. Note that an `_` option _must_ be specified.
		 *   This is the default value to use if you haven't specified a value for
		 *   the data type requested by DataTables.
		 * * `function` - the function given will be executed whenever DataTables
		 *   needs to set or get the data for a cell in the column. The function
		 *   takes three parameters:
		 *    * Parameters:
		 *      * {array|object} The data source for the row (based on `data`)
		 *      * {string} The type call data requested - this will be 'filter',
		 *        'display', 'type' or 'sort'.
		 *      * {array|object} The full data source for the row (not based on
		 *        `data`)
		 *    * Return:
		 *      * The return value from the function is what will be used for the
		 *        data requested.
		 *
		 *  @type string|int|function|object|null
		 *  @default null Use the data source value.
		 *
		 *  @name DataTable.defaults.column.render
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Create a comma separated list from an array of objects
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "ajaxSource": "sources/deep.txt",
		 *        "columns": [
		 *          { "data": "engine" },
		 *          { "data": "browser" },
		 *          {
		 *            "data": "platform",
		 *            "render": "[, ].name"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Execute a function to obtain data
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": "browserName()"
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // As an object, extracting different data for the different types
		 *    // This would be used with a data source such as:
		 *    //   { "phone": 5552368, "phone_filter": "5552368 555-2368", "phone_display": "555-2368" }
		 *    // Here the `phone` integer is used for sorting and type detection, while `phone_filter`
		 *    // (which has both forms) is used for filtering for if a user inputs either format, while
		 *    // the formatted phone number is the one that is shown in the table.
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": null, // Use the full data source object for the renderer's source
		 *          "render": {
		 *            "_": "phone",
		 *            "filter": "phone_filter",
		 *            "display": "phone_display"
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Use as a function to create a link from the data source
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "data": "download_link",
		 *          "render": function ( data, type, full ) {
		 *            return '<a href="'+data+'">Download</a>';
		 *          }
		 *        } ]
		 *      } );
		 *    } );
		 */
		"mRender": null,
	
	
		/**
		 * Change the cell type created for the column - either TD cells or TH cells. This
		 * can be useful as TH cells have semantic meaning in the table body, allowing them
		 * to act as a header for a row (you may wish to add scope='row' to the TH elements).
		 *  @type string
		 *  @default td
		 *
		 *  @name DataTable.defaults.column.cellType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Make the first column use TH cells
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [ {
		 *          "targets": [ 0 ],
		 *          "cellType": "th"
		 *        } ]
		 *      } );
		 *    } );
		 */
		"sCellType": "td",
	
	
		/**
		 * Class to give to each cell in this column.
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.class
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "class": "my_class", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "class": "my_class" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sClass": "",
	
		/**
		 * When DataTables calculates the column widths to assign to each column,
		 * it finds the longest string in each column and then constructs a
		 * temporary table and reads the widths from that. The problem with this
		 * is that "mmm" is much wider then "iiii", but the latter is a longer
		 * string - thus the calculation can go wrong (doing it properly and putting
		 * it into an DOM object and measuring that is horribly(!) slow). Thus as
		 * a "work around" we provide this option. It will append its value to the
		 * text that is found to be the longest string for the column - i.e. padding.
		 * Generally you shouldn't need this!
		 *  @type string
		 *  @default <i>Empty string<i>
		 *
		 *  @name DataTable.defaults.column.contentPadding
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "contentPadding": "mmm"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sContentPadding": "",
	
	
		/**
		 * Allows a default value to be given for a column's data, and will be used
		 * whenever a null data source is encountered (this can be because `data`
		 * is set to null, or because the data source itself is null).
		 *  @type string
		 *  @default null
		 *
		 *  @name DataTable.defaults.column.defaultContent
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit",
		 *            "targets": [ -1 ]
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          null,
		 *          {
		 *            "data": null,
		 *            "defaultContent": "Edit"
		 *          }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sDefaultContent": null,
	
	
		/**
		 * This parameter is only used in DataTables' server-side processing. It can
		 * be exceptionally useful to know what columns are being displayed on the
		 * client side, and to map these to database fields. When defined, the names
		 * also allow DataTables to reorder information from the server if it comes
		 * back in an unexpected order (i.e. if you switch your columns around on the
		 * client-side, your server-side code does not also need updating).
		 *  @type string
		 *  @default <i>Empty string</i>
		 *
		 *  @name DataTable.defaults.column.name
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "name": "engine", "targets": [ 0 ] },
		 *          { "name": "browser", "targets": [ 1 ] },
		 *          { "name": "platform", "targets": [ 2 ] },
		 *          { "name": "version", "targets": [ 3 ] },
		 *          { "name": "grade", "targets": [ 4 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "name": "engine" },
		 *          { "name": "browser" },
		 *          { "name": "platform" },
		 *          { "name": "version" },
		 *          { "name": "grade" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sName": "",
	
	
		/**
		 * Defines a data source type for the ordering which can be used to read
		 * real-time information from the table (updating the internally cached
		 * version) prior to ordering. This allows ordering to occur on user
		 * editable elements such as form inputs.
		 *  @type string
		 *  @default std
		 *
		 *  @name DataTable.defaults.column.orderDataType
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "orderDataType": "dom-text", "targets": [ 2, 3 ] },
		 *          { "type": "numeric", "targets": [ 3 ] },
		 *          { "orderDataType": "dom-select", "targets": [ 4 ] },
		 *          { "orderDataType": "dom-checkbox", "targets": [ 5 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          null,
		 *          null,
		 *          { "orderDataType": "dom-text" },
		 *          { "orderDataType": "dom-text", "type": "numeric" },
		 *          { "orderDataType": "dom-select" },
		 *          { "orderDataType": "dom-checkbox" }
		 *        ]
		 *      } );
		 *    } );
		 */
		"sSortDataType": "std",
	
	
		/**
		 * The title of this column.
		 *  @type string
		 *  @default null <i>Derived from the 'TH' value for this column in the
		 *    original HTML table.</i>
		 *
		 *  @name DataTable.defaults.column.title
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "title": "My column title", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "title": "My column title" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sTitle": null,
	
	
		/**
		 * The type allows you to specify how the data for this column will be
		 * ordered. Four types (string, numeric, date and html (which will strip
		 * HTML tags before ordering)) are currently available. Note that only date
		 * formats understood by Javascript's Date() object will be accepted as type
		 * date. For example: "Mar 26, 2008 5:03 PM". May take the values: 'string',
		 * 'numeric', 'date' or 'html' (by default). Further types can be adding
		 * through plug-ins.
		 *  @type string
		 *  @default null <i>Auto-detected from raw data</i>
		 *
		 *  @name DataTable.defaults.column.type
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "type": "html", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "type": "html" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sType": null,
	
	
		/**
		 * Defining the width of the column, this parameter may take any CSS value
		 * (3em, 20px etc). DataTables applies 'smart' widths to columns which have not
		 * been given a specific width through this interface ensuring that the table
		 * remains readable.
		 *  @type string
		 *  @default null <i>Automatic</i>
		 *
		 *  @name DataTable.defaults.column.width
		 *  @dtopt Columns
		 *
		 *  @example
		 *    // Using `columnDefs`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columnDefs": [
		 *          { "width": "20%", "targets": [ 0 ] }
		 *        ]
		 *      } );
		 *    } );
		 *
		 *  @example
		 *    // Using `columns`
		 *    $(document).ready( function() {
		 *      $('#example').dataTable( {
		 *        "columns": [
		 *          { "width": "20%" },
		 *          null,
		 *          null,
		 *          null,
		 *          null
		 *        ]
		 *      } );
		 *    } );
		 */
		"sWidth": null
	};
	
	_fnHungarianMap( DataTable.defaults.column );
	
	
	
	/**
	 * DataTables settings object - this holds all the information needed for a
	 * given table, including configuration, data and current application of the
	 * table options. DataTables does not have a single instance for each DataTable
	 * with the settings attached to that instance, but rather instances of the
	 * DataTable "class" are created on-the-fly as needed (typically by a
	 * $().dataTable() call) and the settings object is then applied to that
	 * instance.
	 *
	 * Note that this object is related to {@link DataTable.defaults} but this
	 * one is the internal data store for DataTables's cache of columns. It should
	 * NOT be manipulated outside of DataTables. Any configuration should be done
	 * through the initialisation options.
	 *  @namespace
	 *  @todo Really should attach the settings object to individual instances so we
	 *    don't need to create new instances on each $().dataTable() call (if the
	 *    table already exists). It would also save passing oSettings around and
	 *    into every single function. However, this is a very significant
	 *    architecture change for DataTables and will almost certainly break
	 *    backwards compatibility with older installations. This is something that
	 *    will be done in 2.0.
	 */
	DataTable.models.oSettings = {
		/**
		 * Primary features of DataTables and their enablement state.
		 *  @namespace
		 */
		"oFeatures": {
	
			/**
			 * Flag to say if DataTables should automatically try to calculate the
			 * optimum table and columns widths (true) or not (false).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bAutoWidth": null,
	
			/**
			 * Delay the creation of TR and TD elements until they are actually
			 * needed by a driven page draw. This can give a significant speed
			 * increase for Ajax source and Javascript source data, but makes no
			 * difference at all fro DOM and server-side processing tables.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bDeferRender": null,
	
			/**
			 * Enable filtering on the table or not. Note that if this is disabled
			 * then there is no filtering at all on the table, including fnFilter.
			 * To just remove the filtering input use sDom and remove the 'f' option.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bFilter": null,
	
			/**
			 * Table information element (the 'Showing x of y records' div) enable
			 * flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bInfo": null,
	
			/**
			 * Present a user control allowing the end user to change the page size
			 * when pagination is enabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bLengthChange": null,
	
			/**
			 * Pagination enabled or not. Note that if this is disabled then length
			 * changing must also be disabled.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bPaginate": null,
	
			/**
			 * Processing indicator enable flag whenever DataTables is enacting a
			 * user request - typically an Ajax request for server-side processing.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bProcessing": null,
	
			/**
			 * Server-side processing enabled flag - when enabled DataTables will
			 * get all data from the server for every draw - there is no filtering,
			 * sorting or paging done on the client-side.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bServerSide": null,
	
			/**
			 * Sorting enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSort": null,
	
			/**
			 * Multi-column sorting
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortMulti": null,
	
			/**
			 * Apply a class to the columns which are being sorted to provide a
			 * visual highlight or not. This can slow things down when enabled since
			 * there is a lot of DOM interaction.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bSortClasses": null,
	
			/**
			 * State saving enablement flag.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bStateSave": null
		},
	
	
		/**
		 * Scrolling settings for a table.
		 *  @namespace
		 */
		"oScroll": {
			/**
			 * When the table is shorter in height than sScrollY, collapse the
			 * table container down to the height of the table (when true).
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type boolean
			 */
			"bCollapse": null,
	
			/**
			 * Width of the scrollbar for the web-browser's platform. Calculated
			 * during table initialisation.
			 *  @type int
			 *  @default 0
			 */
			"iBarWidth": 0,
	
			/**
			 * Viewport width for horizontal scrolling. Horizontal scrolling is
			 * disabled if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sX": null,
	
			/**
			 * Width to expand the table to when using x-scrolling. Typically you
			 * should not need to use this.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 *  @deprecated
			 */
			"sXInner": null,
	
			/**
			 * Viewport height for vertical scrolling. Vertical scrolling is disabled
			 * if an empty string.
			 * Note that this parameter will be set by the initialisation routine. To
			 * set a default use {@link DataTable.defaults}.
			 *  @type string
			 */
			"sY": null
		},
	
		/**
		 * Language information for the table.
		 *  @namespace
		 *  @extends DataTable.defaults.oLanguage
		 */
		"oLanguage": {
			/**
			 * Information callback function. See
			 * {@link DataTable.defaults.fnInfoCallback}
			 *  @type function
			 *  @default null
			 */
			"fnInfoCallback": null
		},
	
		/**
		 * Browser support parameters
		 *  @namespace
		 */
		"oBrowser": {
			/**
			 * Indicate if the browser incorrectly calculates width:100% inside a
			 * scrolling element (IE6/7)
			 *  @type boolean
			 *  @default false
			 */
			"bScrollOversize": false,
	
			/**
			 * Determine if the vertical scrollbar is on the right or left of the
			 * scrolling container - needed for rtl language layout, although not
			 * all browsers move the scrollbar (Safari).
			 *  @type boolean
			 *  @default false
			 */
			"bScrollbarLeft": false,
	
			/**
			 * Flag for if `getBoundingClientRect` is fully supported or not
			 *  @type boolean
			 *  @default false
			 */
			"bBounding": false,
	
			/**
			 * Browser scrollbar width
			 *  @type integer
			 *  @default 0
			 */
			"barWidth": 0
		},
	
	
		"ajax": null,
	
	
		/**
		 * Array referencing the nodes which are used for the features. The
		 * parameters of this object match what is allowed by sDom - i.e.
		 *   <ul>
		 *     <li>'l' - Length changing</li>
		 *     <li>'f' - Filtering input</li>
		 *     <li>'t' - The table!</li>
		 *     <li>'i' - Information</li>
		 *     <li>'p' - Pagination</li>
		 *     <li>'r' - pRocessing</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aanFeatures": [],
	
		/**
		 * Store data information - see {@link DataTable.models.oRow} for detailed
		 * information.
		 *  @type array
		 *  @default []
		 */
		"aoData": [],
	
		/**
		 * Array of indexes which are in the current display (after filtering etc)
		 *  @type array
		 *  @default []
		 */
		"aiDisplay": [],
	
		/**
		 * Array of indexes for display - no filtering
		 *  @type array
		 *  @default []
		 */
		"aiDisplayMaster": [],
	
		/**
		 * Map of row ids to data indexes
		 *  @type object
		 *  @default {}
		 */
		"aIds": {},
	
		/**
		 * Store information about each column that is in use
		 *  @type array
		 *  @default []
		 */
		"aoColumns": [],
	
		/**
		 * Store information about the table's header
		 *  @type array
		 *  @default []
		 */
		"aoHeader": [],
	
		/**
		 * Store information about the table's footer
		 *  @type array
		 *  @default []
		 */
		"aoFooter": [],
	
		/**
		 * Store the applied global search information in case we want to force a
		 * research or compare the old search to a new one.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @namespace
		 *  @extends DataTable.models.oSearch
		 */
		"oPreviousSearch": {},
	
		/**
		 * Store the applied search for each column - see
		 * {@link DataTable.models.oSearch} for the format that is used for the
		 * filtering information for each column.
		 *  @type array
		 *  @default []
		 */
		"aoPreSearchCols": [],
	
		/**
		 * Sorting that is applied to the table. Note that the inner arrays are
		 * used in the following manner:
		 * <ul>
		 *   <li>Index 0 - column number</li>
		 *   <li>Index 1 - current sorting direction</li>
		 * </ul>
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @todo These inner arrays should really be objects
		 */
		"aaSorting": null,
	
		/**
		 * Sorting that is always applied to the table (i.e. prefixed in front of
		 * aaSorting).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aaSortingFixed": [],
	
		/**
		 * Classes to use for the striping of a table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"asStripeClasses": null,
	
		/**
		 * If restoring a table - we should restore its striping classes as well
		 *  @type array
		 *  @default []
		 */
		"asDestroyStripes": [],
	
		/**
		 * If restoring a table - we should restore its width
		 *  @type int
		 *  @default 0
		 */
		"sDestroyWidth": 0,
	
		/**
		 * Callback functions array for every time a row is inserted (i.e. on a draw).
		 *  @type array
		 *  @default []
		 */
		"aoRowCallback": [],
	
		/**
		 * Callback functions for the header on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoHeaderCallback": [],
	
		/**
		 * Callback function for the footer on each draw.
		 *  @type array
		 *  @default []
		 */
		"aoFooterCallback": [],
	
		/**
		 * Array of callback functions for draw callback functions
		 *  @type array
		 *  @default []
		 */
		"aoDrawCallback": [],
	
		/**
		 * Array of callback functions for row created function
		 *  @type array
		 *  @default []
		 */
		"aoRowCreatedCallback": [],
	
		/**
		 * Callback functions for just before the table is redrawn. A return of
		 * false will be used to cancel the draw.
		 *  @type array
		 *  @default []
		 */
		"aoPreDrawCallback": [],
	
		/**
		 * Callback functions for when the table has been initialised.
		 *  @type array
		 *  @default []
		 */
		"aoInitComplete": [],
	
	
		/**
		 * Callbacks for modifying the settings to be stored for state saving, prior to
		 * saving state.
		 *  @type array
		 *  @default []
		 */
		"aoStateSaveParams": [],
	
		/**
		 * Callbacks for modifying the settings that have been stored for state saving
		 * prior to using the stored values to restore the state.
		 *  @type array
		 *  @default []
		 */
		"aoStateLoadParams": [],
	
		/**
		 * Callbacks for operating on the settings object once the saved state has been
		 * loaded
		 *  @type array
		 *  @default []
		 */
		"aoStateLoaded": [],
	
		/**
		 * Cache the table ID for quick access
		 *  @type string
		 *  @default <i>Empty string</i>
		 */
		"sTableId": "",
	
		/**
		 * The TABLE node for the main table
		 *  @type node
		 *  @default null
		 */
		"nTable": null,
	
		/**
		 * Permanent ref to the thead element
		 *  @type node
		 *  @default null
		 */
		"nTHead": null,
	
		/**
		 * Permanent ref to the tfoot element - if it exists
		 *  @type node
		 *  @default null
		 */
		"nTFoot": null,
	
		/**
		 * Permanent ref to the tbody element
		 *  @type node
		 *  @default null
		 */
		"nTBody": null,
	
		/**
		 * Cache the wrapper node (contains all DataTables controlled elements)
		 *  @type node
		 *  @default null
		 */
		"nTableWrapper": null,
	
		/**
		 * Indicate if when using server-side processing the loading of data
		 * should be deferred until the second draw.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 *  @default false
		 */
		"bDeferLoading": false,
	
		/**
		 * Indicate if all required information has been read in
		 *  @type boolean
		 *  @default false
		 */
		"bInitialised": false,
	
		/**
		 * Information about open rows. Each object in the array has the parameters
		 * 'nTr' and 'nParent'
		 *  @type array
		 *  @default []
		 */
		"aoOpenRows": [],
	
		/**
		 * Dictate the positioning of DataTables' control elements - see
		 * {@link DataTable.model.oInit.sDom}.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sDom": null,
	
		/**
		 * Search delay (in mS)
		 *  @type integer
		 *  @default null
		 */
		"searchDelay": null,
	
		/**
		 * Which type of pagination should be used.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default two_button
		 */
		"sPaginationType": "two_button",
	
		/**
		 * The state duration (for `stateSave`) in seconds.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type int
		 *  @default 0
		 */
		"iStateDuration": 0,
	
		/**
		 * Array of callback functions for state saving. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the JSON string to save that has been thus far created. Returns
		 *       a JSON string to be inserted into a json object
		 *       (i.e. '"param": [ 0, 1, 2]')</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateSave": [],
	
		/**
		 * Array of callback functions for state loading. Each array element is an
		 * object with the following parameters:
		 *   <ul>
		 *     <li>function:fn - function to call. Takes two parameters, oSettings
		 *       and the object stored. May return false to cancel state loading</li>
		 *     <li>string:sName - name of callback</li>
		 *   </ul>
		 *  @type array
		 *  @default []
		 */
		"aoStateLoad": [],
	
		/**
		 * State that was saved. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oSavedState": null,
	
		/**
		 * State that was loaded. Useful for back reference
		 *  @type object
		 *  @default null
		 */
		"oLoadedState": null,
	
		/**
		 * Source url for AJAX data for the table.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 *  @default null
		 */
		"sAjaxSource": null,
	
		/**
		 * Property from a given object from which to read the table data from. This
		 * can be an empty string (when not server-side processing), in which case
		 * it is  assumed an an array is given directly.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sAjaxDataProp": null,
	
		/**
		 * Note if draw should be blocked while getting data
		 *  @type boolean
		 *  @default true
		 */
		"bAjaxDataGet": true,
	
		/**
		 * The last jQuery XHR object that was used for server-side data gathering.
		 * This can be used for working with the XHR information in one of the
		 * callbacks
		 *  @type object
		 *  @default null
		 */
		"jqXHR": null,
	
		/**
		 * JSON returned from the server in the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"json": undefined,
	
		/**
		 * Data submitted as part of the last Ajax request
		 *  @type object
		 *  @default undefined
		 */
		"oAjaxData": undefined,
	
		/**
		 * Function to get the server-side data.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnServerData": null,
	
		/**
		 * Functions which are called prior to sending an Ajax request so extra
		 * parameters can easily be sent to the server
		 *  @type array
		 *  @default []
		 */
		"aoServerParams": [],
	
		/**
		 * Send the XHR HTTP method - GET or POST (could be PUT or DELETE if
		 * required).
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type string
		 */
		"sServerMethod": null,
	
		/**
		 * Format numbers for display.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type function
		 */
		"fnFormatNumber": null,
	
		/**
		 * List of options that can be used for the user selectable length menu.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type array
		 *  @default []
		 */
		"aLengthMenu": null,
	
		/**
		 * Counter for the draws that the table does. Also used as a tracker for
		 * server-side processing
		 *  @type int
		 *  @default 0
		 */
		"iDraw": 0,
	
		/**
		 * Indicate if a redraw is being done - useful for Ajax
		 *  @type boolean
		 *  @default false
		 */
		"bDrawing": false,
	
		/**
		 * Draw index (iDraw) of the last error when parsing the returned data
		 *  @type int
		 *  @default -1
		 */
		"iDrawError": -1,
	
		/**
		 * Paging display length
		 *  @type int
		 *  @default 10
		 */
		"_iDisplayLength": 10,
	
		/**
		 * Paging start point - aiDisplay index
		 *  @type int
		 *  @default 0
		 */
		"_iDisplayStart": 0,
	
		/**
		 * Server-side processing - number of records in the result set
		 * (i.e. before filtering), Use fnRecordsTotal rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type int
		 *  @default 0
		 *  @private
		 */
		"_iRecordsTotal": 0,
	
		/**
		 * Server-side processing - number of records in the current display set
		 * (i.e. after filtering). Use fnRecordsDisplay rather than
		 * this property to get the value of the number of records, regardless of
		 * the server-side processing setting.
		 *  @type boolean
		 *  @default 0
		 *  @private
		 */
		"_iRecordsDisplay": 0,
	
		/**
		 * The classes to use for the table
		 *  @type object
		 *  @default {}
		 */
		"oClasses": {},
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if filtering has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bFiltered": false,
	
		/**
		 * Flag attached to the settings object so you can check in the draw
		 * callback if sorting has been done in the draw. Deprecated in favour of
		 * events.
		 *  @type boolean
		 *  @default false
		 *  @deprecated
		 */
		"bSorted": false,
	
		/**
		 * Indicate that if multiple rows are in the header and there is more than
		 * one unique cell per column, if the top one (true) or bottom one (false)
		 * should be used for sorting / title by DataTables.
		 * Note that this parameter will be set by the initialisation routine. To
		 * set a default use {@link DataTable.defaults}.
		 *  @type boolean
		 */
		"bSortCellsTop": null,
	
		/**
		 * Initialisation object that is used for the table
		 *  @type object
		 *  @default null
		 */
		"oInit": null,
	
		/**
		 * Destroy callback functions - for plug-ins to attach themselves to the
		 * destroy so they can clean up markup and events.
		 *  @type array
		 *  @default []
		 */
		"aoDestroyCallback": [],
	
	
		/**
		 * Get the number of records in the current record set, before filtering
		 *  @type function
		 */
		"fnRecordsTotal": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsTotal * 1 :
				this.aiDisplayMaster.length;
		},
	
		/**
		 * Get the number of records in the current record set, after filtering
		 *  @type function
		 */
		"fnRecordsDisplay": function ()
		{
			return _fnDataSource( this ) == 'ssp' ?
				this._iRecordsDisplay * 1 :
				this.aiDisplay.length;
		},
	
		/**
		 * Get the display end point - aiDisplay index
		 *  @type function
		 */
		"fnDisplayEnd": function ()
		{
			var
				len      = this._iDisplayLength,
				start    = this._iDisplayStart,
				calc     = start + len,
				records  = this.aiDisplay.length,
				features = this.oFeatures,
				paginate = features.bPaginate;
	
			if ( features.bServerSide ) {
				return paginate === false || len === -1 ?
					start + records :
					Math.min( start+len, this._iRecordsDisplay );
			}
			else {
				return ! paginate || calc>records || len===-1 ?
					records :
					calc;
			}
		},
	
		/**
		 * The DataTables object for this table
		 *  @type object
		 *  @default null
		 */
		"oInstance": null,
	
		/**
		 * Unique identifier for each instance of the DataTables object. If there
		 * is an ID on the table node, then it takes that value, otherwise an
		 * incrementing internal counter is used.
		 *  @type string
		 *  @default null
		 */
		"sInstance": null,
	
		/**
		 * tabindex attribute value that is added to DataTables control elements, allowing
		 * keyboard navigation of the table and its controls.
		 */
		"iTabIndex": 0,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollHead": null,
	
		/**
		 * DIV container for the footer scrolling table if scrolling
		 */
		"nScrollFoot": null,
	
		/**
		 * Last applied sort
		 *  @type array
		 *  @default []
		 */
		"aLastSort": [],
	
		/**
		 * Stored plug-in instances
		 *  @type object
		 *  @default {}
		 */
		"oPlugins": {},
	
		/**
		 * Function used to get a row's id from the row's data
		 *  @type function
		 *  @default null
		 */
		"rowIdFn": null,
	
		/**
		 * Data location where to store a row's id
		 *  @type string
		 *  @default null
		 */
		"rowId": null
	};

	/**
	 * Extension object for DataTables that is used to provide all extension
	 * options.
	 *
	 * Note that the `DataTable.ext` object is available through
	 * `jQuery.fn.dataTable.ext` where it may be accessed and manipulated. It is
	 * also aliased to `jQuery.fn.dataTableExt` for historic reasons.
	 *  @namespace
	 *  @extends DataTable.models.ext
	 */
	
	
	/**
	 * DataTables extensions
	 * 
	 * This namespace acts as a collection area for plug-ins that can be used to
	 * extend DataTables capabilities. Indeed many of the build in methods
	 * use this method to provide their own capabilities (sorting methods for
	 * example).
	 *
	 * Note that this namespace is aliased to `jQuery.fn.dataTableExt` for legacy
	 * reasons
	 *
	 *  @namespace
	 */
	DataTable.ext = _ext = {
		/**
		 * Buttons. For use with the Buttons extension for DataTables. This is
		 * defined here so other extensions can define buttons regardless of load
		 * order. It is _not_ used by DataTables core.
		 *
		 *  @type object
		 *  @default {}
		 */
		buttons: {},
	
	
		/**
		 * Element class names
		 *
		 *  @type object
		 *  @default {}
		 */
		classes: {},
	
	
		/**
		 * DataTables build type (expanded by the download builder)
		 *
		 *  @type string
		 */
		build:"bs4/dt-1.10.22/e-1.9.5",
	
	
		/**
		 * Error reporting.
		 * 
		 * How should DataTables report an error. Can take the value 'alert',
		 * 'throw', 'none' or a function.
		 *
		 *  @type string|function
		 *  @default alert
		 */
		errMode: "alert",
	
	
		/**
		 * Feature plug-ins.
		 * 
		 * This is an array of objects which describe the feature plug-ins that are
		 * available to DataTables. These feature plug-ins are then available for
		 * use through the `dom` initialisation option.
		 * 
		 * Each feature plug-in is described by an object which must have the
		 * following properties:
		 * 
		 * * `fnInit` - function that is used to initialise the plug-in,
		 * * `cFeature` - a character so the feature can be enabled by the `dom`
		 *   instillation option. This is case sensitive.
		 *
		 * The `fnInit` function has the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 *
		 * And the following return is expected:
		 * 
		 * * {node|null} The element which contains your feature. Note that the
		 *   return may also be void if your plug-in does not require to inject any
		 *   DOM elements into DataTables control (`dom`) - for example this might
		 *   be useful when developing a plug-in which allows table control via
		 *   keyboard entry
		 *
		 *  @type array
		 *
		 *  @example
		 *    $.fn.dataTable.ext.features.push( {
		 *      "fnInit": function( oSettings ) {
		 *        return new TableTools( { "oDTSettings": oSettings } );
		 *      },
		 *      "cFeature": "T"
		 *    } );
		 */
		feature: [],
	
	
		/**
		 * Row searching.
		 * 
		 * This method of searching is complimentary to the default type based
		 * searching, and a lot more comprehensive as it allows you complete control
		 * over the searching logic. Each element in this array is a function
		 * (parameters described below) that is called for every row in the table,
		 * and your logic decides if it should be included in the searching data set
		 * or not.
		 *
		 * Searching functions have the following input parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{array|object}` Data for the row to be processed (same as the
		 *    original format that was passed in as the data source, or an array
		 *    from a DOM data source
		 * 3. `{int}` Row index ({@link DataTable.models.oSettings.aoData}), which
		 *    can be useful to retrieve the `TR` element if you need DOM interaction.
		 *
		 * And the following return is expected:
		 *
		 * * {boolean} Include the row in the searched result set (true) or not
		 *   (false)
		 *
		 * Note that as with the main search ability in DataTables, technically this
		 * is "filtering", since it is subtractive. However, for consistency in
		 * naming we call it searching here.
		 *
		 *  @type array
		 *  @default []
		 *
		 *  @example
		 *    // The following example shows custom search being applied to the
		 *    // fourth column (i.e. the data[3] index) based on two input values
		 *    // from the end-user, matching the data in a certain range.
		 *    $.fn.dataTable.ext.search.push(
		 *      function( settings, data, dataIndex ) {
		 *        var min = document.getElementById('min').value * 1;
		 *        var max = document.getElementById('max').value * 1;
		 *        var version = data[3] == "-" ? 0 : data[3]*1;
		 *
		 *        if ( min == "" && max == "" ) {
		 *          return true;
		 *        }
		 *        else if ( min == "" && version < max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && "" == max ) {
		 *          return true;
		 *        }
		 *        else if ( min < version && version < max ) {
		 *          return true;
		 *        }
		 *        return false;
		 *      }
		 *    );
		 */
		search: [],
	
	
		/**
		 * Selector extensions
		 *
		 * The `selector` option can be used to extend the options available for the
		 * selector modifier options (`selector-modifier` object data type) that
		 * each of the three built in selector types offer (row, column and cell +
		 * their plural counterparts). For example the Select extension uses this
		 * mechanism to provide an option to select only rows, columns and cells
		 * that have been marked as selected by the end user (`{selected: true}`),
		 * which can be used in conjunction with the existing built in selector
		 * options.
		 *
		 * Each property is an array to which functions can be pushed. The functions
		 * take three attributes:
		 *
		 * * Settings object for the host table
		 * * Options object (`selector-modifier` object type)
		 * * Array of selected item indexes
		 *
		 * The return is an array of the resulting item indexes after the custom
		 * selector has been applied.
		 *
		 *  @type object
		 */
		selector: {
			cell: [],
			column: [],
			row: []
		},
	
	
		/**
		 * Internal functions, exposed for used in plug-ins.
		 * 
		 * Please note that you should not need to use the internal methods for
		 * anything other than a plug-in (and even then, try to avoid if possible).
		 * The internal function may change between releases.
		 *
		 *  @type object
		 *  @default {}
		 */
		internal: {},
	
	
		/**
		 * Legacy configuration options. Enable and disable legacy options that
		 * are available in DataTables.
		 *
		 *  @type object
		 */
		legacy: {
			/**
			 * Enable / disable DataTables 1.9 compatible server-side processing
			 * requests
			 *
			 *  @type boolean
			 *  @default null
			 */
			ajax: null
		},
	
	
		/**
		 * Pagination plug-in methods.
		 * 
		 * Each entry in this object is a function and defines which buttons should
		 * be shown by the pagination rendering method that is used for the table:
		 * {@link DataTable.ext.renderer.pageButton}. The renderer addresses how the
		 * buttons are displayed in the document, while the functions here tell it
		 * what buttons to display. This is done by returning an array of button
		 * descriptions (what each button will do).
		 *
		 * Pagination types (the four built in options and any additional plug-in
		 * options defined here) can be used through the `paginationType`
		 * initialisation parameter.
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{int} page` The current page index
		 * 2. `{int} pages` The number of pages in the table
		 *
		 * Each function is expected to return an array where each element of the
		 * array can be one of:
		 *
		 * * `first` - Jump to first page when activated
		 * * `last` - Jump to last page when activated
		 * * `previous` - Show previous page when activated
		 * * `next` - Show next page when activated
		 * * `{int}` - Show page of the index given
		 * * `{array}` - A nested array containing the above elements to add a
		 *   containing 'DIV' element (might be useful for styling).
		 *
		 * Note that DataTables v1.9- used this object slightly differently whereby
		 * an object with two functions would be defined for each plug-in. That
		 * ability is still supported by DataTables 1.10+ to provide backwards
		 * compatibility, but this option of use is now decremented and no longer
		 * documented in DataTables 1.10+.
		 *
		 *  @type object
		 *  @default {}
		 *
		 *  @example
		 *    // Show previous, next and current page buttons only
		 *    $.fn.dataTableExt.oPagination.current = function ( page, pages ) {
		 *      return [ 'previous', page, 'next' ];
		 *    };
		 */
		pager: {},
	
	
		renderer: {
			pageButton: {},
			header: {}
		},
	
	
		/**
		 * Ordering plug-ins - custom data source
		 * 
		 * The extension options for ordering of data available here is complimentary
		 * to the default type based ordering that DataTables typically uses. It
		 * allows much greater control over the the data that is being used to
		 * order a column, but is necessarily therefore more complex.
		 * 
		 * This type of ordering is useful if you want to do ordering based on data
		 * live from the DOM (for example the contents of an 'input' element) rather
		 * than just the static string that DataTables knows of.
		 * 
		 * The way these plug-ins work is that you create an array of the values you
		 * wish to be ordering for the column in question and then return that
		 * array. The data in the array much be in the index order of the rows in
		 * the table (not the currently ordering order!). Which order data gathering
		 * function is run here depends on the `dt-init columns.orderDataType`
		 * parameter that is used for the column (if any).
		 *
		 * The functions defined take two parameters:
		 *
		 * 1. `{object}` DataTables settings object: see
		 *    {@link DataTable.models.oSettings}
		 * 2. `{int}` Target column index
		 *
		 * Each function is expected to return an array:
		 *
		 * * `{array}` Data for the column to be ordering upon
		 *
		 *  @type array
		 *
		 *  @example
		 *    // Ordering using `input` node values
		 *    $.fn.dataTable.ext.order['dom-text'] = function  ( settings, col )
		 *    {
		 *      return this.api().column( col, {order:'index'} ).nodes().map( function ( td, i ) {
		 *        return $('input', td).val();
		 *      } );
		 *    }
		 */
		order: {},
	
	
		/**
		 * Type based plug-ins.
		 *
		 * Each column in DataTables has a type assigned to it, either by automatic
		 * detection or by direct assignment using the `type` option for the column.
		 * The type of a column will effect how it is ordering and search (plug-ins
		 * can also make use of the column type if required).
		 *
		 * @namespace
		 */
		type: {
			/**
			 * Type detection functions.
			 *
			 * The functions defined in this object are used to automatically detect
			 * a column's type, making initialisation of DataTables super easy, even
			 * when complex data is in the table.
			 *
			 * The functions defined take two parameters:
			 *
		     *  1. `{*}` Data from the column cell to be analysed
		     *  2. `{settings}` DataTables settings object. This can be used to
		     *     perform context specific type detection - for example detection
		     *     based on language settings such as using a comma for a decimal
		     *     place. Generally speaking the options from the settings will not
		     *     be required
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Data type detected, or null if unknown (and thus
			 *   pass it on to the other type detection functions.
			 *
			 *  @type array
			 *
			 *  @example
			 *    // Currency type detection plug-in:
			 *    $.fn.dataTable.ext.type.detect.push(
			 *      function ( data, settings ) {
			 *        // Check the numeric part
			 *        if ( ! data.substring(1).match(/[0-9]/) ) {
			 *          return null;
			 *        }
			 *
			 *        // Check prefixed by currency
			 *        if ( data.charAt(0) == '$' || data.charAt(0) == '&pound;' ) {
			 *          return 'currency';
			 *        }
			 *        return null;
			 *      }
			 *    );
			 */
			detect: [],
	
	
			/**
			 * Type based search formatting.
			 *
			 * The type based searching functions can be used to pre-format the
			 * data to be search on. For example, it can be used to strip HTML
			 * tags or to de-format telephone numbers for numeric only searching.
			 *
			 * Note that is a search is not defined for a column of a given type,
			 * no search formatting will be performed.
			 * 
			 * Pre-processing of searching data plug-ins - When you assign the sType
			 * for a column (or have it automatically detected for you by DataTables
			 * or a type detection plug-in), you will typically be using this for
			 * custom sorting, but it can also be used to provide custom searching
			 * by allowing you to pre-processing the data and returning the data in
			 * the format that should be searched upon. This is done by adding
			 * functions this object with a parameter name which matches the sType
			 * for that target column. This is the corollary of <i>afnSortData</i>
			 * for searching data.
			 *
			 * The functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for searching
			 *
			 * Each function is expected to return:
			 *
			 * * `{string|null}` Formatted string that will be used for the searching.
			 *
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    $.fn.dataTable.ext.type.search['title-numeric'] = function ( d ) {
			 *      return d.replace(/\n/g," ").replace( /<.*?>/g, "" );
			 *    }
			 */
			search: {},
	
	
			/**
			 * Type based ordering.
			 *
			 * The column type tells DataTables what ordering to apply to the table
			 * when a column is sorted upon. The order for each type that is defined,
			 * is defined by the functions available in this object.
			 *
			 * Each ordering option can be described by three properties added to
			 * this object:
			 *
			 * * `{type}-pre` - Pre-formatting function
			 * * `{type}-asc` - Ascending order function
			 * * `{type}-desc` - Descending order function
			 *
			 * All three can be used together, only `{type}-pre` or only
			 * `{type}-asc` and `{type}-desc` together. It is generally recommended
			 * that only `{type}-pre` is used, as this provides the optimal
			 * implementation in terms of speed, although the others are provided
			 * for compatibility with existing Javascript sort functions.
			 *
			 * `{type}-pre`: Functions defined take a single parameter:
			 *
		     *  1. `{*}` Data from the column cell to be prepared for ordering
			 *
			 * And return:
			 *
			 * * `{*}` Data to be sorted upon
			 *
			 * `{type}-asc` and `{type}-desc`: Functions are typical Javascript sort
			 * functions, taking two parameters:
			 *
		     *  1. `{*}` Data to compare to the second parameter
		     *  2. `{*}` Data to compare to the first parameter
			 *
			 * And returning:
			 *
			 * * `{*}` Ordering match: <0 if first parameter should be sorted lower
			 *   than the second parameter, ===0 if the two parameters are equal and
			 *   >0 if the first parameter should be sorted height than the second
			 *   parameter.
			 * 
			 *  @type object
			 *  @default {}
			 *
			 *  @example
			 *    // Numeric ordering of formatted numbers with a pre-formatter
			 *    $.extend( $.fn.dataTable.ext.type.order, {
			 *      "string-pre": function(x) {
			 *        a = (a === "-" || a === "") ? 0 : a.replace( /[^\d\-\.]/g, "" );
			 *        return parseFloat( a );
			 *      }
			 *    } );
			 *
			 *  @example
			 *    // Case-sensitive string ordering, with no pre-formatting method
			 *    $.extend( $.fn.dataTable.ext.order, {
			 *      "string-case-asc": function(x,y) {
			 *        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			 *      },
			 *      "string-case-desc": function(x,y) {
			 *        return ((x < y) ? 1 : ((x > y) ? -1 : 0));
			 *      }
			 *    } );
			 */
			order: {}
		},
	
		/**
		 * Unique DataTables instance counter
		 *
		 * @type int
		 * @private
		 */
		_unique: 0,
	
	
		//
		// Depreciated
		// The following properties are retained for backwards compatiblity only.
		// The should not be used in new projects and will be removed in a future
		// version
		//
	
		/**
		 * Version check function.
		 *  @type function
		 *  @depreciated Since 1.10
		 */
		fnVersionCheck: DataTable.fnVersionCheck,
	
	
		/**
		 * Index for what 'this' index API functions should use
		 *  @type int
		 *  @deprecated Since v1.10
		 */
		iApiIndex: 0,
	
	
		/**
		 * jQuery UI class container
		 *  @type object
		 *  @deprecated Since v1.10
		 */
		oJUIClasses: {},
	
	
		/**
		 * Software version
		 *  @type string
		 *  @deprecated Since v1.10
		 */
		sVersion: DataTable.version
	};
	
	
	//
	// Backwards compatibility. Alias to pre 1.10 Hungarian notation counter parts
	//
	$.extend( _ext, {
		afnFiltering: _ext.search,
		aTypes:       _ext.type.detect,
		ofnSearch:    _ext.type.search,
		oSort:        _ext.type.order,
		afnSortData:  _ext.order,
		aoFeatures:   _ext.feature,
		oApi:         _ext.internal,
		oStdClasses:  _ext.classes,
		oPagination:  _ext.pager
	} );
	
	
	$.extend( DataTable.ext.classes, {
		"sTable": "dataTable",
		"sNoFooter": "no-footer",
	
		/* Paging buttons */
		"sPageButton": "paginate_button",
		"sPageButtonActive": "current",
		"sPageButtonDisabled": "disabled",
	
		/* Striping classes */
		"sStripeOdd": "odd",
		"sStripeEven": "even",
	
		/* Empty row */
		"sRowEmpty": "dataTables_empty",
	
		/* Features */
		"sWrapper": "dataTables_wrapper",
		"sFilter": "dataTables_filter",
		"sInfo": "dataTables_info",
		"sPaging": "dataTables_paginate paging_", /* Note that the type is postfixed */
		"sLength": "dataTables_length",
		"sProcessing": "dataTables_processing",
	
		/* Sorting */
		"sSortAsc": "sorting_asc",
		"sSortDesc": "sorting_desc",
		"sSortable": "sorting", /* Sortable in both directions */
		"sSortableAsc": "sorting_asc_disabled",
		"sSortableDesc": "sorting_desc_disabled",
		"sSortableNone": "sorting_disabled",
		"sSortColumn": "sorting_", /* Note that an int is postfixed for the sorting order */
	
		/* Filtering */
		"sFilterInput": "",
	
		/* Page length */
		"sLengthSelect": "",
	
		/* Scrolling */
		"sScrollWrapper": "dataTables_scroll",
		"sScrollHead": "dataTables_scrollHead",
		"sScrollHeadInner": "dataTables_scrollHeadInner",
		"sScrollBody": "dataTables_scrollBody",
		"sScrollFoot": "dataTables_scrollFoot",
		"sScrollFootInner": "dataTables_scrollFootInner",
	
		/* Misc */
		"sHeaderTH": "",
		"sFooterTH": "",
	
		// Deprecated
		"sSortJUIAsc": "",
		"sSortJUIDesc": "",
		"sSortJUI": "",
		"sSortJUIAscAllowed": "",
		"sSortJUIDescAllowed": "",
		"sSortJUIWrapper": "",
		"sSortIcon": "",
		"sJUIHeader": "",
		"sJUIFooter": ""
	} );
	
	
	var extPagination = DataTable.ext.pager;
	
	function _numbers ( page, pages ) {
		var
			numbers = [],
			buttons = extPagination.numbers_length,
			half = Math.floor( buttons / 2 ),
			i = 1;
	
		if ( pages <= buttons ) {
			numbers = _range( 0, pages );
		}
		else if ( page <= half ) {
			numbers = _range( 0, buttons-2 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
		}
		else if ( page >= pages - 1 - half ) {
			numbers = _range( pages-(buttons-2), pages );
			numbers.splice( 0, 0, 'ellipsis' ); // no unshift in ie6
			numbers.splice( 0, 0, 0 );
		}
		else {
			numbers = _range( page-half+2, page+half-1 );
			numbers.push( 'ellipsis' );
			numbers.push( pages-1 );
			numbers.splice( 0, 0, 'ellipsis' );
			numbers.splice( 0, 0, 0 );
		}
	
		numbers.DT_el = 'span';
		return numbers;
	}
	
	
	$.extend( extPagination, {
		simple: function ( page, pages ) {
			return [ 'previous', 'next' ];
		},
	
		full: function ( page, pages ) {
			return [  'first', 'previous', 'next', 'last' ];
		},
	
		numbers: function ( page, pages ) {
			return [ _numbers(page, pages) ];
		},
	
		simple_numbers: function ( page, pages ) {
			return [ 'previous', _numbers(page, pages), 'next' ];
		},
	
		full_numbers: function ( page, pages ) {
			return [ 'first', 'previous', _numbers(page, pages), 'next', 'last' ];
		},
		
		first_last_numbers: function (page, pages) {
	 		return ['first', _numbers(page, pages), 'last'];
	 	},
	
		// For testing and plug-ins to use
		_numbers: _numbers,
	
		// Number of number buttons (including ellipsis) to show. _Must be odd!_
		numbers_length: 7
	} );
	
	
	$.extend( true, DataTable.ext.renderer, {
		pageButton: {
			_: function ( settings, host, idx, buttons, page, pages ) {
				var classes = settings.oClasses;
				var lang = settings.oLanguage.oPaginate;
				var aria = settings.oLanguage.oAria.paginate || {};
				var btnDisplay, btnClass, counter=0;
	
				var attach = function( container, buttons ) {
					var i, ien, node, button, tabIndex;
					var disabledClass = classes.sPageButtonDisabled;
					var clickHandler = function ( e ) {
						_fnPageChange( settings, e.data.action, true );
					};
	
					for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
						button = buttons[i];
	
						if ( Array.isArray( button ) ) {
							var inner = $( '<'+(button.DT_el || 'div')+'/>' )
								.appendTo( container );
							attach( inner, button );
						}
						else {
							btnDisplay = null;
							btnClass = button;
							tabIndex = settings.iTabIndex;
	
							switch ( button ) {
								case 'ellipsis':
									container.append('<span class="ellipsis">&#x2026;</span>');
									break;
	
								case 'first':
									btnDisplay = lang.sFirst;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'previous':
									btnDisplay = lang.sPrevious;
	
									if ( page === 0 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'next':
									btnDisplay = lang.sNext;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								case 'last':
									btnDisplay = lang.sLast;
	
									if ( pages === 0 || page === pages-1 ) {
										tabIndex = -1;
										btnClass += ' ' + disabledClass;
									}
									break;
	
								default:
									btnDisplay = settings.fnFormatNumber( button + 1 );
									btnClass = page === button ?
										classes.sPageButtonActive : '';
									break;
							}
	
							if ( btnDisplay !== null ) {
								node = $('<a>', {
										'class': classes.sPageButton+' '+btnClass,
										'aria-controls': settings.sTableId,
										'aria-label': aria[ button ],
										'data-dt-idx': counter,
										'tabindex': tabIndex,
										'id': idx === 0 && typeof button === 'string' ?
											settings.sTableId +'_'+ button :
											null
									} )
									.html( btnDisplay )
									.appendTo( container );
	
								_fnBindAction(
									node, {action: button}, clickHandler
								);
	
								counter++;
							}
						}
					}
				};
	
				// IE9 throws an 'unknown error' if document.activeElement is used
				// inside an iframe or frame. Try / catch the error. Not good for
				// accessibility, but neither are frames.
				var activeEl;
	
				try {
					// Because this approach is destroying and recreating the paging
					// elements, focus is lost on the select button which is bad for
					// accessibility. So we want to restore focus once the draw has
					// completed
					activeEl = $(host).find(document.activeElement).data('dt-idx');
				}
				catch (e) {}
	
				attach( $(host).empty(), buttons );
	
				if ( activeEl !== undefined ) {
					$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
				}
			}
		}
	} );
	
	
	
	// Built in type detection. See model.ext.aTypes for information about
	// what is required from this methods.
	$.extend( DataTable.ext.type.detect, [
		// Plain numbers - first since V8 detects some plain numbers as dates
		// e.g. Date.parse('55') (but not all, e.g. Date.parse('22')...).
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal ) ? 'num'+decimal : null;
		},
	
		// Dates (only those recognised by the browser's Date.parse)
		function ( d, settings )
		{
			// V8 tries _very_ hard to make a string passed into `Date.parse()`
			// valid, so we need to use a regex to restrict date formats. Use a
			// plug-in for anything other than ISO8601 style strings
			if ( d && !(d instanceof Date) && ! _re_date.test(d) ) {
				return null;
			}
			var parsed = Date.parse(d);
			return (parsed !== null && !isNaN(parsed)) || _empty(d) ? 'date' : null;
		},
	
		// Formatted numbers
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _isNumber( d, decimal, true ) ? 'num-fmt'+decimal : null;
		},
	
		// HTML numeric
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal ) ? 'html-num'+decimal : null;
		},
	
		// HTML numeric, formatted
		function ( d, settings )
		{
			var decimal = settings.oLanguage.sDecimal;
			return _htmlNumeric( d, decimal, true ) ? 'html-num-fmt'+decimal : null;
		},
	
		// HTML (this is strict checking - there must be html)
		function ( d, settings )
		{
			return _empty( d ) || (typeof d === 'string' && d.indexOf('<') !== -1) ?
				'html' : null;
		}
	] );
	
	
	
	// Filter formatting functions. See model.ext.ofnSearch for information about
	// what is required from these methods.
	// 
	// Note that additional search methods are added for the html numbers and
	// html formatted numbers by `_addNumericSort()` when we know what the decimal
	// place is
	
	
	$.extend( DataTable.ext.type.search, {
		html: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data
						.replace( _re_new_lines, " " )
						.replace( _re_html, "" ) :
					'';
		},
	
		string: function ( data ) {
			return _empty(data) ?
				data :
				typeof data === 'string' ?
					data.replace( _re_new_lines, " " ) :
					data;
		}
	} );
	
	
	
	var __numericReplace = function ( d, decimalPlace, re1, re2 ) {
		if ( d !== 0 && (!d || d === '-') ) {
			return -Infinity;
		}
	
		// If a decimal place other than `.` is used, it needs to be given to the
		// function so we can detect it and replace with a `.` which is the only
		// decimal place Javascript recognises - it is not locale aware.
		if ( decimalPlace ) {
			d = _numToDecimal( d, decimalPlace );
		}
	
		if ( d.replace ) {
			if ( re1 ) {
				d = d.replace( re1, '' );
			}
	
			if ( re2 ) {
				d = d.replace( re2, '' );
			}
		}
	
		return d * 1;
	};
	
	
	// Add the numeric 'deformatting' functions for sorting and search. This is done
	// in a function to provide an easy ability for the language options to add
	// additional methods if a non-period decimal place is used.
	function _addNumericSort ( decimalPlace ) {
		$.each(
			{
				// Plain numbers
				"num": function ( d ) {
					return __numericReplace( d, decimalPlace );
				},
	
				// Formatted numbers
				"num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_formatted_numeric );
				},
	
				// HTML numeric
				"html-num": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html );
				},
	
				// HTML numeric, formatted
				"html-num-fmt": function ( d ) {
					return __numericReplace( d, decimalPlace, _re_html, _re_formatted_numeric );
				}
			},
			function ( key, fn ) {
				// Add the ordering method
				_ext.type.order[ key+decimalPlace+'-pre' ] = fn;
	
				// For HTML types add a search formatter that will strip the HTML
				if ( key.match(/^html\-/) ) {
					_ext.type.search[ key+decimalPlace ] = _ext.type.search.html;
				}
			}
		);
	}
	
	
	// Default sort methods
	$.extend( _ext.type.order, {
		// Dates
		"date-pre": function ( d ) {
			var ts = Date.parse( d );
			return isNaN(ts) ? -Infinity : ts;
		},
	
		// html
		"html-pre": function ( a ) {
			return _empty(a) ?
				'' :
				a.replace ?
					a.replace( /<.*?>/g, "" ).toLowerCase() :
					a+'';
		},
	
		// string
		"string-pre": function ( a ) {
			// This is a little complex, but faster than always calling toString,
			// http://jsperf.com/tostring-v-check
			return _empty(a) ?
				'' :
				typeof a === 'string' ?
					a.toLowerCase() :
					! a.toString ?
						'' :
						a.toString();
		},
	
		// string-asc and -desc are retained only for compatibility with the old
		// sort methods
		"string-asc": function ( x, y ) {
			return ((x < y) ? -1 : ((x > y) ? 1 : 0));
		},
	
		"string-desc": function ( x, y ) {
			return ((x < y) ? 1 : ((x > y) ? -1 : 0));
		}
	} );
	
	
	// Numeric sorting types - order doesn't matter here
	_addNumericSort( '' );
	
	
	$.extend( true, DataTable.ext.renderer, {
		header: {
			_: function ( settings, cell, column, classes ) {
				// No additional mark-up required
				// Attach a sort listener to update on sort - note that using the
				// `DT` namespace will allow the event to be removed automatically
				// on destroy, while the `dt` namespaced event is the one we are
				// listening for
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) { // need to check this this is the host
						return;               // table, not a nested one
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass(
							column.sSortingClass +' '+
							classes.sSortAsc +' '+
							classes.sSortDesc
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
				} );
			},
	
			jqueryui: function ( settings, cell, column, classes ) {
				$('<div/>')
					.addClass( classes.sSortJUIWrapper )
					.append( cell.contents() )
					.append( $('<span/>')
						.addClass( classes.sSortIcon+' '+column.sSortingClassJUI )
					)
					.appendTo( cell );
	
				// Attach a sort listener to update on sort
				$(settings.nTable).on( 'order.dt.DT', function ( e, ctx, sorting, columns ) {
					if ( settings !== ctx ) {
						return;
					}
	
					var colIdx = column.idx;
	
					cell
						.removeClass( classes.sSortAsc +" "+classes.sSortDesc )
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortDesc :
								column.sSortingClass
						);
	
					cell
						.find( 'span.'+classes.sSortIcon )
						.removeClass(
							classes.sSortJUIAsc +" "+
							classes.sSortJUIDesc +" "+
							classes.sSortJUI +" "+
							classes.sSortJUIAscAllowed +" "+
							classes.sSortJUIDescAllowed
						)
						.addClass( columns[ colIdx ] == 'asc' ?
							classes.sSortJUIAsc : columns[ colIdx ] == 'desc' ?
								classes.sSortJUIDesc :
								column.sSortingClassJUI
						);
				} );
			}
		}
	} );
	
	/*
	 * Public helper functions. These aren't used internally by DataTables, or
	 * called by any of the options passed into DataTables, but they can be used
	 * externally by developers working with DataTables. They are helper functions
	 * to make working with DataTables a little bit easier.
	 */
	
	var __htmlEscapeEntities = function ( d ) {
		return typeof d === 'string' ?
			d
				.replace(/&/g, '&amp;')
				.replace(/</g, '&lt;')
				.replace(/>/g, '&gt;')
				.replace(/"/g, '&quot;') :
			d;
	};
	
	/**
	 * Helpers for `columns.render`.
	 *
	 * The options defined here can be used with the `columns.render` initialisation
	 * option to provide a display renderer. The following functions are defined:
	 *
	 * * `number` - Will format numeric data (defined by `columns.data`) for
	 *   display, retaining the original unformatted data for sorting and filtering.
	 *   It takes 5 parameters:
	 *   * `string` - Thousands grouping separator
	 *   * `string` - Decimal point indicator
	 *   * `integer` - Number of decimal points to show
	 *   * `string` (optional) - Prefix.
	 *   * `string` (optional) - Postfix (/suffix).
	 * * `text` - Escape HTML to help prevent XSS attacks. It has no optional
	 *   parameters.
	 *
	 * @example
	 *   // Column definition using the number renderer
	 *   {
	 *     data: "salary",
	 *     render: $.fn.dataTable.render.number( '\'', '.', 0, '$' )
	 *   }
	 *
	 * @namespace
	 */
	DataTable.render = {
		number: function ( thousands, decimal, precision, prefix, postfix ) {
			return {
				display: function ( d ) {
					if ( typeof d !== 'number' && typeof d !== 'string' ) {
						return d;
					}
	
					var negative = d < 0 ? '-' : '';
					var flo = parseFloat( d );
	
					// If NaN then there isn't much formatting that we can do - just
					// return immediately, escaping any HTML (this was supposed to
					// be a number after all)
					if ( isNaN( flo ) ) {
						return __htmlEscapeEntities( d );
					}
	
					flo = flo.toFixed( precision );
					d = Math.abs( flo );
	
					var intPart = parseInt( d, 10 );
					var floatPart = precision ?
						decimal+(d - intPart).toFixed( precision ).substring( 2 ):
						'';
	
					return negative + (prefix||'') +
						intPart.toString().replace(
							/\B(?=(\d{3})+(?!\d))/g, thousands
						) +
						floatPart +
						(postfix||'');
				}
			};
		},
	
		text: function () {
			return {
				display: __htmlEscapeEntities,
				filter: __htmlEscapeEntities
			};
		}
	};
	
	
	/*
	 * This is really a good bit rubbish this method of exposing the internal methods
	 * publicly... - To be fixed in 2.0 using methods on the prototype
	 */
	
	
	/**
	 * Create a wrapper function for exporting an internal functions to an external API.
	 *  @param {string} fn API function name
	 *  @returns {function} wrapped function
	 *  @memberof DataTable#internal
	 */
	function _fnExternApiFunc (fn)
	{
		return function() {
			var args = [_fnSettingsFromNode( this[DataTable.ext.iApiIndex] )].concat(
				Array.prototype.slice.call(arguments)
			);
			return DataTable.ext.internal[fn].apply( this, args );
		};
	}
	
	
	/**
	 * Reference to internal functions for use by plug-in developers. Note that
	 * these methods are references to internal functions and are considered to be
	 * private. If you use these methods, be aware that they are liable to change
	 * between versions.
	 *  @namespace
	 */
	$.extend( DataTable.ext.internal, {
		_fnExternApiFunc: _fnExternApiFunc,
		_fnBuildAjax: _fnBuildAjax,
		_fnAjaxUpdate: _fnAjaxUpdate,
		_fnAjaxParameters: _fnAjaxParameters,
		_fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
		_fnAjaxDataSrc: _fnAjaxDataSrc,
		_fnAddColumn: _fnAddColumn,
		_fnColumnOptions: _fnColumnOptions,
		_fnAdjustColumnSizing: _fnAdjustColumnSizing,
		_fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
		_fnColumnIndexToVisible: _fnColumnIndexToVisible,
		_fnVisbleColumns: _fnVisbleColumns,
		_fnGetColumns: _fnGetColumns,
		_fnColumnTypes: _fnColumnTypes,
		_fnApplyColumnDefs: _fnApplyColumnDefs,
		_fnHungarianMap: _fnHungarianMap,
		_fnCamelToHungarian: _fnCamelToHungarian,
		_fnLanguageCompat: _fnLanguageCompat,
		_fnBrowserDetect: _fnBrowserDetect,
		_fnAddData: _fnAddData,
		_fnAddTr: _fnAddTr,
		_fnNodeToDataIndex: _fnNodeToDataIndex,
		_fnNodeToColumnIndex: _fnNodeToColumnIndex,
		_fnGetCellData: _fnGetCellData,
		_fnSetCellData: _fnSetCellData,
		_fnSplitObjNotation: _fnSplitObjNotation,
		_fnGetObjectDataFn: _fnGetObjectDataFn,
		_fnSetObjectDataFn: _fnSetObjectDataFn,
		_fnGetDataMaster: _fnGetDataMaster,
		_fnClearTable: _fnClearTable,
		_fnDeleteIndex: _fnDeleteIndex,
		_fnInvalidate: _fnInvalidate,
		_fnGetRowElements: _fnGetRowElements,
		_fnCreateTr: _fnCreateTr,
		_fnBuildHead: _fnBuildHead,
		_fnDrawHead: _fnDrawHead,
		_fnDraw: _fnDraw,
		_fnReDraw: _fnReDraw,
		_fnAddOptionsHtml: _fnAddOptionsHtml,
		_fnDetectHeader: _fnDetectHeader,
		_fnGetUniqueThs: _fnGetUniqueThs,
		_fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
		_fnFilterComplete: _fnFilterComplete,
		_fnFilterCustom: _fnFilterCustom,
		_fnFilterColumn: _fnFilterColumn,
		_fnFilter: _fnFilter,
		_fnFilterCreateSearch: _fnFilterCreateSearch,
		_fnEscapeRegex: _fnEscapeRegex,
		_fnFilterData: _fnFilterData,
		_fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
		_fnUpdateInfo: _fnUpdateInfo,
		_fnInfoMacros: _fnInfoMacros,
		_fnInitialise: _fnInitialise,
		_fnInitComplete: _fnInitComplete,
		_fnLengthChange: _fnLengthChange,
		_fnFeatureHtmlLength: _fnFeatureHtmlLength,
		_fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
		_fnPageChange: _fnPageChange,
		_fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
		_fnProcessingDisplay: _fnProcessingDisplay,
		_fnFeatureHtmlTable: _fnFeatureHtmlTable,
		_fnScrollDraw: _fnScrollDraw,
		_fnApplyToChildren: _fnApplyToChildren,
		_fnCalculateColumnWidths: _fnCalculateColumnWidths,
		_fnThrottle: _fnThrottle,
		_fnConvertToWidth: _fnConvertToWidth,
		_fnGetWidestNode: _fnGetWidestNode,
		_fnGetMaxLenString: _fnGetMaxLenString,
		_fnStringToCss: _fnStringToCss,
		_fnSortFlatten: _fnSortFlatten,
		_fnSort: _fnSort,
		_fnSortAria: _fnSortAria,
		_fnSortListener: _fnSortListener,
		_fnSortAttachListener: _fnSortAttachListener,
		_fnSortingClasses: _fnSortingClasses,
		_fnSortData: _fnSortData,
		_fnSaveState: _fnSaveState,
		_fnLoadState: _fnLoadState,
		_fnSettingsFromNode: _fnSettingsFromNode,
		_fnLog: _fnLog,
		_fnMap: _fnMap,
		_fnBindAction: _fnBindAction,
		_fnCallbackReg: _fnCallbackReg,
		_fnCallbackFire: _fnCallbackFire,
		_fnLengthOverflow: _fnLengthOverflow,
		_fnRenderer: _fnRenderer,
		_fnDataSource: _fnDataSource,
		_fnRowAttributes: _fnRowAttributes,
		_fnExtend: _fnExtend,
		_fnCalculateEnd: function () {} // Used by a lot of plug-ins, but redundant
		                                // in 1.10, so this dead-end function is
		                                // added to prevent errors
	} );
	

	// jQuery access
	$.fn.dataTable = DataTable;

	// Provide access to the host jQuery object (circular reference)
	DataTable.$ = $;

	// Legacy aliases
	$.fn.dataTableSettings = DataTable.settings;
	$.fn.dataTableExt = DataTable.ext;

	// With a capital `D` we return a DataTables API instance rather than a
	// jQuery object
	$.fn.DataTable = function ( opts ) {
		return $(this).dataTable( opts ).api();
	};

	// All properties that are available to $.fn.dataTable should also be
	// available on $.fn.DataTable
	$.each( DataTable, function ( prop, val ) {
		$.fn.DataTable[ prop ] = val;
	} );


	// Information about events fired by DataTables - for documentation.
	/**
	 * Draw event, fired whenever the table is redrawn on the page, at the same
	 * point as fnDrawCallback. This may be useful for binding events or
	 * performing calculations when the table is altered at all.
	 *  @name DataTable#draw.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Search event, fired when the searching applied to the table (using the
	 * built-in global search, or column filters) is altered.
	 *  @name DataTable#search.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page change event, fired when the paging of the table is altered.
	 *  @name DataTable#page.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Order event, fired when the ordering applied to the table is altered.
	 *  @name DataTable#order.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * DataTables initialisation complete event, fired when the table is fully
	 * drawn, including Ajax data loaded, if Ajax data is required.
	 *  @name DataTable#init.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The JSON object request from the server - only
	 *    present if client-side Ajax sourced data is used</li></ol>
	 */

	/**
	 * State save event, fired when the table has changed state a new state save
	 * is required. This event allows modification of the state saving object
	 * prior to actually doing the save, including addition or other state
	 * properties (for plug-ins) or modification of a DataTables core property.
	 *  @name DataTable#stateSaveParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The state information to be saved
	 */

	/**
	 * State load event, fired when the table is loading state from the stored
	 * data, but prior to the settings object being modified by the saved state
	 * - allowing modification of the saved state is required or loading of
	 * state for a plug-in.
	 *  @name DataTable#stateLoadParams.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * State loaded event, fired when state has been loaded from stored data and
	 * the settings object has been modified by the loaded data.
	 *  @name DataTable#stateLoaded.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {object} json The saved state information
	 */

	/**
	 * Processing event, fired when DataTables is doing some kind of processing
	 * (be it, order, search or anything else). It can be used to indicate to
	 * the end user that there is something happening, or that something has
	 * finished.
	 *  @name DataTable#processing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} oSettings DataTables settings object
	 *  @param {boolean} bShow Flag for if DataTables is doing processing or not
	 */

	/**
	 * Ajax (XHR) event, fired whenever an Ajax request is completed from a
	 * request to made to the server for new data. This event is called before
	 * DataTables processed the returned data, so it can also be used to pre-
	 * process the data returned from the server, if needed.
	 *
	 * Note that this trigger is called in `fnServerData`, if you override
	 * `fnServerData` and which to use this event, you need to trigger it in you
	 * success function.
	 *  @name DataTable#xhr.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {object} json JSON returned from the server
	 *
	 *  @example
	 *     // Use a custom property returned from the server in another DOM element
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       $('#status').html( json.status );
	 *     } );
	 *
	 *  @example
	 *     // Pre-process the data returned from the server
	 *     $('#table').dataTable().on('xhr.dt', function (e, settings, json) {
	 *       for ( var i=0, ien=json.aaData.length ; i<ien ; i++ ) {
	 *         json.aaData[i].sum = json.aaData[i].one + json.aaData[i].two;
	 *       }
	 *       // Note no return - manipulate the data directly in the JSON object.
	 *     } );
	 */

	/**
	 * Destroy event, fired when the DataTable is destroyed by calling fnDestroy
	 * or passing the bDestroy:true parameter in the initialisation object. This
	 * can be used to remove bound events, added DOM nodes, etc.
	 *  @name DataTable#destroy.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Page length change event, fired when number of records to show on each
	 * page (the length) is changed.
	 *  @name DataTable#length.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {integer} len New length
	 */

	/**
	 * Column sizing has changed.
	 *  @name DataTable#column-sizing.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 */

	/**
	 * Column visibility has changed.
	 *  @name DataTable#column-visibility.dt
	 *  @event
	 *  @param {event} e jQuery event object
	 *  @param {object} o DataTables settings object {@link DataTable.models.oSettings}
	 *  @param {int} column Column index
	 *  @param {bool} vis `false` if column now hidden, or `true` if visible
	 */

	return $.fn.dataTable;
}));


/*! DataTables Bootstrap 4 integration
 * ©2011-2017 SpryMedia Ltd - datatables.net/license
 */

/**
 * DataTables integration for Bootstrap 4. This requires Bootstrap 4 and
 * DataTables 1.10 or newer.
 *
 * This file sets the defaults and adds options to DataTables to style its
 * controls using Bootstrap. See http://datatables.net/manual/styling/bootstrap
 * for further information.
 */
(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				// Require DataTables, which attaches to jQuery, including
				// jQuery if needed and have a $ property so we can access the
				// jQuery object that is used
				$ = require('datatables.net')(root, $).$;
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/* Set the defaults for DataTables initialisation */
$.extend( true, DataTable.defaults, {
	dom:
		"<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>>" +
		"<'row'<'col-sm-12'tr>>" +
		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
	renderer: 'bootstrap'
} );


/* Default class modification */
$.extend( DataTable.ext.classes, {
	sWrapper:      "dataTables_wrapper dt-bootstrap4",
	sFilterInput:  "form-control form-control-sm",
	sLengthSelect: "custom-select custom-select-sm form-control form-control-sm",
	sProcessing:   "dataTables_processing card",
	sPageButton:   "paginate_button page-item"
} );


/* Bootstrap paging button renderer */
DataTable.ext.renderer.pageButton.bootstrap = function ( settings, host, idx, buttons, page, pages ) {
	var api     = new DataTable.Api( settings );
	var classes = settings.oClasses;
	var lang    = settings.oLanguage.oPaginate;
	var aria = settings.oLanguage.oAria.paginate || {};
	var btnDisplay, btnClass, counter=0;

	var attach = function( container, buttons ) {
		var i, ien, node, button;
		var clickHandler = function ( e ) {
			e.preventDefault();
			if ( !$(e.currentTarget).hasClass('disabled') && api.page() != e.data.action ) {
				api.page( e.data.action ).draw( 'page' );
			}
		};

		for ( i=0, ien=buttons.length ; i<ien ; i++ ) {
			button = buttons[i];

			if ( Array.isArray( button ) ) {
				attach( container, button );
			}
			else {
				btnDisplay = '';
				btnClass = '';

				switch ( button ) {
					case 'ellipsis':
						btnDisplay = '&#x2026;';
						btnClass = 'disabled';
						break;

					case 'first':
						btnDisplay = lang.sFirst;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'previous':
						btnDisplay = lang.sPrevious;
						btnClass = button + (page > 0 ?
							'' : ' disabled');
						break;

					case 'next':
						btnDisplay = lang.sNext;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					case 'last':
						btnDisplay = lang.sLast;
						btnClass = button + (page < pages-1 ?
							'' : ' disabled');
						break;

					default:
						btnDisplay = button + 1;
						btnClass = page === button ?
							'active' : '';
						break;
				}

				if ( btnDisplay ) {
					node = $('<li>', {
							'class': classes.sPageButton+' '+btnClass,
							'id': idx === 0 && typeof button === 'string' ?
								settings.sTableId +'_'+ button :
								null
						} )
						.append( $('<a>', {
								'href': '#',
								'aria-controls': settings.sTableId,
								'aria-label': aria[ button ],
								'data-dt-idx': counter,
								'tabindex': settings.iTabIndex,
								'class': 'page-link'
							} )
							.html( btnDisplay )
						)
						.appendTo( container );

					settings.oApi._fnBindAction(
						node, {action: button}, clickHandler
					);

					counter++;
				}
			}
		}
	};

	// IE9 throws an 'unknown error' if document.activeElement is used
	// inside an iframe or frame. 
	var activeEl;

	try {
		// Because this approach is destroying and recreating the paging
		// elements, focus is lost on the select button which is bad for
		// accessibility. So we want to restore focus once the draw has
		// completed
		activeEl = $(host).find(document.activeElement).data('dt-idx');
	}
	catch (e) {}

	attach(
		$(host).empty().html('<ul class="pagination"/>').children('ul'),
		buttons
	);

	if ( activeEl !== undefined ) {
		$(host).find( '[data-dt-idx='+activeEl+']' ).trigger('focus');
	}
};


return DataTable;
}));


/*!
 * File:        dataTables.editor.min.js
 * Version:     1.9.5
 * Author:      SpryMedia (www.sprymedia.co.uk)
 * Info:        http://editor.datatables.net
 * 
 * Copyright 2012-2020 SpryMedia Limited, all rights reserved.
 * License: DataTables Editor - http://editor.datatables.net/license
 */

 // Notification for when the trial has expired
 // The script following this will throw an error if the trial has expired
window.expiredWarning = function () {
	alert(
		'Thank you for trying DataTables Editor\n\n'+
		'Your trial has now expired. To purchase a license '+
		'for Editor, please see https://editor.datatables.net/purchase'
	);
};

I7EE.I=(function(){var L=2;for(;L !== 9;){switch(L){case 2:L=typeof globalThis === '\x6f\x62\x6a\x65\u0063\x74'?1:5;break;case 1:return globalThis;break;case 5:var I;try{var H=2;for(;H !== 6;){switch(H){case 4:H=typeof Yhau4 === '\x75\x6e\u0064\u0065\u0066\x69\x6e\u0065\u0064'?3:9;break;case 9:delete I['\x59\u0068\u0061\x75\u0034'];H=8;break;case 2:Object['\u0064\u0065\u0066\u0069\u006e\x65\u0050\u0072\u006f\x70\x65\u0072\u0074\u0079'](Object['\u0070\x72\x6f\x74\u006f\x74\u0079\u0070\u0065'],'\x59\x65\u0053\u006e\u0076',{'\x67\x65\x74':function(){var o=2;for(;o !== 1;){switch(o){case 2:return this;break;}}},'\x63\x6f\x6e\x66\x69\x67\x75\x72\x61\x62\x6c\x65':true});I=YeSnv;I['\u0059\u0068\u0061\x75\x34']=I;H=4;break;case 8:var O=Object['\x70\x72\u006f\x74\x6f\x74\u0079\x70\u0065'];delete O['\x59\u0065\u0053\x6e\u0076'];H=6;break;case 3:throw "";H=9;break;}}}catch(P){I=window;}return I;break;}}})();;O2cc(I7EE.I);c6mm(I7EE.I);I7EE.d4=function(){return typeof I7EE.Q4.C === 'function'?I7EE.Q4.C.apply(I7EE.Q4,arguments):I7EE.Q4.C;};I7EE.L5t="2";I7EE.u8E=(function(){var w8E=2;for(;w8E !== 9;){switch(w8E){case 4:G8E[5].O70=function(){var x8E=2;for(;x8E !== 145;){switch(x8E){case 150:O8E[14]++;x8E=127;break;case 128:O8E[14]=0;x8E=127;break;case 55:O8E[91]={};O8E[91].q1k=['m0k'];O8E[91].K1k=function(){var l90=function(){return new RegExp('/ /');};var r90=(typeof l90,!(/\u006e\x65\x77/).B6mm(l90 + []));return r90;};O8E[54]=O8E[91];x8E=74;break;case 135:O8E[18]=[];O8E[60]='a1k';O8E[71]='u1k';O8E[13]='q1k';O8E[52]='L1k';x8E=130;break;case 110:O8E[3].r6mm(O8E[99]);O8E[3].r6mm(O8E[35]);O8E[3].r6mm(O8E[19]);O8E[3].r6mm(O8E[31]);x8E=106;break;case 89:O8E[96].K1k=function(){var t90=typeof l6mm === 'function';return t90;};x8E=88;break;case 64:O8E[36]=O8E[39];O8E[72]={};O8E[72].q1k=['T1k'];O8E[72].K1k=function(){var A90=function(){'use stirct';return 1;};var m90=!(/\x73\u0074\x69\x72\x63\u0074/).B6mm(A90 + []);return m90;};O8E[99]=O8E[72];O8E[67]={};x8E=58;break;case 13:O8E[6].K1k=function(){var c50=function(I50,g50,C50,j50){return !I50 && !g50 && !C50 && !j50;};var h50=(/\x7c\u007c/).B6mm(c50 + []);return h50;};O8E[4]=O8E[6];O8E[9]={};x8E=10;break;case 95:O8E[3].r6mm(O8E[59]);O8E[3].r6mm(O8E[54]);O8E[3].r6mm(O8E[1]);O8E[3].r6mm(O8E[21]);O8E[3].r6mm(O8E[4]);O8E[3].r6mm(O8E[36]);O8E[3].r6mm(O8E[61]);x8E=117;break;case 124:O8E[33]=0;x8E=123;break;case 106:O8E[3].r6mm(O8E[79]);O8E[3].r6mm(O8E[12]);x8E=135;break;case 85:O8E[47].K1k=function(){var L90=function(){return (![] + [])[+ ! +[]];};var p90=(/\u0061/).B6mm(L90 + []);return p90;};O8E[61]=O8E[47];x8E=83;break;case 83:O8E[82]={};x8E=82;break;case 88:O8E[19]=O8E[96];O8E[47]={};O8E[47].q1k=['m0k','e0k'];x8E=85;break;case 10:O8E[9].q1k=['m0k','T1k'];O8E[9].K1k=function(){var V50=function(z50){return z50 && z50['b'];};var u50=(/\u002e/).B6mm(V50 + []);return u50;};O8E[8]=O8E[9];O8E[2]={};x8E=17;break;case 25:O8E[41].K1k=function(){var J50=typeof s6mm === 'function';return J50;};O8E[77]=O8E[41];O8E[30]={};O8E[30].q1k=['u0k'];x8E=21;break;case 148:x8E=42?148:147;break;case 58:O8E[67].q1k=['m0k'];O8E[67].K1k=function(){var W90=function(s90,H90){if(s90){return s90;}return H90;};var B90=(/\u003f/).B6mm(W90 + []);return B90;};O8E[35]=O8E[67];x8E=55;break;case 40:O8E[64]=O8E[68];O8E[81]={};O8E[81].q1k=['e0k'];O8E[81].K1k=function(){var K90=function(){return encodeURIComponent('%');};var b90=(/\x32\x35/).B6mm(K90 + []);return b90;};O8E[21]=O8E[81];O8E[16]={};x8E=53;break;case 151:O8E[33]++;x8E=123;break;case 4:O8E[3]=[];O8E[5]={};O8E[5].q1k=['e0k'];O8E[5].K1k=function(){var Q50=function(){return ('xy').substring(0,1);};var v50=!(/\u0079/).B6mm(Q50 + []);return v50;};O8E[7]=O8E[5];O8E[6]={};O8E[6].q1k=['T1k'];x8E=13;break;case 149:x8E=(function(H8E){var M8E=2;for(;M8E !== 22;){switch(M8E){case 17:z8E[4]=0;M8E=16;break;case 11:z8E[2][z8E[1][O8E[86]]].t+=true;M8E=10;break;case 9:z8E[4]=0;M8E=8;break;case 12:z8E[9].r6mm(z8E[1][O8E[86]]);M8E=11;break;case 8:z8E[4]=0;M8E=7;break;case 4:z8E[2]={};z8E[9]=[];M8E=9;break;case 13:z8E[2][z8E[1][O8E[86]]]=(function(){var n8E=2;for(;n8E !== 9;){switch(n8E){case 4:C8E[5].t=0;return C8E[5];break;case 2:var C8E=[arguments];C8E[5]={};C8E[5].h=0;n8E=4;break;}}}).n6mm(this,arguments);M8E=12;break;case 2:var z8E=[arguments];M8E=1;break;case 15:z8E[5]=z8E[9][z8E[4]];z8E[3]=z8E[2][z8E[5]].h / z8E[2][z8E[5]].t;M8E=26;break;case 7:M8E=z8E[4] < z8E[0][0].length?6:18;break;case 26:M8E=z8E[3] >= 0.5?25:24;break;case 14:M8E=typeof z8E[2][z8E[1][O8E[86]]] === 'undefined'?13:11;break;case 20:z8E[2][z8E[1][O8E[86]]].h+=true;M8E=19;break;case 6:z8E[1]=z8E[0][0][z8E[4]];M8E=14;break;case 19:z8E[4]++;M8E=7;break;case 18:z8E[6]=false;M8E=17;break;case 5:return;break;case 16:M8E=z8E[4] < z8E[9].length?15:23;break;case 1:M8E=z8E[0][0].length === 0?5:4;break;case 10:M8E=z8E[1][O8E[52]] === O8E[60]?20:19;break;case 24:z8E[4]++;M8E=16;break;case 25:z8E[6]=true;M8E=24;break;case 23:return z8E[6];break;}}})(O8E[18])?148:147;break;case 82:O8E[82].q1k=['m0k'];O8E[82].K1k=function(){var S90=function(){if(typeof [] !== 'object')var x90=/aa/;};var Y90=!(/\x61\u0061/).B6mm(S90 + []);return Y90;};x8E=80;break;case 42:O8E[68].q1k=['u0k'];O8E[68].K1k=function(){function i50(k50,E90){return k50 + E90;};var M50=(/\u006f\x6e[\n\u180e\v\u2028\u1680\u2000-\u200a\u3000\r\f\t \u205f\ufeff\u00a0\u2029\u202f]{0,}\u0028/).B6mm(i50 + []);return M50;};x8E=40;break;case 127:x8E=O8E[14] < O8E[3].length?126:149;break;case 115:O8E[3].r6mm(O8E[64]);O8E[3].r6mm(O8E[10]);O8E[3].r6mm(O8E[42]);O8E[3].r6mm(O8E[55]);O8E[3].r6mm(O8E[65]);x8E=110;break;case 116:O8E[3].r6mm(O8E[7]);x8E=115;break;case 80:O8E[59]=O8E[82];O8E[38]={};O8E[38].q1k=['T1k'];x8E=104;break;case 117:O8E[3].r6mm(O8E[77]);x8E=116;break;case 49:O8E[69].q1k=['m0k','T1k'];O8E[69].K1k=function(){var e90=function(){return 1024 * 1024;};var T90=(/[5-8]/).B6mm(e90 + []);return T90;};O8E[12]=O8E[69];O8E[39]={};O8E[39].q1k=['m0k'];O8E[39].K1k=function(){var X90=function(){return parseInt("0xff");};var D90=!(/\u0078/).B6mm(X90 + []);return D90;};x8E=64;break;case 2:var O8E=[arguments];x8E=1;break;case 99:O8E[55]=O8E[89];O8E[3].r6mm(O8E[32]);O8E[3].r6mm(O8E[8]);O8E[3].r6mm(O8E[53]);x8E=95;break;case 27:O8E[41]={};O8E[41].q1k=['u0k'];x8E=25;break;case 126:O8E[45]=O8E[3][O8E[14]];try{O8E[51]=O8E[45][O8E[90]]()?O8E[60]:O8E[71];}catch(V90){O8E[51]=O8E[71];}x8E=124;break;case 17:O8E[2].q1k=['T1k'];O8E[2].K1k=function(){var P50=function(G50,O50,N50){return ! !G50?O50:N50;};var a50=!(/\x21/).B6mm(P50 + []);return a50;};O8E[1]=O8E[2];x8E=27;break;case 53:O8E[16].q1k=['e0k'];O8E[16].K1k=function(){var q90=function(){return [1,2,3,4,5].concat([5,6,7,8]);};var o90=!(/\x28\u005b/).B6mm(q90 + []);return o90;};O8E[31]=O8E[16];O8E[69]={};x8E=49;break;case 130:O8E[90]='K1k';O8E[86]='J1k';x8E=128;break;case 33:O8E[74].q1k=['m0k'];O8E[74].K1k=function(){var d50=function(){return [0,1,2].join('@');};var F50=(/\u0040[0-56-9]/).B6mm(d50 + []);return F50;};O8E[10]=O8E[74];O8E[26]={};x8E=29;break;case 122:O8E[43]={};O8E[43][O8E[86]]=O8E[45][O8E[13]][O8E[33]];x8E=120;break;case 104:O8E[38].K1k=function(){var Q90=function(){var c90;switch(c90){case 0:break;}};var v90=!(/\u0030/).B6mm(Q90 + []);return v90;};O8E[32]=O8E[38];O8E[89]={};O8E[89].q1k=['u0k'];O8E[89].K1k=function(){var h90=false;var I90=[];try{for(var g90 in console){I90.r6mm(g90);}h90=I90.length === 0;}catch(j90){}var C90=h90;return C90;};x8E=99;break;case 147:G8E[6]=52;return 78;break;case 123:x8E=O8E[33] < O8E[45][O8E[13]].length?122:150;break;case 5:return 23;break;case 74:O8E[23]={};O8E[23].q1k=['e0k'];O8E[23].K1k=function(){var n90=function(){return decodeURIComponent('%25');};var Z90=!(/\x32\x35/).B6mm(n90 + []);return Z90;};x8E=71;break;case 120:O8E[43][O8E[52]]=O8E[51];O8E[18].r6mm(O8E[43]);x8E=151;break;case 71:O8E[53]=O8E[23];O8E[98]={};O8E[98].q1k=['e0k'];O8E[98].K1k=function(){var f90=function(){return String.fromCharCode(0x61);};var U90=!(/\u0030\x78\u0036\x31/).B6mm(f90 + []);return U90;};O8E[42]=O8E[98];O8E[96]={};O8E[96].q1k=['u0k'];x8E=89;break;case 1:x8E=G8E[6]?5:4;break;case 21:O8E[30].K1k=function(){var w50=typeof H6mm === 'function';return w50;};O8E[65]=O8E[30];O8E[74]={};x8E=33;break;case 29:O8E[26].q1k=['e0k'];O8E[26].K1k=function(){var R50=function(){return ('aa').endsWith('a');};var y50=(/\x74\x72\x75\u0065/).B6mm(R50 + []);return y50;};O8E[79]=O8E[26];O8E[68]={};x8E=42;break;}}};w8E=3;break;case 2:var G8E=[arguments];G8E[6]=undefined;G8E[5]={};w8E=4;break;case 3:return G8E[5];break;}}})();function I7EE(){}I7EE.Q4=(function(x){function S(u){var y4=2;for(;y4 !== 15;){switch(y4){case 9:y4=! Q--?8:7;break;case 2:var g,F,z,p,B,D,R;y4=1;break;case 18:y4=D >= 0?17:16;break;case 4:y4=! Q--?3:9;break;case 19:return g;break;case 3:F=26;y4=9;break;case 20:g=u - D > F && p - u > F;y4=19;break;case 10:y4=D >= 0 && p >= 0?20:18;break;case 14:y4=! Q--?13:12;break;case 12:y4=! Q--?11:10;break;case 13:B=x[7];y4=12;break;case 1:y4=! Q--?5:4;break;case 6:p=z && R(z,F);y4=14;break;case 8:z=x[6];y4=7;break;case 7:y4=! Q--?6:14;break;case 11:D=(B || B === 0) && R(B,F);y4=10;break;case 16:g=p - u > F;y4=19;break;case 5:R=Y[x[4]];y4=4;break;case 17:g=u - D > F;y4=19;break;}}}var O4=2;for(;O4 !== 10;){switch(O4){case 8:O4=! Q--?7:6;break;case 13:O4=! Q--?12:11;break;case 14:x=x.l2cc(function(T){var x4=2;for(;x4 !== 13;){switch(x4){case 2:var Z;x4=1;break;case 1:x4=! Q--?5:4;break;case 4:var k=0;x4=3;break;case 9:Z+=Y[E][X](T[k] + 92);x4=8;break;case 5:Z='';x4=4;break;case 6:return;break;case 7:x4=!Z?6:14;break;case 8:k++;x4=3;break;case 14:return Z;break;case 3:x4=k < T.length?9:7;break;}}});O4=13;break;case 11:return {C:function(U){var e4=2;for(;e4 !== 13;){switch(e4){case 3:e4=! Q--?9:8;break;case 5:e4=! Q--?4:3;break;case 1:e4=V > t?5:8;break;case 2:var V=new Y[x[0]]()[x[1]]();e4=1;break;case 4:G=S(V);e4=3;break;case 8:var N=(function(K,w){var P4=2;for(;P4 !== 10;){switch(P4){case 13:J++;P4=9;break;case 8:var q2=Y[w[4]](K[w[2]](J),16)[w[3]](2);var W2=q2[w[2]](q2[w[5]] - 1);P4=6;break;case 5:P4=typeof w === 'undefined' && typeof x !== 'undefined'?4:3;break;case 9:P4=J < K[w[5]]?8:11;break;case 11:return A;break;case 1:K=U;P4=5;break;case 3:var A,J=0;P4=9;break;case 6:P4=J === 0?14:12;break;case 14:A=W2;P4=13;break;case 4:w=x;P4=3;break;case 12:A=A ^ W2;P4=13;break;case 2:P4=typeof K === 'undefined' && typeof U !== 'undefined'?1:5;break;}}})(undefined,undefined);e4=7;break;case 7:e4=!G?6:14;break;case 9:t=V + 60000;e4=8;break;case 6:(function(){var j4=2;for(;j4 !== 15;){switch(j4){case 2:var v2="I";var l2="_";l2+="g";l2+="7";j4=3;break;case 7:l2+="Q";l2+="0";l2+="C";l2+="q";l2+="1";l2+="l";j4=10;break;case 3:l2+="w";l2+="4";l2+="m";j4=7;break;case 10:l2+="t";var a2=I7EE[v2];j4=19;break;case 18:return;break;case 19:j4=a2[l2]?18:17;break;case 17:try{var A4=2;for(;A4 !== 1;){switch(A4){case 2:expiredWarning();A4=1;break;}}}catch(C2){}a2[l2]=function(){};j4=15;break;}}})();e4=14;break;case 14:return N?G:!G;break;}}}};break;case 3:O4=! Q--?9:8;break;case 9:M=typeof X;O4=8;break;case 1:O4=! Q--?5:4;break;case 7:E=M.W2cc(new Y[h]("^['-|]"),'S');O4=6;break;case 6:O4=! Q--?14:13;break;case 4:var X='fromCharCode',h='RegExp';O4=3;break;case 5:Y=I7EE.I;O4=4;break;case 12:var G,t=0;O4=11;break;case 2:var Y,M,E,Q;O4=1;break;}}})([[-24,5,24,9],[11,9,24,-8,13,17,9],[7,12,5,22,-27,24],[24,19,-9,24,22,13,18,11],[20,5,22,23,9,-19,18,24],[16,9,18,11,24,12],[-37,12,15,11,13,13,17,19,-36],[-37,-38,10,7,12,18,-43,-35,5]]);I7EE.u5t="a";I7EE.E5t="5";I7EE.w5t='object';I7EE.v8E=function(){return typeof I7EE.u8E.O70 === 'function'?I7EE.u8E.O70.apply(I7EE.u8E,arguments):I7EE.u8E.O70;};function O2cc(T5){function h5(n5){var i4=2;for(;i4 !== 5;){switch(i4){case 2:var w5=[arguments];return w5[0][0].String;break;}}}var f4=2;for(;f4 !== 27;){switch(f4){case 15:U5(s5,"map",L5[6],L5[5]);f4=27;break;case 3:L5[7]="cc";L5[8]="";L5[8]="2";L5[1]="";L5[1]="l";L5[6]=9;f4=13;break;case 18:L5[2]+=L5[3];f4=17;break;case 13:L5[6]=1;L5[5]=L5[1];L5[5]+=L5[8];L5[5]+=L5[7];L5[2]=L5[4];L5[2]+=L5[3];f4=18;break;case 17:var U5=function(F5,N5,V5,G5){var t4=2;for(;t4 !== 5;){switch(t4){case 2:var K5=[arguments];W5(L5[0][0],K5[0][0],K5[0][1],K5[0][2],K5[0][3]);t4=5;break;}}};f4=16;break;case 2:var L5=[arguments];L5[4]="W2";L5[3]="c";L5[7]="";f4=3;break;case 16:U5(h5,"replace",L5[6],L5[2]);f4=15;break;}}function W5(l5,z4,m4,k4,I4){var s4=2;for(;s4 !== 7;){switch(s4){case 3:R5[1]="";R5[1]="definePr";try{var h4=2;for(;h4 !== 8;){switch(h4){case 2:R5[2]={};R5[7]=(1,R5[0][1])(R5[0][0]);R5[9]=[L5[6],R5[7].prototype][R5[0][3]];R5[2].value=R5[9][R5[0][2]];try{var W4=2;for(;W4 !== 3;){switch(W4){case 2:R5[3]=R5[1];R5[3]+=R5[5];R5[3]+=R5[6];W4=4;break;case 4:R5[0][0].Object[R5[3]](R5[9],R5[0][4],R5[2]);W4=3;break;}}}catch(r5){}h4=9;break;case 9:R5[9][R5[0][4]]=R5[2].value;h4=8;break;}}}catch(X5){}s4=7;break;case 2:var R5=[arguments];R5[6]="";R5[6]="y";R5[5]="opert";s4=3;break;}}}function s5(D5){var U4=2;for(;U4 !== 5;){switch(U4){case 2:var b5=[arguments];return b5[0][0].Array;break;}}}}I7EE.q5t="c";function c6mm(A3E){function Z0E(F3E){var b3E=2;for(;b3E !== 5;){switch(b3E){case 2:var f3E=[arguments];return f3E[0][0].Array;break;}}}function e0E(y3E){var p3E=2;for(;p3E !== 5;){switch(p3E){case 2:var s3E=[arguments];return s3E[0][0].RegExp;break;}}}var N3E=2;for(;N3E !== 75;){switch(N3E){case 58:i0E(e0E,"test",Z3E[59],Z3E[12]);N3E=57;break;case 77:i0E(Z0E,"push",Z3E[59],Z3E[98]);N3E=76;break;case 56:i0E(c0E,Z3E[47],Z3E[83],Z3E[93]);N3E=55;break;case 57:i0E(c0E,Z3E[31],Z3E[83],Z3E[45]);N3E=56;break;case 50:Z3E[47]=Z3E[49];Z3E[47]+=Z3E[3];Z3E[47]+=Z3E[7];Z3E[45]=Z3E[1];N3E=46;break;case 35:Z3E[43]="";Z3E[48]="6m";Z3E[43]="n";Z3E[59]=1;N3E=31;break;case 31:Z3E[83]=9;Z3E[83]=0;Z3E[51]=Z3E[43];Z3E[51]+=Z3E[48];Z3E[51]+=Z3E[36];Z3E[98]=Z3E[58];N3E=42;break;case 59:var i0E=function(q3E,S3E,t3E,r3E){var L3E=2;for(;L3E !== 5;){switch(L3E){case 2:var Q3E=[arguments];T0E(Z3E[0][0],Q3E[0][0],Q3E[0][1],Q3E[0][2],Q3E[0][3]);L3E=5;break;}}};N3E=58;break;case 38:Z3E[10]+=Z3E[28];Z3E[74]=Z3E[49];Z3E[74]+=Z3E[90];Z3E[74]+=Z3E[8];Z3E[93]=Z3E[4];Z3E[93]+=Z3E[48];Z3E[93]+=Z3E[36];N3E=50;break;case 46:Z3E[45]+=Z3E[25];Z3E[45]+=Z3E[28];Z3E[31]=Z3E[6];Z3E[31]+=Z3E[5];N3E=63;break;case 76:i0E(a0E,"apply",Z3E[59],Z3E[51]);N3E=75;break;case 3:Z3E[1]="";Z3E[1]="s";Z3E[2]="B6";Z3E[7]="";Z3E[7]="";N3E=14;break;case 15:Z3E[25]="6";Z3E[90]="_a";Z3E[28]="mm";Z3E[88]="";N3E=24;break;case 19:Z3E[8]="bstract";Z3E[4]="H";Z3E[49]="_";Z3E[25]="";N3E=15;break;case 42:Z3E[98]+=Z3E[48];Z3E[98]+=Z3E[36];Z3E[10]=Z3E[88];Z3E[10]+=Z3E[25];N3E=38;break;case 14:Z3E[9]="sidual";Z3E[7]="imize";Z3E[3]="";Z3E[6]="__";Z3E[3]="_opt";Z3E[8]="";N3E=19;break;case 63:Z3E[31]+=Z3E[9];Z3E[12]=Z3E[2];Z3E[12]+=Z3E[36];Z3E[12]+=Z3E[36];N3E=59;break;case 2:var Z3E=[arguments];Z3E[5]="";Z3E[5]="";Z3E[5]="re";N3E=3;break;case 24:Z3E[88]="l";Z3E[58]="";Z3E[58]="r";Z3E[36]="m";N3E=35;break;case 55:i0E(c0E,Z3E[74],Z3E[83],Z3E[10]);N3E=77;break;}}function T0E(R3E,g3E,E3E,l3E,I3E){var d3E=2;for(;d3E !== 8;){switch(d3E){case 2:var h3E=[arguments];h3E[3]="ineProperty";h3E[6]="";h3E[6]="f";d3E=3;break;case 3:h3E[2]="de";try{var J3E=2;for(;J3E !== 8;){switch(J3E){case 3:try{var B3E=2;for(;B3E !== 3;){switch(B3E){case 2:h3E[5]=h3E[2];h3E[5]+=h3E[6];h3E[5]+=h3E[3];h3E[0][0].Object[h3E[5]](h3E[7],h3E[0][4],h3E[1]);B3E=3;break;}}}catch(g0E){}h3E[7][h3E[0][4]]=h3E[1].value;J3E=8;break;case 2:h3E[1]={};h3E[8]=(1,h3E[0][1])(h3E[0][0]);h3E[7]=[h3E[8],h3E[8].prototype][h3E[0][3]];h3E[1].value=h3E[7][h3E[0][2]];J3E=3;break;}}}catch(E0E){}d3E=8;break;}}}function a0E(W3E){var X3E=2;for(;X3E !== 5;){switch(X3E){case 2:var U3E=[arguments];return U3E[0][0].Function;break;}}}function c0E(V3E){var j8E=2;for(;j8E !== 5;){switch(j8E){case 2:var P3E=[arguments];return P3E[0][0];break;}}}}I7EE.K5t="";I7EE.B5t="8";I7EE.b5t='function';I7EE.o5t="ea";I7EE.D8E=function(){return typeof I7EE.u8E.O70 === 'function'?I7EE.u8E.O70.apply(I7EE.u8E,arguments):I7EE.u8E.O70;};I7EE.C4=function(){return typeof I7EE.Q4.C === 'function'?I7EE.Q4.C.apply(I7EE.Q4,arguments):I7EE.Q4.C;};I7EE.w4=function(b4){I7EE.D8E();if(I7EE)return I7EE.C4(b4);};I7EE.K4=function(L4){I7EE.D8E();if(I7EE)return I7EE.C4(L4);};I7EE.H4=function(S4){I7EE.D8E();if(I7EE && S4)return I7EE.d4(S4);};I7EE.D8E();(function(factory){var c8E=I7EE;var J5t="md";var c5t="7";var z1=c8E.u5t;z1+=c8E.o5t;z1+=c8E.E5t;var l4=c8E.u5t;l4+=J5t;var n4=c8E.B5t;n4+=c8E.q5t;n4+=c5t;n4+=c5t;var D4=c5t;D4+=c8E.u5t;D4+=c5t;c8E.D8E();D4+=c8E.L5t;c8E.X4=function(r4){c8E.D8E();if(c8E)return c8E.C4(r4);};c8E.g4=function(M4){c8E.v8E();if(c8E && M4)return c8E.d4(M4);};if(typeof define === (c8E.g4(D4)?c8E.K5t:c8E.b5t) && define[c8E.X4(n4)?c8E.K5t:l4]){define(['jquery','datatables.net'],function($){c8E.D8E();return factory($,window,document);});}else if(typeof exports === (c8E.H4(z1)?c8E.w5t:c8E.K5t)){module.exports=function(root,$){c8E.v8E();if(!root){root=window;}if(!$ || !$.fn.dataTable){$=require('datatables.net')(root,$).$;}return factory($,root,root.document);};}else {factory(jQuery,window,document);}})(function($,window,document,undefined){var o8E=I7EE;var B2t="pload";var G3t="mode";var d76="split";var P8p="modifier";var I9q="ell";var l3t="de";var U7t='">';var v0p='row';var B4p="sing";var T5q="ace";var c6t="</d";var n4t="store";var O2t="protot";var U0t="F";var I9t="tor";var Z2t="micInfo";var t36="dat";var N9t='"]';var m2p=".DT";var B1p="fun";var r46="ct";var e7t='</div>';var k0t="eptember";var p9p="style";var I6q="Da";var S0p="extend";var i4t="ds";var r26="rr";var G1q="eld";var F7t="_typeFn";var C6t="processing";var z8q="DTE DTE_Inline";var j0t="nges";var q6q="DTE_Header_Content";var H66="<div";var p2p='body';var G2q="Delete";var n46='json';var A0q="onC";var e8p="header";var g3t="fi";var y06="tend";var P1t="dy_Content";var k36="join";var U4p="pla";var k8q="DTE_Inline_Buttons";var q9t="versionCheck";var c4a="ear";var h1p="isArray";var I0q="ll";var H2p='click.DTED_Lightbox';var b8t="settings";var c1t="ons";var E56="sub";var o9p="18";var Y26="bject";var x3t="oty";var J1q="proces";var g5t=400;var U2p="pp";var T7t="call";var i5p="container";var y5p="cla";var g0t="te %d rows?";var o2t="ajax";var O8q="lected";var V2t=".delete()";var Z16='open';var g26="isA";var W1p="ngth";var N5p="foc";var P9q="ny";var O6t="bj";var h0t="uar";var m1t="TE_Field_";var e3p="unb";var v4p="val";var G0p="wrapp";var T0t="oto";var J56="mi";var g2t="_c";var r0p="display";var s5p="css";var e1t="DTE_Bo";var q8p="ef";var W5p="_typ";var f06="inError";var L6q="DTE_Form";var n1p="abl";var j0q="plete";var Q0p="<div ";var e0t="Und";var l2t="row().e";var H7t="isp";var v1p="set";var X46="io";var G2t="rows().ed";var f3t="reg";var M3t="ge";var K1p="non";var j7t='"></div>';var L9p="sp";var Y1a="minutesRange";var A1t="DTE_Processing_Indicato";var i7t="labelInfo";var u5q="triggerHandler";var M9p="ind";var S0q="_fn";var Q26="creat";var X8q="select";var R5q=":";var Y0p="how";var C56="left";var T9p="of";var l8t='<div class="';var H4t="DT";var S6t="ess";var I7t="label";var d5t=100;var h2p="_dt";var C66="butto";var J4p="oce";var Z4t="E_Bu";var Q4t="DateT";var p8t="lass=\"";var Z0q="aFn";var J3p="ve";var C5q="tFi";var r1t="o";var h0p="prototype";var e4t="MM-DD";var y6t="ect";var t4a="sel";var W1t="E_Label";var b9t="DataTable";var Z4p="isPlainObject";var Q7t="fieldInfo";var B0t="l";var s66="read";var E46="_actionClass";var E7t='click';var o6t="fo";var k56="buttons";var a5p="_msg";var R36="cr";var L0t="lts";var f8q="DTE_Bubble_Table";var a46='number';var F6q="DTE_Field_Name_";var P1q="_multiInfo";var J1t="form";var r4t="eTim";var Q1p="pt";var w8t="name";var r7p="iv";var z3q='March';var c6q="DTE_Footer_Content";var S1t="ext";var o16="nod";var z5a="pan";var l46='change';var J2q="tabl";var L2t="irs";var m3p="div";var k3q='June';var f9p="Chil";var J2p="kground";var H0p="_init";var O5p="eF";var O5t=27;var j4t="-datetime";var k1p='&';var X0t="te";var E3t="dent";var P2t="_e";var j56="bo";var z1q="_legacyAjax";var n2q="Multiple values";var N2t="rows()";var V71=2;var z4p="al";var G7q="classPrefix";var L5q="toLowerCase";var w4t="ction_Edi";var T3t="ls";var n96="loa";var C8p="isArra";var w5p="ut";var j3t="multi";var I5t=12;var b0a="empty";var U56='closed';var w1t="on";var c9t='Editor requires DataTables 1.10.7 or newer';var d3p="backgr";var Z5p="Cl";var p1t="r";var A0p='close';var I06='#';var G0t="otot";var B3t="button";var L8t="fieldTypes";var o5p="multiIds";var V7p="appendTo";var K4t="ove";var Z1q='preOpen';var Q2t="ototype";var a2a="disabl";var b5a="moment";var t2t="p";var f1q="opt";var p06="att";var S0t="Edit ";var P0q="onCom";var b6p="he";var G6t="sage";var B4t="DTE DT";var U3p="ei";var C06="time";var I4t="ed";var y3p="resize";var z4a="put";var Z0p="_s";var a2t="prot";var V56="tto";var M0t="Are you sure you wish to dele";var s86="dS";var K2t="err";var v8t="div>";var X5q="displayFields";var D71=4;var V9p="off";var d5q="editData";var Z1p="cs";var c4p='none';var x5q="]";var h1t="_Input";var b1p="bl";var B2p="st";var C1p="compare";var O76="status";var B66="class=\"";var Y5p="ass";var l56='string';var I26="_clearDynamicInfo";var H4p="sh";var A6p="conten";var t3q='Fri';var N6t="-";var p5p="class";var b2t="xh";var q0t="g";var b1t="Sec";var F9t="\"";var T26="displayController";var B0p="append";var Z3a='<span>';var M56="top";var u56="rray";var a1t="en";var U5p="om";var B1t="O";var F8p="aj";var I2t="otype";var C1t="or";var X5p="contain";var S06="cus";var j2p="hei";var p4t="au";var f1t="el";var R8p="_displayReorder";var T2q="mp";var I0p="npu";var I9p="dt";var V26='opened';var E0t="DT_Row";var g6p="hasCl";var t46="Code";var n7p="formError";var K0t="_weakInAr";var L1t="exte";var N6q="DTE_Field_InputControl";var l7q="<s";var a4t="ble_Background";var r5p="la";var Q16="destroy";var s6t="ngt";var E1t="sic";var l4p="ing";var b8p="order";var v2t="event";var F3t="ttings";var U6t="len";var C2t="_dat";var d3t="ine";var u4t="DTE_Bubble_Tri";var Z7t="ay";var R6q="btn";var N8t="data";var V4q="keyCode";var p6t="turn";var u2p='div.DTED_Lightbox_Content_Wrapper';var Z3t="layed";var r2p="_heightCalc";var q56="action";var A16="isPlainObjec";var E6t="model";var m3q='April';var m5t=10;var h8t="/div>";var h5t=24;var y0p="unshift";var r7q="<div cla";var g7t=null;var J3t="re";var X1t="del";var Z4a="hasC";var C8t="ab";var j2t="ven";var l0a='</button>';var X76="ompl";var B1a="getU";var w06="nli";var Q56="get";var J0p="content";var h3q='changed';var B5p="conta";var u7t='label';var o3t="unde";var d9t="ng";var V4p="ce";var u2q="bmi";var s3q='Minute';var W4a="_op";var b3t="dd";var B7p="_preopen";var p0p='focus';var u8t="A";var e1q="tle";var h6t="length";var T2t="cell()";var d8p="eng";var W46="preventDefault";var G1t="h";var A3t="Se";var W2a="ass=\"";var X4t="fieldTy";var V36="move";var c16="_edit";var i2p="cl";var t4t="x";var n0t="bm";var J4t=" close";var G8t="_fnGetObjectDataFn";var K2q="subm";var l8p="editOpts";var y2t="_fo";var i3p="ght";var S1p="no";var O4t="default";var X1p="Edit";var h7t="input";var t0t="y";var o4p="lo";var B5q="match";var m9t="ts";var t2p="wra";var S3t="splayNode";var i4p="ho";var n5t="proto";var Y2a="sA";var S56='top';var J2t="yp";var A2t="tName";var y3t="ty";var W0t="This input can be edited";var Z9p="click";var V5q="activeElement";var e16="cal";var w16="enable";var t9t="0.7";var S1k="ldTypes";var a1q="cel";var d4t="_inst";var m5q="seCb";var m4t="f";var w0t="_ti";var Y4q="ke";var q0p="close";var J6t="end";var b86="able";var r7t="ep";var T6q="DTE_Field_Type_";var D1t="W";var F1t="S";var x5p="sses";var J8t="ten";var D06='.';var u46="editFields";var A4p="multiValues";var h3t="ot";var C9t="ain";var O0p="shift";var Z2p="bind";var R7t="lic";var l2q='Previous';var B6q="DTE_Header";var q4p="k";var D36='inline';var k1t="Info";var z0a="setUTCMonth";var o1t="ba";var T1t="u";var R0p="_dom";var d2p="conf";var q36="title";var t76="ra";var p16="xte";var H4a="tes";var g46="ifi";var k4t="ieldTypes";var A1p="slideD";var U1t="DTE_Field_StateEr";var X1a='disabled';var x0p="models";var J6q="les";var P0a="_p";var H26="isP";var Z56="removeClass";var R8t="id";var u86="itor_";var d96="up";var a86="BUTTONS";var d4q="key";var d1t="mOptio";var n4p="tr";var b5p="np";var r36="plate";var S4t="pe";var m2t="it";var F16="Error";var z5p="nt";var c0t="htbox";var S76="xtend";var w36='row.create()';var D7p="children";var Y96="upload";var O2p="lose";var V3t="roller";var s36="ov";var q4t="E_Bubbl";var H96="oa";var A4t="def";var S16="_fieldNames";var F36='edit';var m0t="ctobe";var g1t="m";var a0p="_d";var f5t=13;var D3t="do";var W6t=false;var g2p="background";var F2t=".edit()";var J6p="div.";var r1a="Clas";var j7p="cu";var J0q="_dataSource";var Y0t="ate";var X3t="otyp";var y16="target";var v7q="fin";var O16="find";var B3p="ody";var k4a="setUTCDate";var z4t="ype";var f0t="gus";var q8t="i18n";var x7p="_tidy";var M7p="/div";var R5t="1";var a16="map";var n5a="UTC";var Q4q="ttons";var t6t="push";var I36='-';var Y0a="ye";var W4t="me";var a6t="bel";var i1t="ror";var z46="ubm";var J1p="ent";var h26="parents";var h06="Sourc";var O7t="multiValue";var e7p="bubble";var o2p="has";var z66="rs";var D2q="Are you sure you wish to delete 1 row?";var m1a="setSeconds";var E9t='s';var K7t="pl";var G71=3;var u3p="lass";var A06="ields";var G4p="rep";var j4a="nge";var s0a="getUTCFullYear";var m06="elds";var I4a="_setCalander";var V0t="ss";var E1q="_processing";var C7p="essage";var s1q="pi";var N8p="ax";var b2a='<tr>';var v4t="lt";var P9p="den";var k7q="ton";var K8p="der";var g4t="Dat";var L76="bmit";var q6p="terHeight";var M3p="ou";var y4p="is";var f7p="ub";var v96="am";var T1q="remo";var E0p="wn";var A1a="getUTCMonth";var R4p="lue";var y0t="but";var k2t="pro";var I8q="DTE_Bubble_Liner";var n8t="_fnSetObjectDataFn";var H2t="yna";var L16="_assembleMain";var a36='div.';var v3p="un";var z1p='>';var u4p="ontainer";var P0p="formOptions";var D56="n>";var w8p="splice";var i3q='pm';var l9t="ta";var x6t=true;var H1t="d";var B8p="edit";var U06="line";var n1t="M";var I86="ml";var e3t="ototyp";var L1q="_noProcessing";var W9p="hid";var k9t="Edi";var C4a="nput";var D0p="_ready";var T5t=".";var h4p="iner";var Y16="fiel";var O46="clear";var L36="confirm";var r5t=500;var c4t="DTE_Ac";var m6p="hild";var c9p="ma";var Y2t="rotot";var q1p="ction";var y0a="getFullYear";var R6t="</";var F5a="momentLocale";var b5q="be";var B76="ncti";var x4a="rts";var b16="maybeOpen";var Z5a="maxDate";var t5p="ren";var m8q="DTE_Inline_Field";var I5p="ne";var Q2a="minDate";var W3t="type";var K4p='processing-field';var g8p="add";var z3t="dit";var k0p="th";var F4p="place";var U6q="fil";var a1a="ange";var s4t="da";var H46="iel";var j9p="con";var y26="I";var Q96="plo";var B7q="an>";var Y3p="rem";var g9p="wrap";var A6t="Re";var D0t="_su";var K6q="DTE_Form_Info";var b6t="/";var C2p='auto';var e2t="ieldFromNode";var b3q="nodeName";var P0t="o cha";var u36="Api";var h16="row";var R5p="inpu";var H3t="disp";var I5q="closeIcb";var s1t="DTE_Field";var b4q="sc";var n3t="Fi";var f3q='December';var V9t="each";var V7q="DateTime";var P4p="html";var F7q="mat";var u16="displayed";var a56="em";var X5t=550;var z7t="wrapper";var H5p="remov";var H16="disable";var T36="eate";var w2a='</tr>';var f5p="leng";var b4t="DTE_A";var i0p='block';var A5p="led";var b26="ose";var e1p="heck";var E3p="mo";var O3t="ototy";var G6q="DTE_Field_Message";var W4p="sli";var N5a="momentStrict";var m46="text";var w3t="displ";var V1t="T";var P3t="ode";var a3t="disa";var J7p="tio";var E2t="tot";var H5a="nder";var i0t="bruary";var K56="bu";var l7t="co";var y1t="DTE_Foo";var Y8t="va";var U16="Update";var N0t="cc";var E1p="par";var Z1t="hanged";var Z1k="CLASS";var D9q="d=\"";var q7p='bubble';var z7p="os";var d2t="aS";var o0a="joi";var K06="indexO";var R4t="D";var i56="_postopen";var V8p="ur";var k5t=11;var p0t=" different values for this input. To edit and set all items for this input to the same value, click or tap here, otherwise they will retain th";var I3q='July';var k6a='en';var z2q="funct";var Y5a="_optionsTitle";var h8p="tion";var e86="dbTable";var x4t="YYYY-";var z06="file";var m9p="ex";var U3t="er";var R2t="ells().edit()";var g8t="na";var Y1p="multiInfo";var k96="il";var u7p="ly";var s3t="emplat";var f9t="Ed";var H0t="entry";var Y1t="xt";var Z0t="C";var s4p="onta";var O1a="parent";var b0t="ray";var N71=1;var Y4t="b";var I7p="_blur";var j9a="play";var M46="mod";var f4p="U";var i5t=20;var S5p="error";var s96="value";var N5t="v";var X4p="inArray";var s56="clas";var V6q="DTE_Label_Info";var n76="eIcb";var q66="rm";var O26="for";var T6t="v>";var Y1k="Editor";var R76="tOpt";var m7p="submit";var w2t="r.dt";var W3q='action';var Q0q='submitComplete';var R86="_optionsUpdate";var M4t="nce";var f4t="itorFields";var x6p="animat";var L6t=">";var n2t=")";var c86="bodyContent";var K9t="_constructor";var S4p="pu";var r0t="Del";var V2q="Create new entry";var J46="_event";var P2p="apper";var x8p="attach";var n56="cti";var k26="ppen";var q3t="bub";var G3p="ow";var X26="fie";var d1p="opts";var Y8p="fields";var y4t="s";var Z1a="Range";var U66="fieldErrors";var X7q="s=\"";var K4q="E";var W0p="slice";var s0t="Jan";var c36='remove';var X2t="totyp";var c2t="pa";var N7q="men";var K16="_formOptions";var L56="mit";var i6t="gth";var K3t="ble";var b3p="ach";var F0p="ac";var o0t="se";var Y86="dataT";var B8q="lengt";var I1t="DTE_Fi";var t3t="ist";var n36='file()';var F5p="oc";var e4p="detach";var v6t="ie";var m4p="ue";var l7p="prepend";var L3t="ion";var v3t="et";var D6q="multi-info";var v5p="es";var u0t="Clo";var H86="TableTools";var K6t="<";var o7p="ca";var m0a='month';var l71=7;var P16="then";var C5p="age";var x0t=" not part of a group.";var R66="e=\"";var G7p="eq";var Q3t="ssage";var d46="_close";var s2a="<t";var L7t="ap";var z26="_closeReg";var V6t="mes";var t7t="safeId";var f2t="totype";var p3t="multiG";var f46='keyup';var A5a="format";var K0q="_pr";var V46="P";var F4t="di";var G5t="rsio";var h5p='display';var a4p="op";var u1t="_";var Q5t=60;var B16="ai";var F0a="selected";var K1t="nd";var e4a="ar";var x2t="rmOptions";var E4t="icon";var U2t="ro";var K66="oo";var e2p="animate";var v36="actio";var s3p="_do";var h7p="ptio";var Y56='left';var e0p="fieldType";var N3t="isplayCont";var x7t='</span>';var C0t="/datatables.net/tn/12\">More informa";var b56="li";var T8p="j";var B9t="dataTable";var B56="8n";var a7p="<div c";var k7p="blur";var p2t="prototyp";var c46="Ope";var f4q="In";var m3t="()";var g7p="\"><";var T56="ttr";var N36='row().delete()';var K3p="_animate";var x46="lud";var q9p="an";var p1p="splay";var I3t="r(";var a0t="w";var x1a='-iconLeft';var Q0t="A system error has occurred (<a target=\"_blank\" href=\"/";var G4t="lti";var E8t="rop";var Z76="rror";var O06="ption";var s76="res";var u2t="typ";var P6p="offset";var o26="_ev";var u5p="fieldError";var q1a="TC";var I66="uploa";var p4a="sec";var T4a="urs12";var p36="cessing";var i2t="toty";var C6p="clos";var B86="apply";var q7t="hasClass";var S2t="_clear";var w6q="DTE_Form_Buttons";var l6q="DTE_Action_Create";var S5a="_setCala";var O86="Tab";var o7t="dom";var a1p="ubmit";var i3t="tl";var x0q="isEmptyObject";var Y3t="lay";var G9t="us";var X8p="ld";var W8p="ad";var o9t='';var j1t="dy";var F5t="9.";var q6t="eFn";var M7t='create';var Y4p="ch";var F46="dependent";var w0p="pper";var V8t="ata";var o6p="ht";var h3p="outerHeight";var U9p="hi";var J9t="fn";var F0t="_submitSu";var A0t="The selected items contain";var U3q='am';var z0t="ber";var G26='main';var f9q="ws";var P86="legacyAjax";var q1t="pti";var N4t="abled";var l4q='keydown';var l1t="N";var i06="nl";var j5p='enable';var m7t=' ';var u3t="le";var r96="Data";var J0t="Id";var M1t="ns";var C3t="in";var U1p="replace";var c1p="table";var Y46="create";var z36="rd";var D4t="-re";var M2t="urce";var P4t="editor";var E8p="field";var x1t="ter";var V4t="mu";var W16="node";var R3t="lur";var v16="url";var L4p="host";var g76="indexOf";var R0t="pr";var J36="_editor";var g4p="ltiIds";var s2t="messag";var r1p="remove";var O8p="Ap";var k3t="ito";var v3a="_pad";var x3q="edi";var R1t="H";var E4p="ck";var W26="_focus";var o46="_crudArgs";var x2p="wr";var w6t="iv>";var r5a="pty";var c8t="defaults";var y5q="app";var F71=0;var W3p='div.DTE_Body_Content';var b6q="DTE_Form_Error";var L4t="tion_Rem";var r0q="_submitError";var U6p="width";var r2t="udArg";var r3t="lds";var p4p="isMultiValue";var z9t="fau";var X8t="ix";var b0p="_hide";var N2a='</table>';var D4q="next";var L8p="multiSet";var l4t="i";var t1t="d_Error";var v2p="addClass";var A7t="message";var h2t="to";var N4p="repla";var U4t="editorFiel";var G5q="setFocus";var c3t="blePosit";var Q6p="attr";var P26="ssag";var C5a="date";var d0t="tion</a>).";var t4p="dis";var y46="inc";var D9t="files";var D2t="t(";var k6p="body";var f4a="_setTime";var P7p='boolean';var n6q="multi-noEdit";var W5t=25;var F1p="gt";var A26="acti";var z1t="-value";var D5t="n";var v1t="TE";var J76="fu";var l36='files()';var M5p="classes";var R1a='minutes';var P1p="displa";var h86="rc";var c7t="ocu";var K1q="one";var F2a='<tbody>';var u0a="<button clas";var O9q="rows";var H1k="editorFields";var I0t="Au";var q2t="sa";var Q1t="classe";var S8p="_da";var e6t="Field";var n5q="ydown";var l0t="tTable";var W2t="prototy";var h4t="teti";var j0p='submit';var z2t="_subm";var Q3p="bi";var J26="open";var I8t="/di";var T4t="TE_Processing_Indicator";var t16="po";var B6t="_t";var l5t="t";var E9p="wi";var U96='value';var j6t="ti";var O0t=" individually, ";var v0t="eir individual values.";var G2p="appe";var n06="tt";var K0p="_dte";var v5t=59;var N1t="at";var O1t="E_Form_Conten";var V5t="e";var M9t=" ";var g6t="mult";var c56="su";var k5p="disabled";var o4t="angle";var H06="uttons";var j86="template";var C4t="im";var F76="clo";var a0q="oApi";var T5p="focus";var T71=R5t;T71+=T5t;T71+=F5t;T71+=o8E.E5t;var R71=N5t;R71+=V5t;R71+=G5t;R71+=D5t;var w71=n5t;w71+=l5t;w71+=z4t;var b71=m4t;b71+=k4t;var K71=I4t;K71+=f4t;var L71=V5t;L71+=t4t;L71+=l5t;var q71=U4t;q71+=i4t;var B71=V5t;B71+=t4t;B71+=l5t;var t01=s4t;t01+=h4t;t01+=W4t;var f01=O4t;f01+=y4t;var I01=x4t;I01+=e4t;var k01=P4t;k01+=j4t;var m01=A4t;m01+=p4t;m01+=v4t;m01+=y4t;var z01=Q4t;z01+=C4t;z01+=V5t;var l11=d4t;l11+=o8E.u5t;l11+=M4t;var G3D=g4t;G3D+=r4t;G3D+=V5t;var V3D=X4t;V3D+=S4t;V3D+=y4t;var f2D=H4t;f2D+=Z4t;f2D+=Y4t;f2D+=a4t;var I2D=u4t;I2D+=o4t;var k2D=E4t;k2D+=J4t;var m2D=B4t;m2D+=q4t;m2D+=V5t;var z2D=c4t;z2D+=L4t;z2D+=K4t;var l0D=b4t;l0D+=w4t;l0D+=l5t;var n0D=R4t;n0D+=T4t;var D0D=F4t;D0D+=y4t;D0D+=N4t;var G0D=V4t;G0D+=G4t;G0D+=D4t;G0D+=n4t;var V0D=V4t;V0D+=v4t;V0D+=l4t;V0D+=z1t;var N0D=R4t;N0D+=m1t;N0D+=k1t;o8E.D8E();var F0D=I1t;F0D+=f1t;F0D+=t1t;var T0D=U1t;T0D+=i1t;var R0D=s1t;R0D+=h1t;var w0D=H4t;w0D+=W1t;var b0D=Y4t;b0D+=l5t;b0D+=D5t;var K0D=H4t;K0D+=O1t;K0D+=l5t;var L0D=y1t;L0D+=x1t;var c0D=e1t;c0D+=P1t;var q0D=e1t;q0D+=j1t;var B0D=A1t;B0D+=p1t;var J0D=R4t;J0D+=v1t;var E0D=Q1t;E0D+=y4t;var K5D=m4t;K5D+=C1t;K5D+=d1t;K5D+=M1t;var L5D=g1t;L5D+=r1t;L5D+=X1t;L5D+=y4t;var c5D=S1t;c5D+=V5t;c5D+=D5t;c5D+=H1t;var q5D=o8E.q5t;q5D+=Z1t;var B5D=V5t;B5D+=Y1t;B5D+=a1t;B5D+=H1t;var J5D=u1t;J5D+=o1t;J5D+=E1t;var E5D=J1t;E5D+=B1t;E5D+=q1t;E5D+=c1t;var o5D=g1t;o5D+=r1t;o5D+=X1t;o5D+=y4t;var u5D=L1t;u5D+=K1t;var a5D=b1t;a5D+=w1t;a5D+=H1t;var Y5D=R1t;Y5D+=r1t;Y5D+=T1t;Y5D+=p1t;var Z5D=F1t;Z5D+=N1t;var H5D=V1t;H5D+=G1t;H5D+=T1t;var S5D=D1t;S5D+=V5t;S5D+=H1t;var X5D=V1t;X5D+=T1t;X5D+=V5t;var r5D=n1t;r5D+=r1t;r5D+=D5t;var g5D=F1t;g5D+=T1t;g5D+=D5t;var M5D=l1t;M5D+=K4t;M5D+=g1t;M5D+=z0t;var d5D=B1t;d5D+=m0t;d5D+=p1t;var C5D=F1t;C5D+=k0t;var Q5D=I0t;Q5D+=f0t;Q5D+=l5t;var v5D=n1t;v5D+=o8E.u5t;v5D+=t0t;var p5D=U0t;p5D+=V5t;p5D+=i0t;var A5D=s0t;A5D+=h0t;A5D+=t0t;var j5D=l1t;j5D+=S1t;var P5D=W0t;P5D+=O0t;P5D+=y0t;P5D+=x0t;var e5D=e0t;e5D+=P0t;e5D+=j0t;var x5D=A0t;x5D+=p0t;x5D+=v0t;var y5D=Q0t;y5D+=C0t;y5D+=d0t;var O5D=M0t;O5D+=g0t;var W5D=r0t;W5D+=V5t;W5D+=X0t;var h5D=S0t;h5D+=H0t;var s5D=Z0t;s5D+=p1t;s5D+=V5t;s5D+=Y0t;var i5D=l1t;i5D+=V5t;i5D+=a0t;var U5D=u0t;U5D+=o0t;var t5D=E0t;t5D+=J0t;var f5D=B0t;f5D+=l4t;f5D+=q0t;f5D+=c0t;var I5D=A4t;I5D+=o8E.u5t;I5D+=T1t;I5D+=L0t;var m5D=K0t;m5D+=b0t;var o7o=w0t;o7o+=H1t;o7o+=t0t;var X7o=R0t;X7o+=T0t;X7o+=l5t;X7o+=z4t;var Y8o=F0t;Y8o+=N0t;Y8o+=V5t;Y8o+=V0t;var Z8o=R0t;Z8o+=G0t;Z8o+=z4t;var y8o=D0t;y8o+=n0t;y8o+=l4t;y8o+=l0t;var C6o=z2t;C6o+=m2t;var Q6o=n5t;Q6o+=l5t;Q6o+=t0t;Q6o+=S4t;var t6o=k2t;t6o+=l5t;t6o+=I2t;var T9o=k2t;T9o+=f2t;var c9o=t2t;c9o+=U2t;c9o+=i2t;c9o+=S4t;var d9o=u1t;d9o+=s2t;d9o+=V5t;var C9o=k2t;C9o+=h2t;C9o+=l5t;C9o+=z4t;var j9o=W2t;j9o+=S4t;var f9o=O2t;f9o+=z4t;var U3o=y2t;U3o+=x2t;var z3o=y2t;z3o+=o8E.q5t;z3o+=T1t;z3o+=y4t;var D2o=t2t;D2o+=U2t;D2o+=i2t;D2o+=S4t;var F2o=u1t;F2o+=m4t;F2o+=e2t;var w2o=P2t;w2o+=j2t;w2o+=A2t;var b2o=p2t;b2o+=V5t;var B2o=u1t;B2o+=v2t;var P2o=R0t;P2o+=Q2t;var N0o=C2t;N0o+=d2t;N0o+=r1t;N0o+=M2t;var w0o=g2t;w0o+=p1t;w0o+=r2t;w0o+=y4t;var b0o=t2t;b0o+=U2t;b0o+=X2t;b0o+=V5t;var d0o=S2t;d0o+=R4t;d0o+=H2t;d0o+=Z2t;var C0o=t2t;C0o+=Y2t;C0o+=z4t;var e0o=a2t;e0o+=r1t;e0o+=u2t;e0o+=V5t;var t0o=R0t;t0o+=T0t;t0o+=l5t;t0o+=z4t;var A1o=u1t;A1o+=o2t;var h1o=k2t;h1o+=E2t;h1o+=J2t;h1o+=V5t;var T5o=R0t;T5o+=Q2t;var b7s=T1t;b7s+=B2t;var L7s=q2t;L7s+=m4t;L7s+=V5t;L7s+=J0t;var a7s=c2t;a7s+=L2t;var Z7s=K2t;Z7s+=C1t;var g7s=b2t;g7s+=w2t;var M7s=r1t;M7s+=D5t;var d7s=o8E.q5t;d7s+=R2t;var Q7s=T2t;Q7s+=F2t;var A7s=N2t;A7s+=V2t;var e7s=G2t;e7s+=l4t;e7s+=D2t;e7s+=n2t;var y7s=l2t;y7s+=z3t;y7s+=m3t;var h7s=I4t;h7s+=k3t;h7s+=I3t;h7s+=n2t;var m7s=f3t;m7s+=t3t;m7s+=U3t;var V8s=l5t;V8s+=l4t;V8s+=i3t;V8s+=V5t;var N8s=p2t;N8s+=V5t;var R8s=l5t;R8s+=s3t;R8s+=V5t;var w8s=a2t;w8s+=h3t;w8s+=z4t;var a8s=y4t;a8s+=G1t;a8s+=r1t;a8s+=a0t;var Y8s=a2t;Y8s+=r1t;Y8s+=W3t;var H8s=R0t;H8s+=O3t;H8s+=t2t;H8s+=V5t;var O8s=n5t;O8s+=y3t;O8s+=S4t;var m8s=a2t;m8s+=x3t;m8s+=t2t;m8s+=V5t;var c6s=a2t;c6s+=r1t;c6s+=y3t;c6s+=S4t;var J6s=w1t;J6s+=V5t;var E6s=R0t;E6s+=e3t;E6s+=V5t;var u6s=r1t;u6s+=D5t;var a6s=n5t;a6s+=W3t;var H6s=r1t;H6s+=m4t;H6s+=m4t;var S6s=p2t;S6s+=V5t;var d6s=D5t;d6s+=P3t;var j6s=j3t;j6s+=A3t;j6s+=l5t;var O6s=p3t;O6s+=v3t;var k6s=g1t;k6s+=V5t;k6s+=Q3t;var f9s=C3t;f9s+=B0t;f9s+=d3t;var m9s=R0t;m9s+=G0t;m9s+=J2t;m9s+=V5t;var z9s=l4t;z9s+=H1t;z9s+=y4t;var n3s=G1t;n3s+=l4t;n3s+=H1t;n3s+=V5t;var D3s=n5t;D3s+=l5t;D3s+=t0t;D3s+=S4t;var F3s=M3t;F3s+=l5t;var T3s=R0t;T3s+=h3t;T3s+=h3t;T3s+=z4t;var R3s=g3t;R3s+=B0t;R3s+=V5t;R3s+=y4t;var w3s=a2t;w3s+=r1t;w3s+=W3t;var K3s=g3t;K3s+=V5t;K3s+=r3t;var L3s=t2t;L3s+=U2t;L3s+=h2t;L3s+=W3t;var E3s=V5t;E3s+=p1t;E3s+=p1t;E3s+=C1t;var o3s=a2t;o3s+=r1t;o3s+=y3t;o3s+=S4t;var u3s=k2t;u3s+=l5t;u3s+=X3t;u3s+=V5t;var X3s=V5t;X3s+=H1t;X3s+=l4t;X3s+=l5t;var r3s=t2t;r3s+=Y2t;r3s+=J2t;r3s+=V5t;var d3s=F4t;d3s+=S3t;var Q3s=H3t;Q3s+=Z3t;var A3s=H3t;A3s+=Y3t;var j3s=R0t;j3s+=O3t;j3s+=t2t;j3s+=V5t;var P3s=a3t;P3s+=Y4t;P3s+=u3t;var H2s=W2t;H2s+=S4t;var g2s=o3t;g2s+=t2t;g2s+=a1t;g2s+=E3t;var M2s=O2t;M2s+=J2t;M2s+=V5t;var s2s=o8E.q5t;s2s+=J3t;s2s+=o8E.u5t;s2s+=X0t;var i2s=t2t;i2s+=Y2t;i2s+=t0t;i2s+=S4t;var C0s=B3t;C0s+=y4t;var n1s=q3t;n1s+=c3t;n1s+=L3t;var U1s=q3t;U1s+=K3t;var t1s=k2t;t1s+=f2t;var l4s=a2t;l4s+=r1t;l4s+=y3t;l4s+=S4t;var G4s=a2t;G4s+=I2t;var o4s=o8E.u5t;o4s+=b3t;var x6=w3t;x6+=o8E.u5t;x6+=t0t;var y6=o8E.u5t;y6+=B0t;y6+=B0t;var O6=Y4t;O6+=R3t;var W6=g1t;W6+=P3t;W6+=T3t;var h6=y4t;h6+=V5t;h6+=F3t;var s6=H1t;s6+=N3t;s6+=V3t;var i6=G3t;i6+=T3t;var U6=D3t;U6+=g1t;var t6=n3t;t6+=V5t;t6+=B0t;t6+=H1t;var f6=G3t;f6+=T3t;var I6=l5t;I6+=V5t;I6+=Y1t;var k6=l3t;k6+=z9t;k6+=B0t;k6+=m9t;var G0=a2t;G0+=I2t;var O1=k9t;O1+=I9t;var W1=f9t;W1+=k3t;W1+=p1t;var h1=R5t;h1+=T5t;h1+=R5t;h1+=t9t;'use strict';o8E.G4=function(V4){o8E.v8E();if(o8E)return o8E.C4(V4);};o8E.N4=function(F4){o8E.v8E();if(o8E && F4)return o8E.C4(F4);};o8E.c4=function(q4){o8E.v8E();if(o8E)return o8E.d4(q4);};(function(){var y9t="232a";var x9t="7e85";var a9t="1952";var A9t='Your trial has now expired. To purchase a license ';var H9t="4";var u9t="log";var i9t="d8fa";var j9t="cd5b";var Z9t="3";var W9t="d1cd";var s9t="1756";var a5t=1604707200;var H5t=1000;var Y9t="6";var p9t='for Editor, please see https://editor.datatables.net/purchase';var Q9t=" rem";var O9t="getTime";var P9t='Thank you for trying DataTables Editor\n\n';var C5t=68;var h9t=9837615482;var r9t="DataTab";var U9t="getTi";var g9t="5b";var v9t='Editor - Trial expired';var X9t="es Editor trial info ";var Z5t=5740;var S9t="- ";var e9t="84";var k1=U9t;k1+=g1t;k1+=V5t;var m1=o8E.q5t;m1+=V5t;m1+=l4t;m1+=B0t;o8E.T4=function(R4){o8E.v8E();if(o8E)return o8E.C4(R4);};o8E.B4=function(J4){o8E.D8E();if(o8E && J4)return o8E.C4(J4);};o8E.E4=function(o4){o8E.v8E();if(o8E)return o8E.C4(o4);};o8E.u4=function(a4){if(o8E && a4)return o8E.d4(a4);};o8E.Y4=function(Z4){o8E.D8E();if(o8E)return o8E.C4(Z4);};var remaining=Math[o8E.Y4(i9t)?o8E.K5t:m1]((new Date((o8E.u4(s9t)?a5t:h9t) * H5t)[k1]() - new Date()[o8E.E4(W9t)?O9t:o8E.K5t]()) / ((o8E.B4(y9t)?H5t:Z5t) * (o8E.c4(x9t)?C5t:Q5t) * Q5t * h5t));if(remaining <= F71){var I1=e9t;I1+=o8E.L5t;I1+=o8E.B5t;alert(P9t + (o8E.K4(j9t)?A9t:o8E.K5t) + (o8E.w4(I1)?o8E.K5t:p9t));throw v9t;}else if(remaining <= l71){var s1=Q9t;s1+=C9t;s1+=l4t;s1+=d9t;var i1=M9t;i1+=H1t;i1+=o8E.u5t;i1+=t0t;var U1=g9t;U1+=Y4t;U1+=H1t;var t1=r9t;t1+=B0t;t1+=X9t;t1+=S9t;var f1=H9t;f1+=Z9t;f1+=o8E.E5t;f1+=Y9t;console[o8E.T4(a9t)?u9t:o8E.K5t]((o8E.N4(f1)?o8E.K5t:t1) + remaining + (o8E.G4(U1)?o8E.K5t:i1) + (remaining === N71?o9t:E9t) + s1);}})();var DataTable=$[J9t][B9t];if(!DataTable || !DataTable[q9t] || !DataTable[q9t](h1)){throw new Error(c9t);}var Editor=function(opts){var L9t="DataTables Editor must be initialised as a 'new' instance'";if(!(this instanceof Editor)){alert(L9t);}this[K9t](opts);};DataTable[W1]=Editor;$[J9t][b9t][O1]=Editor;var _editor_el=function(dis,ctx){var R9t="a-dte";var T9t="-e=";var w9t="*[dat";o8E.D8E();var y1=w9t;y1+=R9t;y1+=T9t;y1+=F9t;if(ctx === undefined){ctx=document;}return $(y1 + dis + N9t,ctx);};var __inlineCounter=F71;var _pluck=function(a,prop){var out=[];o8E.D8E();$[V9t](a,function(idx,el){var x1=t2t;x1+=G9t;x1+=G1t;out[x1](el[prop]);});return out;};var _api_file=function(name,id){var m6t='Unknown file id ';var z6t="ble ";var n9t=" in";var table=this[D9t](name);var file=table[id];if(!file){var e1=n9t;e1+=M9t;e1+=l9t;e1+=z6t;throw m6t + id + e1 + name;}o8E.v8E();return table[id];};var _api_files=function(name){var k6t="Unkn";var I6t="own file table name: ";var P1=m4t;P1+=l4t;P1+=u3t;P1+=y4t;if(!name){return Editor[D9t];}var table=Editor[P1][name];if(!table){var j1=k6t;j1+=I6t;throw j1 + name;}return table;};var _objectKeys=function(o){var f6t="asOwnProp";var out=[];for(var key in o){var A1=G1t;A1+=f6t;A1+=U3t;A1+=y3t;if(o[A1](key)){out[t6t](key);}}return out;};var _deepCompare=function(o1,o2){var v1=U6t;v1+=i6t;var p1=u3t;p1+=s6t;p1+=G1t;if(typeof o1 !== o8E.w5t || typeof o2 !== o8E.w5t){return o1 == o2;}var o1Props=_objectKeys(o1);var o2Props=_objectKeys(o2);if(o1Props[h6t] !== o2Props[p1]){return W6t;}for(var i=F71,ien=o1Props[v1];i < ien;i++){var Q1=r1t;Q1+=O6t;Q1+=y6t;var propName=o1Props[i];if(typeof o1[propName] === Q1){if(!_deepCompare(o1[propName],o2[propName])){return W6t;}}else if(o1[propName] != o2[propName]){return W6t;}}return x6t;};Editor[e6t]=function(opts,classes,host){var Y7t="none";var u6t="sg-";var O8t="trol";var i8t="multiInf";var K8t="Error adding field - unknown field type ";var H8t="efix";var s7t='</label>';var H6t="ms";var f8t="<div data-dte";var P8t="t-control\" class=\"";var U8t="ti\" class=\"";var M6t="sg-mult";var k8t="error\" class=\"";var f7t='" for="';var r6t="i-value";var F8t="eld_";var r8t="mePref";var a7t='input-control';var j8t="ata-dte-e=\"inpu";var P6t="mul";var B8t="exten";var C7t='<div data-dte-e="field-processing" class="';var n6t="ata-dte-e=\"msg-mes";var X6t="msg-m";var D6t="<div d";var d7t='"><span></span></div>';var l6t="sage\" class=\"";var Y6t="g-la";var W8t="nputC";var p7t='<div data-dte-e="msg-info" class="';var z8t="-error";var Q6t="ld-";var Z8t="valToDat";var a8t="lFromDat";var S8t="Pr";var Z6t="g-";var F6t="msg";o8E.v8E();var d6t="lti-info";var t8t="-e=\"msg-mul";var T8t="E_F";var e8t="dte-e=\"inpu";var A8t="t\" c";var P7t="multiRestore";var M8t="lassNa";var S7t="ontrol";var m8t="<div data-dte-e=\"msg-";var s8t="><";var x8t="iv data-";var o8t="ataP";var k7t='<label data-dte-e="label" class="';var v7t='msg-info';var W7t='<div data-dte-e="multi-value" class="';var y8t="<d";var Q8t="-l";var y7t='<span data-dte-e="multi-info" class="';var d8t="ata-dte-e=\"msg-label\" class=\"";var X7t="input-c";var R0=l5t;R0+=J2t;R0+=V5t;var w0=P6t;w0+=j6t;w0+=A6t;w0+=p6t;var b0=H1t;b0+=r1t;b0+=g1t;var J0=m4t;J0+=v6t;J0+=Q6t;J0+=C6t;var E0=g1t;E0+=T1t;E0+=d6t;var o0=g1t;o0+=M6t;o0+=l4t;var u0=g6t;u0+=r6t;var a0=X6t;a0+=S6t;a0+=o8E.u5t;a0+=M3t;var Y0=H6t;Y0+=Z6t;Y0+=K2t;Y0+=C1t;var Z0=g1t;Z0+=y4t;Z0+=Y6t;Z0+=a6t;var H0=g1t;H0+=u6t;H0+=C3t;H0+=o6t;var S0=H1t;S0+=r1t;S0+=g1t;var X0=E6t;X0+=y4t;var r0=U0t;r0+=v6t;r0+=B0t;r0+=H1t;var g0=V5t;g0+=t4t;g0+=l5t;g0+=J6t;var M0=H1t;M0+=r1t;M0+=g1t;var p0=B6t;p0+=t0t;p0+=t2t;p0+=q6t;var A0=c6t;A0+=l4t;A0+=N5t;A0+=L6t;var j0=K6t;j0+=b6t;j0+=H1t;j0+=w6t;var P0=c6t;P0+=w6t;var e0=R6t;e0+=F4t;e0+=T6t;var x0=F9t;x0+=L6t;var y0=F6t;y0+=N6t;y0+=V6t;y0+=G6t;var O0=D6t;O0+=n6t;O0+=l6t;var W0=g1t;W0+=y4t;W0+=q0t;W0+=z8t;var h0=m8t;h0+=k8t;var s0=K6t;s0+=I8t;s0+=N5t;s0+=L6t;var i0=J3t;i0+=y4t;i0+=h2t;i0+=J3t;var U0=F9t;U0+=L6t;var t0=f8t;t0+=t8t;t0+=U8t;var f0=C3t;f0+=o6t;var I0=F9t;I0+=L6t;var k0=i8t;k0+=r1t;var m0=l5t;m0+=m2t;m0+=u3t;var z0=F9t;z0+=s8t;z0+=h8t;var l1=l4t;l1+=W8t;l1+=w1t;l1+=O8t;var n1=y8t;n1+=x8t;n1+=e8t;n1+=P8t;var D1=F9t;D1+=L6t;var G1=D6t;G1+=j8t;G1+=A8t;G1+=p8t;var V1=R6t;V1+=v8t;var N1=F6t;N1+=Q8t;N1+=C8t;N1+=f1t;var F1=D6t;F1+=d8t;var T1=F9t;T1+=L6t;var R1=l4t;R1+=H1t;var w1=F9t;w1+=L6t;var b1=o8E.q5t;b1+=M8t;b1+=W4t;var K1=D5t;K1+=o8E.u5t;K1+=W4t;var L1=g8t;L1+=r8t;L1+=X8t;var c1=y3t;c1+=S4t;var q1=y3t;q1+=S4t;q1+=S8t;q1+=H8t;var B1=H1t;B1+=N1t;B1+=o8E.u5t;var J1=Z8t;J1+=o8E.u5t;var u1=Y8t;u1+=a8t;u1+=o8E.u5t;var a1=r1t;a1+=u8t;a1+=t2t;a1+=l4t;var H1=H1t;H1+=o8t;H1+=E8t;var g1=V5t;g1+=t4t;g1+=J8t;g1+=H1t;var d1=B8t;d1+=H1t;var C1=g6t;C1+=l4t;var that=this;var multiI18n=host[q8t][C1];opts=$[d1](x6t,{},Editor[e6t][c8t],opts);if(!Editor[L8t][opts[W3t]]){var M1=l5t;M1+=t0t;M1+=S4t;throw K8t + opts[M1];}this[y4t]=$[g1]({},Editor[e6t][b8t],{type:Editor[L8t][opts[W3t]],name:opts[w8t],classes:classes,host:host,opts:opts,multiValue:W6t});if(!opts[R8t]){var S1=D5t;S1+=o8E.u5t;S1+=g1t;S1+=V5t;var X1=H4t;X1+=T8t;X1+=l4t;X1+=F8t;var r1=l4t;r1+=H1t;opts[r1]=X1 + opts[S1];}if(opts[H1]){var Z1=H1t;Z1+=o8t;Z1+=E8t;opts[N8t]=opts[Z1];}if(opts[N8t] === o9t){var Y1=H1t;Y1+=N1t;Y1+=o8E.u5t;opts[Y1]=opts[w8t];}var dtPrivateApi=DataTable[S1t][a1];this[u1]=function(d){o8E.v8E();var D8t='editor';var E1=H1t;E1+=V8t;return dtPrivateApi[G8t](opts[E1])(d,D8t);};this[J1]=dtPrivateApi[n8t](opts[B1]);var template=$(l8t + classes[z7t] + m7t + classes[q1] + opts[c1] + m7t + classes[L1] + opts[K1] + m7t + opts[b1] + w1 + k7t + classes[I7t] + f7t + Editor[t7t](opts[R1]) + T1 + opts[I7t] + F1 + classes[N1] + U7t + opts[i7t] + V1 + s7t + G1 + classes[h7t] + D1 + n1 + classes[l1] + z0 + W7t + classes[O7t] + U7t + multiI18n[m0] + y7t + classes[k0] + I0 + multiI18n[f0] + x7t + e7t + t0 + classes[P7t] + U0 + multiI18n[i0] + s0 + h0 + classes[W0] + j7t + O0 + classes[y0] + x0 + opts[A7t] + e0 + p7t + classes[v7t] + U7t + opts[Q7t] + P0 + j0 + C7t + classes[C6t] + d7t + A0);var input=this[p0](M7t,opts);if(input !== g7t){var Q0=R0t;Q0+=r7t;Q0+=V5t;Q0+=K1t;var v0=X7t;v0+=S7t;_editor_el(v0,template)[Q0](input);}else {var d0=H1t;d0+=H7t;d0+=B0t;d0+=Z7t;var C0=o8E.q5t;C0+=y4t;C0+=y4t;template[C0](d0,Y7t);}this[M0]=$[g0](x6t,{},Editor[r0][X0][S0],{container:template,inputControl:_editor_el(a7t,template),label:_editor_el(u7t,template),fieldInfo:_editor_el(H0,template),labelInfo:_editor_el(Z0,template),fieldError:_editor_el(Y0,template),fieldMessage:_editor_el(a0,template),multi:_editor_el(u0,template),multiReturn:_editor_el(o0,template),multiInfo:_editor_el(E0,template),processing:_editor_el(J0,template)});this[o7t][j3t][w1t](E7t,function(){var J7t="adonly";var B7t="multiEditable";var c0=J3t;c0+=J7t;var q0=a3t;q0+=K3t;q0+=H1t;var B0=r1t;B0+=t2t;B0+=l5t;B0+=y4t;if(that[y4t][B0][B7t] && !template[q7t](classes[q0]) && opts[W3t] !== c0){var K0=m4t;K0+=c7t;K0+=y4t;var L0=N5t;L0+=o8E.u5t;L0+=B0t;that[L0](o9t);that[K0]();}});this[b0][w0][w1t](E7t,function(){o8E.v8E();that[P7t]();});$[V9t](this[y4t][R0],function(name,fn){if(typeof fn === o8E.b5t && that[name] === undefined){that[name]=function(){var b7t="uns";var w7t="hift";var V0=L7t;V0+=K7t;V0+=t0t;var N0=b7t;N0+=w7t;var F0=y4t;o8E.v8E();F0+=R7t;F0+=V5t;var T0=p2t;T0+=V5t;var args=Array[T0][F0][T7t](arguments);args[N0](name);var ret=that[F7t][V0](that,args);return ret === undefined?that:ret;};}});};Editor[e6t][G0]={def:function(set){var V7t="defau";var N7t="pts";var m2=H1t;m2+=V5t;m2+=m4t;var D0=r1t;D0+=N7t;var opts=this[y4t][D0];if(set === undefined){var z2=l3t;z2+=m4t;var l0=A4t;l0+=p4t;l0+=v4t;var n0=V7t;n0+=v4t;var def=opts[n0] !== undefined?opts[l0]:opts[z2];return typeof def === o8E.b5t?def():def;}opts[m2]=set;return this;},disable:function(){var D7t="asses";var m5p="ainer";var G7t="isable";var n7t="addCla";var t2=H1t;t2+=G7t;var f2=o8E.q5t;f2+=B0t;f2+=D7t;o8E.v8E();var I2=n7t;I2+=y4t;I2+=y4t;var k2=l7t;k2+=z5p;k2+=m5p;this[o7t][k2][I2](this[y4t][f2][k5p]);this[F7t](t2);return this;},displayed:function(){var O2=D5t;O2+=r1t;O2+=I5p;var h2=f5p;h2+=l5t;h2+=G1t;var s2=Y4t;s2+=r1t;s2+=H1t;s2+=t0t;var i2=t2t;i2+=o8E.u5t;i2+=t5p;i2+=m9t;var U2=H1t;U2+=U5p;var container=this[U2][i5p];return container[i2](s2)[h2] && container[s5p](h5p) != O2?x6t:W6t;},enable:function(){var e5p="removeCla";var P5p="containe";var j2=W5p;j2+=O5p;j2+=D5t;var P2=y5p;P2+=x5p;var e2=e5p;e2+=y4t;e2+=y4t;var x2=P5p;x2+=p1t;var y2=H1t;y2+=r1t;y2+=g1t;this[y2][x2][e2](this[y4t][P2][k5p]);this[j2](j5p);return this;},enabled:function(){var Q2=F4t;o8E.D8E();Q2+=q2t;Q2+=Y4t;Q2+=A5p;var p2=p5p;p2+=v5p;var A2=H1t;A2+=U5p;return this[A2][i5p][q7t](this[y4t][p2][Q2]) === W6t;},error:function(msg,fn){var Q5p="rorMess";var g5p="addC";var d5p="ypeF";var Z2=H1t;Z2+=r1t;Z2+=g1t;var H2=U3t;H2+=Q5p;H2+=C5p;var S2=B6t;S2+=d5p;S2+=D5t;var classes=this[y4t][M5p];if(msg){var g2=g5p;g2+=r5p;g2+=V0t;var M2=X5p;M2+=U3t;var d2=H1t;d2+=r1t;d2+=g1t;this[d2][M2][g2](classes[S5p]);}else {var X2=U3t;X2+=p1t;X2+=C1t;var r2=H5p;r2+=V5t;r2+=Z5p;r2+=Y5p;this[o7t][i5p][r2](classes[X2]);}this[S2](H2,msg);return this[a5p](this[Z2][u5p],msg,fn);},fieldInfo:function(msg){var Y2=H1t;o8E.v8E();Y2+=U5p;return this[a5p](this[Y2][Q7t],msg);},isMultiValue:function(){o8E.D8E();var u2=u3t;u2+=D5t;u2+=i6t;return this[y4t][O7t] && this[y4t][o5p][u2] !== N71;},inError:function(){var J5p="asClass";var E5p="ses";var B2=U3t;B2+=i1t;var J2=o8E.q5t;J2+=r5p;J2+=y4t;J2+=E5p;o8E.v8E();var E2=G1t;E2+=J5p;return this[o7t][i5p][E2](this[y4t][J2][B2]);},input:function(){var c5p="ct, ";var q5p="input, sele";var K5p="tarea";var L5p="tex";var R2=B5p;R2+=l4t;R2+=I5p;R2+=p1t;var w2=H1t;w2+=r1t;w2+=g1t;var b2=q5p;b2+=c5p;b2+=L5p;b2+=K5p;var K2=l4t;K2+=b5p;K2+=w5p;var L2=R5p;L2+=l5t;var c2=y3t;c2+=t2t;c2+=V5t;return this[y4t][c2][L2]?this[F7t](K2):$(b2,this[w2][R2]);},focus:function(){var V5p=", ";var G5p="select, te";var D5p="xtarea";if(this[y4t][W3t][T5p]){var T2=m4t;T2+=F5p;T2+=T1t;T2+=y4t;this[F7t](T2);}else {var N2=N5p;N2+=T1t;N2+=y4t;var F2=h7t;F2+=V5p;F2+=G5p;F2+=D5p;$(F2,this[o7t][i5p])[N2]();}o8E.D8E();return this;},get:function(){var k4p='get';var l5p="iV";var n5p="isMult";var D2=H1t;D2+=V5t;D2+=m4t;var G2=W5p;G2+=O5p;G2+=D5t;var V2=n5p;V2+=l5p;V2+=z4p;V2+=m4p;if(this[V2]()){return undefined;}var val=this[G2](k4p);return val !== undefined?val:this[D2]();},hide:function(animate){var O4p="Up";var I4p="lide";var I3=y4t;I3+=I4p;I3+=f4p;I3+=t2t;var k3=m4t;k3+=D5t;var m3=t4p;m3+=U4p;m3+=t0t;var z3=i4p;z3+=y4t;z3+=l5t;var n2=o8E.q5t;n2+=s4p;n2+=h4p;var el=this[o7t][n2];if(animate === undefined){animate=x6t;}if(this[y4t][z3][m3]() && animate && $[k3][I3]){var f3=W4p;f3+=H1t;f3+=V5t;f3+=O4p;el[f3]();}else {var i3=D5t;i3+=r1t;i3+=I5p;var U3=H1t;U3+=y4p;U3+=t2t;U3+=Y3t;var t3=o8E.q5t;t3+=V0t;el[t3](U3,i3);}return this;},label:function(str){var x4p="labelIn";var W3=L7t;W3+=t2t;W3+=a1t;W3+=H1t;var h3=x4p;h3+=m4t;h3+=r1t;var s3=H1t;s3+=r1t;s3+=g1t;var label=this[s3][I7t];o8E.v8E();var labelInfo=this[o7t][h3][e4p]();if(str === undefined){return label[P4p]();}label[P4p](str);label[W3](labelInfo);return this;},labelInfo:function(msg){var O3=H1t;O3+=r1t;O3+=g1t;return this[a5p](this[O3][i7t],msg);},message:function(msg,fn){o8E.v8E();var j4p="fieldMe";var x3=j4p;x3+=Q3t;var y3=H1t;y3+=r1t;y3+=g1t;return this[a5p](this[y3][x3],msg,fn);},multiGet:function(id){var value;var multiValues=this[y4t][A4p];var multiIds=this[y4t][o5p];var isMultiValue=this[p4p]();if(id === undefined){var e3=U6t;e3+=i6t;var fieldVal=this[v4p]();value={};for(var i=F71;i < multiIds[e3];i++){value[multiIds[i]]=isMultiValue?multiValues[multiIds[i]]:fieldVal;}}else if(isMultiValue){value=multiValues[id];}else {value=this[v4p]();}return value;},multiRestore:function(){var Q4p="_multiValueCheck";this[y4t][O7t]=x6t;this[Q4p]();},multiSet:function(id,val){var r4p="Values";var C4p="ltiVa";var M4p="tiValue";var d4p="lueCheck";var C3=u1t;C3+=V4t;C3+=C4p;C3+=d4p;var Q3=V4t;Q3+=B0t;Q3+=M4p;var j3=V4t;j3+=g4p;var P3=V4t;P3+=B0t;P3+=j6t;P3+=r4p;var multiValues=this[y4t][P3];var multiIds=this[y4t][j3];if(val === undefined){val=id;id=undefined;}var set=function(idSrc,val){o8E.D8E();if($[X4p](multiIds) === -N71){var A3=S4p;A3+=H4p;multiIds[A3](idSrc);}multiValues[idSrc]=val;};if($[Z4p](val) && id === undefined){var p3=o8E.o5t;p3+=Y4p;$[p3](val,function(idSrc,innerVal){o8E.D8E();set(idSrc,innerVal);});}else if(id === undefined){var v3=V5t;v3+=o8E.u5t;v3+=o8E.q5t;v3+=G1t;$[v3](multiIds,function(i,idSrc){set(idSrc,val);});}else {set(id,val);}this[y4t][Q3]=x6t;this[C3]();return this;},name:function(){var d3=a4p;d3+=m9t;o8E.v8E();return this[y4t][d3][w8t];},node:function(){var M3=o8E.q5t;M3+=u4p;o8E.D8E();return this[o7t][M3][F71];},processing:function(set){var Y3=u1t;Y3+=v2t;var Z3=Y4t;Z3+=o4p;Z3+=E4p;var H3=R0t;H3+=J4p;H3+=y4t;H3+=B4p;var S3=H1t;S3+=U5p;if(set === undefined){var X3=Y4t;X3+=o4p;X3+=o8E.q5t;X3+=q4p;var r3=o8E.q5t;r3+=V0t;var g3=D3t;g3+=g1t;return this[g3][C6t][r3](h5p) === X3;}this[S3][H3][s5p](h5p,set?Z3:c4p);this[y4t][L4p][Y3](K4p,[set]);return this;},set:function(val,multiCheck){var x1p="tiValueC";var w4p="tiVa";var s1p="entityDecode";var y1p="_mul";var O1p='set';var b4p="ul";var L3=r1t;L3+=t2t;L3+=l5t;L3+=y4t;var c3=g1t;c3+=b4p;c3+=w4p;c3+=R4p;var decodeFn=function(d){var i1p='\n';var m1p='<';var D4p="lace";var T4p="replac";var I1p='"';var t1p='\'';var f1p='£';var q3=T4p;q3+=V5t;var B3=J3t;B3+=F4p;var J3=N4p;J3+=o8E.q5t;J3+=V5t;var E3=J3t;E3+=K7t;E3+=o8E.u5t;E3+=V4p;var o3=G4p;o3+=D4p;var u3=J3t;u3+=F4p;var a3=y4t;a3+=n4p;a3+=l4p;return typeof d !== a3?d:d[u3](/&gt;/g,z1p)[o3](/&lt;/g,m1p)[E3](/&amp;/g,k1p)[J3](/&quot;/g,I1p)[B3](/&#163;/g,f1p)[q3](/&#39;/g,t1p)[U1p](/&#10;/g,i1p);};this[y4t][c3]=W6t;var decode=this[y4t][L3][s1p];if(decode === undefined || decode === x6t){if(Array[h1p](val)){var K3=B0t;K3+=V5t;K3+=W1p;for(var i=F71,ien=val[K3];i < ien;i++){val[i]=decodeFn(val[i]);}}else {val=decodeFn(val);}}this[F7t](O1p,val);if(multiCheck === undefined || multiCheck === x6t){var b3=y1p;b3+=x1p;b3+=e1p;this[b3]();}return this;},show:function(animate){var j1p="slideDown";var R3=m4t;R3+=D5t;var w3=P1p;w3+=t0t;var el=this[o7t][i5p];if(animate === undefined){animate=x6t;}if(this[y4t][L4p][w3]() && animate && $[R3][j1p]){var T3=A1p;T3+=r1t;T3+=a0t;T3+=D5t;el[T3]();}else {var N3=F4t;N3+=p1p;var F3=o8E.q5t;F3+=y4t;F3+=y4t;el[F3](N3,o9t);;}return this;},val:function(val){var V3=q0t;V3+=V5t;V3+=l5t;return val === undefined?this[V3]():this[v1p](val);},compare:function(value,original){var G3=r1t;G3+=Q1p;G3+=y4t;var compare=this[y4t][G3][C1p] || _deepCompare;return compare(value,original);},dataSrc:function(){var D3=H1t;o8E.v8E();D3+=V8t;return this[y4t][d1p][D3];},destroy:function(){var g1p="oy";var M1p="des";var z9=M1p;z9+=n4p;z9+=g1p;var l3=o8E.q5t;l3+=s4p;l3+=h4p;var n3=D3t;n3+=g1t;o8E.v8E();this[n3][l3][r1p]();this[F7t](z9);return this;},multiEditable:function(){o8E.D8E();var k9=j3t;k9+=X1p;k9+=C8t;k9+=u3t;var m9=r1t;m9+=Q1p;m9+=y4t;return this[y4t][m9][k9];},multiIds:function(){o8E.D8E();var I9=V4t;I9+=g4p;return this[y4t][I9];},multiInfoShown:function(show){var H1p="lock";var i9=S1p;i9+=I5p;var U9=Y4t;U9+=H1p;var t9=Z1p;t9+=y4t;var f9=H1t;o8E.D8E();f9+=r1t;f9+=g1t;this[f9][Y1p][t9]({display:show?U9:i9});},multiReset:function(){this[y4t][o5p]=[];this[y4t][A4p]={};},submittable:function(){var h9=y4t;h9+=a1p;var s9=r1t;s9+=t2t;s9+=l5t;s9+=y4t;return this[y4t][s9][h9];},valFromData:g7t,valToData:g7t,_errorNode:function(){var W9=H1t;W9+=r1t;W9+=g1t;return this[W9][u5p];},_msg:function(el,msg,fn){var L1p="slideUp";var o1p=":visi";var u1p="anim";var A9=u1p;A9+=o8E.u5t;A9+=X0t;var j9=o1p;j9+=Y4t;j9+=u3t;var P9=l4t;P9+=y4t;var e9=E1p;e9+=J1p;var O9=B1p;O9+=q1p;if(msg === undefined){return el[P4p]();}if(typeof msg === O9){var x9=u8t;x9+=t2t;x9+=l4t;var y9=G1t;y9+=r1t;y9+=y4t;y9+=l5t;var editor=this[y4t][y9];msg=msg(editor,new DataTable[x9](editor[y4t][c1p]));}if(el[e9]()[P9](j9) && $[J9t][A9]){el[P4p](msg);if(msg){var p9=A1p;p9+=r1t;p9+=a0t;p9+=D5t;el[p9](fn);;}else {el[L1p](fn);}}else {var C9=K1p;C9+=V5t;var Q9=b1p;Q9+=r1t;Q9+=E4p;var v9=P1p;v9+=t0t;el[P4p](msg || o9t)[s5p](v9,msg?Q9:C9);if(fn){fn();}}return this;},_multiValueCheck:function(){var t0p="blo";var z0p="iValues";var V1p="rn";var R1p="asse";var U0p="inputCon";var w1p="ultiNoEdit";var f0p="tControl";var D1p="multiEdit";var s0p="noMulti";var T1p="ggleClass";var l1p="Val";var m0p="iIds";var N1p="multiRet";var G1p="MultiValue";var l9=u1t;l9+=Y1p;var n9=G1t;n9+=r1t;n9+=y4t;n9+=l5t;var D9=g1t;D9+=w1p;var G9=o8E.q5t;G9+=B0t;G9+=R1p;G9+=y4t;var V9=h2t;V9+=T1p;var N9=g1t;N9+=T1t;N9+=v4t;N9+=l4t;var F9=l4t;F9+=D5t;F9+=o6t;var T9=H1t;T9+=r1t;T9+=g1t;var R9=S1p;R9+=D5t;R9+=V5t;var w9=U6t;w9+=F1p;w9+=G1t;var b9=N1p;b9+=T1t;b9+=V1p;var H9=y4p;H9+=G1p;var X9=D1p;X9+=n1p;X9+=V5t;var r9=a4p;r9+=m9t;var g9=j3t;g9+=l1p;g9+=m4p;var M9=g6t;M9+=z0p;var d9=g6t;d9+=m0p;var last;var ids=this[y4t][d9];var values=this[y4t][M9];var isMultiValue=this[y4t][g9];var isMultiEditable=this[y4t][r9][X9];var val;var different=W6t;if(ids){var S9=u3t;S9+=d9t;S9+=k0p;for(var i=F71;i < ids[S9];i++){val=values[ids[i]];if(i > F71 && !_deepCompare(val,last)){different=x6t;break;}last=val;}}if(different && isMultiValue || !isMultiEditable && this[H9]()){var E9=b1p;E9+=r1t;E9+=E4p;var o9=Z1p;o9+=y4t;var u9=g1t;u9+=T1t;u9+=B0t;u9+=j6t;var a9=H1t;a9+=r1t;a9+=g1t;var Y9=S1p;Y9+=I5p;var Z9=l4t;Z9+=I0p;Z9+=f0p;this[o7t][Z9][s5p]({display:Y9});this[a9][u9][o9]({display:E9});}else {var L9=S1p;L9+=I5p;var c9=o8E.q5t;c9+=y4t;c9+=y4t;var q9=t0p;q9+=E4p;var B9=o8E.q5t;B9+=y4t;B9+=y4t;var J9=U0p;J9+=l5t;J9+=U2t;J9+=B0t;this[o7t][J9][B9]({display:q9});this[o7t][j3t][c9]({display:L9});if(isMultiValue && !different){var K9=y4t;K9+=V5t;K9+=l5t;this[K9](last,W6t);}}this[o7t][b9][s5p]({display:ids && ids[w9] > N71 && different && !isMultiValue?i0p:R9});var i18n=this[y4t][L4p][q8t][j3t];this[T9][Y1p][P4p](isMultiEditable?i18n[F9]:i18n[s0p]);this[o7t][N9][V9](this[y4t][G9][D9],!isMultiEditable);this[y4t][n9][l9]();return x6t;},_typeFn:function(name){var z6=r1t;z6+=t2t;z6+=l5t;z6+=y4t;var args=Array[h0p][W0p][T7t](arguments);args[O0p]();o8E.D8E();args[y0p](this[y4t][z6]);var fn=this[y4t][W3t][name];if(fn){var m6=L7t;m6+=K7t;m6+=t0t;return fn[m6](this[y4t][L4p],args);}}};Editor[e6t][x0p]={};Editor[e6t][k6]={"className":o8E.K5t,"data":o8E.K5t,"def":o8E.K5t,"fieldInfo":o8E.K5t,"id":o8E.K5t,"label":o8E.K5t,"labelInfo":o8E.K5t,"name":g7t,"type":I6,"message":o8E.K5t,"multiEditable":x6t,"submit":x6t};Editor[e6t][f6][b8t]={type:g7t,name:g7t,classes:g7t,opts:g7t,host:g7t};Editor[t6][x0p][U6]={container:g7t,label:g7t,labelInfo:g7t,fieldInfo:g7t,fieldError:g7t,fieldMessage:g7t};Editor[i6]={};Editor[x0p][s6]={"init":function(dte){},"open":function(dte,append,fn){},"close":function(dte,fn){}};Editor[x0p][e0p]={"create":function(conf){},"get":function(conf){},"set":function(conf,val){},"enable":function(conf){},"disable":function(conf){}};Editor[x0p][h6]={"ajaxUrl":g7t,"ajax":g7t,"dataSource":g7t,"domTable":g7t,"opts":g7t,"displayController":g7t,"fields":{},"order":[],"id":-N71,"displayed":W6t,"processing":W6t,"modifier":g7t,"action":g7t,"idSrc":g7t,"unique":F71};Editor[W6][B3t]={"label":g7t,"fn":g7t,"className":g7t};Editor[x0p][P0p]={onReturn:j0p,onBlur:A0p,onBackground:O6,onComplete:A0p,onEsc:A0p,onFieldError:p0p,submit:y6,focus:F71,buttons:x6t,title:x6t,message:x6t,drawType:W6t,scope:v0p};Editor[x6]={};(function(){var c0p="_shown";var M0p="ayC";var N3p='<div class="DTED_Lightbox_Background"><div></div></div>';var V3p='<div class="DTED_Lightbox_Close"></div>';var d0p="_Lightbox_Wrapper\"";var F3p='<div class="DTED_Lightbox_Content">';var T3p='<div class="DTED_Lightbox_Content_Wrapper">';var g0p="ontroller";var M2p="offsetAni";var R3p='<div class="DTED_Lightbox_Container">';var X0p="lightbox";var C0p="class=\"DTED DTED";var G8=K6t;G8+=b6t;G8+=v8t;var V8=Q0p;o8E.D8E();V8+=C0p;V8+=d0p;V8+=L6t;var P6=w3t;P6+=M0p;P6+=g0p;var e6=E6t;e6+=y4t;var self;Editor[r0p][X0p]=$[S0p](x6t,{},Editor[e6][P6],{"init":function(dte){self[H0p]();return self;},"open":function(dte,append,callback){var o0p="ild";var u0p="etach";var d6=Z0p;d6+=Y0p;var C6=a0p;C6+=U5p;var Q6=H1t;Q6+=u0p;var v6=Y4p;v6+=o0p;v6+=J3t;v6+=D5t;var p6=u1t;p6+=H1t;p6+=r1t;p6+=g1t;var A6=u1t;A6+=H1t;A6+=l5t;A6+=V5t;var j6=Z0p;j6+=i4p;o8E.D8E();j6+=E0p;if(self[j6]){if(callback){callback();}return;}self[A6]=dte;var content=self[p6][J0p];content[v6]()[Q6]();content[B0p](append)[B0p](self[C6][q0p]);self[c0p]=x6t;self[d6](callback);},"close":function(dte,callback){var L0p="_sho";var M6=L0p;M6+=E0p;if(!self[c0p]){if(callback){callback();}return;}self[K0p]=dte;self[b0p](callback);self[M6]=W6t;},node:function(dte){var g6=a0t;g6+=p1t;g6+=o8E.u5t;g6+=w0p;return self[R0p][g6][F71];},"_init":function(){var n0p='div.DTED_Lightbox_Content';var N0p="kgrou";var V0p="opaci";var T0p="pacity";var a6=r1t;a6+=T0p;var Y6=Y4t;Y6+=F0p;Y6+=N0p;Y6+=K1t;var Z6=V0p;Z6+=y3t;var H6=o8E.q5t;H6+=y4t;H6+=y4t;var S6=G0p;S6+=U3t;var X6=u1t;X6+=D3t;X6+=g1t;var r6=a0p;r6+=r1t;r6+=g1t;if(self[D0p]){return;}var dom=self[r6];dom[J0p]=$(n0p,self[X6][S6]);dom[z7t][H6](Z6,F71);dom[Y6][s5p](a6,F71);},"_show":function(callback){var N2p="_Li";var s2p="ick.DT";var f2p="DTED_Lightbox";var T2p="orientation";var V2p="ghtbox_Shown";var y2p="_ani";var Q2p='DTED_Lightbox_Mobile';var D2p="ildr";var W2p="titl";var R2p="_scrollTop";var z2p="esize";var n2p='<div class="DTED_Lightbox_Shown"></div>';var l0p="rollT";var F2p="v.DTED";var k2p="ED_Lightbox";var A2p="orient";var I2p="click.";var s8=y4t;s8+=o8E.q5t;s8+=l0p;s8+=a4p;var U8=p1t;U8+=z2p;U8+=m2p;U8+=k2p;var m8=I2p;m8+=f2p;var z8=Y4t;z8+=l4t;z8+=D5t;z8+=H1t;var l6=t2p;l6+=U2p;l6+=U3t;var D6=i2p;D6+=s2p;D6+=k2p;var G6=Y4t;G6+=l4t;G6+=D5t;G6+=H1t;var V6=h2p;V6+=V5t;var N6=W2p;N6+=V5t;var F6=o8E.u5t;F6+=l5t;F6+=l5t;F6+=p1t;var T6=o8E.q5t;T6+=O2p;var b6=y2p;b6+=g1t;b6+=Y0t;var K6=h2p;K6+=V5t;o8E.v8E();var L6=x2p;L6+=o8E.u5t;L6+=w0p;var c6=u1t;c6+=e2p;var q6=a0t;q6+=p1t;q6+=P2p;var B6=a0p;B6+=r1t;B6+=g1t;var J6=Y4t;J6+=r1t;J6+=j1t;var E6=o8E.q5t;E6+=y4t;E6+=y4t;var o6=j2p;o6+=q0t;o6+=G1t;o6+=l5t;var u6=A2p;u6+=o8E.u5t;u6+=j6t;u6+=w1t;var that=this;var dom=self[R0p];if(window[u6] !== undefined){$(p2p)[v2p](Q2p);}dom[J0p][s5p](o6,C2p);dom[z7t][E6]({top:-self[d2p][M2p]});$(J6)[B0p](self[R0p][g2p])[B0p](self[B6][q6]);self[r2p]();self[K0p][c6](dom[L6],{opacity:N71,top:F71},callback);self[K6][b6](dom[g2p],{opacity:N71});setTimeout(function(){var X2p="div.DTE_Foote";var S2p='text-indent';var R6=Z1p;R6+=y4t;var w6=X2p;w6+=p1t;$(w6)[R6](S2p,-N71);},m5t);dom[T6][F6](N6,self[V6][q8t][q0p])[G6](H2p,function(e){self[K0p][q0p]();});dom[g2p][Z2p](D6,function(e){var a2p="stopImmediatePropagation";var Y2p="ackground";var n6=Y4t;n6+=Y2p;e[a2p]();self[K0p][n6]();});$(u2p,dom[l6])[z8](m8,function(e){var c2p="atePropagation";var E2p='DTED_Lightbox_Content_Wrapper';o8E.v8E();var q2p="opImmedi";var I8=o2p;I8+=Z5p;I8+=Y5p;var k8=l9t;k8+=p1t;k8+=q0t;k8+=v3t;if($(e[k8])[I8](E2p)){var t8=Y4t;t8+=o8E.u5t;t8+=o8E.q5t;t8+=J2p;var f8=B2p;f8+=q2p;f8+=c2p;e[f8]();self[K0p][t8]();}});$(window)[Z2p](U8,function(){var L2p="_h";var b2p="tC";var w2p="alc";var K2p="eigh";o8E.D8E();var i8=L2p;i8+=K2p;i8+=b2p;i8+=w2p;self[i8]();});self[R2p]=$(p2p)[s8]();if(window[T2p] !== undefined){var e8=F4t;e8+=F2p;e8+=N2p;e8+=V2p;var x8=o8E.u5t;x8+=U2p;x8+=a1t;x8+=H1t;var y8=a0t;y8+=p1t;y8+=G2p;y8+=p1t;var O8=D5t;O8+=r1t;O8+=l5t;var W8=D5t;W8+=r1t;W8+=l5t;var h8=Y4p;h8+=D2p;h8+=V5t;h8+=D5t;var kids=$(p2p)[h8]()[W8](dom[g2p])[O8](dom[y8]);$(p2p)[x8](n2p);$(e8)[B0p](kids);}},"_heightCalc":function(){var t3p="dowPadding";var l2p="outer";var z3p="Height";var k3p="E_Footer";var I3p=".DTE_Header";var O3p='maxHeight';var f3p="win";var M8=o8E.q5t;M8+=V0t;var d8=l2p;d8+=z3p;var C8=x2p;C8+=o8E.u5t;C8+=w0p;var Q8=m3p;Q8+=m2p;Q8+=k3p;var v8=m3p;v8+=I3p;var p8=f3p;p8+=t3p;var A8=o8E.q5t;A8+=r1t;A8+=D5t;A8+=m4t;var j8=G1t;j8+=U3p;j8+=i3p;var P8=s3p;P8+=g1t;var dom=self[P8];var maxHeight=$(window)[j8]() - self[A8][p8] * V71 - $(v8,dom[z7t])[h3p]() - $(Q8,dom[C8])[d8]();$(W3p,dom[z7t])[M8](O3p,maxHeight);},"_hide":function(callback){var o3p="ientation";var w3p="unbind";var P3p="v.DTED_Lightbox_Conten";var X3p="ollTop";var Z3p="ox_Mobi";var x3p=".DTED_Lightbox";var H3p="Lightb";var L3p='div.DTED_Lightbox_Shown';var q3p="pendTo";var r3p="scr";var S3p="DTED_";var c3p="childr";var j3p="t_Wrapper";var A3p="click.D";var a3p="oveC";var C3p="backgro";var g3p="_scrollT";var p3p="TED_Lightbox";var N8=y3p;N8+=x3p;var F8=e3p;F8+=C3t;F8+=H1t;o8E.D8E();var T8=F4t;T8+=P3p;T8+=j3p;var R8=A3p;R8+=p3p;var w8=v3p;w8+=Q3p;w8+=K1t;var b8=C3p;b8+=v3p;b8+=H1t;var K8=i2p;K8+=r1t;K8+=y4t;K8+=V5t;var c8=d3p;c8+=M3p;c8+=D5t;c8+=H1t;var q8=u1t;q8+=H1t;q8+=l5t;q8+=V5t;var J8=x2p;J8+=o8E.u5t;J8+=w0p;var E8=u1t;E8+=H1t;E8+=l5t;E8+=V5t;var o8=g3p;o8+=a4p;var u8=r3p;u8+=X3p;var a8=S3p;a8+=H3p;a8+=Z3p;a8+=u3t;var Y8=Y3p;Y8+=a3p;Y8+=u3p;var Z8=Y4t;Z8+=r1t;Z8+=H1t;Z8+=t0t;var g8=C1t;g8+=o3p;var dom=self[R0p];if(!callback){callback=function(){};}if(window[g8] !== undefined){var H8=J3t;H8+=E3p;H8+=J3p;var S8=Y4t;S8+=B3p;var X8=o8E.u5t;X8+=t2t;X8+=q3p;var r8=c3p;r8+=a1t;var show=$(L3p);show[r8]()[X8](S8);show[H8]();}$(Z8)[Y8](a8)[u8](self[o8]);self[E8][K3p](dom[J8],{opacity:F71,top:self[d2p][M2p]},function(){var B8=H1t;B8+=V5t;B8+=l5t;B8+=b3p;$(this)[B8]();callback();});self[q8][K3p](dom[c8],{opacity:F71},function(){var L8=l3t;L8+=l5t;L8+=o8E.u5t;L8+=Y4p;$(this)[L8]();});dom[K8][w3p](H2p);dom[b8][w8](R8);$(T8,dom[z7t])[F8](H2p);$(window)[w3p](N8);},"_dte":g7t,"_ready":W6t,"_shown":W6t,"_dom":{"wrapper":$(V8 + R3p + T3p + F3p + e7t + G8 + e7t + e7t),"background":$(N3p),"close":$(V3p),"content":g7t}});self=Editor[r0p][X0p];self[d2p]={"offsetAni":W5t,"windowPadding":W5t};})();(function(){var I6p="height";var S5t=600;var z9p="ontrolle";var D3p="class=\"DTED_Envelope_Con";var v8p='<div class="DTED_Envelope_Close">&times;</div>';var j6p="windowPadding";var n3p="ainer\"></div>";var k9p="envelope";var s9p="appendChild";var j8p='<div class="DTED DTED_Envelope_Wrapper">';var A8p='<div class="DTED_Envelope_Shadow"></div>';var l3p="displayC";var p8p='<div class="DTED_Envelope_Background"><div></div></div>';var p5t=50;var u4s=p1t;u4s+=G3p;var a4s=Q0p;a4s+=D3p;a4s+=l5t;a4s+=n3p;var z7=l3p;z7+=z9p;z7+=p1t;var l8=E3p;l8+=H1t;l8+=f1t;l8+=y4t;var n8=m9p;n8+=J8t;n8+=H1t;var D8=H1t;D8+=H7t;D8+=B0t;D8+=Z7t;var self;Editor[D8][k9p]=$[n8](x6t,{},Editor[l8][z7],{"init":function(dte){var m7=u1t;m7+=I9p;m7+=V5t;self[m7]=dte;self[H0p]();return self;},"open":function(dte,append,callback){var i9p="ldren";var h9p="_show";var t9p="deta";var t7=u1t;t7+=D3t;t7+=g1t;var f7=G2p;f7+=K1t;f7+=f9p;f7+=H1t;var I7=t9p;I7+=o8E.q5t;I7+=G1t;var k7=o8E.q5t;k7+=U9p;k7+=i9p;self[K0p]=dte;$(self[R0p][J0p])[k7]()[I7]();self[R0p][J0p][s9p](append);self[R0p][J0p][f7](self[t7][q0p]);self[h9p](callback);},"close":function(dte,callback){var i7=u1t;i7+=W9p;i7+=V5t;var U7=u1t;o8E.D8E();U7+=I9p;U7+=V5t;self[U7]=dte;self[i7](callback);},node:function(dte){var s7=u1t;o8E.D8E();s7+=H1t;s7+=U5p;return self[s7][z7t][F71];},"_init":function(){var Q9p="_cssBackgroundOpacity";var e9p="ound";var x9p="ackgro";var A9p='div.DTED_Envelope_Container';var y9p="isbilit";var O9p="ible";var v9p="visbility";var C9p='opacity';var X7=N5t;X7+=l4t;X7+=y4t;X7+=O9p;var r7=N5t;r7+=y9p;r7+=t0t;var g7=Y4t;g7+=F0p;g7+=J2p;var M7=u1t;M7+=H1t;M7+=r1t;M7+=g1t;var d7=K1p;d7+=V5t;var C7=y4t;C7+=l5t;C7+=t0t;C7+=u3t;var Q7=Y4t;Q7+=x9p;Q7+=T1t;Q7+=K1t;var v7=u1t;v7+=H1t;v7+=r1t;v7+=g1t;var p7=u1t;p7+=D3t;p7+=g1t;var A7=Y4t;A7+=o4p;A7+=o8E.q5t;A7+=q4p;var j7=H3t;j7+=Y3t;var P7=d3p;P7+=e9p;var e7=u1t;e7+=o7t;var x7=W9p;x7+=P9p;var y7=o1t;y7+=o8E.q5t;y7+=J2p;var O7=G0p;O7+=V5t;O7+=p1t;var W7=u1t;W7+=H1t;W7+=r1t;W7+=g1t;var h7=j9p;h7+=J8t;h7+=l5t;if(self[D0p]){return;}self[R0p][h7]=$(A9p,self[W7][O7])[F71];self[R0p][y7][p9p][v9p]=x7;self[e7][P7][p9p][j7]=A7;self[Q9p]=$(self[p7][g2p])[s5p](C9p);self[v7][Q7][C7][r0p]=d7;self[M7][g7][p9p][r7]=X7;},"_show":function(callback){var s6p="marginLeft";var y6p="etHeight";var e6p='html,body';var B9p="_cssBackgroundOpacit";var R9p="und";var X9p="div.DTED_Lightbox";var d9p="ED_Envelope";var v6p="onte";var w9p="ckg";var z6p="ndC";var M6p='click.DTED_Envelope';var D9p="opa";var Y9p=".DTED_Envelo";var G9p="Width";var O6p="fadeIn";var a9p="lick.";var W6p='normal';var n9p="cit";var i6p="px";var H9p="Wrapper";var l9p="yl";var p6p="ani";var h6p="offsetHeight";var J9p="dowScrol";var t6p="opacity";var r9p="per";var S9p="_Content_";var u9p="DTED_Envelope";var K9p="paci";var N9p="wrappe";var F9p="tyle";var f6p="_findAttachRow";var b9p="sty";var o5s=y3p;o5s+=m2p;o5s+=d9p;var u5s=Y4t;u5s+=M9p;var S5s=g9p;S5s+=r9p;var X5s=u1t;X5s+=o7t;var r5s=X9p;r5s+=S9p;r5s+=H9p;var d5s=Z9p;d5s+=Y9p;d5s+=S4t;var C5s=u1t;C5s+=H1t;C5s+=r1t;C5s+=g1t;var p5s=o8E.q5t;p5s+=a9p;p5s+=u9p;var A5s=l4t;A5s+=o9p;A5s+=D5t;var j5s=u1t;j5s+=H1t;j5s+=l5t;j5s+=V5t;var P5s=l5t;P5s+=m2t;P5s+=u3t;var U5s=E9p;U5s+=D5t;U5s+=J9p;U5s+=B0t;var t5s=B9p;t5s+=t0t;var f5s=q9p;f5s+=l4t;f5s+=c9p;f5s+=X0t;var I5s=Y4t;I5s+=B0t;I5s+=F5p;I5s+=q4p;var k5s=F4t;k5s+=L9p;k5s+=B0t;k5s+=Z7t;var m5s=r1t;m5s+=K9p;m5s+=y3t;var z5s=b9p;z5s+=B0t;z5s+=V5t;var l7=o1t;l7+=w9p;l7+=U2t;l7+=R9p;var n7=t2t;n7+=t4t;var D7=l5t;D7+=r1t;D7+=t2t;var G7=B2p;G7+=t0t;G7+=B0t;G7+=V5t;var V7=l7t;V7+=z5p;o8E.D8E();V7+=V5t;V7+=z5p;var N7=l5t;N7+=r1t;N7+=t2t;var F7=T9p;F7+=m4t;F7+=y4t;F7+=v3t;var T7=l5t;T7+=r1t;T7+=t2t;var R7=u1t;R7+=o7t;var w7=t2t;w7+=t4t;var b7=y4t;b7+=F9p;var K7=N9p;K7+=p1t;var L7=B2p;L7+=t0t;L7+=u3t;var c7=a0t;c7+=p1t;c7+=L7t;c7+=r9p;var q7=s3p;q7+=g1t;var B7=D5t;B7+=r1t;B7+=I5p;var J7=V9p;J7+=y4t;J7+=v3t;J7+=G9p;var E7=D9p;E7+=n9p;E7+=t0t;var o7=y4t;o7+=y3t;o7+=B0t;o7+=V5t;var u7=x2p;u7+=L7t;u7+=t2t;u7+=U3t;var a7=u1t;a7+=H1t;a7+=r1t;a7+=g1t;var Y7=y4t;Y7+=l5t;Y7+=l9p;Y7+=V5t;var Z7=s3p;Z7+=g1t;var H7=u1t;H7+=H1t;H7+=r1t;H7+=g1t;var S7=L7t;S7+=S4t;S7+=z6p;S7+=m6p;var that=this;var formHeight;if(!callback){callback=function(){};}document[k6p][S7](self[R0p][g2p]);document[k6p][s9p](self[H7][z7t]);self[Z7][J0p][Y7][I6p]=C2p;var style=self[a7][u7][o7];style[E7]=F71;style[r0p]=i0p;var targetRow=self[f6p]();var height=self[r2p]();var width=targetRow[J7];style[r0p]=B7;style[t6p]=N71;self[q7][c7][L7][U6p]=width + i6p;self[R0p][K7][b7][s6p]=-(width / V71) + w7;self[R7][z7t][p9p][T7]=$(targetRow)[F7]()[N7] + targetRow[h6p] + i6p;self[R0p][V7][G7][D7]=-N71 * height - i5t + n7;self[R0p][l7][z5s][m5s]=F71;self[R0p][g2p][p9p][k5s]=I5s;$(self[R0p][g2p])[f5s]({'opacity':self[t5s]},W6p);$(self[R0p][z7t])[O6p]();if(self[d2p][U5s]){var h5s=V9p;h5s+=y4t;h5s+=y6p;var s5s=l5t;s5s+=r1t;s5s+=t2t;var i5s=x6p;i5s+=V5t;$(e6p)[i5s]({"scrollTop":$(targetRow)[P6p]()[s5s] + targetRow[h5s] - self[d2p][j6p]},function(){var O5s=A6p;O5s+=l5t;var W5s=a0p;W5s+=U5p;$(self[W5s][O5s])[e2p]({"top":F71},S5t,callback);});}else {var e5s=p6p;e5s+=g1t;e5s+=N1t;e5s+=V5t;var x5s=o8E.q5t;x5s+=v6p;x5s+=D5t;x5s+=l5t;var y5s=u1t;y5s+=H1t;y5s+=r1t;y5s+=g1t;$(self[y5s][x5s])[e5s]({"top":F71},S5t,callback);}$(self[R0p][q0p])[Q6p](P5s,self[j5s][A5s][q0p])[Z2p](p5s,function(e){var Q5s=C6p;Q5s+=V5t;var v5s=u1t;v5s+=H1t;v5s+=l5t;v5s+=V5t;o8E.D8E();self[v5s][Q5s]();});$(self[C5s][g2p])[Z2p](d5s,function(e){var d6p="bac";var g5s=d6p;g5s+=J2p;var M5s=u1t;M5s+=H1t;M5s+=X0t;self[M5s][g5s]();});$(r5s,self[X5s][S5s])[Z2p](M6p,function(e){var S6p="ackgr";var r6p="targ";var X6p='DTED_Envelope_Content_Wrapper';var Z5s=g6p;Z5s+=Y5p;var H5s=r6p;H5s+=V5t;H5s+=l5t;if($(e[H5s])[Z5s](X6p)){var a5s=Y4t;a5s+=S6p;a5s+=r1t;a5s+=R9p;var Y5s=h2p;Y5s+=V5t;self[Y5s][a5s]();}});$(window)[u5s](o5s,function(){var H6p="_he";var Z6p="ightCal";var E5s=H6p;E5s+=Z6p;E5s+=o8E.q5t;self[E5s]();});},"_heightCalc":function(){var Y6p="terHei";var w6p="gh";var F6p="tent";var E6p="rap";var N6p="tCalc";var T6p="ldre";var a6p="dte";var L6p="E_Header";var c6p=".D";var V6p="Calc";var R6p="chi";var K6p="nf";var u6p="axHeig";var B6p="DTE_Fo";var z4s=M3p;z4s+=Y6p;z4s+=i3p;var l5s=u1t;l5s+=a6p;var n5s=g1t;n5s+=u6p;n5s+=o6p;var D5s=o8E.q5t;D5s+=V0t;var G5s=x2p;G5s+=P2p;var V5s=a0t;V5s+=E6p;V5s+=S4t;V5s+=p1t;var N5s=u1t;N5s+=H1t;N5s+=U5p;var F5s=J6p;F5s+=B6p;F5s+=h3t;F5s+=U3t;var T5s=M3p;T5s+=q6p;var R5s=u1t;R5s+=H1t;R5s+=r1t;R5s+=g1t;var w5s=m3p;w5s+=c6p;w5s+=V1t;w5s+=L6p;var b5s=l7t;b5s+=K6p;var K5s=b6p;K5s+=l4t;K5s+=w6p;K5s+=l5t;var L5s=R6p;L5s+=T6p;L5s+=D5t;var c5s=j9p;c5s+=F6p;var q5s=u1t;q5s+=o7t;var B5s=j2p;B5s+=w6p;B5s+=N6p;var J5s=G1t;J5s+=U3p;J5s+=i3p;J5s+=V6p;var formHeight;formHeight=self[d2p][J5s]?self[d2p][B5s](self[q5s][z7t]):$(self[R0p][c5s])[L5s]()[K5s]();var maxHeight=$(window)[I6p]() - self[b5s][j6p] * V71 - $(w5s,self[R5s][z7t])[T5s]() - $(F5s,self[N5s][V5s])[h3p]();$(W3p,self[R0p][G5s])[D5s](n5s,maxHeight);return $(self[l5s][o7t][z7t])[z4s]();},"_hide":function(callback){var D6p="ED";var k8p="click.DTE";var m8p="ckgroun";var f8p="offsetHei";var z8p="bin";var n6p="_Ligh";var G6p="resize.DT";var I8p="D_Lig";var l6p="tbox";var A4s=G6p;A4s+=D6p;A4s+=n6p;A4s+=l6p;var j4s=e3p;j4s+=C3t;j4s+=H1t;var P4s=e3p;P4s+=l4t;P4s+=D5t;P4s+=H1t;var e4s=x2p;e4s+=G2p;e4s+=p1t;var x4s=a0p;x4s+=r1t;x4s+=g1t;var y4s=T1t;y4s+=D5t;y4s+=z8p;y4s+=H1t;var O4s=o1t;O4s+=m8p;O4s+=H1t;var W4s=k8p;W4s+=I8p;W4s+=c0t;var h4s=e3p;h4s+=C3t;h4s+=H1t;var s4s=C6p;s4s+=V5t;var k4s=f8p;k4s+=i3p;var m4s=u1t;m4s+=H1t;m4s+=U5p;if(!callback){callback=function(){};}$(self[m4s][J0p])[e2p]({"top":-(self[R0p][J0p][k4s] + p5t)},S5t,function(){var t8p="rma";var U8p="fad";var i8p="eO";var i4s=D5t;i4s+=r1t;i4s+=t8p;i4s+=B0t;var U4s=U8p;U4s+=i8p;U4s+=w5p;var t4s=u1t;t4s+=D3t;o8E.v8E();t4s+=g1t;var f4s=t2p;f4s+=U2p;f4s+=V5t;f4s+=p1t;var I4s=s3p;I4s+=g1t;$([self[I4s][f4s],self[t4s][g2p]])[U4s](i4s,function(){$(this)[r1p]();o8E.D8E();callback();});});$(self[R0p][s4s])[h4s](W4s);$(self[R0p][O4s])[y4s](H2p);$(u2p,self[x4s][e4s])[P4s](H2p);$(window)[j4s](A4s);},"_findAttachRow":function(){var y8p="dataTabl";var s8p="reate";var X4s=o8E.q5t;X4s+=s8p;var r4s=F0p;r4s+=h8p;var g4s=u1t;g4s+=H1t;g4s+=l5t;o8E.v8E();g4s+=V5t;var C4s=b6p;C4s+=W8p;var Q4s=j9p;Q4s+=m4t;var v4s=O8p;v4s+=l4t;var p4s=y8p;p4s+=V5t;var dt=new $[J9t][p4s][v4s](self[K0p][y4t][c1p]);if(self[Q4s][x8p] === C4s){var M4s=b6p;M4s+=o8E.u5t;M4s+=l3t;M4s+=p1t;var d4s=l5t;d4s+=o8E.u5t;d4s+=Y4t;d4s+=u3t;return dt[d4s]()[M4s]();}else if(self[g4s][y4t][r4s] === X4s){var S4s=l9t;S4s+=K3t;return dt[S4s]()[e8p]();}else {var Y4s=S1p;Y4s+=l3t;var Z4s=u1t;Z4s+=H1t;Z4s+=l5t;Z4s+=V5t;var H4s=p1t;H4s+=r1t;H4s+=a0t;return dt[H4s](self[Z4s][y4t][P8p])[Y4s]();}},"_dte":g7t,"_ready":W6t,"_cssBackgroundOpacity":N71,"_dom":{"wrapper":$(j8p + A8p + a4s + e7t)[F71],"background":$(p8p)[F71],"close":$(v8p)[F71],"content":g7t}});self=Editor[r0p][k9p];self[d2p]={"windowPadding":p5t,"heightCalc":g7t,"attach":u4s,"windowScroll":x6t};})();Editor[h0p][o4s]=function(cfg,after){var H8p="taSour";var J8p="iReset";var Z8p="Error adding field. The field requires a `name` option";var o8p='initField';var a8p="Error adding field '";var u8p="'. A field already exists with this name";var M8p="reverse";var r8p="Fie";var Q8p="ord";var V4s=Q8p;V4s+=U3t;var E4s=C8p;E4s+=t0t;if(Array[E4s](cfg)){var J4s=B0t;J4s+=d8p;J4s+=l5t;J4s+=G1t;if(after !== undefined){cfg[M8p]();}for(var i=F71;i < cfg[J4s];i++){this[g8p](cfg[i],after);}}else {var L4s=E3p;L4s+=l3t;var c4s=p5p;c4s+=v5p;var q4s=r8p;q4s+=X8p;var B4s=S8p;B4s+=H8p;B4s+=V4p;var name=cfg[w8t];if(name === undefined){throw Z8p;}if(this[y4t][Y8p][name]){throw a8p + name + u8p;}this[B4s](o8p,cfg);var field=new Editor[q4s](cfg,this[c4s][E8p],this);if(this[y4t][L4s]){var b4s=g6t;b4s+=J8p;var K4s=B8p;K4s+=r8p;K4s+=r3t;var editFields=this[y4t][K4s];field[b4s]();$[V9t](editFields,function(idSrc,edit){var c8p="valFromData";var R4s=H1t;R4s+=q8p;o8E.D8E();var val;if(edit[N8t]){var w4s=H1t;w4s+=o8E.u5t;w4s+=l9t;val=field[c8p](edit[w4s]);}field[L8p](idSrc,val !== undefined?val:field[R4s]());});}this[y4t][Y8p][name]=field;if(after === undefined){var T4s=C1t;T4s+=K8p;this[y4t][T4s][t6t](name);}else if(after === g7t){var F4s=Q8p;F4s+=V5t;F4s+=p1t;this[y4t][F4s][y0p](name);}else {var N4s=r1t;N4s+=p1t;N4s+=H1t;N4s+=U3t;var idx=$[X4p](after,this[y4t][b8p]);this[y4t][N4s][w8p](idx + N71,F71,name);}}this[R8p](this[V4s]());return this;};Editor[G4s][o2t]=function(newAjax){var n4s=o8E.u5t;n4s+=T8p;n4s+=o8E.u5t;n4s+=t4t;if(newAjax){var D4s=F8p;D4s+=N8p;this[y4t][D4s]=newAjax;return this;}return this[y4t][n4s];};Editor[l4s][g2p]=function(){var n8p="ground";var D8p="onB";var G8p="uncti";var k1s=b1p;k1s+=V8p;var m1s=m4t;m1s+=G8p;m1s+=r1t;m1s+=D5t;var z1s=D8p;z1s+=F0p;z1s+=q4p;z1s+=n8p;var onBackground=this[y4t][l8p][z1s];if(typeof onBackground === m1s){onBackground(this);}else if(onBackground === k1s){var I1s=Y4t;I1s+=B0t;I1s+=V8p;this[I1s]();}else if(onBackground === A0p){var f1s=o8E.q5t;f1s+=B0t;f1s+=z7p;f1s+=V5t;this[f1s]();}else if(onBackground === j0p){this[m7p]();}return this;};Editor[h0p][k7p]=function(){this[I7p]();return this;};Editor[t1s][U1s]=function(cells,fieldNames,show,opts){var O7p="nOb";var t7p="indivi";var i7p="ource";o8E.D8E();var y7p="ject";var s7p="formO";var U7p="dual";var W7p="isPlai";var e1s=Y4t;e1s+=f7p;e1s+=Y4t;e1s+=u3t;var x1s=u1t;x1s+=I4t;x1s+=l4t;x1s+=l5t;var y1s=t7p;y1s+=U7p;var O1s=C2t;O1s+=d2t;O1s+=i7p;var W1s=q3t;W1s+=b1p;W1s+=V5t;var h1s=s7p;h1s+=h7p;h1s+=M1t;var s1s=S1t;s1s+=V5t;s1s+=D5t;s1s+=H1t;var i1s=W7p;i1s+=O7p;i1s+=y7p;var that=this;if(this[x7p](function(){that[e7p](cells,fieldNames,opts);})){return this;}if($[i1s](fieldNames)){opts=fieldNames;fieldNames=undefined;show=x6t;}else if(typeof fieldNames === P7p){show=fieldNames;fieldNames=undefined;opts=undefined;}if($[Z4p](show)){opts=show;show=x6t;}if(show === undefined){show=x6t;}opts=$[s1s]({},this[y4t][h1s][W1s],opts);var editFields=this[O1s](y1s,cells,fieldNames);this[x1s](cells,editFields,e1s,opts,function(){var F7p="pointer";var c7p='resize.';var Y7p="itle=\"";var b7p='attach';var N7p="ppendTo";var A7p="nc";var v7p="_clos";var H7p="><span></div>";var S7p="ator\"";var w7p="bg";var Q7p="eReg";var T7p="liner";var Z7p="\" t";var L7p="bubblePosition";var z56="formInfo";var p7p="ludeFields";var m56="prepe";var X7p="<div class=\"DTE_Processing_Indic";var d7p="hildre";var R7p='"><div></div></div>';var K7p="bubbleNodes";var E7p="_formOp";var D1s=Y4t;D1s+=f7p;D1s+=K3t;var G1s=o6t;G1s+=j7p;G1s+=y4t;var V1s=l4t;V1s+=A7p;V1s+=p7p;var N1s=u1t;N1s+=m4t;N1s+=c7t;N1s+=y4t;var L1s=v7p;L1s+=Q7p;var c1s=o8E.u5t;c1s+=b3t;var B1s=j6t;B1s+=i3t;B1s+=V5t;var E1s=g1t;E1s+=C7p;var o1s=m4t;o1s+=r1t;o1s+=p1t;o1s+=g1t;var u1s=H1t;u1s+=r1t;u1s+=g1t;var a1s=D3t;a1s+=g1t;var Y1s=o8E.q5t;Y1s+=d7p;Y1s+=D5t;var Z1s=Y4p;Z1s+=l4t;Z1s+=X8p;Z1s+=t5p;var S1s=K6t;S1s+=M7p;S1s+=L6t;var X1s=g7p;X1s+=b6t;X1s+=v8t;var r1s=R6t;r1s+=H1t;r1s+=r7p;r1s+=L6t;var g1s=X7p;g1s+=S7p;g1s+=H7p;var M1s=l4t;M1s+=o9p;M1s+=D5t;var d1s=Z7p;d1s+=Y7p;var C1s=F9t;C1s+=L6t;var Q1s=l5t;Q1s+=o8E.u5t;Q1s+=K3t;var v1s=F9t;v1s+=L6t;var p1s=a7p;p1s+=p8t;var A1s=L7t;A1s+=t2t;A1s+=u7p;var j1s=o8E.q5t;j1s+=w1t;j1s+=o7p;j1s+=l5t;var P1s=E7p;P1s+=J7p;P1s+=M1t;var namespace=that[P1s](opts);var ret=that[B7p](q7p);if(!ret){return that;}$(window)[w1t](c7p + namespace,function(){that[L7p]();});var nodes=[];that[y4t][K7p]=nodes[j1s][A1s](nodes,_pluck(editFields,b7p));var classes=that[M5p][e7p];var background=$(l8t + classes[w7p] + R7p);var container=$(l8t + classes[z7t] + U7t + p1s + classes[T7p] + v1s + l8t + classes[Q1s] + C1s + l8t + classes[q0p] + d1s + that[M1s][q0p] + j7t + g1s + r1s + e7t + l8t + classes[F7p] + X1s + S1s);if(show){var H1s=o8E.u5t;H1s+=N7p;container[V7p](p2p);background[H1s](p2p);}var liner=container[Z1s]()[G7p](F71);var table=liner[Y1s]();var close=table[D7p]();liner[B0p](that[a1s][n7p]);table[l7p](that[u1s][o1s]);if(opts[E1s]){var J1s=H1t;J1s+=r1t;J1s+=g1t;liner[l7p](that[J1s][z56]);}if(opts[B1s]){var q1s=m56;q1s+=K1t;liner[q1s](that[o7t][e8p]);}if(opts[k56]){table[B0p](that[o7t][k56]);}var pair=$()[c1s](container)[g8p](background);that[L1s](function(submitComplete){var K1s=u1t;K1s+=q9p;K1s+=C4t;o8E.v8E();K1s+=Y0t;that[K1s](pair,{opacity:F71},function(){var t56="namicInfo";var f56="rDy";var I56="_clea";if(this === container[F71]){var R1s=u1t;R1s+=V5t;R1s+=N5t;R1s+=J1p;var w1s=I56;w1s+=f56;w1s+=t56;var b1s=r1t;b1s+=m4t;b1s+=m4t;pair[e4p]();$(window)[b1s](c7p + namespace);that[w1s]();that[R1s](U56,[q7p]);}});});background[Z9p](function(){var T1s=b1p;T1s+=V8p;that[T1s]();});close[Z9p](function(){var F1s=u1t;F1s+=q0p;o8E.D8E();that[F1s]();});that[L7p]();that[K3p](pair,{opacity:N71});that[N1s](that[y4t][V1s],opts[G1s]);that[i56](D1s,x6t);});return this;};Editor[h0p][n1s]=function(){var H56='below';var g56="right";var U5t=15;var r56="outerWidth";var p56="ft";var x56="e_Liner";var X56="ottom";var y56="DTE_Bub";var O56="bubbleNo";var e56='div.DTE_Bubble';var h56="eft";var W56="tom";var j0s=o8E.q5t;j0s+=V0t;var P0s=s56;P0s+=y4t;P0s+=v5p;var e0s=B0t;e0s+=h56;var x0s=l5t;x0s+=r1t;x0s+=t2t;var y0s=u3t;y0s+=W1p;var O0s=Y4t;O0s+=r1t;O0s+=l5t;O0s+=W56;var W0s=u3t;W0s+=D5t;W0s+=q0t;W0s+=k0p;var h0s=u3t;h0s+=D5t;h0s+=F1p;h0s+=G1t;var z0s=O56;z0s+=H1t;z0s+=v5p;var l1s=J6p;o8E.v8E();l1s+=y56;l1s+=b1p;l1s+=x56;var wrapper=$(e56),liner=$(l1s),nodes=this[y4t][z0s];var position={top:F71,left:F71,right:F71,bottom:F71};$[V9t](nodes,function(i,node){var d56="offsetWidth";var v56="fse";var P56="offsetHe";var A56="ttom";var s0s=P56;s0s+=l4t;s0s+=q0t;s0s+=o6p;var i0s=j56;i0s+=A56;var U0s=p1t;U0s+=l4t;U0s+=q0t;U0s+=o6p;var t0s=B0t;t0s+=V5t;t0s+=p56;var f0s=B0t;f0s+=V5t;f0s+=m4t;f0s+=l5t;var I0s=h2t;I0s+=t2t;var k0s=l5t;k0s+=r1t;k0s+=t2t;var m0s=T9p;m0s+=v56;m0s+=l5t;var pos=$(node)[m0s]();node=$(node)[Q56](F71);position[k0s]+=pos[I0s];position[f0s]+=pos[t0s];position[U0s]+=pos[C56] + node[d56];position[i0s]+=pos[M56] + node[s0s];});position[M56]/=nodes[h0s];position[C56]/=nodes[W0s];position[g56]/=nodes[h6t];position[O0s]/=nodes[y0s];var top=position[x0s],left=(position[e0s] + position[g56]) / V71,width=liner[r56](),visLeft=left - width / V71,visRight=visLeft + width,docWidth=$(window)[U6p](),padding=U5t,classes=this[P0s][e7p];wrapper[j0s]({top:top,left:left});if(liner[h6t] && liner[P6p]()[M56] < F71){var p0s=Y4t;p0s+=X56;var A0s=Z1p;A0s+=y4t;wrapper[A0s](S56,position[p0s])[v2p](H56);}else {wrapper[Z56](H56);}if(visRight + padding > docWidth){var v0s=u3t;v0s+=p56;var diff=visRight - docWidth;liner[s5p](v0s,visLeft < padding?-(visLeft - padding):-(diff + padding));}else {var Q0s=o8E.q5t;Q0s+=y4t;Q0s+=y4t;liner[Q0s](Y56,visLeft < padding?-(visLeft - padding):F71);}return this;};Editor[h0p][C0s]=function(buttons){var o56='_basic';var H0s=V5t;H0s+=o8E.u5t;H0s+=o8E.q5t;H0s+=G1t;var S0s=a56;S0s+=t2t;S0s+=y3t;var X0s=H1t;X0s+=r1t;X0s+=g1t;var r0s=y4p;r0s+=u8t;r0s+=u56;var that=this;if(buttons === o56){var M0s=E56;M0s+=J56;M0s+=l5t;var d0s=l4t;d0s+=R5t;d0s+=B56;buttons=[{text:this[d0s][this[y4t][q56]][M0s],action:function(){var g0s=c56;o8E.D8E();g0s+=Y4t;g0s+=L56;this[g0s]();}}];}else if(!Array[r0s](buttons)){buttons=[buttons];}$(this[X0s][k56])[S0s]();$[H0s](buttons,function(i,btn){var I46="tabIndex";var U46='keypress';var k46="className";var G56="n></butto";o8E.v8E();var F56="ssN";var w56="tabInd";var R56="ndex";var N56="<bu";var G0s=K56;G0s+=l5t;G0s+=h2t;G0s+=M1t;var V0s=H1t;V0s+=r1t;V0s+=g1t;var F0s=o8E.q5t;F0s+=b56;F0s+=E4p;var T0s=r1t;T0s+=D5t;var K0s=w56;K0s+=m9p;var L0s=l9t;L0s+=Q3p;L0s+=R56;var c0s=o8E.u5t;c0s+=T56;var q0s=m4t;q0s+=v3p;q0s+=q1p;var B0s=y5p;B0s+=F56;B0s+=o8E.u5t;B0s+=W4t;var J0s=y0t;J0s+=l5t;J0s+=r1t;J0s+=D5t;var E0s=Q1t;E0s+=y4t;var o0s=N56;o0s+=V56;o0s+=G56;o0s+=D56;var u0s=m4t;u0s+=D5t;var a0s=o8E.u5t;a0s+=n56;a0s+=r1t;a0s+=D5t;var Y0s=B0t;Y0s+=C8t;Y0s+=f1t;if(typeof btn === l56){btn={text:btn,action:function(){var Z0s=y4t;Z0s+=z46;Z0s+=l4t;Z0s+=l5t;this[Z0s]();}};}var text=btn[m46] || btn[Y0s];var action=btn[a0s] || btn[u0s];$(o0s,{'class':that[E0s][J1t][J0s] + (btn[k46]?m7t + btn[B0s]:o9t)})[P4p](typeof text === q0s?text(that):text || o9t)[c0s](L0s,btn[I46] !== undefined?btn[K0s]:F71)[w1t](f46,function(e){var b0s=q4p;b0s+=V5t;b0s+=t0t;b0s+=t46;if(e[b0s] === f5t && action){action[T7t](that);}})[w1t](U46,function(e){var s46="prevent";var h46="Defa";var i46="keyCo";var w0s=i46;w0s+=H1t;w0s+=V5t;if(e[w0s] === f5t){var R0s=s46;R0s+=h46;R0s+=T1t;R0s+=v4t;e[R0s]();}})[T0s](F0s,function(e){e[W46]();if(action){var N0s=o8E.q5t;N0s+=o8E.u5t;N0s+=B0t;N0s+=B0t;action[N0s](that,e);}})[V7p](that[V0s][G0s]);});return this;};Editor[h0p][O46]=function(fieldName){var j46="rra";var p46="est";var P46="nA";o8E.D8E();var Q46="_fie";var e46="eFie";var C46="Names";var A46="lice";var v46="clud";var that=this;var fields=this[y4t][Y8p];if(typeof fieldName === l56){var I2s=y46;I2s+=x46;I2s+=e46;I2s+=r3t;var k2s=l4t;k2s+=P46;k2s+=j46;k2s+=t0t;var m2s=L9p;m2s+=A46;var z2s=r1t;z2s+=p1t;z2s+=H1t;z2s+=U3t;var l0s=C1t;l0s+=H1t;l0s+=V5t;l0s+=p1t;var n0s=H1t;n0s+=p46;n0s+=U2t;n0s+=t0t;var D0s=g3t;D0s+=V5t;D0s+=X8p;that[D0s](fieldName)[n0s]();delete fields[fieldName];var orderIdx=$[X4p](fieldName,this[y4t][l0s]);this[y4t][z2s][m2s](orderIdx,N71);var includeIdx=$[k2s](fieldName,this[y4t][I2s]);if(includeIdx !== -N71){var f2s=C3t;f2s+=v46;f2s+=e46;f2s+=r3t;this[y4t][f2s][w8p](includeIdx,N71);}}else {var U2s=Q46;U2s+=X8p;U2s+=C46;var t2s=V5t;t2s+=b3p;$[t2s](this[U2s](fieldName),function(i,name){o8E.D8E();that[O46](name);});}return this;};Editor[h0p][q0p]=function(){this[d46](W6t);return this;};Editor[i2s][s2s]=function(arg1,arg2,arg3,arg4){var Z46="_tid";var B46='initCreate';var S46="itF";var P2s=H1t;P2s+=r1t;P2s+=g1t;var e2s=M46;e2s+=g46;e2s+=V5t;e2s+=p1t;var x2s=o8E.u5t;x2s+=r46;x2s+=X46;x2s+=D5t;var y2s=c9p;y2s+=C3t;var O2s=E3p;O2s+=H1t;O2s+=V5t;var W2s=I4t;W2s+=S46;W2s+=H46;W2s+=i4t;var h2s=Z46;h2s+=t0t;var that=this;var fields=this[y4t][Y8p];var count=N71;if(this[h2s](function(){o8E.v8E();that[Y46](arg1,arg2,arg3,arg4);})){return this;}if(typeof arg1 === a46){count=arg1;arg1=arg2;arg2=arg3;}this[y4t][W2s]={};for(var i=F71;i < count;i++){this[y4t][u46][i]={fields:this[y4t][Y8p]};}var argOpts=this[o46](arg1,arg2,arg3,arg4);this[y4t][O2s]=y2s;this[y4t][x2s]=Y46;this[y4t][e2s]=g7t;this[P2s][J1t][p9p][r0p]=i0p;this[E46]();this[R8p](this[Y8p]());$[V9t](fields,function(name,field){var p2s=H1t;p2s+=V5t;p2s+=m4t;var A2s=y4t;o8E.v8E();A2s+=V5t;A2s+=l5t;var j2s=V4t;j2s+=G4t;j2s+=A6t;j2s+=v1p;field[j2s]();for(var i=F71;i < count;i++){field[L8p](i,field[A4t]());}field[A2s](field[p2s]());});this[J46](B46,g7t,function(){var b46="embleMain";var q46="maybe";var K46="_as";var L46="_formOpti";var d2s=q46;d2s+=c46;d2s+=D5t;var C2s=r1t;C2s+=t2t;C2s+=m9t;var Q2s=L46;Q2s+=c1t;var v2s=K46;o8E.D8E();v2s+=y4t;v2s+=b46;that[v2s]();that[Q2s](argOpts[C2s]);argOpts[d2s]();});return this;};Editor[M2s][g2s]=function(parent){o8E.v8E();var T46="undependent";var w46=".e";var R46="dep";var S2s=w46;S2s+=R46;var X2s=r1t;X2s+=m4t;X2s+=m4t;var r2s=S1p;r2s+=H1t;r2s+=V5t;if(Array[h1p](parent)){for(var i=F71,ien=parent[h6t];i < ien;i++){this[T46](parent[i]);}return this;}var field=this[E8p](parent);$(field[r2s]())[X2s](S2s);return this;};Editor[H2s][F46]=function(parent,url,opts){var G46="OS";var D46="sArray";var N46="od";var i16='.edep';var R2s=r1t;R2s+=D5t;var w2s=D5t;w2s+=N46;w2s+=V5t;var a2s=V5t;a2s+=Y1t;a2s+=a1t;a2s+=H1t;var Y2s=V46;Y2s+=G46;Y2s+=V1t;var Z2s=l4t;Z2s+=D46;if(Array[Z2s](parent)){for(var i=F71,ien=parent[h6t];i < ien;i++){this[F46](parent[i],url,opts);}return this;}var that=this;var field=this[E8p](parent);var ajaxOpts={type:Y2s,dataType:n46};opts=$[a2s]({event:l46,data:g7t,preUpdate:g7t,postUpdate:g7t},opts);var update=function(json){var m16="pdate";var f16='error';var k16="pda";var I16="preUpdate";var z16="postU";var K2s=z16;K2s+=m16;var L2s=F4t;L2s+=q2t;L2s+=Y4t;L2s+=u3t;var c2s=y4t;c2s+=G1t;c2s+=r1t;c2s+=a0t;var q2s=U9p;q2s+=H1t;q2s+=V5t;var B2s=o8E.o5t;B2s+=o8E.q5t;B2s+=G1t;var E2s=W4t;E2s+=y4t;E2s+=G6t;var o2s=Y8t;o2s+=B0t;var u2s=T1t;u2s+=k16;u2s+=X0t;if(opts[I16]){opts[I16](json);}$[V9t]({labels:u7t,options:u2s,values:o2s,messages:E2s,errors:f16},function(jsonProp,fieldFn){if(json[jsonProp]){$[V9t](json[jsonProp],function(field,val){var J2s=g3t;J2s+=f1t;J2s+=H1t;o8E.D8E();that[J2s](field)[fieldFn](val);});}});$[B2s]([q2s,c2s,j5p,L2s],function(i,key){if(json[key]){that[key](json[key],json[e2p]);}});if(opts[K2s]){var b2s=t16;b2s+=B2p;b2s+=U16;opts[b2s](json);}field[C6t](W6t);};$(field[w2s]())[R2s](opts[v2t] + i16,function(e){var s16="alue";var x16='data';var j16="hen";var D2s=N5t;D2s+=s16;D2s+=y4t;var G2s=p1t;G2s+=r1t;G2s+=a0t;G2s+=y4t;var V2s=p1t;V2s+=G3p;V2s+=y4t;var N2s=p1t;N2s+=r1t;N2s+=a0t;var F2s=h16;F2s+=y4t;var T2s=B0t;T2s+=V5t;T2s+=s6t;T2s+=G1t;if($(field[W16]())[O16](e[y16])[T2s] === F71){return;}o8E.v8E();field[C6t](x6t);var data={};data[F2s]=that[y4t][u46]?_pluck(that[y4t][u46],x16):g7t;data[N2s]=data[V2s]?data[G2s][F71]:g7t;data[D2s]=that[v4p]();if(opts[N8t]){var n2s=H1t;n2s+=o8E.u5t;n2s+=l5t;n2s+=o8E.u5t;var ret=opts[n2s](data);if(ret){var l2s=H1t;l2s+=o8E.u5t;l2s+=l5t;l2s+=o8E.u5t;opts[l2s]=ret;}}if(typeof url === o8E.b5t){var z3s=e16;z3s+=B0t;var o=url[z3s](that,field[v4p](),data,update);if(o){var m3s=r1t;m3s+=Y4t;m3s+=T8p;m3s+=y6t;if(typeof o === m3s && typeof o[P16] === o8E.b5t){var k3s=l5t;k3s+=j16;o[k3s](function(resolved){if(resolved){update(resolved);}});}else {update(o);}}}else {var I3s=A16;I3s+=l5t;if($[I3s](url)){var f3s=V5t;f3s+=p16;f3s+=D5t;f3s+=H1t;$[f3s](ajaxOpts,url);}else {ajaxOpts[v16]=url;}$[o2t]($[S0p](ajaxOpts,{url:url,data:data,success:update}));}});return this;};Editor[h0p][Q16]=function(){var C16="uni";var d16="que";var X16="templ";var r16="lear";var M16="Controller";var g16="templa";var e3s=C16;e3s+=d16;var x3s=T5t;x3s+=H1t;x3s+=l5t;x3s+=V5t;var y3s=r1t;y3s+=m4t;y3s+=m4t;var O3s=r0p;O3s+=M16;var i3s=g16;i3s+=X0t;var U3s=o8E.q5t;U3s+=r16;var t3s=H1t;t3s+=y4p;t3s+=t2t;t3s+=Z3t;if(this[y4t][t3s]){this[q0p]();}this[U3s]();if(this[y4t][i3s]){var W3s=X16;W3s+=o8E.u5t;W3s+=l5t;W3s+=V5t;var h3s=L7t;h3s+=t2t;h3s+=J6t;var s3s=Y4t;s3s+=r1t;s3s+=H1t;s3s+=t0t;$(s3s)[h3s](this[y4t][W3s]);}var controller=this[y4t][O3s];if(controller[Q16]){controller[Q16](this);}$(document)[y3s](x3s + this[y4t][e3s]);o8E.v8E();this[o7t]=g7t;this[y4t]=g7t;};Editor[h0p][P3s]=function(name){var that=this;o8E.v8E();$[V9t](this[S16](name),function(i,n){that[E8p](n)[H16]();});return this;};Editor[j3s][A3s]=function(show){var v3s=C6p;v3s+=V5t;if(show === undefined){var p3s=F4t;p3s+=p1p;p3s+=I4t;return this[y4t][p3s];}return this[show?Z16:v3s]();};Editor[h0p][Q3s]=function(){var C3s=Y16;C3s+=H1t;C3s+=y4t;return $[a16](this[y4t][C3s],function(field,name){o8E.v8E();return field[u16]()?name:g7t;});};Editor[h0p][d3s]=function(){var J16="ntroller";var E16="displayCo";var g3s=o16;g3s+=V5t;var M3s=E16;M3s+=J16;return this[y4t][M3s][g3s](this);};Editor[r3s][X3s]=function(items,arg1,arg2,arg3,arg4){var q16="our";var a3s=g1t;a3s+=B16;a3s+=D5t;var Y3s=m4t;Y3s+=v6t;Y3s+=X8p;o8E.v8E();Y3s+=y4t;var Z3s=C2t;Z3s+=d2t;Z3s+=q16;Z3s+=V4p;var S3s=w0t;S3s+=j1t;var that=this;if(this[S3s](function(){var H3s=V5t;H3s+=H1t;H3s+=l4t;H3s+=l5t;that[H3s](items,arg1,arg2,arg3,arg4);})){return this;}var argOpts=this[o46](arg1,arg2,arg3,arg4);this[c16](items,this[Z3s](Y3s,items),a3s,argOpts[d1p],function(){o8E.D8E();that[L16]();that[K16](argOpts[d1p]);argOpts[b16]();});return this;};Editor[u3s][w16]=function(name){var that=this;$[V9t](this[S16](name),function(i,n){o8E.v8E();that[E8p](n)[w16]();});return this;};Editor[o3s][E3s]=function(name,msg){var N16="_message";var R16="globa";var T16="Erro";var wrapper=$(this[o7t][z7t]);if(msg === undefined){var B3s=R16;B3s+=B0t;B3s+=T16;B3s+=p1t;var J3s=J1t;J3s+=F16;this[N16](this[o7t][J3s],name,x6t,function(){var V16="toggleClass";o8E.D8E();var G16='inFormError';wrapper[V16](G16,name !== undefined && name !== o9t);});this[y4t][B3s]=name;}else {this[E8p](name)[S5p](msg);}return this;};Editor[h0p][E8p]=function(name){var D16="Unknown fiel";var l16=" - ";var n16="d nam";var q3s=g3t;q3s+=f1t;q3s+=i4t;var fields=this[y4t][q3s];if(!fields[name]){var c3s=D16;c3s+=n16;c3s+=V5t;c3s+=l16;throw c3s + name;}return fields[name];};Editor[L3s][K3s]=function(){var b3s=g1t;b3s+=o8E.u5t;b3s+=t2t;return $[b3s](this[y4t][Y8p],function(field,name){o8E.D8E();return name;});};Editor[h0p][z06]=_api_file;Editor[w3s][R3s]=_api_files;Editor[T3s][F3s]=function(name){var G3s=q0t;G3s+=V5t;G3s+=l5t;var that=this;if(!name){var N3s=m4t;N3s+=l4t;N3s+=m06;name=this[N3s]();}if(Array[h1p](name)){var V3s=V5t;V3s+=o8E.u5t;V3s+=o8E.q5t;V3s+=G1t;var out={};$[V3s](name,function(i,n){o8E.D8E();out[n]=that[E8p](n)[Q56]();});return out;}return this[E8p](name)[G3s]();};Editor[D3s][n3s]=function(names,animate){var that=this;$[V9t](this[S16](names),function(i,n){var k06="hide";var l3s=g3t;o8E.v8E();l3s+=f1t;l3s+=H1t;that[l3s](n)[k06](animate);});return this;};Editor[h0p][z9s]=function(includeHash){o8E.D8E();return $[a16](this[y4t][u46],function(edit,idSrc){o8E.D8E();return includeHash === x6t?I06 + idSrc:idSrc;});};Editor[m9s][f06]=function(inNames){var t06="globalError";var k9s=f5p;k9s+=l5t;k9s+=G1t;var formError=$(this[o7t][n7p]);if(this[y4t][t06]){return x6t;}var names=this[S16](inNames);for(var i=F71,ien=names[k9s];i < ien;i++){var I9s=g3t;I9s+=f1t;I9s+=H1t;if(this[I9s](names[i])[f06]()){return x6t;}}o8E.D8E();return W6t;};Editor[h0p][f9s]=function(cell,fieldName,opts){var W06="rmO";var e06="inline";var r06='div.DTE_Field';var P06='individual';var x06="lainObject";var s06="_data";var j9s=C3t;j9s+=U06;var W9s=o8E.o5t;W9s+=o8E.q5t;W9s+=G1t;var h9s=l4t;h9s+=i06;h9s+=C3t;h9s+=V5t;var s9s=s06;s9s+=h06;s9s+=V5t;var i9s=o6t;i9s+=W06;i9s+=O06;i9s+=y4t;var U9s=m9p;U9s+=y06;var t9s=y4p;t9s+=V46;t9s+=x06;var that=this;if($[t9s](fieldName)){opts=fieldName;fieldName=undefined;}opts=$[U9s]({},this[y4t][i9s][e06],opts);var editFields=this[s9s](P06,cell,fieldName);var node,field;var countOuter=F71,countInner;var closed=W6t;var classes=this[M5p][h9s];$[W9s](editFields,function(i,editField){var j06="layF";var v06="Cannot edit more than one row i";var Q06="nline at a ";var x9s=H1t;x9s+=H7t;x9s+=j06;x9s+=A06;var y9s=p06;y9s+=o8E.u5t;y9s+=Y4p;if(countOuter > F71){var O9s=v06;O9s+=Q06;O9s+=C06;throw O9s;}node=$(editField[y9s][F71]);countInner=F71;$[V9t](editField[x9s],function(j,f){var g06="one field inline at a time";var d06="Cannot edit m";o8E.D8E();var M06="ore than ";if(countInner > F71){var e9s=d06;e9s+=M06;e9s+=g06;throw e9s;}field=f;countInner++;});countOuter++;;});if($(r06,node)[h6t]){return this;}if(this[x7p](function(){var X06="inli";var P9s=X06;P9s+=D5t;P9s+=V5t;that[P9s](cell,fieldName,opts);})){return this;}this[c16](cell,editFields,j9s,opts,function(){var c06="div cla";var T06="userAgent";var Z06="rmEr";var R06="contents";var l06="v.";var u06="/d";var E06="rocessing_Indicator\"><spa";var o06="class=\"DTE_P";var b06="tac";var G06='" ';var q06="ppe";var F06='Edge/';var J06="n></span></div>";var Y06="ppend";var N06='style="width:';var a06="iv.";var L06="ss=";var B06="ss=\"";var V06='px"';var m6s=l4t;m6s+=D5t;m6s+=B0t;m6s+=d3t;var z6s=m4t;z6s+=r1t;z6s+=S06;var J9s=Y4t;J9s+=H06;var E9s=m4t;E9s+=r1t;E9s+=Z06;E9s+=i1t;var o9s=D3t;o9s+=g1t;var u9s=o8E.u5t;u9s+=t2t;u9s+=t2t;u9s+=J6t;var a9s=o8E.u5t;a9s+=Y06;var Y9s=b56;Y9s+=D5t;Y9s+=V5t;Y9s+=p1t;var Z9s=H1t;Z9s+=a06;var H9s=K6t;H9s+=u06;H9s+=w6t;var S9s=g7p;S9s+=u06;S9s+=w6t;var X9s=B3t;X9s+=y4t;var r9s=Q0p;r9s+=o06;r9s+=E06;r9s+=J06;var g9s=b56;g9s+=D5t;g9s+=V5t;g9s+=p1t;var M9s=Q0p;M9s+=o8E.q5t;M9s+=r5p;M9s+=B06;var d9s=F9t;d9s+=L6t;var C9s=x2p;C9s+=o8E.u5t;C9s+=q06;C9s+=p1t;var Q9s=K6t;Q9s+=c06;Q9s+=L06;Q9s+=F9t;var v9s=K06;v9s+=m4t;var p9s=H1t;p9s+=V5t;p9s+=b06;p9s+=G1t;var A9s=l4t;A9s+=w06;A9s+=D5t;A9s+=V5t;var namespace=that[K16](opts);var ret=that[B7p](A9s);if(!ret){return that;}var children=node[R06]()[p9s]();var style=navigator[T06][v9s](F06) !== -N71?N06 + node[U6p]() + V06:o9t;node[B0p]($(Q9s + classes[C9s] + d9s + M9s + classes[g9s] + G06 + style + z1p + r9s + e7t + l8t + classes[X9s] + S9s + H9s));node[O16](Z9s + classes[Y9s][U1p](/ /g,D06))[a9s](field[W16]())[u9s](that[o9s][E9s]);if(opts[J9s]){var c9s=K56;c9s+=n06;c9s+=c1t;var q9s=F4t;q9s+=l06;var B9s=g3t;B9s+=D5t;B9s+=H1t;node[B9s](q9s + classes[k56][U1p](/ /g,D06))[B0p](that[o7t][c9s]);}that[z26](function(submitComplete,action){var m26="ic";var T9s=C3t;T9s+=U06;var b9s=V5t;b9s+=z3t;var K9s=o8E.q5t;K9s+=B0t;K9s+=m26;K9s+=q4p;var L9s=r1t;L9s+=m4t;o8E.D8E();L9s+=m4t;closed=x6t;$(document)[L9s](K9s + namespace);if(!submitComplete || action !== b9s){var R9s=o8E.u5t;R9s+=k26;R9s+=H1t;var w9s=l3t;w9s+=b06;w9s+=G1t;node[R06]()[w9s]();node[R9s](children);}that[I26]();return T9s;;});setTimeout(function(){var f26="cli";var F9s=f26;F9s+=E4p;if(closed){return;}o8E.v8E();$(document)[w1t](F9s + namespace,function(e){var i26="Bac";var U26="Sel";var s26="ddB";var t26="targe";var l9s=t26;l9s+=l5t;var n9s=r1t;n9s+=a0t;n9s+=D5t;n9s+=y4t;var D9s=q9p;D9s+=H1t;D9s+=U26;D9s+=m4t;var G9s=g8p;G9s+=i26;G9s+=q4p;o8E.v8E();var V9s=o8E.u5t;V9s+=s26;V9s+=F0p;V9s+=q4p;var N9s=m4t;N9s+=D5t;var back=$[N9s][V9s]?G9s:D9s;if(!field[F7t](n9s,e[y16]) && $[X4p](node[F71],$(e[l9s])[h26]()[back]()) === -N71){that[k7p]();}});},F71);that[W26]([field],opts[z6s]);that[i56](m6s,x6t);});return this;};Editor[h0p][k6s]=function(name,msg){var j26="messa";var e26="_me";var x26="nfo";if(msg === undefined){var f6s=O26;f6s+=g1t;f6s+=y26;f6s+=x26;var I6s=e26;I6s+=P26;I6s+=V5t;this[I6s](this[o7t][f6s],name);}else {var t6s=j26;t6s+=M3t;this[E8p](name)[t6s](msg);}return this;};Editor[h0p][G3t]=function(mode){o8E.D8E();var v26="Changing from ";var p26='Not currently in an editing mode';var C26="e mode is not supported";var s6s=F0p;s6s+=J7p;s6s+=D5t;var i6s=A26;i6s+=w1t;if(!mode){var U6s=o8E.u5t;U6s+=q1p;return this[y4t][U6s];}if(!this[y4t][i6s]){throw new Error(p26);}else if(this[y4t][s6s] === M7t && mode !== M7t){var h6s=v26;h6s+=Q26;h6s+=C26;throw new Error(h6s);}this[y4t][q56]=mode;return this;};Editor[h0p][P8p]=function(){var d26="difie";var W6s=g1t;o8E.v8E();W6s+=r1t;W6s+=d26;W6s+=p1t;return this[y4t][W6s];};Editor[h0p][O6s]=function(fieldNames){var M26="ield";var S26="multiGet";var P6s=m4t;P6s+=M26;var y6s=g26;y6s+=r26;o8E.D8E();y6s+=Z7t;var that=this;if(fieldNames === undefined){fieldNames=this[Y8p]();}if(Array[y6s](fieldNames)){var x6s=V5t;x6s+=F0p;x6s+=G1t;var out={};$[x6s](fieldNames,function(i,name){var e6s=X26;e6s+=B0t;e6s+=H1t;out[name]=that[e6s](name)[S26]();});return out;}return this[P6s](fieldNames)[S26]();};Editor[h0p][j6s]=function(fieldNames,val){var Z26="lain";var A6s=H26;A6s+=Z26;A6s+=B1t;A6s+=Y26;var that=this;o8E.v8E();if($[A6s](fieldNames) && val === undefined){var p6s=o8E.o5t;p6s+=Y4p;$[p6s](fieldNames,function(name,value){var v6s=m4t;v6s+=H46;v6s+=H1t;that[v6s](name)[L8p](value);});}else {var C6s=j3t;C6s+=F1t;C6s+=V5t;C6s+=l5t;var Q6s=m4t;Q6s+=l4t;Q6s+=f1t;Q6s+=H1t;this[Q6s](fieldNames)[C6s](val);}return this;};Editor[h0p][d6s]=function(name){var X6s=D5t;X6s+=r1t;X6s+=H1t;X6s+=V5t;var r6s=m4t;r6s+=l4t;r6s+=V5t;r6s+=X8p;var g6s=g1t;g6s+=o8E.u5t;o8E.D8E();g6s+=t2t;var M6s=g26;M6s+=r26;M6s+=Z7t;var that=this;if(!name){name=this[b8p]();}return Array[M6s](name)?$[g6s](name,function(n){o8E.v8E();return that[E8p](n)[W16]();}):this[r6s](name)[X6s]();};Editor[S6s][H6s]=function(name,fn){var a26="_even";var Y6s=a26;Y6s+=A2t;o8E.D8E();var Z6s=r1t;Z6s+=m4t;Z6s+=m4t;$(this)[Z6s](this[Y6s](name),fn);return this;};Editor[a6s][u6s]=function(name,fn){var u26="eventN";var o6s=u1t;o6s+=u26;o6s+=o8E.u5t;o6s+=W4t;$(this)[w1t](this[o6s](name),fn);return this;};Editor[E6s][J6s]=function(name,fn){var E26="entName";var q6s=o26;q6s+=E26;var B6s=r1t;B6s+=D5t;B6s+=V5t;$(this)[B6s](this[q6s](name),fn);return this;};Editor[c6s][J26]=function(){var q26="_preop";var L26="_disp";var K26="Reorder";var B26="_postop";var c26="Reg";var z8s=B26;z8s+=a1t;var N6s=H1t;N6s+=r1t;N6s+=g1t;var F6s=g1t;F6s+=o8E.u5t;F6s+=C3t;var T6s=q26;T6s+=a1t;var K6s=d46;K6s+=c26;var L6s=L26;L6s+=Y3t;L6s+=K26;var that=this;this[L6s]();this[K6s](function(){var R26="ntroll";var w26="splayCo";var w6s=o8E.q5t;w6s+=B0t;o8E.v8E();w6s+=b26;var b6s=F4t;b6s+=w26;b6s+=R26;b6s+=U3t;that[y4t][b6s][w6s](that,function(){var R6s=c9p;R6s+=C3t;that[I26]();that[J46](U56,[R6s]);});});var ret=this[T6s](F6s);if(!ret){return this;}this[y4t][T26][J26](this,this[N6s][z7t],function(){var F26="Opts";var N26="orde";var l6s=g1t;l6s+=C9t;var n6s=I4t;n6s+=m2t;n6s+=F26;var G6s=N26;G6s+=p1t;var V6s=c9p;o8E.D8E();V6s+=t2t;that[W26]($[V6s](that[y4t][G6s],function(name){var D6s=m4t;D6s+=v6t;o8E.D8E();D6s+=r3t;return that[y4t][D6s][name];}),that[y4t][n6s][T5p]);that[J46](V26,[l6s,that[y4t][q56]]);});this[z8s](G26,W6t);return this;};Editor[m8s][b8p]=function(set){var f36="All fields, and no additional fields, must be provided for ordering.";var D26="_displ";var l26="slic";var n26="ayRe";var m36="sort";var W8s=D26;W8s+=n26;W8s+=b8p;var h8s=L1t;h8s+=K1t;var s8s=l26;s8s+=V5t;var i8s=W4p;i8s+=V4p;var U8s=r1t;U8s+=z36;U8s+=V5t;o8E.v8E();U8s+=p1t;var f8s=g26;f8s+=p1t;f8s+=b0t;var I8s=f5p;I8s+=k0p;if(!set){var k8s=C1t;k8s+=K8p;return this[y4t][k8s];}if(arguments[I8s] && !Array[f8s](set)){var t8s=l26;t8s+=V5t;set=Array[h0p][t8s][T7t](arguments);}if(this[y4t][U8s][i8s]()[m36]()[k36](I36) !== set[s8s]()[m36]()[k36](I36)){throw f36;}$[h8s](this[y4t][b8p],set);this[W8s]();return this;};Editor[O8s][r1p]=function(items,arg1,arg2,arg3,arg4){var h36="Sour";var i36="odi";var W36='initRemove';var U36="ditF";var d8s=t36;d8s+=o8E.u5t;var C8s=o16;C8s+=V5t;var Q8s=m4t;Q8s+=r1t;Q8s+=p1t;Q8s+=g1t;var v8s=V5t;v8s+=U36;v8s+=v6t;v8s+=r3t;var p8s=g1t;p8s+=i36;p8s+=X26;p8s+=p1t;var A8s=Y3p;A8s+=s36;A8s+=V5t;var j8s=o8E.u5t;j8s+=n56;j8s+=w1t;var P8s=m4t;P8s+=A06;var e8s=a0p;e8s+=V8t;e8s+=h36;e8s+=V4p;var x8s=f5p;x8s+=l5t;x8s+=G1t;var y8s=w0t;y8s+=H1t;y8s+=t0t;var that=this;if(this[y8s](function(){that[r1p](items,arg1,arg2,arg3,arg4);})){return this;}if(items[x8s] === undefined){items=[items];}var argOpts=this[o46](arg1,arg2,arg3,arg4);var editFields=this[e8s](P8s,items);this[y4t][j8s]=A8s;this[y4t][p8s]=items;this[y4t][v8s]=editFields;this[o7t][Q8s][p9p][r0p]=c4p;this[E46]();this[J46](W36,[_pluck(editFields,C8s),_pluck(editFields,d8s),items],function(){var y36="tMultiRemo";var O36="ini";o8E.v8E();var M8s=O36;M8s+=y36;M8s+=J3p;that[J46](M8s,[editFields,items],function(){var x36="_assembleMa";var e36="tton";var r8s=r1t;r8s+=t2t;r8s+=l5t;r8s+=y4t;var g8s=x36;g8s+=C3t;that[g8s]();that[K16](argOpts[r8s]);argOpts[b16]();var opts=that[y4t][l8p];if(opts[T5p] !== g7t){var S8s=o6t;S8s+=S06;var X8s=K56;X8s+=e36;$(X8s,that[o7t][k56])[G7p](opts[S8s])[T5p]();}});});return this;};Editor[H8s][v1p]=function(set,val){var Z8s=o8E.o5t;Z8s+=Y4p;var that=this;if(!$[Z4p](set)){var o={};o[set]=val;set=o;}$[Z8s](set,function(n,v){that[E8p](n)[v1p](v);});return this;};Editor[Y8s][a8s]=function(names,animate){var P36="ldName";var u8s=u1t;u8s+=X26;u8s+=P36;u8s+=y4t;o8E.v8E();var that=this;$[V9t](this[u8s](names),function(i,n){var j36="show";that[E8p](n)[j36](animate);});return this;};Editor[h0p][m7p]=function(successCallback,errorCallback,formatdata,hide){var A36="_pro";var Q36="roces";var C36="sin";var B8s=A36;B8s+=p36;var J8s=v36;J8s+=D5t;var E8s=t2t;E8s+=Q36;E8s+=C36;E8s+=q0t;var o8s=g3t;o8s+=m06;var that=this,fields=this[y4t][o8s],errorFields=[],errorReady=F71,sent=W6t;if(this[y4t][E8s] || !this[y4t][J8s]){return this;}this[B8s](x6t);var send=function(){var d36='initSubmit';var c8s=F0p;c8s+=j6t;c8s+=w1t;var q8s=U6t;q8s+=q0t;q8s+=k0p;if(errorFields[q8s] !== errorReady || sent){return;}that[J46](d36,[that[y4t][c8s]],function(result){var M36="_processi";var K8s=u1t;K8s+=c56;K8s+=n0t;K8s+=m2t;if(result === W6t){var L8s=M36;L8s+=d9t;that[L8s](W6t);return;}sent=x6t;that[K8s](successCallback,errorCallback,formatdata,hide);});};this[S5p]();$[V9t](fields,function(name,field){o8E.D8E();var g36="pus";if(field[f06]()){var b8s=g36;b8s+=G1t;errorFields[b8s](name);}});$[V9t](errorFields,function(i,name){fields[name][S5p](o9t,function(){o8E.D8E();errorReady++;send();});});send();return this;};Editor[w8s][R8s]=function(set){var S36="late";var X36="temp";var F8s=l5t;F8s+=V5t;F8s+=g1t;F8s+=r36;if(set === undefined){var T8s=X36;T8s+=S36;return this[y4t][T8s];}this[y4t][F8s]=set === g7t?g7t:$(set);return this;};Editor[N8s][V8s]=function(title){var H36="unct";var Z36="sse";var Y36="hildren";var n8s=m4t;n8s+=H36;n8s+=L3t;var D8s=y5p;D8s+=Z36;D8s+=y4t;var G8s=o8E.q5t;G8s+=Y36;var header=$(this[o7t][e8p])[G8s](a36 + this[D8s][e8p][J0p]);if(title === undefined){return header[P4p]();}o8E.D8E();if(typeof title === n8s){var z7s=l5t;z7s+=C8t;z7s+=B0t;z7s+=V5t;var l8s=O8p;l8s+=l4t;title=title(this,new DataTable[l8s](this[y4t][z7s]));}header[P4p](title);return this;};Editor[h0p][v4p]=function(field,value){if(value !== undefined || $[Z4p](field)){return this[v1p](field,value);}return this[Q56](field);;};var apiRegister=DataTable[u36][m7s];function __getInst(api){var E36="context";var o36="nit";var I7s=I4t;I7s+=l4t;I7s+=l5t;o8E.D8E();I7s+=C1t;var k7s=r1t;k7s+=y26;k7s+=o36;var ctx=api[E36][F71];return ctx[k7s][I7s] || ctx[J36];}function __setBasic(inst,opts,type,plural){var K36=/%d/;var b36='1';o8E.D8E();var B36="_ba";var i7s=W4t;i7s+=Q3t;var f7s=Y4t;f7s+=w5p;f7s+=h2t;f7s+=M1t;if(!opts){opts={};}if(opts[f7s] === undefined){var U7s=B36;U7s+=E1t;var t7s=K56;t7s+=V56;t7s+=M1t;opts[t7s]=U7s;}if(opts[q36] === undefined){opts[q36]=inst[q8t][type][q36];}if(opts[i7s] === undefined){if(type === c36){var s7s=l4t;s7s+=R5t;s7s+=o8E.B5t;s7s+=D5t;var confirm=inst[s7s][type][L36];opts[A7t]=plural !== N71?confirm[u1t][U1p](K36,plural):confirm[b36];}else {opts[A7t]=o9t;}}return opts;}apiRegister(h7s,function(){return __getInst(this);});apiRegister(w36,function(opts){var O7s=o8E.q5t;O7s+=p1t;O7s+=V5t;O7s+=Y0t;var W7s=R36;W7s+=T36;o8E.D8E();var inst=__getInst(this);inst[W7s](__setBasic(inst,opts,O7s));return this;});apiRegister(y7s,function(opts){var x7s=V5t;x7s+=z3t;var inst=__getInst(this);inst[B8p](this[F71][F71],__setBasic(inst,opts,x7s));return this;});apiRegister(e7s,function(opts){var inst=__getInst(this);inst[B8p](this[F71],__setBasic(inst,opts,F36));return this;});apiRegister(N36,function(opts){var j7s=H5p;j7s+=V5t;var P7s=J3t;P7s+=V36;o8E.v8E();var inst=__getInst(this);inst[P7s](this[F71][F71],__setBasic(inst,opts,j7s,N71));return this;});apiRegister(A7s,function(opts){var G36="emove";var v7s=u3t;v7s+=d9t;v7s+=k0p;var p7s=p1t;p7s+=G36;var inst=__getInst(this);inst[r1p](this[F71],__setBasic(inst,opts,p7s,this[F71][v7s]));return this;});apiRegister(Q7s,function(type,opts){if(!type){var C7s=l4t;C7s+=i06;C7s+=d3t;type=C7s;}else if($[Z4p](type)){opts=type;type=D36;}__getInst(this)[type](this[F71][F71],opts);o8E.v8E();return this;});apiRegister(d7s,function(opts){o8E.v8E();__getInst(this)[e7p](this[F71],opts);return this;});apiRegister(n36,_api_file);apiRegister(l36,_api_files);$(document)[M7s](g7s,function(e,ctx,json){var m96="spac";var z96="ame";var X7s=H1t;X7s+=l5t;var r7s=D5t;r7s+=z96;r7s+=m96;r7s+=V5t;if(e[r7s] !== X7s){return;}if(json && json[D9t]){$[V9t](json[D9t],function(name,files){var H7s=m4t;o8E.D8E();H7s+=k96;H7s+=V5t;H7s+=y4t;if(!Editor[D9t][name]){var S7s=g3t;S7s+=u3t;S7s+=y4t;Editor[S7s][name]={};}$[S0p](Editor[H7s][name],files);});}});Editor[Z7s]=function(msg,tn){var f96="r to https://datatables.net/tn/";var I96=" For more information, please refe";var Y7s=I96;Y7s+=f96;throw tn?msg + Y7s + tn:msg;};Editor[a7s]=function(data,props,fn){var t96="isAr";var i96="ainO";var o7s=t96;o7s+=b0t;var u7s=L1t;u7s+=K1t;var i,ien,dataPoint;props=$[u7s]({label:u7t,value:U96},props);if(Array[o7s](data)){var E7s=B0t;E7s+=a1t;E7s+=F1p;E7s+=G1t;for((i=F71,ien=data[E7s]);i < ien;i++){var J7s=H26;J7s+=B0t;J7s+=i96;J7s+=Y26;dataPoint=data[i];if($[J7s](dataPoint)){var q7s=o8E.u5t;q7s+=l5t;q7s+=l5t;q7s+=p1t;var B7s=v4p;B7s+=m4p;fn(dataPoint[props[B7s]] === undefined?dataPoint[props[I7t]]:dataPoint[props[s96]],dataPoint[props[I7t]],i,dataPoint[q7s]);}else {fn(dataPoint,dataPoint,i);}}}else {var c7s=V5t;c7s+=o8E.u5t;c7s+=o8E.q5t;c7s+=G1t;i=F71;$[c7s](data,function(key,val){o8E.D8E();fn(val,key,i);i++;});}};Editor[L7s]=function(id){var K7s=G4p;o8E.D8E();K7s+=r5p;K7s+=V4p;return id[K7s](/\./g,I36);};Editor[b7s]=function(editor,conf,files,progressCallback,completeCallback){var y96="<i>Uploading f";var h96="_lim";var O96="oad";var O66="_limitLe";var A96="fileReadText";var e96="A ";var j96="er error occurred while uploading the file";var x96="ile</i>";var q96="readAsDataURL";var W96="tLeft";var P96="serv";var b5o=h96;b5o+=l4t;b5o+=W96;var F7s=w1t;F7s+=B0t;F7s+=O96;var T7s=y96;T7s+=x96;var w7s=B1p;o8E.v8E();w7s+=r46;w7s+=L3t;var reader=new FileReader();var counter=F71;var ids=[];var generalError=e96;generalError+=P96;generalError+=j96;editor[S5p](conf[w8t],o9t);if(typeof conf[o2t] === w7s){conf[o2t](files,function(ids){var R7s=o8E.q5t;R7s+=o8E.u5t;R7s+=B0t;R7s+=B0t;completeCallback[R7s](editor,ids);});return;}progressCallback(conf,conf[A96] || T7s);reader[F7s]=function(e){var L96='post';var B96='preUpload';var g96='upload';var E96="Upload feature cannot use `ajax.data` wi";var a96="ja";var X96="aja";var M96="act";var c96='preSubmit.DTE_Upload';var p96="xD";var Z96="jax";var J96="th an object. Please use it as a function instead.";var S96="upl";var o96="specified for upload plug-";var C96="adFiel";var u96="No Ajax option ";var x5o=r1t;x5o+=D5t;var O5o=D5t;O5o+=o8E.u5t;O5o+=g1t;O5o+=V5t;var h5o=H1t;h5o+=o8E.u5t;h5o+=l5t;h5o+=o8E.u5t;var i5o=H1t;i5o+=o8E.u5t;i5o+=l5t;i5o+=o8E.u5t;var U5o=y4t;U5o+=n4p;U5o+=l4t;U5o+=d9t;var n7s=F8p;n7s+=o8E.u5t;n7s+=p96;n7s+=V8t;var D7s=D5t;D7s+=v96;D7s+=V5t;var G7s=T1t;G7s+=Q96;G7s+=C96;G7s+=H1t;var V7s=d96;V7s+=o4p;V7s+=o8E.u5t;V7s+=H1t;var N7s=M96;N7s+=l4t;N7s+=w1t;var data=new FormData();var ajax;data[B0p](N7s,V7s);data[B0p](G7s,conf[D7s]);data[B0p](g96,files[counter]);if(conf[n7s]){var l7s=o8E.u5t;l7s+=T8p;l7s+=N8p;l7s+=r96;conf[l7s](data,files[counter],counter);}if(conf[o2t]){var z5o=X96;z5o+=t4t;ajax=conf[z5o];}else if($[Z4p](editor[y4t][o2t])){var I5o=S96;I5o+=H96;I5o+=H1t;var k5o=X96;k5o+=t4t;var m5o=o8E.u5t;m5o+=Z96;ajax=editor[y4t][m5o][Y96]?editor[y4t][k5o][I5o]:editor[y4t][o2t];}else if(typeof editor[y4t][o2t] === l56){var f5o=o8E.u5t;f5o+=a96;f5o+=t4t;ajax=editor[y4t][f5o];}if(!ajax){var t5o=u96;t5o+=o96;t5o+=C3t;throw new Error(t5o);}if(typeof ajax === U5o){ajax={url:ajax};}if(typeof ajax[i5o] === o8E.b5t){var s5o=o8E.o5t;s5o+=Y4p;var d={};var ret=ajax[N8t](d);if(ret !== undefined && typeof ret !== l56){d=ret;}$[s5o](d,function(key,value){o8E.D8E();data[B0p](key,value);});}else if($[Z4p](ajax[h5o])){var W5o=E96;W5o+=J96;throw new Error(W5o);}var preRet=editor[J46](B96,[conf[O5o],files[counter],data]);if(preRet === W6t){var y5o=u3t;y5o+=D5t;y5o+=F1p;y5o+=G1t;if(counter < files[y5o] - N71){counter++;reader[q96](files[counter]);}else {completeCallback[T7t](editor,ids);}return;}var submit=W6t;editor[x5o](c96,function(){submit=x6t;return W6t;});$[o2t]($[S0p]({},ajax,{type:L96,data:data,dataType:n46,contentType:W6t,processData:W6t,xhr:function(){var b96="gs";var w96="onl";var K96="ajaxSettin";var R96="progress";var P5o=t4t;P5o+=G1t;P5o+=p1t;var e5o=K96;e5o+=b96;var xhr=$[e5o][P5o]();if(xhr[Y96]){var C5o=w96;C5o+=H96;C5o+=P9p;C5o+=H1t;var j5o=w1t;j5o+=R96;xhr[Y96][j5o]=function(e){var F96="toFixed";var T96="gthComputa";var V96=':';var N96="%";var A5o=U6t;A5o+=T96;A5o+=K3t;if(e[A5o]){var Q5o=U6t;Q5o+=q0t;Q5o+=k0p;var v5o=E2t;v5o+=o8E.u5t;v5o+=B0t;var p5o=o4p;p5o+=o8E.u5t;p5o+=l3t;p5o+=H1t;var percent=(e[p5o] / e[v5o] * d5t)[F96](F71) + N96;progressCallback(conf,files[Q5o] === N71?percent:counter + V96 + files[h6t] + m7t + percent);}};xhr[Y96][C5o]=function(e){var G96="processingText";var D96='Processing';progressCallback(conf,conf[G96] || D96);};}return xhr;},success:function(json){var h66="AsDataURL";var f66="dXhrSuccess";var m66="Er";var l96="fieldErro";o8E.v8E();var i66="stat";var k66="rors";var t66="reSubmit.DTE_Upload";var Z5o=l4t;Z5o+=H1t;var H5o=T1t;H5o+=t2t;H5o+=n96;H5o+=H1t;var X5o=l96;X5o+=z66;var r5o=E8p;r5o+=m66;r5o+=k66;var g5o=D5t;g5o+=o8E.u5t;g5o+=g1t;g5o+=V5t;var M5o=I66;M5o+=f66;var d5o=t2t;d5o+=t66;editor[V9p](d5o);editor[J46](M5o,[conf[g5o],json]);if(json[r5o] && json[X5o][h6t]){var errors=json[U66];for(var i=F71,ien=errors[h6t];i < ien;i++){var S5o=i66;S5o+=T1t;S5o+=y4t;editor[S5p](errors[i][w8t],errors[i][S5o]);}}else if(json[S5p]){editor[S5p](json[S5p]);}else if(!json[H5o] || !json[Y96][Z5o]){var Y5o=D5t;Y5o+=o8E.u5t;Y5o+=g1t;Y5o+=V5t;editor[S5p](conf[Y5o],generalError);}else {var E5o=B0t;E5o+=d8p;E5o+=l5t;E5o+=G1t;if(json[D9t]){var a5o=o8E.o5t;a5o+=o8E.q5t;a5o+=G1t;$[a5o](json[D9t],function(table,files){o8E.D8E();var o5o=m9p;o5o+=X0t;o5o+=D5t;o5o+=H1t;if(!Editor[D9t][table]){var u5o=m4t;u5o+=k96;u5o+=V5t;u5o+=y4t;Editor[u5o][table]={};}$[o5o](Editor[D9t][table],files);});}ids[t6t](json[Y96][R8t]);if(counter < files[E5o] - N71){var J5o=s66;J5o+=h66;counter++;reader[J5o](files[counter]);}else {var B5o=o8E.q5t;B5o+=o8E.u5t;B5o+=B0t;B5o+=B0t;completeCallback[B5o](editor,ids);if(submit){var q5o=y4t;q5o+=z46;q5o+=m2t;editor[q5o]();}}}progressCallback(conf);},error:function(xhr){var W66='uploadXhrError';var K5o=g8t;K5o+=W4t;var L5o=o26;L5o+=V5t;L5o+=D5t;L5o+=l5t;var c5o=D5t;c5o+=o8E.u5t;c5o+=g1t;c5o+=V5t;editor[S5p](conf[c5o],generalError);editor[L5o](W66,[conf[K5o],xhr]);progressCallback(conf);}}));};files=$[a16](files,function(val){return val;});if(conf[b5o] !== undefined){var R5o=u3t;R5o+=s6t;R5o+=G1t;var w5o=O66;w5o+=m4t;w5o+=l5t;files[w8p](conf[w5o],files[R5o]);}reader[q96](files[F71]);};Editor[T5o][K9t]=function(init){var l66="odels";var W86="rl";var j66="t.dt";var k86="tem";var E66="<div data-dte-e=";var d66="conte";var e66="uniq";var Z86="crea";var t86="aSource";var G86='initComplete';var D66="niq";var m86="lasses";var u66="orm>";var A86='<div data-dte-e="processing" class="';var o66="></div>";var r66="hea";var z86="i18";var T86="init";var X66="\">";var f86="dataSourc";var K86='init.dt.dte';var S66="</di";var U86="tab";var r86='"><div class="';var L66="oot";var v86='<div data-dte-e="body_content" class="';var p66="proce";var x66="gge";var a66="ror\" class=\"";var g66="rappe";var V66="</span>";var E86="events";var J66="\"form_content\" ";var p86="indicator";var g86='<div data-dte-e="head" class="';var i86="omTab";var D86='initEditor';var L86='body_content';var M86='<div data-dte-e="form_info" class="';var A66="iq";var C86='<form data-dte-e="form" class="';var S86='<div data-dte-e="form_buttons" class="';var Z66=" data-dte-e=\"for";var y86="nName";var q86="formContent";var M66="eader";var x86="efaul";var G66="</div>";var Q66="rm_content";var w86="nTable";var b66="\"></di";var y66="ri";var Q86='<div data-dte-e="foot" class="';var T66="bod";var P66="hr.d";var F66="y\" class=\"";var n66="tin";var Y66="m_er";var d86="tag";var v66="foo";var X86='"></div></div>';var c66="></div";var w66="<div data-dte-";var N66="span>";var s1o=l5t;s1o+=y66;s1o+=x66;s1o+=p1t;var i1o=u1t;i1o+=V5t;i1o+=J3p;i1o+=z5p;var f1o=e66;f1o+=m4p;var I1o=t4t;I1o+=P66;I1o+=j66;I1o+=V5t;var z1o=v3p;z1o+=A66;z1o+=T1t;z1o+=V5t;var n4o=m4t;n4o+=v6t;n4o+=B0t;n4o+=i4t;var D4o=k2t;D4o+=p36;var G4o=p66;G4o+=V0t;G4o+=l4p;var V4o=Y4t;V4o+=B3p;var N4o=m4t;N4o+=r1t;N4o+=r1t;N4o+=l5t;var F4o=v66;F4o+=X0t;F4o+=p1t;var T4o=o6t;T4o+=Q66;var R4o=t2p;R4o+=w0p;var L4o=o8E.o5t;L4o+=Y4p;var u4o=N8t;u4o+=V1t;u4o+=n1p;u4o+=V5t;var a4o=C66;a4o+=D5t;a4o+=y4t;var Y4o=d66;Y4o+=z5p;var Z4o=G1t;Z4o+=M66;var H4o=a0t;H4o+=g66;H4o+=p1t;var S4o=r66;S4o+=H1t;S4o+=U3t;var X4o=l4t;X4o+=D5t;X4o+=m4t;X4o+=r1t;var r4o=X66;r4o+=S66;r4o+=T6t;var g4o=H66;g4o+=Z66;g4o+=Y66;g4o+=a66;var M4o=K6t;M4o+=b6t;M4o+=m4t;M4o+=u66;var d4o=F9t;d4o+=o66;var C4o=A6p;C4o+=l5t;var Q4o=o6t;Q4o+=p1t;Q4o+=g1t;var v4o=E66;v4o+=J66;v4o+=B66;var p4o=m4t;p4o+=r1t;p4o+=q66;var A4o=F9t;A4o+=c66;A4o+=L6t;var j4o=m4t;j4o+=L66;j4o+=V5t;j4o+=p1t;var P4o=F9t;P4o+=L6t;var e4o=m4t;e4o+=K66;e4o+=l5t;e4o+=U3t;var x4o=b66;x4o+=T6t;var y4o=g9p;y4o+=t2t;y4o+=V5t;y4o+=p1t;var O4o=w66;O4o+=R66;O4o+=T66;O4o+=F66;var W4o=g7p;W4o+=N66;W4o+=V66;W4o+=G66;var h4o=T1t;h4o+=D66;h4o+=T1t;h4o+=V5t;var s4o=v1p;s4o+=n66;s4o+=q0t;s4o+=y4t;var i4o=g1t;i4o+=l66;var U4o=z86;U4o+=D5t;var t4o=o8E.q5t;t4o+=m86;var f4o=k86;f4o+=r36;var I4o=G1t;I4o+=l5t;I4o+=I86;var k4o=f86;k4o+=v5p;var m4o=H1t;m4o+=N1t;m4o+=t86;m4o+=y4t;var z4o=U86;z4o+=u3t;var l5o=H1t;l5o+=i86;l5o+=B0t;l5o+=V5t;var n5o=l4t;n5o+=s86;n5o+=h86;var D5o=o2t;D5o+=f4p;D5o+=W86;var G5o=D3t;G5o+=g1t;G5o+=O86;G5o+=u3t;o8E.v8E();var V5o=v36;V5o+=y86;var N5o=M46;N5o+=f1t;N5o+=y4t;var F5o=H1t;F5o+=x86;F5o+=l5t;F5o+=y4t;init=$[S0p](x6t,{},Editor[F5o],init);this[y4t]=$[S0p](x6t,{},Editor[N5o][b8t],{actionName:init[V5o],table:init[G5o] || init[c1p],dbTable:init[e86] || g7t,ajaxUrl:init[D5o],ajax:init[o2t],idSrc:init[n5o],dataSource:init[l5o] || init[z4o]?Editor[m4o][B9t]:Editor[k4o][I4o],formOptions:init[P0p],legacyAjax:init[P86],template:init[j86]?$(init[f4o])[e4p]():g7t});this[t4o]=$[S0p](x6t,{},Editor[M5p]);this[q8t]=init[U4o];Editor[i4o][s4o][h4o]++;var that=this;var classes=this[M5p];this[o7t]={"wrapper":$(l8t + classes[z7t] + U7t + A86 + classes[C6t][p86] + W4o + O4o + classes[k6p][y4o] + U7t + v86 + classes[k6p][J0p] + x4o + e7t + Q86 + classes[e4o][z7t] + P4o + l8t + classes[j4o][J0p] + A4o + e7t + e7t)[F71],"form":$(C86 + classes[p4o][d86] + U7t + v4o + classes[Q4o][C4o] + d4o + M4o)[F71],"formError":$(g4o + classes[J1t][S5p] + r4o)[F71],"formInfo":$(M86 + classes[J1t][X4o] + j7t)[F71],"header":$(g86 + classes[S4o][H4o] + r86 + classes[Z4o][Y4o] + X86)[F71],"buttons":$(S86 + classes[J1t][a4o] + j7t)[F71]};if($[J9t][u4o][H86]){var q4o=J3t;q4o+=E3p;q4o+=J3p;var B4o=I4t;B4o+=m2t;var J4o=Z86;J4o+=l5t;J4o+=V5t;var E4o=V5t;E4o+=F0p;E4o+=G1t;var o4o=Y86;o4o+=n1p;o4o+=V5t;var ttButtons=$[J9t][o4o][H86][a86];var i18n=this[q8t];$[E4o]([J4o,B4o,q4o],function(i,val){var o86="sButtonText";var c4o=I4t;c4o+=u86;ttButtons[c4o + val][o86]=i18n[val][B3t];});}$[L4o](init[E86],function(evt,fn){var K4o=r1t;o8E.v8E();K4o+=D5t;that[K4o](evt,function(){var J86="ift";var w4o=y4t;w4o+=G1t;w4o+=J86;var b4o=o8E.q5t;b4o+=o8E.u5t;b4o+=B0t;b4o+=B0t;var args=Array[h0p][W0p][b4o](arguments);o8E.D8E();args[w4o]();fn[B86](that,args);});});var dom=this[o7t];var wrapper=dom[R4o];dom[q86]=_editor_el(T4o,dom[J1t])[F71];dom[F4o]=_editor_el(N4o,wrapper)[F71];dom[V4o]=_editor_el(p2p,wrapper)[F71];dom[c86]=_editor_el(L86,wrapper)[F71];dom[G4o]=_editor_el(D4o,wrapper)[F71];if(init[n4o]){var l4o=o8E.u5t;l4o+=H1t;l4o+=H1t;this[l4o](init[Y8p]);}$(document)[w1t](K86 + this[y4t][z1o],function(e,settings,json){var k1o=U86;o8E.v8E();k1o+=u3t;var m1o=l5t;m1o+=b86;if(that[y4t][m1o] && settings[w86] === $(that[y4t][k1o])[Q56](F71)){settings[J36]=that;}})[w1t](I1o + this[y4t][f1o],function(e,settings,json){if(json && that[y4t][c1p] && settings[w86] === $(that[y4t][c1p])[Q56](F71)){that[R86](json);}});try{var t1o=H3t;t1o+=r5p;t1o+=t0t;this[y4t][T26]=Editor[t1o][init[r0p]][T86](this);}catch(e){var F86="Cannot find display co";var V86="r ";var N86="ntrolle";var U1o=F86;U1o+=N86;U1o+=V86;throw U1o + init[r0p];}this[i1o](G86,[]);$(document)[s1o](D86,[this]);};Editor[h1o][E46]=function(){var n86="moveCl";var z76="mov";o8E.D8E();var l86="actions";var P1o=V5t;P1o+=F4t;P1o+=l5t;var e1o=p1t;e1o+=a56;e1o+=K4t;var x1o=o8E.q5t;x1o+=p1t;x1o+=V5t;x1o+=Y0t;var y1o=p1t;y1o+=V5t;y1o+=n86;y1o+=Y5p;var O1o=F0p;O1o+=h8p;var W1o=o8E.q5t;W1o+=u3p;W1o+=v5p;var classesActions=this[W1o][l86];var action=this[y4t][O1o];var wrapper=$(this[o7t][z7t]);wrapper[y1o]([classesActions[x1o],classesActions[B8p],classesActions[e1o]][k36](m7t));if(action === Y46){wrapper[v2p](classesActions[Y46]);}else if(action === P1o){wrapper[v2p](classesActions[B8p]);}else if(action === r1p){var j1o=p1t;j1o+=V5t;j1o+=z76;j1o+=V5t;wrapper[v2p](classesActions[j1o]);}};Editor[h0p][A1o]=function(data,success,error,submitParams){var k76="Body";var Q76=',';var M76=/_id_/;var H76="complete";var E76='?';var U76="ditFi";var i76="OST";var C76="Of";var a76='DELETE';var f76="nct";var m76="delete";var I76="tri";var Y76="shif";var o76="param";var u76="xOf";var r76="plit";var p76="ajaxUrl";var v76='idSrc';var V1o=m76;V1o+=k76;var N1o=m76;N1o+=k76;var R1o=s4t;R1o+=l5t;R1o+=o8E.u5t;var w1o=T1t;w1o+=p1t;w1o+=B0t;var u1o=y4t;u1o+=I76;u1o+=d9t;var H1o=m4t;H1o+=T1t;H1o+=f76;H1o+=L3t;var X1o=g26;X1o+=p1t;X1o+=t76;X1o+=t0t;var r1o=V5t;r1o+=U76;r1o+=f1t;r1o+=i4t;var g1o=J3t;g1o+=g1t;g1o+=r1t;g1o+=J3p;var M1o=V5t;M1o+=H1t;M1o+=l4t;M1o+=l5t;var v1o=T8p;v1o+=y4t;v1o+=r1t;v1o+=D5t;var p1o=V46;p1o+=i76;var that=this;var action=this[y4t][q56];var thrown;var opts={type:p1o,dataType:v1o,data:g7t,error:[function(xhr,text,err){o8E.v8E();thrown=err;}],success:[],complete:[function(xhr,text){var j76="responseJSON";var W76="eT";var P76="responseJSO";var A76="responseText";var x76="parse";var h76="pons";var M5t=204;var y76='null';var e76="JS";o8E.D8E();var Q1o=s76;Q1o+=h76;Q1o+=W76;Q1o+=S1t;var json=g7t;if(xhr[O76] === M5t || xhr[Q1o] === y76){json={};}else {try{var d1o=x76;d1o+=e76;d1o+=B1t;d1o+=l1t;var C1o=P76;C1o+=l1t;json=xhr[C1o]?xhr[j76]:$[d1o](xhr[A76]);}catch(e){}}if($[Z4p](json) || Array[h1p](json)){success(json,xhr[O76] >= g5t,xhr);}else {error(xhr,text,thrown);}}]};var a;var ajaxSrc=this[y4t][o2t] || this[y4t][p76];var id=action === M1o || action === g1o?_pluck(this[y4t][r1o],v76):g7t;if(Array[X1o](id)){var S1o=T8p;S1o+=r1t;S1o+=l4t;S1o+=D5t;id=id[S1o](Q76);}if($[Z4p](ajaxSrc) && ajaxSrc[action]){ajaxSrc=ajaxSrc[action];}if(typeof ajaxSrc === H1o){var uri=g7t;var method=g7t;if(this[y4t][p76]){var a1o=N4p;a1o+=V4p;var Y1o=M9p;Y1o+=V5t;Y1o+=t4t;Y1o+=C76;var Z1o=Q26;Z1o+=V5t;var url=this[y4t][p76];if(url[Z1o]){uri=url[action];}if(uri[Y1o](m7t) !== -N71){a=uri[d76](m7t);method=a[F71];uri=a[N71];}uri=uri[a1o](M76,id);}ajaxSrc(method,uri,data,success,error);return;}else if(typeof ajaxSrc === u1o){if(ajaxSrc[g76](m7t) !== -N71){var J1o=V8p;J1o+=B0t;var E1o=l5t;E1o+=t0t;E1o+=S4t;var o1o=y4t;o1o+=r76;a=ajaxSrc[o1o](m7t);opts[E1o]=a[F71];opts[J1o]=a[N71];}else {opts[v16]=ajaxSrc;}}else {var b1o=m9p;b1o+=y06;var q1o=o8E.q5t;q1o+=X76;q1o+=v3t;q1o+=V5t;var B1o=V5t;B1o+=S76;var optsCopy=$[B1o]({},ajaxSrc || ({}));if(optsCopy[q1o]){opts[H76][y0p](optsCopy[H76]);delete optsCopy[H76];}if(optsCopy[S5p]){var K1o=V5t;K1o+=Z76;var L1o=V5t;L1o+=Z76;var c1o=v3p;c1o+=Y76;c1o+=l5t;opts[S5p][c1o](optsCopy[L1o]);delete optsCopy[K1o];}opts=$[b1o]({},opts,optsCopy);}opts[v16]=opts[w1o][U1p](M76,id);if(opts[R1o]){var F1o=S1t;F1o+=V5t;F1o+=K1t;var T1o=H1t;T1o+=o8E.u5t;T1o+=l5t;T1o+=o8E.u5t;var isFn=typeof opts[N8t] === o8E.b5t;var newData=isFn?opts[N8t](data):opts[T1o];data=isFn && newData?newData:$[F1o](x6t,data,newData);}opts[N8t]=data;if(opts[W3t] === a76 && (opts[N1o] === undefined || opts[V1o] === x6t)){var n1o=s4t;n1o+=l9t;var D1o=C3t;D1o+=H1t;D1o+=V5t;D1o+=u76;var G1o=H1t;G1o+=o8E.u5t;G1o+=l5t;G1o+=o8E.u5t;var params=$[o76](opts[G1o]);opts[v16]+=opts[v16][D1o](E76) === -N71?E76 + params:k1p + params;delete opts[n1o];}$[o2t](opts);};Editor[h0p][K3p]=function(target,style,time,callback){var z0o=x6p;z0o+=V5t;o8E.v8E();var l1o=m4t;l1o+=D5t;if($[l1o][z0o]){var m0o=y4t;m0o+=l5t;m0o+=a4p;target[m0o]()[e2p](style,time,callback);}else {var I0o=J76;I0o+=B76;I0o+=w1t;var k0o=o8E.q5t;k0o+=V0t;target[k0o](style);if(typeof time === I0o){time[T7t](target);}else if(callback){var f0o=o7p;f0o+=B0t;f0o+=B0t;callback[f0o](target);}}};Editor[t0o][L16]=function(){var c76="Content";var q76="rmInf";var x0o=m4t;x0o+=r1t;x0o+=p1t;x0o+=g1t;var y0o=L7t;o8E.v8E();y0o+=t2t;y0o+=J6t;var O0o=o6t;O0o+=q76;O0o+=r1t;var W0o=o8E.u5t;W0o+=U2p;W0o+=V5t;W0o+=K1t;var h0o=k6p;h0o+=c76;var s0o=o8E.u5t;s0o+=U2p;s0o+=J6t;var i0o=o6t;i0o+=r1t;i0o+=X0t;i0o+=p1t;var U0o=b6p;U0o+=W8p;U0o+=V5t;U0o+=p1t;var dom=this[o7t];$(dom[z7t])[l7p](dom[U0o]);$(dom[i0o])[B0p](dom[n7p])[s0o](dom[k56]);$(dom[h0o])[W0o](dom[O0o])[y0o](dom[x0o]);};Editor[e0o][I7p]=function(){var w76="nBl";var K76="nction";var b76="reBlur";var Q0o=i2p;Q0o+=z7p;Q0o+=V5t;var v0o=c56;v0o+=L76;var p0o=J76;p0o+=K76;var A0o=t2t;A0o+=b76;var j0o=r1t;j0o+=w76;j0o+=T1t;j0o+=p1t;var P0o=V5t;P0o+=F4t;P0o+=R76;P0o+=y4t;var opts=this[y4t][P0o];var onBlur=opts[j0o];if(this[J46](A0o) === W6t){return;}if(typeof onBlur === p0o){onBlur(this);}else if(onBlur === v0o){this[m7p]();}else if(onBlur === Q0o){this[d46]();}};Editor[C0o][d0o]=function(errorsOnly){var S0o=V5t;S0o+=o8E.u5t;S0o+=Y4p;var X0o=g9p;X0o+=S4t;X0o+=p1t;var r0o=Y16;r0o+=H1t;r0o+=y4t;var g0o=V5t;g0o+=r26;g0o+=C1t;var M0o=o8E.q5t;M0o+=u3p;M0o+=v5p;if(!this[y4t]){return;}var errorClass=this[M0o][E8p][g0o];var fields=this[y4t][r0o];if(errorsOnly === undefined){errorsOnly=W6t;}$(a36 + errorClass,this[o7t][X0o])[Z56](errorClass);$[S0o](fields,function(name,field){var T76="mess";var H0o=U3t;H0o+=i1t;o8E.D8E();field[H0o](o9t);if(!errorsOnly){var Z0o=T76;Z0o+=C5p;field[Z0o](o9t);}});this[S5p](o9t);if(!errorsOnly){this[A7t](o9t);}};Editor[h0p][d46]=function(submitComplete,mode){var D76="r-focus";var N76="played";var z5q="closeCb";var k5q="Cb";var G76="dito";var V76="us.e";var l76='preClose';var c0o=F76;c0o+=y4t;c0o+=V5t;var q0o=u1t;q0o+=V5t;q0o+=J3p;q0o+=z5p;var B0o=F4t;B0o+=y4t;B0o+=N76;var J0o=N5p;J0o+=V76;J0o+=G76;J0o+=D76;var E0o=Y4t;E0o+=r1t;E0o+=H1t;E0o+=t0t;var o0o=o8E.q5t;o0o+=o4p;o0o+=y4t;o0o+=n76;var Y0o=u1t;Y0o+=v2t;var closed;if(this[Y0o](l76) === W6t){return;}if(this[y4t][z5q]){var u0o=F76;u0o+=m5q;var a0o=o8E.q5t;a0o+=O2p;a0o+=k5q;closed=this[y4t][a0o](submitComplete,mode);this[y4t][u0o]=g7t;}if(this[y4t][o0o]){this[y4t][I5q]();this[y4t][I5q]=g7t;}$(E0o)[V9p](J0o);this[y4t][B0o]=W6t;this[q0o](c0o);if(closed){var L0o=u1t;L0o+=V5t;L0o+=J3p;L0o+=z5p;this[L0o](U56,[closed]);}};Editor[h0p][z26]=function(fn){var K0o=o8E.q5t;K0o+=B0t;K0o+=r1t;K0o+=m5q;this[y4t][K0o]=fn;};Editor[b0o][w0o]=function(arg1,arg2,arg3,arg4){var f5q="formOp";var U5q="main";var t5q="lean";var F0o=f5q;F0o+=J7p;F0o+=D5t;F0o+=y4t;var T0o=Y4t;T0o+=K66;T0o+=t5q;var R0o=A16;R0o+=l5t;var that=this;var title;var buttons;var show;var opts;if($[R0o](arg1)){opts=arg1;}else if(typeof arg1 === T0o){show=arg1;opts=arg2;;}else {title=arg1;buttons=arg2;show=arg3;opts=arg4;;}if(show === undefined){show=x6t;}if(title){that[q36](title);}if(buttons){that[k56](buttons);}return {opts:$[S0p]({},this[y4t][F0o][U5q],opts),maybeOpen:function(){o8E.D8E();if(show){that[J26]();}}};};Editor[h0p][N0o]=function(name){var s5q="pply";var i5q="dataSource";var V0o=o8E.q5t;V0o+=o8E.u5t;V0o+=B0t;o8E.v8E();V0o+=B0t;var args=Array[h0p][W0p][V0o](arguments);args[O0p]();var fn=this[y4t][i5q][name];if(fn){var G0o=o8E.u5t;G0o+=s5q;return fn[G0o](this,args);}};Editor[h0p][R8p]=function(includeFields){var h5q="formConten";o8E.v8E();var p5q='displayOrder';var W5q="includeFields";var A5q="appendT";var e2o=H1t;e2o+=l4t;e2o+=L9p;e2o+=Z3t;var x2o=o26;x2o+=J1p;var O2o=g1t;O2o+=C9t;var m2o=V5t;m2o+=o8E.u5t;m2o+=Y4p;var z2o=Y4p;z2o+=l4t;z2o+=X8p;z2o+=t5p;var l0o=r1t;l0o+=z36;l0o+=V5t;l0o+=p1t;var n0o=h5q;n0o+=l5t;var D0o=H1t;D0o+=r1t;D0o+=g1t;var that=this;var formContent=$(this[D0o][n0o]);var fields=this[y4t][Y8p];var order=this[y4t][l0o];var template=this[y4t][j86];var mode=this[y4t][G3t] || G26;if(includeFields){this[y4t][W5q]=includeFields;}else {includeFields=this[y4t][W5q];}formContent[z2o]()[e4p]();$[m2o](order,function(i,fieldOrName){var O5q="eakInA";var P5q='editor-field[name="';var e5q="af";var j5q='[data-editor-template="';var f2o=u1t;f2o+=a0t;f2o+=O5q;f2o+=u56;var I2o=D5t;I2o+=o8E.u5t;I2o+=g1t;I2o+=V5t;var k2o=U0t;k2o+=l4t;k2o+=f1t;k2o+=H1t;var name=fieldOrName instanceof Editor[k2o]?fieldOrName[I2o]():fieldOrName;if(that[f2o](name,includeFields) !== -N71){if(template && mode === G26){var s2o=y5q;s2o+=a1t;s2o+=H1t;var i2o=F9t;i2o+=x5q;var U2o=m4t;U2o+=l4t;U2o+=D5t;U2o+=H1t;var t2o=e5q;t2o+=l5t;t2o+=V5t;t2o+=p1t;template[O16](P5q + name + N9t)[t2o](fields[name][W16]());template[U2o](j5q + name + i2o)[s2o](fields[name][W16]());}else {var W2o=D5t;W2o+=P3t;var h2o=o8E.u5t;h2o+=U2p;h2o+=V5t;h2o+=K1t;formContent[h2o](fields[name][W2o]());}}});if(template && mode === O2o){var y2o=A5q;y2o+=r1t;template[y2o](formContent);}this[x2o](p5q,[this[y4t][e2o],this[y4t][q56],formContent]);};Editor[P2o][c16]=function(items,editFields,type,formOptions,setupDone){var v5q="_displayReo";var S5q="ring";var Z5q='initEdit';var H5q="ice";var Q5q="rder";var J2o=s4t;J2o+=l9t;var E2o=o16;E2o+=V5t;var o2o=v5q;o2o+=Q5q;var Y2o=u3t;Y2o+=D5t;Y2o+=F1p;Y2o+=G1t;var Z2o=y4t;Z2o+=B0t;Z2o+=l4t;Z2o+=V4p;var v2o=y4t;v2o+=y3t;v2o+=B0t;v2o+=V5t;var p2o=A26;p2o+=w1t;var A2o=I4t;A2o+=l4t;A2o+=C5q;A2o+=m06;var j2o=m4t;j2o+=H46;j2o+=i4t;var that=this;var fields=this[y4t][j2o];var usedFields=[];var includeInOrder;var editData={};this[y4t][A2o]=editFields;this[y4t][d5q]=editData;this[y4t][P8p]=items;this[y4t][p2o]=B8p;this[o7t][J1t][v2o][r0p]=i0p;this[y4t][G3t]=type;this[E46]();$[V9t](fields,function(name,field){var M5q="multiReset";var S2o=U6t;S2o+=i6t;var Q2o=V5t;Q2o+=o8E.u5t;Q2o+=o8E.q5t;Q2o+=G1t;field[M5q]();includeInOrder=W6t;editData[name]={};o8E.v8E();$[Q2o](editFields,function(idSrc,edit){var r5q="scope";var g5q="valFromDat";var C2o=E8p;o8E.v8E();C2o+=y4t;if(edit[C2o][name]){var r2o=p1t;r2o+=G3p;var g2o=C8p;g2o+=t0t;var M2o=H1t;M2o+=o8E.u5t;M2o+=l9t;var d2o=g5q;d2o+=o8E.u5t;var val=field[d2o](edit[M2o]);editData[name][idSrc]=val === g7t?o9t:Array[g2o](val)?val[W0p]():val;if(!formOptions || formOptions[r5q] === r2o){var X2o=H1t;X2o+=V5t;X2o+=m4t;field[L8p](idSrc,val !== undefined?val:field[X2o]());if(!edit[X5q] || edit[X5q][name]){includeInOrder=x6t;}}else {if(!edit[X5q] || edit[X5q][name]){field[L8p](idSrc,val !== undefined?val:field[A4t]());includeInOrder=x6t;}}}});if(field[o5p]()[S2o] !== F71 && includeInOrder){var H2o=t2t;H2o+=T1t;H2o+=H4p;usedFields[H2o](name);}});var currOrder=this[b8p]()[Z2o]();for(var i=currOrder[Y2o] - N71;i >= F71;i--){var a2o=h2t;a2o+=F1t;a2o+=l5t;a2o+=S5q;if($[X4p](currOrder[i][a2o](),usedFields) === -N71){var u2o=L9p;u2o+=B0t;u2o+=H5q;currOrder[u2o](i,N71);}}this[o2o](currOrder);this[J46](Z5q,[_pluck(editFields,E2o)[F71],_pluck(editFields,J2o)[F71],items,type],function(){var Y5q='initMultiEdit';that[J46](Y5q,[editFields,items,type],function(){o8E.v8E();setupDone();});});};Editor[h0p][B2o]=function(trigger,args,promiseComplete){var a5q="Event";var J5q="esu";var E5q='Cancelled';var o5q="result";if(!args){args=[];}if(Array[h1p](trigger)){var q2o=B0t;q2o+=a1t;q2o+=F1p;q2o+=G1t;for(var i=F71,ien=trigger[q2o];i < ien;i++){this[J46](trigger[i],args);}}else {var c2o=t2t;c2o+=p1t;c2o+=V5t;var e=$[a5q](trigger);$(this)[u5q](e,args);if(trigger[g76](c2o) === F71 && e[o5q] === W6t){$(this)[u5q]($[a5q](trigger + E5q),args);}if(promiseComplete){var L2o=p1t;L2o+=J5q;L2o+=v4t;if(e[o5q] && typeof e[L2o] === o8E.w5t && e[o5q][P16]){var K2o=p1t;K2o+=J5q;K2o+=v4t;e[K2o][P16](promiseComplete);}else {promiseComplete(e[o5q]);}}return e[o5q];}};Editor[b2o][w2o]=function(input){var q5q=/^on([A-Z])/;var c5q="string";var R2o=y4t;R2o+=K7t;R2o+=l4t;R2o+=l5t;var name;var names=input[R2o](m7t);for(var i=F71,ien=names[h6t];i < ien;i++){name=names[i];var onStyle=name[B5q](q5q);if(onStyle){var T2o=y4t;T2o+=f7p;T2o+=c5q;name=onStyle[N71][L5q]() + name[T2o](G71);}names[i]=name;}return names[k36](m7t);};Editor[h0p][F2o]=function(node){var N2o=V5t;N2o+=o8E.u5t;N2o+=o8E.q5t;o8E.D8E();N2o+=G1t;var foundField=g7t;$[N2o](this[y4t][Y8p],function(name,field){var G2o=B0t;G2o+=a1t;o8E.D8E();G2o+=q0t;G2o+=k0p;var V2o=m4t;V2o+=l4t;V2o+=K1t;if($(field[W16]())[V2o](node)[G2o]){foundField=field;}});return foundField;};Editor[D2o][S16]=function(fieldNames){var l2o=y4p;o8E.v8E();l2o+=u8t;l2o+=p1t;l2o+=b0t;if(fieldNames === undefined){var n2o=m4t;n2o+=A06;return this[n2o]();}else if(!Array[l2o](fieldNames)){return [fieldNames];}return fieldNames;};Editor[h0p][z3o]=function(fieldsIn,focus){var N5q=/^jq:/;var D5q="focu";var K5q="um";var F5q='div.DTE ';var w5q="jq";var k3o=D5t;k3o+=K5q;k3o+=b5q;k3o+=p1t;var that=this;var field;var fields=$[a16](fieldsIn,function(fieldOrName){var m3o=X26;m3o+=B0t;m3o+=H1t;m3o+=y4t;o8E.v8E();return typeof fieldOrName === l56?that[y4t][m3o][fieldOrName]:fieldOrName;});if(typeof focus === k3o){field=fields[focus];}else if(focus){var I3o=w5q;I3o+=R5q;if(focus[g76](I3o) === F71){var f3o=p1t;f3o+=V5t;f3o+=K7t;f3o+=T5q;field=$(F5q + focus[f3o](N5q,o9t));}else {field=this[y4t][Y8p][focus];}}else {document[V5q][k7p]();}this[y4t][G5q]=field;if(field){var t3o=D5q;t3o+=y4t;field[t3o]();}};Editor[h0p][U3o]=function(opts){var m4q="itOnR";var z4q="ount";var h4q="submitOnBlur";var i4q="mplete";var v4q='blur';var W4q="mitOn";var x4q="onReturn";var l5q="editC";var P4q="blurOnBackground";var j4q="blurO";var p4q="onBackground";var y4q="Blu";var I4q=".dte";var s4q="onComplete";var A4q="nBackground";var k4q="eturn";var O4q="Bl";var e4q="submitOnReturn";var t4q="closeOnComplete";var U4q="closeOnCo";var X4q="canReturnSubmit";var u3o=q4p;u3o+=V5t;u3o+=t0t;u3o+=d96;var S3o=q4p;S3o+=V5t;S3o+=n5q;var g3o=y0t;g3o+=l5t;g3o+=r1t;g3o+=M1t;var Q3o=l5t;Q3o+=l4t;Q3o+=l5t;Q3o+=u3t;var v3o=l5q;v3o+=z4q;var p3o=I4t;p3o+=l4t;p3o+=R76;p3o+=y4t;var e3o=c56;e3o+=n0t;e3o+=m4q;e3o+=k4q;var i3o=I4q;i3o+=f4q;i3o+=U06;var that=this;var inlineCount=__inlineCounter++;var namespace=i3o + inlineCount;if(opts[t4q] !== undefined){var W3o=S1p;W3o+=D5t;W3o+=V5t;var h3o=o8E.q5t;h3o+=B0t;h3o+=b26;var s3o=U4q;s3o+=i4q;opts[s4q]=opts[s3o]?h3o:W3o;}if(opts[h4q] !== undefined){var x3o=o8E.q5t;x3o+=B0t;x3o+=z7p;x3o+=V5t;var y3o=E56;y3o+=W4q;y3o+=O4q;y3o+=V8p;var O3o=w1t;O3o+=y4q;O3o+=p1t;opts[O3o]=opts[y3o]?j0p:x3o;}if(opts[e3o] !== undefined){var P3o=y4t;P3o+=z46;P3o+=m2t;opts[x4q]=opts[e4q]?P3o:c4p;}if(opts[P4q] !== undefined){var A3o=D5t;A3o+=r1t;A3o+=D5t;A3o+=V5t;var j3o=j4q;j3o+=A4q;opts[p4q]=opts[j3o]?v4q:A3o;}this[y4t][p3o]=opts;this[y4t][v3o]=inlineCount;if(typeof opts[Q3o] === l56 || typeof opts[q36] === o8E.b5t){var C3o=l5t;C3o+=m2t;C3o+=B0t;C3o+=V5t;this[q36](opts[q36]);opts[C3o]=x6t;}if(typeof opts[A7t] === l56 || typeof opts[A7t] === o8E.b5t){var M3o=g1t;M3o+=V5t;M3o+=P26;M3o+=V5t;var d3o=g1t;d3o+=S6t;d3o+=C5p;this[d3o](opts[A7t]);opts[M3o]=x6t;}if(typeof opts[g3o] !== P7p){var X3o=Y4t;X3o+=H06;var r3o=K56;r3o+=Q4q;this[r3o](opts[k56]);opts[X3o]=x6t;}$(document)[w1t](S3o + namespace,function(e){o8E.v8E();var C4q="isplayed";var M4q="Cod";var g4q="_field";var r4q="FromNode";var Z3o=H1t;Z3o+=C4q;var H3o=d4q;H3o+=M4q;H3o+=V5t;if(e[H3o] === f5t && that[y4t][Z3o]){var el=$(document[V5q]);if(el){var a3o=m4t;a3o+=T1t;a3o+=B76;a3o+=w1t;var Y3o=g4q;Y3o+=r4q;var field=that[Y3o](el);if(field && typeof field[X4q] === a3o && field[X4q](el)){e[W46]();}}}});$(document)[w1t](u3o + namespace,function(e){o8E.v8E();var E4q="unction";var H4q=".DTE_F";var Z4q="orm_Button";var A5t=39;var F4q="fault";var T4q="ventDe";var L4q="nR";var G4q="prev";var J4q="nRe";var a4q="yC";var n4q='button';var c4q="ubmi";var B4q="turnSu";var j5t=37;var R4q="Esc";var q4q="_fieldFromNode";var u4q="yCod";var N4q="onEsc";var o4q="veElemen";var S4q="ength";var w4q="nEs";var z9o=B0t;z9o+=S4q;var l3o=H4q;l3o+=Z4q;l3o+=y4t;var b3o=Y4q;b3o+=a4q;b3o+=r1t;b3o+=l3t;var E3o=Y4q;E3o+=u4q;E3o+=V5t;var o3o=A26;o3o+=o4q;o3o+=l5t;var el=$(document[o3o]);if(e[E3o] === f5t && that[y4t][u16]){var B3o=m4t;B3o+=E4q;var J3o=o7p;J3o+=J4q;J3o+=B4q;J3o+=L76;var field=that[q4q](el);if(field && typeof field[J3o] === B3o && field[X4q](el)){var L3o=m4t;L3o+=E4q;var q3o=y4t;q3o+=c4q;q3o+=l5t;if(opts[x4q] === q3o){var c3o=E56;c3o+=L56;e[W46]();that[c3o]();}else if(typeof opts[x4q] === L3o){var K3o=r1t;K3o+=L4q;K3o+=V5t;K3o+=p6t;e[W46]();opts[K3o](that,e);}}}else if(e[b3o] === O5t){var D3o=E56;D3o+=g1t;D3o+=m2t;var G3o=r1t;G3o+=D5t;G3o+=K4q;G3o+=b4q;var N3o=i2p;N3o+=b26;var F3o=r1t;F3o+=w4q;F3o+=o8E.q5t;var T3o=w1t;T3o+=R4q;var w3o=R0t;w3o+=V5t;w3o+=T4q;w3o+=F4q;e[w3o]();if(typeof opts[N4q] === o8E.b5t){var R3o=w1t;R3o+=K4q;R3o+=y4t;R3o+=o8E.q5t;opts[R3o](that,e);}else if(opts[T3o] === v4q){that[k7p]();}else if(opts[F3o] === N3o){var V3o=o8E.q5t;V3o+=B0t;V3o+=r1t;V3o+=o0t;that[V3o]();}else if(opts[G3o] === D3o){var n3o=c56;n3o+=L76;that[n3o]();}}else if(el[h26](l3o)[z9o]){if(e[V4q] === j5t){var k9o=o6t;k9o+=j7p;k9o+=y4t;var m9o=C66;m9o+=D5t;el[G4q](m9o)[k9o]();}else if(e[V4q] === A5t){var I9o=m4t;I9o+=r1t;I9o+=j7p;I9o+=y4t;el[D4q](n4q)[I9o]();}}});this[y4t][I5q]=function(){$(document)[V9p](l4q + namespace);o8E.D8E();$(document)[V9p](f46 + namespace);};return namespace;};Editor[f9o][z1q]=function(direction,action,data){var t9o=y4t;t9o+=V5t;t9o+=K1t;if(!this[y4t][P86] || !data){return;}if(direction === t9o){var U9o=V5t;U9o+=H1t;U9o+=l4t;U9o+=l5t;if(action === M7t || action === U9o){var h9o=s4t;h9o+=l5t;h9o+=o8E.u5t;var i9o=V5t;i9o+=o8E.u5t;i9o+=o8E.q5t;i9o+=G1t;var id;$[i9o](data[N8t],function(rowId,values){var I1q=" the legacy Ajax data format";var m1q="Editor: Multi";var k1q="-row editing is not supported by";if(id !== undefined){var s9o=m1q;s9o+=k1q;s9o+=I1q;throw s9o;}id=rowId;});data[N8t]=data[h9o][id];if(action === F36){var W9o=l4t;W9o+=H1t;data[W9o]=id;}}else {var y9o=s4t;y9o+=l9t;var O9o=g1t;O9o+=o8E.u5t;O9o+=t2t;data[R8t]=$[O9o](data[y9o],function(values,id){o8E.D8E();return id;});delete data[N8t];}}else {var e9o=p1t;e9o+=r1t;e9o+=a0t;var x9o=H1t;x9o+=o8E.u5t;x9o+=l5t;x9o+=o8E.u5t;if(!data[x9o] && data[e9o]){data[N8t]=[data[h16]];}else if(!data[N8t]){var P9o=t36;P9o+=o8E.u5t;data[P9o]=[];}}};Editor[j9o][R86]=function(json){var A9o=f1q;A9o+=L3t;o8E.D8E();A9o+=y4t;var that=this;if(json[A9o]){$[V9t](this[y4t][Y8p],function(name,field){var i1q="tions";o8E.D8E();var U1q="update";var t1q="optio";var p9o=t1q;p9o+=M1t;if(json[p9o][name] !== undefined){var v9o=g3t;v9o+=V5t;v9o+=B0t;v9o+=H1t;var fieldInst=that[v9o](name);if(fieldInst && fieldInst[U1q]){var Q9o=r1t;Q9o+=t2t;Q9o+=i1q;fieldInst[U1q](json[Q9o][name]);}}});}};Editor[C9o][d9o]=function(el,msg,title,fn){var y1q="itle";var W1q="deOut";var x1q="emoveAttr";var h1q="fa";var g9o=B1p;o8E.v8E();g9o+=r46;g9o+=L3t;var M9o=m4t;M9o+=D5t;var canAnimate=$[M9o][e2p]?x6t:W6t;if(title === undefined){title=W6t;}if(!fn){fn=function(){};}if(typeof msg === g9o){var r9o=u8t;r9o+=s1q;msg=msg(this,new DataTable[r9o](this[y4t][c1p]));}el=$(el);if(canAnimate){var X9o=B2p;X9o+=r1t;X9o+=t2t;el[X9o]();}if(!msg){if(this[y4t][u16] && canAnimate){var S9o=h1q;S9o+=W1q;el[S9o](function(){var O1q="tml";var H9o=G1t;H9o+=O1q;el[H9o](o9t);fn();});}else {el[P4p](o9t)[s5p](h5p,c4p);fn();}if(title){var Y9o=l5t;Y9o+=y1q;var Z9o=p1t;Z9o+=x1q;el[Z9o](Y9o);}}else {fn();if(this[y4t][u16] && canAnimate){var a9o=m4t;a9o+=o8E.u5t;a9o+=l3t;a9o+=f4q;el[P4p](msg)[a9o]();}else {var J9o=Y4t;J9o+=B0t;J9o+=F5p;J9o+=q4p;var E9o=P1p;E9o+=t0t;var o9o=o8E.q5t;o9o+=y4t;o9o+=y4t;var u9o=o6p;u9o+=I86;el[u9o](msg)[o9o](E9o,J9o);}if(title){var q9o=j6t;q9o+=e1q;var B9o=o8E.u5t;B9o+=T56;el[B9o](q9o,msg);}}};Editor[c9o][P1q]=function(){var p1q="Editable";var A1q="foShown";var j1q="eFields";var b9o=f5p;b9o+=k0p;var K9o=y46;K9o+=x46;K9o+=j1q;var L9o=X26;L9o+=B0t;L9o+=H1t;L9o+=y4t;o8E.D8E();var fields=this[y4t][L9o];var include=this[y4t][K9o];var show=x6t;var state;if(!include){return;}for(var i=F71,ien=include[b9o];i < ien;i++){var R9o=j3t;R9o+=f4q;R9o+=A1q;var w9o=j3t;w9o+=p1q;var field=fields[include[i]];var multiEditable=field[w9o]();if(field[p4p]() && multiEditable && show){state=x6t;show=W6t;}else if(field[p4p]() && !multiEditable){state=x6t;}else {state=W6t;}fields[include[i]][R9o](state);}};Editor[T9o][i56]=function(type,immediate){var M1q="eFocus";var r1q='submit.editor-internal';var C1q="r-i";var g1q="displayCont";var d1q="nternal";var X1q='focus.editor-focus';var Q1q="submit.ed";var v1q="even";var k6o=u1t;k6o+=v1q;k6o+=l5t;var n9o=g1t;n9o+=B16;n9o+=D5t;var D9o=Q1q;D9o+=k3t;D9o+=C1q;D9o+=d1q;var G9o=r1t;G9o+=D5t;var V9o=o6t;V9o+=p1t;V9o+=g1t;var N9o=o7p;N9o+=Q1p;N9o+=V8p;N9o+=M1q;var F9o=g1q;F9o+=V3t;var that=this;var focusCapture=this[y4t][F9o][N9o];if(focusCapture === undefined){focusCapture=x6t;}$(this[o7t][V9o])[V9p](r1q)[G9o](D9o,function(e){o8E.D8E();e[W46]();});if(focusCapture && (type === n9o || type === q7p)){$(p2p)[w1t](X1q,function(){var H1q='.DTED';var S1q="pare";var z6o=S1q;o8E.D8E();z6o+=D5t;z6o+=l5t;z6o+=y4t;var l9o=T5t;l9o+=R4t;l9o+=V1t;l9o+=K4q;if($(document[V5q])[h26](l9o)[h6t] === F71 && $(document[V5q])[z6o](H1q)[h6t] === F71){if(that[y4t][G5q]){var m6o=o6t;m6o+=o8E.q5t;m6o+=G9t;that[y4t][G5q][m6o]();}}});}this[P1q]();this[k6o](Z16,[type,this[y4t][q56]]);if(immediate){var f6o=o8E.u5t;f6o+=r46;f6o+=L3t;var I6o=u1t;I6o+=v2t;this[I6o](V26,[type,this[y4t][f6o]]);}return x6t;};Editor[t6o][B7p]=function(type){var u1q="Open";var o1q="Icb";var Y1q="loseIcb";var U6o=o26;U6o+=V5t;U6o+=z5p;if(this[U6o](Z1q,[type,this[y4t][q56]]) === W6t){var y6o=i2p;y6o+=z7p;y6o+=n76;var W6o=o8E.q5t;W6o+=Y1q;var h6o=E3p;h6o+=H1t;h6o+=V5t;var s6o=l4t;s6o+=w06;s6o+=D5t;s6o+=V5t;var i6o=o8E.q5t;i6o+=q9p;i6o+=a1q;i6o+=u1q;this[I26]();this[J46](i6o,[type,this[y4t][q56]]);if((this[y4t][G3t] === s6o || this[y4t][h6o] === q7p) && this[y4t][W6o]){var O6o=q0p;O6o+=o1q;this[y4t][O6o]();}this[y4t][y6o]=g7t;return W6t;}this[I26](x6t);this[y4t][u16]=type;return x6t;};Editor[h0p][E1q]=function(processing){var q1q="leC";var B1q="togg";var c1q="DTE";var j6o=J1q;j6o+=B4p;var P6o=B1q;P6o+=q1q;P6o+=u3p;var e6o=F4t;e6o+=N5t;e6o+=T5t;e6o+=c1q;var x6o=A26;x6o+=N5t;x6o+=V5t;var procClass=this[M5p][C6t][x6o];$([e6o,this[o7t][z7t]])[P6o](procClass,processing);this[y4t][C6t]=processing;this[J46](j6o,[processing]);};Editor[h0p][L1q]=function(args){var p6o=m4t;p6o+=H46;p6o+=i4t;o8E.D8E();var A6o=o8E.o5t;A6o+=Y4p;var processing=W6t;$[A6o](this[y4t][p6o],function(name,field){o8E.v8E();if(field[C6t]()){processing=x6t;}});if(processing){this[K1q](K4p,function(){if(this[L1q](args) === x6t){var v6o=z2t;v6o+=m2t;this[v6o][B86](this,args);}});}return !processing;};Editor[Q6o][C6o]=function(successCallback,errorCallback,formatdata,hide){var v0q="ple";var k0q="Change";var V1q="modifie";var N1q="tFiel";var m0q="allIf";var C0q='preSubmit';var e0q="_proces";var b1q="ubmitTable";var D1q="ataSou";var l1q="actionName";var F1q="editOp";var n1q="editCount";var p0q="ete";var R1q="_legacyAj";var z0q="chan";var d0q="_ajax";var w1q="jaxU";var s8o=u1t;s8o+=y4t;s8o+=b1q;var i8o=o8E.u5t;i8o+=w1q;i8o+=p1t;i8o+=B0t;var U8o=y4t;U8o+=V5t;U8o+=K1t;var t8o=R1q;t8o+=N8p;var I8o=T1q;I8o+=J3p;var Z6o=V5t;Z6o+=H1t;Z6o+=l4t;Z6o+=l5t;var H6o=y4t;H6o+=T1t;H6o+=n0t;H6o+=m2t;var S6o=F1q;S6o+=m9t;var X6o=V5t;X6o+=F4t;X6o+=N1q;X6o+=i4t;var r6o=V1q;r6o+=p1t;var g6o=m4t;g6o+=l4t;g6o+=G1q;g6o+=y4t;var M6o=H1t;M6o+=D1q;M6o+=p1t;M6o+=V4p;var d6o=r1t;d6o+=u8t;d6o+=t2t;d6o+=l4t;var that=this;var i,iLen,eventRet,errorNodes;var changed=W6t,allData={},changedData={};var setBuilder=DataTable[S1t][d6o][n8t];var dataSource=this[y4t][M6o];var fields=this[y4t][g6o];var editCount=this[y4t][n1q];var modifier=this[y4t][r6o];var editFields=this[y4t][X6o];var editData=this[y4t][d5q];var opts=this[y4t][S6o];var changedSubmit=opts[H6o];var submitParamsLocal;if(this[L1q](arguments) === W6t){return;}var action=this[y4t][q56];var submitParams={"data":{}};submitParams[this[y4t][l1q]]=action;if(this[y4t][e86]){submitParams[c1p]=this[y4t][e86];}if(action === Y46 || action === Z6o){var T6o=z0q;T6o+=M3t;T6o+=H1t;var R6o=m0q;R6o+=k0q;R6o+=H1t;var w6o=o8E.u5t;w6o+=I0q;var Y6o=o8E.o5t;Y6o+=Y4p;$[Y6o](editFields,function(idSrc,edit){var t0q="bje";var f0q="sEmptyO";var b6o=l4t;b6o+=f0q;b6o+=t0q;b6o+=r46;var allRowData={};var changedRowData={};$[V9t](fields,function(name,field){var U0q="ubmitta";var h0q="valF";var s0q="iGe";var W0q="rom";var O0q=/\[.*$/;var y0q='-many-count';var i0q="[";var u6o=y4t;u6o+=U0q;u6o+=K3t;o8E.D8E();var a6o=g3t;a6o+=V5t;a6o+=X8p;a6o+=y4t;if(edit[a6o][name] && field[u6o]()){var L6o=I4t;L6o+=l4t;L6o+=l5t;var q6o=i0q;q6o+=x5q;var B6o=y4p;B6o+=u8t;B6o+=p1t;B6o+=b0t;var o6o=g6t;o6o+=s0q;o6o+=l5t;var multiGet=field[o6o]();var builder=setBuilder(name);if(multiGet[idSrc] === undefined){var J6o=H1t;J6o+=N1t;J6o+=o8E.u5t;var E6o=h0q;E6o+=W0q;E6o+=r96;var originalVal=field[E6o](edit[J6o]);builder(allRowData,originalVal);return;}var value=multiGet[idSrc];var manyBuilder=Array[B6o](value) && name[g76](q6o) !== -N71?setBuilder(name[U1p](O0q,o9t) + y0q):g7t;builder(allRowData,value);if(manyBuilder){var c6o=U6t;c6o+=F1p;c6o+=G1t;manyBuilder(allRowData,value[c6o]);}if(action === L6o && (!editData[name] || !field[C1p](value,editData[name][idSrc]))){builder(changedRowData,value);changed=x6t;if(manyBuilder){var K6o=u3t;K6o+=W1p;manyBuilder(changedRowData,value[K6o]);}}}});if(!$[b6o](allRowData)){allData[idSrc]=allRowData;}if(!$[x0q](changedRowData)){changedData[idSrc]=changedRowData;}});if(action === M7t || changedSubmit === w6o || changedSubmit === R6o && changed){submitParams[N8t]=allData;}else if(changedSubmit === T6o && changed){var F6o=H1t;F6o+=o8E.u5t;F6o+=l5t;F6o+=o8E.u5t;submitParams[F6o]=changedData;}else {var k8o=u1t;k8o+=v2t;var m8o=e0q;m8o+=B4p;var l6o=B1p;l6o+=r46;l6o+=L3t;var n6o=P0q;n6o+=j0q;var G6o=o8E.q5t;G6o+=O2p;var V6o=A0q;V6o+=X76;V6o+=p0q;var N6o=o8E.u5t;N6o+=q1p;this[y4t][N6o]=g7t;if(opts[V6o] === G6o && (hide === undefined || hide)){var D6o=u1t;D6o+=q0p;this[D6o](W6t);}else if(typeof opts[n6o] === l6o){var z8o=A0q;z8o+=U5p;z8o+=v0q;z8o+=X0t;opts[z8o](this);}if(successCallback){successCallback[T7t](this);}this[m8o](W6t);this[k8o](Q0q);return;}}else if(action === I8o){$[V9t](editFields,function(idSrc,edit){var f8o=H1t;f8o+=o8E.u5t;f8o+=l5t;f8o+=o8E.u5t;submitParams[f8o][idSrc]=edit[N8t];});}this[t8o](U8o,action,submitParams);submitParamsLocal=$[S0p](x6t,{},submitParams);if(formatdata){formatdata(submitParams);}if(this[J46](C0q,[submitParams,action]) === W6t){this[E1q](W6t);return;}var submitWire=this[y4t][o2t] || this[y4t][i8o]?this[d0q]:this[s8o];submitWire[T7t](this,submitParams,function(json,notGood,xhr){var g0q="Succes";var M0q="_sub";var W8o=o8E.u5t;W8o+=o8E.q5t;W8o+=h8p;var h8o=M0q;h8o+=L56;h8o+=g0q;h8o+=y4t;that[h8o](json,notGood,submitParams,submitParamsLocal,that[y4t][W8o],editCount,hide,successCallback,errorCallback,xhr);},function(xhr,err,thrown){var O8o=F0p;O8o+=l5t;O8o+=L3t;that[r0q](xhr,err,thrown,errorCallback,submitParams,that[y4t][O8o]);},submitParams);};Editor[h0p][y8o]=function(data,success,error,submitParams){var H0q="SetObjectDat";var o0q="odifier";var Y0q="GetObject";var X0q="Sr";var E0q='fields';var u0q="idua";var Q8o=p1t;Q8o+=a56;Q8o+=K4t;var v8o=R8t;v8o+=X0q;v8o+=o8E.q5t;var p8o=S0q;p8o+=H0q;p8o+=Z0q;var A8o=V5t;A8o+=t4t;A8o+=l5t;var j8o=l4t;j8o+=H1t;j8o+=X0q;j8o+=o8E.q5t;var P8o=S0q;P8o+=Y0q;P8o+=g4t;P8o+=Z0q;var e8o=r1t;e8o+=u8t;e8o+=t2t;e8o+=l4t;var x8o=v36;x8o+=D5t;var that=this;var action=data[x8o];var out={data:[]};var idGet=DataTable[S1t][e8o][P8o](this[y4t][j8o]);var idSet=DataTable[A8o][a0q][p8o](this[y4t][v8o]);if(action !== Q8o){var X8o=s4t;X8o+=l5t;X8o+=o8E.u5t;var r8o=M46;r8o+=g46;r8o+=U3t;var g8o=C3t;g8o+=m3p;g8o+=u0q;g8o+=B0t;var M8o=g1t;M8o+=o0q;var d8o=a0p;d8o+=V8t;d8o+=h06;d8o+=V5t;var C8o=M46;C8o+=V5t;var originalData=this[y4t][C8o] === G26?this[d8o](E0q,this[M8o]()):this[J0q](g8o,this[r8o]());$[V9t](data[X8o],function(key,vals){var q0q="_fnExtend";var B0q="dataTableExt";var H8o=r1t;H8o+=u8t;H8o+=s1q;var S8o=m4t;S8o+=D5t;var toSave;var extender=$[S8o][B0q][H8o][q0q];if(action === F36){var rowData=originalData[key][N8t];toSave=extender({},rowData,x6t);toSave=extender(toSave,vals,x6t);}else {toSave=extender({},vals,x6t);}var overrideId=idGet(toSave);if(action === M7t && overrideId === undefined){idSet(toSave,+new Date() + o9t + key);}else {idSet(toSave,overrideId);}out[N8t][t6t](toSave);});}success(out);};Editor[Z8o][Y8o]=function(json,notGood,submitParams,submitParamsLocal,action,editCount,hide,successCallback,errorCallback,xhr){var F0q="ldErr";var R0q="ifier";var w0q="eceiv";var U2q="editCou";var e2q='postCreate';var f2q='<br>';var t2q="ev";var x2q='preCreate';var v2q='preEdit';var D0q="eldEr";var d2q="ids";var p2q="rce";var T0q='postSubmit';var c0q="Complet";var h2q="reat";var A2q="Sou";var s2q='prep';var N0q="ors";var X2q="omplete";var V0q="ubmitU";var L0q="_eve";var y2q="rea";var g2q='commit';var C2q='preRemove';var G0q="nsuccessful";var O2q="Source";var r2q="Complete";var S2q='submitSuccess';var j2q="eve";var M2q='postRemove';var i2q="mm";var P2q="tEdi";var W2q="etD";var Q2q="taSource";var b0q="ssi";var r7o=y4t;r7o+=a1p;r7o+=c0q;r7o+=V5t;var g7o=L0q;g7o+=D5t;g7o+=l5t;var M7o=K0q;M7o+=J4p;M7o+=b0q;M7o+=d9t;var B8o=u3t;B8o+=d9t;B8o+=l5t;B8o+=G1t;var J8o=V5t;J8o+=Z76;var o8o=p1t;o8o+=w0q;o8o+=V5t;var u8o=M46;u8o+=R0q;var a8o=I4t;a8o+=l4t;o8E.D8E();a8o+=R76;a8o+=y4t;var that=this;var setData;var fields=this[y4t][Y8p];var opts=this[y4t][a8o];var modifier=this[y4t][u8o];this[z1q](o8o,action,json);this[J46](T0q,[json,submitParams,action,xhr]);if(!json[S5p]){json[S5p]=o8E.K5t;}if(!json[U66]){var E8o=X26;E8o+=F0q;E8o+=N0q;json[E8o]=[];}if(notGood || json[J8o] || json[U66][B8o]){var F8o=y4t;F8o+=V0q;F8o+=G0q;var T8o=T8p;T8o+=r1t;T8o+=C3t;var c8o=g3t;c8o+=D0q;c8o+=p1t;c8o+=N0q;var q8o=V5t;q8o+=Z76;var globalError=[];if(json[q8o]){globalError[t6t](json[S5p]);}$[V9t](json[c8o],function(i,err){var k2q="position";var m2q="onFieldError";var l0q="nown field:";var n0q="Unk";var I2q=': ';var L8o=D5t;L8o+=o8E.u5t;L8o+=g1t;L8o+=V5t;var field=fields[err[L8o]];if(!field){var K8o=n0q;K8o+=l0q;K8o+=M9t;throw new Error(K8o + err[w8t]);}else if(field[u16]()){field[S5p](err[O76] || F16);if(i === F71){var R8o=z2q;R8o+=l4t;R8o+=w1t;if(opts[m2q] === p0p){var w8o=o6t;w8o+=S06;var b8o=t2p;b8o+=w0p;that[K3p]($(that[o7t][c86],that[y4t][b8o]),{scrollTop:$(field[W16]())[k2q]()[M56]},r5t);field[w8o]();}else if(typeof opts[m2q] === R8o){opts[m2q](that,err);}}}else {globalError[t6t](field[w8t]() + I2q + (err[O76] || F16));}});this[S5p](globalError[T8o](f2q));this[J46](F8o,[json]);if(errorCallback){errorCallback[T7t](that,json);}}else {var d7o=u1t;d7o+=t2q;d7o+=a1t;d7o+=l5t;var j7o=U2q;j7o+=z5p;var store={};if(json[N8t] && (action === Y46 || action === B8p)){var s7o=l7t;s7o+=i2q;s7o+=m2t;var V8o=s4t;V8o+=l5t;V8o+=o8E.u5t;var N8o=C2t;N8o+=o8E.u5t;N8o+=h06;N8o+=V5t;this[N8o](s2q,action,modifier,submitParamsLocal,json,store);for(var i=F71;i < json[V8o][h6t];i++){var I7o=I4t;I7o+=m2t;var l8o=o8E.q5t;l8o+=h2q;l8o+=V5t;var n8o=y4t;n8o+=W2q;n8o+=N1t;n8o+=o8E.u5t;var D8o=l4t;D8o+=H1t;var G8o=S8p;G8o+=l9t;G8o+=O2q;setData=json[N8t][i];var id=this[G8o](D8o,setData);this[J46](n8o,[json,setData,action]);if(action === l8o){var k7o=R36;k7o+=V5t;k7o+=Y0t;var m7o=u1t;m7o+=t2q;m7o+=V5t;m7o+=z5p;var z7o=o8E.q5t;z7o+=y2q;z7o+=X0t;this[J46](x2q,[json,setData,id]);this[J0q](z7o,fields,setData,store);this[m7o]([k7o,e2q],[json,setData,id]);}else if(action === I7o){var i7o=t16;i7o+=y4t;i7o+=P2q;i7o+=l5t;var U7o=I4t;U7o+=l4t;U7o+=l5t;var t7o=u1t;t7o+=j2q;t7o+=D5t;t7o+=l5t;var f7o=S8p;f7o+=l9t;f7o+=A2q;f7o+=p2q;this[J46](v2q,[json,setData,id]);this[f7o](F36,modifier,fields,setData,store);this[t7o]([U7o,i7o],[json,setData,id]);}}this[J0q](s7o,action,modifier,json[N8t],store);}else if(action === r1p){var P7o=H1t;P7o+=o8E.u5t;P7o+=l9t;var e7o=S8p;e7o+=l9t;e7o+=O2q;var x7o=l4t;x7o+=H1t;x7o+=y4t;var y7o=p1t;y7o+=a56;y7o+=s36;y7o+=V5t;var O7o=L0q;O7o+=D5t;O7o+=l5t;var W7o=t2t;W7o+=J3t;W7o+=t2t;var h7o=S8p;h7o+=Q2q;this[h7o](W7o,action,modifier,submitParamsLocal,json,store);this[J46](C2q,[json,this[d2q]()]);this[J0q](c36,modifier,fields,store);this[O7o]([y7o,M2q],[json,this[x7o]()]);this[e7o](g2q,action,modifier,json[P7o],store);}if(editCount === this[y4t][j7o]){var Q7o=w1t;Q7o+=r2q;var v7o=i2p;v7o+=r1t;v7o+=y4t;v7o+=V5t;var p7o=P0q;p7o+=j0q;var A7o=o8E.u5t;A7o+=n56;A7o+=w1t;var action=this[y4t][q56];this[y4t][A7o]=g7t;if(opts[p7o] === v7o && (hide === undefined || hide)){this[d46](json[N8t]?x6t:W6t,action);}else if(typeof opts[Q7o] === o8E.b5t){var C7o=A0q;C7o+=X2q;opts[C7o](this);}}if(successCallback){successCallback[T7t](that,json);}this[d7o](S2q,[json,setData,action]);}this[M7o](W6t);this[g7o](r7o,[json,setData,action]);};Editor[X7o][r0q]=function(xhr,err,thrown,errorCallback,submitParams,action){var o2q="system";var H2q="bmitE";var a2q="ostSu";var Z2q="rro";var Y2q="vent";var u7o=c56;u7o+=H2q;u7o+=Z2q;u7o+=p1t;var a7o=P2t;a7o+=Y2q;var Y7o=U3t;Y7o+=p1t;Y7o+=C1t;var Z7o=l4t;Z7o+=R5t;Z7o+=B56;var H7o=V5t;H7o+=r26;H7o+=C1t;var S7o=t2t;S7o+=a2q;S7o+=u2q;S7o+=l5t;this[J46](S7o,[g7t,submitParams,action,xhr]);this[H7o](this[Z7o][Y7o][o2q]);this[E1q](W6t);if(errorCallback){errorCallback[T7t](this,xhr,err,thrown);}this[a7o]([u7o,Q0q],[xhr,err,thrown,submitParams]);};Editor[h0p][o7o]=function(fn){var E2q="bble";var L2q="eatures";var B2q="Ta";var b2q="itCo";var q2q="bS";o8E.D8E();var c2q="erverSide";var F7o=K56;F7o+=E2q;var T7o=H1t;T7o+=l4t;T7o+=p1p;var B7o=J2q;B7o+=V5t;var J7o=N8t;J7o+=B2q;J7o+=Y4t;J7o+=u3t;var E7o=l9t;E7o+=K3t;var that=this;var dt=this[y4t][E7o]?new $[J9t][J7o][u36](this[y4t][B7o]):g7t;var ssp=W6t;if(dt){var L7o=q2q;L7o+=c2q;var c7o=r1t;c7o+=U0t;c7o+=L2q;var q7o=o0t;q7o+=F3t;ssp=dt[q7o]()[F71][c7o][L7o];}if(this[y4t][C6t]){var b7o=K2q;b7o+=b2q;b7o+=g1t;b7o+=j0q;var K7o=r1t;K7o+=I5p;this[K7o](b7o,function(){o8E.v8E();if(ssp){var R7o=H1t;R7o+=p1t;R7o+=o8E.u5t;R7o+=a0t;var w7o=r1t;w7o+=D5t;w7o+=V5t;dt[w7o](R7o,fn);}else {setTimeout(function(){o8E.v8E();fn();},m5t);}});return x6t;}else if(this[r0p]() === D36 || this[T7o]() === F7o){var z5D=Y4t;z5D+=B0t;z5D+=V8p;var N7o=F76;N7o+=o0t;this[K1q](N7o,function(){var F2q="lete";var w2q="si";var R2q="Co";var V7o=J1q;V7o+=w2q;V7o+=D5t;V7o+=q0t;if(!that[y4t][V7o]){setTimeout(function(){o8E.D8E();if(that[y4t]){fn();}},m5t);}else {var D7o=m7p;D7o+=R2q;D7o+=T2q;D7o+=F2q;var G7o=r1t;G7o+=D5t;G7o+=V5t;that[G7o](D7o,function(e,json){o8E.D8E();var N2q="aw";if(ssp && json){var l7o=H1t;l7o+=p1t;l7o+=N2q;var n7o=r1t;n7o+=D5t;n7o+=V5t;dt[n7o](l7o,fn);}else {setTimeout(function(){if(that[y4t]){fn();}},m5t);}});}})[z5D]();return x6t;}return W6t;};Editor[h0p][m5D]=function(name,arr){var k5D=B0t;k5D+=d8p;k5D+=k0p;for(var i=F71,ien=arr[k5D];i < ien;i++){if(name == arr[i]){return i;}}return -N71;};Editor[I5D]={"table":g7t,"ajaxUrl":g7t,"fields":[],"display":f5D,"ajax":g7t,"idSrc":t5D,"events":{},"i18n":{"close":U5D,"create":{"button":i5D,"title":V2q,"submit":s5D},"edit":{"button":X1p,"title":h5D,"submit":U16},"remove":{"button":G2q,"title":G2q,"submit":W5D,"confirm":{"_":O5D,"1":D2q}},"error":{"system":y5D},multi:{title:n2q,info:x5D,restore:e5D,noMulti:P5D},datetime:{previous:l2q,next:j5D,months:[A5D,p5D,z3q,m3q,v5D,k3q,I3q,Q5D,C5D,d5D,M5D,f3q],weekdays:[g5D,r5D,X5D,S5D,H5D,t3q,Z5D],amPm:[U3q,i3q],hours:Y5D,minutes:s3q,seconds:a5D,unknown:I36}},formOptions:{bubble:$[u5D]({},Editor[o5D][E5D],{title:W6t,message:W6t,buttons:J5D,submit:h3q}),inline:$[B5D]({},Editor[x0p][P0p],{buttons:W6t,submit:q5D}),main:$[c5D]({},Editor[L5D][K5D])},legacyAjax:W6t,actionName:W3q};(function(){var A3q="oFe";var O3q="dataSources";var e9q="drawType";var B3q="index";var C9q="rowIds";var r9q="Ar";var H6q='keyless';var p9q="any";var N1D=G1t;N1D+=l5t;N1D+=g1t;N1D+=B0t;var __dataSources=Editor[O3q]={};var __dtIsSsp=function(dt,editor){var e3q="tOp";var y3q="wType";var P3q="bServ";var j3q="erSide";var Q3q="ings";var p3q="atu";var v3q="sett";o8E.D8E();var F5D=H1t;F5D+=t76;F5D+=y3q;var T5D=x3q;T5D+=e3q;T5D+=l5t;T5D+=y4t;var R5D=P3q;R5D+=j3q;var w5D=A3q;w5D+=p3q;w5D+=s76;var b5D=v3q;b5D+=Q3q;return dt[b5D]()[F71][w5D][R5D] && editor[y4t][T5D][F5D] !== c4p;};var __dtApi=function(table){return $(table)[b9t]();};var __dtHighlight=function(node){node=$(node);o8E.v8E();setTimeout(function(){var C3q='highlight';node[v2p](C3q);o8E.D8E();setTimeout(function(){var d3q="eCl";var M3q="as";var g3q="las";var r3q='noHighlight';o8E.D8E();var V5D=H5p;V5D+=d3q;V5D+=M3q;V5D+=y4t;var N5D=g8p;N5D+=Z0t;N5D+=g3q;N5D+=y4t;node[N5D](r3q)[V5D](C3q);setTimeout(function(){var S3q="igh";var X3q="Highl";var G5D=S1p;G5D+=X3q;G5D+=S3q;G5D+=l5t;node[Z56](G5D);},X5t);},r5t);},i5t);};var __dtRowSelector=function(out,dt,identifier,fields,idFn){var H3q="exe";var l5D=V5t;l5D+=F0p;l5D+=G1t;var n5D=C3t;n5D+=H1t;n5D+=H3q;n5D+=y4t;var D5D=p1t;D5D+=r1t;D5D+=a0t;D5D+=y4t;dt[D5D](identifier)[n5D]()[l5D](function(idx){var Z3q="Unable ";o8E.D8E();var a3q="entifier";var t5t=14;var Y3q="to find row id";var k4D=o16;k4D+=V5t;var z4D=p1t;z4D+=r1t;z4D+=a0t;var row=dt[z4D](idx);var data=row[N8t]();var idSrc=idFn(data);if(idSrc === undefined){var m4D=Z3q;m4D+=Y3q;m4D+=a3q;Editor[S5p](m4D,t5t);}out[idSrc]={idSrc:idSrc,data:data,node:row[k4D](),fields:fields,type:v0p};});};var __dtFieldsFromIdx=function(dt,fields,idx){var u3q="eac";var o3q="aoColumns";var J3q='Unable to automatically determine field from source. Please specify the field name.';var E3q="mData";var t4D=u3q;t4D+=G1t;var f4D=x3q;f4D+=C5q;f4D+=G1q;var I4D=I4t;I4D+=m2t;I4D+=e6t;var field;var col=dt[b8t]()[F71][o3q][idx];var dataSrc=col[I4D] !== undefined?col[f4D]:col[E3q];var resolvedFields={};var run=function(field,dataSrc){o8E.D8E();if(field[w8t]() === dataSrc){resolvedFields[field[w8t]()]=field;}};$[t4D](fields,function(name,fieldInst){var U4D=g26;U4D+=p1t;U4D+=p1t;o8E.v8E();U4D+=Z7t;if(Array[U4D](dataSrc)){var i4D=B0t;i4D+=V5t;i4D+=D5t;i4D+=i6t;for(var i=F71;i < dataSrc[i4D];i++){run(fieldInst,dataSrc[i]);}}else {run(fieldInst,dataSrc);}});if($[x0q](resolvedFields)){Editor[S5p](J3q,k5t);}return resolvedFields;};var __dtCellSelector=function(out,dt,identifier,allFields,idFn,forceFields){var h4D=B3q;h4D+=V5t;h4D+=y4t;o8E.v8E();var s4D=a1q;s4D+=T3t;dt[s4D](identifier)[h4D]()[V9t](function(idx){var R3q="ttac";var T3q="fixedNode";var q3q="fix";var w3q="playFields";var K3q="column";var c3q="edNode";var L3q="objec";var p4D=V5t;p4D+=p16;p4D+=K1t;var A4D=q3q;A4D+=c3q;o8E.D8E();var j4D=t2t;j4D+=G9t;j4D+=G1t;var P4D=N1t;P4D+=l9t;P4D+=Y4p;var e4D=U2t;e4D+=a0t;var O4D=L3q;O4D+=l5t;var W4D=a1q;W4D+=B0t;var cell=dt[W4D](idx);var row=dt[h16](idx[h16]);var data=row[N8t]();var idSrc=idFn(data);var fields=forceFields || __dtFieldsFromIdx(dt,allFields,idx[K3q]);var isNode=typeof identifier === O4D && identifier[b3q] || identifier instanceof $;var prevDisplayFields,prevAttach;if(out[idSrc]){var x4D=t4p;x4D+=w3q;var y4D=o8E.u5t;y4D+=R3q;y4D+=G1t;prevAttach=out[idSrc][y4D];prevDisplayFields=out[idSrc][x4D];}__dtRowSelector(out,dt,idx[e4D],allFields,idFn);out[idSrc][x8p]=prevAttach || [];out[idSrc][P4D][j4D](isNode?$(identifier)[Q56](F71):cell[A4D]?cell[T3q]():cell[W16]());out[idSrc][X5q]=prevDisplayFields || ({});$[p4D](out[idSrc][X5q],fields);});};var __dtColumnSelector=function(out,dt,identifier,fields,idFn){var F3q="dex";var N3q="cells";var Q4D=o8E.o5t;Q4D+=Y4p;var v4D=C3t;v4D+=F3q;v4D+=v5p;dt[N3q](g7t,identifier)[v4D]()[Q4D](function(idx){__dtCellSelector(out,dt,idx,fields,idFn);});};var __dtjqId=function(id){var G3q="$";var V3q="\\";var d4D=V3q;d4D+=G3q;d4D+=R5t;var C4D=J3t;C4D+=F4p;return typeof id === l56?I06 + id[C4D](/(:|\.|\[|\]|,)/g,d4D):I06 + id;};__dataSources[B9t]={id:function(data){var D3q="idSr";var z9q="ataFn";var m9q="oA";var n3q="_fnG";var l3q="etObjectD";var X4D=D3q;X4D+=o8E.q5t;var r4D=n3q;r4D+=l3q;o8E.v8E();r4D+=z9q;var g4D=m9q;g4D+=t2t;g4D+=l4t;var M4D=V5t;M4D+=t4t;M4D+=l5t;var idFn=DataTable[M4D][g4D][r4D](this[y4t][X4D]);return idFn(data);},individual:function(identifier,fieldNames){var k9q="idSrc";var H4D=l9t;H4D+=Y4t;H4D+=u3t;var S4D=V5t;S4D+=t4t;S4D+=l5t;var idFn=DataTable[S4D][a0q][G8t](this[y4t][k9q]);var dt=__dtApi(this[y4t][H4D]);var fields=this[y4t][Y8p];var out={};var forceFields;o8E.v8E();var responsiveNode;if(fieldNames){if(!Array[h1p](fieldNames)){fieldNames=[fieldNames];}forceFields={};$[V9t](fieldNames,function(i,name){o8E.D8E();forceFields[name]=fields[name];});}__dtCellSelector(out,dt,identifier,fields,idFn,forceFields);return out;},fields:function(identifier){var s9q="columns";var i9q="dSrc";var W9q="mns";var t9q="isPla";var y9q="olumn";var h9q="colu";var U9q="inObject";var o4D=o8E.q5t;o4D+=I9q;o4D+=y4t;var u4D=U2t;u4D+=f9q;var a4D=t9q;a4D+=U9q;var Y4D=l5t;Y4D+=o8E.u5t;Y4D+=Y4t;Y4D+=u3t;var Z4D=l4t;Z4D+=i9q;var idFn=DataTable[S1t][a0q][G8t](this[y4t][Z4D]);var dt=__dtApi(this[y4t][Y4D]);var fields=this[y4t][Y8p];var out={};if($[a4D](identifier) && (identifier[u4D] !== undefined || identifier[s9q] !== undefined || identifier[o4D] !== undefined)){var B4D=a1q;B4D+=B0t;B4D+=y4t;var E4D=h9q;E4D+=W9q;if(identifier[O9q] !== undefined){__dtRowSelector(out,dt,identifier[O9q],fields,idFn);}if(identifier[E4D] !== undefined){var J4D=o8E.q5t;J4D+=y9q;J4D+=y4t;__dtColumnSelector(out,dt,identifier[J4D],fields,idFn);}if(identifier[B4D] !== undefined){var q4D=o8E.q5t;q4D+=V5t;q4D+=I0q;q4D+=y4t;__dtCellSelector(out,dt,identifier[q4D],fields,idFn);}}else {__dtRowSelector(out,dt,identifier,fields,idFn);}return out;},create:function(fields,data){var dt=__dtApi(this[y4t][c1p]);if(!__dtIsSsp(dt,this)){var row=dt[h16][g8p](data);__dtHighlight(row[W16]());}},edit:function(identifier,fields,data,store){var j9q="all";var A9q="aTable";var v9q="inA";var x9q="Op";var Q9q="eExt";var K4D=D5t;K4D+=w1t;K4D+=V5t;var L4D=x3q;L4D+=l5t;L4D+=x9q;L4D+=m9t;var c4D=J2q;c4D+=V5t;var that=this;var dt=__dtApi(this[y4t][c4D]);if(!__dtIsSsp(dt,this) || this[y4t][L4D][e9q] === K4D){var V4D=o8E.u5t;V4D+=P9q;var R4D=o8E.q5t;R4D+=j9q;var w4D=l4t;w4D+=H1t;var b4D=H1t;b4D+=N1t;b4D+=A9q;var rowId=__dataSources[b4D][w4D][R4D](this,data);var row;try{var T4D=U2t;T4D+=a0t;row=dt[T4D](__dtjqId(rowId));}catch(e){row=dt;}if(!row[p9q]()){var F4D=p1t;F4D+=G3p;row=dt[F4D](function(rowIdx,rowData,rowNode){o8E.D8E();var N4D=o8E.q5t;N4D+=j9q;return rowId == __dataSources[B9t][R8t][N4D](that,rowData);});}if(row[V4D]()){var m1D=U2t;m1D+=a0t;m1D+=J0t;m1D+=y4t;var z1D=v9q;z1D+=r26;z1D+=o8E.u5t;z1D+=t0t;var l4D=H1t;l4D+=N1t;l4D+=o8E.u5t;var n4D=S0q;n4D+=K4q;n4D+=t4t;n4D+=y06;var D4D=r1t;D4D+=u8t;D4D+=t2t;D4D+=l4t;var G4D=Y86;G4D+=n1p;G4D+=Q9q;var extender=$[J9t][G4D][D4D][n4D];var toSave=extender({},row[N8t](),x6t);toSave=extender(toSave,data,x6t);row[l4D](toSave);var idx=$[z1D](rowId,store[C9q]);store[m1D][w8p](idx,N71);}else {var I1D=o8E.u5t;I1D+=H1t;I1D+=H1t;var k1D=p1t;k1D+=r1t;k1D+=a0t;row=dt[k1D][I1D](data);}__dtHighlight(row[W16]());}},remove:function(identifier,fields,store){var d9q="very";var f1D=o7p;f1D+=M4t;f1D+=B0t;f1D+=A5p;var that=this;var dt=__dtApi(this[y4t][c1p]);o8E.D8E();var cancelled=store[f1D];if(cancelled[h6t] === F71){var t1D=J3t;t1D+=g1t;t1D+=r1t;t1D+=J3p;dt[O9q](identifier)[t1D]();}else {var O1D=h16;O1D+=y4t;var i1D=V5t;i1D+=d9q;var U1D=h16;U1D+=y4t;var indexes=[];dt[U1D](identifier)[i1D](function(){var M9q="ataTable";var h1D=l4t;h1D+=H1t;var s1D=H1t;s1D+=M9q;var id=__dataSources[s1D][h1D][T7t](that,this[N8t]());if($[X4p](id,cancelled) === -N71){var W1D=S4p;W1D+=y4t;W1D+=G1t;indexes[W1D](this[B3q]());}});dt[O1D](indexes)[r1p]();}},prep:function(action,identifier,submit,json,store){var g9q="lled";var X9q="ance";var S9q="cancelled";var y1D=V5t;o8E.D8E();y1D+=H1t;y1D+=m2t;if(action === y1D){var e1D=g1t;e1D+=o8E.u5t;e1D+=t2t;var x1D=o8E.q5t;x1D+=o8E.u5t;x1D+=M4t;x1D+=g9q;var cancelled=json[x1D] || [];store[C9q]=$[e1D](submit[N8t],function(val,key){var j1D=C3t;j1D+=r9q;j1D+=p1t;j1D+=Z7t;var P1D=s4t;P1D+=l5t;P1D+=o8E.u5t;return !$[x0q](submit[P1D][key]) && $[j1D](key,cancelled) === -N71?key:undefined;});}else if(action === c36){var A1D=o8E.q5t;A1D+=X9q;A1D+=B0t;A1D+=A5p;store[A1D]=json[S9q] || [];}},commit:function(action,identifier,data,store){var Z9q="Ids";var L9q="searchPanes";var c9q="recalc";var q9q="responsive";var J9q="ponsive";var E9q="tures";var w9q="sea";var R9q="hPanes";var H9q="rowI";var o9q="oFea";var B9q="draw";var b9q="dPane";var u9q="bServerSide";var a9q="tings";var K9q="buil";var g1D=B8p;g1D+=B1t;g1D+=t2t;g1D+=m9t;var p1D=H9q;p1D+=H1t;p1D+=y4t;var that=this;var dt=__dtApi(this[y4t][c1p]);if(!__dtIsSsp(dt,this) && action === F36 && store[p1D][h6t]){var v1D=p1t;v1D+=r1t;v1D+=a0t;v1D+=Z9q;var ids=store[v1D];var row;var compare=function(id){o8E.D8E();return function(rowIdx,rowData,rowNode){var Y9q="taTable";var Q1D=s4t;Q1D+=Y9q;return id == __dataSources[Q1D][R8t][T7t](that,rowData);};};for(var i=F71,ien=ids[h6t];i < ien;i++){var M1D=A3q;M1D+=N1t;M1D+=T1t;M1D+=s76;var d1D=y4t;d1D+=v3t;d1D+=a9q;try{row=dt[h16](__dtjqId(ids[i]));}catch(e){row=dt;}if(!row[p9q]()){var C1D=p1t;C1D+=r1t;C1D+=a0t;row=dt[C1D](compare(ids[i]));}if(row[p9q]() && !dt[d1D]()[F71][M1D][u9q]){row[r1p]();}}}var drawType=this[y4t][g1D][e9q];if(drawType !== c4p){var X1D=o9q;X1D+=E9q;var r1D=s76;r1D+=J9q;dt[B9q](drawType);if(dt[r1D]){dt[q9q][c9q]();}if(typeof dt[L9q] === o8E.b5t && !dt[b8t]()[F71][X1D][u9q]){var H1D=p1t;H1D+=V5t;H1D+=K9q;H1D+=b9q;var S1D=w9q;S1D+=p1t;S1D+=o8E.q5t;S1D+=R9q;dt[S1D][H1D](undefined,x6t);}}}};function __html_id(identifier){var T9q="keyl";var F9q="[data-e";var V9q='Could not find an element with `data-editor-id` or `id` of: ';var N9q="itor-id=\"";var Z1D=T9q;Z1D+=S6t;var context=document;if(identifier !== Z1D){var u1D=U6t;u1D+=i6t;var a1D=F9t;a1D+=x5q;var Y1D=F9q;Y1D+=H1t;Y1D+=N9q;context=$(Y1D + identifier + a1D);if(context[u1D] === F71){context=typeof identifier === l56?$(__dtjqId(identifier)):$(identifier);}if(context[h6t] === F71){throw V9q + identifier;}}return context;}function __html_el(identifier,name){var G9q="[data-editor-fiel";var o1D=G9q;o1D+=D9q;o8E.D8E();var context=__html_id(identifier);return $(o1D + name + N9t,context);}function __html_els(identifier,names){var E1D=B0t;E1D+=a1t;E1D+=i6t;var out=$();for(var i=F71,ien=names[E1D];i < ien;i++){out=out[g8p](__html_el(identifier,names[i]));}return out;}function __html_get(identifier,dataSrc){var m6q='[data-editor-value]';var l9q="tor-value";var n9q="a-";var z6q="filte";var B1D=t36;B1D+=n9q;B1D+=x3q;B1D+=l9q;var J1D=z6q;J1D+=p1t;var el=__html_el(identifier,dataSrc);return el[J1D](m6q)[h6t]?el[Q6p](B1D):el[P4p]();}function __html_set(identifier,fields,data){o8E.D8E();var q1D=V5t;q1D+=b3p;$[q1D](fields,function(name,field){var i6q="dataSrc";var t6q="alue]";var f6q="[data-editor-v";var k6q="alFrom";var s6q='data-editor-value';var c1D=N5t;c1D+=k6q;c1D+=I6q;c1D+=l9t;var val=field[c1D](data);if(val !== undefined){var b1D=u3t;b1D+=W1p;var K1D=f6q;K1D+=t6q;var L1D=U6q;L1D+=l5t;L1D+=U3t;var el=__html_el(identifier,field[i6q]());if(el[L1D](K1D)[b1D]){el[Q6p](s6q,val);}else {var F1D=o6p;F1D+=I86;var w1D=o8E.o5t;w1D+=o8E.q5t;w1D+=G1t;el[w1D](function(){var h6q="childNodes";var W6q="first";var O6q="removeChild";var R1D=U6t;R1D+=q0t;R1D+=k0p;while(this[h6q][R1D]){var T1D=W6q;T1D+=f9p;T1D+=H1t;this[O6q](this[T1D]);}})[F1D](val);}}});}__dataSources[N1D]={id:function(data){var x6q="ectDat";var y6q="_fnGetO";var D1D=R8t;D1D+=F1t;D1D+=h86;var G1D=y6q;G1D+=O6t;G1D+=x6q;G1D+=Z0q;var V1D=V5t;V1D+=t4t;V1D+=l5t;var idFn=DataTable[V1D][a0q][G1D](this[y4t][D1D]);return idFn(data);},initField:function(cfg){var P6q="[data-edi";var j6q="tor-label=\"";var e6q="abe";var k0D=U6t;k0D+=i6t;var m0D=B0t;m0D+=e6q;m0D+=B0t;var z0D=D5t;z0D+=v96;z0D+=V5t;var l1D=H1t;l1D+=N1t;l1D+=o8E.u5t;var n1D=P6q;n1D+=j6q;var label=$(n1D + (cfg[l1D] || cfg[z0D]) + N9t);if(!cfg[m0D] && label[k0D]){var I0D=r5p;I0D+=b5q;I0D+=B0t;cfg[I0D]=label[P4p]();}},individual:function(identifier,fieldNames){var M6q="data-ed";var A6q="eName";var Y6q="ata source";var g6q="itor-field";o8E.D8E();var Q6q="d]";var r6q="addBack";var Z6q="Cannot automatically determine field name from d";var v6q="-i";var d6q="elf";var X6q='addBack';var S6q='editor-id';var C6q="nts";var p6q="[data-editor";var A0D=o8E.o5t;A0D+=Y4p;var j0D=o8E.o5t;j0D+=o8E.q5t;j0D+=G1t;var P0D=Y16;P0D+=H1t;P0D+=y4t;var e0D=o8E.q5t;e0D+=o8E.u5t;e0D+=I0q;var x0D=g3t;x0D+=f1t;x0D+=H1t;x0D+=y4t;var y0D=G1t;y0D+=l5t;y0D+=g1t;y0D+=B0t;var f0D=D5t;f0D+=r1t;f0D+=H1t;f0D+=A6q;var attachEl;if(identifier instanceof $ || identifier[f0D]){var W0D=p6q;W0D+=v6q;W0D+=Q6q;var h0D=c2t;h0D+=p1t;h0D+=V5t;h0D+=C6q;var s0D=o8E.u5t;s0D+=D5t;s0D+=s86;s0D+=d6q;var i0D=m4t;i0D+=D5t;attachEl=identifier;if(!fieldNames){var U0D=M6q;U0D+=g6q;var t0D=o8E.u5t;t0D+=l5t;t0D+=n4p;fieldNames=[$(identifier)[t0D](U0D)];}var back=$[i0D][r6q]?X6q:s0D;identifier=$(identifier)[h0D](W0D)[back]()[N8t](S6q);}if(!identifier){identifier=H6q;}if(fieldNames && !Array[h1p](fieldNames)){fieldNames=[fieldNames];}if(!fieldNames || fieldNames[h6t] === F71){var O0D=Z6q;O0D+=Y6q;throw O0D;}var out=__dataSources[y0D][x0D][e0D](this,identifier);var fields=this[y4t][P0D];var forceFields={};$[j0D](fieldNames,function(i,name){forceFields[name]=fields[name];});$[A0D](out,function(id,set){var a6q='cell';var Q0D=X26;Q0D+=r3t;var v0D=l5t;v0D+=r1t;v0D+=r9q;v0D+=b0t;var p0D=l5t;p0D+=t0t;p0D+=t2t;o8E.v8E();p0D+=V5t;set[p0D]=a6q;set[x8p]=attachEl?$(attachEl):__html_els(identifier,fieldNames)[v0D]();set[Q0D]=fields;set[X5q]=forceFields;});return out;},fields:function(identifier){var X0D=p1t;X0D+=r1t;X0D+=a0t;var C0D=y4p;C0D+=u8t;C0D+=r26;C0D+=Z7t;var out={};var self=__dataSources[P4p];if(Array[C0D](identifier)){var d0D=f5p;d0D+=l5t;d0D+=G1t;for(var i=F71,ien=identifier[d0D];i < ien;i++){var M0D=o8E.q5t;M0D+=z4p;M0D+=B0t;var res=self[Y8p][M0D](this,identifier[i]);out[identifier[i]]=res[identifier[i]];}return out;}var data={};var fields=this[y4t][Y8p];if(!identifier){identifier=H6q;}$[V9t](fields,function(name,field){var o6q="Src";var u6q="alTo";var r0D=N5t;r0D+=u6q;r0D+=r96;var g0D=H1t;g0D+=V8t;g0D+=o6q;o8E.D8E();var val=__html_get(identifier,field[g0D]());field[r0D](data,val === g7t?undefined:val);});out[identifier]={idSrc:identifier,data:data,node:document,fields:fields,type:X0D};return out;},create:function(fields,data){o8E.v8E();var E6q="tm";if(data){var Z0D=o8E.q5t;Z0D+=o8E.u5t;Z0D+=B0t;Z0D+=B0t;var H0D=l4t;H0D+=H1t;var S0D=G1t;S0D+=E6q;S0D+=B0t;var id=__dataSources[S0D][H0D][Z0D](this,data);try{var Y0D=U6t;Y0D+=i6t;if(__html_id(id)[Y0D]){__html_set(id,fields,data);}}catch(e){;}}},edit:function(identifier,fields,data){var u0D=d4q;u0D+=J6q;u0D+=y4t;var a0D=o8E.q5t;a0D+=o8E.u5t;a0D+=I0q;o8E.v8E();var id=__dataSources[P4p][R8t][a0D](this,data) || u0D;__html_set(id,fields,data);},remove:function(identifier,fields){var o0D=Y3p;o0D+=K4t;__html_id(identifier)[o0D]();}};})();Editor[E0D]={"wrapper":J0D,"processing":{"indicator":B0D,"active":C6t},"header":{"wrapper":B6q,"content":q6q},"body":{"wrapper":q0D,"content":c0D},"footer":{"wrapper":L0D,"content":c6q},"form":{"wrapper":L6q,"content":K0D,"tag":o8E.K5t,"info":K6q,"error":b6q,"buttons":w6q,"button":R6q,"buttonInternal":b0D},"field":{"wrapper":s1t,"typePrefix":T6q,"namePrefix":F6q,"label":w0D,"input":R0D,"inputControl":N6q,"error":T0D,"msg-label":V6q,"msg-error":F0D,"msg-message":G6q,"msg-info":N0D,"multiValue":V0D,"multiInfo":D6q,"multiRestore":G0D,"multiNoEdit":n6q,"disabled":D0D,"processing":n0D},"actions":{"create":l6q,"edit":l0D,"remove":z2D},"inline":{"wrapper":z8q,"liner":m8q,"buttons":k8q},"bubble":{"wrapper":m2D,"liner":I8q,"table":f8q,"close":k2D,"pointer":I2D,"bg":f2D}};(function(){var J8q="irm";var i8q="gle";var y8q="uttons-cr";var W8q="ons-";var P8q="ct_sing";var U8q="Sin";var d8q="tit";var j8q="itor_ed";var p8q="TableTo";var r8q="fnGetSelectedIndexes";var O7q="removeSingle";var t8q="lectedSing";var w8q="formButtons";var h8q="butt";var N8q='buttons-edit';var A8q="or_cre";var v8q="ols";var x8q="edito";var L8q="i1";var s8q="ditS";var y7q='selectedSingle';var C8q="formButto";var e8q="r_re";var m7q="indexes";var N3D=T1q;N3D+=J3p;var F3D=y4t;F3D+=V5t;F3D+=t8q;F3D+=u3t;var T3D=I4t;T3D+=m2t;T3D+=U8q;T3D+=i8q;var R3D=V5t;R3D+=z3t;var w3D=m9p;w3D+=l5t;w3D+=J6t;var b3D=V5t;b3D+=s8q;b3D+=C3t;b3D+=i8q;var Z3D=h8q;Z3D+=W8q;Z3D+=r1p;var M3D=U2t;M3D+=f9q;var d3D=o0t;d3D+=O8q;var t3D=y4t;t3D+=f1t;t3D+=y6t;t3D+=I4t;var N2D=Y4t;N2D+=y8q;N2D+=T36;var b2D=V5t;b2D+=Y1t;if(DataTable[H86]){var d2D=S1t;d2D+=a1t;d2D+=H1t;var C2D=x8q;C2D+=e8q;C2D+=V36;var e2D=o0t;e2D+=u3t;e2D+=P8q;e2D+=u3t;var x2D=V5t;x2D+=H1t;x2D+=j8q;x2D+=m2t;var i2D=V5t;i2D+=p16;i2D+=D5t;i2D+=H1t;var U2D=I4t;U2D+=m2t;U2D+=A8q;U2D+=Y0t;var t2D=p8q;t2D+=v8q;var ttButtons=DataTable[t2D][a86];var ttButtonBase={sButtonText:g7t,editor:g7t,formTitle:g7t};ttButtons[U2D]=$[i2D](x6t,ttButtons[m46],ttButtonBase,{formButtons:[{label:g7t,fn:function(e){this[m7p]();}}],fnClick:function(button,config){var Q8q="abel";var y2D=j6t;y2D+=l5t;y2D+=u3t;var O2D=Q26;O2D+=V5t;var h2D=B0t;h2D+=Q8q;var s2D=C8q;s2D+=M1t;var editor=config[P4t];var i18nCreate=editor[q8t][Y46];var buttons=config[s2D];if(!buttons[F71][h2D]){var W2D=B0t;W2D+=o8E.u5t;W2D+=b5q;W2D+=B0t;buttons[F71][W2D]=i18nCreate[m7p];}editor[O2D]({title:i18nCreate[y2D],buttons:buttons});}});ttButtons[x2D]=$[S0p](x6t,ttButtons[e2D],ttButtonBase,{formButtons:[{label:g7t,fn:function(e){this[m7p]();}}],fnClick:function(button,config){var g8q="itor";var M8q="formB";var Q2D=d8q;Q2D+=u3t;var p2D=B0t;p2D+=C8t;p2D+=f1t;var A2D=M8q;A2D+=T1t;A2D+=Q4q;var j2D=l4t;j2D+=R5t;j2D+=B56;var P2D=V5t;P2D+=H1t;P2D+=g8q;var selected=this[r8q]();if(selected[h6t] !== N71){return;}var editor=config[P2D];var i18nEdit=editor[j2D][B8p];o8E.v8E();var buttons=config[A2D];if(!buttons[F71][p2D]){var v2D=K2q;v2D+=m2t;buttons[F71][I7t]=i18nEdit[v2D];}editor[B8p](selected[F71],{title:i18nEdit[Q2D],buttons:buttons});}});ttButtons[C2D]=$[d2D](x6t,ttButtons[X8q],ttButtonBase,{question:g7t,formButtons:[{label:g7t,fn:function(e){var that=this;o8E.v8E();this[m7p](function(json){var S8q="fnSel";var Z8q="aT";var H8q="No";var a8q="Instance";var u8q="leTool";var o8q="Table";var Y8q="Get";var S2D=S8q;S2D+=y6t;S2D+=H8q;S2D+=I5p;var X2D=I6q;X2D+=l5t;X2D+=Z8q;X2D+=b86;var r2D=J9t;r2D+=Y8q;r2D+=a8q;var g2D=O86;o8E.v8E();g2D+=u8q;g2D+=y4t;var M2D=t36;M2D+=o8E.u5t;M2D+=o8q;var tt=$[J9t][M2D][g2D][r2D]($(that[y4t][c1p])[X2D]()[c1p]()[W16]());tt[S2D]();});}}],fnClick:function(button,config){var c8q="onf";var q8q="onfi";var E8q="repl";var K2D=d8q;K2D+=u3t;var L2D=u3t;L2D+=s6t;L2D+=G1t;o8E.D8E();var c2D=E8q;c2D+=T5q;var B2D=B0t;B2D+=o8E.u5t;B2D+=a6t;var J2D=d2p;J2D+=J8q;var E2D=B8q;E2D+=G1t;var o2D=o8E.q5t;o2D+=q8q;o2D+=q66;var u2D=o8E.q5t;u2D+=q8q;u2D+=p1t;u2D+=g1t;var a2D=B2p;a2D+=p1t;a2D+=l4p;var Y2D=o8E.q5t;Y2D+=c8q;Y2D+=J8q;var Z2D=C8q;Z2D+=M1t;var H2D=u3t;H2D+=D5t;H2D+=F1p;H2D+=G1t;var rows=this[r8q]();if(rows[H2D] === F71){return;}var editor=config[P4t];var i18nRemove=editor[q8t][r1p];var buttons=config[Z2D];var question=typeof i18nRemove[Y2D] === a2D?i18nRemove[u2D]:i18nRemove[L36][rows[h6t]]?i18nRemove[o2D][rows[E2D]]:i18nRemove[J2D][u1t];if(!buttons[F71][B2D]){var q2D=B0t;q2D+=o8E.u5t;q2D+=a6t;buttons[F71][q2D]=i18nRemove[m7p];}editor[r1p](rows,{message:question[c2D](/%d/g,rows[L2D]),title:i18nRemove[K2D],buttons:buttons});}});}var _buttons=DataTable[b2D][k56];$[S0p](_buttons,{create:{text:function(dt,node,config){var K8q='buttons.create';var F2D=C66;F2D+=D5t;var T2D=l4t;T2D+=R5t;T2D+=o8E.B5t;T2D+=D5t;var R2D=x3q;R2D+=h2t;R2D+=p1t;var w2D=L8q;w2D+=o8E.B5t;w2D+=D5t;return dt[w2D](K8q,config[R2D][T2D][Y46][F2D]);},className:N2D,editor:g7t,formButtons:{text:function(editor){var D2D=y4t;D2D+=f7p;D2D+=L56;var G2D=o8E.q5t;G2D+=p1t;G2D+=T36;o8E.v8E();var V2D=L8q;V2D+=o8E.B5t;V2D+=D5t;return editor[V2D][G2D][D2D];},action:function(e){var n2D=c56;n2D+=u2q;n2D+=l5t;this[n2D]();}},formMessage:g7t,formTitle:g7t,action:function(e,dt,node,config){var T8q="formTitle";var b8q="reOpen";var R8q="formMessage";var f3D=o8E.q5t;f3D+=p1t;f3D+=V5t;f3D+=Y0t;var I3D=l4t;I3D+=R5t;I3D+=o8E.B5t;I3D+=D5t;var k3D=o8E.q5t;k3D+=p1t;k3D+=o8E.o5t;k3D+=X0t;var m3D=l4t;m3D+=R5t;m3D+=o8E.B5t;m3D+=D5t;var z3D=t2t;z3D+=b8q;var l2D=x8q;l2D+=p1t;var that=this;var editor=config[l2D];this[C6t](x6t);editor[K1q](z3D,function(){o8E.v8E();that[C6t](W6t);})[Y46]({buttons:config[w8q],message:config[R8q] || editor[m3D][k3D][A7t],title:config[T8q] || editor[I3D][f3D][q36]});}},edit:{extend:t3D,text:function(dt,node,config){var F8q="ttons.ed";var h3D=y0t;h3D+=l5t;h3D+=r1t;h3D+=D5t;var s3D=V5t;s3D+=H1t;s3D+=m2t;var i3D=K56;i3D+=F8q;i3D+=m2t;var U3D=l4t;U3D+=R5t;U3D+=B56;return dt[U3D](i3D,config[P4t][q8t][s3D][h3D]);},className:N8q,editor:g7t,formButtons:{text:function(editor){var O3D=c56;O3D+=L76;var W3D=V5t;W3D+=H1t;W3D+=l4t;W3D+=l5t;return editor[q8t][W3D][O3D];},action:function(e){this[m7p]();}},formMessage:g7t,formTitle:g7t,action:function(e,dt,node,config){var D8q="essag";var n8q="pre";var V8q="formTi";var z7q="mn";var l8q="olu";var G8q="rmM";var C3D=l5t;C3D+=l4t;C3D+=e1q;var Q3D=V8q;Q3D+=e1q;var v3D=W4t;v3D+=V0t;v3D+=o8E.u5t;v3D+=M3t;var p3D=l4t;p3D+=R5t;p3D+=o8E.B5t;p3D+=D5t;var A3D=o6t;A3D+=G8q;o8E.D8E();A3D+=D8q;A3D+=V5t;var j3D=n8q;j3D+=c46;j3D+=D5t;var P3D=B0t;P3D+=d8p;P3D+=l5t;P3D+=G1t;var e3D=o8E.q5t;e3D+=I9q;e3D+=y4t;var x3D=o8E.q5t;x3D+=l8q;x3D+=z7q;x3D+=y4t;var y3D=x8q;y3D+=p1t;var that=this;var editor=config[y3D];var rows=dt[O9q]({selected:x6t})[m7q]();var columns=dt[x3D]({selected:x6t})[m7q]();var cells=dt[e3D]({selected:x6t})[m7q]();var items=columns[h6t] || cells[P3D]?{rows:rows,columns:columns,cells:cells}:rows;this[C6t](x6t);editor[K1q](j3D,function(){o8E.D8E();that[C6t](W6t);})[B8p](items,{buttons:config[w8q],message:config[A3D] || editor[p3D][B8p][v3D],title:config[Q3D] || editor[q8t][B8p][C3D]});}},remove:{extend:d3D,limitTo:[M3D],text:function(dt,node,config){var I7q="s.remov";var f7q="18n";var H3D=C66;H3D+=D5t;var S3D=l4t;S3D+=R5t;o8E.v8E();S3D+=o8E.B5t;S3D+=D5t;var X3D=V5t;X3D+=H1t;X3D+=k3t;X3D+=p1t;var r3D=y0t;r3D+=k7q;r3D+=I7q;r3D+=V5t;var g3D=l4t;g3D+=f7q;return dt[g3D](r3D,config[X3D][S3D][r1p][H3D]);},className:Z3D,editor:g7t,formButtons:{text:function(editor){var Y3D=p1t;Y3D+=a56;Y3D+=r1t;Y3D+=J3p;o8E.D8E();return editor[q8t][Y3D][m7p];},action:function(e){var a3D=E56;a3D+=J56;a3D+=l5t;this[a3D]();}},formMessage:function(editor,dt){var U7q="firm";var t7q="confi";var B3D=f5p;B3D+=k0p;var J3D=o8E.q5t;J3D+=w1t;J3D+=m4t;J3D+=J8q;var E3D=j9p;o8E.D8E();E3D+=m4t;E3D+=l4t;E3D+=q66;var o3D=t7q;o3D+=q66;var u3D=o8E.q5t;u3D+=r1t;u3D+=D5t;u3D+=U7q;var rows=dt[O9q]({selected:x6t})[m7q]();var i18n=editor[q8t][r1p];var question=typeof i18n[L36] === l56?i18n[u3D]:i18n[o3D][rows[h6t]]?i18n[E3D][rows[h6t]]:i18n[J3D][u1t];return question[U1p](/%d/g,rows[B3D]);},formTitle:g7t,action:function(e,dt,node,config){var i7q="ormTitle";var h7q="Buttons";var s7q="formM";var W7q="ndexes";var K3D=m4t;K3D+=i7q;var L3D=s7q;L3D+=C7p;var c3D=O26;c3D+=g1t;c3D+=h7q;var q3D=l4t;q3D+=W7q;var that=this;var editor=config[P4t];this[C6t](x6t);editor[K1q](Z1q,function(){o8E.v8E();that[C6t](W6t);})[r1p](dt[O9q]({selected:x6t})[q3D](),{buttons:config[c3D],message:config[L3D],title:config[K3D] || editor[q8t][r1p][q36]});}}});_buttons[b3D]=$[w3D]({},_buttons[R3D]);_buttons[T3D][S0p]=F3D;_buttons[O7q]=$[S0p]({},_buttons[N3D]);_buttons[O7q][S0p]=y7q;})();Editor[V3D]={};Editor[G3D]=function(input,opts){var R7q="ft\">";var t5a='-iconRight">';var x7q="constru";var w7q="iconLe";var A7q="_ins";var i5a='<span></span>';var b7q="previ";var o7q="<select";var I5a='-title">';var p5a=/[YMD]|L(?!T)|l/;var x5a='-title';var Q7q="-seco";var d5a="calendar";var K7q="ton>";var d7q="-hours\"></d";var H7q="/sele";var Z7q="-mont";var g7q="me\">";var O5a='-error"></div>';var v5a=/[Hhm]|LT|LTS/;var j5a='editor-dateime-';var h5a='-calendar"></div>';var Y7q="h\"";var P5a='-error';var k5a='-date">';var M7q="-t";var D7q="Editor datetime: Without momentjs only the format 'YYYY-MM-DD' can be used";var j7q="matc";var P7q="appen";var C7q="nds\"></div>";var f5a='<button>';var E7q=" class=\"";var e7q="ctor";var e5a='-calendar';var a7q="></sele";var S7q="-year\"><";var W5a='-minutes"></div>';var y5a='-date';var u7q="ct>";var q7q="</b";var c7q="utto";var J7q="<span></sp";var s5a='<select class="';var T7q="YYYY";var U5a='-label">';var L7q="</bu";var Q5a=/[haA]/;var p7q="-tim";var c9D=u1t;c9D+=x7q;c9D+=e7q;var q9D=P7q;q9D+=H1t;var B9D=D3t;B9D+=g1t;var J9D=L7t;J9D+=t2t;J9D+=a1t;J9D+=H1t;var E9D=D3t;E9D+=g1t;var o9D=H1t;o9D+=N1t;o9D+=V5t;var u9D=H1t;u9D+=r1t;u9D+=g1t;var a9D=G2p;a9D+=D5t;a9D+=H1t;var Y9D=o6t;Y9D+=p1t;Y9D+=g1t;Y9D+=N1t;var Z9D=K06;Z9D+=m4t;var H9D=j7q;H9D+=G1t;var S9D=j7q;S9D+=G1t;var X9D=A7q;X9D+=l5t;X9D+=o8E.u5t;X9D+=M4t;var r9D=g3t;r9D+=K1t;var g9D=p7q;g9D+=V5t;var M9D=g3t;M9D+=K1t;var d9D=v7q;d9D+=H1t;var C9D=R6t;C9D+=H1t;C9D+=r7p;C9D+=L6t;var Q9D=K6t;Q9D+=M7p;Q9D+=L6t;var v9D=Q7q;v9D+=C7q;var p9D=d7q;p9D+=r7p;p9D+=L6t;var A9D=M7q;A9D+=l4t;A9D+=g7q;var j9D=r7q;j9D+=y4t;j9D+=X7q;var P9D=R6t;P9D+=H1t;P9D+=r7p;P9D+=L6t;var e9D=S7q;e9D+=H7q;e9D+=r46;e9D+=L6t;var x9D=K6t;x9D+=I8t;x9D+=T6t;var y9D=Z7q;y9D+=Y7q;y9D+=a7q;y9D+=u7q;var O9D=o7q;O9D+=E7q;var W9D=J7q;W9D+=B7q;var h9D=q7q;h9D+=c7q;h9D+=D56;var s9D=L7q;s9D+=l5t;s9D+=K7q;var i9D=b7q;i9D+=r1t;i9D+=G9t;var U9D=N6t;U9D+=w7q;U9D+=R7q;var t9D=H66;t9D+=E7q;var f9D=F9t;f9D+=L6t;var z9D=T7q;z9D+=N6t;z9D+=e4t;var l3D=O26;l3D+=F7q;var n3D=E3p;n3D+=N7q;n3D+=l5t;var D3D=l4t;D3D+=R5t;D3D+=o8E.B5t;D3D+=D5t;this[o8E.q5t]=$[S0p](x6t,{},Editor[V7q][c8t],opts);var classPrefix=this[o8E.q5t][G7q];var i18n=this[o8E.q5t][D3D];if(!window[n3D] && this[o8E.q5t][l3D] !== z9D){throw D7q;}var timeBlock=function(type){var n7q='-timeblock">';o8E.D8E();var k9D=K6t;k9D+=b6t;k9D+=m3p;k9D+=L6t;var m9D=Q0p;m9D+=B66;return m9D + classPrefix + n7q + k9D;};var gap=function(){var m5a=">:</span>";o8E.v8E();var I9D=l7q;I9D+=z5a;I9D+=m5a;return I9D;};var structure=$(l8t + classPrefix + f9D + t9D + classPrefix + k5a + l8t + classPrefix + I5a + l8t + classPrefix + U9D + f5a + i18n[i9D] + s9D + e7t + l8t + classPrefix + t5a + f5a + i18n[D4q] + h9D + e7t + l8t + classPrefix + U5a + W9D + O9D + classPrefix + y9D + x9D + l8t + classPrefix + U5a + i5a + s5a + classPrefix + e9D + e7t + P9D + j9D + classPrefix + h5a + e7t + l8t + classPrefix + A9D + l8t + classPrefix + p9D + l8t + classPrefix + W5a + l8t + classPrefix + v9D + Q9D + l8t + classPrefix + O5a + C9D);this[o7t]={container:structure,date:structure[O16](D06 + classPrefix + y5a),title:structure[O16](D06 + classPrefix + x5a),calendar:structure[d9D](D06 + classPrefix + e5a),time:structure[M9D](D06 + classPrefix + g9D),error:structure[r9D](D06 + classPrefix + P5a),input:$(input)};this[y4t]={d:g7t,display:g7t,minutesRange:g7t,secondsRange:g7t,namespace:j5a + Editor[V7q][X9D]++,parts:{date:this[o8E.q5t][A5a][S9D](p5a) !== g7t,time:this[o8E.q5t][A5a][H9D](v5a) !== g7t,seconds:this[o8E.q5t][A5a][Z9D](E9t) !== -N71,hours12:this[o8E.q5t][Y9D][B5q](Q5a) !== g7t}};this[o7t][i5p][a9D](this[u9D][o9D])[B0p](this[o7t][C06])[B0p](this[E9D][S5p]);this[o7t][C5a][J9D](this[B9D][q36])[q9D](this[o7t][d5a]);this[c9D]();};$[S0p](Editor[V7q][h0p],{destroy:function(){var X5a="cont";var g5a="r-da";var M5a=".edito";var R9D=M5a;R9D+=g5a;R9D+=h4t;R9D+=W4t;var w9D=a56;w9D+=r5a;var b9D=r1t;b9D+=m4t;b9D+=m4t;var K9D=X5a;K9D+=o8E.u5t;K9D+=h4p;o8E.v8E();var L9D=u1t;L9D+=G1t;L9D+=l4t;L9D+=l3t;this[L9D]();this[o7t][K9D][b9D]()[w9D]();this[o7t][h7t][V9p](R9D);},errorMsg:function(msg){var T9D=D3t;T9D+=g1t;var error=this[T9D][S5p];if(msg){error[P4p](msg);}else {var F9D=V5t;F9D+=T2q;F9D+=l5t;F9D+=t0t;error[F9D]();}},hide:function(){var N9D=u1t;N9D+=W9p;o8E.D8E();N9D+=V5t;this[N9D]();},max:function(date){var V9D=S5a;V9D+=H5a;this[o8E.q5t][Z5a]=date;this[Y5a]();o8E.D8E();this[V9D]();},min:function(date){var a5a="_setC";var u5a="ala";var o5a="inD";var D9D=a5a;D9D+=u5a;D9D+=H5a;var G9D=g1t;G9D+=o5a;G9D+=o8E.u5t;G9D+=X0t;this[o8E.q5t][G9D]=date;this[Y5a]();this[D9D]();},owns:function(node){var E5a="filt";var z6D=B0t;z6D+=V5t;z6D+=D5t;z6D+=i6t;var l9D=H1t;l9D+=r1t;o8E.D8E();l9D+=g1t;var n9D=E5a;n9D+=U3t;return $(node)[h26]()[n9D](this[l9D][i5p])[z6D] > F71;},val:function(set,write){var J5a="_set";var D5a=/(\d{4})\-(\d{2})\-(\d{2})/;var B5a="Ti";var L5a="--";var m4a="_dateToUtc";var q5a="spla";var R5a="momen";var G5a="tch";var l5a="_writeOut";var K5a="dateToUtc";var V5a="toDate";var w5a="isVa";var T5a="utc";var c5a="toS";var O6D=J5a;O6D+=B5a;O6D+=l5t;O6D+=u3t;var W6D=F4t;W6D+=q5a;W6D+=t0t;var h6D=c5a;h6D+=n4p;h6D+=C3t;h6D+=q0t;var k6D=L5a;k6D+=D5t;k6D+=r1t;k6D+=a0t;if(set === undefined){return this[y4t][H1t];}if(set instanceof Date){var m6D=u1t;m6D+=K5a;this[y4t][H1t]=this[m6D](set);}else if(set === g7t || set === o9t){this[y4t][H1t]=g7t;}else if(set === k6D){this[y4t][H1t]=new Date();}else if(typeof set === l56){if(window[b5a]){var f6D=w5a;f6D+=b56;f6D+=H1t;var I6D=R5a;I6D+=l5t;var m=window[I6D][T5a](set,this[o8E.q5t][A5a],this[o8E.q5t][F5a],this[o8E.q5t][N5a]);this[y4t][H1t]=m[f6D]()?m[V5a]():g7t;}else {var t6D=g1t;t6D+=o8E.u5t;t6D+=G5a;var match=set[t6D](D5a);this[y4t][H1t]=match?new Date(Date[n5a](match[N71],match[V71] - N71,match[G71])):g7t;}}if(write || write === undefined){if(this[y4t][H1t]){var U6D=l5a;U6D+=z4a;this[U6D]();}else {var s6D=R5p;s6D+=l5t;var i6D=H1t;i6D+=r1t;i6D+=g1t;this[i6D][s6D][v4p](set);}}if(!this[y4t][H1t]){this[y4t][H1t]=this[m4a](new Date());}this[y4t][r0p]=new Date(this[y4t][H1t][h6D]());this[y4t][W6D][k4a](N71);this[O6D]();this[I4a]();this[f4a]();},_constructor:function(){var Q4a='autocomplete';var U4a="ha";var s4a="focus.e";var y4a="eco";var O4a="ionsTitle";var A4a="parts";var h4a="ditor-datetime click.editor-datetime";var i4a="ner";var v4a="onds";o8E.D8E();var r4a='keyup.editor-datetime';var E4a="_setTitle";var r8D=r1t;r8D+=D5t;var I8D=t4a;I8D+=V5t;I8D+=o8E.q5t;I8D+=l5t;var k8D=o8E.q5t;k8D+=U4a;k8D+=d9t;k8D+=V5t;var m8D=r1t;m8D+=D5t;var z8D=B5p;z8D+=l4t;z8D+=i4a;var l6D=D3t;l6D+=g1t;var V6D=r1t;V6D+=D5t;var c6D=s4a;c6D+=h4a;var q6D=r1t;q6D+=D5t;var B6D=r1t;B6D+=m4t;B6D+=m4t;var J6D=R5p;J6D+=l5t;var E6D=H1t;E6D+=r1t;E6D+=g1t;var o6D=W4a;o6D+=l5t;o6D+=O4a;var r6D=y4t;r6D+=y4a;r6D+=K1t;r6D+=y4t;var C6D=c2t;C6D+=x4a;var p6D=t2t;p6D+=e4a;p6D+=m9t;var that=this;var classPrefix=this[o8E.q5t][G7q];var onChange=function(){var P4a="nC";var A6D=D3t;A6D+=g1t;var j6D=N5t;j6D+=o8E.u5t;j6D+=B0t;var P6D=C3t;P6D+=z4a;var e6D=H1t;e6D+=r1t;e6D+=g1t;var x6D=o8E.q5t;x6D+=z4p;x6D+=B0t;var y6D=r1t;y6D+=P4a;y6D+=U4a;y6D+=j4a;that[o8E.q5t][y6D][x6D](that,that[e6D][P6D][j6D](),that[y4t][H1t],that[A6D][h7t]);};if(!this[y4t][p6D][C5a]){var Q6D=o8E.q5t;Q6D+=y4t;Q6D+=y4t;var v6D=H1t;v6D+=U5p;this[v6D][C5a][Q6D](h5p,c4p);}if(!this[y4t][C6D][C06]){var g6D=S1p;g6D+=I5p;var M6D=o8E.q5t;M6D+=y4t;M6D+=y4t;var d6D=l5t;d6D+=l4t;d6D+=g1t;d6D+=V5t;this[o7t][d6D][M6D](h5p,g6D);}if(!this[y4t][A4a][r6D]){var u6D=T1q;u6D+=N5t;u6D+=V5t;var a6D=y4t;a6D+=c2t;a6D+=D5t;var Y6D=o8E.q5t;Y6D+=m6p;Y6D+=t5p;var Z6D=l5t;Z6D+=l4t;Z6D+=g1t;Z6D+=V5t;var H6D=H1t;H6D+=r1t;H6D+=g1t;var S6D=N6t;S6D+=p4a;S6D+=v4a;var X6D=H1t;X6D+=l4t;X6D+=N5t;X6D+=T5t;this[o7t][C06][D7p](X6D + classPrefix + S6D)[r1p]();this[H6D][Z6D][Y6D](a6D)[G7p](N71)[u6D]();}this[o6D]();this[E6D][J6D][Q6p](Q4a,B6D)[q6D](c6D,function(){var M4a="sabl";var g4a=':visible';var d4a=":di";var N6D=u1t;o8E.v8E();N6D+=y4t;N6D+=Y0p;var F6D=l4t;F6D+=C4a;var T6D=d4a;T6D+=M4a;T6D+=V5t;T6D+=H1t;var R6D=l4t;R6D+=y4t;var w6D=l4t;w6D+=b5p;w6D+=T1t;w6D+=l5t;var b6D=H1t;b6D+=U5p;var K6D=X5p;K6D+=U3t;var L6D=H1t;L6D+=U5p;if(that[L6D][K6D][y4p](g4a) || that[b6D][w6D][R6D](T6D)){return;}that[v4p](that[o7t][F6D][v4p](),W6t);that[N6D]();})[V6D](r4a,function(){var X4a="isible";var n6D=R5q;n6D+=N5t;n6D+=X4a;var D6D=l4t;D6D+=y4t;var G6D=H1t;G6D+=r1t;G6D+=g1t;if(that[G6D][i5p][D6D](n6D)){that[v4p](that[o7t][h7t][v4p](),W6t);}});this[l6D][z8D][m8D](k8D,I8D,function(){var k1a="_position";var o4a="_correctMonth";var V4a="tainer";var L4a='-hours';var n4a="setUTCMinutes";var q4a="lY";var G4a="setUTCHours";var D4a="etUTCHour";var u4a='-month';var b4a="_writ";var l4a="_writeOutput";var R4a="etT";var w4a="eOutput";var B4a="setUTCFul";var z1a='-seconds';var Y4a="hasCla";var F4a="pm";var S4a="-mi";var a4a="-y";var J4a="etTitle";var N4a="-h";var K4a='-ampm';var g8D=l4t;g8D+=D5t;g8D+=S4p;g8D+=l5t;var M8D=S4a;M8D+=D5t;M8D+=T1t;M8D+=H4a;var d8D=g6p;d8D+=o8E.u5t;d8D+=V0t;var W8D=Z4a;W8D+=r5p;W8D+=y4t;W8D+=y4t;var h8D=Y4a;h8D+=y4t;h8D+=y4t;var t8D=a4a;t8D+=o8E.o5t;t8D+=p1t;var f8D=N5t;f8D+=o8E.u5t;f8D+=B0t;var select=$(this);var val=select[f8D]();if(select[q7t](classPrefix + u4a)){that[o4a](that[y4t][r0p],val);that[E4a]();that[I4a]();}else if(select[q7t](classPrefix + t8D)){var s8D=u1t;s8D+=y4t;s8D+=J4a;var i8D=B4a;i8D+=q4a;i8D+=c4a;var U8D=F4t;U8D+=L9p;U8D+=Y3t;that[y4t][U8D][i8D](val);that[s8D]();that[I4a]();}else if(select[h8D](classPrefix + L4a) || select[W8D](classPrefix + K4a)){var C8D=b4a;C8D+=w4a;var Q8D=Z0p;Q8D+=R4a;Q8D+=C4t;Q8D+=V5t;var O8D=G1t;O8D+=r1t;O8D+=T4a;if(that[y4t][A4a][O8D]){var p8D=t2t;p8D+=g1t;var A8D=N6t;A8D+=v96;A8D+=F4a;var j8D=v7q;j8D+=H1t;var P8D=D3t;P8D+=g1t;var e8D=N4a;e8D+=M3p;e8D+=z66;var x8D=j9p;x8D+=V4a;var y8D=H1t;y8D+=r1t;y8D+=g1t;var hours=$(that[y8D][x8D])[O16](D06 + classPrefix + e8D)[v4p]() * N71;var pm=$(that[P8D][i5p])[j8D](D06 + classPrefix + A8D)[v4p]() === p8D;that[y4t][H1t][G4a](hours === I5t && !pm?F71:pm && hours !== I5t?hours + I5t:hours);}else {var v8D=y4t;v8D+=D4a;v8D+=y4t;that[y4t][H1t][v8D](val);}that[Q8D]();that[C8D](x6t);onChange();}else if(select[d8D](classPrefix + M8D)){that[y4t][H1t][n4a](val);that[f4a]();that[l4a](x6t);onChange();}else if(select[q7t](classPrefix + z1a)){that[y4t][H1t][m1a](val);that[f4a]();that[l4a](x6t);onChange();}that[o7t][g8D][T5p]();that[k1a]();})[r8D](E7t,function(e){var w1a='setUTCHours';var h1a="Right";var J1a="getUTCHours";o8E.v8E();var D1a="_dateTo";var N1a="setUT";var L1a="urs";var s1a="-ico";var j1a="Month";var l1a='year';var W1a="ran";var P1a="etUT";var U1a='select';var M1a="seco";var c1a="Ho";var f1a="nodeNa";var d1a="conds";var V1a="CFullYear";var I1a="tar";var p1a="_correctMont";var i1a="stopPropagation";var K1a="CHour";var t1a="parentNode";var o1a="secondsRange";var E1a="econdsRa";var G1a="tUTCDate";var T1a='setUTCMinutes';var b1a="getUT";var S1a='range';var Q1a="etTime";var y1a="blu";var F1a="_writeOutp";var e1a="_setTit";var g1a="utes";var C1a="tSe";var n1a="Ut";var u1a="isabl";var H1a="minutes";var v1a="writeOutp";var Z8D=y0t;Z8D+=k7q;var H8D=I1a;H8D+=q0t;H8D+=v3t;var S8D=y4t;S8D+=t2t;S8D+=o8E.u5t;S8D+=D5t;var X8D=f1a;X8D+=W4t;var d=that[y4t][H1t];var nodeName=e[y16][X8D][L5q]();var target=nodeName === S8D?e[H8D][t1a]:e[y16];nodeName=target[b3q][L5q]();if(nodeName === U1a){return;}e[i1a]();if(nodeName === Z8D){var F8D=N6t;F8D+=C06;var K8D=s1a;K8D+=D5t;K8D+=h1a;var L8D=U4a;L8D+=y4t;L8D+=Z5p;L8D+=Y5p;var E8D=g6p;E8D+=Y5p;var u8D=W1a;u8D+=M3t;var a8D=t4p;a8D+=n1p;a8D+=I4t;var Y8D=Z4a;Y8D+=r5p;Y8D+=V0t;var button=$(target);var parent=button[O1a]();if(parent[Y8D](a8D) && !parent[q7t](u8D)){var o8D=y1a;o8D+=p1t;button[o8D]();return;}if(parent[E8D](classPrefix + x1a)){var c8D=N5p;c8D+=G9t;var q8D=l4t;q8D+=D5t;q8D+=S4p;q8D+=l5t;var B8D=e1a;B8D+=u3t;var J8D=y4t;J8D+=P1a;J8D+=Z0t;J8D+=j1a;that[y4t][r0p][J8D](that[y4t][r0p][A1a]() - N71);that[B8D]();that[I4a]();that[o7t][q8D][c8D]();}else if(parent[L8D](classPrefix + K8D)){var T8D=m4t;T8D+=r1t;T8D+=j7p;T8D+=y4t;var R8D=S5a;R8D+=H5a;var w8D=H1t;w8D+=y4p;w8D+=K7t;w8D+=Z7t;var b8D=p1a;b8D+=G1t;that[b8D](that[y4t][r0p],that[y4t][w8D][A1a]() + N71);that[E4a]();that[R8D]();that[o7t][h7t][T8D]();}else if(button[h26](D06 + classPrefix + F8D)[h6t]){var x7D=u1t;x7D+=v1a;x7D+=w5p;var y7D=Z0p;y7D+=Q1a;var O7D=o0t;O7D+=C1a;O7D+=d1a;var W7D=G1t;W7D+=r1t;W7D+=V8p;W7D+=y4t;var i7D=t2t;i7D+=g1t;var m7D=M1a;m7D+=K1t;m7D+=y4t;var D8D=g1t;D8D+=C3t;D8D+=g1a;var G8D=v3p;G8D+=l4t;G8D+=l5t;var V8D=s4t;V8D+=l9t;var N8D=H1t;N8D+=o8E.u5t;N8D+=l5t;N8D+=o8E.u5t;var val=button[N8D](U96);var unit=button[V8D](G8D);if(unit === D8D){var l8D=o2p;l8D+=r1a;l8D+=y4t;var n8D=g6p;n8D+=Y5p;if(parent[n8D](X1a) && parent[l8D](S1a)){var z7D=H1a;z7D+=Z1a;that[y4t][z7D]=val;that[f4a]();return;}else {that[y4t][Y1a]=g7t;}}if(unit === m7D){var f7D=p1t;f7D+=a1a;var I7D=U4a;I7D+=y4t;I7D+=r1a;I7D+=y4t;var k7D=H1t;k7D+=u1a;k7D+=V5t;k7D+=H1t;if(parent[q7t](k7D) && parent[I7D](f7D)){that[y4t][o1a]=val;that[f4a]();return;}else {var t7D=y4t;t7D+=E1a;t7D+=D5t;t7D+=M3t;that[y4t][t7D]=g7t;}}if(val === U3q){if(d[J1a]() >= I5t){var U7D=B1a;U7D+=q1a;U7D+=c1a;U7D+=L1a;val=d[U7D]() - I5t;}else {return;}}else if(val === i7D){var s7D=q0t;s7D+=P1a;s7D+=K1a;s7D+=y4t;if(d[s7D]() < I5t){var h7D=b1a;h7D+=K1a;h7D+=y4t;val=d[h7D]() + I5t;}else {return;}}var set=unit === W7D?w1a:unit === R1a?T1a:O7D;d[set](val);that[y7D]();that[x7D](x6t);onChange();}else {var Q7D=j6t;Q7D+=W4t;var v7D=F1a;v7D+=w5p;var p7D=H1t;p7D+=o8E.u5t;p7D+=t0t;var A7D=t36;A7D+=o8E.u5t;var j7D=N1a;j7D+=V1a;var P7D=o0t;P7D+=G1a;if(!d){var e7D=D1a;e7D+=n1a;e7D+=o8E.q5t;d=that[e7D](new Date());}d[P7D](N71);d[j7D](button[N8t](l1a));d[z0a](button[A7D](m0a));d[k4a](button[N8t](p7D));that[v7D](x6t);if(!that[y4t][A4a][Q7D]){setTimeout(function(){that[b0p]();},m5t);}else {that[I4a]();}onChange();}}else {that[o7t][h7t][T5p]();}});},_compareDates:function(a,b){var f0a="_dateToUtcString";var k0a="_dateT";var I0a="oUtcString";o8E.D8E();var C7D=k0a;C7D+=I0a;return this[f0a](a) === this[C7D](b);},_correctMonth:function(date,month){var U0a="ays";var i0a="InMonth";var t0a="tUTCDat";var M7D=M3t;M7D+=t0a;M7D+=V5t;var d7D=a0p;d7D+=U0a;d7D+=i0a;var days=this[d7D](date[s0a](),month);var correctDays=date[M7D]() > days;date[z0a](month);o8E.v8E();if(correctDays){date[k4a](days);date[z0a](month);}},_daysInMonth:function(year,month){var e5t=30;var P5t=31;var y5t=28;var x5t=29;var isLeap=year % D71 === F71 && (year % d5t !== F71 || year % g5t === F71);o8E.v8E();var months=[P5t,isLeap?x5t:y5t,P5t,e5t,P5t,e5t,P5t,P5t,e5t,P5t,e5t,P5t];return months[month];},_dateToUtc:function(s){var h0a="Seconds";var O0a="Hours";var W0a="getMinu";var x0a="getMonth";var S7D=Q56;S7D+=h0a;var X7D=W0a;X7D+=X0t;X7D+=y4t;var r7D=M3t;r7D+=l5t;r7D+=O0a;var g7D=Q56;g7D+=R4t;g7D+=o8E.u5t;g7D+=X0t;return new Date(Date[n5a](s[y0a](),s[x0a](),s[g7D](),s[r7D](),s[X7D](),s[S7D]()));},_dateToUtcString:function(d){var e0a="getUTCDat";var Y7D=e0a;Y7D+=V5t;var Z7D=P0a;Z7D+=o8E.u5t;Z7D+=H1t;var H7D=u1t;H7D+=t2t;H7D+=o8E.u5t;H7D+=H1t;return d[s0a]() + I36 + this[H7D](d[A1a]() + N71) + I36 + this[Z7D](d[Y7D]());},_hide:function(){var d0a='scroll.';var M0a='click.';var C0a="pac";var Q0a="rollBody";var A0a="Body_Content";var p0a="dataTables";var v0a="_sc";var j0a="div.DTE_";var c7D=j0a;c7D+=A0a;var q7D=r1t;q7D+=m4t;q7D+=m4t;var B7D=J6p;B7D+=p0a;B7D+=v0a;B7D+=Q0a;var J7D=Y4q;J7D+=n5q;J7D+=T5t;var E7D=r1t;E7D+=m4t;E7D+=m4t;var o7D=l3t;o7D+=l9t;o7D+=o8E.q5t;o7D+=G1t;var u7D=D3t;u7D+=g1t;var a7D=g8t;a7D+=V6t;a7D+=C0a;a7D+=V5t;var namespace=this[y4t][a7D];this[u7D][i5p][o7D]();$(window)[V9p](D06 + namespace);$(document)[E7D](J7D + namespace);$(B7D)[q7D](d0a + namespace);$(c7D)[V9p](d0a + namespace);$(p2p)[V9p](M0a + namespace);},_hours24To12:function(val){o8E.D8E();return val === F71?I5t:val > I5t?val - I5t:val;},_htmlDay:function(day){var q0a="a-day=\"";var Z0a="ta-month=\"";var G0a='-day" type="button" ';var w0a="<td class";var R0a="=\"empty\"></td>";var V0a="day";var g0a="</s";var r0a="pan>";var c0a="toda";var N0a='selected';var B0a="<td d";var T0a='now';var a0a="button ";var L0a="classP";var K0a="ref";var H0a="ay=\"";var S0a="-d";var n0a="month";var E0a=" class";var J0a="=";var X0a="\" data";var D0a='data-year="';var i51=R6t;i51+=l5t;i51+=H1t;i51+=L6t;var U51=g0a;U51+=t2t;U51+=o8E.u5t;U51+=D56;var t51=H1t;t51+=o8E.u5t;t51+=t0t;var f51=l7q;f51+=r0a;var I51=X0a;I51+=S0a;I51+=H0a;var k51=F9t;k51+=M9t;k51+=s4t;k51+=Z0a;var m51=Y0a;m51+=o8E.u5t;m51+=p1t;var z51=N6t;z51+=a0a;var l7D=u0a;l7D+=X7q;var n7D=F9t;n7D+=L6t;var D7D=o0a;D7D+=D5t;var G7D=F9t;G7D+=E0a;G7D+=J0a;G7D+=F9t;var V7D=B0a;V7D+=N1t;V7D+=q0a;var F7D=c0a;F7D+=t0t;var w7D=F4t;w7D+=q2t;w7D+=b1p;w7D+=I4t;var b7D=L0a;b7D+=K0a;b7D+=l4t;b7D+=t4t;var K7D=o0t;K7D+=u3t;K7D+=o8E.q5t;o8E.D8E();K7D+=c1p;if(day[b0a]){var L7D=w0a;L7D+=R0a;return L7D;}var classes=[K7D];var classPrefix=this[o8E.q5t][b7D];if(day[w7D]){var T7D=t4p;T7D+=N4t;var R7D=t2t;R7D+=T1t;R7D+=y4t;R7D+=G1t;classes[R7D](T7D);}if(day[F7D]){classes[t6t](T0a);}if(day[F0a]){var N7D=t2t;N7D+=T1t;N7D+=y4t;N7D+=G1t;classes[N7D](N0a);}return V7D + day[V0a] + G7D + classes[D7D](m7t) + n7D + l7D + classPrefix + z51 + classPrefix + G0a + D0a + day[m51] + k51 + day[n0a] + I51 + day[V0a] + U7t + f51 + day[t51] + U51 + l0a + i51;},_htmlMonth:function(year,month){var Z2a="getUTCD";var R2a=' weekNumber';var r2a="tUT";var J2a="Dates";var y2a="umber";var s5t=23;var X2a="Minutes";var H2a="CHou";var A2a="_dateToUt";var x2a="sP";var M2a="tSeco";var i2a="ead";var O2a="howWeekN";var c2a="eek";var f2a="lMonth";var K2a="_htmlWeekOfYear";var g2a="nds";var T2a="iconRi";var e2a="refi";var q2a="showW";var I2a="_htm";var P2a="max";var p2a="_daysInMonth";var B2a="_htmlDay";var j2a="tUTC";var E2a="mpare";var L2a="Number";var z2a="/tbo";var o2a="compareD";var u2a="Day";o8E.v8E();var h2a="able cl";var m2a="dy>";var C2a="etUTCMinu";var U2a="<th";var k2a="thead>";var S2a="setU";var v2a="firstDay";var t2a="He";var d2a="setUTCHou";var w51=K6t;w51+=z2a;w51+=m2a;var b51=T8p;b51+=r1t;b51+=l4t;b51+=D5t;var K51=R6t;K51+=k2a;var L51=I2a;L51+=f2a;L51+=t2a;L51+=W8p;var c51=U2a;c51+=i2a;c51+=L6t;var q51=s2a;q51+=h2a;q51+=W2a;var S51=y4t;S51+=O2a;S51+=y2a;var X51=N6t;X51+=l5t;X51+=o8E.u5t;X51+=K3t;var r51=s56;r51+=x2a;r51+=e2a;r51+=t4t;var W51=P2a;W51+=R4t;W51+=Y0t;var h51=M3t;h51+=j2a;h51+=R4t;h51+=Z7t;var s51=A2a;s51+=o8E.q5t;var now=this[s51](new Date()),days=this[p2a](year,month),before=new Date(Date[n5a](year,month,N71))[h51](),data=[],row=[];if(this[o8E.q5t][v2a] > F71){before-=this[o8E.q5t][v2a];if(before < F71){before+=l71;}}var cells=days + before,after=cells;while(after > l71){after-=l71;}cells+=l71 - after;var minDate=this[o8E.q5t][Q2a];var maxDate=this[o8E.q5t][W51];if(minDate){var y51=y4t;y51+=C2a;y51+=H4a;var O51=d2a;O51+=z66;minDate[O51](F71);minDate[y51](F71);minDate[m1a](F71);}if(maxDate){var P51=o0t;P51+=M2a;P51+=g2a;var e51=o0t;e51+=r2a;e51+=Z0t;e51+=X2a;var x51=S2a;x51+=V1t;x51+=H2a;x51+=z66;maxDate[x51](s5t);maxDate[e51](v5t);maxDate[P51](v5t);}for(var i=F71,r=F71;i < cells;i++){var d51=t2t;d51+=T1t;d51+=y4t;d51+=G1t;var C51=z2q;C51+=L3t;var Q51=Z2a;Q51+=Z7t;var v51=l4t;v51+=Y2a;v51+=u56;var p51=a2a;p51+=V5t;p51+=u2a;p51+=y4t;var A51=u1t;A51+=o2a;A51+=o8E.u5t;A51+=H4a;var j51=u1t;j51+=l7t;j51+=E2a;j51+=J2a;var day=new Date(Date[n5a](year,month,N71 + (i - before))),selected=this[y4t][H1t]?this[j51](day,this[y4t][H1t]):W6t,today=this[A51](day,now),empty=i < before || i >= days + before,disabled=minDate && day < minDate || maxDate && day > maxDate;var disableDays=this[o8E.q5t][p51];if(Array[v51](disableDays) && $[X4p](day[Q51](),disableDays) !== -N71){disabled=x6t;}else if(typeof disableDays === C51 && disableDays(day) === x6t){disabled=x6t;}var dayConfig={day:N71 + (i - before),month:month,year:year,selected:selected,today:today,disabled:disabled,empty:empty};row[d51](this[B2a](dayConfig));if(++r === l71){var g51=t2t;g51+=G9t;g51+=G1t;var M51=q2a;M51+=c2a;M51+=L2a;if(this[o8E.q5t][M51]){row[y0p](this[K2a](i - before,month,year));}data[g51](b2a + row[k36](o9t) + w2a);row=[];r=F71;}}var classPrefix=this[o8E.q5t][r51];var className=classPrefix + X51;if(this[o8E.q5t][S51]){className+=R2a;}if(minDate){var Y51=w3t;Y51+=o8E.u5t;Y51+=t0t;var Z51=o8E.q5t;Z51+=y4t;Z51+=y4t;var H51=f4p;H51+=q1a;var underMin=minDate >= new Date(Date[H51](year,month,N71,F71,F71,F71));this[o7t][q36][O16](a36 + classPrefix + x1a)[Z51](Y51,underMin?c4p:i0p);}if(maxDate){var B51=Y4t;B51+=o4p;B51+=E4p;var J51=D5t;J51+=K1q;var E51=o8E.q5t;E51+=y4t;E51+=y4t;var o51=N6t;o51+=T2a;o51+=i3p;var u51=g3t;u51+=D5t;u51+=H1t;var a51=D3t;a51+=g1t;var overMax=maxDate < new Date(Date[n5a](year,month + N71,N71,F71,F71,F71));this[a51][q36][u51](a36 + classPrefix + o51)[E51](h5p,overMax?J51:B51);}return q51 + className + U7t + c51 + this[L51]() + K51 + F2a + data[b51](o9t) + w51 + N2a;},_htmlMonthHead:function(){var n2a='<th></th>';var V2a="owWeekNu";var l2a='<th>';var G2a="firstD";var z3a='</th>';o8E.D8E();var N51=T8p;N51+=r1t;N51+=l4t;N51+=D5t;var F51=H4p;F51+=V2a;F51+=g1t;F51+=z0t;var T51=l4t;T51+=R5t;T51+=o8E.B5t;T51+=D5t;var R51=G2a;R51+=Z7t;var a=[];var firstDay=this[o8E.q5t][R51];var i18n=this[o8E.q5t][T51];var dayName=function(day){var D2a="weekdays";day+=firstDay;while(day >= l71){day-=l71;}return i18n[D2a][day];};if(this[o8E.q5t][F51]){a[t6t](n2a);}for(var i=F71;i < l71;i++){a[t6t](l2a + dayName(i) + z3a);}return a[N51](o9t);},_htmlWeekOfYear:function(d,m,y){var i3a="ceil";var s3a='-week">';var k3a="classPr";var I3a="td cl";var t3a="getDate";var m3a="d>";var f3a="tDa";var U3a="getDay";var Y5t=86400000;var n51=R6t;n51+=l5t;n51+=m3a;var D51=k3a;D51+=q8p;D51+=X8t;var G51=K6t;G51+=I3a;G51+=W2a;var V51=o0t;V51+=f3a;V51+=l5t;V51+=V5t;var date=new Date(y,m,d,F71,F71,F71,F71);date[V51](date[t3a]() + D71 - (date[U3a]() || l71));var oneJan=new Date(y,F71,N71);var weekNum=Math[i3a](((date - oneJan) / Y5t + N71) / l71);return G51 + this[o8E.q5t][D51] + s3a + weekNum + n51;},_options:function(selector,values,labels){var e3a="value=\"";var h3a="emp";var W3a="sele";var x3a="<option ";var y3a="ion>";var O3a="/op";var m41=h3a;m41+=y3t;var z41=W3a;z41+=r46;z41+=T5t;var l51=m4t;l51+=M9p;if(!labels){labels=values;}var select=this[o7t][i5p][l51](z41 + this[o8E.q5t][G7q] + I36 + selector);select[m41]();o8E.D8E();for(var i=F71,ien=values[h6t];i < ien;i++){var I41=K6t;I41+=O3a;I41+=l5t;I41+=y3a;var k41=x3a;k41+=e3a;select[B0p](k41 + values[i] + U7t + labels[i] + I41);}},_optionSet:function(selector,val){var j3a="unknown";var P3a="ption:se";var O41=l4t;O41+=o9p;O41+=D5t;var W41=u3t;W41+=d9t;W41+=l5t;W41+=G1t;var h41=r1t;h41+=P3a;h41+=O8q;var s41=N5t;s41+=z4p;var i41=y4t;i41+=z5a;var U41=t4a;U41+=V5t;U41+=r46;U41+=T5t;var t41=m4t;t41+=l4t;t41+=K1t;var f41=o8E.q5t;f41+=u4p;var select=this[o7t][f41][t41](U41 + this[o8E.q5t][G7q] + I36 + selector);o8E.D8E();var span=select[O1a]()[D7p](i41);select[s41](val);var selected=select[O16](h41);span[P4p](selected[W41] !== F71?selected[m46]():this[o8E.q5t][O41][j3a]);},_optionsTime:function(unit,count,val,allowed,range){var Y3a="amPm";var E3a='</tbody></thead><table class="';var A3a="/tb";var o3a="r>";var c3a='<thead><tr><th colspan="';var u3a="</t";var a3a="/t";var J3a='-nospace"><tbody>';var q3a='<table class="';var n71=6;var p3a="ody>";var L3a='</th></tr></thead>';var B3a="floor";var B41=K6t;B41+=A3a;B41+=p3a;var J41=F9t;J41+=L6t;var E41=F9t;E41+=L6t;var o41=V5t;o41+=g1t;o41+=t2t;o41+=y3t;var e41=l4t;e41+=R5t;e41+=o8E.B5t;e41+=D5t;var x41=N6t;x41+=c1p;var y41=H1t;y41+=r1t;y41+=g1t;var classPrefix=this[o8E.q5t][G7q];var container=this[y41][i5p][O16](a36 + classPrefix + I36 + unit);var i,j;var render=count === I5t?function(i){o8E.v8E();return i;}:this[v3a];var classPrefix=this[o8E.q5t][G7q];var className=classPrefix + x41;var i18n=this[o8E.q5t][e41];if(!container[h6t]){return;}var a=o9t;var span=m5t;var button=function(value,label,className){var H3a='" data-value="';var g3a="ta-unit=\"";var X3a=' disabled';var r3a="-butt";var Q3a="/td";var M3a="\" type=\"button\" da";var C3a="</sp";var S3a='<td class="selectable ';var d3a="-day";var M41=K6t;M41+=Q3a;M41+=L6t;var d41=C3a;d41+=B7q;var C41=F9t;C41+=L6t;var Q41=d3a;Q41+=M3a;Q41+=g3a;var v41=r3a;v41+=r1t;v41+=D5t;v41+=M9t;var p41=u0a;p41+=X7q;var A41=F9t;A41+=L6t;var j41=X8q;j41+=I4t;var P41=o8E.u5t;P41+=g1t;if(count === I5t && typeof value === a46){if(val >= I5t){value+=I5t;}if(value == I5t){value=F71;}else if(value == h5t){value=I5t;}}var selected=val === value || value === P41 && val < I5t || value === i3q && val >= I5t?j41:o9t;if(allowed && $[X4p](value,allowed) === -N71){selected+=X3a;}if(className){selected+=m7t + className;}return S3a + selected + A41 + p41 + classPrefix + v41 + classPrefix + Q41 + unit + H3a + value + C41 + Z3a + label + d41 + l0a + M41;};if(count === I5t){var X41=t2t;X41+=g1t;var r41=K6t;r41+=l5t;r41+=p1t;r41+=L6t;var g41=o8E.u5t;g41+=g1t;a+=b2a;for(i=N71;i <= n71;i++){a+=button(i,render(i));}a+=button(g41,i18n[Y3a][F71]);a+=w2a;a+=r41;for(i=l71;i <= I5t;i++){a+=button(i,render(i));}a+=button(X41,i18n[Y3a][N71]);a+=w2a;span=l71;}else if(count === h5t){var c=F71;for(j=F71;j < D71;j++){var H41=K6t;H41+=a3a;H41+=p1t;H41+=L6t;var S41=K6t;S41+=l5t;S41+=p1t;S41+=L6t;a+=S41;for(i=F71;i < n71;i++){a+=button(c,render(c));c++;}a+=H41;}span=n71;}else {var u41=u3a;u41+=p1t;u41+=L6t;var a41=s2a;a41+=o3a;var Z41=K6t;Z41+=l5t;Z41+=p1t;Z41+=L6t;a+=Z41;for(j=F71;j < Q5t;j+=m5t){var Y41=t76;Y41+=D5t;Y41+=M3t;a+=button(j,render(j),Y41);}a+=w2a;a+=E3a + className + m7t + className + J3a;var start=range !== g7t?range:Math[B3a](val / m5t) * m5t;a+=a41;for(j=start + N71;j < start + m5t;j++){a+=button(j,render(j));}a+=u41;span=n71;}container[o41]()[B0p](q3a + className + E41 + c3a + span + J41 + i18n[unit] + L3a + F2a + a + B41 + N2a);},_optionsTitle:function(){var R3a="getFu";var D3a="months";var F3a="getFullY";var N3a="FullYear";var V3a="yearRange";o8E.D8E();var b3a="_o";var w3a="onth";var K3a="_r";var G3a="_options";var T3a="Y";var T41=K3a;T41+=o8E.u5t;T41+=D5t;T41+=M3t;var R41=t0t;R41+=V5t;R41+=o8E.u5t;R41+=p1t;var w41=b3a;w41+=O06;w41+=y4t;var b41=u1t;b41+=t76;b41+=j4a;var K41=g1t;K41+=w3a;var L41=R3a;L41+=I0q;L41+=T3a;L41+=c4a;var c41=F3a;c41+=o8E.o5t;c41+=p1t;var q41=Q56;q41+=N3a;var i18n=this[o8E.q5t][q8t];var min=this[o8E.q5t][Q2a];var max=this[o8E.q5t][Z5a];var minYear=min?min[q41]():g7t;var maxYear=max?max[c41]():g7t;var i=minYear !== g7t?minYear:new Date()[L41]() - this[o8E.q5t][V3a];var j=maxYear !== g7t?maxYear:new Date()[y0a]() + this[o8E.q5t][V3a];this[G3a](K41,this[b41](F71,k5t),i18n[D3a]);this[w41](R41,this[T41](i,j));},_pad:function(i){var n3a='0';return i < m5t?n3a + i:i;},_position:function(){var t9a="ffs";var l3a="llT";var U9a="ddCl";var k9a="outerHeigh";var I9a="pendT";var s9a="rizon";var m9a="erWidt";var z9a="out";var f9a="rt";var i9a='horizontal';var h9a="tal";var s11=E9p;s11+=H1t;s11+=l5t;s11+=G1t;var i11=G1t;i11+=U3p;i11+=q0t;i11+=o6p;var U11=b4q;U11+=U2t;U11+=l3a;U11+=a4p;var t11=z9a;t11+=m9a;t11+=G1t;var f11=k9a;f11+=l5t;var I11=Y4t;I11+=r1t;I11+=H1t;I11+=t0t;var k11=o8E.u5t;k11+=t2t;k11+=I9a;k11+=r1t;var l41=l5t;l41+=l4t;l41+=g1t;l41+=V5t;var n41=c2t;n41+=f9a;n41+=y4t;var D41=c2t;D41+=x4a;var G41=r1t;G41+=T1t;G41+=q6p;var V41=R5p;V41+=l5t;var N41=H1t;N41+=r1t;N41+=g1t;var F41=r1t;F41+=t9a;F41+=V5t;F41+=l5t;var offset=this[o7t][h7t][F41]();var container=this[N41][i5p];var inputHeight=this[o7t][V41][G41]();if(this[y4t][D41][C5a] && this[y4t][n41][l41] && $(window)[U6p]() > X5t){var z11=o8E.u5t;z11+=U9a;z11+=o8E.u5t;z11+=V0t;container[z11](i9a);}else {var m11=i4p;m11+=s9a;m11+=h9a;container[Z56](m11);}container[s5p]({top:offset[M56] + inputHeight,left:offset[C56]})[k11](I11);var calHeight=container[f11]();var calWidth=container[t11]();var scrollTop=$(window)[U11]();if(offset[M56] + inputHeight + calHeight - scrollTop > $(window)[i11]()){var newTop=offset[M56] - calHeight;container[s5p](S56,newTop < F71?F71:newTop);}if(calWidth + offset[C56] > $(window)[s11]()){var newLeft=$(window)[U6p]() - calWidth;container[s5p](Y56,newLeft < F71?F71:newLeft);}},_range:function(start,end,inc){var a=[];if(!inc){inc=N71;}for(var i=start;i <= end;i+=inc){a[t6t](i);}return a;},_setCalander:function(){o8E.D8E();var O9a="empt";var x9a="dar";var W9a="htmlMon";var y9a="cale";if(this[y4t][r0p]){var y11=u1t;y11+=W9a;y11+=k0p;var O11=o8E.u5t;O11+=U2p;O11+=V5t;O11+=K1t;var W11=O9a;W11+=t0t;var h11=y9a;h11+=D5t;h11+=x9a;this[o7t][h11][W11]()[O11](this[y11](this[y4t][r0p][s0a](),this[y4t][r0p][A1a]()));}},_setTitle:function(){o8E.D8E();var e9a="_opti";var P9a="nSet";var A9a="_optionSet";var P11=Y0a;P11+=o8E.u5t;P11+=p1t;var e11=e9a;e11+=r1t;e11+=P9a;var x11=H1t;x11+=y4p;x11+=j9a;this[A9a](m0a,this[y4t][x11][A1a]());this[e11](P11,this[y4t][r0p][s0a]());},_setTime:function(){var v9a="tSec";var r9a="CHours";var M9a="tionsT";var Q9a="UTCMinutes";var C9a="hou";var d9a="rsAvailable";var p9a="ond";var g9a="ime";var Y9a="_optionsTime";var a9a='seconds';var X11=p4a;X11+=p9a;X11+=y4t;X11+=Z1a;var r11=M3t;r11+=v9a;r11+=w1t;r11+=i4t;var g11=o0t;g11+=o8E.q5t;g11+=p9a;g11+=y4t;var M11=Q56;M11+=Q9a;var d11=C9a;d11+=d9a;var C11=G1t;C11+=r1t;C11+=T4a;var Q11=t2t;Q11+=e4a;Q11+=l5t;Q11+=y4t;var v11=G1t;v11+=r1t;v11+=V8p;v11+=y4t;var p11=W4a;p11+=M9a;p11+=g9a;var j11=B1a;j11+=V1t;j11+=r9a;var that=this;var d=this[y4t][H1t];var hours=d?d[j11]():F71;var allowed=function(prop){var H9a='Available';var S9a="ement";var X9a="Incr";var Z9a="_range";var A11=X9a;A11+=S9a;return that[o8E.q5t][prop + H9a]?that[o8E.q5t][prop + H9a]:that[Z9a](F71,v5t,that[o8E.q5t][prop + A11]);};this[p11](v11,this[y4t][Q11][C11]?I5t:h5t,hours,this[o8E.q5t][d11]);this[Y9a](R1a,Q5t,d?d[M11]():F71,allowed(R1a),this[y4t][Y1a]);this[Y9a](g11,Q5t,d?d[r11]():F71,allowed(a9a),this[y4t][X11]);},_show:function(){var q9a=" resiz";var E9a="crol";var R9a='div.dataTables_scrollBody';var w9a="namespace";var o9a="n.";var c9a="e.";var K9a="_po";var b9a="sition";var B9a="ll.";var J9a="scro";var u9a="keyd";var L9a="rol";var J11=u9a;J11+=G3p;J11+=o9a;var o11=y4t;o11+=E9a;o11+=B0t;o11+=T5t;var u11=J9a;u11+=B9a;var a11=r1t;a11+=D5t;var Y11=q9a;Y11+=c9a;var Z11=b4q;Z11+=L9a;Z11+=B0t;Z11+=T5t;var H11=r1t;H11+=D5t;var S11=K9a;S11+=b9a;var that=this;var namespace=this[y4t][w9a];this[S11]();o8E.v8E();$(window)[H11](Z11 + namespace + Y11 + namespace,function(){that[b0p]();});$(W3p)[a11](u11 + namespace,function(){that[b0p]();});$(R9a)[w1t](o11 + namespace,function(){var T9a="_hid";var E11=T9a;E11+=V5t;that[E11]();});$(document)[w1t](J11 + namespace,function(e){var F9a="_hi";o8E.D8E();var z5t=9;var B11=d4q;B11+=t46;if(e[B11] === z5t || e[V4q] === O5t || e[V4q] === f5t){var q11=F9a;q11+=l3t;that[q11]();}});setTimeout(function(){var c11=Z9p;c11+=T5t;$(p2p)[w1t](c11 + namespace,function(e){var V9a="filter";var N9a="arget";var b11=H1t;b11+=r1t;b11+=g1t;var K11=l5t;K11+=N9a;var L11=D3t;L11+=g1t;var parents=$(e[y16])[h26]();if(!parents[V9a](that[L11][i5p])[h6t] && e[K11] !== that[b11][h7t][F71]){that[b0p]();}});},m5t);},_writeOutput:function(focus){var z6a="Locale";var n9a="etUTCF";var G9a="trig";var m6a="getUTCDate";var D9a="pad";var l9a="ullYea";var G11=o8E.q5t;G11+=G1t;G11+=a1a;var V11=G9a;V11+=q0t;V11+=U3t;var N11=u1t;N11+=D9a;var F11=q0t;F11+=n9a;F11+=l9a;F11+=p1t;var T11=O26;T11+=F7q;var R11=E3p;R11+=N7q;R11+=l5t;R11+=z6a;var w11=w5p;w11+=o8E.q5t;var date=this[y4t][H1t];var out=window[b5a]?window[b5a][w11](date,undefined,this[o8E.q5t][R11],this[o8E.q5t][N5a])[A5a](this[o8E.q5t][T11]):date[F11]() + I36 + this[N11](date[A1a]() + N71) + I36 + this[v3a](date[m6a]());this[o7t][h7t][v4p](out)[V11](G11,{write:date});if(focus){var n11=C3t;n11+=z4a;var D11=H1t;D11+=r1t;D11+=g1t;this[D11][n11][T5p]();}}});Editor[V7q][l11]=F71;Editor[z01][m01]={classPrefix:k01,disableDays:g7t,firstDay:N71,format:I01,hoursAvailable:g7t,i18n:Editor[f01][q8t][t01],maxDate:g7t,minDate:g7t,minutesAvailable:g7t,minutesIncrement:N71,momentStrict:x6t,momentLocale:k6a,onChange:function(){},secondsAvailable:g7t,secondsIncrement:N71,showWeekNumber:W6t,yearRange:W5t};(function(){var a8a="_in";var r8a="_val";var i7a="_addOptions";var z7a="change";var g4k="_picker";var f6a="adio";var g8a="valu";var n8a="_editor_val";var f4k="icker";var t6a="textar";var Z8a='<input/>';var q4k="No ";var I6a="dMany";var R6a="inp";var U6a="passwo";var z5k="_edi";var w6a="_enabled";var P6a="ick";var t7a="ipOpts";var e8a='div.clearValue button';var A7a="ator";var R4k='upload.editor';var D5k="ker";var Y4k='postUpload';var U7a="_inpu";var p8a='input';var M4k="wireFormat";var J7a='_';var C4k="ormat";var d8a="prop";var E5k="datepicker";var G8a="nsPair";var y6a="_input";var r7a="checkbox";var q7a='input:last';var Q4k="reF";var l7a="chec";var i6a="dels";var X8a="_i";var J4k="_v";var h8a="_enab";var C5k="_preChecked";var I7a="multiple";var b81=I66;b81+=I6a;var x81=T1t;x81+=t2t;x81+=n96;x81+=H1t;var a61=H1t;a61+=N1t;a61+=V5t;a61+=C06;var z61=H1t;z61+=N1t;z61+=V5t;var O91=L1t;O91+=K1t;var W91=p1t;W91+=f6a;var S21=m9p;S21+=X0t;S21+=D5t;S21+=H1t;var g21=L1t;g21+=K1t;var M21=t6a;M21+=o8E.o5t;var v21=U6a;v21+=p1t;v21+=H1t;var O21=S1t;O21+=a1t;O21+=H1t;var W21=s66;W21+=w1t;W21+=u7p;var i21=G1t;i21+=l4t;i21+=b3t;i21+=a1t;var I21=g1t;I21+=r1t;I21+=i6a;var k21=V5t;k21+=Y1t;k21+=V5t;k21+=K1t;var fieldTypes=Editor[L8t];function _buttonText(conf,text){var h6a="d button";var O6a="Choose file...";var s6a="div.uplo";var W6a="uploadText";var U01=s6a;U01+=o8E.u5t;U01+=h6a;if(text === g7t || text === undefined){text=conf[W6a] || O6a;}conf[y6a][O16](U01)[P4p](text);}function _commonUpload(editor,conf,dropCallback,multiple){var T6a="ut[type=file]";var S6a="file\" ";var r6a="input ";var d6a="=\"row";var N6a="ype=fil";var o6a="erna";var J6a='<div class="cell upload limitHide">';var G6a="dragleave drag";var A6a="gD";var p6a="<div class=\"render";var Z6a="w\">";var F6a="[t";var i8a='over';var E6a='<div class="editor_upload">';var j6a="dra";var I8a="Drag and drop a file here to upload";var k8a='div.drop span';var K6a='<div class="drop"><span></span></div>';var c6a='multiple';var X6a="type=\"";var g6a="></in";var M6a=" second\">";var a6a="s=\"eu_tabl";var x6a="put[type=fil";var v6a="ed\"></div>";var V6a="FileReader";var Y6a="<div clas";var l6a=".dr";var u6a="buttonI";var n6a="dr";var q6a='"></button>';var B6a='<button class="';var z8a="dragDr";var b6a='<div class="cell">';var Q6a=" class=\"cell limitHi";var m8a="opText";var x8a='div.rendered';var H6a="=\"ro";var e6a="e]";var D6a="exit";var C6a="e\">";var L6a='<div class="cell clearValue">';var l01=r1t;l01+=D5t;var n01=l4t;n01+=D5t;n01+=x6a;n01+=e6a;var D01=m4t;D01+=M9p;var T01=o8E.q5t;T01+=B0t;T01+=P6a;var R01=m4t;R01+=C3t;R01+=H1t;var X01=j6a;X01+=A6a;X01+=U2t;X01+=t2t;var v01=u1t;v01+=h7t;var p01=K6t;p01+=I8t;p01+=T6t;var A01=p6a;A01+=v6a;var j01=K6t;j01+=b6t;j01+=H1t;j01+=w6t;var P01=H66;P01+=Q6a;P01+=H1t;P01+=C6a;var e01=a7p;e01+=u3p;e01+=d6a;e01+=M6a;var x01=c6t;x01+=r7p;x01+=L6t;var y01=K6t;y01+=h8t;var O01=g6a;O01+=z4a;O01+=L6t;var W01=K6t;W01+=r6a;W01+=X6a;W01+=S6a;var h01=r7q;h01+=V0t;h01+=H6a;h01+=Z6a;var s01=Y6a;s01+=a6a;s01+=C6a;var i01=u6a;i01+=z5p;i01+=o6a;i01+=B0t;var btnClass=editor[M5p][J1t][i01];var container=$(E6a + s01 + h01 + J6a + B6a + btnClass + q6a + W01 + (multiple?c6a:o9t) + O01 + e7t + L6a + B6a + btnClass + q6a + y01 + x01 + e01 + P01 + K6a + j01 + b6a + A01 + e7t + e7t + e7t + p01);conf[v01]=container;conf[w6a]=x6t;if(conf[R8t]){var M01=l4t;M01+=H1t;var d01=p06;d01+=p1t;var C01=R6a;C01+=T6a;var Q01=g3t;Q01+=K1t;container[Q01](C01)[d01](M01,Editor[t7t](conf[R8t]));}if(conf[Q6p]){var r01=o8E.u5t;r01+=n06;r01+=p1t;var g01=h7t;g01+=F6a;g01+=N6a;g01+=e6a;container[O16](g01)[Q6p](conf[r01]);}_buttonText(conf);if(window[V6a] && conf[X01] !== W6t){var J01=j6a;J01+=q0t;J01+=s36;J01+=U3t;var o01=G6a;o01+=D6a;var Y01=n6a;Y01+=a4p;var Z01=r1t;Z01+=D5t;var H01=m3p;H01+=l6a;H01+=a4p;var S01=z8a;S01+=m8a;container[O16](k8a)[m46](conf[S01] || I8a);var dragDrop=container[O16](H01);dragDrop[Z01](Y01,function(e){var f8a="dataTr";var U8a="originalEvent";var t8a="ansfer";o8E.D8E();if(conf[w6a]){var u01=g3t;u01+=J6q;var a01=f8a;a01+=t8a;Editor[Y96](editor,conf,e[U8a][a01][u01],_buttonText,dropCallback);dragDrop[Z56](i8a);}return W6t;})[w1t](o01,function(e){var s8a="enabled";o8E.D8E();var E01=u1t;E01+=s8a;if(conf[E01]){dragDrop[Z56](i8a);}return W6t;})[w1t](J01,function(e){var B01=h8a;B01+=B0t;B01+=I4t;o8E.D8E();if(conf[B01]){var q01=K4t;q01+=p1t;dragDrop[v2p](q01);}return W6t;});editor[w1t](Z16,function(){var W8a="dragover.DTE_Upload d";var O8a=".DTE_Upload";var L01=W8a;L01+=E8t;L01+=O8a;var c01=Y4t;c01+=r1t;o8E.v8E();c01+=j1t;$(c01)[w1t](L01,function(e){return W6t;});})[w1t](A0p,function(){var y8a='dragover.DTE_Upload drop.DTE_Upload';var b01=r1t;b01+=m4t;b01+=m4t;var K01=j56;K01+=j1t;$(K01)[b01](y8a);});}else {var w01=S1p;w01+=R4t;w01+=U2t;w01+=t2t;container[v2p](w01);container[B0p](container[O16](x8a));}container[R01](e8a)[w1t](T01,function(e){o8E.D8E();var P8a="preven";var A8a="dT";var j8a="Default";var F01=P8a;F01+=l5t;F01+=j8a;e[F01]();if(conf[w6a]){var G01=o7p;G01+=I0q;var V01=T1t;V01+=t2t;V01+=o4p;V01+=W8p;var N01=Y16;N01+=A8a;N01+=J2t;N01+=v5p;Editor[N01][V01][v1p][G01](editor,conf,o9t);}});container[D01](n01)[l01](p8a,function(){var z21=T1t;z21+=K7t;z21+=H96;z21+=H1t;o8E.D8E();Editor[z21](editor,conf,this[D9t],_buttonText,function(ids){var v8a='input[type=file]';var m21=g3t;m21+=D5t;m21+=H1t;dropCallback[T7t](editor,ids);container[m21](v8a)[F71][s96]=g7t;});});return container;}function _triggerChange(input){setTimeout(function(){var Q8a="trigger";input[Q8a](l46,{editor:x6t,editorSet:x6t});o8E.v8E();;},F71);}var baseFieldType=$[k21](x6t,{},Editor[I21][e0p],{get:function(conf){o8E.v8E();return conf[y6a][v4p]();},set:function(conf,val){conf[y6a][v4p](val);_triggerChange(conf[y6a]);},enable:function(conf){var C8a="disab";var f21=C8a;f21+=A5p;conf[y6a][d8a](f21,W6t);},disable:function(conf){var M8a="isa";var U21=H1t;U21+=M8a;U21+=Y4t;U21+=A5p;var t21=u1t;t21+=h7t;conf[t21][d8a](U21,x6t);},canReturnSubmit:function(conf,node){return x6t;}});fieldTypes[i21]={create:function(conf){var h21=g8a;h21+=V5t;var s21=u1t;s21+=N5t;s21+=o8E.u5t;s21+=B0t;o8E.v8E();conf[s21]=conf[h21];return g7t;},get:function(conf){return conf[r8a];},set:function(conf,val){conf[r8a]=val;}};fieldTypes[W21]=$[O21](x6t,{},baseFieldType,{create:function(conf){var H8a='readonly';var S8a="/>";var j21=X8a;j21+=D5t;j21+=z4a;var P21=l5t;P21+=m9p;P21+=l5t;var e21=l4t;e21+=H1t;var x21=o8E.u5t;x21+=T56;var y21=K6t;y21+=R5p;y21+=l5t;y21+=S8a;o8E.D8E();conf[y6a]=$(y21)[x21]($[S0p]({id:Editor[t7t](conf[e21]),type:P21,readonly:H8a},conf[Q6p] || ({})));return conf[j21][F71];}});fieldTypes[m46]=$[S0p](x6t,{},baseFieldType,{create:function(conf){var p21=X0t;p21+=t4t;p21+=l5t;var A21=m9p;A21+=J8t;A21+=H1t;conf[y6a]=$(Z8a)[Q6p]($[A21]({id:Editor[t7t](conf[R8t]),type:p21},conf[Q6p] || ({})));return conf[y6a][F71];}});fieldTypes[v21]=$[S0p](x6t,{},baseFieldType,{create:function(conf){var Y8a='password';var d21=o8E.u5t;d21+=n06;d21+=p1t;var C21=l4t;C21+=H1t;var Q21=V5t;Q21+=S76;conf[y6a]=$(Z8a)[Q6p]($[Q21]({id:Editor[t7t](conf[C21]),type:Y8a},conf[d21] || ({})));return conf[y6a][F71];}});fieldTypes[M21]=$[g21](x6t,{},baseFieldType,{create:function(conf){var u8a='<textarea></textarea>';var X21=l4t;X21+=H1t;var r21=a8a;r21+=t2t;o8E.v8E();r21+=T1t;r21+=l5t;conf[r21]=$(u8a)[Q6p]($[S0p]({id:Editor[t7t](conf[X21])},conf[Q6p] || ({})));return conf[y6a][F71];},canReturnSubmit:function(conf,node){o8E.D8E();return W6t;}});fieldTypes[X8q]=$[S21](x6t,{},baseFieldType,{_addOptions:function(conf,opts,append){var E8a="ceh";var N8a="rValue";var q8a="placeholde";var w8a="holder";var T8a="eholderVa";var B8a="itor_v";var R8a="plac";var o8a="options";var b8a="erDis";var c8a="Di";var J8a="older";var D8a="airs";var V8a="hidden";var L8a="sabled";var F8a="ceholde";var K8a="acehold";var H21=u1t;H21+=R6a;H21+=w5p;var elOpts=conf[H21][F71][o8a];var countOffset=F71;if(!append){var Y21=U4p;Y21+=E8a;Y21+=J8a;var Z21=f5p;Z21+=k0p;elOpts[Z21]=F71;if(conf[Y21] !== undefined){var B21=P2t;B21+=H1t;B21+=B8a;B21+=z4p;var J21=q8a;J21+=p1t;J21+=c8a;J21+=L8a;var E21=K7t;E21+=K8a;E21+=b8a;E21+=N4t;var o21=F4p;o21+=w8a;var u21=R8a;u21+=T8a;u21+=R4p;var a21=U4p;a21+=F8a;a21+=N8a;var placeholderValue=conf[a21] !== undefined?conf[u21]:o9t;countOffset+=N71;elOpts[F71]=new Option(conf[o21],placeholderValue);var disabled=conf[E21] !== undefined?conf[J21]:x6t;elOpts[F71][V8a]=disabled;elOpts[F71][k5p]=disabled;elOpts[F71][B21]=placeholderValue;}}else {var q21=U6t;q21+=q0t;q21+=l5t;q21+=G1t;countOffset=elOpts[q21];}o8E.v8E();if(opts){var L21=a4p;L21+=J7p;L21+=G8a;var c21=t2t;c21+=D8a;Editor[c21](opts,conf[L21],function(val,label,i,attr){o8E.D8E();var option=new Option(label,val);option[n8a]=val;if(attr){$(option)[Q6p](attr);}elOpts[i + countOffset]=option;});}},create:function(conf){var l8a="addOptions";var m7a="eId";var k7a="<select></selec";var l21=X8a;l21+=C4a;var n21=r1t;n21+=O06;n21+=y4t;var D21=u1t;o8E.v8E();D21+=l8a;var F21=z7a;F21+=T5t;F21+=I9p;F21+=V5t;var T21=o8E.u5t;T21+=l5t;T21+=l5t;T21+=p1t;var R21=l4t;R21+=H1t;var w21=y4t;w21+=o8E.u5t;w21+=m4t;w21+=m7a;var b21=V5t;b21+=p16;b21+=K1t;var K21=k7a;K21+=l5t;K21+=L6t;conf[y6a]=$(K21)[Q6p]($[b21]({id:Editor[w21](conf[R21]),multiple:conf[I7a] === x6t},conf[T21] || ({})))[w1t](F21,function(e,d){var f7a="_last";var N21=B8p;N21+=r1t;N21+=p1t;if(!d || !d[N21]){var G21=t4a;G21+=V5t;G21+=o8E.q5t;G21+=l5t;var V21=f7a;V21+=A3t;V21+=l5t;conf[V21]=fieldTypes[G21][Q56](conf);}});fieldTypes[X8q][D21](conf,conf[n21] || conf[t7a]);return conf[l21][F71];},update:function(conf,options,append){var h7a="ele";var s7a="_lastSet";var k31=U7a;k31+=l5t;fieldTypes[X8q][i7a](conf,options,append);var lastSet=conf[s7a];if(lastSet !== undefined){var m31=y4t;m31+=v3t;var z31=y4t;z31+=h7a;z31+=r46;fieldTypes[z31][m31](conf,lastSet,x6t);}_triggerChange(conf[k31]);},get:function(conf){var j7a="separ";var y7a="lecte";var P7a="rato";var O7a=":se";var W7a="option";var x7a="toArray";var e7a="sepa";var i31=g6t;i31+=l4t;i31+=K7t;i31+=V5t;var t31=W7a;t31+=O7a;t31+=y7a;t31+=H1t;var f31=m4t;f31+=l4t;f31+=D5t;f31+=H1t;var I31=X8a;I31+=D5t;I31+=t2t;I31+=w5p;var val=conf[I31][f31](t31)[a16](function(){var U31=P2t;U31+=H1t;U31+=u86;U31+=v4p;return this[U31];})[x7a]();if(conf[i31]){var W31=e7a;W31+=P7a;W31+=p1t;var h31=o0a;h31+=D5t;var s31=j7a;s31+=A7a;return conf[s31]?val[h31](conf[W31]):val;}return val[h6t]?val[F71]:g7t;},set:function(conf,val,localUpdate){var Q7a="_lastS";var v7a="sAr";var C7a="separa";var p7a="opti";var M7a="placeholder";var v31=B0t;v31+=d8p;v31+=l5t;v31+=G1t;var p31=j3t;p31+=t2t;p31+=B0t;p31+=V5t;var j31=p7a;j31+=w1t;var P31=a4p;P31+=l5t;P31+=L3t;var e31=l4t;e31+=v7a;e31+=t76;e31+=t0t;var y31=o0t;y31+=c2t;y31+=p1t;y31+=A7a;if(!localUpdate){var O31=Q7a;O31+=v3t;conf[O31]=val;}if(conf[I7a] && conf[y31] && !Array[h1p](val)){var x31=C7a;x31+=I9t;val=typeof val === l56?val[d76](conf[x31]):[];}else if(!Array[e31](val)){val=[val];}var i,len=val[h6t],found,allFound=W6t;o8E.v8E();var options=conf[y6a][O16](P31);conf[y6a][O16](j31)[V9t](function(){var d7a="_editor_";found=W6t;for(i=F71;i < len;i++){var A31=d7a;A31+=v4p;if(this[A31] == val[i]){found=x6t;allFound=x6t;break;}}this[F0a]=found;});if(conf[M7a] && !allFound && !conf[p31] && options[v31]){options[F71][F0a]=x6t;}if(!localUpdate){var Q31=a8a;Q31+=t2t;Q31+=T1t;Q31+=l5t;_triggerChange(conf[Q31]);}return allFound;},destroy:function(conf){var g7a='change.dte';var d31=r1t;d31+=m4t;d31+=m4t;var C31=X8a;C31+=b5p;C31+=T1t;o8E.v8E();C31+=l5t;conf[C31][d31](g7a);}});fieldTypes[r7a]=$[S0p](x6t,{},baseFieldType,{_addOptions:function(conf,opts,append){var S7a="pai";var X7a="onsPair";var val,label;o8E.v8E();var jqInput=conf[y6a];var offset=F71;if(!append){jqInput[b0a]();}else {offset=$(p8a,jqInput)[h6t];}if(opts){var g31=f1q;g31+=l4t;g31+=X7a;var M31=S7a;M31+=z66;Editor[M31](opts,conf[g31],function(val,label,i,attr){var o7a=" id=\"";var B7a='" type="checkbox" />';var u7a="safe";var H7a="/lab";var E7a="<di";var a7a="=\"";var Y7a=" fo";var Z7a="<label";var E31=N5t;E31+=z4p;E31+=T1t;E31+=V5t;var o31=o8E.u5t;o31+=l5t;o31+=n4p;var u31=K6t;u31+=b6t;u31+=F4t;u31+=T6t;var a31=K6t;a31+=H7a;a31+=f1t;a31+=L6t;var Y31=Z7a;Y31+=Y7a;Y31+=p1t;Y31+=a7a;var Z31=l4t;Z31+=H1t;var H31=u7a;H31+=J0t;var S31=K6t;S31+=R5p;S31+=l5t;S31+=o7a;var X31=E7a;X31+=T6t;var r31=L7t;r31+=t2t;r31+=J6t;jqInput[r31](X31 + S31 + Editor[H31](conf[Z31]) + J7a + (i + offset) + B7a + Y31 + Editor[t7t](conf[R8t]) + J7a + (i + offset) + U7t + label + a31 + u31);$(q7a,jqInput)[o31](E31,val)[F71][n8a]=val;if(attr){$(q7a,jqInput)[Q6p](attr);}});}},create:function(conf){var L7a='<div></div>';var c7a="_addOption";var B31=r1t;o8E.D8E();B31+=O06;B31+=y4t;var J31=c7a;J31+=y4t;conf[y6a]=$(L7a);fieldTypes[r7a][J31](conf,conf[B31] || conf[t7a]);return conf[y6a][F71];},get:function(conf){var K7a="arator";var w7a="sep";var T7a="Value";var F7a="put:checked";var b7a="parator";var V7a="unselectedValue";var R7a="nselected";var T31=y4t;T31+=r7t;T31+=K7a;var R31=o0t;R31+=b7a;var w31=w7a;w31+=K7a;var b31=T1t;b31+=R7a;b31+=T7a;var c31=C3t;c31+=F7a;var q31=X8a;q31+=C4a;var out=[];var selected=conf[q31][O16](c31);if(selected[h6t]){var L31=V5t;L31+=o8E.u5t;L31+=Y4p;selected[L31](function(){o8E.D8E();var N7a="or_v";var K31=c16;K31+=N7a;K31+=o8E.u5t;K31+=B0t;out[t6t](this[K31]);});}else if(conf[b31] !== undefined){out[t6t](conf[V7a]);}return conf[w31] === undefined || conf[R31] === g7t?out:out[k36](conf[T31]);},set:function(conf,val){var D7a="separator";var G7a="lit";var n7a='|';var n31=V5t;n31+=o8E.u5t;n31+=o8E.q5t;n31+=G1t;var D31=l4t;D31+=Y2a;D31+=r26;D31+=Z7t;var V31=y4t;V31+=n4p;V31+=l4t;V31+=d9t;var N31=R5p;N31+=l5t;var F31=m4t;F31+=l4t;F31+=D5t;F31+=H1t;var jqInputs=conf[y6a][F31](N31);if(!Array[h1p](val) && typeof val === V31){var G31=L9p;G31+=G7a;val=val[G31](conf[D7a] || n7a);}else if(!Array[D31](val)){val=[val];}var i,len=val[h6t],found;jqInputs[n31](function(){var m5k="tor_va";var z91=l7a;z91+=q4p;z91+=V5t;z91+=H1t;found=W6t;for(i=F71;i < len;i++){var l31=z5k;l31+=m5k;l31+=B0t;if(this[l31] == val[i]){found=x6t;break;}}this[z91]=found;});_triggerChange(jqInputs);},enable:function(conf){o8E.D8E();var I91=R6a;I91+=w5p;var k91=m4t;k91+=l4t;k91+=D5t;k91+=H1t;var m91=u1t;m91+=C3t;m91+=S4p;m91+=l5t;conf[m91][k91](I91)[d8a](X1a,W6t);},disable:function(conf){var U91=t4p;o8E.D8E();U91+=o8E.u5t;U91+=Y4t;U91+=A5p;var t91=t2t;t91+=E8t;var f91=R6a;f91+=w5p;conf[y6a][O16](f91)[t91](U91,x6t);},update:function(conf,options,append){var k5k="ckb";var I5k="ox";var h91=y4t;h91+=v3t;var s91=q0t;s91+=V5t;s91+=l5t;var i91=Y4p;i91+=V5t;i91+=k5k;i91+=I5k;var checkbox=fieldTypes[i91];var currVal=checkbox[s91](conf);checkbox[i7a](conf,options,append);checkbox[h91](conf,currVal);}});fieldTypes[W91]=$[O91](x6t,{},baseFieldType,{_addOptions:function(conf,opts,append){var f5k="pairs";var val,label;var jqInput=conf[y6a];var offset=F71;if(!append){var y91=V5t;y91+=T2q;y91+=y3t;jqInput[y91]();}else {offset=$(p8a,jqInput)[h6t];}if(opts){var x91=a4p;x91+=J7p;x91+=G8a;Editor[f5k](opts,conf[x91],function(val,label,i,attr){var U5k="eI";var s5k="l fo";var x5k="t i";var i5k="<labe";var e5k='" />';var t5k="l>";var h5k="r=\"";var W5k="\" type=\"ra";var O5k="dio\" n";var y5k="<in";var d91=g8a;d91+=V5t;var C91=R6t;C91+=r5p;C91+=b5q;C91+=t5k;var Q91=q2t;Q91+=m4t;Q91+=U5k;Q91+=H1t;var v91=i5k;v91+=s5k;v91+=h5k;var p91=D5t;p91+=v96;p91+=V5t;var A91=W5k;A91+=O5k;A91+=v96;A91+=R66;var j91=y5k;j91+=S4p;j91+=x5k;j91+=D9q;var P91=H66;P91+=L6t;var e91=G2p;e91+=K1t;jqInput[e91](P91 + j91 + Editor[t7t](conf[R8t]) + J7a + (i + offset) + A91 + conf[p91] + e5k + v91 + Editor[Q91](conf[R8t]) + J7a + (i + offset) + U7t + label + C91 + e7t);o8E.D8E();$(q7a,jqInput)[Q6p](d91,val)[F71][n8a]=val;if(attr){$(q7a,jqInput)[Q6p](attr);}});}},create:function(conf){var Q5k='<div />';var A5k="_a";var p5k="dO";var j5k="Opt";var P5k="ip";var v5k="ptions";var S91=r1t;S91+=t2t;S91+=V5t;S91+=D5t;var X91=P5k;X91+=j5k;X91+=y4t;var r91=r1t;r91+=h7p;r91+=M1t;var g91=A5k;g91+=H1t;g91+=p5k;g91+=v5k;var M91=p1t;M91+=f6a;conf[y6a]=$(Q5k);fieldTypes[M91][g91](conf,conf[r91] || conf[X91]);this[w1t](S91,function(){var Z91=l4t;Z91+=b5p;Z91+=T1t;Z91+=l5t;var H91=X8a;H91+=b5p;H91+=w5p;conf[H91][O16](Z91)[V9t](function(){if(this[C5k]){var Y91=o8E.q5t;Y91+=e1p;Y91+=I4t;this[Y91]=x6t;}});});return conf[y6a][F71];},get:function(conf){var d5k="editor_val";var M5k="input:checke";var u91=u1t;u91+=d5k;var a91=M5k;a91+=H1t;o8E.D8E();var el=conf[y6a][O16](a91);return el[h6t]?el[F71][u91]:undefined;},set:function(conf,val){var g5k="input:";var r5k="checked";var c91=g5k;o8E.D8E();c91+=r5k;var E91=l4t;E91+=D5t;E91+=S4p;E91+=l5t;var o91=m4t;o91+=l4t;o91+=D5t;o91+=H1t;var that=this;conf[y6a][o91](E91)[V9t](function(){var X5k="tor_v";var S5k="Checked";var J91=z5k;o8E.D8E();J91+=X5k;J91+=z4p;this[C5k]=W6t;if(this[J91] == val){var q91=K0q;q91+=V5t;q91+=S5k;var B91=l7a;B91+=Y4q;B91+=H1t;this[B91]=x6t;this[q91]=x6t;}else {this[r5k]=W6t;this[C5k]=W6t;}});_triggerChange(conf[y6a][O16](c91));},enable:function(conf){var H5k="isabled";var b91=H1t;b91+=H5k;var K91=l4t;K91+=D5t;K91+=z4a;var L91=a8a;L91+=S4p;L91+=l5t;conf[L91][O16](K91)[d8a](b91,W6t);},disable:function(conf){var Z5k="isab";var R91=H1t;R91+=Z5k;R91+=u3t;R91+=H1t;var w91=l4t;w91+=D5t;w91+=z4a;conf[y6a][O16](w91)[d8a](R91,x6t);},update:function(conf,options,append){var u5k='[value="';var a5k="addOp";var Y5k="q";var l91=g8a;l91+=V5t;var n91=V5t;n91+=Y5k;var D91=u3t;D91+=D5t;D91+=i6t;var G91=g3t;G91+=B0t;G91+=l5t;G91+=U3t;var V91=C3t;V91+=z4a;var N91=u1t;N91+=a5k;N91+=j6t;N91+=c1t;var F91=q0t;F91+=V5t;F91+=l5t;var T91=p1t;T91+=o8E.u5t;T91+=H1t;T91+=X46;o8E.D8E();var radio=fieldTypes[T91];var currVal=radio[F91](conf);radio[N91](conf,options,append);var inputs=conf[y6a][O16](V91);radio[v1p](conf,inputs[G91](u5k + currVal + N9t)[D91]?currVal:inputs[n91](F71)[Q6p](l91));}});fieldTypes[z61]=$[S0p](x6t,{},baseFieldType,{create:function(conf){var K5k="eFormat";var b5k="RFC_2822";var N5k='type';var o5k='<input />';var J5k="Fo";var c5k="yu";var L5k="Class";var q5k="jque";var B5k="rmat";var k61=l5t;k61+=m9p;k61+=l5t;var m61=q2t;m61+=m4t;m61+=V5t;m61+=J0t;conf[y6a]=$(o5k)[Q6p]($[S0p]({id:Editor[m61](conf[R8t]),type:k61},conf[Q6p]));if($[E5k]){var U61=s4t;U61+=X0t;U61+=J5k;U61+=B5k;var t61=q5k;t61+=p1t;t61+=c5k;t61+=l4t;var f61=o8E.u5t;f61+=H1t;f61+=H1t;f61+=L5k;var I61=a8a;I61+=z4a;conf[I61][f61](t61);if(!conf[U61]){var i61=H1t;i61+=N1t;i61+=K5k;conf[i61]=$[E5k][b5k];}setTimeout(function(){var w5k="#ui-datepick";var R5k="er-di";var F5k="dateImage";var T5k="Form";var x61=o8E.q5t;x61+=V0t;var y61=w5k;y61+=R5k;y61+=N5t;var O61=r1t;O61+=Q1p;O61+=y4t;var h61=s4t;h61+=X0t;h61+=T5k;h61+=N1t;var s61=m9p;s61+=l5t;s61+=V5t;s61+=K1t;$(conf[y6a])[E5k]($[s61]({dateFormat:conf[h61],buttonImage:conf[F5k],buttonImageOnly:x6t,onSelect:function(){var W61=a8a;o8E.v8E();W61+=t2t;W61+=T1t;W61+=l5t;conf[W61][T5p]()[Z9p]();}},conf[O61]));$(y61)[x61](h5p,c4p);},m5t);}else {var j61=t36;j61+=V5t;var P61=o8E.u5t;P61+=n06;P61+=p1t;var e61=X8a;e61+=D5t;e61+=z4a;conf[e61][P61](N5k,j61);}o8E.D8E();return conf[y6a][F71];},set:function(conf,val){var n5k="setDate";var V5k='hasDatepicker';var G5k="datepic";var p61=Z4a;p61+=r5p;p61+=V0t;var A61=X8a;o8E.D8E();A61+=b5p;A61+=w5p;if($[E5k] && conf[A61][p61](V5k)){var v61=G5k;v61+=D5k;conf[y6a][v61](n5k,val)[z7a]();}else {var Q61=N5t;Q61+=o8E.u5t;Q61+=B0t;$(conf[y6a])[Q61](val);}},enable:function(conf){var z4k="atepic";var l5k="atepicker";var C61=H1t;C61+=l5k;if($[C61]){var d61=H1t;d61+=z4k;d61+=D5k;conf[y6a][d61](w16);}else {var M61=H16;M61+=H1t;$(conf[y6a])[d8a](M61,W6t);}},disable:function(conf){var m4k="epic";if($[E5k]){var r61=H1t;r61+=y4p;r61+=n1p;r61+=V5t;var g61=t36;g61+=m4k;g61+=D5k;conf[y6a][g61](r61);}else {var X61=X8a;X61+=b5p;X61+=T1t;X61+=l5t;$(conf[X61])[d8a](X1a,x6t);}},owns:function(conf,node){var I4k="i-datep";var U4k='div.ui-datepicker-header';var k4k="v.u";var t4k="are";var Y61=u3t;Y61+=D5t;Y61+=q0t;Y61+=k0p;var Z61=E1p;Z61+=J1p;Z61+=y4t;var H61=F4t;o8E.v8E();H61+=k4k;H61+=I4k;H61+=f4k;var S61=t2t;S61+=t4k;S61+=z5p;S61+=y4t;return $(node)[S61](H61)[h6t] || $(node)[Z61](U4k)[Y61]?x6t:W6t;}});fieldTypes[a61]=$[S0p](x6t,{},baseFieldType,{create:function(conf){var s4k="teTi";var i4k="ayFo";var P4k="keyInput";var W4k="saf";var e4k="_closeFn";var x4k="datetime";var O4k=" />";var h4k="picker";var y4k='text';var N61=u1t;N61+=F76;N61+=y4t;N61+=q6t;var F61=r1t;F61+=D5t;var b61=o6t;b61+=p1t;b61+=F7q;var K61=w3t;K61+=i4k;K61+=q66;K61+=N1t;var L61=U7a;L61+=l5t;var c61=I6q;c61+=s4k;c61+=g1t;c61+=V5t;var q61=u1t;q61+=h4k;var B61=l4t;B61+=H1t;var J61=W4k;J61+=V5t;J61+=y26;J61+=H1t;var E61=o8E.u5t;E61+=l5t;E61+=l5t;E61+=p1t;var o61=K6t;o61+=l4t;o61+=C4a;o61+=O4k;var u61=X8a;u61+=I0p;u61+=l5t;conf[u61]=$(o61)[E61]($[S0p](x6t,{id:Editor[J61](conf[B61]),type:y4k},conf[Q6p]));conf[q61]=new Editor[c61](conf[L61],$[S0p]({format:conf[K61] || conf[b61],i18n:this[q8t][x4k]},conf[d1p]));conf[e4k]=function(){var R61=U9p;R61+=l3t;var w61=P0a;w61+=f4k;o8E.v8E();conf[w61][R61]();};if(conf[P4k] === W6t){var T61=r1t;T61+=D5t;conf[y6a][T61](l4q,function(e){o8E.v8E();e[W46]();});}this[F61](A0p,conf[N61]);return conf[y6a][F71];},get:function(conf){var d4k="_picke";var j4k="forma";var A4k="ntStrict";var v4k="tLocale";var p4k="mom";var m81=j4k;m81+=l5t;var z81=g1t;z81+=U5p;z81+=V5t;z81+=A4k;var l61=p4k;l61+=a1t;l61+=v4k;var n61=j4k;n61+=l5t;var D61=E9p;D61+=Q4k;D61+=C4k;var G61=d4k;G61+=p1t;var V61=X8a;V61+=C4a;var val=conf[V61][v4p]();var inst=conf[G61][o8E.q5t];return val && conf[D61] && moment?moment(val,inst[n61],inst[l61],inst[z81])[m81](conf[M4k]):val;},set:function(conf,val){var t81=o6t;t81+=p1t;t81+=g1t;o8E.v8E();t81+=N1t;var f81=E9p;f81+=Q4k;f81+=C4k;var I81=N5t;I81+=o8E.u5t;I81+=B0t;var k81=u1t;k81+=s1q;k81+=E4p;k81+=U3t;var inst=conf[k81][o8E.q5t];conf[g4k][I81](val && conf[M4k] && moment?moment(val,conf[f81],inst[F5a],inst[N5a])[A5a](inst[t81]):val);_triggerChange(conf[y6a]);},owns:function(conf,node){var X4k="owns";var r4k="_pick";o8E.D8E();var U81=r4k;U81+=U3t;return conf[U81][X4k](node);},errorMessage:function(conf,msg){o8E.v8E();var S4k="errorMsg";var i81=u1t;i81+=t2t;i81+=P6a;i81+=U3t;conf[i81][S4k](msg);},destroy:function(conf){var H4k="loseFn";var O81=d4q;O81+=D3t;o8E.v8E();O81+=E0p;var W81=r1t;W81+=m4t;W81+=m4t;var h81=g2t;h81+=H4k;var s81=o8E.q5t;s81+=B0t;s81+=z7p;s81+=V5t;this[V9p](s81,conf[h81]);conf[y6a][W81](O81);conf[g4k][Q16]();},minDate:function(conf,min){var Z4k="min";o8E.v8E();conf[g4k][Z4k](min);},maxDate:function(conf,max){var y81=g1t;y81+=o8E.u5t;y81+=t4t;conf[g4k][y81](max);}});fieldTypes[x81]=$[S0p](x6t,{},baseFieldType,{create:function(conf){var editor=this;var container=_commonUpload(editor,conf,function(val){var j81=D5t;j81+=o8E.u5t;o8E.v8E();j81+=g1t;j81+=V5t;var P81=y4t;P81+=V5t;P81+=l5t;var e81=T1t;e81+=Q96;e81+=W8p;Editor[L8t][e81][P81][T7t](editor,conf,val[F71]);editor[J46](Y4k,[conf[j81],val[F71]]);});o8E.v8E();return container;},get:function(conf){return conf[r8a];},set:function(conf,val){var b4k="addClas";var K4k="clearT";var c4k="noFileText";var B4k="spa";o8E.D8E();var w4k='noClear';var a4k="earText";var o4k="div.re";var L4k="noC";var E4k="ndered";var u4k="spl";var u81=m4t;u81+=M9p;var H81=i2p;H81+=a4k;var S81=g3t;S81+=K1t;var p81=F4t;p81+=u4k;p81+=Z7t;var A81=u1t;A81+=N5t;A81+=o8E.u5t;A81+=B0t;conf[A81]=val;var container=conf[y6a];if(conf[p81]){var Q81=o4k;Q81+=E4k;var v81=m4t;v81+=l4t;v81+=D5t;v81+=H1t;var rendered=container[v81](Q81);if(conf[r8a]){var M81=J4k;M81+=o8E.u5t;M81+=B0t;var d81=F4t;d81+=p1p;var C81=G1t;C81+=l5t;C81+=g1t;C81+=B0t;rendered[C81](conf[d81](conf[M81]));}else {var X81=R6t;X81+=B4k;X81+=D56;var r81=q4k;r81+=m4t;r81+=k96;r81+=V5t;var g81=V5t;g81+=g1t;g81+=r5a;rendered[g81]()[B0p](Z3a + (conf[c4k] || r81) + X81);}}var button=container[S81](e8a);if(val && conf[H81]){var Y81=L4k;Y81+=B0t;Y81+=V5t;Y81+=e4a;var Z81=K4k;Z81+=m9p;Z81+=l5t;button[P4p](conf[Z81]);container[Z56](Y81);}else {var a81=b4k;a81+=y4t;container[a81](w4k);}conf[y6a][u81](p8a)[u5q](R4k,[conf[r8a]]);},enable:function(conf){var q81=h8a;q81+=A5p;var B81=R0t;B81+=r1t;B81+=t2t;var J81=l4t;J81+=I0p;J81+=l5t;var E81=g3t;E81+=D5t;E81+=H1t;var o81=X8a;o81+=b5p;o81+=T1t;o81+=l5t;conf[o81][E81](J81)[B81](X1a,W6t);conf[q81]=x6t;},disable:function(conf){var K81=h8a;o8E.v8E();K81+=A5p;var L81=a2a;L81+=V5t;L81+=H1t;var c81=m4t;c81+=M9p;conf[y6a][c81](p8a)[d8a](L81,x6t);conf[K81]=W6t;},canReturnSubmit:function(conf,node){return W6t;}});fieldTypes[b81]=$[S0p](x6t,{},baseFieldType,{_showHide:function(conf){var n4k="limit";var N4k="div.l";var V4k="imitHid";var D4k="ntaine";var G4k="_co";var F4k="Lef";var T4k="_limit";var l81=u1t;l81+=N5t;l81+=o8E.u5t;l81+=B0t;var n81=B0t;n81+=C4t;n81+=l4t;n81+=l5t;var D81=T4k;D81+=F4k;D81+=l5t;var G81=D5t;o8E.D8E();G81+=r1t;G81+=D5t;G81+=V5t;var V81=u3t;V81+=D5t;V81+=q0t;V81+=k0p;var N81=u1t;N81+=N5t;N81+=z4p;var F81=F4t;F81+=y4t;F81+=j9a;var T81=o8E.q5t;T81+=y4t;T81+=y4t;var R81=N4k;R81+=V4k;R81+=V5t;var w81=G4k;w81+=D4k;w81+=p1t;if(!conf[n4k]){return;}conf[w81][O16](R81)[T81](F81,conf[N81][V81] >= conf[n4k]?G81:i0p);conf[D81]=conf[n81] - conf[l81][h6t];},create:function(conf){var m1k='multi';var h1k="_container";var k1k='button.remove';var h71=o8E.q5t;h71+=B0t;h71+=P6a;var s71=g8p;s71+=r1a;s71+=y4t;var editor=this;var container=_commonUpload(editor,conf,function(val){var l4k="oadMan";var z1k="Type";var i71=u1t;i71+=Y8t;i71+=B0t;var U71=g8t;U71+=W4t;var t71=e16;t71+=B0t;var f71=y4t;f71+=V5t;f71+=l5t;var I71=d96;I71+=B0t;I71+=l4k;I71+=t0t;var k71=E8p;k71+=z1k;k71+=y4t;var m71=j9p;m71+=o7p;m71+=l5t;var z71=J4k;z71+=o8E.u5t;z71+=B0t;conf[z71]=conf[r8a][m71](val);Editor[k71][I71][f71][t71](editor,conf,conf[r8a]);editor[J46](Y4k,[conf[U71],conf[i71]]);},x6t);container[s71](m1k)[w1t](h71,k1k,function(e){var I1k="nab";var f1k="sto";var i1k="uploadMa";var s1k="ldT";var t1k="pProp";var U1k="agat";var O71=P2t;O71+=I1k;O71+=A5p;o8E.D8E();var W71=f1k;W71+=t1k;W71+=U1k;W71+=L3t;e[W71]();if(conf[O71]){var A71=o0t;A71+=l5t;var j71=i1k;j71+=P9q;var P71=X26;P71+=s1k;P71+=z4t;P71+=y4t;var e71=L9p;e71+=R7t;e71+=V5t;var x71=l4t;x71+=H1t;x71+=t4t;var y71=H1t;y71+=o8E.u5t;y71+=l5t;y71+=o8E.u5t;var idx=$(this)[y71](x71);conf[r8a][e71](idx,N71);Editor[P71][j71][A71][T7t](editor,conf,conf[r8a]);}});conf[h1k]=container;return container;},get:function(conf){return conf[r8a];},set:function(conf,val){var X1k="_showHide";var e1k="To";var y1k="div.rende";var r1k="uploadMany";var g1k="<sp";var W1k='Upload collections must have an array as a value';var j1k="></";var M1k="noFileTe";var O1k="mpt";var A1k="ul>";var x1k="red";var P1k="<u";var o71=J4k;o71+=o8E.u5t;o71+=B0t;var u71=C3t;u71+=t2t;u71+=T1t;u71+=l5t;var v71=H3t;v71+=r5p;v71+=t0t;var p71=X8a;p71+=b5p;p71+=w5p;if(!val){val=[];}if(!Array[h1p](val)){throw W1k;}conf[r8a]=val;var that=this;var container=conf[p71];o8E.D8E();if(conf[v71]){var d71=B8q;d71+=G1t;var C71=V5t;C71+=O1k;C71+=t0t;var Q71=y1k;Q71+=x1k;var rendered=container[O16](Q71)[C71]();if(val[d71]){var r71=V5t;r71+=o8E.u5t;r71+=o8E.q5t;r71+=G1t;var g71=y5q;g71+=a1t;g71+=H1t;g71+=e1k;var M71=P1k;M71+=B0t;M71+=j1k;M71+=A1k;var list=$(M71)[g71](rendered);$[r71](val,function(i,file){var v1k=' <button class="';var d1k='</li>';var p1k='<li>';var C1k='">&times;</button>';o8E.D8E();var Q1k=' remove" data-idx="';var S71=o6t;S71+=q66;var X71=y5p;X71+=x5p;list[B0p](p1k + conf[r0p](file,i) + v1k + that[X71][S71][B3t] + Q1k + i + C1k + d1k);});}else {var a71=q4k;a71+=U6q;a71+=v5p;var Y71=M1k;Y71+=Y1t;var Z71=g1k;Z71+=q9p;Z71+=L6t;var H71=o8E.u5t;H71+=k26;H71+=H1t;rendered[H71](Z71 + (conf[Y71] || a71) + x7t);}}Editor[L8t][r1k][X1k](conf);conf[y6a][O16](u71)[u5q](R4k,[conf[o71]]);},enable:function(conf){var E71=l4t;o8E.v8E();E71+=D5t;E71+=S4p;E71+=l5t;conf[y6a][O16](E71)[d8a](X1a,W6t);conf[w6a]=x6t;},disable:function(conf){var J71=t2t;J71+=U2t;J71+=t2t;conf[y6a][O16](p8a)[J71](X1a,x6t);conf[w6a]=W6t;},canReturnSubmit:function(conf,node){return W6t;}});})();if(DataTable[B71][q71]){var c71=X26;c71+=S1k;$[S0p](Editor[c71],DataTable[S1t][H1k]);}DataTable[L71][K71]=Editor[b71];Editor[D9t]={};Editor[w71][Z1k]=Y1k;Editor[R71]=T71;return Editor;});

/*! Bootstrap integration for DataTables' Editor
 * ©2015 SpryMedia Ltd - datatables.net/license
 */

(function( factory ){
	if ( typeof define === 'function' && define.amd ) {
		// AMD
		define( ['jquery', 'datatables.net-bs4', 'datatables.net-editor'], function ( $ ) {
			return factory( $, window, document );
		} );
	}
	else if ( typeof exports === 'object' ) {
		// CommonJS
		module.exports = function (root, $) {
			if ( ! root ) {
				root = window;
			}

			if ( ! $ || ! $.fn.dataTable ) {
				$ = require('datatables.net-bs4')(root, $).$;
			}

			if ( ! $.fn.dataTable.Editor ) {
				require('datatables.net-editor')(root, $);
			}

			return factory( $, root, root.document );
		};
	}
	else {
		// Browser
		factory( jQuery, window, document );
	}
}(function( $, window, document, undefined ) {
'use strict';
var DataTable = $.fn.dataTable;


/*
 * Set the default display controller to be our bootstrap control 
 */
DataTable.Editor.defaults.display = "bootstrap";


/*
 * Alter the buttons that Editor adds to TableTools so they are suitable for bootstrap
 */
var i18nDefaults = DataTable.Editor.defaults.i18n;
i18nDefaults.create.title = '<h5 class="modal-title">'+i18nDefaults.create.title+'</h5>';
i18nDefaults.edit.title = '<h5 class="modal-title">'+i18nDefaults.edit.title+'</h5>';
i18nDefaults.remove.title = '<h5 class="modal-title">'+i18nDefaults.remove.title+'</h5>';

var tt = DataTable.TableTools;
if ( tt ) {
	tt.BUTTONS.editor_create.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_edit.formButtons[0].className = "btn btn-primary";
	tt.BUTTONS.editor_remove.formButtons[0].className = "btn btn-danger";
}


/*
 * Change the default classes from Editor to be classes for Bootstrap
 */
$.extend( true, $.fn.dataTable.Editor.classes, {
	"header": {
		"wrapper": "DTE_Header modal-header"
	},
	"body": {
		"wrapper": "DTE_Body modal-body"
	},
	"footer": {
		"wrapper": "DTE_Footer modal-footer"
	},
	"form": {
		"tag": "form-horizontal",
		"button": "btn",
		"buttonInternal": "btn btn-outline-secondary"
	},
	"field": {
		"wrapper": "DTE_Field form-group row",
		"label":   "col-lg-4 col-form-label",
		"input":   "col-lg-8",
		"error":   "error is-invalid",
		"msg-labelInfo": "form-text text-secondary small",
		"msg-info":      "form-text text-secondary small",
		"msg-message":   "form-text text-secondary small",
		"msg-error":     "form-text text-danger small",
		"multiValue":    "card multi-value",
		"multiInfo":     "small",
		"multiRestore":  "card multi-restore"
	}
} );

$.extend( true, DataTable.ext.buttons, {
	create: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	edit: {
		formButtons: {
			className: 'btn-primary'
		}
	},
	remove: {
		formButtons: {
			className: 'btn-danger'
		}
	}
} );


/*
 * Bootstrap display controller - this is effectively a proxy to the Bootstrap
 * modal control.
 */

DataTable.Editor.display.bootstrap = $.extend( true, {}, DataTable.Editor.models.displayController, {
	/*
	 * API methods
	 */
	"init": function ( dte ) {
		var conf = {
			// Note that `modal-dialog-scrollable` is BS4.3+ only. It has no effect on 4.0-4.2
			content: $(
				'<div class="modal fade DTED">'+
					'<div class="modal-dialog modal-dialog-scrollable"></div>'+
				'</div>'
			),
			close: $('<button class="close">&times;</div>')
				.attr('title', dte.i18n.close)
				.on('click', function () {
					dte.close('icon');
				}),
			shown: false,
			fullyShow: false
		}

		// This is a bit horrible, but if you mousedown and then drag out of the modal container, we don't
		// want to trigger a background action.
		var allowBackgroundClick = false;
		$(document).on('mousedown', 'div.modal', function (e) {
			allowBackgroundClick = $(e.target).hasClass('modal') && conf.shown
				? true
				: false;
		} );

		$(document).on('click', 'div.modal', function (e) {
			if ( $(e.target).hasClass('modal') && allowBackgroundClick ) {
				dte.background();
			}
		} );

		// Add `form-control` to required elements
		dte.on( 'displayOrder.dtebs', function ( e, display, action, form ) {
			$.each( dte.s.fields, function ( key, field ) {
				$('input:not([type=checkbox]):not([type=radio]), select, textarea', field.node() )
					.addClass( 'form-control' );
			} );
		} );

		dte._bootstrapDisplay = conf;

		return DataTable.Editor.display.bootstrap;
	},

	"open": function ( dte, append, callback ) {
		var conf = dte._bootstrapDisplay;

		$(append).addClass('modal-content');

		if ( conf._shown ) {
			// Modal already up, so just draw in the new content
			var content = conf.content.find('div.modal-dialog');
			content.children().detach();
			content.append( append );

			if ( callback ) {
				callback();
			}
			return;
		}

		conf.shown = true;
		conf.fullyDisplayed = false;

		var content = conf.content.find('div.modal-dialog');
		content.children().detach();
		content.append( append );

		$('div.modal-header', append).append( conf.close );

		$(conf.content)
			.one('shown.bs.modal', function () {
				// Can only give elements focus when shown
				if ( dte.s.setFocus ) {
					dte.s.setFocus.focus();
				}

				conf.fullyDisplayed = true;

				if ( callback ) {
					callback();
				}
			})
			.one('hidden', function () {
				conf.shown = false;
			})
			.appendTo( 'body' )
			.modal( {
				backdrop: "static",
				keyboard: false
			} );
	},

	"close": function ( dte, callback ) {
		var conf = dte._bootstrapDisplay;

		if ( !conf.shown ) {
			if ( callback ) {
				callback();
			}
			return;
		}

		// Check if actually displayed or not before hiding. BS4 doesn't like `hide`
		// before it has been fully displayed
		if ( ! conf.fullyDisplayed ) {
			$(conf.content)
				.one('shown.bs.modal', function () {
					conf.close( dte, callback );
				} );

			return;
		}

		$(conf.content)
			.one( 'hidden.bs.modal', function () {
				$(this).detach();
			} )
			.modal('hide');

		conf.shown = false;
		conf.fullyDisplayed = false;

		if ( callback ) {
			callback();
		}
	},

	node: function ( dte ) {
		return dte._bootstrapDisplay.content[0];
	}
} );


return DataTable.Editor;
}));


