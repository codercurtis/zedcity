#pragma strict
enum BuildingTypes{Base=0, Vacant=1, Infested=2,Production=3,Housing=4}



class Building extends UnityEngine.MonoBehaviour{
var id:int;
var modelType:int;
var _name:String;
var type:BuildingTypes;
var runOnce:boolean;
var stats:BuildingStats;
static var selected:GameObject;
var people: Person[] = new Person[8];
var label:GameObject;
function Start(){
	label = GameObject.Find("Label");
	id = GetID();
	GetComponent.<Renderer>().material.color = Daemon.main.buildingColors[type];
	transform.parent=GameObject.Find("Buildings").transform;
	
	switch(modelType){
		case 0:
			stats.values[BuildingStats.maxHp]=1000;
		break;
		case 1:
			stats.values[BuildingStats.maxHp]=5000;
		break;
		case 2:
			stats.values[BuildingStats.maxHp]=10000;
		break;
	}
		stats.values[BuildingStats.hp]=stats.values[BuildingStats.maxHp];
		
	print("checking"+gameObject.name);
	for(var k=0;k<Daemon.main.people.Count;k++){
		if(Daemon.main.people[k]!=null && Daemon.main.people[k].building==gameObject.name){
			print("adding"+Daemon.main.people[k]._name);
			AddPerson(Daemon.main.people[k]);
		}
	}
}

function Select(){
	if(selected!=gameObject){
		selected=gameObject;
		runOnce=true;
		print("selected");
	}
}

function Update(){
	if(selected==gameObject){
		if(runOnce){
			label.GetComponent(ObjectLabel).target=gameObject.transform;
			label.GetComponent.<GUIText>().text=_name;
			Daemon.main.selectedBuilding=this;
		}
	}
	
	if(stats.values[BuildingStats.hp]<=0){
		ChangeType(BuildingTypes.Vacant);
		stats.values[BuildingStats.hp]=stats.values[BuildingStats.maxHp];
	}
	
	for(var i:int=0;i<8;i++){
		if(people[i]!=null){ 
			if(!CooldownManager.main.checkCooldown(people[i]._name)){
				if(type==BuildingTypes.Production){
					var c = new Cooldown(0,0,Global.productionCooldownTime,"Production"+people[i].name+"_"+people[i].stats.values[Stats.production]);
					people[i].building=gameObject.name;
					
				}else if(type==BuildingTypes.Housing){
					var c2 = new Cooldown(0,0,Global.productionCooldownTime,"Cooking"+people[i].name+"_"+people[i].stats.values[Stats.cooking]);
					people[i].building=gameObject.name;
				}
			}
		}
	}
}

function AddPerson(p:Person){
	for(var i=0;i<people.length;i++){
		if(people[i]==null){
			people[i]=p;
			return;
		}
	}
}

function ChangeType(t:BuildingTypes){
	
	type=t;
	UpdateColor();
	
}
//Returns the numbers at the end of a string
function GetID(){

	var tempStr:String;
	var returnInt:int;
	//Loop through the string, and test the character to see if it's an int, then add it to a string
	for(var i=0;i<gameObject.name.Length;i++){
		var n:int;
		try{
			n = int.Parse(""+gameObject.name[i]);	
		}catch(err){} 
		
		if(n!=null){
			tempStr+=n;
			}
		}
	//turn the string back into an int
	returnInt = int.Parse(tempStr);
	return returnInt;	
}

function UpdateColor(){
	GetComponent.<Renderer>().material.color = Daemon.main.buildingColors[type];
}

}