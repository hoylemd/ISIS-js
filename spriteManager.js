// Sprite manager object

function ISIS_sprite_manager (canvas) {
	var context = canvas.getContext("2d");
	var manager_proto = ISIS_manager();
	var sprite_prototype = {
		__proto__ : manager_proto.type_proto,
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
			if (this.hidden) {
				return;
			}

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
				context.fillStyle = this.value > this.critical_threshold ?
					this.full_colour : this.critical_colour;
				context.fillRect(0, 0, this.frameDims.x * this.value,
					this.frameDims.y);
			}

		},

		rotate : function (rads) {
			this.rotation = (this.rotation + rads) % Math.TAU;
		},

		rotateTo : function (rads) {
			this.rotation = rads % Math.TAU;
		},

		moveTo : function (coords) {
			this.position = {x:coords.x, y:coords.y};
		},

		center : function () {
			return {x: this.position.x + this.frameDims.x / 2,
				y: this.position.y + this.frameDims.y / 2 };
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

		setAlpha : function (alpha) {
			this.alpha = alpha > 0 ? alpha : 0;
		},

		register : function (manager) {
			this.manager = manager;
		},

		dispose : function () {
			if (this.manager) {
				this.manager.remove(this);
			}
		}
	};

	var checkAnimated = function (sprite) {
		var animated;

		animated = (sprite.image != null && sprite.image != undefined) &&
			(sprite.msBetweenFrames > 0) &&
			(sprite.mapDims.x > 1 || sprite.mapDims.y > 1);
	};

	var partialSprite = function () {
		return {
			__proto__ : sprite_prototype,
			position : {x:0, y:0},
			rotation : 0,
			animated : false,
			alpha : 1,
			hidden : false,
			manager : this
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

	var sprite_manager_prototype = {
		__proto__ : ISIS_manager(),
		type_proto : sprite_prototype,
		addSprite : function (sprite) {
			if (sprite && this.object_list) {
			this.object_list.push(sprite);
				sprite.register(this);
				return sprite;
			} else {
				return null;
			}
		},

		newSprite : function (image, mapDims, msBetweenFrames) {
			var new_sprite = partialSprite.apply(this);

			if (image && mapDims) {
				new_sprite.image = image;
				new_sprite.mapDims = mapDims;
				new_sprite.msBetweenFrames = msBetweenFrames;
				new_sprite.msSinceLastFrame = 0;

				new_sprite.frameDims = {};
				new_sprite.frameDims.x = Math.floor(image.width / mapDims.x);
				new_sprite.frameDims.y = Math.floor(image.height / mapDims.y);
				new_sprite.currentFrame = {x:0, y:0};
				new_sprite.animated = checkAnimated(new_sprite);
			} else {
				new_sprite = null;
				console.log("invalid Sprite parameters.");
			}
			return this.add(new_sprite);
		},

		newTextSprite : function (text, font, colour) {
			var new_sprite = partialSprite.apply(this);

			if (text && font && colour) {
				new_sprite.text = text;
				new_sprite.font = font;
				new_sprite.colour = colour;

				new_sprite.frameDims = getTextFrameDims(text, font);
			} else {
				new_sprite = null;
				console.log("invalid TextSprite parameters.");
			}

			return this.add(new_sprite);
		},

		newBarSprite : function (dimensions, full_colour, empty_colour,
			critical_colour, critical_threshold) {
			var new_sprite = partialSprite.apply(this);

			if (dimensions && full_colour && empty_colour) {
				new_sprite.frameDims = dimensions;
				new_sprite.full_colour = full_colour;
				new_sprite.empty_colour = empty_colour;
				new_sprite.critical_colour = critical_colour;
				new_sprite.critical_threshold = critical_threshold;
				new_sprite.value = 1;
			} else {
				new_sprite = null;
				console.log("invalid BarSprite parameters.");
			}

			return this.add(new_sprite);
		},

		update : function (elapsed) {
			var index = "";
			var sprite = null;

			for (index in this.object_list){
				sprite = this.object_list[index];
				if (sprite) {
					sprite.update(elapsed);
					if (sprite.position.x > canvas.width ||
						sprite.position.x < 0 ||
						sprite.position.y > canvas.height ||
						sprite.position.y < 0) {
						sprite.dispose();
						sprite = null;
					}
				}
			}
		},

		draw : function()
		{
			var index = "";
			for (index in this.object_list) {
				this.object_list[index].draw();
			}
		}
	}

	return function () {
		return {
			__proto__: sprite_manager_prototype
		};
	}

}
