class CookieService{
 attachCookiesToResponse({res, token}){
   const oneDay = 1000 * 60 * 60 *24
   res.cookie('token', token, {
     httpOnly: true,
     expires: new Date(Date.now() + oneDay ),
     secure: process.env.NODE_ENV === "production",
     signed: true
   })
 }
  removeCookies({res}){
    res.cookie('token', 'logout', {
      httpOnly: true,
      expires: new Date(Date.now())
    })
  }
}

module.exports = new CookieService()
