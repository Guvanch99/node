class UserDto{
  constructor(model) {
    this.name = model.name
    this.userId = model._id
    this.role = model.role
  }
}

module.exports = UserDto
