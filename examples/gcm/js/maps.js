function mapInitialized() {
	var mapOptions = { mapTypeId: google.maps.MapTypeId.ROADMAP };
	var mapBlock = document.getElementById('map_canvas');
	map = new google.maps.Map(mapBlock, mapOptions);
}

// Place given event on Google Maps, relying on local GPS cache  
function addGmapListener(event){

	// how do we know where the GPS cache data is (localCache var)?
	console.log ("Looking for " + event.addrOrig);
	var point = localCache[event.addrOrig];
	if (!point) {
		console.warn ('no GPS data for addr='+ event.addrOrig + ' date=' +  event.dateStart + ' name=' +event.name );
		return;
	}

	var latLng = new google.maps.LatLng(point.lat, point.lng);
	// remember marker so hiding is possible
	event.gMarker = new google.maps.Marker({
		position: latLng,
		title: event.name + '\n' + event.addrOrig,
		zIndex: 2, 
		map: map          // adds the marker to gmap called 'map'
	});		

	var dates; 
	if (event.dateStart == event.dateEnd ) {
		dates = 'Date: le ' + event.dateStart;
	}
	else {
		dates = 'Dates: du ' + event.dateStart + ' au ' + event.dateEnd;  
	}

	var full = '<div class="infoWindow">' ;
	full += '<h4>' + event.name + '</h4><ul>' ;
	if (event.desc && event.desc.trim() !== "") {
		full += '<li>' + event.desc + '</li>';
	}
	full += '<li>' + dates + '</li>' + 
		 '<li>' + 'Adresse: ' + event.addrOrig + '</li>' + 
		 '<li>' + 'Calendrier <a href="'+event.url+'">' + event.title + '</a>' + 
		 '</li></ul>' ;
	full += '</div>';
	
	var infowindow = new google.maps.InfoWindow({content: full});
	google.maps.event.addListener(event.gMarker, 'click', function() {
			infowindow.open(map, event.gMarker);
	});
}

function createMap(eventList) {
	// loop on this function until google maps ready
	if (!map){
		console.log ('map script not yet ready ??');
		setTimeout(function () { createMap(eventList);} , 50);
		return;
	}
	console.log ("createMap");
	for (var i = 0; i < eventList.length; i++)  {
		addGmapListener(eventList[i]);
	}
	incrementBounds(eventList, map.getBounds());

	// also store those points in global calendar map	
	event_markers[eventList[0].calId] = eventList;

} // end createMap

function incrementBounds(eventList, bounds){
	if (bounds == null || bounds == undefined){
		bounds = new google.maps.LatLngBounds();
	}	
	for (var i = 0; i < eventList.length; i++)  {
		if (eventList[i].gMarker) {
			bounds.extend( eventList[i].gMarker.getPosition() );
		}
	}
	map.fitBounds(bounds);
}

function deleteCalendar(calId, li_node) {
	// remove from calendar list
	li_node.parentNode.removeChild(li_node);
	
	// remove markers from google maps
	var values = event_markers[calId];
	for (var i = 0; i < values.length; i++) {
		values[i].gMarker.setMap(null) ;
	}
	delete event_markers[calId];

	// remove from table
	var tableElement = document.getElementById("event_table_body");
	var deleteElements = tableElement.getElementsByClassName('tr' + calId);
	for (var i=deleteElements.length -1; i >=0 ; i--) {	
		deleteElements[i].parentNode.removeChild(deleteElements[i]);
	}	

	// reset map bounds
	for (var otherCalId in event_markers) {
		incrementBounds(event_markers[otherCalId], null);
	}	
}

// applies to map and table, separate?
function hideShowCalendar(calId, li_node) {

	var tableElement = document.getElementById("event_table_body");
	var hideElements = tableElement.getElementsByClassName('tr' + calId);
	
	var targetMap;

	if (li_node.classList.contains('not-on-map') ) {
		targetMap = map;				// add points to the only google map div on page
		li_node.classList.remove('not-on-map'); // normal font for control link
		for (var i=hideElements.length -1; i >=0 ; i--) {	// show on table
				hideElements[i].classList.remove('not-on-map');
		     }	
	} else {
		targetMap = null; 			// hide points from google map div map
		li_node.classList.add('not-on-map'); // italics for control link
		for (var i=hideElements.length -1; i >=0 ; i--) { // hide from table
			hideElements[i].classList.add('not-on-map');
	     }	
	}

	var values = event_markers[calId];
	for (var i = 0; i < values.length; i++) {
		values[i].gMarker.setMap(targetMap) ;
	} 
	
} // end hideShowCalendar

// TODO Insert in separate file
function populateTable (events) {
	if (events.length == 0)
		return;
	// places the name in the show/hide list
 	var cal_list = document.getElementById("cal_list");
  	var node = document.createElement('li');
  	var calId = events[0].calId;

	// add hide/show on cal name  	
  	var node1 = document.createElement('a');
  	node1.href = '#';
  	node1.onclick = function () { hideShowCalendar(calId, node); return false;};
  	node1.appendChild(document.createTextNode(events[0].title)); 
	node.appendChild(node1);

	// add delete cal button
  	var node3 = document.createElement('img');
  	node3.src = 'img/delete-2x.png'; 
  	node3.className = 'deleteButton'; 
  	node3.title = 'Delete calendar'; 
  	var node2 = document.createElement('a');
  	node2.href = '#';
  	node2.onclick = function () { deleteCalendar(calId, node); return false;};
  	node2.appendChild(node3); 
	node.appendChild(node2);
		
  	cal_list.appendChild(node);

	// inserts a table row
	var tableElement = document.getElementById("event_table_body");
	for (var i=0; i < events.length; i++) {
        	var tr = document.createElement('tr');
        	tr.className = 'tr' + calId;
        	// add color to table lines? content.class = css_classes;
        	tr.appendChild(textNode('td' , events[i].name));
        	tr.appendChild(textNode('td' , events[i].addrOrig));
        	tr.appendChild(textNode('td' , events[i].dateStart + ' ' + events[i].dateEnd));
        	tableElement.appendChild(tr);
        }
}

function textNode(nodeName, text){
        	var node = document.createElement(nodeName);
        	node.appendChild(document.createTextNode(text)); 
        	return node;
}

function textNode(nodeName, text, clazz){
        	var node = document.createElement(nodeName);
        	node.appendChild(document.createTextNode(text)); 
        	node.className = clazz; 
        	return node;
}

