using UnityEngine;
using System.Collections;
using System; 
using System.Reflection;


public class BuildingScript : MonoBehaviour {

	public GameObject building;
	public enum BuildingMode {hq = 0,zombie = 1,neutral = 2};
	public BuildingMode _mode;
	public GameObject label;
	public Stats _stats = new Stats();

	
	public BuildingMode mode
	{
		get {return _mode;}
		set {
			switch (value){
				case BuildingMode.hq:
					if(building){
						building.GetComponent<Renderer>().material.color = Color.blue;
					}
					_mode = value;
				break;
				
				case BuildingMode.zombie:
					if(building){
						building.GetComponent<Renderer>().material.color = Color.green;
					}
					_mode = value;
				break;
				
				case BuildingMode.neutral:
					if(building){
						building.GetComponent<Renderer>().material.color = Color.grey;
					}
					_mode = value;
				break;
			}
		}
	}
	
	void Start () { 
		label = GameObject.Find("Label");
		GameObject buildingType = RandomBuilding();
		building = GameObject.Instantiate(buildingType,new Vector3(transform.position.x,buildingType.transform.localScale.y/2f,transform.position.z),Quaternion.identity) as GameObject;
		building.transform.parent = transform;
		BoxCollider bc = gameObject.AddComponent<BoxCollider>() as BoxCollider;
		bc.size = building.transform.localScale;
		bc.center = new Vector3(0,buildingType.transform.localScale.y/2f,0);
		
		
		//The building may not have been ready on initial assignment of mode
		this.mode = mode;
		
	} 
	
	GameObject RandomBuilding(){
		return Master.instance.bTypes[UnityEngine.Random.Range(0,Master.instance.bTypes.Length-1)];
	}
	
	public static BuildingMode RandomMode(){
		return (BuildingMode)(UnityEngine.Random.Range(1,Enum.GetNames(typeof(BuildingMode)).Length));
	}
	
	private string RandomName(){
		return "";
	}
	
	public void  OnMouseEnter(){
		if(Master.instance.cameraState == Master.CameraMode.frozen){
			var labelScript = label.GetComponent<ObjectLabel>();
			labelScript.target = gameObject.transform;
			label.GetComponent<GUIText>().text = _stats.name;
		}
	}
	
	public void OnMouseExit(){
		
	}
}
