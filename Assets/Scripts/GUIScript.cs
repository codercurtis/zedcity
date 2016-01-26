using UnityEngine;
using System.Collections;


public class GUIScript : MonoBehaviour {
	
	float buttonWidth = 100;
	float buttonHeight = 30;
	void OnGUI(){
		if(GUI.Button(new Rect(Screen.width/2-buttonWidth/2,Screen.height *0.01f,buttonWidth,buttonHeight),"Units")){
		
		}
	}
}
