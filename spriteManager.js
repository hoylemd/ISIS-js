// Sprite manager object

function ISIS_spriteManager(Sprite, canvas)
{
	var spriteManager_prototype =
	{
		spriteList : null,
		numSprites : 0,
		msBetweenFrames : 0,
		msSinceLastFrame : 0,

		addSprite : function(sprite, id) {
			var newId = this.numSprites;
			if (sprite && this.spriteList) {
				if (id)
					this.spriteList[id] = sprite;
				this.spriteList[newId] = sprite;
				this.numSprites += 1;
				sprite.register(this);
				return sprite;
			}
			else {
				return null;
			}
		},

		newSprite : function(image, mapDims, msBetweenFrames, id) {
			var new_sprite = Sprite(image, mapDims, msBetweenFrames);
			return this.addSprite(new_sprite);
		},

		removeSprite : function(sprite)
		{
			var index = "";

			if (sprite && this.spriteList)
			{
				for (index in this.spriteList)
				{
					if (this.spriteList[index] === sprite){
						delete this.spriteList[index];
						this.numSprites -= 1;
					}
				}
			}
		},

		// function called by the global update whenever it gets around to it
		// msElapsed: the number of milliseconds since the last time this
		//  method was called.
		update_handler : function(msElapsed)
		{
			msSinceLastFrame += msElapsed;

			if (msSinceLastFrame > msBetweenFrames)
			{
				this.update();
				msSinceLastFrame = 0;
			}
		},

		update : function()
		{
			var index = "";
			var sprite = null;
			for (index in this.spriteList){
				sprite = this.spriteList[index];
				if (sprite.position.x > this.canvas.width ||
					sprite.position.x < 0 ||
					sprite.position.y > this.canvas.height ||
					sprite.position.y < 0) {
					sprite.destruct();
					sprite = null;
				}

				if (sprite) {
					sprite.update();
				}
			}
		},

		draw : function()
		{
			var index = "";
			for (index in this.spriteList) {
				var sprite =  this.spriteList[index];
				sprite.draw();
			}
		}
	}

	return function ( canvas)
	{
		var new_spriteManager = {
			__proto__: spriteManager_prototype
		};

		new_spriteManager.canvas = canvas;
		new_spriteManager.spriteList = {};

		return new_spriteManager;
	}

}
