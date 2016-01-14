class BuildingStats{

function BuildingStats(){}

static final var hp: int = 0; 
static final var maxHp: int = 1;

var values:float[]=new float[2];

static final var byName =["hp","maxHp"];
 
  enum byEnum {hp = 0, maxHp = 1,};
  
  function toString():String{
	var str:String = ""+hp+"/"+maxHp;
	return  str;
  }
}