var Item = function (data, parent) {
	this.name = data.name
	this.url = data.url
	this.items = data.items

	this.id = Item._getId(this.name)
	this.idPath = Item._getIdPath(this.id, parent ? parent.idPath : null)
}
export default Item

Item._getId = function (name) {
	return name
		.replace(/([^a-z0-9])+/gi, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase()
}

Item._getIdPath = function (id, parentIdPath) {
	return parentIdPath ? [parentIdPath, id].join('/') : id
}
