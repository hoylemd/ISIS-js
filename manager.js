// Manager prototype / factory
ISIS_manager = ( function () {
	var manager_prototype = {
		update : function (elapsed) {
			var obj = null;
			for (index in this.object_list) {
				obj = this.object_list[index];
				if (obj && obj.update) {
					obj.update();
				}
			}
		},

		add : function (obj) {
			this.object_list.push(obj);
			return obj
		},

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

		create : function () {
			var new_object = {
				__proto__ : this.type_proto,
				manager : null
			};

			return this.add(new_object);
		},
	};

	return function () {
		this.__proto__ = manager_prototype;
		this.object_list = [];
	};
}() );
