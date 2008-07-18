var gOuterLinkCheck,
	gAnyLinkCheck,
	gGroupBookmarkRadio,
	gGroupBookmarkTree,
	gGroupBookmarkReplace;
var gTabbarPlacePositionInitialized = false;

function initTabPane()
{
	gOuterLinkCheck = document.getElementById('extensions.treestyletab.openOuterLinkInNewTab-check');
	gAnyLinkCheck = document.getElementById('extensions.treestyletab.openAnyLinkInNewTab-check');
	gOuterLinkCheck.disabled = gAnyLinkCheck.checked;

	gGroupBookmarkRadio = document.getElementById('openGroupBookmarkAsTabSubTree-radiogroup');
	gGroupBookmarkTree = document.getElementById('extensions.treestyletab.openGroupBookmarkAsTabSubTree');


	var Prefs = Components.classes['@mozilla.org/preferences;1']
			.getService(Components.interfaces.nsIPrefBranch);

	var restrictionKey = 'browser.link.open_newwindow.restriction';
	var restriction = document.getElementById(restrictionKey);
	try {
		restriction.value = Prefs.getIntPref(restrictionKey);
	}
	catch(e) {
		Prefs.setIntPref(restrictionKey, parseInt(restriction.value));
	}

	var bookmarkReplaceKey = 'browser.tabs.loadFolderAndReplace';
	gGroupBookmarkReplace = document.getElementById(bookmarkReplaceKey);
	try {
		gGroupBookmarkReplace.value = Prefs.getBoolPref(bookmarkReplaceKey);
	}
	catch(e) {
		Prefs.setBoolPref(bookmarkReplaceKey, gGroupBookmarkReplace.value != 'false');
	}

	gGroupBookmarkRadio.value =
		gGroupBookmarkTree.value && !gGroupBookmarkReplace.value ? 'subtree' :
		!gGroupBookmarkTree.value && !gGroupBookmarkReplace.value ? 'flat' :
		'replace';
}

function onChangeGroupBookmarkRadio()
{
	gGroupBookmarkTree.value    = gGroupBookmarkRadio.value == 'subtree';
	gGroupBookmarkReplace.value = gGroupBookmarkRadio.value == 'replace';
}


function onChangeTabbarPosition(aOnChange)
{
	var pos = document.getElementById('extensions.treestyletab.tabbar.position-radiogroup').value;
	var invertScrollbar = document.getElementById('extensions.treestyletab.tabbar.invertScrollbar-check');
	invertScrollbar.disabled = pos != 'left';
	document.getElementById('extensions.treestyletab.tabbar.invertUI-check').disabled = pos != 'right';

	if (isGecko18()) {
		invertScrollbar.removeAttribute('collapsed');
	}
	else {
		invertScrollbar.setAttribute('collapsed', true);
	}

	var indentPref    = document.getElementById('extensions.treestyletab.enableSubtreeIndent');
	var collapsePref  = document.getElementById('extensions.treestyletab.allowSubtreeCollapseExpand');

	var indentCheck   = document.getElementById('extensions.treestyletab.enableSubtreeIndent-check');
	var collapseCheck = document.getElementById('extensions.treestyletab.allowSubtreeCollapseExpand-check');
//	var autoHideCheck = document.getElementById('extensions.treestyletab.tabbar.autoHide.enabled-check');
	var hideAllTabsCheck = document.getElementById('extensions.treestyletab.tabbar.hideAlltabsButton-check');

	if (aOnChange) {
		indentPref.value = indentCheck.checked =
			collapsePref.value = collapseCheck.checked = (pos == 'left' || pos == 'right');
	}
	if (pos == 'left' || pos == 'right') {
		indentCheck.setAttribute('collapsed', true);
//		autoHideCheck.removeAttribute('collapsed');
		hideAllTabsCheck.removeAttribute('collapsed');
	}
	else {
		indentCheck.removeAttribute('collapsed');
//		autoHideCheck.setAttribute('collapsed', true);
		hideAllTabsCheck.setAttribute('collapsed', true);
	}

	gTabbarPlacePositionInitialized = true;
}

function isGecko18()
{
	const XULAppInfo = Components.classes['@mozilla.org/xre/app-info;1'].getService(Components.interfaces.nsIXULAppInfo);
	var version = XULAppInfo.platformVersion.split('.');
	return parseInt(version[0]) <= 1 && parseInt(version[1]) <= 8;
}


var gAutoHideModeRadio;
var gAutoHideModeToggle;

function initAutoHidePane()
{
	gAutoHideModeRadio = document.getElementById('extensions.treestyletab.tabbar.autoHide.mode-radio');
	gAutoHideModeToggle = document.getElementById('extensions.treestyletab.tabbar.autoHide.mode.toggle');
	updateAutoHideModeLabel();
}

function onChangeAutoHideMode()
{
	if (!gAutoHideModeRadio) return;
	var mode = gAutoHideModeRadio.value;
	if (!mode) return;
	if (gAutoHideModeRadio.value != 0) {
		gAutoHideModeToggle.value = mode;
		updateAutoHideModeLabel();
	}
}

function updateAutoHideModeLabel()
{
	if (!gAutoHideModeRadio) return;
	var mode = gAutoHideModeRadio.value;
	var nodes = document.getElementsByAttribute('label-mode'+mode, '*');
	if (nodes && nodes.length)
		Array.slice(nodes).forEach(function(aNode) {
			var label = aNode.getAttribute('label-mode'+mode);
			var node = document.getElementById(aNode.getAttribute('target'));
			var attr = node.localName == 'label' ? 'value' : 'label' ;
			node.setAttribute(attr, label);
		});
}
