using UnityEngine;
using System.Collections;

public class CameraController : MonoBehaviour {

	Vector2 mouseAbsolute;
	Vector2 smoothMouse;
	
	
	public Vector2 clampInDegrees = new Vector2 (360,180);
	public bool lockCursor;
	public Vector2 sensitivity = new Vector2 (2,2);
	public Vector2 smoothing = new Vector2(3,3);
	
	public Vector2 targetDirection;
	
	public float movSpeed;

		 
	void Start(){
		targetDirection = transform.localRotation.eulerAngles;
	}
	
	void Update () {
	
		if(Input.GetButton("Fire3")){
			Master.instance.cameraState = Master.CameraMode.frozen;
		}else{
			Master.instance.cameraState = Master.CameraMode.freelook;
		}
		
		switch (Master.instance.cameraState){ 
			case Master.CameraMode.freelook:
				Cursor.visible = false;
				Cursor.lockState = CursorLockMode.Locked;
				Move();
			break;
			
			case Master.CameraMode.frozen:
				Cursor.visible = true; 
				Cursor.lockState = CursorLockMode.None;
			break;
		}

	}
	
	void Move(){
	
		//mostly http://forum.unity3d.com/threads/combined-camera-movement-and-mouse-look-script.283290/
		//Rotation
		var targetOrientation = Quaternion.Euler(targetDirection);
		
		var mouseDelta = new Vector2(Input.GetAxisRaw("Mouse X"),Input.GetAxisRaw("Mouse Y"));
		
		mouseDelta = Vector2.Scale (mouseDelta, new Vector2(sensitivity.x * smoothing.x, sensitivity.y * smoothing.y));
		
		smoothMouse.x = Mathf.Lerp(smoothMouse.x, mouseDelta.x, 1f / smoothing.x);
		smoothMouse.y = Mathf.Lerp(smoothMouse.y, mouseDelta.y, 1f / smoothing.y);
		
		mouseAbsolute += smoothMouse;
		
		if(clampInDegrees.x < 360){
			mouseAbsolute.x = Mathf.Clamp(mouseAbsolute.x,-clampInDegrees.x *0.5f,clampInDegrees.x * 0.5f);
		}

		var xRotation = Quaternion.AngleAxis(-mouseAbsolute.y, targetOrientation * Vector3.right);
		transform.localRotation = xRotation;
		
		if(clampInDegrees.y < 360){
			mouseAbsolute.y = Mathf.Clamp(mouseAbsolute.y,-clampInDegrees.y *0.5f,clampInDegrees.y * 0.5f);
		}
		
		transform.localRotation *= targetOrientation;
		
		var yRotation = Quaternion.AngleAxis(mouseAbsolute.x,transform.InverseTransformDirection(Vector3.up));
		transform.localRotation *= yRotation;
		
		//Movement
		
		transform.position += transform.forward * Input.GetAxis("Vertical") * Time.deltaTime * movSpeed;
		transform.position += transform.right * Input.GetAxis("Horizontal") * Time.deltaTime * movSpeed;
	
	}
}
