using UnityEngine;
using System.Collections;
using System;
using System.Reflection;

public class Master : MonoBehaviour {

	private static Master s_instance = null;
	public int gridSize = 5;
	public GameObject[] bTypes;
	
	public GameObject rootBuildingObj;
	public GameObject buttonObj;
	public enum CameraMode {freelook, frozen};
	public enum GameState {game,menu};
	private GameState _gameState;
	public CameraMode cameraState;
	public GameObject hq;
	
	public string[] buildingNamePrefixes;
	public string[] buildingNameSuffixes;
	



	//http://wiki.unity3d.com/index.php/AManagerClass
	public static Master instance {
		get{
			if(s_instance == null){
				s_instance = FindObjectOfType(typeof(Master)) as Master;
			}
			
			if(s_instance == null){
				GameObject obj = new GameObject("Master");
				s_instance = obj.AddComponent(typeof(Master)) as Master;
				Debug.Log("Manager created");
			}
			
			return s_instance;
		}
	}
		
	void OnApplicationQuit() {
        s_instance = null;
    }
	
	void Awake(){
		 DontDestroyOnLoad(instance);
	}
	
	void Start(){
		//create buildings
		for(var i=0;i<gridSize;i++){
			for(var j=0;j<gridSize;j++){
				//first building setup
				if(i==0 && j==0){
					hq = GameObject.Instantiate(rootBuildingObj,new Vector3((i+1)*25,0,(j+1)*25),Quaternion.identity) as GameObject;
					hq.GetComponent<BuildingScript>().mode = BuildingScript.BuildingMode.hq;
					hq.GetComponent<BuildingScript>()._stats.name = "HQ";
				}else{
					var build = GameObject.Instantiate(rootBuildingObj,new Vector3((i+1)*25,0,(j+1)*25),Quaternion.identity) as GameObject;
					build.GetComponent<BuildingScript>().mode = BuildingScript.RandomMode();
					build.GetComponent<BuildingScript>()._stats.name = RandomBuildingName();
				}
			}
		}
	}
	
	public string RandomBuildingName(){
		string name = "";
		name += buildingNamePrefixes[UnityEngine.Random.Range(0,buildingNamePrefixes.Length)];
		name += " ";
		name += buildingNameSuffixes[UnityEngine.Random.Range(0,buildingNameSuffixes.Length)];
		return name;
	}
	
	
	public GameState gameState
	{
		get {return _gameState;}
		set {
			switch(value){
				case GameState.game:
					DeleteMenus();
					GameObject.Find("Menu Camera").GetComponent<Camera>().depth = -2;
					_gameState = value;
				break;
				
				case GameState.menu:
					GameObject.Find("Menu Camera").GetComponent<Camera>().depth = 1;
					CreateMenu();
					cameraState = CameraMode.frozen;
					_gameState = value;
				break;
				default:
					_gameState = value;
				break;
			}
		}
	}
	
	public void CreateMenu(){
		var menuCam = GameObject.Find("Menu Camera");
		var menu = GameObject.Instantiate(buttonObj,
			menuCam.transform.position + menuCam.transform.forward*3,
			Quaternion.Euler(270, 0, 0)
		) as GameObject;
		menu.tag = "UI";
	}
	
	public void DeleteMenus(){
		var menus = GameObject.FindGameObjectsWithTag("UI");
		foreach(GameObject menu in menus){
			Destroy(menu);
		}
	}
}