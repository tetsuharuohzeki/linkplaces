/**
 * Observers
 * This is enable to write the style like "resource://services-sync/ext/Observers.js".
 *
 * @License     MPL 1.1/GPL 2.0/LGPL 2.1
 * @developer   saneyuki_s
 * @version     20110215.1
 */

var EXPORTED_SYMBOLS = ["Observers"];

var Observers = {
	_observerSvc: null,
	get observerSvc() {
		if (!this._observerSvc) {
			this._observerSvc = Components.classes["@mozilla.org/observer-service;1"]
			                    .getService(Components.interfaces.nsIObserverService);
		}
		return this._observerSvc;
	},

	add: function (aTopic, aObsObj) {
		var obs = new Observer(aTopic, aObsObj);
		this.observerSvc.addObserver(obs, aTopic, false);
		ObserverCache.push(obs);
	},

	remove: function (aTopic, aObsObj) {
		var observerArray = ObserverCache.filter(function(aElm){ return (aElm.topic == aTopic &&
		                                                                 aElm.obsObj == aObsObj); });
		observerArray.forEach(function(aElem){
			this.observerSvc.removeObserver(aElem, aTopic);
			ObserverCache.splice(ObserverCache.indexOf(aElem), 1);
		}, this);
	},

	notify: function (aTopic, aSubject, aData) {
		var subject = (typeof aSubject === "undefined") ? null : { wrappedJSObject: aSubject };
		var data    = (typeof aData    === "undefined") ? null : aData;
		this.observerSvc.notifyObservers(subject, aTopic, data);
	}
};

var ObserverCache = [];

function Observer(aTopic, aObsObj) {
	this.topic = aTopic;
	this.obsObj = aObsObj;
}
Observer.prototype = {

	topic: null,
	obsObj: null,

	observe: function (aSubject, aTopic, aData) {
		this.obsObj.observe(aSubject.wrappedJSObject, aTopic, aData);
	}
};