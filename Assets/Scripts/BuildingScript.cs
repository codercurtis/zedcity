using UnityEngine;
using System.Collections;

public class BuildingScript : MonoBehaviour {

	public GameObject building;
	private GameObject _building;
	
	void Start () {
		building = Master.instance.bTypes[RandomBuilding()]; 
		_building = GameObject.Instantiate(building,new Vector3(transform.position.x,building.transform.localScale.y/2f,transform.position.z),Quaternion.identity) as GameObject;
		_building.transform.parent = transform;
	}
	
	int RandomBuilding(){
		return Random.Range(0,3);
	}
}
