// Fleet view
var ISIS_fleetView = function (context) {
	var manager_proto = new ISIS_manager();

	// function to draw the background
	var drawBackground = function (that) {
		var i = 0;
		var j = 0;
		var x_moved = 0;

		context.reset();

		// clear the screen
		context.clearRect(that.position.x, that.position.y,
			that.dimensions.x, that.dimensions.y);
		context.fillStyle = "#000000";
		context.fillRect(that.position.x, that.position.y,
			that.dimensions.x, that.dimensions.y);

		// set the context to the tile offset
		context.translate(that.tileOffset.x, that.tileOffset.y);

		// move to the view position
		context.translate(that.position.x, that.position.y);

		//draw rows
		for (i = 0; i < that.tiles.y; i++) {
			x_moved = 0;
			for (j = 0; j < that.tiles.x; j++) {
				context.drawImage(that.tileImage, -that.tileOffset.x,
					-that.tileOffset.y);
				context.translate(that.tileDimensions.x, 0);
				x_moved += that.tileDimensions.x;
			}

			context.translate(-x_moved, that. tileDimensions.y);
		}

		// reset the context
		context.reset();
	};

	// function to draw the grid lines
	var drawGrid = function (that) {
		var i = 0;

		// set initial pixel offset (makes lines draw sharp)
		var curr_x = -0.5;
		var curr_y = -0.5;

		// set up for grid drawing
		context.reset();
		context.translate(that.position.x, that.position.y);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "#440044";

		// draw vertical lines
		for(i = 1; i < that.tiles.x; i++) {
			curr_x += that.tileDimensions.x;
			context.moveTo(curr_x, curr_y);
			context.lineTo(curr_x, curr_y + that.dimensions.y + 1);
		}

		// reset initial pixel offset
		curr_x = -0.5;
		curr_y = -0.5;

		// draw horizontal lines
		for (i = 1; i < that.tiles.y; i++) {
			curr_y += 100;
			context.moveTo(curr_x, curr_y);
			context.lineTo(curr_x + that.dimensions.x + 1, curr_y);
		}

		// draw the lines
		context.stroke();
		context.reset();
	};

	// prototype
	var fleetView_prototype = {
		__proto__ : manager_proto,

		// override the update function to do nothong
		update: function () {
		},

		// draw function
		draw: function() {
			drawBackground(this);
			drawGrid(this);
		},

		// method to register a ship
		addShip : function(ship) {

			// determine the middle-most tile
			var posx = Math.floor(this.tiles.x / 2) * this.tileDimensions.x
			var posy = Math.floor(this.tiles.y / 2) * this.tileDimensions.y
			posx += this.position.x;
			posy += this.position.y;

			// position the ship
			ship.rotateTo(this.facing);
			ship.moveTo({x: posx, y: posy});

			// link the ship to this view
			this.add(ship);
			ship.registerView(this);
		},

		// resize function
		resize: function (size) {
			// adjust dimensions
			this.dimensions.x = size.x;
			this.dimensions.y = size.y;

			// recalsulate tiles
			this.tiles.x = size.x / this.tileDimensions.x;
			this.tiles.y = size.y / this.tileDimensions.y;
		},

		// move function
		moveTo : function (position) {
			this.position.x = position.x;
			this.position.y = position.y;
		},

		// method to check if a sprite is bound by this fleetView
		boundSprite: function (sprite) {
			// calculate side bounding
			var left = this.position.x <= sprite.position.x;
			var right = this.position.x + this.dimensions.x >=
					sprite.position.x + sprite.frameDims.x;
			var top_side = 	this.position.y <= sprite.position.y;
			var bottom = this.position.y + this.dimensions.y >=
					sprite.position.y + sprite.frameDims.y;

			// calculate true or false for bounding
			return left && right && top_side && bottom;
		}
	};

	// constructor
	return function (tileImage) {
		var ix = tileImage.width;
		var iy = tileImage.height;

		this.__proto__ = fleetView_prototype;

		// overall drawing data
		this.position = {x: 0, y: 0};
		this.dimensions = {x: 0, y: 0};
		this.facing = 0;

		// tile data
		this.tiles = {x: 0, y: 0};
		this.tileDimensions = {x: ix, y: iy};
		this.tileOffset = {x: ix / 2, y: iy / 2};
		this.tileImage = tileImage;
	};
};
