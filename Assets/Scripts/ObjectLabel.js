var target : Transform;		// Object that this label should follow
var offset = Vector3.up;	// Units in world space to offset; 1 unit above object by default
var useMainCamera = true;	// Use the camera tagged MainCamera
var cameraToUse : Camera;	// Only use this if useMainCamera is false
private var cam : Camera;
private var thisTransform : Transform;
private var camTransform : Transform;
function Start () {
	thisTransform = transform;
	if (useMainCamera)
		cam = Camera.main;
	else
		cam = GameObject.Find("Menu Camera").GetComponent.<Camera>();
	camTransform = cam.transform;
	transform.localScale *=.005;
	
}
 
function Update () {
	if(target){thisTransform.position = cam.WorldToViewportPoint(target.position + offset);}
}
 
