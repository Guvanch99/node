class APiError extends Error{
  constructor(message, status) {
    super(message);
    this.status = status
  }

  static UnauthorizedError(){
    return new APiError('Unauthorized', 401)
  }
  static BadRequest(message){
    return new APiError(message, 400)
  }
}


module.exports = APiError
