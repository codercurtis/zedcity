using UnityEngine;
using System.Collections;

public class MouseClick : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
		if(Input.GetMouseButtonDown(0)){
			if(Master.instance.cameraState  == Master.CameraMode.frozen){
				RaycastHit hit;
				Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
				if(Physics.Raycast(ray, out hit)){
					Debug.Log(hit.collider.gameObject.name);
				}
			}
		}
	}
}
