#pragma strict
var height:float;
var pause:float;
var origHeight:float;
var label:NotificationLabel;
function Start () {
	Daemon.main.numNotifications++;
}

function Update () {
	pause-=Time.deltaTime;
	if(pause<=0){
		print("destroyed");
		Daemon.main.numNotifications--;
		Destroy(label.gameObject);
		Destroy(gameObject);
	}
	
}