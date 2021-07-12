module.exports = {    
    publicPath: process.env.NODE_ENV === 'production'
    ? '/checkout/' //  /dev1/account/
    : '/'      
}