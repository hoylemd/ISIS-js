// Sprite object

var ISIS_sprite = function(context)
{
	var sprite_prototype = 
	{
		'image' : null,
		'frameDims' : {x:0, y:0},
		'mapDims' : {x:0, y:0},
		'msBetweenFrames' : 0,
		'currentFrame' : {x:0, y:0},
		'msSinceLastFrame' : 0,
		'position' : {x:0, y:0},
		'rotation' : 0,

		
		// function called by the global update whenever it gets around to it
		// msElapsed: the number of milliseconds since the last time this
		//  method was called.
		'update_handler' : function(msElapsed)
		{
			msSinceLastFrame += msElapsed;
		
			if (msSinceLastFrame > msBetweenFrames)
			{
				this.update();
				msSinceLastFrame = 0;
			}	
		},

		// internal update logic. Replace this for custom functionality
		'update' : function()
		{
			var x = 0;
			var y = 0;
					
			if (this.image && this.msBetweenFrames > 0)
			{
				if (this.mapDims.x > 1 || this.mapDims.y > 1)
				{
					x = this.currentFrame.x + 1;
					this.currentFrame.x = x % this.mapDims.x;

					if (x === 0)
					{
						y = this.currentFrame.y + 1;
						this.currentFrame.y = y % this.mapDims.y;
					}
					
				}
			}
		},

		'draw' : function()
		{
			if (this.image)
			{
				context.reset();

				context.translate(this.position.x + 0.5 * this.frameDims.x,
					   	this.position.y + 0.5 * this.frameDims.y);
				context.rotate(this.rotation);

				context.drawImage(this.image, -0.5 * this.frameDims.x,
						-0.5 * this.frameDims.y);
			}
				
		},

		'rotate' : function(rads)
		{
			this.rotation = rads;
		},

		'moveTo' : function(coords)
		{	
			
			this.rotation = Math.calculateLineAngle(this.position.x,
				this.position.y, coords.x, coords.y);

			this.position = {x:coords.x, y:coords.y};
	
		}

	};

	// constructor
	return function(image, mapDims, msBetweenFrames)
	{
		var new_sprite = {
			__proto__ : sprite_prototype
		};

		if (image && mapDims && msBetweenFrames >= 0)
		{
			new_sprite.image = image;
			new_sprite.mapDims = mapDims;
			new_sprite.msBetweenFrames = msBetweenFrames;
			
			new_sprite.frameDims.x = Math.floor(image.width / mapDims.x);
			new_sprite.frameDims.y = Math.floor(image.height / mapDims.y);

		}
		else
			new_sprite = null;

		return new_sprite;
	}

};
