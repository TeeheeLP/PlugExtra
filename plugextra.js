//	PlugExtra by Jonas "TeeheeKeiken" Tödter is licensed under a Creative Commons 
//	Attribution-NonCommercial-NoDerivs 3.0 Unported License.
//	http://creativecommons.org/licenses/by-nc-nd/3.0/
//
//	When sharing PlugExtra the official PlugExtra website has to be mentioned.
//	http://teeheelp.github.io/PlugExtra/
//
//	Author: Jonas "TeeheeKeiken" Tödter

function startBot()
{
var scr = document.createElement("script");
scr.id = "plugextra";
scr.src = ('https://raw.github.com/TeeheeLP/PlugExtra/master/plugextra-x.js');
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
		var movex = e.pageX - oldcx;
		var movey = e.pageY - oldcy;
		oldcx = e.pageX;
		oldcy = e.pageY;
		
		log.style.right = (parseFloat(log.style.right) - movex) + "px";
		
		log.style.top = (parseFloat(log.style.top) + movey) + "px";
	}
	if (doresize)
	{
		log.style.transition = "";
		log.style.webkitTransition = "";

		var movex = e.pageX - oldcx;
		var movey = e.pageY - oldcy;
		oldcx = e.pageX;
		oldcy = e.pageY;
		
		if (parseFloat(log.style.width) > 93 || movex > 0)
		{
			log.style.width = (parseFloat(log.style.width) + movex * 2) + "px";
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

var elem = document.createElement("div");
elem.id = "log";
elem.style.color = "lightgray";
elem.style.position = "relative";
elem.style.top = "288px";
elem.style.display = "block";
elem.style.zIndex = "15";
elem.style.textShadow ="0px 0px 2px black";
elem.style.height = "271px";
elem.style.width = "837px";
elem.style.overflowY = "scroll";
elem.style.margin = "auto";
elem.style.borderTop = "5px solid #333333";
elem.style.borderBottom = "5px solid #333333";
elem.style.padding = "5px";
elem.style.backgroundColor = "#050505";
elem.style.opacity = "0.8";
//elem.style.boxShadow = "1px 1px 2px 1px #444444 inset";
elem.style.transition = "background 0.5s, opacity 0.5s, height 0.5s";
elem.style.webkitTransition = "background 0.5s, opacity 0.5s, height 0.5s";
elem.style.right = "177px";
//elem.style.resize = "both";
elem.setAttribute("onmousedown", "isclicked = true;");
elem.setAttribute("ondblclick", "resetLayout();");
//elem.setAttribute("onmousemove", "dragLog(event);");
//elem.setAttribute("onmouseup", "stopDrag();");

document.body.appendChild(elem);

$(document).mousemove(function(event) { dragLog(event); });
$(document).mouseup(function() { stopDrag(); });

setTimeout(function(){startBot()}, 0);
