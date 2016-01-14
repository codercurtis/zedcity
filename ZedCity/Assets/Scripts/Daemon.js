#pragma strict
import System.Collections.Generic;
import System;
import System.Xml;
import System.Xml.Serialization;
import System.IO;
import System.Text;
static var main:Daemon;

var citySize:CitySize;

var chunk:GameObject;
var chunkArr:GameObject[];

var buildingTypes:Building[];
var buildings:Building[];
var buildingColors:Color[];

var personLabel:PersonLabel;
var squadLabel:SquadLabel;
var notificationLabel:NotificationLabel;

var personPlane:GameObject;

var personPrefab:Person;

var openSlots:Array = new Array();

var people:List.<Person> = new List.<Person>();
var units:Units;

var squads:Squads;

var bNames:BuildingNames;
var pNames:PersonNames;
var selectedBuilding:Building;
var personSelected:Person;
var squadSelected:int;
var scoutSquadInt:int;
var troopMenuShowing:boolean;
var squadSelectShowing:boolean;
var runOnce:boolean=true;
var newGame:boolean;
var loadGame:boolean;

var fileLocation : String;
var fileName : String = "SaveData.xml";
var data : String;
var squadData:String;

var myData :UserData;

var menuLevel:int;

var ready:boolean;
var loadOk:boolean;
var error:boolean;
var server:boolean;

var squadsShowing:boolean;
var squadMenuShowing:boolean;
var squadPopulationShowing:boolean;
var numNotifications:int;
var setScoutSquad:boolean;

function Awake(){
	myData = new UserData();
	DontDestroyOnLoad(gameObject);
	Daemon.main=this;
	fileLocation = Application.persistentDataPath;
	//print(fileLocation);
}

function Start(){
	chunkArr = new GameObject[(citySize.rows * citySize.cols)];
	buildings = new Building[(citySize.rows * citySize.cols)*4];
	
}
function NewGame() {
	SetMenuCameraEnabled(false);
	AddPeople(5);
	CreateChunks();
}

function SaveGame(){
	SavePeople();
	SaveBuildings();
	SaveCooldowns();	
	SaveScoutSquad();
	PopulateLocalFromGlobal();
	data = SerializeObject(myData);
	CreateXML();
	//print(data);
	if(loadGame){
		Scoreoid.main.editPlayer();
	}else{
		Scoreoid.main.createPlayer();
		loadGame=true;
	}
}

function LoadGame(){
	//TODO: Populate Global from PlayerPrefs/XML
	CreateChunks();
	if(!server){
		LoadXML();
	}
	PopulateLocalFromXML();
	PopulateGlobalFromLocal();
	SetMenuCameraEnabled(false);
	LoadPeople();
	LoadScoutSquad();
	PopulateSquads();
	LoadBuildings();
	LoadCooldowns();
	
}

function Update () {
	var date = System.DateTime.Now;
	if(Application.loadedLevel==1){
		if(newGame){
			if(runOnce){
				NewGame();
				runOnce=false;
			}
		}
		if(loadGame){
			if(runOnce){
				LoadGame();
				runOnce=false;
			}
		}
		
		var maxFood:int;
		var i:int;
		for(var b:Building in buildings){
			if(b!=null){
				if(b.type ==BuildingTypes.Housing){
					for(var p:Person in b.people){
						if(p!=null){
							maxFood += p.stats.values[Stats.production];
						}
					}
				}
			}	
		}
		Global.maxFood=maxFood;
	}
	
	if(GameObject.FindGameObjectsWithTag("Daemon").length>1){
		Destroy(GameObject.FindGameObjectsWithTag("Daemon")[1]);
	}
	
	
	
	Global.maxFood=maxFood;
}

function OnGUI() {

	//Menu screen
	if(Application.loadedLevel==0){
		if(menuLevel==0){
			if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2-100,100,30),"Load")){
				loadGame=true;
				menuLevel++;
			}
			if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2+100,100,30),"New Game")){
				newGame=true;
				menuLevel++;
			}
			if(GUI.Button(Rect(Screen.width/2-50,Screen.height-50,100,30),"Quit")){
				Application.Quit();
			}
		}else if(menuLevel==1){
			if(GUI.Button(Rect(Screen.width/2-50,Screen.height-50,100,30),"Back")){
				loadGame=false;
				newGame=false;
				menuLevel=0;
			}
			if(newGame){
				Global.user = GUI.TextField(Rect(Screen.width/2-50,Screen.height/2,100,30),Global.user);
				Global.pass = GUI.PasswordField(Rect(Screen.width/2-50,Screen.height/2+50,100,30),Global.pass,"*"[0]);
				
				if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2+100,100,30),"Log in")){
					GUI.Label(Rect(Screen.width/2-50,Screen.height/2-200,100,30),"Working...");
					Application.LoadLevel(1);
				}
			}else if(loadGame){
			
				Global.user = GUI.TextField(Rect(Screen.width/2-50,Screen.height/2,100,30),Global.user);
				Global.pass = GUI.PasswordField(Rect(Screen.width/2-50,Screen.height/2+50,100,30),Global.pass,"*"[0]);
				
				if(error){
					if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2+100,100,30),"error")){
						GUI.Label(Rect(Screen.width/2-50,Screen.height/2-100,100,30),"Try again");
						error=false;
					}
				}else{
					if(GUI.Button(Rect(Screen.width/2-50,Screen.height/2+100,100,30),"Log in")){
						Scoreoid.main.checkPlayer();
						ready=true;
					}
				}
				if(ready){
					if(loadOk){
						Application.LoadLevel(1);
						ready=false;
					}
					if(error){
						ready=false;
					}
				}
			}
		}
		
	//Game GUI
	}else{
		var id:int;
		
		
		GUI.Label(Rect(10,10,200,100),"Resources "+Global.resources);
		GUI.Label(Rect(10,30,100,100),"Food "+Global.food+"/"+Global.maxFood);
		
		//Left context bar
		if(selectedBuilding){
			switch(selectedBuilding.type){
			case BuildingTypes.Base:
				if(!troopMenuShowing && !squadMenuShowing && !setScoutSquad){
					if (GUI.Button(Rect(10,70,100,30),"Upgrade")){
						//
					}
					if(!CooldownManager.main.checkCooldown("Recruit")){
						if(GUI.Button(Rect(10,120,100,30),"Recruit")){
							AddPeople(1);
							//print("people added");	
							var c = new Cooldown(0,0,Global.recruitCooldownTime,"Recruit");
						}
					}else{
						GUI.Button(Rect(10,120,100,30),CooldownManager.main.getTimeLeft("Recruit"));
					}  
				}
			break;
			
			case BuildingTypes.Vacant:
				if(!troopMenuShowing && !squadMenuShowing && !setScoutSquad){
					if (GUI.Button(Rect(10,70,150,30),"Convert to Housing")){
						selectedBuilding.ChangeType(BuildingTypes.Housing);
					}
					
					if (GUI.Button(Rect(10,120,150,30),"Convert to Production")){
						selectedBuilding.ChangeType(BuildingTypes.Production);
					}
				}
			break;
			 
			case BuildingTypes.Infested:
				if(!troopMenuShowing && !squadMenuShowing && !setScoutSquad){
					if (GUI.Button(Rect(10,70,100,30),"Take over")){
						squadSelectShowing=true;
						squadMenuShowing=true;
						SetCameraPanEnabled(false);
						SetMenuCameraEnabled(true);
						CreateSquadMenu();
						
					}
				}
			break;
			case BuildingTypes.Production:
			if(!troopMenuShowing && !squadMenuShowing && !setScoutSquad){
					if(GUI.Button(Rect(10,70,100,30),"Assign")){
						squadSelectShowing=true;
						squadMenuShowing=true;
						SetCameraPanEnabled(false);
						SetMenuCameraEnabled(true);
						CreateSquadMenu();
					}
				break;
				}
			}
		}
		
		//Top context bar
		if(!troopMenuShowing && !squadMenuShowing && !setScoutSquad){
			if(GUI.Button(Rect(Screen.width/2-100, 10,100,30),"Troops")){
				SetCameraPanEnabled(false);
				SetMenuCameraEnabled(true);
				CreatePeopleLabels();
				troopMenuShowing=true;
			}
		}
		
		if(!squadMenuShowing && !troopMenuShowing && !setScoutSquad){
			if(GUI.Button(Rect(Screen.width/2+50,10,100,30),"Squads")){
				SetCameraPanEnabled(false);
				SetMenuCameraEnabled(true);
				CreateSquadMenu();
				squadMenuShowing=true;
			
			}
		}
		if(!squadMenuShowing && !troopMenuShowing && !setScoutSquad){
			if(GUI.Button(Rect(Screen.width/2+150,10,100,30),"Scout Squad")){
				SetCameraPanEnabled(false);
				SetMenuCameraEnabled(true);
				CreateSquadMenu();
				setScoutSquad=true;
			}
		}
		
		if(troopMenuShowing){
			if(GUI.Button(Rect(Screen.width/2-50, 10,100,30),"City")){
				SetCameraPanEnabled(true);
				SetMenuCameraEnabled(false);
				DestroyPeopleLabels();
				DestroySquadLabels();
				troopMenuShowing=false;
			}
		}
		
		if(squadMenuShowing || setScoutSquad){
			if(GUI.Button(Rect(Screen.width/2-50, 10,100,30),"City")){
				SetCameraPanEnabled(true);
				SetMenuCameraEnabled(false);
				DestroySquadLabels();
				squadMenuShowing=false;
				squadSelectShowing=false;
				setScoutSquad=false;
			}
		}
		
		
		
		if(GUI.Button(Rect(Screen.width - 200,10,100,30),"Save")){ 
			SaveGame();
		}
	
		if(GUI.Button(Rect(Screen.width - 100,10,100,30),"Main Menu")){
			loadGame=false;
			newGame=false;
			Application.LoadLevel(0);
			Destroy(GameObject.Find("Scoreoid"));
		}
	}
 } 
 
//*********************************
//Gameplay Functions
//*********************************

function AttackBuilding(){
	if(!selectedBuilding){
		return;
	}
	if(!squadSelected){
		return;
	}
	
	CalculateSquadStatsInt(squadSelected);
	
	selectedBuilding.stats.values[Stats.hp] -= squads.list[squadSelected].attackRating;
	if(selectedBuilding.stats.values[Stats.hp]<0){
		selectedBuilding.stats.values[Stats.hp]=0;
	}
	for(var i=0; i<squads.list[squadSelected].num;i++){
		if(squads.list[squadSelected].people[i]!=null){
			var c = new Cooldown(0,0,Global.attackCooldownTime,squads.list[squadSelected].people[i]._name);
		}
	}
}

function AssignBuilding(){
	if(!selectedBuilding){
		return;
	}
	if(!squadSelected){
		return;
	}
	
	CalculateSquadStatsInt(squadSelected);
	
	selectedBuilding.people = squads.list[squadSelected].people;
}

function CalculateSquadStatsInt(index:int):int{
	var rating:int;
	var atk:int;
	var def:int;
	var rnd:int;
	var cook:int;
		for(var i=0;i<people.Count;i++){
			if(people[i].squad==index){
				if(!CooldownManager.main.checkCooldown(people[i]._name)){
					atk += people[i].stats.values[Stats.attack];
					def += people[i].stats.values[Stats.defense];
					rnd += people[i].stats.values[Stats.production];
					cook += people[i].stats.values[Stats.cooking];
					
					rating += people[i].stats.values[Stats.hp]+people[i].stats.values[Stats.attack]+people[i].stats.values[Stats.defense];
				}
			}
		}
	if(index==0){
		rating = 0;
		atk=0;
		def=0;
		rnd=0;
		cook=0;
	}
	
	squads.list[index].attackRating=atk;
	squads.list[index].defenseRating=def;
	squads.list[index].productionRating=rnd;
	squads.list[index].cookingRating=cook;
	return rating;
}

function SetSquadRole(squad:int):String{

	if(squad==0){
		return "No ";
	}

	var values:Array = new Array();
	
	
	values.Push(squads.list[squad].attackRating);
	values.Push(squads.list[squad].defenseRating);
	values.Push(squads.list[squad].productionRating);
	values.Push(squads.list[squad].cookingRating);
	
	var atk = values[0];
	var def = values[1];
	var rnd = values[2];
	var cook = values[3];
	values.Sort();
	values.Reverse();
	if(atk == values[0]){
		squads.list[squad].label._name.text = "Attack Squad " + Global.squads[squad];
		return;
	}
	if(def == values[0]){
		squads.list[squad].label._name.text = "Defense Squad " + Global.squads[squad];
		return;
	}
	if(rnd == values[0]){
		squads.list[squad].label._name.text = "Production Squad " + Global.squads[squad];
		return;
	}
	if(cook == values[0]){
		squads.list[squad].label._name.text = "Cooking Squad " + Global.squads[squad];
		return;
	}
	if(values[0]==0){
		squads.list[squad].label._name.text = "Vacant Squad " + Global.squads[squad];
		return;
	}
	
	

}
 
//*********************************
//Menu Creation and Destruction
//*********************************

function SetCameraPanEnabled(b:boolean){
	GameObject.Find("CameraPivot").GetComponent(DragPanner).enabled=b;
}

function SetMenuCameraEnabled(b:boolean){
	if(!b){
		GameObject.Find("Menu Camera").GetComponent.<Camera>().depth =-2;
	}else{
		GameObject.Find("Menu Camera").GetComponent.<Camera>().depth =1;
	}
}

function CreatePeopleLabels(){
	//print(people.Count);
	for(var i=0;i<people.Count;i++){
		var plane = Instantiate(personPlane,GameObject.Find("Menu Camera").transform.position,Quaternion.identity);
		plane.transform.parent = GameObject.Find("Menu Camera").transform;
		plane.transform.localPosition.z = 100;
		plane.transform.localPosition.y = 100*-i;
		plane.transform.eulerAngles = Vector3(90,0,0);
		plane.GetComponent(PersonPlane).index = i;
		var label = Instantiate(personLabel, transform.position,transform.rotation);
		label.GetComponent(ObjectLabel).target=plane.transform;
		label.LoadPerson(people[i]);
		label.name = people[i]._name+"Label";
		label.transform.parent = GameObject.Find("PeopleLabels").transform;
		//print("Created label");
		
		plane.GetComponent(PersonPlane).label=label.GetComponent(PersonLabel);
		plane.GetComponent(PersonPlane).p=label.GetComponent(PersonLabel).p;
		
		UpdateSquadLabels();
	}
}

function CreateSquadLabels(){
	PopulateSquads();
	for(var i=0;i<Global.squads.length;i++){
		var plane = Instantiate(personPlane,GameObject.Find("Menu Camera").transform.position,Quaternion.identity);
		plane.transform.parent = GameObject.Find("Menu Camera").transform;
		plane.transform.localPosition.x = 100;
		plane.transform.localPosition.z = 100;
		plane.transform.localPosition.y = 100*-i;
		plane.transform.eulerAngles = Vector3(90,0,0);
		plane.GetComponent(PersonPlane).index = i;
		plane.GetComponent(PersonPlane).sub = true;
		plane.tag="SquadPanel";
		
		var label = Instantiate(squadLabel, transform.position,transform.rotation);
		label.GetComponent(ObjectLabel).target=plane.transform;
		label.LoadSquad(i);
		label.name = label._name.text+" Label";
		label.transform.parent = GameObject.Find("SquadLabels").transform;
		
	}
	
	squadsShowing=true;
}
function CreateSquadMenu(){
	PopulateSquads();
	for(var i=0;i<Global.squads.length;i++){
		var plane = Instantiate(personPlane,GameObject.Find("Menu Camera").transform.position,Quaternion.identity);
		plane.transform.parent = GameObject.Find("Menu Camera").transform;
		plane.transform.localPosition.x = 0;
		plane.transform.localPosition.z = 100;
		plane.transform.localPosition.y = 100*-i;
		plane.transform.eulerAngles = Vector3(90,0,0);
		plane.GetComponent(PersonPlane).index = i;
		plane.GetComponent(PersonPlane).sub = true;
		plane.tag="SquadPanel";
		
		var label = Instantiate(squadLabel, transform.position,transform.rotation);
		label.GetComponent(ObjectLabel).target=plane.transform;
		label.LoadSquad(i);
		label.name = label._name.text+" Label";
		label.transform.parent = GameObject.Find("SquadLabels").transform;
		
	}
	
	squadMenuShowing=true;
}

function ShowSquadPopulation(){
	PopulateSquads();
	var p = squads.list[squadSelected].people;
	for(var i=0;i<p.length;i++){
		if(p[i]!=null){
			var plane = Instantiate(personPlane,GameObject.Find("Menu Camera").transform.position,Quaternion.identity);
			plane.transform.parent = GameObject.Find("Menu Camera").transform;
			plane.transform.localPosition.x = 100;
			plane.transform.localPosition.z =100;
			plane.transform.localPosition.y = 100*-i;
			plane.transform.eulerAngles = Vector3(90,0,0);
			plane.GetComponent(PersonPlane).sub=true;
			plane.GetComponent(PersonPlane).p = p[i];
			plane.tag="PersonPlane";
			
			var label = Instantiate(personLabel,transform.position,transform.rotation);
			label.GetComponent(ObjectLabel).target=plane.transform;
			label.GetComponent(PersonLabel).LoadPerson(p[i]);
			label.name = label._name.text+" Label";
			label.transform.parent = GameObject.Find("PeopleLabels").transform;
			squadPopulationShowing=true;
		}
	}
	squadPopulationShowing=true;
	UpdateSquadLabels();
}

function PauseSquadLabels(){
	var things = GameObject.FindGameObjectsWithTag("SquadPanel");
	for(var i=0;i<things.length;i++){
		if(things[i].GetComponent(GUIDragPanner)){
			things[i].GetComponent(GUIDragPanner).pause=true;
		}
	}
}

function SlideSquadLabels(){
	var things = GameObject.FindGameObjectsWithTag("SquadPanel");
	for(var i=0;i<things.length;i++){
		things[i].transform.localPosition.x -= 110;
	}
}

function ResetSquadLabels(){
	var things = GameObject.FindGameObjectsWithTag("SquadPanel");
	for(var i=0;i<things.length;i++){
		things[i].transform.localPosition.x =0;
		if(things[i].GetComponent(GUIDragPanner)){
			things[i].GetComponent(GUIDragPanner).pause=false;
		}
	}
}

function DestroyPopulationLabels(){
	var things = GameObject.FindGameObjectsWithTag("Person");
	for(var i=0;i<things.length;i++){
		Destroy(things[i]);
	}
	var things2 = GameObject.FindGameObjectsWithTag("PersonPlane");
	for(var j=0;j<things2.length;j++){
		Destroy(things2[j]);
	}
	squadPopulationShowing=false;

}

function CreateNotification(str:String){
	var plane : GameObject = new GameObject();
	plane.transform.position = GameObject.Find("Main Camera").transform.position;
	plane.transform.parent=GameObject.Find("Main Camera").transform;
	plane.transform.position = Camera.main.ViewportToWorldPoint(Vector3(.5,.3 +(.15*numNotifications),Camera.main.nearClipPlane));
	plane.AddComponent(NotificationPop);
	plane.GetComponent(NotificationPop).height = 10;
	plane.GetComponent(NotificationPop).pause =2;
	
	var label = Instantiate(notificationLabel, Vector3.zero,transform.rotation);
	label.GetComponent(ObjectLabel).target=plane.transform;
	label.GetComponent(NotificationLabel)._name.text = str;

	plane.GetComponent(NotificationPop).label=label.GetComponent(NotificationLabel);
	//plane.transform.parent= par.transform;
	//label.transform.parent=par.transform;
}


function UpdateSquadLabels(){
	var peeps = GameObject.FindGameObjectsWithTag("Person");
	for(var i=0;i<peeps.length;i++){
		if(peeps[i].GetComponent(PersonLabel)){
			var lbl = peeps[i].GetComponent(PersonLabel);
			lbl.squad.text=Global.squads[lbl.p.squad];
			
			if(CooldownManager.main.checkCooldown(lbl.p._name)){
				lbl.squad.text=CooldownManager.main.getTimeLeft(lbl.p._name);
			}
			
		}
	}
	
	PopulateSquads();
	
	var squads = GameObject.FindGameObjectsWithTag("SquadLabel");
	for(var j=0;j<squads.length;j++){
		if(squads[j].GetComponent(SquadLabel)){
			print("j="+j);
			squads[j].GetComponent(SquadLabel).LoadSquad(j);
		}
	}
}

function PopulateSquads(){
	for(var j=0;j<squads.list.length;j++){
		squads.list[j].name=Global.squads[j];
		squads.list[j].num=0;
		
		for(var i=0;i<people.Count;i++){
			if(people[i].squad == j){
				AddToSquad(j,people[i]);
				squads.list[j].num++;
				squads.list[j].rating = CalculateSquadStatsInt(j);
			}
		}
	}
}


function AddToSquad(squad:int,p:Person):boolean{
	for(var i=0;i<8;i++){
		if(squads.list[squad].people[i]==p){
			return false;
		}
		if(squads.list[squad].people[i]==null){
			squads.list[squad].people[i]=p;
			return true;
		}
	}
	return false;
}



function CalculateSquadStats(index:int):String{
	var str:String="blah";
	var rating:int;
		for(var i=0;i<people.Count;i++){
			if(people[i].squad==index){
				rating += people[i].stats.values[Stats.hp]+people[i].stats.values[Stats.attack]+people[i].stats.values[Stats.defense];
			
			}
		}
	if(index==0){
		str = "Rating: N/A";
	}
	str = "Rating: "+rating;
	return str;
}

function PausePeopleLabels(){
	var things = GameObject.FindGameObjectsWithTag("PersonPlane");
	for(var i=0;i<things.length;i++){
		if(things[i].GetComponent(GUIDragPanner)){
			things[i].GetComponent(GUIDragPanner).pause=true;
		}
	}
}

function SlidePeopleLables(){
	var things = GameObject.FindGameObjectsWithTag("PersonPlane");
	for(var i=0;i<things.length;i++){
		things[i].transform.localPosition.x -= 110;
	}
}

function ResetPeopleLabels(){
	var things = GameObject.FindGameObjectsWithTag("PersonPlane");
	for(var i=0;i<things.length;i++){
		things[i].transform.localPosition.x =0;
		if(things[i].GetComponent(GUIDragPanner)){
			things[i].GetComponent(GUIDragPanner).pause=false;
		}
	}
}


function DestroySquadLabels(){
	var things = GameObject.FindGameObjectsWithTag("SquadLabel");
	for(var i=0;i<things.length;i++){
		Destroy(things[i]);
	}
	
	things = GameObject.FindGameObjectsWithTag("SquadPanel");
	for( i=0;i<things.length;i++){
		Destroy(things[i]);
	}
	squadMenuShowing=false;
	squadsShowing=false;
}



function DestroyPeopleLabels(){
	var things = GameObject.FindGameObjectsWithTag("Person");
	for(var i=0;i<things.length;i++){
		Destroy(things[i]);
	}
	var things2 = GameObject.FindGameObjectsWithTag("PersonPlane");
	for(var j=0;j<things2.length;j++){
		Destroy(things2[j]);
	}
}

//**********************************************
//People and Building initialization
//**********************************************

function AddPeople(numPeeps:int){
	var counter:int=0;

	//Add people to the array
	for(var i:int=0;i<numPeeps;i++){
		if(people.Count<300){
			var p:Person  = RandomPerson();
			people.Add(p);
		}
	}	
	//print("people added");
}

function AddBuilding(b:Building){

	for(var i=0;i<buildings.length;i++){
		if(buildings[i]==null){
			buildings[i]=b;
			return;
		}
	}
}

function CreateChunks(){
	var id:int=0;
	for(var i=0;i<citySize.rows;i++){
		for(var j=0;j<citySize.cols;j++){
			var c = Instantiate(chunk,Vector3(j*200,0,i*200),Quaternion.identity);
			c.name = "Chunk"+id;
			chunkArr[id]=c;
			id++;
			c.transform.parent = GameObject.Find("Chunks").transform;
		}
	}
}
 
function RandomPerson():Person{
	var p = Instantiate(personPrefab,transform.position,transform.rotation);
	p.GetComponent(Person).Initialize();
	return p;
}

function RandomBuildingType(){

	var type:int = UnityEngine.Random.Range(0,buildingTypes.length);
	return buildingTypes[type];
}

function GetBuildingName(){

	var s:int= UnityEngine.Random.Range(0,bNames.prefix.length);
	var p:int= UnityEngine.Random.Range(0,bNames.suffix.length);
	var str:String = (bNames.prefix[s]+" "+bNames.suffix[p]); 
	return str;
	
}


function GetPersonName(){
	var s:int= UnityEngine.Random.Range(0,pNames.prefix.length);
	var p:int= UnityEngine.Random.Range(0,pNames.suffix.length);
	
	var str:String = (pNames.prefix[s]+" "+pNames.suffix[p]); 
	return str;
}

function SetRandomPersonStats(s:Stats){
		
		s.values[Stats.hp] = 100;
		s.values[Stats.maxHp] = 100;
		//s.values[Stats.hunger] = 100; 
		
	for(var i:int=2;i<s.values.length-1;i++){
		s.values[i] = UnityEngine.Random.value*100;
	}
}


function UpgradeStats(s:Stats[],num:int){
	for(var i:int=0;i<s.length;i++){
		for(var j:int=2;j<s[i].values.length-1;i++){
			s[i].values[j] +=num;
			if(s[i].values[j]>100){
				s[i].values[j]=100;
			}
		}
	}
}


//**********************************************
//Saving and Loading
//**********************************************

function SaveBuildings(){
	for(var i=0;i<buildings.length;i++){
		if(buildings[i]!=null){
			Global.buildingData.posX[i] = buildings[i].transform.position.x;
			Global.buildingData.posY[i] = buildings[i].transform.position.y;
			Global.buildingData.posZ[i] = buildings[i].transform.position.z;
			Global.buildingData.name[i] = buildings[i]._name;
			Global.buildingData.type[i] = buildings[i].type;
			Global.buildingData.modelType[i] = buildings[i].modelType;
			Global.buildingData.id[i] = buildings[i].id;
		}
	}
}

function LoadBuildings(){
	for(var i=0;i<buildings.length;i++){
		if(Global.buildingData.posX[i]!=0){
			var b:Building = Instantiate(buildingTypes[Global.buildingData.modelType[i]],
											Vector3(Global.buildingData.posX[i],
													Global.buildingData.posY[i],
													Global.buildingData.posZ[i]),
											Quaternion.identity);
			b._name = Global.buildingData.name[i];
			b.type = Global.buildingData.type[i];
			b.modelType = Global.buildingData.modelType[i];
			b.id = Global.buildingData.id[i];
			b.name = b._name+b.id;
			b.transform.parent=GameObject.Find("Buildings").transform;
			AddBuilding(b);
		}
	}
}

function LoadPeople(){
	for(var i=0;i<Global.peopleData.name.length;i++){
		if(Global.peopleData.name[i]!=null){
			var p:Person = Instantiate(personPrefab,transform.position,transform.rotation);
			p._name = Global.peopleData.name[i];
			p.squad = Global.peopleData.squad[i];
			p.building = Global.peopleData.building[i];
			p.stats.values[Stats.hp]=Global.peopleData.hp[i];
			p.stats.values[Stats.maxHp]=Global.peopleData.maxHp[i];
			p.stats.values[Stats.attack]=Global.peopleData.attack[i];
			p.stats.values[Stats.defense]=Global.peopleData.defense[i];
			p.stats.values[Stats.production]=Global.peopleData.production[i];
			p.stats.values[Stats.cooking]=Global.peopleData.cooking[i];
		//	p.stats.values[Stats.hunger]=Global.peopleData.hunger[i];
			p.transform.parent= GameObject.Find("People").transform;
			p.name=p._name;
			people.Add(p);
		}
	}
}

function LoadCooldowns(){
	for(var i=0;i<Global.cooldownData.cooldowns.length;i++){
		if(Global.cooldownData.cooldowns[i]!=null){
			CooldownManager.main.cooldowns.Add(Global.cooldownData.cooldowns[i]);
//			print("cooldown loaded");
		}
	}

}

function SavePeople(){
	for(var i=0;i<people.Count;i++){
		if(people[i]!=null){
			Global.peopleData.name[i] = people[i]._name;
			Global.peopleData.squad[i] = people[i].squad;
			Global.peopleData.building[i] = people[i].building;
			Global.peopleData.hp[i] = people[i].stats.values[Stats.hp];
			Global.peopleData.maxHp[i]= people[i].stats.values[Stats.maxHp];
			Global.peopleData.attack[i] = people[i].stats.values[Stats.attack];
			Global.peopleData.defense[i] = people[i].stats.values[Stats.defense];
			Global.peopleData.production[i] = people[i].stats.values[Stats.production];
			Global.peopleData.cooking[i] = people[i].stats.values[Stats.cooking];
			//Global.peopleData.hunger[i] = people[i].stats.values[Stats.hunger];
		}
	}
}

function SaveCooldowns(){
	for(var i=0;i<CooldownManager.main.cooldowns.Count;i++){
		Global.cooldownData.cooldowns[i] = CooldownManager.main.cooldowns[i];
	}

}

function SaveScoutSquad(){
	Global.scoutSquadInt = scoutSquadInt;
}

function LoadScoutSquad(){
	scoutSquadInt = Global.scoutSquadInt;
}



function PopulateLocalFromGlobal(){
	for(var i=0;i<Global.buildingData.posX.length;i++){
		myData.user.posX[i] = Global.buildingData.posX[i];
		myData.user.posY[i] = Global.buildingData.posY[i];
		myData.user.posZ[i] = Global.buildingData.posZ[i];
		myData.user.bName[i] = Global.buildingData.name[i];
		myData.user.type[i] = Global.buildingData.type[i];
		myData.user.modelType[i] = Global.buildingData.modelType[i];
		myData.user.id[i] = Global.buildingData.id[i];
		
		myData.user.cooldowns[i] = Global.cooldownData.cooldowns[i];
	}
	
	for(var ii=0;ii<Global.peopleData.name.length;ii++){
		myData.user.pName[ii] = Global.peopleData.name[ii];
		myData.user.squad[ii] = Global.peopleData.squad[ii];
		myData.user.building[ii] = Global.peopleData.building[ii];
		myData.user.hp[ii] = Global.peopleData.hp[ii];
		myData.user.maxHp[ii] = Global.peopleData.maxHp[ii];
		myData.user.attack[ii] = Global.peopleData.attack[ii];
		myData.user.defense[ii] = Global.peopleData.defense[ii];
		myData.user.production[ii] = Global.peopleData.production[ii];
		myData.user.cooking[ii] = Global.peopleData.cooking[ii];
		//myData.user.hunger[ii] = Global.peopleData.hunger[ii];
	}
	
	myData.user.scoutSquadInt = Global.scoutSquadInt;
	myData.user.resources = Global.resources;
	myData.user.food = Global.food;
}

function PopulateGlobalFromLocal(){

	for(var i=0;i<Global.buildingData.posX.length;i++){
		Global.buildingData.posX[i] = myData.user.posX[i];
		Global.buildingData.posY[i] = myData.user.posY[i];
		Global.buildingData.posZ[i] = myData.user.posZ[i];
		Global.buildingData.name[i] = myData.user.bName[i];
		Global.buildingData.type[i] = myData.user.type[i];
		Global.buildingData.modelType[i] = myData.user.modelType[i];
		Global.buildingData.id[i] = myData.user.id[i];
		Global.cooldownData.cooldowns[i] = myData.user.cooldowns[i];
	}
	
	for(var ii=0;ii<Global.peopleData.name.length;ii++){
		Global.peopleData.name[ii] = myData.user.pName[ii];
		Global.peopleData.squad[ii] = myData.user.squad[ii];
		Global.peopleData.building[ii] = myData.user.building[ii];
		Global.peopleData.hp[ii] = myData.user.hp[ii];
		Global.peopleData.maxHp[ii] = myData.user.maxHp[ii];
		Global.peopleData.attack[ii] = myData.user.attack[ii];
		Global.peopleData.defense[ii] = myData.user.defense[ii];
		Global.peopleData.production[ii] = myData.user.production[ii];
		Global.peopleData.cooking[ii] = myData.user.cooking[ii];
		//Global.peopleData.hunger[ii] = myData.user.hunger[ii];
	}
	
	Global.scoutSquadInt= myData.user.scoutSquadInt;
	Global.resources = myData.user.resources;
	Global.food = myData.user.food;
	
}


function UTF8ByteArrayToString(characters : byte[] ){
	var encoding : UTF8Encoding = new UTF8Encoding();
	var constructedString : String = encoding.GetString(characters);
	return (constructedString);

}

function StringToUTF8ByteArray(pXmlString : String){
	var encoding :UTF8Encoding = new UTF8Encoding();
	var byteArray: byte[] = encoding.GetBytes(pXmlString);
	return byteArray;
}

function SerializeObject(pObject : Object){

	var XmlizedString : String = null;
	var memoryStream : MemoryStream = new MemoryStream();
	var xs : XmlSerializer = new XmlSerializer(typeof(myData));
	var xmlTextWriter : XmlTextWriter = new XmlTextWriter(memoryStream, Encoding.UTF8);
	xs.Serialize(xmlTextWriter, pObject);
	memoryStream = xmlTextWriter.BaseStream;
	XmlizedString = UTF8ByteArrayToString(memoryStream.ToArray());
	return XmlizedString;
	
}


function DeserializeObject(pXmlizedString : String)   {
   
	var xmlStr:String="";
   if(pXmlizedString.Contains("<?xml version=\"1.0\" encoding=\"UTF-8\"?>")){
		xmlStr = pXmlizedString.Replace("<?xml version=\"1.0\" encoding=\"UTF-8\"?>","");
   }
   if(xmlStr.Contains("<inventory>")){
	   xmlStr = xmlStr.Replace("<inventory>","");
   }
    if(xmlStr.Contains("</inventory>")){
	   xmlStr = xmlStr.Replace("</inventory>","");
   }
   
 
	xmlStr = xmlStr.Replace("&gt;",">");
	xmlStr = xmlStr.Replace("&lt;","<"); 
	xmlStr = xmlStr.Substring(1);
   
   var xs : XmlSerializer  = new XmlSerializer(typeof(myData));
   var memoryStream : MemoryStream  = new MemoryStream(StringToUTF8ByteArray(xmlStr));
   var xmlTextWriter : XmlTextWriter  = new XmlTextWriter(memoryStream, Encoding.UTF8);
   return xs.Deserialize(memoryStream);
}


	function CreateXML(){
	
	#if UNITY_WEBPLAYER
   return;
	#endif

	#if UNITY_ANDROID
	 var writer : StreamWriter;
	   var t : FileInfo = new FileInfo(fileLocation+"/"+ fileName);
	   if(!t.Exists)
	   {
		  writer = t.CreateText();
	   }
	   else
	   {

		  t.Delete();

		  writer = t.CreateText();
	   }
	   writer.Write(data);
	   writer.Close();
	   Debug.Log("File written.");
	#endif
}
 
function LoadXML(){
   var r : StreamReader = File.OpenText(fileLocation+"/"+ fileName);
  // print("File found");
   var _info : String = r.ReadToEnd();
   r.Close();
   data=_info;
   Debug.Log("File Read");
}

function PopulateLocalFromXML(){
	if(data.ToString() != ""){
		var d : UserData = DeserializeObject(data);
		for(var i=0;i<myData.user.posX.length;i++){
			myData.user.posX[i] = d.user.posX[i];
			myData.user.posY[i] = d.user.posY[i];
			myData.user.posZ[i] = d.user.posZ[i];
			myData.user.bName[i] = d.user.bName[i];
			myData.user.type[i] = d.user.type[i];
			myData.user.modelType[i] = d.user.modelType[i];
			myData.user.id[i] = d.user.id[i];
			myData.user.cooldowns[i] = d.user.cooldowns[i];
		}
		for(var j=0;j<myData.user.pName.length;j++){
			myData.user.pName[j] = d.user.pName[j];
			myData.user.squad[j] = d.user.squad[j];
			myData.user.building[j] = d.user.building[j];
			myData.user.hp[j] = d.user.hp[j];
			myData.user.maxHp[j] = d.user.maxHp[j];
			myData.user.attack[j] = d.user.attack[j];
			myData.user.defense[j] = d.user.defense[j];
			myData.user.production[j] = d.user.production[j];
			myData.user.cooking[j] = d.user.cooking[j];
			//myData.user.hunger[j] = d.user.hunger[j];
		}
		myData.user.resources = d.user.resources;
		myData.user.food = d.user.food;
		myData.user.scoutSquadInt = d.user.scoutSquadInt;
	}
}

//**********************************************
//Data-storage classes
//**********************************************

class UserData{

	public var user: SaveData = new SaveData();
	
	function UserData(){}

}

class SaveData{
		
		  var user:String;
		  var pass:String;

		  var resources:int;
		  var food:int;
		  
		  var posX:float[]=new float[100];
		  var posY:float[]=new float[100];
		  var posZ:float[]=new float[100];
		  var bName:String[]=new String[100];
		  var type:int[]=new int[100];
		  var modelType:int[]=new int[100];
		  var id:int[]=new int[100];
	
	
		  var pName:String[]=new String[300];
		  var hp:int[] = new int[300];
		  var squad:int[] = new int[300];
		  var building:String[] = new String[300];
		  var maxHp:int[] = new int[300];
		  var attack:int[] = new int[300];
		  var defense:int[] = new int[300];
		  var production:int[] = new int[300];
		  var cooking:int[] = new int[300];
		  //var hunger:int[] = new int[300];
	
		  var cooldowns:Cooldown[] = new Cooldown[100];
		  var scoutSquadInt:int;
}


class CitySize{
	var rows:int;
	var cols:int;
}

class BuildingNames{
	var prefix: String[];
	var suffix: String[];
}
class PersonNames{
	var prefix:String[];
	var suffix:String[];
}

class Squads{
	var list:Squad[] = new Squad[26];
}

class Squad{
	var name:String;
	var num:int;
	var people:Person[] = new Person[8];
	var label:SquadLabel;
	var rating:int;
	var attackRating:int;
	var defenseRating:int;
	var productionRating:int;
	var cookingRating:int;
}