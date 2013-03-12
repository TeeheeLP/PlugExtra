function startBot()
{
var scr = document.createElement("script");
scr.src = ('https://raw.github.com/TeeheeLP/PlugExtra/dev/plugextra-x.js');
document.body.appendChild(scr);
}

var dodrag = false;
var oldcx;
var oldcy;

function dragLog(e)
{
	var log = document.getElementById("log");
	if (dodrag)
	{
		window.getSelection().removeAllRanges();
		if (oldcx == "" || oldcx == null)
		{
			oldcx = e.clientX;
			oldcy = e.clientY;
		}
		else
		{
			var but1 = document.getElementById("togg");
			var but2 = document.getElementById("expwoot");
			var but3 = document.getElementById("expjoin");
			var movex = e.clientX - oldcx;
			var movey = e.clientY - oldcy;
			oldcx = e.clientX;
			oldcy = e.clientY;
			
			//log.style.right = (parseFloat(log.style.right) + movex) + "px";
			log.style.top = (parseInt(log.style.top) + movey) + "px";
			log.style.right = (parseInt(log.style.right) - movex) + "px";
			log.style.zIndex = "13";
			but1.style.top = (parseInt(but1.style.top) + movey) + "px";
			but1.style.left = (parseInt(but1.style.left) + movex) + "px";
			but2.style.top = (parseInt(but2.style.top) + movey) + "px";
			but2.style.left = (parseInt(but2.style.left) + movex) + "px";
			but3.style.top = (parseInt(but3.style.top) + movey) + "px";
			but3.style.left = (parseInt(but3.style.left) + movex) + "px";
		}
	}
}

function resetLayout()
{
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
}

function stopDrag()
{
	dodrag = false; 
	oldcx = ''; 
	oldcy = ''; 
}

var elem = document.createElement("p");
elem.id = "log";
elem.style.color = "lightgray";
elem.style.position = "relative";
elem.style.top = "288px";
elem.style.display = "block";
elem.style.zIndex = "8";
elem.style.textShadow ="0px 0px 2px black";
elem.style.height = "281px";
elem.style.width = "837px";
elem.style.overflowY = "scroll";
elem.style.margin = "auto";
//elem.style.borderRadius = "5px";
elem.style.padding = "5px";
elem.style.backgroundColor = "#050505";
elem.style.opacity = "0.8";
//elem.style.boxShadow = "1px 1px 2px 1px #444444 inset";
elem.style.transition = "background 0.5s, opacity 0.5s, height 0.5s";
elem.style.right = "177px";
elem.setAttribute("onmousedown", "dodrag = true;");
elem.setAttribute("ondblclick", "resetLayout();");
elem.setAttribute("onmousemove", "dragLog(event);");
elem.setAttribute("onmouseup", "stopDrag();");
document.body.appendChild(elem);

var explog = document.createElement("div");

function toggleLog()
{
	var elem = document.getElementById("log");
	var explog = document.getElementById("togg");
	if (elem.style.pointerEvents == "none")
	{
		elem.style.pointerEvents = "auto";
		elem.style.backgroundColor = "#050505";
		elem.style.height = "281px";
		elem.style.opacity = "0.8";
		elem.scrollTop = elem.scrollHeight;
		explog.style.backgroundColor = "#111111";
		explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 2px white";
	}
	else 
	{
		elem.style.pointerEvents = "none";
		elem.style.backgroundColor = "transparent";
		elem.style.height = "5px";
		elem.style.opacity = "0";
		elem.scrollTop = elem.scrollHeight;
		explog.style.backgroundColor = "black";
		explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 0px white";
	}
}

explog.style.position = "relative";
explog.id = "togg";
explog.style.top = "280px";
explog.style.width = "25px";
explog.style.color = "white";
explog.style.backgroundColor = "#111111";
explog.style.border = "0px solid black";
explog.style.borderRadius = "15px";
explog.style.boxShadow = "1px 1px 1px white inset, 0px 0px 2px white";
explog.style.height = "25px";
explog.style.lineHeight = "25px";
explog.style.margin = "auto";
explog.style.zIndex = "13";
explog.style.textAlign = "center";
explog.style.left = "225px";
explog.style.cursor = "pointer";
explog.style.display = "block";
explog.onclick = function () { toggleLog(); };
explog.style.textDecoration = "none";
explog.title = "Toggle Log";

document.body.appendChild(explog);
setTimeout(function(){startBot()}, 0);
