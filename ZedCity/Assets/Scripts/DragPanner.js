#pragma strict

var _enabled:boolean;
var pos:Vector2; //Finger position. One of two that we use to measure the direction we should go.
var pos2:Vector2; 
var zPos1:Vector2; //Finger position for zooming
var zPos2:Vector2;
var zPos3:Vector2;
var zPos4:Vector2;
var framewait:int;
var dampening:float;
var mov:Vector2;
var maxX:float;
var minX:float;
var speed:float;
var zoom:Vector2;
var distance:float;
var distance2:float;
var hitInfo:RaycastHit;
var web:boolean;
var editor:boolean;
var android:boolean;

function Start(){

#if UNITY_WEBPLAYER
	web=true;
#endif

#if UNITY_EDITOR
	editor=true;
#endif

#if UNITY_ANDROID
	android=true;
#endif

}
function Update () {

	
	//Select Buildings
	for(var t :Touch in Input.touches){
		var ray = Camera.main.ScreenPointToRay(t.position);
		Physics.Raycast(ray.origin, ray.direction*200,hitInfo,Mathf.Infinity); 
		if(hitInfo.transform!=null){
			if(hitInfo.transform.gameObject.tag=="Building"){
				if(_enabled){
					hitInfo.transform.gameObject.GetComponent(Building).Select();
				}
			}
		}
	}
#if UNITY_WEBPLAYER
	//Mouse Select
	if(Input.GetMouseButtonDown(0)){
		var ray2 = Camera.main.ScreenPointToRay(Input.mousePosition);
		Physics.Raycast(ray2.origin, ray2.direction*200,hitInfo,Mathf.Infinity); 
		if(hitInfo.transform!=null){
			if(hitInfo.transform.gameObject.tag=="Building"){
				if(_enabled){
					hitInfo.transform.gameObject.GetComponent(Building).Select();
				}
			}
		}
	}
#endif


	//Drag touch
	if(Input.touchCount==1){
		if(framewait==0){
			pos = Input.GetTouch(0).position;
			framewait = 2;
			//print("pos set");
		}
	}
#if UNITY_WEBPLAYER
	//Mouse drag
	if(Input.GetMouseButton(0)){
		if(framewait==0){
			//print("doing drag");
			pos = Input.mousePosition;
			framewait = 2;
			//print("pos set");
		}	
	}
#endif
	//Zoom
	if(Input.touchCount==2){
		if(framewait==0){
			zPos1 = Input.GetTouch(0).position;
			zPos2 = Input.GetTouch(1).position;
			distance = Vector2.Distance(zPos1,zPos2);
			framewait = 2;
		}
	}
#if UNITY_WEBPLAYER
	//Mouse zoom
	if(Input.GetAxis("Mouse ScrollWheel")){
		zoom.y = Input.GetAxis("Mouse ScrollWheel") * 30;
	}
#endif 
	if(framewait>0){
		framewait--;
	}
	//Zoom 2
	if(framewait==0){
		if(Input.touchCount==2){
			if(Input.GetTouch(0).phase == TouchPhase.Moved){
				zPos1 = Input.GetTouch(0).position;
				zPos2 = Input.GetTouch(1).position;
				
				distance2 = Vector2.Distance(zPos1,zPos2);

				var z:float= (distance - distance2);
				print("distance" +z);
				
				
				zoom.y = (z * (speed));
				print("zoom y"+zoom.y);
			}
		}
	}
	
	//Drag 2
	if(framewait==0){
		if(Input.touchCount==1){
			if(Input.GetTouch(0).phase == TouchPhase.Moved){
				pos2 = Input.GetTouch(0).position;
				mov = ((pos - pos2) * speed); 
				
				//print(mov);
			}
		}
	}
#if UNITY_WEBPLAYER
	//Mouse drag 2
	if(Input.GetMouseButton(0)){
		if(framewait==0){
			pos2 = Input.mousePosition;
			mov = ((pos - pos2) * speed); 
			//print("pos set");
		}	
	}
#endif
	
	if(_enabled){
		transform.Translate(mov.x,0,mov.y);
		transform.eulerAngles= Vector3(45,0,0);
		transform.Translate(0,0,zoom.y);
		transform.eulerAngles = Vector3(0,0,0);
	}
	
	//fling dampening
	if(Mathf.Abs(mov.x)>0 || Mathf.Abs(mov.y)>0){
		mov *= dampening;
	}
	if(Mathf.Abs(zoom.x)>0 || Mathf.Abs(zoom.y)>0){
		zoom *= dampening;
	}
	
	
}