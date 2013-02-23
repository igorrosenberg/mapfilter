
function loadCalendars(gCalURL) {
	var startDay= '2010-07-01T00:00:00-00:00';
	var endDay = '2013-06-31T00:00:00-00:00';
	getGCalData(gCalURL, startDay, endDay);
	}
		
function getGCalData(gCalUrl, startDays, endDays) {
	info ('loading: ' + gCalUrl);
	gCalUrl = gCalUrl.replace(/\/basic$/, '/full');

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
	var mapString = array.join("&");
	var ajaxURL = gCalUrl + "?alt=json&" + mapString;
	var xmlhttp=new XMLHttpRequest();
	xmlhttp.onreadystatechange = function () {
		if (xmlhttp.readyState==4) {
			if (xmlhttp.status==200) {
				 info ('Calendar response received, length=' + xmlhttp.responseText.length);
				 var calendarEvents = parseCalendarEvents(xmlhttp.responseText);
				 geocode (calendarEvents);
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
			console.log ('Treating entry ' + ii);
			var curEntry = calendarAnswer.feed.entry[ii];
			if (!(curEntry['gd$when'] && curEntry['gd$when'][0]['startTime'])) {
				console.log(" skipping entry (no gd$when) " + curEntry['title']['$t']);
				continue;
			};
			var urlMap = {};
			for (var jj=0; curEntry.link[jj]; jj++) {
			 console.log ('Treating entry link ' + jj);
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
			if (event.addrOrig) {
				console.log("Maybe a new address, get ready to geodecode:" + event.addrOrig);
			} else {
				console.log(" Skipping blank address for "+event.name+" ["+event.addrOrig+"]",event);
			}
			console.log("parsed curEntry "+ii+": ", event.name);
			calendarEvents.push (event);
		} 
	} // end if calendarAnswer.feed.entry
	info ("Finished parsing calendar data for: " + calendarTitle)
	return calendarEvents;
} // end parseCalendarEvents

