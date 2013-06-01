// Sprite manager object
function ISIS_SpriteManager (canvas) {
	// get the context prototype
	var context = canvas.getContext("2d");

	var rotateContext = function (that) {
		context.translate(0.5 * that.frameDims.x, 0.5 * that.frameDims.y);
		context.rotate(that.rotation);
		context.translate(-0.5 * that.frameDims.x, -0.5 * that.frameDims.y);
	};

	var adjustContext = function (that, do_not_reset) {
		// transform the drawing context
		if (!do_not_reset) {
			context.reset();
		}
		context.translate(that.position.x, that.position.y);
		rotateContext(that);
		context.globalAlpha = that.alpha;
	};

	// different draw functions
	var drawComplex = function (that) {
		for (var i in that.children) {
			that.children[i].draw();
		};
	};
	var drawStandard = function (that) {
		context.drawImage(that.image, 0, 0);
	};
	var drawText = function (that) {
		if (TEXT_SPRITE_BACKGROUNDS) {
			context.fillStyle = "red";
			context.fillRect(0, 0, that.frameDims.x, that.frameDims.y);
		}
		context.font = that.font;
		context.fillStyle = that.colour;
		context.textBaseline = "top";
		context.fillText(that.text, 0, 0);
	};
	var drawBar = function (that) {
		context.fillStyle = that.empty_colour;
		context.fillRect(0, 0, that.frameDims.x, that.frameDims.y);
		context.fillStyle = that.value > that.critical_threshold ?
			that.full_colour : that.critical_colour;
		context.fillRect(0, 0, that.frameDims.x * that.value,
			that.frameDims.y);
	};
	var drawButton = function (that) {
		// draw background
		if (that.active) {
			context.fillStyle = that.active_colour;
		} else {
			context.fillStyle = that.inactive_colour;
		}
		context.fillRect(0, 0, that.frameDims.x, that.frameDims.y);

	}
	// Sprite prototype
	var sprite_prototype = {
		// updater
		update : function(elapsed) {
			var x = 0;
			var y = 0;

			// animate, if applicable
			if (this.animated) {
				this.msSinceLastFrame += elapsed;
				x = this.currentFrame.x + 1;
				this.currentFrame.x = x % this.mapDims.x;

				if (x === 0) {
					y = this.currentFrame.y + 1;
					this.currentFrame.y = y % this.mapDims.y;
				}
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
		},
		addChild : function (child) {
			if (!this.children) {
				this.children = [];
			}

			this.children.push(child);
			child.parent = this;
		}
	};

	var checkAnimated = function (sprite) {
		var animated;

		animated = (sprite.image != null && sprite.image != undefined) &&
			(sprite.msBetweenFrames > 0) &&
			(sprite.mapDims.x > 1 || sprite.mapDims.y > 1);

		return animated;
	};

	var initializeSprite = function (that) {
		that.__proto__ = sprite_prototype;
		that.position = { x:0, y:0 };
		that.rotation = 0;
		that.animated = false;
		that.alpha = 1;
		that.hidden = false;
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
			throw new "invalid font string passed. cannot calculate frameDims.";
		}

		return frameDims;
	};

	// Standard constructor constructor
	var standardSpriteConstructor = function (manager) {
		return function (image, mapDims, msBetweenFrames) {
			// check the arguments
			if (image && mapDims) {

				// set up the common instance variables
				initializeSprite(this);

				// link to the manager
				this.manager = manager;

				// set up the texture variables
				this.image = image;
				this.mapDims = mapDims;
				this.msBetweenFrames = msBetweenFrames || 0;
				this.msSinceLastFrame = 0;
				this.frameDims = {};
				this.frameDims.x = Math.floor(image.width / mapDims.x);
				this.frameDims.y = Math.floor(image.height / mapDims.y);

				// set up animation
				this.currentFrame = {x:0, y:0};
				this.animated = checkAnimated(this);

				// set the draw method
				this.draw = function () {
					if (!this.hidden && !this.external) {
						adjustContext(this, this.parent);
						drawStandard(this);
					}
				};

				// add to the manager
				manager.add(this);
			} else {
				// error on invalid arguments
				throw "invalid Sprite parameters.";
			}
		};
	};

	// Text sprite constructor constructor
	var textSpriteConstructor = function (manager) {
		return function (text, font, colour, do_not_register) {
			// check arguments
			if (text && font && colour) {
				// set up the common instance variables
				initializeSprite(this);
				this.manager = manager;

				// set up the text variables
				this.text = text;
				this.font = font;
				this.colour = colour;
				this.frameDims = getTextFrameDims(text, font);

				// set the draw method
				this.draw = function () {
					if (!this.hidden) {
						adjustContext(this, this.parent);
						drawText(this);
					}
				};

				// add to the manager
				if (!do_not_register) {
					manager.add(this);
				}
				this.canvas = canvas;
			} else {
				// error on invalid parameters
				throw "invalid TextSprite parameters.";
			}

		};
	};

	// Bar sprite constructor constructor
	var barSpriteConstructor = function (manager) {
		return function (dimensions, full_colour, empty_colour,
			critical_colour, critical_threshold) {
			// check arguments
			if (dimensions && full_colour && empty_colour) {
				// set up common instance variables
				initializeSprite(this);
				this.manager = manager;

				// set up bar variables
				this.frameDims = dimensions;
				this.full_colour = full_colour;
				this.empty_colour = empty_colour;
				this.critical_colour = critical_colour;
				this.critical_threshold = critical_threshold;
				this.value = 1;

				// set draw method
				this.draw = function () {
					if (!this.hidden) {
						adjustContext(this, this.parent);
						drawBar(this);
					}
				};

				// add to the manager
				manager.add(this);
			} else {
				// error on invalid parameters
				throw "invalid BarSprite parameters.";
			}
		};
	};

	// Button sprite constructor constructor
	var buttonSpriteConstructor = function (manager) {
		return function (params) {
			// check arguments
			if (params['frameDims'] &&
				params['active_colour'] &&
				params['inactive_colour'] &&
				params['text'] &&
				params['font'] &&
				params['font_active_colour'] &&
				params['font_inactive_colour']) {
				// set up the common instance variables
				initializeSprite(this);
				this.manager = manager;

				this.frameDims = params['frameDims'];
				this.active_colour = params['active_colour'];
				this.inactive_colour = params['inactive_colour'];
				this.font_active_colour =
					params['font_active_colour'];
				this.font_inactive_colour =
					params['font_inactive_colour'];
				// set up the text variables
				this.text = new manager.TextSprite(
					params['text'],
					params['font'],
					this.font_inactive_colour,
					true
				);
				this.addChild(this.text);
				this.text.moveTo({
					x: (this.frameDims.x - this.text.frameDims.x)
						/ 2,
					y: (this.frameDims.y - this.text.frameDims.y)
						/ 2}
				);

				// set the draw method
				this.draw = function () {
					if (!this.hidden) {
						adjustContext(this, this.parent);
						drawButton(this);
						drawComplex(this);
					}
				};

				// add to the manager
				if (!params['do_not_register']) {
					manager.add(this);
				}
				this.canvas = canvas;
			} else {
				// error on invalid parameters
				throw "invalid ButtonSprite parameters.";
			}

		};
	};
	return function () {
		this.__proto__ = new ISIS.Manager();
		this.type_proto = sprite_prototype;

		// set up the sprite constructors, and curry the manager
		this.Sprite = standardSpriteConstructor(this);
		this.TextSprite = textSpriteConstructor(this);
		this.BarSprite = barSpriteConstructor(this);
		this.ButtonSprite = buttonSpriteConstructor(this);

		// update method
		this.update = function (elapsed) {
			var index = "";
			var sprite = null;

			for (index in this.object_list){
				sprite = this.object_list[index];
				if (sprite) {
					sprite.update(elapsed);

					// set the external flag for sprites who leave the canvas
					if (!canvas.boundSprite(sprite)) {
						sprite.external = true;
					} else {
						sprite.external = false;
					}
				}
			}
		};

		// draw method
		this.draw = function() {
			var index = "";
			for (index in this.object_list) {
				this.object_list[index].draw();
			}
		};

		// link to the canvas
		this.canvas = canvas;
	};
}
