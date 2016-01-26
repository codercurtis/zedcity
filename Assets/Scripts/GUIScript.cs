using UnityEngine;
using System.Collections;


public class GUIScript : MonoBehaviour {
	
	float buttonWidth = 100;
	float buttonHeight = 30;
	void OnGUI(){
		switch(Master.instance.gameState){
			case Master.GameState.game:
				if(GUI.Button(new Rect(Screen.width/2-buttonWidth/2,Screen.height *0.01f,buttonWidth,buttonHeight),"Units")){
					Master.instance.gameState = Master.GameState.menu;
				}
			break;
			
			case Master.GameState.menu:
				if(GUI.Button(new Rect(Screen.width/2-buttonWidth/2,Screen.height *0.01f,buttonWidth,buttonHeight),"Map")){
					Master.instance.gameState = Master.GameState.game;
				}
			break;
		}
	}
}
