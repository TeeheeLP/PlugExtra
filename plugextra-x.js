//	PlugExtra by Jonas "TeeheeKeiken" Tödter is licensed under a Creative Commons 
//	Attribution-NonCommercial-NoDerivs 3.0 Unported License.
//	http://creativecommons.org/licenses/by-nc-nd/3.0/
//
//	When sharing PlugExtra the official PlugExtra website has to be mentioned.
//	http://teeheelp.github.io/PlugExtra/
//
//	Author: Jonas "TeeheeKeiken" Tödter

//	-- Basic Stuff --

var version = "1.4.1";

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
var showannot = true;
var emojicons = Emoji._cons;
var emojimap = Emoji._map;
var pgxUsers = new Array();
var curSkinName = "original";
var logsizepgx = "276px";
var inboxpgx = new Array();
var inboxDoFillpgx = true;
var whisperUserpgx;

function requestSettings()
{
	var xmlhttp;
	xmlhttp = new XMLHttpRequest();
	xmlhttp.onload = function()
	{
		if (xmlhttp.status >= 200 && xmlhttp.readyState >= 4)
		{
			var response = xmlhttp.responseText.split("-");
			
			if (response[4] == 0)
			{
				toggleEmoji();
			}

			if (response[3] == 0)
				toggleAnnot();

			if (response[0] == 1)
				toggleWoot();
	
			if (response[1] == 1)
				toggleJoin();

			if (response[2] != null && response[2] != "")
				eval(response[2] + "x.click();");

			if (response[5] != null && response[5] != "")
				setCheckHistory(response[5]);
			
			if (response[6] == 0)
				toggleLog();
			
			if (response[7] != null && response[7] != "")
			{
				var logsizeSetting = response[7].split("#");
				
				elem.style.height = logsizeSetting[0];
				elem.style.width = logsizeSetting[1];
			}
			
			if (response[8] != null && response[8] != "")
			{
				var logposSetting = response[8].split("#");
				
				elem.style.right = logposSetting[0];
				elem.style.top = logposSetting[1];
			}
		}
	}
	xmlhttp.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", true);
	xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp.send("requestsettings=1&id=" + escape(API.getSelf().id));
}

function printChat(str)
{
	Models.chat.receive({type:"update", message:("<span style='color:#00ACFF;'> " + str + "</span>")});
}

function printNotification(str)
{
	Models.chat.receive({type:"update", message:("<span style='color:#efbf00;'> " + str + "</span>")});
}

function sendPM(at, message)
{
	if (at != null && at != "" && message != null && message != "")
	{
		var mailHTTPpgX = new XMLHttpRequest();
		mailHTTPpgX.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", true);
		mailHTTPpgX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		mailHTTPpgX.send("sendpm=1&message=" + escape(message) + "&at=" + escape(at.id) + "&from="
			+ escape(API.getSelf().id) + "&fromname=" + escape(API.getSelf().username));
	}
}

function requestPMs()
{
	var mailHTTPpgX = new XMLHttpRequest();
	mailHTTPpgX.onload = function()
	{
		if (mailHTTPpgX.status >= 200 && mailHTTPpgX.readyState >= 4)
		{
			var response = unescape(mailHTTPpgX.responseText);
			var messages = response.split("pgXFrom-");
			for (var i in messages)
			{
				var message = messages[i].split("pgXMessage-");
				if (message[0] != null && message[0] != "")
				{
					if (!inboxDoFillpgx)
					{
						printNotification(message[0] + ": " + message[1]);
						Chat.playSound();
					}
					else inboxpgx[inboxpgx.length] = message[0] + ": " + message[1];
				}
			}
			if (inboxDoFillpgx)
			{
				if (inboxpgx.length > 0) 
					printNotification("You have " + inboxpgx.length + " new " 
						+ (inboxpgx.length > 1 ? "messages" : "message") + " in your inbox!\
						<br> Type '$inbox' to read " + (inboxpgx.length > 1 ? "them." : "it."));
				inboxDoFillpgx = false;
			}
			setTimeout(function() { requestPMs(); }, 3000);
		}
	}
	mailHTTPpgX.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", true);
	mailHTTPpgX.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	mailHTTPpgX.send("requestinbox=1&id=" + escape(API.getSelf().id));
}

var UIskinVN = Lang.ui.buttonVoteNegative;
var UIskinVNS = Lang.ui.buttonVoteNegativeSelected;
var UIskinVND = Lang.ui.buttonVoteNegativeDisabled;
var UIskinVP = Lang.ui.buttonVotePositive;
var UIskinVPS = Lang.ui.buttonVotePositiveSelected;
var UIskinVPD = Lang.ui.buttonVotePositiveDisabled;
var UIbooth = document.getElementById("dj-console").style.backgroundImage;
var UIminiVP = "http://plug.dj/_/static/images/score_meta_positive.d294bbf1.png";
var UIminiVN = "http://plug.dj/_/static/images/score_meta_negative.4d264fee.png";
var UIminiCur = "http://plug.dj/_/static/images/score_meta_curate.2d21301a.png";

function loadSkin(skinname)
{
	var success = false;
	switch (skinname)
	{
		case "original":
			Lang.ui.buttonVoteNegative = UIskinVN;
			Lang.ui.buttonVoteNegativeSelected = UIskinVNS;
			Lang.ui.buttonVoteNegativeDisabled = UIskinVND
			Lang.ui.buttonVotePositive = UIskinVP;
			Lang.ui.buttonVotePositiveSelected = UIskinVPS;
			Lang.ui.buttonVotePositiveDisabled = UIskinVPD;
			document.getElementById("dj-console").style.backgroundImage = UIbooth;
			skinelem.style.borderColor = "gray";
			originalx.style.borderColor = "#00DD00"
			skinelem = originalx;
			success = true;
			break;
		case "plugextra":
			Lang.ui.buttonVoteNegative = "http://2dforts.dyndns.org/plug/ButtonVoteNegative.png";
			Lang.ui.buttonVoteNegativeSelected = "http://2dforts.dyndns.org/plug/ButtonVoteNegativeSelected.png";
			Lang.ui.buttonVoteNegativeDisabled = "http://2dforts.dyndns.org/plug/ButtonVoteNegativeDisabled.png";
			Lang.ui.buttonVotePositive = "http://2dforts.dyndns.org/plug/ButtonVotePositive.png";
			Lang.ui.buttonVotePositiveSelected = "http://2dforts.dyndns.org/plug/ButtonVotePositiveSelected.png";
			Lang.ui.buttonVotePositiveDisabled = "http://2dforts.dyndns.org/plug/ButtonVotePositiveDisabled.png";
			document.getElementById("dj-console").style.backgroundImage = "url(http://2dforts.dyndns.org/plug/DJConsole2.png)";
			skinelem.style.borderColor = "gray";
			plugextrax.style.borderColor = "#00DD00"
			skinelem = plugextrax;
			success = true;
			break;
	}
	if (success)
	{
		curSkinName = skinname;
		DB.settings.pgxSkin = skinname;
		DB.saveSettings();
	}
	
	return success;
}

function stylizeButton(but)
{
	but.style.backgroundImage = "linear-gradient(to top, #000000 0%, #575757 100%)";
	if ($.browser.webkit) 
		but.style.backgroundImage = "-webkit-linear-gradient(bottom, #000000 0%, #575757 100%)";
	if ($.browser.mozilla) 
		but.style.backgroundImage = "-moz-linear-gradient(bottom, #000000 0%, #575757 100%)";
	but.style.width = "173px";
	but.style.textAlign = "center";
	but.style.height = "1.5em";
	but.style.display = "block";
	but.style.cursor = "pointer";
	but.style.lineHeight = "1.5em";
	but.style.marginBottom = "5px";
	but.style.marginLeft = "-10px";
	but.style.fontSize = "1.2em";
	but.style.fontWeight = "bold";
}

//	------------
//	Options Menu
//	------------

var optmisopen = true;
var optcontainer = document.createElement("div");

function showOptionsMenu()
{
	if (!optmisopen)
	{
		var optmenu = document.getElementById("optionsx");
		optmenu.style.right = "0px";
		optmenu.style.opacity = "1";
		optmenu.parentNode.style.boxShadow = "0px 0px 10px #000000, -1px 0px #000000 inset";
		optmenu.parentNode.style.width = "170px";
		setTimeout(function() { optmisopen = true; }, "500");
	}
}

optcontainer.id = "optcx";
optcontainer.style.position = "absolute";
optcontainer.style.height = "100%";
optcontainer.style.width = "170px";
optcontainer.style.top = "0px";
optcontainer.style.right = "0px";
optcontainer.style.overflowX = "hidden";
optcontainer.style.overflowY = "hidden";
optcontainer.style.zIndex = "9001";
optcontainer.style.boxShadow = "0px 0px 10px #000000, -1px -1px #000000 inset";
optcontainer.style.transition = "width 0.5s";
optcontainer.style.webkitTransition = "width 0.5s";
optcontainer.setAttribute("onclick", "showOptionsMenu();");

var optionsmenu = document.createElement("div");

optionsmenu.id = "optionsx";
optionsmenu.style.position = "relative";
optionsmenu.style.height = "100%";
optionsmenu.style.width = "150px";
optionsmenu.style.backgroundImage = "linear-gradient(to left, #000000 0%, #262626 200%)";
if ($.browser.webkit) optionsmenu.style.backgroundImage = "-webkit-linear-gradient(right, #000000 0%, #262626 200%)";
if ($.browser.mozilla) optionsmenu.style.backgroundImage = "-moz-linear-gradient(right, #000000 0%, #262626 200%)";
optionsmenu.style.backgroundColor = "#070707";
optionsmenu.style.top = "0px";
optionsmenu.style.right = "0px";
optionsmenu.style.transition = "right 0.5s, box-shadow 0.5s, opacity 0.3s";
optionsmenu.style.webkitTransition = "right 0.5s, box-shadow 0.5s, opacity 0.3s";
optionsmenu.style.color = "#FFFFFF";
optionsmenu.style.zIndex = "9001";
optionsmenu.style.padding = "10px";
optionsmenu.style.overflowX = "hidden";
optionsmenu.style.overflowY = "auto";
optionsmenu.style.margin = "0px";
optionsmenu.style.fontSize = "1.2em";
optionsmenu.style.fontWeight = "bold";
optionsmenu.setAttribute("onclick", "showOptionsMenu();");

document.styleSheets[0].insertRule(".pgxButton:hover { border-width:7px !important; }", 0);

function createMenuItem(menuitem)
{
	var style = menuitem.style;
	style.textAlign = "center";
	style.cursor = "pointer";
	style.marginBottom = "10px";
	style.borderRight = "4px solid gray";
	style.borderLeft = "4px solid gray";
	style.height = "1.5em";
	style.lineHeight = "1.5em";
	style.transition = "border-width 0.15s";
	style.webkitTransition = "border-width 0.15s";
	menuitem.className = "pgxButton";
	style.backgroundImage = "linear-gradient(to top, #000000 0%, #1F1F1F 100%)";
	if ($.browser.webkit) style.backgroundImage = "-webkit-linear-gradient(bottom, #000000 0%, #1F1F1F 100%)";
	if ($.browser.mozilla) style.backgroundImage = "-moz-linear-gradient(bottom, #000000 0%, #1F1F1F 100%)";
	menuitem.width = "173px";
}

var hidemenubut = document.createElement("div");

function hideOptionsMenu()
{
	if (optmisopen)
	{
		var optmenu = document.getElementById("optionsx");
		optmenu.parentNode.style.boxShadow = "0px 0px 0px #000000";
		optmenu.parentNode.style.width = "2px";
		optmenu.style.opacity = "0";
		setTimeout(function() { optmisopen = false; }, "500");
	}
}

stylizeButton(hidemenubut);
hidemenubut.innerHTML = "Hide";
hidemenubut.onclick = function() { hideOptionsMenu(); };

optionsmenu.appendChild(hidemenubut);

var streamx = document.createElement("div");
createMenuItem(streamx);
if (!DB.settings.streamDisabled) streamx.style.borderColor = "#00DD00";
else streamx.style.borderColor = "#DD0000";
streamx.innerHTML = "Stream";
streamx.onclick = function()
{
	if (!DB.settings.streamDisabled)
	{
		API.sendChat("/stream off");
		this.style.borderColor = "#DD0000";
	}
	else
	{
		API.sendChat("/stream on");
		this.style.borderColor = "#00DD00"
	}
};

optionsmenu.appendChild(streamx);

var annotx = document.createElement("div");

function toggleAnnot()
{
	if (showannot)
	{
		showannot = false;
		printChat("You will not be notified when somebody joins or leaves the room.");
		DB.settings.showAnnot = false;
		DB.saveSettings();
		annotx.style.borderColor = "#DD0000";
	}
	else
	{
		showannot = true;
		printChat("You will now be notified when somebody joins or leaves the room.");
		DB.settings.showAnnot = true;
		DB.saveSettings();
		annotx.style.borderColor = "#00DD00"
	}
}

createMenuItem(annotx);
annotx.style.borderColor = "#00DD00";
annotx.innerHTML = "Annotations";
annotx.onmousedown = function()
{
	toggleAnnot();
};

optionsmenu.appendChild(annotx);

var emojix = document.createElement("div");

function toggleEmoji()
{
	if (Emoji._cons == "")
	{
		Emoji._cons = emojicons;
		Emoji._map = emojimap;
		emojix.style.borderColor = "#00DD00";
		DB.settings.showEmoji = true;
		DB.saveSettings();
		printChat("Activated Emojis.");
	}
	else
	{
		Emoji._cons = "";
		Emoji._map = "";
		emojix.style.borderColor = "#DD0000";
		DB.settings.showEmoji = false;
		DB.saveSettings();
		printChat("Deactivated Emojis.");
	}
}

createMenuItem(emojix);
emojix.style.borderColor = "#00DD00";
emojix.innerHTML = "Emoji";
emojix.onclick = function()
{
	toggleEmoji();
};

optionsmenu.appendChild(emojix);

var skinx = document.createElement("div");
skinx.style.marginTop = "10px";
skinx.innerHTML = "Skins:";

optionsmenu.appendChild(skinx);

var originalx = document.createElement("div");
createMenuItem(originalx);
originalx.style.borderColor = "#00DD00";
originalx.innerHTML = "Original";
originalx.onclick = function()
{
	if (skinelem != this)
	{
		this.style.borderColor = "#00DD00"
		skinelem.style.borderColor = "gray";
		skinelem = this;
		loadSkin("original");
	}
};

var skinelem = originalx;

optionsmenu.appendChild(originalx);

var plugextrax = document.createElement("div");
createMenuItem(plugextrax);
plugextrax.style.borderColor = "gray";
plugextrax.innerHTML = "PlugExtra";
plugextrax.onclick = function()
{
	if (skinelem != this)
	{
		this.style.borderColor = "#00DD00"
		skinelem.style.borderColor = "gray";
		skinelem = this;
		loadSkin("plugextra");
	}
};

optionsmenu.appendChild(plugextrax);

var inhistoryx = document.createElement("div");
inhistoryx.style.marginTop = "10px";
inhistoryx.innerHTML = "Check History:";

optionsmenu.appendChild(inhistoryx);

function setCheckHistory(opt)
{
	if (opt == "on")
	{
		printChat("You will now be notified when the current song is in \
			the history.");
		checkhistory = true;
		autoskip = false;
		inhistoryelem.style.borderColor = "gray";
		inhistoryelem = inhistoryOnx;
		inhistoryOnx.style.borderColor = "#00DD00";
		checkInHistory();
	}
	else if (opt == "skip")
	{
		printChat("Songs that are in history will now be skipped automatically.");
		checkhistory = true;
		autoskip = true;
		inhistoryelem.style.borderColor = "gray";
		inhistoryelem = inhistorySkipx;
		inhistorySkipx.style.borderColor = "#00DD00";
		checkInHistory();
	}
	else if (opt == "off")
	{
		printChat("You will not be notified when the current song is in \
			the history anymore.");
		checkhistory = false;
		autoskip = false;
		inhistoryelem.style.borderColor = "gray";
		inhistoryelem = inhistoryOffx;
		inhistoryOffx.style.borderColor = "#00DD00";
	}
	else printChat("Please choose on, skip or off.");
	
	if (opt == "on" || opt == "skip" || opt == "off")
	{
		DB.settings.pgxCheckHistory = opt;
		DB.saveSettings();
	}
}

var inhistoryOnx = document.createElement("div");
createMenuItem(inhistoryOnx);
inhistoryOnx.style.borderColor = "gray";
inhistoryOnx.innerHTML = "On";
inhistoryOnx.onclick = function()
{
	setCheckHistory("on");
};

optionsmenu.appendChild(inhistoryOnx);

var inhistorySkipx = document.createElement("div");
createMenuItem(inhistorySkipx);
inhistorySkipx.style.borderColor = "gray";
inhistorySkipx.innerHTML = "Skip";
inhistorySkipx.onclick = function()
{
	setCheckHistory("skip");
};

optionsmenu.appendChild(inhistorySkipx);

var inhistoryOffx = document.createElement("div");
createMenuItem(inhistoryOffx);
inhistoryOffx.style.borderColor = "#00DD00";
inhistoryOffx.innerHTML = "Off";
inhistoryOffx.onclick = function()
{
	setCheckHistory("off");
};

var inhistoryelem = inhistoryOffx;

optionsmenu.appendChild(inhistoryOffx);

var curStatuspgx;

function pgxSetStatus(statusname)
{
	var statint = -2;
	curStatuspgx.style.borderColor = "gray";
	
	switch(statusname)
	{
		case "idle":
			statint = -1;
			curStatuspgx = idlepgx;
			break;
		case "available":
			statint = 0;
			curStatuspgx = availablepgx;
			break;
		case "afk":
			statint = 1;
			curStatuspgx = awaypgx;
			break;
		case "working":
			statint = 2;
			curStatuspgx = workingpgx;
			break;
		case "sleeping":
			statint = 3;
			curStatuspgx = sleepingpgx;
			break;
	}
	
	curStatuspgx.style.borderColor = "#00DD00";
	
	if (statint >= -1)
	{
		Models.user.changeStatus(statint);
	}
}

var statuspgx = document.createElement("div");
statuspgx.style.marginTop = "10px";
statuspgx.innerHTML = "Status:";

optionsmenu.appendChild(statuspgx);

var idlepgx = document.createElement("div");
createMenuItem(idlepgx);
idlepgx.innerHTML = "Idle";
idlepgx.onclick = function() { pgxSetStatus("idle"); }

optionsmenu.appendChild(idlepgx);

var availablepgx = document.createElement("div");
createMenuItem(availablepgx);
availablepgx.innerHTML = "Available";
availablepgx.onclick = function() { pgxSetStatus("available"); }

optionsmenu.appendChild(availablepgx);

var awaypgx = document.createElement("div");
createMenuItem(awaypgx);
awaypgx.innerHTML = "AFK";
awaypgx.onclick = function() { pgxSetStatus("afk"); }

optionsmenu.appendChild(awaypgx);

var workingpgx = document.createElement("div");
createMenuItem(workingpgx);
workingpgx.innerHTML = "Working";
workingpgx.onclick = function() { pgxSetStatus("working"); }

optionsmenu.appendChild(workingpgx);

var sleepingpgx = document.createElement("div");
createMenuItem(sleepingpgx);
sleepingpgx.innerHTML = "Sleeping";
sleepingpgx.onclick = function() { pgxSetStatus("sleeping"); }

optionsmenu.appendChild(sleepingpgx);

switch(API.getSelf().status)
{
	case -1:
		curStatuspgx = idlepgx;
		break;
	case 0:
		curStatuspgx = availablepgx;
		break;
	case 1:
		curStatuspgx = awaypgx;
		break;
	case 2:
		curStatuspgx = workingpgx;
		break;
	case 3:
		curStatuspgx = sleepingpgx;
		break;
	default:
		curStatuspgx = availablepgx;
		break;
}

curStatuspgx.style.borderColor = "#00DD00";

function toggleWoot()
{
	if (autowoot)
	{
		autowoot = false;
		autowootx.style.borderColor = "#DD0000";
		DB.settings.pgxWoot = false;
		DB.saveSettings();
	}
	else
	{
		autowoot = true;
		document.getElementById("button-vote-positive").click();
		autowootx.style.borderColor = "#00DD00";
		DB.settings.pgxWoot = true;
		DB.saveSettings();
	}
}

function toggleJoin()
{
	if (autojoin)
	{
		autojoin = false;
		autojoinx.style.borderColor = "#DD0000";
		DB.settings.pgxJoin = false;
		DB.saveSettings();
	}
	else if (Models.playlist.selectedPlaylistID != 0 && Models.playlist.selectedPlaylistID != ""
		&& Models.playlist.selectedPlaylistID != null)
	{
		autojoin = true;
		joinList();
		autojoinx.style.borderColor = "#00DD00";
		DB.settings.pgxJoin = true;
		DB.saveSettings();
	}
	else printChat("You need an active playlist to use autojoin.");
}

var autowootx = document.createElement("div");
createMenuItem(autowootx);
autowootx.style.marginTop = "25px";
autowootx.style.borderColor = "#DD0000";
autowootx.innerHTML = "Autowoot";
autowootx.onclick = function()
{
	toggleWoot();
}

optionsmenu.appendChild(autowootx);

var autojoinx = document.createElement("div");
createMenuItem(autojoinx);
autojoinx.style.borderColor = "#DD0000";
autojoinx.innerHTML = "Autojoin";
autojoinx.onclick = function()
{
	toggleJoin();
}

optionsmenu.appendChild(autojoinx);

function toggleLog()
{
	if (elem.style.pointerEvents == "none")
	{
		elem.style.pointerEvents = "auto";
		elem.style.backgroundColor = "#050505";
		elem.style.height = logsizepgx;
		elem.style.opacity = "0.8";
		elem.scrollTop = elem.scrollHeight;
		togglelogx.style.borderColor = "#00DD00";
	}
	else 
	{
		elem.style.pointerEvents = "none";
		elem.style.backgroundColor = "transparent";
		logsizepgx = elem.style.height;
		elem.style.height = "5px";
		elem.style.opacity = "0";
		elem.scrollTop = elem.scrollHeight;
		togglelogx.style.borderColor = "#DD0000";
	}
}

var togglelogx = document.createElement("div");
createMenuItem(togglelogx);
togglelogx.style.borderColor = "#00DD00";
togglelogx.innerHTML = "Log";
togglelogx.onclick = function()
{
	toggleLog();
}

optionsmenu.appendChild(togglelogx);

var awaymsgin = document.createElement("input");
awaymsgin.id = "awaymsginx";
awaymsgin.style.height = "1em";
awaymsgin.style.marginTop = "10px";
awaymsgin.style.marginBottom = "5px";
awaymsgin.style.width = "140px";
awaymsgin.style.padding = "2px 5px";
awaymsgin.style.border = "none";
awaymsgin.style.backgroundImage = "linear-gradient(to bottom, #C2C2C2 0%, #FFFFFF 100%)";
if ($.browser.webkit) awaymsgin.style.backgroundImage = "-webkit-linear-gradient(top, #C2C2C2 0%, #FFFFFF 100%)";
if ($.browser.mozilla) awaymsgin.style.backgroundImage = "-moz-linear-gradient(top, #C2C2C2 0%, #FFFFFF 100%)";
awaymsgin.setAttribute("onkeydown", "onPressAway(event);");
awaymsgin.value = "I'm away";

optionsmenu.appendChild(awaymsgin);

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
		awaybutx.style.borderColor = "#00DD00";
	}
	else
	{
		printChat("You are no longer away!");
		isaway = false;
		willprintmsg = false;
		var awaybutx = document.getElementById("awaybutx");
		awaybutx.style.borderColor = "#DD0000";
	}
}

function onPressAway(e)
{
	if (e.keyCode == 13)
		awayBot();
}

var awaybut = document.createElement("div");
createMenuItem(awaybut);
awaybut.id = "awaybutx";
awaybut.innerHTML = "Away";
awaybut.style.borderColor = "#DD0000";
awaybut.onclick = function() { awayBot(); };

optionsmenu.appendChild(awaybut);

optcontainer.appendChild(optionsmenu);

document.body.appendChild(optcontainer);

//	-------------------
//	Userlist management
//	-------------------

var uslcontainer = document.createElement("div");

uslcontainer.id = "uslx";
uslcontainer.style.position = "absolute";
uslcontainer.style.height = "100%";
uslcontainer.style.width = "230px";
uslcontainer.style.top = "0px";
uslcontainer.style.left = "0px";
uslcontainer.style.padding = "0px";
uslcontainer.style.margin = "0px";
uslcontainer.style.overflowX = "hidden";
uslcontainer.style.overflowY = "hidden";

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

uslcontainer.appendChild(userlist);
document.body.appendChild(uslcontainer);

userlist.id = "userlistx";
userlist.style.position = "absolute";
userlist.style.height = "100%";
userlist.style.width = "190px";
userlist.style.backgroundImage = "linear-gradient(to right, #000000 0%, #262626 200%)";
if ($.browser.webkit) userlist.style.backgroundImage = "-webkit-linear-gradient(left, #000000 0%, #262626 200%)";
if ($.browser.mozilla) userlist.style.backgroundImage = "-moz-linear-gradient(left, #000000 0%, #262626 200%)";
userlist.style.backgroundColor = "#070707";
userlist.style.top = "0px";
userlist.style.left = "0px";
userlist.style.transition = "left 0.5s, box-shadow 0.5s, opacity 0.3s";
userlist.style.webkitTransition = "left 0.5s, box-shadow 0.5s, opacity 0.3s";
userlist.style.color = "#FFFFFF";
userlist.style.zIndex = "9001";
userlist.style.overflowX = "hidden";
userlist.style.overflowY = "scroll";
userlist.style.padding = "0px";
userlist.style.boxShadow = "0px 0px 10px #000000, -1px -1px #000000 inset";
userlist.style.borderRight = "1px solid transparent";
userlist.onclick = function() { showUserList(); };

var ulcontent = document.createElement("div");
ulcontent.style.width = "150px";
ulcontent.style.padding = "10px";

function hideUserList()
{
	if (dissmartcl)
	{
		var userlist = document.getElementById("userlistx");
		userlist.style.left = "-180px";
		userlist.style.boxShadow = "0px 0px 0px #000000";
		userlist.style.opacity = "0";
		setTimeout(function() { dissmartcl = false; userlist.style.overflowY = "hidden"; }, "500");
	}
}

var hidelistbut = document.createElement("div");
stylizeButton(hidelistbut);
hidelistbut.style.width = "173px";
hidelistbut.innerHTML = "Hide";
hidelistbut.onclick = function() { hideUserList(); };

ulcontent.appendChild(hidelistbut);

function updateCurWaitList()
{
	var users = API.getWaitList();
	var wlist = document.getElementById("waitlistx");
	wlist.innerHTML = "";
	
	for (i in users)
	{
		var user = document.createElement("li");
		user.innerHTML = users[i].username;
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
		list.style.overflow = "hidden";
		list.style.color = "#780078";
		list.style.boxShadow = "0px -3px 8px #000000 inset";
		list.style.backgroundColor = "#780078";
	}
	else 
	{
		list.style.maxHeight = "500px";
		list.style.color = "#FFFFFF";
		setTimeout(function() {list.style.overflow = "auto"; list.style.overflowX = "visible"; }, "500");
		list.style.boxShadow = "0px 0px 0px black inset";
		list.style.backgroundColor = "transparent";
	}
}

var curwaitlist = document.createElement("ol");
curwaitlist.id = "waitlistx";
curwaitlist.style.margin = "0px 0px 5px 0px";
curwaitlist.style.padding = "10px 0px 0px 27px";
curwaitlist.style.transition = "max-height 0.5s, background-color 0.5s, color 0.5s, box-shadow 0.5s";
curwaitlist.style.webkitTransition = "max-height 0.5s, background-color 0.5s, color 0.5s, box-shadow 0.5s";
curwaitlist.style.maxHeight = "500px";
curwaitlist.style.overflowX = "visible";
curwaitlist.style.overflowY = "auto";
curwaitlist.style.borderRadius = "5px";
curwaitlist.style.boxShadow = "0px 0px 0px black inset";
curwaitlist.setAttribute("onclick", "toggleCurWaitList(this);");

ulcontent.appendChild(curwaitlist);

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

ulcontent.appendChild(curusercount);

var stafflist = document.createElement("ul");
stafflist.id = "stafflistx";
stafflist.style.listStyle = "none";
stafflist.style.padding = "0px";
stafflist.style.margin = "0px";

document.styleSheets[0].insertRule(".useritemx:hover { border-width:8px !important; color:yellow !important; }", 0);

function loadUser(user, userData, rank)
{
	var votes = Models.room.data.votes;
	user.id = "pgx" + userData.id;
	user.className = "useritemx";
	user.style.color = "#FFFFFF";
	user.style.width = "100%";
	user.style.position = "relative";
	user.style.left = "-10px";
	user.style.paddingLeft = "5px";
	user.style.paddingTop = "2.5px";
	user.style.paddingBottom = "2.5px";
	user.style.borderLeft = "4px solid #444444";
	user.style.transition = "border-width 0.15s";
	user.style.webkitTransition = "border-width 0.15s";
	if (rank == "admin") user.style.color = "#FF3A97";
	user.style.cursor = "pointer";
	
	if (userData.status > 0)
	{
		user.style.fontStyle = "italic";
		if (rank == "admin") user.style.color = "#D7498C";
		if (rank == "user") user.style.color = "#B6B6B6";
	}
	
	if (rank == "staff")
	{
		user.style.color = "#D90066";
		if (userData.status > 0) user.style.color = "#B72E6E";
	}
	
	user.setAttribute("onclick", "mentionUser('" + userData.id + "');");

	user.style.background = "no-repeat left center";
	if (userData.permission > 1 || rank == "ambs") user.style.paddingLeft = "15px";
	
	if (userData.permission == 2) 
		user.style.backgroundImage = "url('http://plug.dj/_/static/images/chat_bouncer_icon.dc83d4ff.png')";
	if (userData.permission == 3) 
		user.style.backgroundImage = "url('http://plug.dj/_/static/images/chat_manager_icon.b33e31b4.png')";
	if (userData.permission == 4 && rank == "staff") 
		user.style.backgroundImage = "url('http://plug.dj/_/static/images/chat_host_icon.58967038.png')";
	if (userData.permission == 5 && rank == "staff") 
		user.style.backgroundImage = "url('http://plug.dj/_/static/images/chat_host_icon.58967038.png')";
		
	if (rank == "ambs")
	{
		user.style.backgroundImage = "url('http://plug.dj/_/static/images/chat_ambassador_icon.1638afd2.png')";
		user.style.color = "#4b336c";
		if (userData.status > 0) user.style.color = "#9A50FF";
	}
	
	user.innerHTML += userData.username;
	if (rank == "admin") user.innerHTML += " <span style='font-size:0.7em'>(Admin)</span>";
	
	if (votes[userData.id] == 1) user.style.borderColor = "#00FF00";
	else if (votes[userData.id] == -1) user.style.borderColor = "#FF0000";
	
	if (pgxUsers[userData.id])
	{
		var xU = document.createElement("img");
		xU.style.color = "#FFFFFF";
		xU.style.textShadow = "0px 0px 2px #c483c1";
		xU.style.fontStyle = "italic";
		xU.style.fontWeight = "bold";
		xU.style.marginLeft = "3px";
		xU.style.marginBottom = "-3px";
		xU.style.width = "29px";
		xU.style.height = "15px";
		xU.title = "PlugExtra User";
		xU.src = "http://teeheekeiken.bplaced.net/images/pgxIconLight.png";
		user.appendChild(xU);
	}
}

function refreshUserlist()
{	
	var votes = Models.room.data.votes;
	
	var stafflist = document.getElementById("stafflistx");
	stafflist.innerHTML = "";
	var admins = API.getAdmins();
	for (var i in admins)
	{
		var user = document.createElement("li");
		loadUser(user, admins[i], "admin");
		
		stafflist.appendChild(user);
	}
	
	var ambs = API.getAmbassadors();
	for (var i in ambs)
	{
		var user = document.createElement("li");
		loadUser(user, ambs[i], "ambs");

		stafflist.appendChild(user);
	}
	
	var staff = API.getStaff();
	for (var i in staff)
	{
		var user = document.createElement("li");
		loadUser(user, staff[i], "staff");
		
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
			loadUser(user, users[i], "user");
			
			usersul.appendChild(user);
		}
	}
	document.getElementById("cusercount").innerHTML = API.getUsers().length + " users online";
}
ulcontent.appendChild(stafflist);

var users = API.getUsers();
var usersul = document.createElement("ul");
usersul.id = "usersulx";
usersul.style.listStyle = "none";
usersul.style.padding = "0px";
usersul.style.margin = "0px";

ulcontent.appendChild(usersul);

userlist.appendChild(ulcontent);

function refreshpgXUsers()
{
	var xmlhttp3;
	xmlhttp3 = new XMLHttpRequest();
	xmlhttp3.onload = function()
	{
		if (xmlhttp.status >= 200 && xmlhttp.readyState >= 4)
		{
			var userIDs = xmlhttp3.responseText.split(";");
			pgxUsers = new Array();
			
			for (var id in userIDs)
			{
				//printChat(id + " " + userIDs[id]);
				if (userIDs[id] != "" && userIDs[id] != null)
				{
					var pgxUItem = document.getElementById("pgx" + userIDs[id]);
					//printChat("Almost... pgx" + userIDs[id]);
					if (pgxUItem != null)
					{
						//printChat(pgxUItem.innerHTML);
						pgxUsers[userIDs[id]] = true;
					}
				}
			}
		}
	}
	xmlhttp3.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", true);
	xmlhttp3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	xmlhttp3.send("requestusers=1");
}

updateCurWaitList();
refreshpgXUsers();
refreshUserlist();
setInterval(function() 
{ 
	refreshpgXUsers();
	
	refreshUserlist(); 
}, "15000");

//	---------
//	
//	---------

var xmlhttp;
xmlhttp = new XMLHttpRequest();
xmlhttp.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", true);
xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xmlhttp.send("username=" + escape(API.getSelf().username) + "&id=" + escape(API.getSelf().id) + "&logout=0");

window.onbeforeunload = function()
{
	var xmlhttp2;
	xmlhttp2 = new XMLHttpRequest();
	xmlhttp2.open("POST", "http://teeheekeiken.bplaced.net/plugextra.php", false);
	xmlhttp2.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	var checkhistoryStr = "off";
	if (checkhistory)
	{
		if (autoskip) checkhistoryStr = "skip";
		else checkhistoryStr = "on";
	}
	else checkhistoryStr = "off";
	xmlhttp2.send("username=" + escape(API.getSelf().username) + "&id=" + escape(API.getSelf().id) + "&logout=1"
		+ "&autowoot=" + (autowoot ? 1 : 0) + "&autojoin=" + (autojoin ? 1 : 0) + "&skin=" + curSkinName + "&annotations="
		+ (showannot ? 1 : 0) + "&emoji=" + ((Emoji._cons == "" ? false : true) ? 1 : 0) + "&checkhistory="
		+ checkhistoryStr + "&log=" + (elem.style.pointerEvents == "none" ? 0 : 1) + "&logsize="
		+ (elem.style.height + "#" + elem.style.width) + "&logposition="
		+ (elem.style.right + "#" + elem.style.top));
	//alert("Done saving.");
};

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

function doCheckHistory()
{
	//printChat("Started...");
	//printChat("autoskip: " + autoskip);
	//printChat("checkhistory: " + checkhistory);
	//printChat(Models.history.data[0]);
	var history = Models.history.data;
	var media = API.getMedia();
	//printChat("History: " + history.length + history[0].media.title + " " + history[0].media.author);
	//printChat("Old/New DJ: " + history[0].user.id + " | " + API.getDJs()[0].id);
	//printChat("Media: " + media.title + " " + media.author);
	var inhistory = false;
	for (i in history)
	{
		if (i == 0) i++;
		if ((i > 0 || API.getDJs()[0].id != history[i].user.id) &&
			((media.title == history[i].media.author
			&& media.author == history[i].media.title) ||
			(media.title == history[i].media.title
			&& media.author == history[i].media.author)))
		{
			inhistory = true;
		}
	}
	//printChat("inhistory: " + inhistory);
	if (inhistory)
	{
		//printChat("Success...?");
		if (!autoskip)
		{
			document.getElementById("chat-sound").playMentionSound();
			//printChat("Playing sound.");
		}
		//printChat("Is in history!");
		//printChat(media.title + " by " + media.author + " is in the current history!");
		if (autoskip && (API.getSelf().permission > 1 || API.getDJs()[0].id == API.getSelf().id))
		{
			//printChat("Got permission!");
			API.sendChat("/me skips the current song because it is in the history.");
			API.moderateForceSkip();
			//printChat("Fired skip!");
		}
	}
	//printChat("Done!");
}

function checkInHistory()
{
	//printChat("Cycling...");
	if (Models.history.hasLoaded && Models.history.data != null && Models.history.data != undefined && Models.history.data != "")
	{
		doCheckHistory();
	}
	else setTimeout(function() { Models.history.load(); checkInHistory(); Models.history.reset(); }, "5000");
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
		if (prevtrack.style.fontStyle != "italic") toggleFeedback(null, playcount);
		prevtrack.innerHTML += " <img style='height:0.7em;width:0.7em' alt='Woots' src='" + UIminiVP + "'> <span style='color:white'>" 
			+ prevscore.positive + "</span> <img style='height:0.7em;width:0.7em' alt='Mehs' src='" + UIminiVN + "'> <span style='color:white'>" 
			+ prevscore.negative + "</span> <img style='height:0.7em;width:0.7em' alt='Curates' src='" + UIminiCur + "'> <span style='color:white'>" 
			+ prevscore.curates + "<span>"; 
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
	if (obj.dj.id == API.getSelf().id) document.getElementById("chat-sound").playMentionSound();
	playcount += 1;
	log = document.getElementById("log");
	log.innerHTML += "<div id='track" + playcount 
		+ "' style='display:inline;' onmousedown='return toggleFeedback(event, " 
		+ playcount + ")'>Track: <span style='color:white'>" + playcount 
		+ "</span> - <span style='color:white'>" + obj.dj.username 
		+ "</span> is playing <a href='http://youtu.be/" + obj.media.cid 
		+ "' target='_blank'><span style='color:white;font-weight:bold;'>" + obj.media.title 
		+ "</span> by <span style='color:white'>" + obj.media.author + "</span></a>.</div><div id='trackfeed" + playcount 
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
		var vicon = document.getElementById("pgx" + obj.user.id + "v");
		if (vicon != null) vicon.setAttribute("src", obj.vote == 1 ? UIminiVP : UIminiVN);
	} 
	prevscore = API.getRoomScore(); 
	refreshUserlist();
} 

function toggleFeedback(event, track) 
{ 
	var prevtrack = document.getElementById("track" + track);
	if (event == null || event.button == 0)
	{
		var trackfeed = document.getElementById("trackfeed" + track); 
		if (trackfeed.style.maxHeight != "0px") 
		{ 
			trackfeed.style.transition = "max-height 0.25s ease 0.25s, opacity 0.25s"; 
			trackfeed.style.webkitTransition = "max-height 0.25s ease 0.25s, opacity 0.25s"; 
			trackfeed.style.maxHeight = "0px"; 
			trackfeed.style.opacity = "0"; 
			prevtrack.style.fontStyle = "italic"; 
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
			prevtrack.style.fontStyle = "normal"; 
		}
	}
	
	return true;
}

document.getElementById("log").innerHTML += "<div id='track" + (playcount) + 
	"' style='display:inline;' onmousedown='return toggleFeedback(event, " 
	+ (playcount) + ")'>Track: <span style='color:white'>" + (playcount) + "</span> - <span style='color:white'>" 
	+ API.getDJs()[0].username + "</span> is playing <a href='http://youtu.be/" + API.getMedia().cid 
	+ "' target='_blank'><span style='color:white;font-weight:bold;'>" + API.getMedia().title
	+ "</span> by <span style='color:white'>" + API.getMedia().author + "</span></a>.</div><div id='trackfeed" + (playcount) 
	+ "' style='overflow-x:hidden;max-height:1000px;transition:max-height 0.5s ease 0.5s, opacity 0.5s;-webkit-transition:max-height 0.5s ease 0.5s, opacity 0.5s;'></div><br>"; 

//	Realtime management

function onUserJoined(user)
{
	if (showannot && !Models.user.following[user.id] && !Models.user.followers[user.id])
	{
		Models.chat.receive({type:"update", message:(user.username + " joined the room.")});
	}
	refreshUserlist();
}

API.addEventListener(API.USER_JOIN, onUserJoined);

function onUserLeft(user)
{
	if (showannot)
	{
		Models.chat.receive({type:"update", message:(user.username + " left the room.")});
	}
	refreshUserlist();
}

API.addEventListener(API.USER_LEAVE, onUserLeft);

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
					$inbox - Shows your inbox<br>\
					$w [name] : [message] - Whispers a message to a user<br>\
					$r [message] - Whispers a message to the last user you whispered to<br>\
					$reset - Resets the log position<br> \
					$nick [name] - Changes your nick<br> \
					$autowoot - Toggles the autowoot bot<br> \
					$autojoin - Toggles the autojoin bot<br> \
					$back - Deactivates the awaybot<br> \
					$away &ltmessage&gt - Activates or deactivates the awaybot<br> \
					$status [status] - Changes your status<br> \
					$whois [name] - Shows information about a user<br> \
					$inhistory [on/skip/off] - Displays if the current song is in the history and \
						skips it if set to 'skip' (may glitch visuals for a few songs)<br> \
					$skin [original/plugextra] - Chooses a skin<br> \
					$annotations [on/off] - Turns annotations on or off");
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
				printChat(" 1.4.1:<br>New:<br>\
					Added whispering.<br>\
					Moved the awaybot to the options menu.<br>\
					Now remembers the log position and size.<br>\
					1.4:<br>New:<br>\
					You can now see other PlugExtra users.<br>\
					Added status buttons to the options menu.<br>\
					Moved the three buttons at the log to the options menu.<br>\
					Removed most chat messages on button presses.<br>\
					Fixed:<br>\
					The log height won't reset after collapsing it.<br>");
				break;
			case "$inbox":
				if (inboxpgx.length > 0 && inboxpgx[0] != "")
				{
					for (var i in inboxpgx)
					{
						printNotification(inboxpgx[i]);
						inboxpgx[i] = "";
					}
				}
				break;
			case "$w":
				if (commandinfo.length > 2 && commandinfo[2] != null 
						&& commandinfo[2] != "")
				{
					var username = "";
					var infostart = -1;
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
					var user;
					if (username[0] == '@') username = username.slice(1, username.length);
					
					var users = API.getUsers();
					for (i in users)
					{
						if (users[i].username == username)
						{
							isvalid = true;
							user = users[i];
						}
					}
					
					var message;
					
					if (isvalid)
					{
						message = "";
						for (var i = infostart; i < commandinfo.length; i++)
						{
							if (i > infostart && commandinfo[i] != "" && commandinfo[i] != null)
								message += " ";
							if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
								message += commandinfo[i];
						}
						message = message.slice(2, message.length);
						
						printNotification("To " + user.username + ": " + message);
						sendPM(user, message);
						whisperUserpgx = user;
					}
					else printChat("Couldn't find user " + username + ".");
				}
				break;
			case "$r":
				if (commandinfo.length > 0 && commandinfo[1] != null 
						&& commandinfo[1] != "")
				{
					if (whisperUserpgx != null && API.getUser(whisperUserpgx.id) != null)
					{
						var message = "";
						for (var i = 1; i < commandinfo.length; i++)
						{
							if (i > 1 && commandinfo[i] != "" && commandinfo[i] != null)
								message += " ";
							if (i > 0 && commandinfo[i] != "" && commandinfo[i] != null)
								message += commandinfo[i];
						}
						
						printNotification("To " + whisperUserpgx.username + ": " + message);
						sendPM(whisperUserpgx, message);
					}
				}
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
				if (autowoot) printChat("Activated autowoot.");
				else printChat("Deactivated autowoot.");
				break;
			case "$autojoin":
				toggleJoin();
				if (autojoin) printChat("Activated autojoin.");
				else printChat("Deactivated autojoin.");
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
					setCheckHistory(commandinfo[1]);
				}
				else printChat("Please choose on, skip or off.");
				break;
			case "$skin":
				if (commandinfo.length > 1 && commandinfo[1] != null 
					&& commandinfo[1] != "")
				{
					if (loadSkin(commandinfo[1])) printChat("Loaded skin " + commandinfo[1] + ".");
				}
				else printChat("Please choose a skin: original, plugextra");
				break;
			case "$annotations":
				if (commandinfo.length > 1 && commandinfo[1] != null 
					&& commandinfo[1] != "")
				{
					if (commandinfo[1] == "on")
					{
						if (!showannot) toggleAnnot();
					}
					else if (commandinfo[1] == "off")
					{
						if (showannot) toggleAnnot();
						
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
								API.moderateBanUser(id);
							}
							else 
							{
								API.moderateKickUser(id);
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
		
		if (chatin.value[0] == "$") chatin.value = "";
	}
}

var chatinput = document.getElementById("chat-input-field");
chatinput.setAttribute('onkeydown', 'checkOwnIn(event, this);');

//         ---------------
//	   Stuff that has to be done at the end
//         ---------------

requestPMs();
requestSettings();
