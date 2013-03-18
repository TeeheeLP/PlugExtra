//	-- Basic Stuff --

var version = "1.2.9";

var playcount = 1; 
var autowoot = false;
var autojoin = false;
var isaway = false;
var willprintmsg = false;
var awaymsg = "I'm away";
var oldwaitlist = API.getWaitList();
var olddjbooth = API.getDJs();
var suffix = new Array("User", "Featured DJ", "Bouncer", "Manager", "Co-Host", "Host");
var leftwait = 0;
var leftbooth = 0;
var checkhistory = false;
var autoskip = false;

function printChat(str)
{
	Models.chat.receive({type:"update", message:("<span style='color:#00ACFF;'>" + str + "</span>")})
}

//	-------------------
//	Userlist management
//	-------------------

var dissmartcl = true;
var userlist = document.createElement("div");

function showUserList()
{
	if (!dissmartcl)
	{
		var userlist = document.getElementById("userlistx");
		userlist.style.left = "0px";
		userlist.style.opacity = "1";
		userlist.style.boxShadow = "0px 0px 10px #000000, -1px 0px #000000 inset";
		userlist.style.overflowY = "scroll";
		setTimeout(function() { dissmartcl = true; }, "500");
	}
}

userlist.id = "userlistx";
userlist.style.position = "absolute";
userlist.style.height = "97%";
userlist.style.width = "150px";
userlist.style.backgroundImage = "url('http://poke-helper.bplaced.net/images/noise.png')";
userlist.style.backgroundColor = "#070707";
userlist.style.top = "0px";
userlist.style.left = "0px";
userlist.style.transition = "left 0.5s, box-shadow 0.5s, opacity 0.3s";
userlist.style.webkitTransition = "left 0.5s, box-shadow 0.5s, opacity 0.3s";
userlist.style.color = "#FFFFFF";
userlist.style.zIndex = "9001";
userlist.style.padding = "10px";
userlist.style.overflowX = "hidden";
userlist.style.overflowY = "scroll";
userlist.style.boxShadow = "0px 0px 10px #000000, -1px -1px #000000 inset";
userlist.style.borderRight = "1px solid transparent";
userlist.onclick = function() { showUserList(); };

function hideUserList()
{
	if (dissmartcl)
	{
		var userlist = document.getElementById("userlistx");
		userlist.style.left = "-160px";
		userlist.style.boxShadow = "0px 0px 0px #000000";
		userlist.style.opacity = "0";
		setTimeout(function() { dissmartcl = false; userlist.style.overflowY = "hidden"; }, "500");
	}
}

var hidelistbut = document.createElement("div");
hidelistbut.style.backgroundColor = "#333333";
hidelistbut.style.borderRadius = "7px";
hidelistbut.style.boxShadow = "0px 0px 4px #000000, -1px 1px 1px #AAAAAA inset";
hidelistbut.style.width = "133px";
hidelistbut.style.textAlign = "center";
hidelistbut.style.height = "1.5em";
hidelistbut.style.display = "block";
hidelistbut.style.cursor = "pointer";
hidelistbut.style.lineHeight = "1.5em";
hidelistbut.style.marginBottom = "5px";
hidelistbut.style.fontSize = "1.2em";
hidelistbut.style.fontWeight = "bold";
hidelistbut.innerHTML = "Hide";
hidelistbut.onclick = function() { hideUserList(); };

userlist.appendChild(hidelistbut);

var awaymsgin = document.createElement("input");
awaymsgin.id = "awaymsginx";
awaymsgin.style.height = "1em";
awaymsgin.style.marginBottom = "5px";
awaymsgin.style.width = "121px";
awaymsgin.style.borderRadius = "5px";
awaymsgin.style.boxShadow = "1px 1px 3px #000000 inset";
awaymsgin.style.border = "1px solid #FFFFFF";
awaymsgin.style.padding = "2px 5px";
awaymsgin.style.backgroundColor = "#FFFFFF";
awaymsgin.setAttribute("onkeydown", "onPressAway(event);");
awaymsgin.value = "I'm away";

userlist.appendChild(awaymsgin);

function awayBot()
{
	if (!isaway)
	{
		var awaymsgin = document.getElementById("awaymsginx");
		if (awaymsgin.value != "" && awaymsgin.value != null)
			awaymsg = awaymsgin.value;
		else awaymsg = "I'm away";
		Models.user.changeStatus(1);
		printChat("You will now reply this message when being mentioned: " + awaymsg);
		isaway = true;
		willprintmsg = true;
		var awaybutx = document.getElementById("awaybutx");
		awaybutx.innerHTML = "Back";
		awaybutx.style.backgroundColor = "#333388";
		document.getElementById("dialog-menu-userstatus").value = 1;
	}
	else
	{
		Models.user.changeStatus(0);
		printChat("You are no longer away!");
		isaway = false;
		willprintmsg = false;
		var awaybutx = document.getElementById("awaybutx");
		awaybutx.innerHTML = "Away";
		awaybutx.style.backgroundColor = "#333333";
		document.getElementById("dialog-menu-userstatus").value = 0;
	}
}

function onPressAway(e)
{
	if (e.keyCode == 13)
		awayBot();
}

var awaybut = document.createElement("div");
awaybut.id = "awaybutx";
awaybut.style.backgroundColor = "#333333";
awaybut.style.borderRadius = "7px";
awaybut.style.boxShadow = "0px 0px 4px #000000, -1px 1px 1px #AAAAAA inset";
awaybut.style.width = "133px";
awaybut.style.textAlign = "center";
awaybut.style.height = "1.5em";
awaybut.style.display = "block";
awaybut.style.cursor = "pointer";
awaybut.style.lineHeight = "1.5em";
awaybut.style.marginBottom = "5px";
awaybut.style.fontSize = "1.2em";
awaybut.style.fontWeight = "bold";
awaybut.innerHTML = "Away";
awaybut.onclick = function() { awayBot(); };

userlist.appendChild(awaybut);

function updateCurWaitList()
{
	var users = API.getWaitList();
	var wlist = document.getElementById("waitlistx");
	wlist.innerHTML = "";
	
	for (i in users)
	{
		var user = document.createElement("li");
		user.innerHTML = users[i].username;
		user.style.color = "#D9F3FF";
		if (users[i].id == API.getSelf().id)
		{
			user.style.fontWeight = "bold";
			user.style.fontStyle = "italic";
		}
		
		wlist.appendChild(user);
	}
}

function toggleCurWaitList(list)
{
	if (list.style.maxHeight == "500px")
	{
		list.style.maxHeight = "3px";
		list.style.overflowY = "hidden";
		list.style.color = "#333333";
		list.style.backgroundColor = "#333333";
	}
	else 
	{
		list.style.maxHeight = "500px";
		list.style.color = "#FFFFFF";
		setTimeout(function() {list.style.overflowY = "auto";}, "500");
		list.style.backgroundColor = "transparent";
	}
}

var curwaitlist = document.createElement("ol");
curwaitlist.id = "waitlistx";
curwaitlist.style.margin = "0px 0px 5px 0px";
curwaitlist.style.padding = "10px 0px 0px 27px";
curwaitlist.style.transition = "max-height 0.5s, background-color 0.5s, color 0.5s";
curwaitlist.style.webkitTransition = "max-height 0.5s, background-color 0.5s, color 0.5s";
curwaitlist.style.maxHeight = "500px";
curwaitlist.style.overflowX = "visible";
curwaitlist.style.overflowY = "auto";
curwaitlist.setAttribute("onclick", "toggleCurWaitList(this);");

userlist.appendChild(curwaitlist);

var curusercount = document.createElement("div");
curusercount.id = "cusercount";
curusercount.style.textAlign = "center";
curusercount.innerHTML = API.getUsers().length + " users online";

function mentionUser(id)
{
	var users = API.getUsers();
	var chatin = document.getElementById("chat-input-field");
	for (i in users)
	{
		if (users[i].id == id)
		{
			chatin.value += "@" + users[i].username + " ";
			chatin.focus();
		}
	}
}

userlist.appendChild(curusercount);

var stafflist = document.createElement("ul");
stafflist.id = "stafflistx";
stafflist.style.listStyle = "none";
stafflist.style.padding = "0px";
stafflist.style.margin = "0px";

function refreshUserlist()
{
	var stafflist = document.getElementById("stafflistx");
	stafflist.innerHTML = "";
	var admins = API.getAdmins();
	for (var i in admins)
	{
		var user = document.createElement("li");
		user.id = "pgx" + admins[i].id;
		user.style.width = "100%";
		user.style.marginTop = "5px";
		user.style.color = "#FF3A97";
		user.style.cursor = "pointer";
		if (admins[i].status > 0)
		{
			user.style.fontStyle = "italic";
			user.style.color = "#D7498C";
		}
		user.setAttribute("onclick", "mentionUser('" + admins[i].id + "');");
		user.innerHTML = admins[i].username + " <span style='font-size:0.7em'>(Admin)</span>";		
		
		stafflist.appendChild(user);
	}
	
	var ambs = API.getAmbassadors();
	for (var i in ambs)
	{
		var user = document.createElement("li");
		user.id = "pgx" + ambs[i].id;
		user.style.width = "100%";
		user.style.marginTop = "5px";
		user.style.color = "#FF3A97";
		user.style.cursor = "pointer";
		if (ambs[i].status > 0)
		{
			user.style.fontStyle = "italic";
			user.style.color = "#D7498C";
		}
		user.setAttribute("onclick", "mentionUser('" + ambs[i].id + "');");
		user.innerHTML = ambs[i].username + " <span style='font-size:0.7em'>(Ambassador)</span>";		
		
		stafflist.appendChild(user);
	}
	
	var staff = API.getStaff();
	for (var i in staff)
	{
		var user = document.createElement("li");
		user.id = "pgx" + staff[i].id;
		user.style.width = "100%";
		user.style.marginTop = "5px";
		if (staff[i].permission > 1)
		{
			user.style.color = "#D90066";
			if (staff[i].status > 0) user.style.color = "#B72E6E";
		}
		else
		{
			user.style.color = "#5469FF";
			if (staff[i].status > 0) user.style.color = "#5B65AC";
		}
		user.style.cursor = "pointer";
		if (staff[i].status > 0) user.style.fontStyle = "italic";
		user.setAttribute("onclick", "mentionUser('" + staff[i].id + "');");
		user.innerHTML = staff[i].username + " <span style='font-size:0.7em'>(" + suffix[staff[i].permission] + ")</span>";		
		
		stafflist.appendChild(user);
	}
	
	var users = API.getUsers();
	var usersul = document.getElementById("usersulx");
	usersul.innerHTML = "";
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
			var user = document.createElement("li");
			user.id = "pgx" + users[i].id;
			user.style.width = "100%";
			user.style.marginTop = "5px";
			user.style.cursor = "pointer";
			if (users[i].status > 0)
			{
				user.style.fontStyle = "italic";
				user.style.color = "#B6B6B6";
			}
			user.setAttribute("onclick", "mentionUser('" + users[i].id + "');");
			user.innerHTML = users[i].username;
		
			usersul.appendChild(user);
		}
	}
	document.getElementById("cusercount").innerHTML = API.getUsers().length + " users online";
}
userlist.appendChild(stafflist);

var users = API.getUsers();
var usersul = document.createElement("ul");
usersul.id = "usersulx";
usersul.style.listStyle = "none";
usersul.style.padding = "0px";
usersul.style.margin = "0px";

userlist.appendChild(usersul);

document.body.appendChild(userlist);

updateCurWaitList();
refreshUserlist();
setInterval(function() { refreshUserlist(); }, "15000");

//	---------
//	
//	---------

function checkWaitList(users)
{
	updateCurWaitList();
	var newwaitlist = API.getWaitList();
	for (i in oldwaitlist)
	{
		var notinlist = true;
		for (n in newwaitlist)
		{
			if (oldwaitlist[i].id == newwaitlist[n].id)
				notinlist = false;
		}
		if (notinlist)
		{
			var djs = API.getDJs();
			for (n in djs)
			{
				if (oldwaitlist[i].id == djs[n].id)
					notinlist = false;
			}
		}
		if (notinlist)
		{
			var log = document.getElementById("log");
			var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
			document.getElementById("trackfeed" + playcount).innerHTML += "<span style='color:white'>"
				+ oldwaitlist[i].username + "</span> <span style='color:#AA44FF'>left</span> the waitlist at place <span style='color:#AA44FF'>"
				+ (parseInt(i) + 1) + "</span>.<br>";
			if (doscroll) log.scrollTop = log.scrollHeight;
			leftwait++;
		}
	}
	oldwaitlist = API.getWaitList();
}

API.addEventListener(API.WAIT_LIST_UPDATE, checkWaitList);

function checkDJBooth()
{
	var newdjbooth = API.getDJs();
	for (i in olddjbooth)
	{
		var notinlist = true;
		if (i == 0) notinlist = false;
		if (i > 0)
		{
			for (n in newdjbooth)
			{
				if (olddjbooth[i].id == newdjbooth[n].id)
					notinlist = false;
			}
			if (notinlist)
			{
				var djs = API.getDJs();
				for (n in djs)
				{
					if (olddjbooth[i].id == djs[n].id)
						notinlist = false;
				}
			}
		}
		if (notinlist)
		{
			var log = document.getElementById("log");
			var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
			document.getElementById("trackfeed" + playcount).innerHTML += "<span style='color:white'>"
				+ olddjbooth[i].username + "</span> <span style='color:#FF00BD'>left</span> the dj booth at place <span style='color:#FF00BD'>"
				+ (parseInt(i) + 1) + "</span>.<br>";
			if (doscroll) log.scrollTop = log.scrollHeight;
			leftbooth++;
		}
	}
	olddjbooth = API.getDJs();
}

API.addEventListener(API.DJ_UPDATE, checkDJBooth);

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

function checkInHistory()
{
	var history = Models.history.data;
	var media = API.getMedia();
	var inhistory = false;
	for (i in history)
	{
		if ((media.title == history[i].media.author
			&& media.author == history[i].media.title) ||
			(media.title == history[i].media.title
			&& media.author == history[i].media.author))
		{
			inhistory = true;
		}
	}
	if (inhistory)
	{
		try
		{
		if (!autoskip) document.getElementById("chat-sound").playMentionSound();
		printChat(media.title + " by " + media.author + " is in the current history!");
		if (autoskip && (API.getSelf().permission > 1 || API.getDJs()[0].id == API.getSelf().id))
		{
			API.sendChat("/me skips the current song because it is in the history.");
			new ModerationForceSkipService(Models.room.data.historyID);
		}
		}
		catch (err) { printChat(err.message); }
	}
}

API.addEventListener(API.DJ_ADVANCE, callback); 
function callback(obj) 
{ 
	if (autojoin) joinList(); 
	if (autowoot) document.getElementById("button-vote-positive").click(); 
	var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
	if (playcount > 0) 
	{ 
		var prevtrack = document.getElementById("track" + playcount); 
		prevtrack.click(); 
		prevtrack.innerHTML += " (<span style='color:white'>" + prevscore.positive + "<span> <span style='color:lime'>woots</span>, <span style='color:white'>" 
			+ prevscore.negative + "<span> <span style='color:red'>mehs</span>, <span style='color:white'>" 
			+ prevscore.curates + "<span> <span style='color:yellow'> curates</span>)"; 
		if (leftwait > 0)
		{
			prevtrack.innerHTML += " - " + leftwait + " <span style='color:#AA44FF'>left the waitlist</span>";
		}
		if (leftbooth > 0)
		{
			if (leftwait > 0) prevtrack.innerHTML += ", ";
			else prevtrack.innerHTML += " -";
			prevtrack.innerHTML += " " + leftbooth + " <span style='color:#FF00BD'>left the dj booth</span>";
		}
		leftwait = 0;
		leftbooth = 0;
	} 
	if (checkhistory)
	{
		checkInHistory();
	}
	playcount += 1;
	log = document.getElementById("log");
	log.innerHTML += "<div id='track" + playcount + "' style='text-decoration:underline;display:inline;' onclick='toggleFeedback(" + playcount 
		+ ")'>Track: <span style='color:white'>" + playcount + "</span> - <span style='color:white'>" + obj.dj.username 
		+ "</span> is playing <span style='color:white;font-weight:bold;'>" + obj.media.title 
		+ "</span> by <span style='color:white'>" + obj.media.author + "</span>.</div><div id='trackfeed" + playcount 
		+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;-webkit-transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 
	if (doscroll) log.scrollTop = log.scrollHeight; 
} 

API.addEventListener(API.CURATE_UPDATE, showcura); 
function showcura(obj) 
{ 
	log = document.getElementById("log"); 
	var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
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
		var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
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
		trackfeed.style.webkitTransition = "max-height 0.25s ease 0.25s, opacity 0.25s"; 
		trackfeed.style.maxHeight = "0px"; 
		trackfeed.style.opacity = "0"; 
		prevtrack.style.textDecoration = "none"; 
	} 
	else 
	{ 
		trackfeed.style.transition = "max-height 0.25s, opacity 0.25s ease 0.25s"; 
		trackfeed.style.webkitTransition = "max-height 0.25s, opacity 0.25s ease 0.25s"; 
		var log = document.getElementById("log"); 
		var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
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
	+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;-webkit-transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 

var expwoot = document.createElement("div");

function toggleWoot()
{
	if (autowoot)
	{
		autowoot = false;
		var expw = document.getElementById("expwoot");
		expw.style.backgroundColor = "#002200";
		expw.style.boxShadow = "1px 1px 1px #55FF55 inset, 0px 0px 0px white";
		printChat("Deactivated the autowoot bot.");
	}
	else
	{
		autowoot = true;
		document.getElementById("button-vote-positive").click();
		var expw = document.getElementById("expwoot");
		expw.style.backgroundColor = "#005500";
		expw.style.boxShadow = "1px 1px 1px #55FF55 inset, 0px 0px 2px white";
		printChat("Activated the autowoot bot.");
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
expwoot.style.zIndex = "15";
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
		printChat("Deactivated the autojoin bot.");
	}
	else if (Models.playlist.selectedPlaylistID != 0 && Models.playlist.selectedPlaylistID != ""
		&& Models.playlist.selectedPlaylistID != null)
	{
		autojoin = true;
		joinList();
		var expj = document.getElementById("expjoin");
		expj.style.backgroundColor = "#000055";
		expj.style.boxShadow = "1px 1px 1px #5555FF inset, 0px 0px 2px white";
		printChat("Activated the autojoin bot.");
	}
	else printChat("You need an active playlist to use autojoin.");
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
expjoin.style.zIndex = "15";
expjoin.style.textAlign = "center";
expjoin.style.left = "171px";
expjoin.style.cursor = "pointer";
expjoin.style.display = "block";
expjoin.onclick = function () { toggleJoin(); };
expjoin.style.textDecoration = "none";
expjoin.title = "Toggle Auto-Join";

document.body.appendChild(expjoin);

//	Realtime management

API.addEventListener(API.USER_JOIN, refreshUserlist);
API.addEventListener(API.USER_LEAVE, refreshUserlist);

//	---------------
//	Chat management
//	---------------

function checkMessage(data)
{
	if (isaway && willprintmsg)
	{
		if (data.message.search("@" + API.getSelf().username) != -1)
		{
			API.sendChat("@" + data.from + " " + awaymsg);
			willprintmsg = false;
			setTimeout(function() { willprintmsg = true; }, "30000");
		}
	}
	if (API.getUser(data.fromID).permission > 1)
	{
		var commandinfo = data.message.split(' ');
		if (commandinfo[0] == "@" + API.getSelf().username)
		{
			if (commandinfo[1] == "!disable" && autojoin)
			{
				toggleJoin();
				API.waitListLeave();
				API.sendChat("@" + data.from + " Deactivated autojoin!");
			}
		}
	}
}

API.addEventListener(API.CHAT, checkMessage);

function firstRun()
{
	printChat("Succesfully started PlugExtra! Using version " + version + "<br> \
		Enter $help to view a list of available commands or $manual to see an instruction \
		on how to use the plugin.");
	if (API.getSelf().permission > 1)
		printChat("Use $modhelp to view commands only available to mods.");
}

firstRun();

function checkOwnIn(e, chatin)
{
	var iscommand = true;
	var commandinfo = chatin.value.split(' ');
	
	if (e.keyCode == 13)
	{
		switch(commandinfo[0])
		{
			case "$help":
				printChat("Here is a list of available commands:<br> \
					( <> = optional [] = necessary )<br> \
					$manual - Shows how to use the plugin<br> \
					$help - Displays this message<br> \
					$version - Displays the current version<br> \
					$changes - Shows the newest changes<br> \
					$reset - Resets the log position<br> \
					$nick [name] - Changes your nick<br> \
					$autowoot - Toggles the autowoot bot<br> \
					$autojoin - Toggles the autojoin bot<br> \
					$back - Deactivates the awaybot<br> \
					$away &ltmessage&gt - Activates or deactivates the awaybot<br> \
					$status [status] - Changes your status<br> \
					$whois [name] - Shows information about a user<br> \
					$inhistory [on/skip/off] - Displays if the current song is in the history and \
						skips it if set to 'skip'");
				break;
			case "$version":
				printChat("Running on version " + version);
				break;
			case "$manual":
				printChat("What information do you need?<br> \
					$list: Information about the userlist<br> \
					$log: Information about the log<br> \
					$buttons: Information about the log buttons<br> \
					$awaybot: Information about the awaybot");
				break;
			case "$list":
				printChat("The userlist is at the left hand side of the screen. You can click at the very left \
					to show it if it's hidden. It contains a list of all users currently in the waitlist \
					and in the room. Clicking the waitlist will hide it if it is visible or show it if it \
					is hidden.");
				break;
			case "$log":
				printChat("The log displays information suchs as woots and mehs for the current song. \
					You can move the log in the middle of the screen by dragging it \
					with the top bar. Double click it or enter $reset to move the log back to \
					it's original position. Use the black button at its bottom right hand corner to hide \
					or show the log. You can also drag the bottom bar to resize the log.");
				break;
			case "$buttons":
				printChat("When a log button is pressed it begins to glow slightly. The blue button \
					toggles autojoin which makes you automatically join the waitlist if you're not \
					in it already, while the green button toggles autowoot which makes you woot every song.");
				break;
			case "$awaybot":
				printChat("By clicking the 'Away'-button in the userlist or using the $away command you \
					automatically reply with a specified message whenever somebody is mentioning you.");
				break;
			case "$changes":
				printChat("Changed the $inhistory command to a toggle. Also changed the cursor \
					interaction with the log.<br>New commands: $autowoot, $autojoin<br> \
					Additionally bouncers or higher can now disable autojoin with \"@username \
					!disable\". You can't use the autojoin bot without an active playlist \
					anymore.");
				break;
			case "$reset":
				var log = document.getElementById("log");
				log.style.top = "288px";
				log.style.right = "177px";
				log.style.zIndex = "8";
				var but1 = document.getElementById("togg");
				but1.style.top = "280px";
				but1.style.left = "225px";
				var but2 = document.getElementById("expwoot");
				but2.style.top = "255px";
				but2.style.left = "198px";
				var but3 = document.getElementById("expjoin");
				but3.style.top = "230px";
				but3.style.left = "171px";
				printChat("Reset the log position.");
				break;
			case "$nick":
				if (commandinfo.length > 1 && commandinfo[1] != null && commandinfo[1] != "")
				{
					var nick = "";
					for (i in commandinfo)
					{
						if (i > 0)
						{
							nick += commandinfo[i] + " ";
						}
					}
					
					if (nick != null && nick != "")
					{
						Models.user.changeDisplayName(nick);
					}
					else printChat("No nick specified.");
				}
				else printChat("No nick specified.");
				break;
			case "$autowoot":
				toggleWoot();
				break;
			case "$autojoin":
				toggleJoin();
				break;
			case "$back":
				if (isaway)
				{
					document.getElementById("awaybutx").click();
				}
				break;
			case "$away":
				if (commandinfo.length > 1 && commandinfo[1] != null && commandinfo[1] != "")
				{
					var awaymsg = "";
					for (i in commandinfo)
					{
						if (i > 0)
						{
							awaymsg += commandinfo[i] + " ";
						}
					}
					document.getElementById("awaymsginx").value = awaymsg;
				}
				document.getElementById("awaybutx").click();
				break;
			case "$status":
				if (commandinfo.length > 1 && commandinfo[1] != null && commandinfo[1] != "")
				{
					var stat = commandinfo[1].toLowerCase();
					var statint;
					switch(stat)
					{
						case "idle":
							statint = -1;
							break;
						case "available":
							statint = 0;
							break;
						case "afk":
							statint = 1;
							break;
						case "working":
							statint = 2;
							break;
						case "sleeping":
							statint = 3;
							break;
					}
					if (statint >= -1)
					{
						Models.user.changeStatus(statint);
					}
					else printChat("This is no valid status: " + stat);
				}
				else printChat("No status specified.");
				break;
			case "$whois":
				if (commandinfo.length > 1 && commandinfo[1] != null 
					&& commandinfo[1] != "")
				{
					var username = "";
					for (i in commandinfo)
					{
						if (i > 1 && commandinfo[i] != "" && commandinfo[i] != null)
							username += " ";
						if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
							username += commandinfo[i];
					}
					isvalid = false;
					var id;
					if (username[0] == '@') username = username.slice(1, username.length);
					
					var users = API.getUsers();
					for (i in users)
					{
						if (users[i].username == username)
						{
							isvalid = true;
							id = users[i].id;
						}
					}
					var user = API.getUser(id);
					
					if (isvalid)
					{
						printChat("Username: " + user.username
							+ "<br>ID: " + user.id
							+ "<br>Rank: " + suffix[user.permission]
							+ "<br>Fans: " + user.fans
							+ "<br>DJ points: " + user.djPoints
							+ "<br>Listener points: " + user.listenerPoints
							+ "<br>Curator points: " + user.curatorPoints
							+ "<br>Total points: " + (user.djPoints + user.listenerPoints
								+ user.curatorPoints));
					}
					else printChat("Couldn't find user " + username + ".");
				}
				break;
			case "$inhistory":
				if (commandinfo.length > 1 && commandinfo[1] != null 
					&& commandinfo[1] != "")
				{
					if (commandinfo[1] == "on")
					{
						printChat("You will now be notified when the current song is in \
							the history.");
						checkhistory = true;
						checkInHistory();
					}
					else if (commandinfo[1] == "skip")
					{
						printChat("Songs that are in history will now be skipped automatically.");
						checkhistory = true;
						autoskip = true;
						checkInHistory();
					}
					else if (commandinfo[1] == "off")
					{
						printChat("You will not be notified when the current song is in \
							the history anymore.");
						checkhistory = false;
					}
					else printChat("Please choose on or off.");
				}
				else printChat("Please choose on or off.");
				break;
			default:
				iscommand = false;
				break;
		}
		
		if (API.getSelf().permission > 1)
		{
			ismodcommand = true;
			switch(commandinfo[0])
			{
				case "$modhelp":
					printChat("List of mod commands:<br> \
						( <> = optional [] = necessary )<br> \
						$remove [name] - Removes a user from the waitlist or dj \
							booth<br> \
						$add [name] - Adds a user to the waitlist<br> \
						$kick [name] : &ltreason&gt - Kicks a user for \
							60 minutes and displays the given reason message<br> \
						$ban [name] : &ltreason&gt - Bans a specified user");
					break;
				case "$remove":
					if (commandinfo.length > 1 && commandinfo[1] != null 
						&& commandinfo[1] != "")
					{
						var username = "";
						for (i in commandinfo)
						{
							if (i > 1 && commandinfo[i] != "" && commandinfo[i] != null)
								username += " ";
							if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
								username += commandinfo[i];
						}
						isvalid = false;
						var id;
						if (username[0] == '@') username = username.slice(1, username.length);
						
						var waitlist = API.getWaitList();
						var djbooth = API.getDJs();
						for (n in waitlist)
						{
							if (username == waitlist[n].username)
							{
								isvalid = true;
								id = waitlist[n].id;
							}
						}
						if (!isvalid)
						{
							for (n in djbooth)
							{
								if (username == djbooth[n].username)
								{
									isvalid = true;
									id = djbooth[n].id;
								}
							}
						}
						
						if (isvalid)
						{
							new ModerationRemoveDJService(id);
						}
						else
							printChat("Couldn't find " + username + " in waitlist or dj booth.");
					}
					else printChat("No user specified.");
					break;
				case "$add":
					if (commandinfo.length > 1 && commandinfo[1] != null 
						&& commandinfo[1] != "")
					{
						var username = "";
						for (i in commandinfo)
						{
							if (i > 1 && commandinfo[i] != "" && commandinfo[i] != null)
								username += " ";
							if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
								username += commandinfo[i];
						}
						isvalid = false;
						var id;
						if (username[0] == '@') username = username.slice(1, username.length);
						
						var users = API.getUsers();
						for (i in users)
						{
							if (users[i].username == username)
							{
								isvalid = true;
								id = users[i].id;
							}
						}
						
						if (isvalid)
						{
							var waitlist = API.getWaitList();
							var djbooth = API.getDJs();
							for (i in waitlist)
							{
								if (id == waitlist[i].id)
									isvalid = false;
							}
							for (i in djbooth)
							{
								if (id == djbooth[i].id)
									isvalid = false;
							}
							if (isvalid)
							{
								new ModerationAddDJService(id);
							}
							else printChat(username + " already is a dj.");
						}
						else printChat("Can't find user " + username + ".");
					}
					else printChat("No user specified.");
					break;
				case "$ban":
				case "$kick":
					if (commandinfo.length > 1 && commandinfo[1] != null 
						&& commandinfo[1] != "")
					{
						var username = "";
						var infostart = 0;
						for (i in commandinfo)
						{
							if (commandinfo[i] == ":")
							{
								infostart = i;
								break;
							}
							if (i > 1 && commandinfo[i] != "" && commandinfo[i] != null)
								username += " ";
							if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
								username += commandinfo[i];
						}
						isvalid = false;
						var id;
						if (username[0] == '@') username = username.slice(1, username.length);
						
						var users = API.getUsers();
						for (i in users)
						{
							if (users[i].username == username)
							{
								isvalid = true;
								id = users[i].id;
							}
						}
						
						var message;
						
						if (isvalid)
						{
							message = "";
							for (var i = infostart; i < commandinfo.length; i++)
							{
								if (i > infostart + 1 && commandinfo[i] != "" && commandinfo[i] != null)
									message += " ";
								if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
									message += commandinfo[i];
							}
						}
						
						if (isvalid)
						{
							if (commandinfo[0] == "$ban")
							{
								new ModerationKickUserService(id, message, -1);
							}
							else 
							{
								new ModerationKickUserService(id, message, 60);
							}
						}
						else printChat("Can't find user " + username + ".");
					}
					else printChat("No user specified.");
					break;
				default:
					ismodcommand = iscommand;
					break;
			}
		}
		
		if (iscommand || ismodcommand)
		{
			chatin.value = "";
		}
	}
}

var chatinput = document.getElementById("chat-input-field");
chatinput.setAttribute('onkeydown', 'checkOwnIn(event, this);');
