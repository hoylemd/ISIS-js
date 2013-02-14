// Manager prototype / factory
ISIS_manager = function () {
	// closure - define the prototype
	var manager_prototype = {

		// update all managed objects
		update : function (elapsed) {
			var obj = null;
			for (index in this.object_list) {
				obj = this.object_list[index];
				if (obj && obj.update) {
					obj.update();
				}
			}
		},

		// add the object to the list,
		// return the object for cascading calls
		add : function (obj) {
			this.object_list.push(obj);
			return obj
		},

		// remove an object
		// returns this manager for cascading calls
		remove : function (obj) {
			var index = null;
			if (obj) {
				for (index in this.object_list){
					if (this.object_list[index] === obj) {
						this.object_list.splice(index,1);
					}
				}
			}
			return this;
		},

		type_proto : {
			manager : this
		},

		// create a basic managed object with link to this manager
		// automatically manages the object
		create : function () {
			var new_object = {
				__proto__ : this.type_proto,
				manager : null
			};

			return this.add(new_object);
		},

	};

	return function () {
		return new_manager = {
			__proto__ : manager_prototype,
			object_list : []
		};
	};
}();
