class NotificationLabel extends UnityEngine.MonoBehaviour{
	var background :GUITexture;
	var backgroundColor:Color;
	var _name:GUIText;
	
	function Start () {
		background = transform.Find("Background").gameObject.GetComponent.<GUITexture>();
		background.GetComponent.<GUITexture>().color = backgroundColor;
		_name = transform.Find("Name").GetComponent.<GUIText>();
	}
}