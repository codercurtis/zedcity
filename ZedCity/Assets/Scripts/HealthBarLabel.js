class HealthBarLabel extends UnityEngine.MonoBehaviour{
	var background :GUITexture;
	var backgroundColor:Color;
	var healthBar:GUITexture;
	var building:Building;
	var text:GUIText;
	var startWidth:float;
	function Start () {
		background = transform.Find("Background").gameObject.GetComponent.<GUITexture>();
		background.GetComponent.<GUITexture>().color = backgroundColor;
		healthBar = transform.Find("Bar").GetComponent.<GUITexture>();
		startWidth = healthBar.GetComponent.<GUITexture>().pixelInset.width;
	}
	
	function Update(){
		if(Daemon.main.selectedBuilding){
			building=Daemon.main.selectedBuilding;
		}
		if(building){ 
			healthBar.GetComponent.<GUITexture>().pixelInset.width = ((building.stats.values[BuildingStats.hp]/building.stats.values[BuildingStats.maxHp]) * startWidth);
			
			
			text.GetComponent.<GUIText>().text = building.stats.values[BuildingStats.hp] + " / "+ building.stats.values[BuildingStats.maxHp];
		}
	
	}
}