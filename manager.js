// Manager class
// holds a list of objects and manages them.
// this is intended to be used as a prototype, and extended.
ISIS_Manager = function () {
	// prototype
	var manager_prototype = {
		// updater
		update : function (elapsed) {
			var obj = null;

			// call all child objects update method if it exists
			for (index in this.object_list) {
				obj = this.object_list[index];
				if (obj && obj.update) {
					obj.update(elapsed);
				}
			}
		},

		// function to add an object to the managed list
		add : function (obj) {
			this.object_list.push(obj);

			// return it for cascading / external handling
			return obj
		},

		// function to remove an object from managment
		remove : function (obj) {
			var index = null;

			// find the object in the list
			if (obj) {
				for (index in this.object_list){
					if (this.object_list[index] === obj) {
						this.object_list.splice(index,1);
					}
				}
			}

			// return this for cascading calls
			return this;
		},

		// function to create a new managed object
		create : function () {
			var new_object = {
				manager : this
			};

			return this.add(new_object);
		},

		// destructor
		dispose : function () {
			var i = 0;
			for (i in this.object_list) {
				this.object_list[i].dispose()
				delete this.object_list[i]
			}
		}
	};

	// return the constructor
	return function () {
		this.__proto__ = manager_prototype;
		this.object_list = [];
	};
};
