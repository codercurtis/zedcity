#pragma strict
import System;
import System.Collections.Generic;

var cooldowns:List.<Cooldown> = new List.<Cooldown>();
static var main : CooldownManager;

function Start () {
	CooldownManager.main=this;
}

function Update () {
	var now = System.DateTime.Now;
	var removeInd;
	var i:int=0;
	for(var c : Cooldown in cooldowns){
		if(c==null){ continue; }
		if(c.endTime==null){ continue;}
		if((now > c.endTime)){
			c.over=true;
			removeInd=i;
			var span:TimeSpan = c.endTime-now;
			//print(span.ToString());
			//print("hrs "+span.ToString().Substring(1,2));
			var hours:int = int.Parse(span.ToString().Substring(1,2));
			//print("minues "+span.ToString().Substring(4,2));
			var minutes: int = int.Parse(span.ToString().Substring(4,2));
			//print("seconds "+span.ToString().Substring(7,2));
			var seconds: int = int.Parse(span.ToString().Substring(7,2));
			
			var remainder:int = (hours*3600) + (minutes * 60) + (seconds);
			c.remainder =remainder;
			
		}else{ 
			c.timeLeft = (now - c.endTime).ToString();
			c.timeLeft = c.timeLeft.Substring(1,8);
		}
		i++;
	}
	
	if(removeInd!=null){
		if(cooldowns[removeInd]._name.Contains("Production")){
			var index:int = cooldowns[removeInd]._name.IndexOf("_")+1; 
			var res = cooldowns[removeInd]._name.Substring(index);
			//print("adding resources = " +res);
			var resInt:int=0;
			if(cooldowns[removeInd].remainder/Global.productionCooldownTime>1){
				resInt =int.Parse(res) + (cooldowns[removeInd].remainder/Global.productionCooldownTime);
				Global.resources+= resInt;
				//print(resInt + "resources added");
			}else{
				Global.resources += int.Parse(res);
				//print(res + "resources added");
			}
		}else if(cooldowns[removeInd]._name.Contains("Cooking")){
			var index2:int = cooldowns[removeInd]._name.IndexOf("_")+1; 
			var res2 = cooldowns[removeInd]._name.Substring(index);
			var resInt2:int =int.Parse(res) +(cooldowns[removeInd].remainder/Global.cookingCooldownTime);
			//print("resources added");
		}
		cooldowns.RemoveAt(removeInd);
	}
}

function getTimeLeft(str:String){
	for(var c:Cooldown in cooldowns){
		if(c._name==str){
			return c.timeLeft;
		}
	}
	return "invalid";
}

function checkCooldown(str:String){
	for(var c: Cooldown in cooldowns){
		if(c._name.Contains(str)){
			return true;
		}
	}
	return false;
}