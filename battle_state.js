// battle state object
var ISIS_battleState = function (game, canvas, content) {
	// graphics objects
	var context = canvas.getContext("2d");

	// content assets
	var images = content.images;

	// game state
	var paused = false;
	var initialized = false;

	var io = new ISIS_IO();

	// fleet view objects
	var FleetView = ISIS_fleetView(context);
	var playerFleetView;

	// sprite objects
	var spriteManager = new ISIS_sprite_manager(canvas);

	// Particle objects
	var particle_manager = new (ISIS_ParticleManager())();

	// Projectile objects
	var projectile_manager = new (ISIS_ProjectileManager(spriteManager,
		particle_manager))();

	// weapon objects
	var Weapon = ISIS_weapon(spriteManager, projectile_manager);

	// unit objects
	var Unit = ISIS_unit(context, images, spriteManager, particle_manager);
	var player = null;
	var enemy = null;

	// orders objects
	var orders = ISIS_order();

	// Bar data
	var buttonWidth = 150;
	var barHeight = 50;

	// Orders data
	var attackOrder = false;

	// Map data
	var tilesX;
	var tilesY;
	var mapWidth;
	var mapHeight;
	var clientWidth;
	var clientHeight;

	// function to initialize the game
	var initialize = function() {
		// initialize the debris libraries
		var debris_library = [images["debris1"], images["debris2"],
			images["debris3"]];

		player = new Unit("ArkadianCruiser", {x:1, y:1}, 0, debris_library);
		player.name = "Arkadian Cruiser";
		player.setHull(100);
		player.addWeapon(new Weapon("Arkadian Railgun", 50, 25, 1500,
			images["bullet"], 25));

		enemy = new Unit("TerranCruiser", {x:1, y:1}, 0, debris_library);
		enemy.name = "Terran Cruiser";
		enemy.setHull(150);
		enemy.addWeapon(new Weapon("Terran Mass Driver", 75, 100, 1000,
			images["bullet"], 20));

		playerFleetView = new FleetView(images["spaceTile"]);
		playerFleetView.moveTo({x: 0, y: 0});
		playerFleetView.facing = 1/4 * Math.TAU;
		playerFleetView.resize({x: 500, y: 600});
		playerFleetView.addShip(player);

		enemyFleetView = new FleetView(images["spaceTile"]);
		enemyFleetView.moveTo({x: 600, y: 0});
		enemyFleetView.facing = 3/4 * Math.TAU;
		enemyFleetView.resize({x: 500, y: 600});
		enemyFleetView.addShip(enemy);

		enemy.registerOrder(new orders.Attack(enemy, player));
		enemy.carryOut();
		// test text sprites
		//spriteManager.newTextSprite("test", "12px Courier",
		//	"red").centerOn({x: 150, y: 150});

		// test particle
		//var part_sprite = spriteManager.newTextSprite("wheee!",
		//	"16pt Calibri", "blue");
		//particle_manager.newParticle(part_sprite, {x: 50, y: 50},
		//	{x: 550, y: 50}, 5000);
		initialized = true;

	};

	// function to draw the bottom orders bar
	var drawBar = function()
	{
		// set up
		context.reset();
		context.fillStyle = "#777777";

		// calculate position
		var barTop = clientHeight - barHeight;

		// draw the bar background
		context.fillRect(0, barTop, clientWidth, barHeight);

		// prepare to draw buttons
		context.reset();
		context.translate(0, barTop);
		var buttonImage;

		// draw the Attack button
		if (attackOrder)
			buttonImage = images["AttackButtonPressed"];
		else
			buttonImage = images["AttackButton"];
		context.drawImage(buttonImage, 0, 0);

		// draw the Go button
		context.translate(clientWidth - buttonWidth, 0);
		context.drawImage(images["GoButton"], 0, 0);
	};

	// function to update the screen
	var update = function (elapsed) {

		// reset the window size
		clientWidth = $(window).width();
		clientHeight = $(window).height();

		// Prepare for next round of drawing
		context.clearRect(0, 0, clientWidth, clientHeight);
		context.reset();

		if (!initialized) {
			this.initialize();
		}

		// check for state changes
		if (player.destroyed) {
			console.log("you lose!");
			game.changeState(ISIS_battleState(game, canvas, content));
			return;
		} else if (enemy.destroyed) {
			console.log("you win!");
			game.changeState(ISIS_battleState(game, canvas, content));
			return;
		}

		// update units
		player.update(elapsed);
		enemy.update(elapsed);

		// update projectiles
		projectile_manager.update(elapsed);

		// update projectiles
		particle_manager.update(elapsed);

		// update sprites
		spriteManager.update(elapsed);

		// draw Fleet views
		playerFleetView.draw();
		enemyFleetView.draw();

		// draw other sprites
		spriteManager.draw();

		// draw order lines
		if (!player.destroyed) {
			player.drawLines();
		}
		//enemy.drawLines();


		// draw the UI
		drawBar();
	};

	// Add an event listener for mouse clicks
	canvas.addEventListener('click',
		function (evt) {
			// get the mouse position
			var mousePos = io.getMousePos(canvas, evt);

			// clip to the section of the screen
			if (mousePos.x < canvas.clientWidth &&
				mousePos.y < canvas.clientHeight) {
				if (attackOrder) {
					// register an attack order if the attack order is active
					if (enemy.collide(mousePos)) {
						player.registerOrder(new orders.Attack(player, enemy));
					} else {
						player.clearOrder("attack");
					}
				}
				attackOrder = false;
			}
			if (mousePos.y > (canvas.clientHeight - barHeight)) {
				// click on a button
				if (mousePos.x < buttonWidth) {
					attackOrder = !attackOrder;
				} else if (mousePos.x > canvas.clientWidth - buttonWidth) {
					// Go button
					player.carryOut();
				}
			}
		});

	canvas.addEventListener('onkeydown',
		function(evt) {

		});

	canvas.addEventListener('onkeyup',
		function(evt) {

		});

	canvas.addEventListener('onkeypress',
		function(evt) {

		});

	return {
		update : update,
		initialize : initialize
	};

};
