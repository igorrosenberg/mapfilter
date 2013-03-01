
window.addEventListener("load", init, false);

function init() {
	var button = document.getElementById ("new_task_button");
	button.addEventListener("click", startAction, false);
}

function startAction() {
	console.log("start");
}


