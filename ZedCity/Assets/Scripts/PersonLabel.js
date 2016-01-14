
class PersonLabel extends UnityEngine.MonoBehaviour{
	var background :GUITexture;
	var backgroundColor:Color;
	var facePicture:GUITexture;
	var _name:GUIText;
	var squad:GUIText;
	var stats:GUIText;
	var p:Person;
	function Start () {
		background = transform.Find("Background").gameObject.GetComponent.<GUITexture>();
		backgroundColor = background.GetComponent.<GUITexture>().color;
		facePicture = transform.Find("FacePicture").GetComponent.<GUITexture>();
		_name = transform.Find("Name").GetComponent.<GUIText>();
		squad = transform.Find("Squad").GetComponent.<GUIText>();
		stats = transform.Find("Stats").GetComponent.<GUIText>();
		
		
	}

	function LoadPerson(p:Person){
		this.p=p;
		_name.text = p._name;
		squad.text = Global.squads[p.squad];
		stats.text = p.stats.toString();
	}
	
	function Update(){
		if(CooldownManager.main.checkCooldown(p._name)){
			squad.text=CooldownManager.main.getTimeLeft(p._name);
		}else{
			squad.text = Global.squads[p.squad];
		}
	}
	
	

}