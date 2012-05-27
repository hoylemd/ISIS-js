
// Unit class constructor
function Unit(intX, intY, strName, imgSprite, intRadius){
	return {
		x : intX,
		y : intY,
		name : strName,
		sprite : imgSprite,
		radius : intRadius,
		moveTo : function(intX, intY){
			this.x = intX;
			this.y = intY;
		}
	}
}

// Unit class blank constructor
function Unit(){
	return Unit(0, 0, "", null, 36)
}
