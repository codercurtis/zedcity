#pragma strict
import System;
static var main:Scoreoid;

function Start () {	
	Scoreoid.main=this;
	DontDestroyOnLoad(gameObject);
}

function createPlayer(){
	var url = "https://www.scoreoid.com/api/createPlayer";
	
	var form = new WWWForm();
	form.AddField("api_key", "d3e5cdfff31db8115b42d5d24254dea2dd511091");
	form.AddField("game_id", "be27032297");
	form.AddField("response", "xml");
	form.AddField("username", Global.user);
	form.AddField("password", Global.pass);
	form.AddField("inventory",Daemon.main.data);
 
	var www = new WWW(url,form);
	Daemon.main.CreateNotification("Saving");
	yield www;
	
	createScore();
	
	if(www.error==null){
		//Debug.Log("request completed!:" +www.text);
		Daemon.main.CreateNotification("Game Saved");
	}else{
		Debug.Log("WWW Error: "+ www.error);
		Daemon.main.CreateNotification("Network Error");

	}
}
function createScore(){
	var url = "https://www.scoreoid.com/api/createScore";
	
	var form = new WWWForm();
	form.AddField("api_key", "d3e5cdfff31db8115b42d5d24254dea2dd511091");
	form.AddField("game_id", "be27032297");
	form.AddField("response", "xml");
	form.AddField("username", Global.user);
	form.AddField("score",Daemon.main.squads.list[Daemon.main.scoutSquadInt].rating);
 
	var www = new WWW(url,form);
	//Daemon.main.CreateNotification("Saving");
	yield www;
		
	if(www.error==null){
		//Debug.Log("request completed!:" +www.text);
		//Daemon.main.CreateNotification("Game Saved");
	}else{
		Debug.Log("WWW Error: "+ www.error);
		//Daemon.main.CreateNotification("Network Error");

	}
}



function checkPlayer(){
	var url = "https://www.scoreoid.com/api/getPlayer";
	var form = new WWWForm();
	form.AddField("api_key", "d3e5cdfff31db8115b42d5d24254dea2dd511091");
	form.AddField("game_id", "be27032297");
	form.AddField("response", "xml");
	form.AddField("username", Global.user);
	form.AddField("password", Global.pass);
	var www = new WWW(url,form);
	Daemon.main.CreateNotification("Validating");
	yield www;
	
	if(www.error==null){
		//Debug.Log("request completed!:" +www.text);
		
		if(www.text.Contains("Invalid") || www.text.Contains("not found")){
			Debug.Log("WWW Error: "+ www.error);
			Daemon.main.error=true;
			Daemon.main.CreateNotification("User/Pass not found");

		}else{
			Daemon.main.CreateNotification("Loading");
			getPlayerField();
		}
	}else{
		Debug.Log("WWW Error: "+ www.error);
		Daemon.main.CreateNotification("Error");
		Daemon.main.error=true;
		Debug.Log("Error");
 	}

}

function getPlayerField(){
	var url = "https://www.scoreoid.com/api/getPlayerField";
	var form = new WWWForm();
	form.AddField("api_key", "d3e5cdfff31db8115b42d5d24254dea2dd511091");
	form.AddField("game_id", "be27032297");
	form.AddField("response", "xml");
	form.AddField("username", Global.user);
	form.AddField("field", "inventory");
	
	var www = new WWW(url,form);
	yield www;
	
	if(www.text.Contains("Invalid") || www.text.Contains("not found")){
			Debug.Log("WWW Error: "+ www.error);
			Daemon.main.error=true;
			Daemon.main.CreateNotification("User not found");
		}else{
			Daemon.main.data = www.text;
			Daemon.main.loadOk=true;
			Debug.Log("Loaded");
		}
	if(www.error==null){
		//Debug.Log("request completed!:" +www.text);
	}else{
		Daemon.main.CreateNotification("Network Error");
		Debug.Log("WWW Error: "+ www.error);
 	}
	
}

function editPlayer(){
	var url = "https://www.scoreoid.com/api/editPlayer";
	var form = new WWWForm();
	form.AddField("api_key", "d3e5cdfff31db8115b42d5d24254dea2dd511091");
	form.AddField("game_id", "be27032297");
	form.AddField("response", "xml");
	form.AddField("username", Global.user);
	form.AddField("inventory",Daemon.main.data);
	var www = new WWW(url,form);
	Daemon.main.CreateNotification("Saving");
	yield www;
	createScore();
	if(www.error==null){
		Daemon.main.CreateNotification("Data Saved");
		//Debug.Log("request completed!:" +www.text);
	}else{
		Debug.Log("WWW Error: "+ www.error);
		Daemon.main.CreateNotification("Network Error");
		Daemon.main.error=true;
		Debug.Log("Error");
 	}

}

