/*var pgxStyle = document.createElement("link");
pgxStyle.id = "pgxStyle";
pgxStyle.rel = "stylesheet";
pgxStyle.type = "text/css";
pgxStyle.href = "https://raw.github.com/TeeheeLP/PlugExtra/dev/style.css";

document.getElementsByTagName('head')[0].appendChild(pgxStyle);

document.styleSheets[document.styleSheets.length - 1].insertRule("#reloader", "color:#000000");*/



function startBot()
{
var scr = document.createElement("script");
scr.id = "plugextra";
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
elem.style.color = "lightgray";
elem.style.position = "relative";
elem.style.top = "288px";
elem.style.display = "block";
elem.style.zIndex = "15";
elem.style.textShadow ="0px 0px 2px black";
elem.style.height = "271px";
elem.style.width = "837px";
elem.style.overflowY = "hidden";
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


// FOR TESTING PURPOSES

/* Copyright (c) 2012 HyeonJe Jun (http://github.com/noraesae)
 * Licensed under the MIT License
 */
((function ($) {

  // The default settings for the plugin
  var defaultSettings = {
    wheelSpeed: 10,
    wheelPropagation: false
  };

  $.fn.perfectScrollbar = function (suppliedSettings, option) {

    // Use the default settings
    var settings = $.extend(true, {}, defaultSettings);
    if (typeof suppliedSettings === "object") {
      // But over-ride any supplied
      $.extend(true, settings, suppliedSettings);
    } else {
      // If no settings were supplied, then the first param must be the option
      option = suppliedSettings;
    }

    if (option === 'update') {
      if ($(this).data('perfect-scrollbar-update')) {
        $(this).data('perfect-scrollbar-update')();
      }
      return $(this);
    }
    else if (option === 'destroy') {
      if ($(this).data('perfect-scrollbar-destroy')) {
        $(this).data('perfect-scrollbar-destroy')();
      }
      return $(this);
    }

    if ($(this).data('perfect-scrollbar')) {
      // if there's already perfect-scrollbar
      return $(this).data('perfect-scrollbar');
    }

    var $this = $(this).addClass('ps-container'),
        $content = $(this).children(),
        $scrollbarX = $("<div class='ps-scrollbar-x'></div>").appendTo($this),
        $scrollbarY = $("<div class='ps-scrollbar-y'></div>").appendTo($this),
        containerWidth,
        containerHeight,
        contentWidth,
        contentHeight,
        scrollbarXWidth,
        scrollbarXLeft,
        scrollbarXBottom = parseInt($scrollbarX.css('bottom'), 10),
        scrollbarYHeight,
        scrollbarYTop,
        scrollbarYRight = parseInt($scrollbarY.css('right'), 10);

    var updateContentScrollTop = function () {
      var scrollTop = parseInt(scrollbarYTop * contentHeight / containerHeight, 10);
      $this.scrollTop(scrollTop);
      $scrollbarX.css({bottom: scrollbarXBottom - scrollTop});
    };

    var updateContentScrollLeft = function () {
      var scrollLeft = parseInt(scrollbarXLeft * contentWidth / containerWidth, 10);
      $this.scrollLeft(scrollLeft);
      $scrollbarY.css({right: scrollbarYRight - scrollLeft});
    };

    var updateBarSizeAndPosition = function () {
      containerWidth = $this.width();
      containerHeight = $this.height();
      contentWidth = $content.outerWidth(false);
      contentHeight = $content.outerHeight(false);
      if (containerWidth < contentWidth) {
        scrollbarXWidth = parseInt(containerWidth * containerWidth / contentWidth, 10);
        scrollbarXLeft = parseInt($this.scrollLeft() * containerWidth / contentWidth, 10);
      }
      else {
        scrollbarXWidth = 0;
        scrollbarXLeft = 0;
        $this.scrollLeft(0);
      }
      if (containerHeight < contentHeight) {
        scrollbarYHeight = parseInt(containerHeight * containerHeight / contentHeight, 10);
        scrollbarYTop = parseInt($this.scrollTop() * containerHeight / contentHeight, 10);
      }
      else {
        scrollbarYHeight = 0;
        scrollbarYTop = 0;
        $this.scrollTop(0);
      }

      if (scrollbarYTop >= containerHeight - scrollbarYHeight) {
        scrollbarYTop = containerHeight - scrollbarYHeight;
      }
      if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
        scrollbarXLeft = containerWidth - scrollbarXWidth;
      }

      $scrollbarX.css({left: scrollbarXLeft + $this.scrollLeft(), bottom: scrollbarXBottom - $this.scrollTop(), width: scrollbarXWidth});
      $scrollbarY.css({top: scrollbarYTop + $this.scrollTop(), right: scrollbarYRight - $this.scrollLeft(), height: scrollbarYHeight});
    };

    var moveBarX = function (currentLeft, deltaX) {
      var newLeft = currentLeft + deltaX,
          maxLeft = containerWidth - scrollbarXWidth;

      if (newLeft < 0) {
        scrollbarXLeft = 0;
      }
      else if (newLeft > maxLeft) {
        scrollbarXLeft = maxLeft;
      }
      else {
        scrollbarXLeft = newLeft;
      }
      $scrollbarX.css({left: scrollbarXLeft + $this.scrollLeft()});
    };

    var moveBarY = function (currentTop, deltaY) {
      var newTop = currentTop + deltaY,
          maxTop = containerHeight - scrollbarYHeight;

      if (newTop < 0) {
        scrollbarYTop = 0;
      }
      else if (newTop > maxTop) {
        scrollbarYTop = maxTop;
      }
      else {
        scrollbarYTop = newTop;
      }
      $scrollbarY.css({top: scrollbarYTop + $this.scrollTop()});
    };

    var bindMouseScrollXHandler = function () {
      var currentLeft,
          currentPageX;

      $scrollbarX.bind('mousedown.perfect-scroll', function (e) {
        currentPageX = e.pageX;
        currentLeft = $scrollbarX.position().left;
        $scrollbarX.addClass('in-scrolling');
        e.stopPropagation();
        e.preventDefault();
      });

      $(document).bind('mousemove.perfect-scroll', function (e) {
        if ($scrollbarX.hasClass('in-scrolling')) {
          moveBarX(currentLeft, e.pageX - currentPageX);
          updateContentScrollLeft();
          e.stopPropagation();
          e.preventDefault();
        }
      });

      $(document).bind('mouseup.perfect-scroll', function (e) {
        if ($scrollbarX.hasClass('in-scrolling')) {
          $scrollbarX.removeClass('in-scrolling');
        }
      });
    };

    var bindMouseScrollYHandler = function () {
      var currentTop,
          currentPageY;

      $scrollbarY.bind('mousedown.perfect-scroll', function (e) {
        currentPageY = e.pageY;
        currentTop = $scrollbarY.position().top;
        $scrollbarY.addClass('in-scrolling');
        e.stopPropagation();
        e.preventDefault();
      });

      $(document).bind('mousemove.perfect-scroll', function (e) {
        if ($scrollbarY.hasClass('in-scrolling')) {
          moveBarY(currentTop, e.pageY - currentPageY);
          updateContentScrollTop();
          e.stopPropagation();
          e.preventDefault();
        }
      });

      $(document).bind('mouseup.perfect-scroll', function (e) {
        if ($scrollbarY.hasClass('in-scrolling')) {
          $scrollbarY.removeClass('in-scrolling');
        }
      });
    };

    // bind handlers
    var bindMouseWheelHandler = function () {
      var shouldPreventDefault = function (deltaX, deltaY) {
        var scrollTop = $this.scrollTop();
        if (scrollTop === 0 && deltaY > 0 && deltaX === 0) {
          return !settings.wheelPropagation;
        }
        else if (scrollTop >= contentHeight - containerHeight && deltaY < 0 && deltaX === 0) {
          return !settings.wheelPropagation;
        }

        var scrollLeft = $this.scrollLeft();
        if (scrollLeft === 0 && deltaX < 0 && deltaY === 0) {
          return !settings.wheelPropagation;
        }
        else if (scrollLeft >= contentWidth - containerWidth && deltaX > 0 && deltaY === 0) {
          return !settings.wheelPropagation;
        }
        return true;
      };

      $this.mousewheel(function (e, delta, deltaX, deltaY) {
        $this.scrollTop($this.scrollTop() - (deltaY * settings.wheelSpeed));
        $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));

        // update bar position
        updateBarSizeAndPosition();

        if (shouldPreventDefault(deltaX, deltaY)) {
          e.preventDefault();
        }
      });
    };

    // bind mobile touch handler
    var bindMobileTouchHandler = function () {
      var applyTouchMove = function (differenceX, differenceY) {
        $this.scrollTop($this.scrollTop() - differenceY);
        $this.scrollLeft($this.scrollLeft() - differenceX);

        // update bar position
        updateBarSizeAndPosition();
      };

      var startCoords = {},
          startTime = 0,
          speed = {},
          breakingProcess = null;

      $this.bind("touchstart.perfect-scroll", function (e) {
        var touch = e.originalEvent.targetTouches[0];

        startCoords.pageX = touch.pageX;
        startCoords.pageY = touch.pageY;

        startTime = (new Date()).getTime();

        if (breakingProcess !== null) {
          clearInterval(breakingProcess);
        }
      });
      $this.bind("touchmove.perfect-scroll", function (e) {
        var touch = e.originalEvent.targetTouches[0];

        var currentCoords = {};
        currentCoords.pageX = touch.pageX;
        currentCoords.pageY = touch.pageY;

        var differenceX = currentCoords.pageX - startCoords.pageX,
          differenceY = currentCoords.pageY - startCoords.pageY;

        applyTouchMove(differenceX, differenceY);
        startCoords = currentCoords;

        var currentTime = (new Date()).getTime();
        speed.x = differenceX / (currentTime - startTime);
        speed.y = differenceY / (currentTime - startTime);
        startTime = currentTime;

        e.preventDefault();
      });
      $this.bind("touchend.perfect-scroll", function (e) {
        breakingProcess = setInterval(function () {
          if (Math.abs(speed.x) < 0.01 && Math.abs(speed.y) < 0.01) {
            clearInterval(breakingProcess);
            return;
          }

          applyTouchMove(speed.x * 30, speed.y * 30);

          speed.x *= 0.8;
          speed.y *= 0.8;
        }, 10);
      });
    };

    var destroy = function () {
      $scrollbarX.remove();
      $scrollbarY.remove();
      $this.unbind('mousewheel');
      $this.unbind('touchstart.perfect-scroll');
      $this.unbind('touchmove.perfect-scroll');
      $this.unbind('touchend.perfect-scroll');
      $(window).unbind('mousemove.perfect-scroll');
      $(window).unbind('mouseup.perfect-scroll');
      $this.data('perfect-scrollbar', null);
      $this.data('perfect-scrollbar-update', null);
      $this.data('perfect-scrollbar-destroy', null);
    };

    var isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    var initialize = function () {
      updateBarSizeAndPosition();
      bindMouseScrollXHandler();
      bindMouseScrollYHandler();
      if (isMobile) {
        bindMobileTouchHandler();
      }
      if ($this.mousewheel) {
        bindMouseWheelHandler();
      }
      $this.data('perfect-scrollbar', $this);
      $this.data('perfect-scrollbar-update', updateBarSizeAndPosition);
      $this.data('perfect-scrollbar-destroy', destroy);
    };

    // initialize
    initialize();

    return $this;
  };
})(jQuery));
