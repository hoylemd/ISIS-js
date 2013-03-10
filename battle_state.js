// battle state object
var ISIS_battleState = function () {
	return function () {
		var images = null;

		// game state
		var paused = false;
		var initialized = false;

		// fleet view objects
		var playerFleetView = null;
		var enemyFleetView = null;

		// units
		var player = null;
		var enemy = null;

		// components
		var particle_manager = null;
		var projectile_manager = null;

		// classes
		var Weapon = null;
		var Unit = null;
		var orders = null;

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

			player = new Unit("ArkadianCruiser", {x:1, y:1}, 0,
				debris_library);
			player.name = "Arkadian Cruiser";
			player.setHull(100);
			player.addWeapon(new Weapon("Arkadian Railgun", 50, 25, 1500,
				images["bullet"], 25));

			enemy = new Unit("TerranCruiser", {x:1, y:1}, 0, debris_library);
			enemy.name = "Terran Cruiser";
			enemy.setHull(150);
			enemy.addWeapon(new Weapon("Terran Mass Driver", 15, 100, 2000,
				images["bullet"], 20));

			playerFleetView = new ISIS.FleetView(images["spaceTile"]);
			playerFleetView.moveTo({x: 0, y: 0});
			playerFleetView.facing = 1/4 * Math.TAU;
			playerFleetView.resize({x: 500, y: 600});
			playerFleetView.addShip(player);

			enemyFleetView = new ISIS.FleetView(images["spaceTile"]);
			enemyFleetView.moveTo({x: 600, y: 0});
			enemyFleetView.facing = 3/4 * Math.TAU;
			enemyFleetView.resize({x: 500, y: 600});
			enemyFleetView.addShip(enemy);

			enemy.registerOrder(new orders.Attack(enemy, player));
			enemy.carryOut();
			// test text sprites
			//new spriteManager.TextSprite("test", "12px Courier",
			//	"red").centerOn({x: 150, y: 150});

			// test particle
			//var part_sprite = new spriteManager.TextSprite("wheee!",
			//	"16pt Calibri", "blue");
			//particle_manager.newParticle(part_sprite, {x: 50, y: 50},
			//	{x: 550, y: 50}, 5000);
			initialized = true;

		};

		// function to draw the bottom orders bar
		var drawBar = function(that) {
			// set up
			that.context.reset();
			that.context.fillStyle = "#777777";

			// calculate position
			var barTop = clientHeight - barHeight;

			// draw the bar background
			that.context.fillRect(0, barTop, clientWidth, barHeight);

			// prepare to draw buttons
			that.context.reset();
			that.context.translate(0, barTop);
			var buttonImage;

			// draw the Attack button
			if (attackOrder)
				buttonImage = images["AttackButtonPressed"];
			else
				buttonImage = images["AttackButton"];
			that.context.drawImage(buttonImage, 0, 0);

			// draw the Go button
			that.context.translate(clientWidth - buttonWidth, 0);
			that.context.drawImage(images["GoButton"], 0, 0);
		};

		// function to update the screen
		var update = function (elapsed) {

			// reset the window size
			clientWidth = $(window).width();
			clientHeight = $(window).height();

			// Prepare for next round of drawing
			this.context.clearRect(0, 0, clientWidth, clientHeight);
			this.context.reset();

			if (!initialized) {
				this.initialize();
			}

			// check for state changes
			if (player.destroyed) {
				console.log("you lose!");
				this.dispose();
				this.game.changeState(new ISIS.BattleState());
				return;
			} else if (enemy.destroyed) {
				console.log("you win!");
				this.dispose();
				this.game.changeState(new ISIS.BattleState());
				return;
			}

			// update units
			//player.update(elapsed);
			//enemy.update(elapsed);

			// update projectiles
			projectile_manager.update(elapsed);

			// update projectiles
			particle_manager.update(elapsed);

			// update sprites
			this.sprite_manager.update(elapsed);

			// draw Fleet views
			playerFleetView.update(elapsed);
			enemyFleetView.update(elapsed);

			playerFleetView.draw();
			enemyFleetView.draw();

			// draw other sprites
			this.sprite_manager.draw();

			// draw order lines
			if (!player.destroyed) {
				player.drawLines();
			}
			//enemy.drawLines();


			// draw the UI
			drawBar(this);
		};

		var registerAttackOrder = function(mousePos) {
			// register an attack order if the attack order is active
			if (enemy.collide(mousePos)) {
				player.registerOrder( new orders.Attack(player, enemy));
			} else {
				player.clearOrder("attack");
			}
		};

		var clickMainView = null;

		var clickBar = null;

		var clickHandler = null;

		var dispose = null;

		this.__proto__ = new ISIS.GameState();

		// content assets
		images = this.content.images;

		// Particle objects
		particle_manager = new ISIS.ParticleManager();

		// Projectile objects
		projectile_manager =
			new ISIS.ProjectileManager(this.sprite_manager, particle_manager);

		// weapon objects
		Weapon = ISIS_weapon(this.sprite_manager, projectile_manager);

		// unit objects
		Unit = ISIS_unit(this.context, images, this.sprite_manager,
			particle_manager);

		// orders objects
		orders = ISIS_order();

		clickMainView = ( function (that) {
			return function(mousePos) {
				if (attackOrder) {
					registerAttackOrder(mousePos);
				}
				attackOrder = false;
			};
		} )(this);

		clickBar = ( function (that) {
			return function(mousePos) {
				// click on a button
				if (mousePos.x < buttonWidth) {
					attackOrder = !attackOrder;
				} else if (mousePos.x > that.canvas.clientWidth
					- buttonWidth) {
					// Go button
					player.carryOut();
				}
			};
		} )(this);


		clickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.io.getMousePos(that.canvas, evt);

				// clip to the section of the screen
				if (mousePos.x < that.canvas.clientWidth &&
					mousePos.y < that.canvas.clientHeight) {
					clickMainView(mousePos);
				}
				if (mousePos.y > (that.canvas.clientHeight - barHeight)) {
					clickBar(mousePos);
				}
			};
		} )(this);


		// Add an event listener for mouse clicks
		this.canvas.addEventListener('click', clickHandler);

		dispose = function () {
			projectile_manager.dispose();
			particle_manager.dispose();
			this.sprite_manager.dispose();
			playerFleetView.dispose();
			enemyFleetView.dispose();
			player = null;
			enemy = null;
			this.canvas.removeEventListener('click', clickHandler);
		};

		this.update = update;
		this.initialize = initialize;
		this.dispose = dispose;

	};
}
