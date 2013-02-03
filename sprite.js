// Sprite object

var ISIS_sprite = function( context) {
	var sprite_prototype = {
		update : function(elapsedMS) {
			var x = 0;
			var y = 0;

			if (this.animated) {
				this.msSinceLastFrame += elapsedMS;
				x = this.currentFrame.x + 1;
				this.currentFrame.x = x % this.mapDims.x;

				if (x === 0)
				{
					y = this.currentFrame.y + 1;
					this.currentFrame.y = y % this.mapDims.y;
				}
			}
		},

		rotateContext : function () {
			context.translate(0.5 * this.frameDims.x, 0.5 * this.frameDims.y);
			context.rotate(this.rotation);
			context.translate(
				-0.5 * this.frameDims.x, -0.5 * this.frameDims.y);
		},

		draw : function()
		{
			context.reset();
			context.translate(this.position.x, this.position.y);
			this.rotateContext();
			context.globalAlpha = this.alpha;
			if (this.image)
			{
				context.drawImage(this.image, 0, 0);
			}

			if (this.text) {
				context.font = this.font;
				context.fillStyle = this.colour;
				context.textBaseline = "top";
				context.fillText(this.text, 0, 0);
			}

			if (this.value) {
				context.fillStyle = this.empty_colour;
				context.fillRect(0, 0, this.frameDims.x, this.frameDims.y);
				context.fillStyle = this.full_colour;
				context.fillRect(0, 0, this.frameDims.x * this.value,
					this.frameDims.y);
			}

		},

		rotate : function (rads) {
			this.rotation = (this.rotation + rads) % Math.TAU;
		},

		rotateTo : function (rads) {
			console.log(rads + " " + Math.TAU);
			this.rotation = rads % Math.TAU;
		},

		moveTo : function (coords) {
			this.position = {x:coords.x, y:coords.y};
		},

		centerOn : function (coords) {
			var new_pos = {x: 0, y: 0};
			new_pos.x = coords.x - (this.frameDims.x / 2);
			new_pos.y = coords.y - (this.frameDims.y / 2);
			this.moveTo(new_pos);
		},

		move : function (displacement) {
			this.position.x += displacement.x;
			this.position.y += displacement.y;
		},

		register : function (manager) {
			this.manager = manager;
		},

		dispose : function () {
			if (this.manager) {
				this.manager.removeSprite(this);
			}
		}
	};

	var checkAnimated = function (sprite) {
		var animated;

		animated = (sprite.image != null && sprite.image != undefined) &&
			(sprite.msBetweenFrames > 0) &&
			(sprite.mapDims.x > 1 || sprite.mapDims.y > 1);
	};

	var newSprite = function () {
		return {
			__proto__ : sprite_prototype,
			position : {x:0, y:0},
			rotation : 0,
			animated : false
		}
	};

	var getTextFrameDims = function (text, font) {
			var metrics = {};
			var height = 0;
			var re = /[\d]/;
			var size_index = font.search(re);
			var frameDims = {};

			if (size_index >= 0) {
				context.font = font;
				metrics = context.measureText(text);
				frameDims.x = metrics.width;
				frameDims.y = parseFloat(font.substring(size_index));
			} else {
				frameDims = null;
				console.log(
					"invalid font string passed. cannot calulate frameDims.");
			}

			return frameDims;
	};

	// constructor
	return {
		standard: function(image, mapDims, msBetweenFrames) {
			var new_sprite = newSprite();

			if (image && mapDims) {
				new_sprite.image = image;
				new_sprite.mapDims = mapDims;
				new_sprite.msBetweenFrames = msBetweenFrames;
				new_sprite.msSinceLastFrame = 0;
				new_sprite.alpha = 1;

				new_sprite.frameDims = {};
				new_sprite.frameDims.x = Math.floor(image.width / mapDims.x);
				new_sprite.frameDims.y = Math.floor(image.height / mapDims.y);
				new_sprite.currentFrame = {x:0, y:0};
				new_sprite.animated = checkAnimated(new_sprite);
			} else {
				new_sprite = null;
				console.log("invalid Sprite parameters.");
			}
			return new_sprite;
		},

		text: function(text, font, colour) {
			var new_sprite = newSprite();

			if (text && font && colour) {
				new_sprite.text = text;
				new_sprite.font = font;
				new_sprite.colour = colour;

				new_sprite.frameDims = getTextFrameDims(text, font);
			} else {
				new_sprite = null;
				console.log("invalid TextSprite parameters.");
			}

			return new_sprite;
		},

		bar: function (dimensions, full_colour, empty_colour) {
			var new_sprite = newSprite();

			if (dimensions && full_colour && empty_colour) {
				new_sprite.frameDims = dimensions;
				new_sprite.full_colour = full_colour;
				new_sprite.empty_colour = empty_colour;
				new_sprite.value = 1;
			} else {
				new_sprite = null;
				console.log("invalid BarSprite parameters.");
			}

			return new_sprite;
		}
	}

};
