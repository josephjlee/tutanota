"use strict";

goog.provide('tutao.tutanota.gui.SettingsView');

/**
 * @constructor
 * @implements {tutao.tutanota.ctrl.View}
 */
tutao.tutanota.gui.SettingsView = function() {
	tutao.util.FunctionUtils.bindPrototypeMethodsToThis(this);

	this._leftmostVisibleColumn = ko.observable(-1);
	this._rightmostVisibleColumn = ko.observable(-1);
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.init = function(external) {
	var self = this;
	// configure view slider
	this._viewSlider = new tutao.tutanota.ctrl.ViewSlider();
	//TODO read from css
	this._viewSlider.setScreenWidth(tutao.tutanota.gui.getWindowWidth());
	this._viewSlider.setViewPositionAndSizeReceiver(function(x, y, initial) {
		self._leftmostVisibleColumn(self._viewSlider.getLeftmostVisibleColumnId());
		self._rightmostVisibleColumn(self._viewSlider.getRightmostVisibleColumnId());
		tutao.tutanota.gui.viewPositionAndSizeReceiver("#settingsContent", x, y, initial);
	});
	this._viewSlider.addViewColumn(0, 150, 200	, function(x, width) {
		$('#settingsColumn').css("width", width + "px");
	});
	this._viewSlider.addViewColumn(1, 400, 600	, function(x, width) {
		$('#changeSettingsColumn').css("width", width + "px");
	});

	this._firstActivation = true;
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.isForInternalUserOnly = function() {
	return true;
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.activate = function() {
	this._viewSlider.setScreenWidth(tutao.tutanota.gui.getWindowWidth());
	if (this._firstActivation) {
		this._firstActivation = false;
		if (tutao.tutanota.util.ClientDetector.isTouchSupported()) {
			this._changeSettingsScroller = new iScroll('changeSettingsInnerColumn', {useTransition: true});
			
			// workaround for input field bug. it allows to set the focus on text input elements
			this._changeSettingsScroller.options.onBeforeScrollStart = function(e) {
		        var target = e.target;

		        while (target.nodeType != 1) target = target.parentNode;

		        if (!tutao.tutanota.gui.isEditable(e.target)) {
		            e.preventDefault();
		        }
		    };
		}
		// only show the default view columns if this is the first activation, otherwise we want to see the last visible view columns
		this._viewSlider.showDefault();
	}
	tutao.locator.settingsViewModel.show(tutao.tutanota.ctrl.SettingsViewModel.DISPLAY_ACCOUNT_SETTINGS);
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.deactivate = function() {
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.windowSizeChanged = function(width, height) {
	this._viewSlider.setScreenWidth(width);
};

tutao.tutanota.gui.SettingsView.COLUMN_SETTINGS = 0;
tutao.tutanota.gui.SettingsView.COLUMN_CHANGE_SETTINGS = 1;

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.swipeRecognized = function(type) {
	if (type == tutao.tutanota.ctrl.SwipeRecognizer.TYPE_LEFT_IN) {
		if (this.isShowNeighbourColumnPossible(true)) {
			this.showNeighbourColumn(true);
		}
	} else if (type == tutao.tutanota.ctrl.SwipeRecognizer.TYPE_RIGHT_IN) {
		if (this.isShowNeighbourColumnPossible(false)) {
			this.showNeighbourColumn(false);
		}
	}
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.showNeighbourColumn = function(left) {
	var columnToShow = (left) ? this._viewSlider.getLeftmostVisibleColumnId() - 1 : this._viewSlider.getRightmostVisibleColumnId() + 1;
	this._viewSlider.showViewColumn(columnToShow);
};

/**
 * @inherit
 */
tutao.tutanota.gui.SettingsView.prototype.isShowNeighbourColumnPossible = function(left) {
	if (left) {
		return (this._leftmostVisibleColumn() == tutao.tutanota.gui.SettingsView.COLUMN_CHANGE_SETTINGS); 
	} else {
		return false;
	}
};

/**
 * Makes sure that the change settings column is visible.
 */
tutao.tutanota.gui.SettingsView.prototype.showChangeSettingsColumn = function() {
	this._viewSlider.showViewColumn(tutao.tutanota.gui.SettingsView.COLUMN_CHANGE_SETTINGS);
	if (this._changeSettingsScroller) {
		this._changeSettingsScroller.refresh();
	}
};
