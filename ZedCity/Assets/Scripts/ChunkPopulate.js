#pragma strict
var chunkSlot:GameObject[];
static var buildId:int=0;
static var assignedBase:boolean;
function Start () {
	var id:int=0;
	chunkSlot = new GameObject[4];
	for(var i:int =0;i<2;i++){
		for(var j:int=0;j<2;j++){
		
			chunkSlot[id] = new GameObject("Slot"+(id+1));
			chunkSlot[id].transform.position = (Vector3((transform.position.x + (50))+(j*100),0,(transform.position.z+ (50))+(i*100)));
			chunkSlot[id].transform.parent=transform;
			if(Daemon.main.newGame){
				CreateRandomBuildings(id);
			}
			id++;
		}
	}
	
}

function OnDrawGizmos(){
	Gizmos.color=Color.green;
	for(var i:int =0;i<2;i++){
		for(var j:int=0;j<2;j++){
			//Gizmos.DrawCube(Vector3((transform.position.x + (50))+(j*100),0,(transform.position.z+ (50))+(i*100)),Vector3(50,10,50));
		}
	}
}

function CreateRandomBuildings(index:int){
		if(Random.Range(1,3)==1){
			var b = Instantiate(Daemon.main.RandomBuildingType(),chunkSlot[index].transform.position,Quaternion.identity);
			b.transform.position.y += b.transform.localScale.y/2;
			b._name=Daemon.main.GetBuildingName();
			b.name=b._name+buildId;

			//assign a building type;
			if(!assignedBase){
				b.GetComponent(Building).type=BuildingTypes.Base;
				assignedBase=true;
				b.GetComponent(Building)._name="HQ";
				b.name=b._name+buildId;

			}else{
				if(Random.Range(1,3)==1){
					b.GetComponent(Building).type=BuildingTypes.Vacant;
				}else{
					b.GetComponent(Building).type=BuildingTypes.Infested;
				}
			}
			
			Daemon.main.AddBuilding(b.GetComponent(Building));
			buildId++;
			}else{
				Daemon.main.openSlots.Push(chunkSlot[index]);
			}
		
}