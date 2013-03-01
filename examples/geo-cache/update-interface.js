
window.addEventListener("load", init, false);

function init() {
	var button = document.getElementById ("new_task_button");
	button.addEventListener("click", startAction, false);
}

function startAction(event) {
	console.log("start geocode");
	var nb_entries =  document.getElementById ("nb_entries").value;
	var cache_update_delay =  document.getElementById ("cache_update_delay").value;
	var geocode_poll_min_delay =  document.getElementById ("geocode_poll_min_delay").value;

	getPendingAdresses(nb_entries, cache_update_delay, geocode_poll_min_delay, geocode, updateCache);
	
	event.preventDefault();
}

function	getPendingAdresses(nb_entries, cache_update_delay, geocode_poll_min_delay, geocode, updateCache){
	console.log("    " + nb_entries + " " + cache_update_delay + " " + geocode_poll_min_delay);
	console.log("Need to call the cache service to read new address data ");
	console.log("Then call geocode");
	console.log("Which will call updateCache");

}

function	updateCache() {
	console.log("Need to call the cache service to write new geolocation data ");
}

