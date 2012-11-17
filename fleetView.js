// Fleer view source file
// author: hoylemd

// main setup function
var ISIS_fleetView = function(context)
{
	var funDrawBackground = function()
	{
		var i = 0;
		var j = 0;
		var xMoved = 0;
		
		context.reset();

		// clear the screen
		context.clearRect(this.position.x, this.position.y, 
			this.dimensions.x, this.dimensions.y);
		context.fillStyle = "#000000";
		context.fillRect(this.position.x, this.position.y,
			this.dimensions.x, this.dimensions.y);

		// set the context to the tile offset
		context.translate(this.tileOffset.x, this.tileOffset.y);

		// move to the view position
		context.translate(this.position.x, this.position.y);
		//draw rows
		for (i = 0; i < this.tiles.y; i++)
		{
			xMoved = 0;
			// draw each tile
			for(j = 0; j < this.tiles.x; j++)
			{
				context.drawImage(this.tileImage, -this.tileOffset.x,
					-this.tileOffset.y);
				context.translate(this.tileDimensions.x, 0);
				xMoved += this.tileDimensions.x;
			}
		
			context.translate(-xMoved, this. tileDimensions.y);
		}

		// reset the context
		context.reset();
	};
	
	// function to draw the grid lines
	var funDrawGrid = function()
	{
		// set up for grid drawing
		context.reset();
		context.translate(this.position.x, this.position.y);
		context.beginPath();
		context.lineWidth = 1;
		context.strokeStyle = "#440044";

		// set initial pixel offset (makes lines draw sharp)
		var currX = -0.5;
		var currY = -0.5;

		// draw vertical lines
		for(var i = 1; i < this.tiles.x; i++)
		{
			currX += this.tileDimensions.x;
			context.moveTo(currX, currY);
			context.lineTo(currX, currY + this.dimensions.y + 1);
		}

		// reset initial pixel offset
		var currX = -0.5;
		var currY = -0.5;

		// draw horizontal lines
		for(var i = 1; i < this.tiles.y; i++)
		{
			currY += 100;
			context.moveTo(currX, currY);
			context.lineTo(currX + this.dimensions.x + 1, currY);
		}

		// draw the lines
		context.stroke();
		context.reset();
	}

	var funResize = function(x, y)
	{
		this.dimensions.x = x;
		this.dimensions.y = y;

		this.tiles.x = Math.floor(x / this.tileDimensions.x);
		this.tiles.y = Math.floor(y / this.tileDimensions.y);
	};		

	var funMove = function(x, y)
	{
		this.position.x = x;
		this.position.y = y;
	};

	var funAddShip = function(ship)
	{
		var posx = Math.floor(this.tiles.x / 2) * this.tileDimensions.x 
		var posy = Math.floor(this.tiles.y / 2) * this.tileDimensions.y
		posx += this.position.x;
		posy += this.position.y;

		ship.rotate(this.facing);
		ship.moveTo(posx, posy);
		this.shipList.addSprite(ship.sprite);
	};

	var fleetView_prototype =
	{

		// sprite drawing data
		spriteRotation: 0,
		drawBackground: funDrawBackground,
		drawGrid: funDrawGrid,
		draw: function()
		{
			this.drawBackground();
			this.drawGrid();
			this.shipList.draw();
		},
		addShip : funAddShip,
		resize: funResize,
		move: funMove
	};

	// constructor
	return function(tileImage, manager)
	{
		var ix = tileImage.width;
		var iy = tileImage.height;
		
		// build the proto
		var new_fv = {
			__proto__ : fleetView_prototype,

			// overall drawing data
			position : {x:0, y:0},
			dimensions : {x:0, y:0},
			facing : 0,

			// sprites
			shipList: manager,

			// tile data
			tiles : {x:0, y:0},
			tileDimensions : {x:ix, y:iy},
			tileOffset : {x : ix / 2, y:iy / 2},
			tileImage : tileImage
		};
				

		return new_fv;
	}
}
