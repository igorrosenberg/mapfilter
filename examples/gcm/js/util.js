// ---------------------
// Implementation of sets
// Objects are expected to have:  {title, lat, lng, info}
// same gps, title and date => equality
// ---------------------


function Set() {
	this.content = {};
}
// private
Set.prototype.hash = function(val) {
	return (val.lat + '|' + val.lng + '|' + val.title + '|' + val.date);
}
Set.prototype.add = function(val) {
	this.content[this.hash(val)]=val;
}
Set.prototype.remove = function(val) {
	delete this.content[this.hash(val)];
}
Set.prototype.contains = function(val) {
	return (this.hash(val) in this.content);
}
Set.prototype.values = function() {
	var res = [];
	for (var val in this.content)  {
        console.log ('IN=' + val);
        console.log ('OUT=' + this.content[val]);
        res.push(this.content[val]);
	}
	return res;
}
// ---------------------
// tracing events
// ---------------------
function log(){
		var content = document.createElement('p');
		content.appendChild(document.createTextNode(event.name));
		document.getElementById("log").appendChild(content);
}
		
