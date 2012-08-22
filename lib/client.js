
var REQUEST = require("request");


exports.broadcast = function(name, data, callback) {

	REQUEST({
		uri: "http://127.0.0.1:9998/api/broadcast",
		method: "POST",
		form: {
			payload: JSON.stringify({
				name: name,
				data: data
			})
		}
	}, function (err, res, body) {
		if (err) {
			return (callback && callback(err));
		}
	    if (res.statusCode === 200) {
	    	return (callback && callback(null));
	    } else {
	    	return (callback && callback(new Error("Error broadcasting event! HTTP status: " + res.statusCode)));
	    }
	});
}
