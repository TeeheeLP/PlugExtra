var pgxStyle = document.createElement("link");
pgxStyle.id = "pgxStyle";
pgxStyle.type = "text/css";
pgxStyle.href = "https://raw.github.com/TeeheeLP/PlugExtra/dev/style.css";

document.getElementsByTagName('head')[0].appendChild(pgxStyle);

function startBot()
{
var scr = document.createElement("script");
scr.src = ('https://raw.github.com/TeeheeLP/PlugExtra/dev/plugextra-x.js');
document.body.appendChild(scr);
}

var isclicked = false;
var dodrag = false;
var doresize = false;
var oldcx;
var oldcy;

function dragLog(e)
{
	var log = document.getElementById("log");
	if (isclicked && e.button == 0)
	{
		if (e.pageX < (parseInt(getComputedStyle(log).marginLeft) + parseInt(log.style.width) 
			- parseInt(log.style.right) * ($.browser.webkit ? 1 : -1) - 20))
		{
			if (e.pageY < parseInt(log.style.top) + 10) 
			{
				dodrag = true;
			}
			if (e.pageY > parseInt(log.style.top) + parseInt(log.style.height) - 10) doresize = true;
		}
		else isclicked = false;
	}
	if (dodrag || doresize)
	{
		document.getSelection().removeAllRanges();
   		if ($.browser.webkit) document.getSelection().empty();
		if (oldcx == "" || oldcx == null)
		{
			oldcx = e.pageX;
			oldcy = e.pageY;
		}
	}
	if (dodrag)
	{
		var but1 = document.getElementById("togg");
		var but2 = document.getElementById("expwoot");
		var but3 = document.getElementById("expjoin");
		var movex = e.pageX - oldcx;
		var movey = e.pageY - oldcy;
		oldcx = e.pageX;
		oldcy = e.pageY;
		
		log.style.right = (parseFloat(log.style.right) - movex) + "px";
		but1.style.left = (parseFloat(but1.style.left) + movex) + "px";
		but2.style.left = (parseFloat(but2.style.left) + movex) + "px";
		but3.style.left = (parseFloat(but3.style.left) + movex) + "px";
		
		log.style.top = (parseFloat(log.style.top) + movey) + "px";
		but1.style.top = (parseFloat(but1.style.top) + movey) + "px";
		but2.style.top = (parseFloat(but2.style.top) + movey) + "px";
		but3.style.top = (parseFloat(but3.style.top) + movey) + "px";
	}
	if (doresize)
	{
		var but1 = document.getElementById("togg");
		var but2 = document.getElementById("expwoot");
		var but3 = document.getElementById("expjoin");
		log.style.transition = "";
		log.style.webkitTransition = "";

		var movex = e.pageX - oldcx;
		var movey = e.pageY - oldcy;
		oldcx = e.pageX;
		oldcy = e.pageY;
		
		if (parseFloat(log.style.width) > 93 || movex > 0)
		{
			log.style.width = (parseFloat(log.style.width) + movex * 2) + "px";
			but1.style.left = (parseFloat(but1.style.left) + movex) + "px";
			but2.style.left = (parseFloat(but2.style.left) + movex) + "px";
			but3.style.left = (parseFloat(but3.style.left) + movex) + "px";
		}
		else log.style.width = "93px";
		
		if (parseFloat(log.style.height) > 50 || movey > 0)
		{
			log.style.height = (parseFloat(log.style.height) + movey) + "px";
		}
		else log.style.height = "50px";
	}
}

function resetLayout()
{
	var log = document.getElementById("log");
	log.style.top = "288px";
	log.style.right = "177px";
	log.style.width = "837px";
	log.style.height = "271px";
	var but1 = document.getElementById("togg");
	but1.style.top = "275px";
	but1.style.left = "225px";
	var but2 = document.getElementById("expwoot");
	but2.style.top = "245px";
	but2.style.left = "195px";
	var but3 = document.getElementById("expjoin");
	but3.style.top = "215px";
	but3.style.left = "165px";
}

function stopDrag()
{
	if (isclicked || dodrag || doresize)
	{
		isclicked = false;
		dodrag = false;
		doresize = false;
		oldcx = ''; 
		oldcy = ''; 
		var log = document.getElementById("log");
		log.style.transition = "background 0.5s, opacity 0.5s, height 0.5s";
		log.style.webkitTransition = "background 0.5s, opacity 0.5s, height 0.5s";
	}
}

var elem = document.createElement("p");
elem.id = "log";
elem.className = "log";
elem.setAttribute("onmousedown", "isclicked = true;");
elem.setAttribute("ondblclick", "resetLayout();");

document.body.appendChild(elem);

var explog = document.createElement("img");

function toggleLog()
{
	var elem = document.getElementById("log");
	var explog = document.getElementById("togg");
	if (elem.style.pointerEvents == "none")
	{
		elem.style.pointerEvents = "auto";
		elem.style.backgroundColor = "#050505";
		elem.style.height = "276px";
		elem.style.opacity = "0.8";
		elem.scrollTop = elem.scrollHeight;
		explog.src = "http://2dforts.dyndns.org/plug/logon.png";
		//explog.style.backgroundColor = "#111111";
		//explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 2px white";
	}
	else 
	{
		elem.style.pointerEvents = "none";
		elem.style.backgroundColor = "transparent";
		elem.style.height = "5px";
		elem.style.opacity = "0";
		elem.scrollTop = elem.scrollHeight;
		explog.src = "http://2dforts.dyndns.org/plug/logoff.png";
		//explog.style.backgroundColor = "black";
		//explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 0px white";
	}
}

explog.style.position = "relative";
explog.id = "togg";
explog.style.top = "275px";
explog.style.width = "30px";
//explog.style.color = "white";
//explog.style.backgroundColor = "#111111";
//explog.style.border = "0px solid black";
//explog.style.borderRadius = "15px";
//explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 2px white";
explog.style.height = "30px";
//explog.style.lineHeight = "25px";
explog.style.margin = "auto";
explog.style.zIndex = "15";
//explog.style.textAlign = "center";
explog.style.left = "225px";
explog.style.cursor = "pointer";
explog.style.display = "block";
explog.onclick = function () { toggleLog(); };
//explog.style.textDecoration = "none";
explog.title = "Toggle Log";
explog.src = "http://2dforts.dyndns.org/plug/logon.png";

$(document).mousemove(function(event) { dragLog(event); });
$(document).mouseup(function() { stopDrag(); });

document.body.appendChild(explog);
setTimeout(function(){startBot()}, 0);
