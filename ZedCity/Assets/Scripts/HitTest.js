#pragma strict
var ready:boolean;
function Start () {

}

function Update () {

	if(Input.GetMouseButtonDown(0) && Input.GetAxis("Mouse X")==0 && Input.GetAxis("Mouse Y")==0 && !ready){
		if(GetComponent.<GUITexture>().HitTest(Input.mousePosition)){
			ready=true;
		}
	}
	
	if(Input.touchCount>0){
		if(Input.GetTouch(0).phase==TouchPhase.Began && Input.GetTouch(0).phase != TouchPhase.Moved && !ready){
			if(GetComponent.<GUITexture>().HitTest(Input.GetTouch(0).position)){
				ready=true;
			}
		}
	}
	
	if(Mathf.Abs(Input.GetAxis("Mouse X"))>.1 || Mathf.Abs(Input.GetAxis("Mouse Y"))>.1){
		ready=false;
	}
	if(Input.touchCount>0){
		if(Input.GetTouch(0).phase == TouchPhase.Moved){
			ready=false;
		}
	}
	
	
	if(!Input.GetMouseButtonDown(0) && GetComponent.<GUITexture>().HitTest(Input.mousePosition) && ready){
		if(Daemon.main.troopMenuShowing){
			//Troops menu
			if(gameObject.tag=="Person"){
				if(!Daemon.main.squadsShowing){
					Daemon.main.personSelected = transform.parent.gameObject.GetComponent(PersonLabel).p;
					Daemon.main.CreateSquadLabels();
					Daemon.main.SlidePeopleLables();
					Daemon.main.PausePeopleLabels();
					print("hit");
					GUIDragPanner.speed=0;
				}else{
					Daemon.main.ResetPeopleLabels();
					Daemon.main.DestroySquadLabels();
					GUIDragPanner.speed=0;
				}
				//Add person to squad
			}else if(gameObject.tag=="SquadLabelBackground"){
				if(Daemon.main.personSelected){
					Daemon.main.personSelected.squad= transform.parent.gameObject.GetComponent(SquadLabel).squad;
				}
				Daemon.main.UpdateSquadLabels();
				Daemon.main.PopulateSquads();
				GUIDragPanner.speed=0;
			}
		}else if(Daemon.main.squadMenuShowing){
		
			
			if(Daemon.main.squadSelectShowing){
				//Attack Building
				if(gameObject.tag=="SquadLabelBackground"){
					if(!CooldownManager.main.checkCooldown(Daemon.main.squads.list[Daemon.main.squadSelected].name)){
						Daemon.main.squadSelected = transform.parent.gameObject.GetComponent(SquadLabel).squad;
						if(Daemon.main.selectedBuilding.type==BuildingTypes.Infested){
							Daemon.main.AttackBuilding();
						}else if(Daemon.main.selectedBuilding.type==BuildingTypes.Production){
							Daemon.main.AssignBuilding();
						}
						Daemon.main.SetCameraPanEnabled(true);
						Daemon.main.SetMenuCameraEnabled(false);
						Daemon.main.DestroySquadLabels();
						Daemon.main.DestroyPeopleLabels();
						Daemon.main.squadMenuShowing=false;
						Daemon.main.squadSelectShowing=false;
					}
				}
			}else if(Daemon.main.setScoutSquad){
				if(gameObject.tag=="SquadLabelBackground"){
					if(!CooldownManager.main.checkCooldown(Daemon.main.squads.list[Daemon.main.squadSelected].name)){
						Daemon.main.squadSelected = transform.parent.gameObject.GetComponent(SquadLabel).squad;
						Daemon.main.scoutSquadInt = Daemon.main.squadSelected;
						Daemon.main.SetCameraPanEnabled(true);
						Daemon.main.SetMenuCameraEnabled(false);
						Daemon.main.DestroySquadLabels();
						Daemon.main.DestroyPeopleLabels();
						Daemon.main.squadMenuShowing=false;
						Daemon.main.squadSelectShowing=false;
						Daemon.main.setScoutSquad=false;
					}
				}
			}else{
				//Slide open the population of a squad
				if(gameObject.tag=="SquadLabelBackground"){
					if(!Daemon.main.squadPopulationShowing){
						Daemon.main.squadSelected = transform.parent.gameObject.GetComponent(SquadLabel).squad;
						Daemon.main.ShowSquadPopulation();
						Daemon.main.PauseSquadLabels();
						Daemon.main.SlideSquadLabels();
						GUIDragPanner.speed=0;
					}else{
						Daemon.main.ResetSquadLabels();
						Daemon.main.DestroyPopulationLabels();
						GUIDragPanner.speed=0;

					}
				}
			}
		
		}
	ready=false;
	}
	
	if(Input.touchCount>0){
		if(Input.GetTouch(0).phase == TouchPhase.Ended && GetComponent.<GUITexture>().HitTest(Input.GetTouch(0).position) && ready){
			if(Daemon.main.troopMenuShowing){
				if(gameObject.tag=="Person"){
					if(!Daemon.main.squadsShowing){
						Daemon.main.personSelected = transform.parent.gameObject.GetComponent(PersonLabel).p;
						Daemon.main.CreateSquadLabels();
						Daemon.main.SlidePeopleLables();
						Daemon.main.PausePeopleLabels();
						print("hit");
						GUIDragPanner.speed=0;
					}else{
						Daemon.main.ResetPeopleLabels();
						Daemon.main.DestroySquadLabels();
						GUIDragPanner.speed=0;
					}
					
				}else if(gameObject.tag=="SquadLabelBackground"){
					Daemon.main.personSelected.squad= transform.parent.gameObject.GetComponent(SquadLabel).squad;
					Daemon.main.UpdateSquadLabels();
					Daemon.main.PopulateSquads();
					GUIDragPanner.speed=0;
				}
			}else if(Daemon.main.squadMenuShowing){
				if(Daemon.main.squadSelectShowing){
					if(gameObject.tag=="SquadLabelBackground"){
						if(!CooldownManager.main.checkCooldown(Daemon.main.squads.list[Daemon.main.squadSelected].name)){
							Daemon.main.squadSelected = transform.parent.gameObject.GetComponent(SquadLabel).squad;
							Daemon.main.AttackBuilding();
							Daemon.main.SetCameraPanEnabled(true);
							Daemon.main.SetMenuCameraEnabled(false);
							Daemon.main.DestroySquadLabels();
							Daemon.main.DestroyPeopleLabels();
							Daemon.main.squadMenuShowing=false;
							Daemon.main.squadSelectShowing=false;
							
							
						}
					}
				}else{
					if(gameObject.tag=="SquadLabelBackground"){
						if(!Daemon.main.squadPopulationShowing){
							Daemon.main.squadSelected = transform.parent.gameObject.GetComponent(SquadLabel).squad;
							Daemon.main.ShowSquadPopulation();
							Daemon.main.PauseSquadLabels();
							Daemon.main.SlideSquadLabels();
							GUIDragPanner.speed=0;
						}else{
							Daemon.main.ResetSquadLabels();
							Daemon.main.DestroyPopulationLabels();
							GUIDragPanner.speed=0;
						}
					}
				}
			}
		ready=false;
		}
	}
}