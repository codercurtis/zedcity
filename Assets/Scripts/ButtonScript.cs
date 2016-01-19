using UnityEngine;
using System.Collections;
using System.Reflection;

public class ButtonScript : MonoBehaviour {

	bool active;
	bool visible;
	
	public GameObject buttonObj;
	
	// Use this for initialization
	void Start () {
		buttonObj = new GameObject();
		buttonObj.name = "Button Object";
		buttonObj.transform.parent = transform;
		buttonObj.transform.localPosition = new Vector3(0,0,0);
	}
	
	// Update is called once per frame
	void Update () {
		buttonObj.transform.rotation = Camera.main.transform.rotation;
	}
}
