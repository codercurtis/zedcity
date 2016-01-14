class Stats{

enum ProType {Combat = 0, RD = 1, Chef = 2};
var type : ProType;
var values :int[] = new int[6]; 
 
static final var hp: int = 0;  
static final var maxHp: int = 1;
static final var attack : int = 2;
static final var defense: int = 3;
static final var production : int = 4;
static final var cooking : int = 5;
//static final var hunger : int = 6;


static final var byName =["hp",
 "maxHp",
 "attack",
 "defense",
 "production",
 "cooking"/*,
 "hunger"*/];
 
 
 function toString():String{
	var str=values[0]+" "+values[2]+" "+values[3]+" "+values[4]+" "+values[5]; 
	
	return str;
 }
 
}

