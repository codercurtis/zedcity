#pragma strict

static class Global extends System.Object{ 
		 var user:String = "username";
		 var pass:String = "password"; 
		 var recruitCooldownTime:int =1800; 
		 var attackCooldownTime:int =1000; 
		 var productionCooldownTime:int=10;
		 var cookingCooldownTime:int=30;
		 var resources:int=0;
		 var food:int=100;
		 var maxFood:int=100;
		 var scoutSquadInt:int;
	class buildingData{
		static var posX:float[]=new float[100];
		static var posY:float[]=new float[100];
		static var posZ:float[]=new float[100];
		static var name:String[]=new String[100];
		static var type:int[]=new int[100];
		static var modelType:int[] =new int[100];
		static var id:int[]=new int[100];
		static var stats:BuildingStats[] = new BuildingStats[100];
	}
	
	class peopleData{
		static var name:String[]=new String[300];
		static var squad:int[] = new int[300];
		static var building:String[] = new String[300];
		static var hp:int[] = new int[300];
		static var maxHp:int[] = new int[300];
		static var attack:int[] = new int[300];
		static var defense:int[] = new int[300];
		static var production:int[] = new int[300];
		static var cooking:int[] = new int[300];
		//static var hunger:int[] = new int[300];
	}
	
	
	class cooldownData{
		static var cooldowns:Cooldown[] = new Cooldown[100];
	}

	
		var squads= ["No Squad","Alpha","Bravo","Charlie","Delta","Echo","Foxtrot",
					"Golf","Hotel","India","Juliett","Kilo","Lima","Mike","November",
					"Oscar","Papa","Quebec","Romero","Sierra","Tango","Uniform","Victor",
					"Whiskey","X-ray","Yankee","Zulu"];
}