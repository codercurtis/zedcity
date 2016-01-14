#pragma strict

var pos:Vector2; //Finger position. One of two that we use to measure the direction we should go.
var pos2:Vector2; 
var framewait:int;
var framewait2:int;
var dampening:float;
var mov:Vector2;
var maxX:float;
var minX:float;
static var speed:float;
var hitInfo:RaycastHit;
var cam:Camera;
var pause:boolean;
var tempSelected:Transform;
var canceled=true;
function Start(){
	
	if(Input.GetMouseButton(0)){
		pos=Input.mousePosition;
	}
	cam = GameObject.Find("Menu Camera").GetComponent(Camera);
}
function Update () {
	if(!pause){
		
		//Drag touch
		if(Input.touchCount==1){
			if(framewait==0){
				pos = Input.GetTouch(0).position;
				framewait = 2;
				//print("pos set");
			}
		}
		//Mouse drag
		if(Input.GetMouseButton(0)){
			if(framewait==0){
				pos = Input.mousePosition;
				framewait = 2;
				//print("pos set");
			}	
		}
		
		if(framewait>0){
			framewait--;
		}
		if(framewait2>0){
			framewait2--;
		}
		
		if(framewait==0){
			if(Input.touchCount==1){
				if(Input.GetTouch(0).phase == TouchPhase.Moved){
					pos2 = Input.GetTouch(0).position;
					mov = ((pos - pos2) * speed); 
					//print(mov);
				}
			}
		}
		//Mouse drag 2
		if(Input.GetMouseButton(0)){
			if(framewait==0){
				pos2 = Input.mousePosition;
				mov = ((pos - pos2) * speed); 
				//print("pos set");
			}	
		}
		
		//Scrollwheel
		if(Mathf.Abs(Input.GetAxis("Mouse ScrollWheel"))>0){
			mov.y = (Input.GetAxis("Mouse ScrollWheel") * 90); 
		}
		transform.Translate(0,0,mov.y);

		//fling dampening
		if(Mathf.Abs(mov.y)>0){
			mov *= dampening;
		}
	}
}