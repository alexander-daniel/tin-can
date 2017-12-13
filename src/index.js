const IS_BROWSER = typeof(window) !== 'undefined' ? true : false;

module.exports = {
  Server: IS_BROWSER ? {} : require('./server'),
  Client: require('./client')
};
