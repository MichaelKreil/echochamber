// Config
var tumblrUrl = 'http://saetchmo.tumblr.com';
var feedFilename = './echochamber.xml';



// Modules
var fs = require('fs');
var request = require('request');
var mustache = require('mustache');



// Template
var mainTemplate = fs.readFileSync('./templates/main.mustache', 'utf8');
var itemTemplate = fs.readFileSync('./templates/item.mustache', 'utf8');



// Main
generateFeed(function (xml) {
	fs.writeFileSync(feedFilename, xml, 'utf8');
})



// Tumblr2Feed Converter
function generateFeed(callback) {
	request(tumblrUrl, function (error, response, body) {
		body = body.replace(/[\s]+/g, ' ');

		var feed = {
			currentDate: formatDate(new Date()),
			title: 'echochamber',
			link: tumblrUrl,
			description: 'Basstherapie',
			generator: 'Michael Kreil',
			author: 'saetchmo',
			category: 'Music',
			items: []
		}
		
		var entries = body.split('class="datetime new">');
		entries.shift();
		entries.forEach(function (entry) {

			var date = entry.match(/^.*?<\/span>/g)[0];
			date = date.replace(/<.*?>/g, '');
			feed.items.push({
				date: formatDate(new Date(date)),
				media:    find(entry, 'href="', '#', '">Download'),
				desc:     find(entry, '<div class="caption">', '#', '</div>'),
				title:    find(entry, 'href="/archive" title="Archives" >', '#', '</a>'),
				link:     find(entry, '<a title="Permalink" class="time posted" href="', 'http://saetchmo.tumblr.com/post#', '">'),
				albumart: find(entry, '<img class="floaters" width="270" height="270" src="', '#cover.jpg', '" />'),
				author: 'saetchmo'
			});
		});

		callback(mustache.render(mainTemplate, feed, {item:itemTemplate}));
	});
};



// Utilities
function find(text, tIn, part, tOut) {
	function r(text) {
		return text.replace(/[\.\"\/]/g, function (t) {
			return '\\'+t;
		})
	}
	var regExp1 = new RegExp(    r(tIn)+'('+r(part).replace(/#/, '.*?')+')'+r(tOut));
	var regExp2 = new RegExp('.'+r(tIn)+    r(part).replace(/#/, '.*?')+    r(tOut));

	do {
		var result = text.match(regExp2);
		if (result != null) text = result[0].substr(1);
	} while (result);
	
	var result = text.match(regExp1)[1];

	return result;
}

var weekDay = ['Sun', 'Mon', 'Tue',  'Wed', 'Thu',  'Fri' , 'Sat'];
var month = ['Jan','Feb','Mar','Apr','May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
function formatDate(d) {
	d = d.getTime()+d.getTimezoneOffset()*60000;
	d = new Date(d);
	return ''+
		weekDay[d.getDay()]+
		', '+
		toRFC(d.getDate())+
		' '+
		month[d.getMonth()]+
		' '+
		toRFC(d.getFullYear(), 4)+
		' '+
		toRFC(d.getHours())+
		':'+
		toRFC(d.getMinutes())+
		':'+
		toRFC(d.getSeconds())+
		' +0000';
}

function toRFC(value, digits) {
	digits = digits || 2;
	var s = '000000000'+Math.abs(value).toFixed(0);
	s = s.substr(s.length - digits);
	if (value < 0) s = '-'+s;
	return s;
}