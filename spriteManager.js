// Sprite manager object

function ISIS_spriteManager (Sprite, canvas)
{
	var spriteManager_prototype =
	{
		addSprite : function (sprite) {
			var newId = this.numSprites;

			if (sprite && this.spriteList) {
				this.spriteList[newId] = sprite;
				this.numSprites += 1;
				sprite.register(this);
				return sprite;
			} else {
				return null;
			}
		},

		newSprite : function (image, mapDims, msBetweenFrames) {
			var new_sprite = Sprite.standard(image, mapDims, msBetweenFrames);
			return this.addSprite(new_sprite);
		},

		newTextSprite : function (text, font, colour) {
			var new_sprite = Sprite.text(text, font, colour);
			return this.addSprite(new_sprite);
		},

		removeSprite : function (sprite) {
			var index = "";

			if (sprite && this.spriteList) {
				for (index in this.spriteList) {
					if (this.spriteList[index] === sprite) {
						this.spriteList.splice(index, 1);
						this.numSprites -= 1;
					}
				}
			}
		},

		update : function (elapsed) {
			var index = "";
			var sprite = null;

			for (index in this.spriteList){
				sprite = this.spriteList[index];
				if (sprite.position.x > this.canvas.width ||
					sprite.position.x < 0 ||
					sprite.position.y > this.canvas.height ||
					sprite.position.y < 0) {
					sprite.dispose();
					sprite = null;
				}

				if (sprite) {
					sprite.update(elapsed);
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

	return function (canvas) {
		var new_spriteManager = {
			__proto__: spriteManager_prototype
		};

		new_spriteManager.spriteList = null;
		new_spriteManager.numSprites = 0;
		new_spriteManager.canvas = canvas;
		new_spriteManager.spriteList = [];

		return new_spriteManager;
	}

}
