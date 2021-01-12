export default class Item {
	constructor(data, parent) {
		this.name = data.name
		this.url = data.url
		this.items = data.items

		this.id = Item._getId(this.name)
		this.idPath = Item._getIdPath(this.id, parent ? parent.idPath : null)
	}

	static _getId(name) {
		return name
			.replace(/([^a-z0-9])+/gi, '-')
			.replace(/^-|-$/g, '')
			.toLowerCase()
	}

	static _getIdPath(id, parentIdPath) {
		return parentIdPath ? [parentIdPath, id].join('/') : id
	}
}
