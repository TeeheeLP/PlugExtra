var playcount = 1; 
var autowoot = false;
var autojoin = false;

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
	if (autojoin) joinList(); 
	if (autowoot) document.getElementById("button-vote-positive").click(); 
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
		trackfeed.style.transition = "max-height 0.25s ease 0.25s, opacity 0.25s"; 
		trackfeed.style.maxHeight = "0px"; 
		trackfeed.style.opacity = "0"; 
		prevtrack.style.textDecoration = "none"; 
	} 
	else 
	{ 
		trackfeed.style.transition = "max-height 0.25s, opacity 0.25s ease 0.25s"; 
		var log = document.getElementById("log"); 
		var doscroll = log.scrollTop == log.scrollHeight - log.offsetHeight; 
		trackfeed.style.maxHeight = "1000px"; 
		trackfeed.style.opacity = "1"; 
		if (doscroll) log.scrollTop = log.scrollHeight; 
		prevtrack.style.textDecoration = "underline"; 
	} 
} 

document.getElementById("log").innerHTML += "<div id='track" + (playcount) + "' style='text-decoration:underline;display:inline;' onclick='toggleFeedback(" 
	+ (playcount) + ")'>Track: <span style='color:white'>" + (playcount) + "</span> - <span style='color:white'>" + API.getDJs()[0].username 
	+ "</span> is playing <span style='color:white;font-weight:bold;'>" + API.getMedia().title
	+ "</span> by <span style='color:white'>" + API.getMedia().author + "</span>.</div><div id='trackfeed" + (playcount) 
	+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 

var expwoot = document.createElement("div");

function toggleWoot()
{
	if (autowoot)
	{
		autowoot = false;
		var expw = document.getElementById("expwoot");
		expw.style.backgroundColor = "#002200";
		expw.style.boxShadow = "1px 1px 1px #55FF55 inset, 0px 0px 0px white";
	}
	else
	{
		autowoot = true;
		document.getElementById("button-vote-positive").click();
		var expw = document.getElementById("expwoot");
		expw.style.backgroundColor = "#005500";
		expw.style.boxShadow = "1px 1px 1px #55FF55 inset, 0px 0px 2px white";
	}
}

expwoot.style.position = "relative";
expwoot.id = "expwoot";
expwoot.style.top = "255px";
expwoot.style.width = "25px";
expwoot.style.color = "white";
expwoot.style.backgroundColor = "#002200";
expwoot.style.border = "0px solid black";
expwoot.style.borderRadius = "15px";
expwoot.style.boxShadow = "1px 1px 1px #55FF55 inset";
expwoot.style.height = "25px";
expwoot.style.lineHeight = "25px";
expwoot.style.margin = "auto";
expwoot.style.zIndex = "13";
expwoot.style.textAlign = "center";
expwoot.style.left = "198px";
expwoot.style.cursor = "pointer";
expwoot.style.display = "block";
expwoot.onclick = function () { toggleWoot(); };
expwoot.style.textDecoration = "none";
expwoot.title = "Toggle Auto-Woot";

document.body.appendChild(expwoot);

var expjoin = document.createElement("div");

function toggleJoin()
{
	if (autojoin)
	{
		autojoin = false;
		var expj = document.getElementById("expjoin");
		expj.style.backgroundColor = "#000022";
		expj.style.boxShadow = "1px 1px 1px #5555FF inset, 0px 0px 0px white";
	}
	else
	{
		autojoin = true;
		joinList();
		var expj = document.getElementById("expjoin");
		expj.style.backgroundColor = "#000055";
		expj.style.boxShadow = "1px 1px 1px #5555FF inset, 0px 0px 2px white";
	}
}

expjoin.style.position = "relative";
expjoin.id = "expjoin";
expjoin.style.top = "230px";
expjoin.style.width = "25px";
expjoin.style.color = "white";
expjoin.style.backgroundColor = "#000022";
expjoin.style.border = "0px solid black";
expjoin.style.borderRadius = "15px";
expjoin.style.boxShadow = "1px 1px 1px #5555FF inset";
expjoin.style.height = "25px";
expjoin.style.lineHeight = "25px";
expjoin.style.margin = "auto";
expjoin.style.zIndex = "13";
expjoin.style.textAlign = "center";
expjoin.style.left = "171px";
expjoin.style.cursor = "pointer";
expjoin.style.display = "block";
expjoin.onclick = function () { toggleJoin(); };
expjoin.style.textDecoration = "none";
expjoin.title = "Toggle Auto-Join";

document.body.appendChild(expjoin);

//	-------------------
//	Userlist management
//	-------------------

var userlist = document.createElement("div");

function toggleUserList()
{
	var userlist = document.getElementById("userlistx");
	if (userlist.style.left == "0px")
	{
		userlist.style.left = "-160px";
		userlist.style.boxShadow = "0px 0px 0px #000000";
		setTimeout(function() { userlist.style.opacity = "0" }, "500");
	}
	else
	{
		userlist.style.left = "0px";
		userlist.style.opacity = "1";
		userlist.style.boxShadow = "0px 0px 10px #000000";
	}
}

userlist.id = "userlistx";
userlist.style.position = "absolute";
userlist.style.height = "100%";
userlist.style.width = "150px";
userlist.style.backgroundImage = "url('http://poke-helper.bplaced.net/images/noise.png')";
userlist.style.backgroundColor = "#070707";
userlist.style.top = "0px";
userlist.style.left = "0px";
userlist.style.transition = "left 0.5s, box-shadow 0.5s";
userlist.style.color = "#FFFFFF";
userlist.style.zIndex = "9001";
userlist.style.padding = "5px";
userlist.style.overflowX = "hidden";
userlist.style.overflowY = "auto";
userlist.style.boxShadow = "0px 0px 10px #000000";
userlist.style.borderRight = "1px solid transparent";
userlist.onclick = function() { toggleUserList(); };

var staff = API.getStaff();
var staffdiv = document.createElement("div");

for (var i in staff)
{
	var user = document.createElement("div");
	user.id = users[i].id;
	user.style.width = "100%";
	user.style.height = "1.5em";
	user.style.color = "#D90066";
	user.innerHTML = users[i].username;
	
	staffdiv.appendChild(user);
}
userlist.appendChild(staffdiv);

var users = API.getUsers();
var usersdiv = document.createElement("div");

for (var i in users)
{
	var cont = true;
	for (var n in staff)
	{
		if (users[i].id == staff[n].id)
			cont = false;
	}
	if (cont)
	{
		var user = document.createElement("div");
		user.id = users[i].id;
		user.style.width = "100%";
		user.style.height = "1.5em";
		user.innerHTML = users[i].username;
	
		usersdiv.appendChild(user);
	}
}
userlist.appendChild(usersdiv);

document.body.appendChild(userlist);
