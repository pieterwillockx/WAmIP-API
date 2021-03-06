var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var router = express.Router();

var mongoose = require('mongoose');
mongoose.connect('mongodb://papelierke:kip-rijst6@ds035995.mongolab.com:35995/whatamipaying');

var methodListSchema = mongoose.Schema({
	methodtype: String,
	methods: Array
});

var MethodList = mongoose.model('MethodList', methodListSchema);

router.get('/', function(req, res){
	res.json({ message: 'Welcome to the WAmIP API!'});
});

router.get('/methodlist', function(req, res){
	MethodList.find({}, function(err, items){
		if(err){
			res.send(err);
		}else{
			res.json({ data : items });
		}
	});
});

router.get('/methodlist/:methodtype', function(req, res){
	MethodList.findOne({ 'methodtype' : req.params.methodtype }, 
		function(err, item){
			if(err){
				res.send(err);
			}else{
				res.json(item.methods);
			}
	});
});

app.use('/api', router);

app.listen(server_port, server_ip_address, function(){
	console.log("Listening on " + server_ip_address + ", server_port " + port);
});