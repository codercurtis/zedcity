using UnityEngine;
using System.Collections;
using System; 
using System.Reflection;


public class BuildingScript : MonoBehaviour {

	public GameObject building;
	public enum BuildingMode {hq = 0,zombie = 1,neutral = 2};
	public BuildingMode _mode;
	public GameObject labelHolder;

	
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
	
		GameObject buildingType = RandomBuilding();
		building = GameObject.Instantiate(buildingType,new Vector3(transform.position.x,buildingType.transform.localScale.y/2f,transform.position.z),Quaternion.identity) as GameObject;
		building.transform.parent = transform;
		BoxCollider bc = gameObject.AddComponent<BoxCollider>() as BoxCollider;
		bc.size = building.transform.localScale;
		bc.center = new Vector3(0,buildingType.transform.localScale.y/2f,0);
		
		//The building may not have been ready on initial assignment of mode
		this.mode = mode;
		
		//Create label objects
		labelHolder = new GameObject();
		labelHolder.transform.position = new Vector3(transform.position.x,building.transform.localScale.y,transform.position.z);
		labelHolder.AddComponent<FaceCamera>();
		labelHolder.transform.parent = building.transform;
		labelHolder.name = "label";
		
		TextMesh mesh = labelHolder.AddComponent<TextMesh>();
		mesh.anchor = TextAnchor.MiddleCenter;
		mesh.text = "Hello World";
		mesh.characterSize = 1;
		labelHolder.SetActive(false);
	} 
	
	GameObject RandomBuilding(){
		return Master.instance.bTypes[UnityEngine.Random.Range(0,Master.instance.bTypes.Length-1)];
	}
	
	public static BuildingMode RandomMode(){
		return (BuildingMode)(UnityEngine.Random.Range(1,Enum.GetNames(typeof(BuildingMode)).Length));
	}
	
	public void  OnMouseEnter(){
		if(Master.instance.cameraState == Master.CameraMode.frozen){
			labelHolder.SetActive(true);
		}
	}
	
	public void OnMouseExit(){
		labelHolder.SetActive(false);
	}
}
