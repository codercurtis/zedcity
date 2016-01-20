using UnityEngine;
using System.Collections;

public class ObjectLabel : MonoBehaviour {

	public Transform target;		// Object that this label should follow
	public Vector3 offset;	// Units in world space to offset
	bool useMainCamera = true;	// Use the camera tagged MainCamera
	Camera cameraToUse; // Only use this if useMainCamera is false
	private Camera cam;
	private Transform thisTransform;
	private Transform camTransform;

	void Start () {
		thisTransform = transform;
		if (useMainCamera){
			cam = Camera.main;
		}else{
			cam = GameObject.Find("Menu Camera").GetComponent<Camera>();
			//camTransform = cam.transform;
			transform.localScale *=.005f;
		}
	}
	 
	void Update () {
		if(target){thisTransform.position = cam.WorldToViewportPoint(target.position + offset);}
	}
	
}
	 
