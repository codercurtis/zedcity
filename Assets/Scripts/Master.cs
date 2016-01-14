using UnityEngine;
using System.Collections;

public class Master : MonoBehaviour {

	private static Master s_instance = null;
	public int gridSize = 5;
	public GameObject[] bTypes;
	
	public GameObject rootBuildingObj;
	public enum CameraMode {freelook, frozen};
	public CameraMode cameraState;


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
		for(var i=0;i<gridSize;i++){
			for(var j=0;j<gridSize;j++){
				GameObject.Instantiate(rootBuildingObj,new Vector3((i+1)*25,0,(j+1)*25),Quaternion.identity);
			}
		}
	}
}