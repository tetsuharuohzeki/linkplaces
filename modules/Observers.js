/**
 * Observers
 * This is enable to write the style like "resource://services-sync/ext/Observers.js".
 *
 * @License     MPL 1.1/GPL 2.0/LGPL 2.1
 * @developer   saneyuki_s
 * @version     20110716.1
 */

Components.utils.import("resource://gre/modules/Services.jsm");

let EXPORTED_SYMBOLS = ["Observers"];

let Observers = {

	add: function (aTopic, aObsObj) {
		let obs = new Observer(aTopic, aObsObj);
		Services.obs.addObserver(obs, aTopic, false);
		ObserverCache.push(obs);
	},

	remove: function (aTopic, aObsObj) {
		var observerArray = ObserverCache.filter(function(aElm){ return (aElm.topic == aTopic &&
		                                                                 aElm.obsObj == aObsObj); });
		observerArray.forEach(function(aElem){
			Services.obs.removeObserver(aElem, aTopic);
			ObserverCache.splice(ObserverCache.indexOf(aElem), 1);
		}, this);
	},

	notify: function (aTopic, aSubject, aData) {
		let subject = (typeof aSubject === "undefined") ? null : { wrappedJSObject: aSubject };
		let data    = (typeof aData    === "undefined") ? null : aData;
		Services.obs.notifyObservers(subject, aTopic, data);
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