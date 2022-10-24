const notFoundMiddleware = async (err, req, res, next) => {
  return res.send({ msg: 'Not Found' })
}

module.exports = notFoundMiddleware
