var ISIS_unit = function(context)
{

	var tileSize = 100;

	// Unit class prototype (hidden)
	var unit_prototype =
	{
		x : 0,	// y coord
		y : 0,	// x coord
		name : "Unnamed Unit",	// unit name 
		
		offset : 0,
		rotation : 0,

		hp : 10,
		maxHp : 10,

		// movement function
		moveTo : function(intX, intY){
			var xOffset = intX % tileSize;
			var yOffset = intY % tileSize;

			var newX = intX - xOffset;
			var newY = intY - yOffset;
			
			this.rotation = Math.calculateLineAngle(this.x, this.y,
				newX, newY);

			this.x = newX;
			this.y = newY;
		},

		// drawing function
		draw: function()
		{
			// reset the context
			context.reset();

			// draw the sprite image if it exists
			if (this.image)
			{
				context.translate(this.x + 0.5 * tileSize,
					   	this.y + 0.5 * tileSize);
				context.rotate(this.rotation);
				context.translate();
				context.drawImage(this.image,
					-1 * (0.5 * tileSize - this.offset), 
					-1 * (0.5 * tileSize - this.offset));
				context.reset();
			}
		},

		// order registration
		registerOrder : function(order)
		{
			order.owner = this;
			this.order = order;
		},

		// carry out orders function
		carryOut : function()
		{
			if (this.order)
				this.moveTo(this.order.destX, this.order.destY);
		}
	}

	// builder function for unit
	return function(image)
	{
		// build the prototyoe
		var new_unit =  {
			__proto__ : unit_prototype
		};
		
		// add the sprite image if it exists
		if (image)
		{
			new_unit.image = image;
			new_unit.offset = (tileSize - image.width) / 2;
		}

		// return the new unit
		return new_unit;
	}
}
