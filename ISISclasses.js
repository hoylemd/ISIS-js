
// Unit class constructor
function Unit(intX, intY, strName, imgSprite, intRadius){
	var x = intX;
	var y = intY;
	var name = strName;
	var sprite = imgSprite;
	var radius = intRadius;
	return {
		moveTo : function(intX, intY){
			this.x = intX;
			this.y = intY;
		},
		draw: function(objContext)
		{

		}
	}
}

// Unit class blank constructor
function Unit(){
	return Unit(0, 0, "", null, 36)
}
