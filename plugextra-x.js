//	-- Basic Stuff --

var version = "1.1";

var playcount = 1; 
var autowoot = false;
var autojoin = false;
var isaway = false;
var willprintmsg = false;
var awaymsg = "I'm away";
var oldwaitlist = API.getWaitList();
var olddjbooth = API.getDJs();

function printChat(str)
{
	var chatwindow = document.getElementById("chat-messages");
	var doscroll = chatwindow.scrollTop >= chatwindow.scrollHeight - chatwindow.offsetHeight; 
	chatwindow.innerHTML += "<div class='chat-update' style='color:#00ACFF;'>" + str + "</div>";
	if (doscroll) chatwindow.scrollTop = chatwindow.scrollHeight;
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
hidelistbut.style.width = "100%";
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
awaymsgin.style.width = "129px";
awaymsgin.style.borderRadius = "5px";
awaymsgin.style.boxShadow = "1px 1px 3px #000000 inset";
awaymsgin.style.border = "2px solid #FFFFFF";
awaymsgin.style.backgroundColor = "#FFFFFF";
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
		printChat("You are no longer away!");
		isaway = false;
		willprintmsg = false;
		var awaybutx = document.getElementById("awaybutx");
		awaybutx.innerHTML = "Away";
		awaybutx.style.backgroundColor = "#333333";
		document.getElementById("dialog-menu-userstatus").value = 0;
	}
}

var awaybut = document.createElement("div");
awaybut.id = "awaybutx";
awaybut.style.backgroundColor = "#333333";
awaybut.style.borderRadius = "7px";
awaybut.style.boxShadow = "0px 0px 4px #000000, -1px 1px 1px #AAAAAA inset";
awaybut.style.width = "100%";
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
		
		wlist.appendChild(user);
	}
}

var curwaitlist = document.createElement("ol");
curwaitlist.id = "waitlistx";
curwaitlist.style.margin = "0px";
curwaitlist.style.padding = "0px 0px 0px 20px";

userlist.appendChild(curwaitlist);

var curusercount = document.createElement("div");
curusercount.id = "cusercount";
curusercount.style.textAlign = "center";
curusercount.innerHTML = API.getUsers().length + " users online";

function mentionUser(id)
{
	var users = API.getUsers();
	for (i in users)
	{
		if (users[i].id == id)
			document.getElementById("chat-input-field").value += "@" + users[i].username + " ";
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
	var staff = API.getStaff();
	var stafflist = document.getElementById("stafflistx");
	stafflist.innerHTML = "";
	for (var i in staff)
	{
		var user = document.createElement("li");
		user.id = "pgx" + staff[i].id;
		user.style.width = "100%";
		user.style.marginTop = "5px";
		if (staff[i].permission > 1) user.style.color = "#D90066";
		else user.style.color = "#5469FF";
		user.style.cursor = "pointer";
		user.setAttribute("onclick", "mentionUser('" + staff[i].id + "');");
		user.innerHTML = staff[i].username;
		
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
			document.getElementById("trackfeed" + playcount).innerHTML += "<span style='color:white'>"
				+ oldwaitlist[i].username + "</span> <span style='color:#AA44FF'>left</span> the waitlist at place <span style='color:#AA44FF'>"
				+ (parseInt(i) + 1) + "</span>.<br>";
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
			document.getElementById("trackfeed" + playcount).innerHTML += "<span style='color:white'>"
				+ olddjbooth[i].username + "</span> <span style='color:#FF00BD'>left</span> the dj booth at place <span style='color:#FF00BD'>"
				+ (parseInt(i) + 1) + "</span>.<br>";
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
	var doscroll = log.scrollTop >= log.scrollHeight - log.offsetHeight; 
	log.innerHTML += "<div id='track" + playcount + "' style='text-decoration:underline;display:inline;' onclick='toggleFeedback(" + playcount 
		+ ")'>Track: <span style='color:white'>" + playcount + "</span> - <span style='color:white'>" + obj.dj.username 
		+ "</span> is playing <span style='color:white;font-weight:bold;'>" + obj.media.title 
		+ "</span> by <span style='color:white'>" + obj.media.author + "</span>.</div><div id='trackfeed" + playcount 
		+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 
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
		trackfeed.style.maxHeight = "0px"; 
		trackfeed.style.opacity = "0"; 
		prevtrack.style.textDecoration = "none"; 
	} 
	else 
	{ 
		trackfeed.style.transition = "max-height 0.25s, opacity 0.25s ease 0.25s"; 
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

/*function sortList(list)
{
	var templist = new Array;
	for (var i in list.childNodes)
	{
		if (list.childNodes[i].nodeType == 1)
			templist[i] = list.childNodes[i].innerHTML + "|" + list.childNodes[i].id;
	}
	for (var i in templist)
	{
		templist[i] = templist[i][0].toUpperCase() + templist[i];
	}
	templist.sort();
	for (var i in templist)
	{
		var str = "";
		for (var n = 1; n < templist[i].length; n++)
		{
			str += templist[i][n];
		}
		templist[i] = str;
	}
	for (var i in templist)
	{
		list.childNodes[i].innerHTML = templist[i].split("|")[0];
		list.childNodes[i].id = templist[i].split("|")[1];
		list.childNodes[i].setAttribute("onclick", "mentionUser('" + templist[i].split("|")[1].slice(3, templist[i].split("|")[1].length) + "');");
	}
}

function addToList(user)
{
	var isstaff = false;
	
	var userit = document.createElement("li");
	userit.id = "pgx" + user.id;
	userit.style.width = "100%";
	userit.style.marginTop = "5px";
	user.style.cursor = "pointer";
	user.setAttribute("onclick", "mentionUser('" + user.id + "');");
	userit.innerHTML = user.username;
	
	var staff = API.getStaff();
	for (var i in staff)
	{
		if (user.id == staff[i].id)
			isstaff = true;
	}
	
	if (isstaff)
	{
		userit.style.color = "#D90066";
		var list = document.getElementById("stafflistx");
		list.appendChild(userit);
		sortList(list);
	}
	else
	{
		var list = document.getElementById("usersulx");
		list.appendChild(userit);
		sortList(list);
	}
	document.getElementById("cusercount").innerHTML = API.getUsers().length + " users online";
}
*/
API.addEventListener(API.USER_JOIN, refreshUserlist);
/*
function removeFromList(user)
{
	var userit = document.getElementById("pgx" + user.id);
	userit.parentNode.removeChild(userit);
	document.getElementById("cusercount").innerHTML = API.getUsers().length + " users online";
}
*/
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
}

API.addEventListener(API.CHAT, checkMessage);

function firstRun()
{
	printChat("Succesfully started PlugExtra! Using version " + version + "<br> \
		Enter $help to view a list of available commands or $manual to see an instruction \
		on how to use the plugin.");
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
					$manual: Shows how to use the plugin<br> \
					$help: Displays this message<br> \
					$version: Displays the current version<br> \
					$changes: Shows the newest changes<br> \
					$reset: Resets the log position<br> \
					$away \<message\>: Activates or deactivates the awaybot");
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
					and in the room.");
				break;
			case "$log":
				printChat("The log displays information suchs as woots and mehs for the current song. \
					You can move the log in the middle of the screen by dragging it \
					with the top bar. Double click it or enter $reset to move the log back to \
					it's original position. Use the black button at its bottom right hand corner to hide \
					or show the log.");
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
				printChat("Recent changes: Added commands and the waitlist.");
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
			default:
				iscommand = false;
				break;
			if (API.getSelf().permission > 1)
			{
				iscommand = true;
				switch(commandinfo[0])
				{
					case "$modhelp":
						printChat("List of mod commands:<br> \
							$remove &ltname&gt: Removes a user from the waitlist or dj \
								booth<br> \
							");
						break;
					case "$remove":
						if (commandinfo.length > 1 && commandinfo[1] != null 
							&& commandinfo[1] != "")
						{
							var username = "";
							for (i in commandinfo)
							{
								if (i > 1)
									username += " ";
								if (i > 0)
									username += commandinfo[i];
							}
							isvalid = false;
							var id;
							username = username.slice(1, username.length);
							
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
								API.moderateRemoveDJ(id);
							else
								printChat("Couldn't find " + username + " in waitlist or dj booth.");
						}
						else printChat("No user specified.");
						break;
					default:
						iscommand = false;
						break;
				}
			}
		}
		
		if (iscommand)
		{
			chatin.value = "";
		}
	}
}

var chatinput = document.getElementById("chat-input-field");
chatinput.setAttribute('onkeydown', 'checkOwnIn(event, this);');
