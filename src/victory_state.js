//victory state object
var ISIS_VictoryState = function () {
	return function (previous_state) {
		var background = null;

		var clientWidth = 0;
		var clientheight = 0;

		this.initialize = function () {
			clientWidth = $(document).width();
			clientHeight = $(document).height();

			var background_dims = {x: 500, y: 175};
			var background_pos = {
					x: (clientWidth - 500) / 2,
					y: (clientHeight - 300) / 2
				};
			background = new this.sprite_manager.RectangleSprite({
				"dimensions" : background_dims,
				"position" : background_pos,
				"colour" : "#444444"
			});

			var win_text = new this.sprite_manager.TextSprite({
				"text" : "You Win!",
				"font" : "45px Laconic",
				"colour": "#00EE00"
			});
			var text_pos = {
				x: background_pos.x +
					(background_dims.x - win_text.dimensions.x) / 2,
				y: background_pos.y + 25
			};
			win_text.moveTo(text_pos);


			// add the again button
			var button_dims = {x: 150, y: 50};
			var button_pos = {
				x: background_pos.x + 25,
				y: (background_pos.y + background_dims.y) -
					(button_dims.y + 25)
			};
			var againHandler = function (that) {
				return function () {
					that.game.changeState(new ISIS.BattleState(), true);
					that.dispose();
				};
			}(this);
			var again_button = new button_manager.Button({
				"dimensions" : button_dims,
				"position" : button_pos,
				"active_colour" : "#444444",
				"inactive_colour" : "#666666",
				"text" : "Play Again",
				"font" : "18px Laconic",
				"font_active_colour" : "green",
				"font_inactive_colour" : "black",
				"handler" : againHandler
			});
			button_pos.x = (background_pos.x + background_dims.x) -
					(button_dims.x + 25)
			var backHandler = function (that) {
				return function () {
					window.location = "http://www.michaelhoyle.com";
					that.dispose();
				};
			}(this);
			back_button = new button_manager.Button({
				"dimensions" : button_dims,
				"position" : button_pos,
				"active_colour" : "#444444",
				"inactive_colour" : "#666666",
				"text" : "Go back",
				"font" : "18px Laconic",
				"font_active_colour" : "green",
				"font_inactive_colour" : "black",
				"handler" : backHandler
			});

			this.__proto__.initialize.call(this);
		};

		this.update = function (elapsed) {
			// reset the window size
			clientWidth = $(document).width();
			clientHeight = $(document).height();

			// Prepare for next round of drawing
			this.context.clearRect(0, 0, clientWidth, clientHeight);
			this.context.reset();

			if (!this.initialized) {
				this.initialize();
			}

			// draw the parent state
			previous_state.update(elapsed);

			this.__proto__.update.call(this, elapsed);
		};

		// get the proto
		this.__proto__ = new ISIS.GameState();

		// set up components
		var button_manager = new ISIS.ButtonManager({
			"sprite_manager" : this.sprite_manager,
			"clickable_manager" : this.clickable_manager
		});
		this.addComponent(button_manager);

		var clickHandler = ( function (that) {
			return function (evt) {
				var mousePos = that.IO.getMousePos(evt);

				that.clickable_manager.check(mousePos);
			};
		} )(this);

		this.IO.click = clickHandler;

		this. dispose = function () {
			button_manager.dispose();
			this.canvas.removeEventListener('click', clickHandler);
			previous_state.dispose();
			this.__proto__.dispose.call(this);
		};

	};
};
