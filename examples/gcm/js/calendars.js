
function loadCalendars(gCalURL) {
	var startDay= '2010-07-01T00:00:00-00:00';
	var endDay = '2013-06-31T00:00:00-00:00';
	getGCalData(gCalURL, startDay, endDay);
	}
		

function verifyURL(gCalUrl) {
	/*var startswithM = 'mock/';
	if (gCalUrl.slice(0, startswithM.length) == startswithM){
		return gCalUrl;
	}
	gCalUrl = gCalUrl.replace(/\/basic$/, '/full');

	var startswith = 'https://www.google.com/calendar/feeds/';
	if (gCalUrl.slice(0, startswith.length) != startswith){
		gCalUrl = startswith + gCalUrl;
	}

	var endswith0 = '@gmail.com';
	var endswith1 = '@gmail.com/public/full';
	if (gCalUrl.slice(-endswith0.length) == endswith0){
		gCalUrl = gCalUrl.slice(0,-endswith0.length) + endswith1;
	}
	if (gCalUrl.slice(-endswith1.length) != endswith1){
		var endswith2 = '@gmail.com/public/basic';
		if (gCalUrl.slice(-endswith2.length) == endswith2){
			gCalUrl = gCalUrl.slice(0,-endswith2.length) + endswith1;
		}
		gCalUrl = gCalUrl + endswith1;
	}*/
	return gCalUrl;
}

function getGCalData(gCalUrl, startDays, endDays) {

	gCalUrl = verifyURL(gCalUrl);

	info ('loading: ' + gCalUrl);

	// http://code.google.com/apis/calendar/docs/2.0/reference.html
	gCalObj = {
		'start-min': startDays,
		'start-max': endDays,
		'max-results': 200,
		'orderby'  : 'starttime',
		'sortorder': 'ascending',
		'singleevents': false
		};

	var array = [];
	for (var key in gCalObj) {
 		array.push( key + '=' + gCalObj[key] ) ;
	}		
	var ajaxURL = gCalUrl + "?alt=json&" +  array.join("&");
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 info ('Calendar response received, length=' + xmlhttp.responseText.length);
				 var calendarEvents = parseCalendarEvents(xmlhttp.responseText);
				 populateTable(calendarEvents);
				 geocode(calendarEvents, createMap);
			} else {
				 info ('Calendar response failure... status=' + xmlhttp.status);
				 }
		 }
	  };

	xmlhttp.open("GET",ajaxURL,true);
	xmlhttp.send();
}

function parseCalendarEvents(calendarAnswerText) {
	var calendarAnswer = JSON.parse(calendarAnswerText);
	var calendarTitle = calendarAnswer.feed.title['$t']	
	info ("Reading calendar data: " + calendarTitle)
	var calendarHref = calendarAnswer.feed.link[0].href  // needed for cross reference later	 

	if (calendarAnswer.feed.entry) { 
		var calendarEvents = new Array();
		for (var ii=0; calendarAnswer.feed.entry[ii]; ii++) {
			// console.log ('Treating entry ' + ii);
			var curEntry = calendarAnswer.feed.entry[ii];
			if (!(curEntry['gd$when'] && curEntry['gd$when'][0]['startTime'])) {
				// console.log(" skipping entry (no gd$when) " + curEntry['title']['$t']);
				// console.log(" skipped " + curEntry['gd$when'] + '/' + curEntry);
				continue;
			};
			var urlMap = {};
			for (var jj=0; curEntry.link[jj]; jj++) {
			   // console.log ('Treating entry link ' + jj);
				var curLink = curEntry.link[jj];
				if (curLink.type == 'text/html') {
					// looks like when rel='related', href is original event info (like meetup.com)
					// when rel='alternate', href is the google.com calendar event info
					urlMap[curLink.rel] = curLink.href;
				}
			}

			var event = {
				title: calendarTitle,
				name: curEntry['title']['$t'],
				desc: curEntry['content']['$t'],
				addrOrig: curEntry['gd$where'][0]['valueString'] || '',  // 'location' field of the event
				url: urlMap.related || urlMap.alternate, // TODO - is this what we want? see href above
				dateStart: curEntry['gd$when'][0]['startTime'],
				dateEnd: curEntry['gd$when'][0]['endTime']
			};
			console.log ('created event ' + event.name + ' as ' +  JSON.stringify(event));
			if (event.addrOrig && event.addrOrig.trim() !== '' ) {
				console.log("Maybe a new address, get ready to geodecode:" + event.addrOrig);
				calendarEvents.push (event);
			} else {
				console.log("Skipping blank address for "+event.name+" ["+event.addrOrig+"]",event);
			}
		} 
	} // end if calendarAnswer.feed.entry
	info ("Finished parsing calendar data for: " + calendarTitle)
	return calendarEvents;
} // end parseCalendarEvents

