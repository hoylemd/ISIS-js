// battle state object
var ISIS_battleState = function () {
	return function () {
		var images = null;

		// game state
		var paused = false;
		var substate = null;

		// fleet view objects
		var playerFleetView = null;
		var enemyFleetView = null;

		// buttons
		var attack_button;
		var go_button;

		// units
		var player = null;
		var enemy = null;

		// components
		var particle_manager = null;
		var projectile_manager = null;
		var unit_manager = null;
		var button_manager = null;

		// classes
		var Hardpoint = null;
		var Weapon = null;
		var Button = null;
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

		var enemyAI = function (unit) {
			return function(elapsed) {
				if (player.destroyed) {
					unit.clearOrder("attack");
				} else if (!unit.orders.attack && !unit.destroyed) {
					unit.registerOrder(new orders.Attack(unit, player));
				}
				unit.carryOut();
			};
		};

		// function to initialize the game
		var initialize = function() {
			var weapon = null;

			// initialize the debris libraries
			var debris_library = [images["debris1"], images["debris2"],
				images["debris3"]];

			// set up the units
			player = new unit_manager.Unit("ArkadianCruiser", {x:1, y:1}, 0,
				debris_library);
			player.name = "Arkadian Cruiser";
			player.setHull(100);
			weapon = new Weapon("Arkadian Railgun", 20, 25, 1500,
				images["bullet"], 5);
			player.addHardpoint(new Hardpoint({
				"position" : {x: -37, y: -38},
				"weapon" : weapon,
				"unit" : player
			}));
			weapon = new Weapon("Arkadian Railgun", 20, 25, 1500,
				images["bullet"], 5);
			player.addHardpoint(new Hardpoint({
				"position" : {x: 37, y: -38},
				"weapon" : weapon,
				"unit" : player
			}));

			enemy = new unit_manager.Unit("TerranCruiser", {x:1, y:1}, 0, debris_library);
			enemy.name = "Terran Cruiser";
			enemy.setHull(150);
			weapon = new Weapon("Terran Mass Driver", 15, 100, 2000,
				images["bullet"], 5);
			enemy.addHardpoint(new Hardpoint({
				"position" : {x: 23, y: -34},
				"weapon" : weapon,
				"unit" : enemy
			}));

			// set up the fleet views
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

			this.addComponent(playerFleetView, 100);
			this.addComponent(enemyFleetView, 100);

			// add the enemy AI
			enemy.AI = enemyAI(enemy);

			// enable the ai
			// enemy.registerOrder(new orders.Attack(enemy, player));
			// enemy.carryOut();

			// add the attack button
			var bar_top = clientHeight - barHeight;
			var attackHandler = function () {
				attackOrder = !attackOrder;
			};
			attack_button = new button_manager.Button({
				"dimensions" : {x: buttonWidth, y: barHeight},
				"position" : {x: 0, y: bar_top},
				"active_colour" : "#444444",
				"inactive_colour" : "#666666",
				"text" : "Attack",
				"font" : "18px Laconic",
				"font_active_colour" : "green",
				"font_inactive_colour" : "black",
				"handler" : attackHandler,
				"toggle" : true
			});

			// add the Go button
			var goHandler = function () {
				player.carryOut();
			};
			go_button = new button_manager.Button({
				"dimensions" : {x: buttonWidth, y: barHeight},
				"position" : {x: clientWidth - buttonWidth, y: bar_top},
				"active_colour" : "#444444",
				"inactive_colour" : "#666666",
				"text" : "Go",
				"font" : "18px Laconic",
				"font_active_colour" : "green",
				"font_inactive_colour" : "black",
				"handler" : goHandler
			});




			// test button
			if (TEST_BUTTON) {
				var button_dims = {x: 100, y:40};
				var button_pos = {x: 200, y: 200};
				var toggle_pos = {x: 200, y: 50};
				var testHandler = function () {
					console.log("click");
				};
				var toggleHandler = function () {
					var stat = false;
					return function () {
						stat = !stat;
						console.log ("toggle " + (stat ? "on" : "off") );
					};
				};
				var test_button = new button_manager.Button({
					"dimensions" : button_dims,
					"position" : button_pos,
					"active_colour" : "red",
					"inactive_colour" : "grey",
					"text" : "button",
					"font" : "18px Laconic",
					"font_active_colour" : "black",
					"font_inactive_colour" : "black",
					"handler" : testHandler
				});
				var toggle_button = new button_manager.Button({
					"dimensions" : button_dims,
					"position" : toggle_pos,
					"active_colour" : "red",
					"inactive_colour" : "grey",
					"text" : "toggle",
					"font" : "18px Laconic",
					"font_active_colour" : "black",
					"font_inactive_colour" : "black",
					"handler" : toggleHandler(),
					"toggle" : true
				});
			}

			// call base initializer
			this.__proto__.initialize.call(this);
		};

		// function to update the state
		var update = function (elapsed) {

			// reset the window size
			clientWidth = $(document).width();
			clientHeight = $(document).height();

			// Prepare for next round of drawing
			this.context.clearRect(0, 0, clientWidth, clientHeight);
			this.context.reset();

			// update button position
			var barTop = clientHeight - barHeight;
			attack_button.moveTo({x: 0, y: barTop});
			go_button.moveTo({x: clientWidth - buttonWidth, y: barTop});

			// initialize if needed
			if (!this.initialized) {
				this.initialize();
			}

			// check for state changes
			if (!substate) {
				if (player.destroyed) {
					console.log("you lose!");
					substate = new ISIS.DefeatState(this);
					this.game.changeState(substate);
					return;
				} else if (enemy.destroyed) {
					console.log("you win!");
					substate = new ISIS.VictoryState(this);
					this.game.changeState(substate);
					return;
				}
			}

			// call the base updater (updates all components
			this.__proto__.update.call(this, elapsed);

			// draw order lines
			if (!player.destroyed) {
				player.drawLines();
			}
		};

		// click handers
		var clickMainView = null;
		var clickHandler = null;
		var rightClickHandler = null;

		// disposer
		var dispose = null;

		// get the prototype
		this.__proto__ = new ISIS.GameState();

		// content assets
		images = this.content.images;

		// set up components
		particle_manager = new ISIS.ParticleManager();
		unit_manager = new ISIS.UnitManager(this.sprite_manager,
			particle_manager);
		projectile_manager =
			new ISIS.ProjectileManager(this.sprite_manager, particle_manager,
				unit_manager);
		button_manager = new ISIS.ButtonManager({
			"sprite_manager" : this.sprite_manager,
			"clickable_manager" : this.clickable_manager
		});
		this.addComponent(particle_manager);
		this.addComponent(unit_manager);
		this.addComponent(projectile_manager);
		this.addComponent(button_manager);

		// set up classes
		Weapon = ISIS_weapon(this.sprite_manager, projectile_manager);
		Hardpoint = ISIS_hardpoint();

		// orders objects
		orders = ISIS_order();

		// main view click handler
		clickMainView = ( function (that) {
			return function(mousePos) {
				if (attackOrder) {
					// register an attack order if the attack order is active
					if (enemy.collide(mousePos)) {
						player.registerOrder(
							new orders.Attack(player, enemy)
						);
					} else {
						player.clearOrder("attack");
					}
				}
				attackOrder = false;
				attack_button.toggle(false);
			};
		} )(this);

		// main click handler
		clickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.IO.getMousePos(evt);

				if (!that.clickable_manager.check(mousePos)) {
					// clip to the section of the screen
					if (mousePos.x < that.canvas.clientWidth &&
						mousePos.y < that.canvas.clientHeight) {
						clickMainView(mousePos);
					}
					if (mousePos.y > (that.canvas.clientHeight - barHeight)) {
						clickBar(mousePos);
					}
				}
			};
		} )(this);

		// main right click handler
		rightClickHandler = ( function (that) {
			return function (evt) {
				// get the mouse position
				var mousePos = that.IO.getMousePos(evt);

				player.registerOrder(new orders.Attack(player, mousePos));

				player.carryOut();
				// handle based on position
			};
		} )(this);

		// Add an event listener for mouse clicks
		this.IO.click = clickHandler;
		this.IO.rightClick = rightClickHandler;

		// define disposal function
		dispose = function () {
			playerFleetView.dispose();
			enemyFleetView.dispose();
			player = null;
			enemy = null;
			this.canvas.removeEventListener('click', clickHandler);
			this.__proto__.dispose.call(this);
		};

		// expose interface
		this.update = update;
		this.initialize = initialize;
		this.dispose = dispose;
	};
};
