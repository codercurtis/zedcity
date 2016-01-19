using UnityEngine;
using System.Collections;

public class MouseClick : MonoBehaviour {

	GameObject selectedObject;
	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		//click
		if(Input.GetMouseButtonDown(0)){
			if(Master.instance.cameraState == Master.CameraMode.frozen){
				RaycastHit hit;
				Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
				if(Physics.Raycast(ray, out hit)){
					if(hit.collider.gameObject.tag == "Building"){
						//open a menu or something
					}
				}
			}
		}
	}
}
