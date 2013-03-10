var playcount = 0; 
function joinList() 
{ 
	var cont = true; 
	for (var i = 0; i < API.getWaitList().length; i++) 
	{ 
		if (API.getSelf().id == API.getWaitList()[i].id) cont = false; 
	} 
	for (var i = 0; i < API.getDJs().length; i++) 
	{ 
		if (API.getSelf().id == API.getDJs()[i].id) cont = false; 
	} 
	
	if (cont) 
	{ 
		API.waitListJoin(); 
	} 
} 

var prevscore = API.getRoomScore();

API.addEventListener(API.DJ_ADVANCE, callback); 
function callback(obj) 
{ 
	joinList(); 
	document.getElementById("button-vote-positive").click(); 
	if (playcount > 0) 
	{ 
		var prevtrack = document.getElementById("track" + playcount); 
		prevtrack.click(); 
		prevtrack.innerHTML += " (<span style='color:white'>" + prevscore.positive + "<span> <span style='color:lime'>woots</span>, <span style='color:white'>" 
			+ prevscore.negative + "<span> <span style='color:red'>mehs</span>, <span style='color:white'>" 
			+ prevscore.curates + "<span> <span style='color:yellow'> curates</span>)"; 
	} 
	playcount += 1;
	log = document.getElementById("log"); 
	var doscroll = log.scrollTop == log.scrollHeight - log.offsetHeight; 
	log.innerHTML += "<div id='track" + playcount + "' style='text-decoration:underline;display:inline;' onclick='toggleFeedback(" + playcount 
		+ ")'>Track: <span style='color:white'>" + playcount + "</span> - <span style='color:white'>" + obj.dj.username 
		+ "</span> is playing <span style='color:white;font-weight:bold;'>" + obj.media.title 
		+ "</span> by <span style='color:white'>" + obj.media.author + "</span>.</div><div id=\'trackfeed" + playcount 
		+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 
	if (doscroll) log.scrollTop = log.scrollHeight; 
} 

API.addEventListener(API.CURATE_UPDATE, showcura); 
function showcura(obj) 
{ 
	log = document.getElementById("log"); 
	var doscroll = log.scrollTop == log.scrollHeight - log.offsetHeight; 
	var trackfeed = document.getElementById("trackfeed" + playcount); 
	trackfeed.innerHTML += "<span style='color:white'>" + obj.user.username + "</span> <span style='color:yellow'>added</span> the current song.<br>"; 
	if (doscroll) log.scrollTop = log.scrollHeight; 
	prevscore = API.getRoomScore(); 
} 

API.addEventListener(API.VOTE_UPDATE, showvoter); 
function showvoter(obj) 
{ 
	var vote = obj.vote == 1 ? "woot" : "meh"; 
	var spancolor = obj.vote == 1 ? "lime" : "red"; 
	if (document.getElementById(obj.user.id + playcount) == null) 
	{ 
		var log = document.getElementById("log"); 
		var doscroll = log.scrollTop == log.scrollHeight - log.offsetHeight; 
		var trackfeed = document.getElementById("trackfeed" + playcount); 
		trackfeed.innerHTML += "<span style='color:white'>" + obj.user.username + "</span> voted <span id=\'" + obj.user.id + playcount + "' style='color:" 
			+ spancolor + "'>" + vote + "</span>.<br>"; 
		if (doscroll) log.scrollTop = log.scrollHeight; 
	} 
	else 
	{
		var oldvote = document.getElementById(obj.user.id + playcount); 
		oldvote.style.color = spancolor; 
		oldvote.innerHTML = vote; 
	} 
	prevscore = API.getRoomScore(); 
} 

function toggleFeedback(track) 
{ 
	var prevtrack = document.getElementById("track" + track); 
	var trackfeed = document.getElementById("trackfeed" + track); 
	if (trackfeed.style.maxHeight != "0px") 
	{ 
		trackfeed.style.transition = "max-height 0.5s ease 0.5s, opacity 0.5s"; 
		trackfeed.style.maxHeight = "0px"; 
		trackfeed.style.opacity = "0"; 
		prevtrack.style.textDecoration = "none"; 
	} 
	else 
	{ 
		trackfeed.style.transition = "max-height 0.5s, opacity 0.5s ease 0.5s"; 
		var log = document.getElementById("log"); 
		var doscroll = log.scrollTop == log.scrollHeight - log.offsetHeight; 
		trackfeed.style.maxHeight = "1000px"; 
		trackfeed.style.opacity = "1"; 
		if (doscroll) log.scrollTop = log.scrollHeight; 
		prevtrack.style.textDecoration = "underline"; 
	} 
} 

document.getElementById("log").innerHTML += "<div id='track" + (playcount + 1) + "' style='text-decoration:underline;display:inline;' onclick='toggleFeedback(" 
	+ (playcount + 1) + ")'>Track: <span style='color:white'>" + (playcount + 1) + "</span> - <span style='color:white'>" + API.getDJs()[0].username 
	+ "</span> is playing <span style='color:white;font-weight:bold;'>" + API.getMedia().title
	+ "</span> by <span style='color:white'>" + API.getMedia().author + "</span>.</div><div id='trackfeed" + (playcount + 1) 
	+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 

var obj;
callback(obj);