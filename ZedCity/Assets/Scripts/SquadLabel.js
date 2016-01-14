
class SquadLabel extends UnityEngine.MonoBehaviour{
	var background :GUITexture;
	var backgroundColor:Color;
	var _name:GUIText;
	var stats:GUIText;
	var squad:int;
	function Start () {
		background = transform.Find("Background").gameObject.GetComponent.<GUITexture>();
		backgroundColor = background.GetComponent.<GUITexture>().color;
		_name = transform.Find("Name").GetComponent.<GUIText>();
		stats = transform.Find("Stats").GetComponent.<GUIText>();
	}

	function LoadSquad(i:int){
		Daemon.main.PopulateSquads();
		squad=i;
		
		stats.text = Daemon.main.CalculateSquadStats(i);
		//_name.text = Daemon.main.DetermineSquadRole(i) + " Squad " + Global.squads[i];
		
		Daemon.main.squads.list[i].label = this;
		Daemon.main.SetSquadRole(i);
	}
	
	

}