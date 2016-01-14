#pragma strict
import System;

class Cooldown{ 
	var timeLeft:System.String;
	var endTime:DateTime;
	var over:boolean;
	var _name:String;
	var remainder:int;
	
	function Cooldown(){}
	
	function Cooldown(hours:int, minutes:int,seconds:int,n:String){
		_name=n;
		var now = System.DateTime.Now;
		var timeInt :TimeSpan =new TimeSpan(hours,minutes,seconds);
		endTime = now + timeInt;
		
		CooldownManager.main.cooldowns.Add(this);
		
		//Debug.Log("cooldown made. Expires at "+endTime.ToString());
	}
	
	function Cooldown(end:String,n:String){
		_name = n;
		endTime = new DateTime.ParseExact(end, "yyyy-MM-dd HH:mm tt",
                                  null);
	}

}