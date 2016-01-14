#pragma strict

class Person extends UnityEngine.MonoBehaviour{
	var _name:String;
	var stats:Stats = new Stats();
	var squad:int;
	var building:String;
	function Initialize(){
		_name = Daemon.main.GetPersonName();
		name = _name;
		Daemon.main.SetRandomPersonStats(stats);
		transform.parent=GameObject.Find("People").transform;
	}
}