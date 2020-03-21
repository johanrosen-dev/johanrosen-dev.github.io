var numberOfPages;
var currentPage = 0;
var lastPage = 0;
var pageOffset = 20;
var translateAnimations = false;
var youtubeSync = true;
var $grid;
var transformMatrix;
var currentItem;
var player;
var playerReady = false;
var mqMobile = window.matchMedia( "(max-width: 838px)" );
var speedUp = false;
var transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }
var transitionEvent = transitions[Modernizr.prefixed('transition')];
var currentSort = "rank";
var currentFilter = "standard";

$(document).ready(function() {
    var obj = $($(".page")[0]);
    transformMatrix = Modernizr.prefixedCSS('transform');
    
    var mobileAndTabletCheck = function() {
      var check = false;
      (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
      return check;
    };
    
    if( mobileAndTabletCheck() )
    {
        //speedup site as it is very performance heavy for mobiles
        speedUp = true;
        $(".grid-item video").css("display", "none");
        $("#bg_itemvideo").css("display", "none");
        $(".page").css("transition-property", "none");
        var $grid_item_img = $(".grid-item img");
        $grid_item_img.css("transition-property", "none");
        $grid_item_img.css("-webkit-filter", "grayscale(0%)");
        $grid_item_img.css("filter", "grayscale(0%)");
        $("#menu-items li").css("transition-property", "none");
        $(".slidepage-header").css("transition-property", "none");
    }

    $grid = $('.grid').isotope({
        // options
        itemSelector: '.grid-item',
        layoutMode: 'fitRows',
        getSortData: {
            team: function( itemElem ) {
                return -parseFloat( itemData[$( itemElem ).attr("data-item")].text.team );
            },
            year: function( itemElem ) {
                return -parseFloat( itemData[$( itemElem ).attr("data-item")].text.year );
            },
            tech: function( itemElem ) {
                return itemData[$( itemElem ).attr("data-item")].text.tech;
            },
            rank: function( itemElem ) {
                return parseFloat( itemData[$( itemElem ).attr("data-item")].displayRank );
            }
        }
    });
    $('.grid').isotope({ sortBy: currentSort, filter: "." + currentFilter });

    numberOfPages = $('.slidepage-header').length;
    
    $('.slidepage-content').each( function(index) {
        if( isMobile() == false )
        {
            $(this).css("padding-right", (numberOfPages - index) * pageOffset );
            hidePageContent( $(this), index );
        }
    });
    
    var count = 0;
    $('.page').each( function(index) {
        $(this).css("z-index",10+count);
        count++;
    });
    
    var count = 0;
    $('.slidepage-header').each( function(index) {
        //$(this).css("z-index",15+count);
        count++;
    });
    
    // ***
    
    $('.grid-item').each( function(index) {        
        var _this = $(this);
        var type = $(this).attr("data-item");
        var img = $(this).find("img");
        var video = $(this).find("video");
        
        img.load(function() {
            $grid.isotope('layout');
            
            video[0].src = "img/" + type + ".mp4";
        });
        img[0].src = "img/" + type + ".jpg";
    });
    
    // ***
    
    $('.grid-item').hover( function()
    {
        var promise = $(this).find("video")[0].play();        
    },
    function()
    {
        $(this).find("video")[0].pause();
    });
    
    $('.grid-item').click( function() {
        $('.slidepage-header.disabled').removeClass("disabled");
        $('#menu-items li.disabled').removeClass("disabled");
        setItemInfoPage($(this).attr("data-item"));
        setCurrentPage(1);
    });
    
    // ***
    
    $('.slidepage-header').hover( function()
    {
        if( $(this).hasClass("disabled") )
            return;
        var pageIndex = parseInt($(this).parent().attr( "data-page-index" ));
        
        $('.slidepage-header').each( function( index ) {
            $(this).addClass( "darken-hover" );
        });
        $('#menu-items li').each( function( index ) {
            if( index == pageIndex )
            {
                $(this).addClass( "highlight" );
            }
        });
    },
    function()
    {
        $('.slidepage-header').each( function( index ) {
            $(this).removeClass( "darken-hover" );
        });
        $('#menu-items li').each( function( index ) {
            $(this).removeClass( "highlight" );
        });
    });
    
    $('#menu-items li').hover( function()
    {
        if( $(this).hasClass("disabled") )
            return;
        var pageIndex = parseInt($(this).attr( "data-page-index" ));
        $('.slidepage-header').each( function( index ) {
            if( index == pageIndex )
            {
                $(this).addClass( "darken-hover-active" );
            }
            else
            {
                $(this).addClass( "darken-hover" );
            }
        });
    },
    function()
    {
        $('.slidepage-header').each( function( index ) {
            $(this).removeClass( "darken-hover" );
            $(this).removeClass( "darken-hover-active" );
        });
    });
    
    $('.slidepage-header').click( function() {
        if( !$(this).hasClass("disabled") )
        {
            setCurrentPage( $(this).parent().attr( "data-page-index" ) );
        }
    });
    
    $("#menu-items li").click( function() {
        if( !$(this).hasClass("disabled") )
        {
            setCurrentPage( $(this).attr( "data-page-index" ) );
        }        
    });
    
    // ***

    $( ".page" ).each( function( index ) {
        $(this).attr( "data-page-index", index );
        $(this).find(".slidepage-header").attr( "data-page-color", index );
    });
    
    $( "#menu-items li" ).each( function( index ) {
        $(this).attr( "data-page-color", index );
        $(this).attr( "data-page-index", index );
    });
    
    // ***
    
    /* Listen for a transition! */
    if( transitionEvent )
    {
        $(".page").each( function( index )
        {
            this.addEventListener(transitionEvent, pageTransitionDone);
        });
    }
        
    // ***
    
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    
    // ***
    
    // Sort Items Page1
    $(".sort-items").click( function()
    {
        $(".sort-items").removeClass("active");
        $(this).addClass("active");
        sortItems.apply(this);
    });

    $(".filter-items").click( function()
    {
        $(".filter-items").removeClass("active");
        $(this).addClass("active");
        sortItems.apply(this);
    });
    
    // ***
    
    $(".page2-backbutton").click( function() {
        setCurrentPage(0);
    });
    
    // ***
    
    setCurrentPage( 0 );
    $( window ).resize(function() {
        updateLayout();
    });
    $grid.on( 'layoutComplete', updateLayout );
    
    // update the site when if it switches from mobile to pc layout
    mqMobile.addListener( function() {
        setCurrentPage( currentPage );
        
        $('.slidepage-content').each( function(index) {
            if( isMobile() == false )
            {
                $(this).css("padding-right", (numberOfPages - index) * pageOffset );
            }
            else
            {
                $(this).css("padding-right", 0 );
            }
        });
        
    });
    
    //update the layout when sizes have been correctly updated
    setTimeout( function() {
        updateLayout();
    }, 100 );
    
    document.addEventListener("load", function(event) {
        console.log("All resources finished loading!");
        // $("#loading-container")[0].addEventListener(transitionEvent, function(event) {
            // $(event.srcElement).hide();
        // });
        // $("#loading-container").css("opacity",0);
    });
    
    $("#loading-container")[0].addEventListener(transitionEvent, function(event) {
        $("#loading-container").hide();
    });
    $("#loading-container").css("opacity",0);
});

function onYouTubeIframeAPIReady() 
{
    player = new YT.Player('player', {
        height: '360',
        width: '640',
        videoId: 'RJyNnevLLdA',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerReady(event) {
    playerReady = true;    
    if( currentPage === 1 )
    {
        showPageContent( $($('.page')[currentPage]).find('.slidepage-content'), currentPage );
    }
    player.setPlaybackQuality("large");
    
    var playbackDiff = 2.5;
    var maxDiff = 1.0;
    var playOffset = -0.1;
    if( youtubeSync )
    {
        setInterval( function(){
            var bgVideo = $("#bg_itemvideo")[0];
            var bgTime = bgVideo.currentTime - 0.1;
            var ytTime = player.getCurrentTime();
            var diff = bgTime - ytTime;
            
            bgVideo.playbackRate = Math.max( 0.0, 1.0 + -1 * (diff / playbackDiff) );
            //console.log("playback: " + bgVideo.playbackRate, (-1 * (diff / playbackDiff)));
            if( Math.abs(diff) > maxDiff )
            {
                bgVideo.currentTime = ytTime + 0.05;
                //console.log("Max diff surpassed, set the bg time directly: " + diff);
            }
        }, 250);
    }
}

var firstPlay = true;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED) 
    {
        player.playVideo();
        player.mute();
        if( firstPlay )
        {
            $("#bg_itemvideo")[0].play();
            firstPlay = false;
        }
        //console.log("restart player");
    }
    if( event.data == YT.PlayerState.PAUSED || event.data == YT.PlayerState.BUFFERING )
    {
        $("#bg_itemvideo")[0].pause();
    }
    if( event.data == YT.PlayerState.PLAYING )
    {
        $("#bg_itemvideo")[0].play();
    }
}

function setCurrentPage( page )
{
    page = parseInt( page );

    lastPage = currentPage;
    currentPage = page;
    
    //show pages that will be shown during transition
    if( isMobile() == false && speedUp == false )
    {
        var step = currentPage > lastPage ? 1 : -1;
        for( var i = lastPage; i != currentPage; i += step )
        {
            //console.log("show page (transition) " + i );
            showPageContent( $($('.page')[i]).find('.slidepage-content'), i );
        }
    }
    else
    {
        // make sure all pages are hidden
        for( var i = 0; i < numberOfPages; i++ )
        {
            hidePageContent( $($(".page")[i]).find('.slidepage-content'), i ); // needs this to trigger events
            if( isMobile() )
            {
                $($(".page")[i]).css("display", "");
            }
        }
    }
    
    //show the current page
    //console.log("show page " + page );
    showPageContent( $($('.page')[page]).find('.slidepage-content'), page );
    $($(".page")[page]).css("display", "block" );
    
    //make sure right button is selected    
    $("#menu-items li").each( function( index ) {
        $(this).removeClass("active");
    });
    $($("#menu-items li")[page]).addClass("active");
    
    updateLayout();
    
    //update grid
    if( currentPage == 0 )
    {
        $grid.isotope('layout');
    }
}

function pageTransitionDone(event)
{
    if( event.srcElement == event.currentTarget )
    {
        var value = 0;
        var check = false;
        
        if( translateAnimations )
        {
            if( event.propertyName == "transform" )
            {
                var obj = $(event.srcElement);
                var transformString = obj.css(transformMatrix);                
                value = parseInt(transformString.split(',')[4]);
                check = true;
            }
        }
        else
        {
            if( event.propertyName == "left" )
            {
                value = $(event.srcElement).css("left").replace("px","");
                check = true;
            }
        }
        
        if( check )
        {
            check = false;
            var pageIndex = parseInt($(event.srcElement).attr( "data-page-index" ));      
            
            if( value == (pageIndex * pageOffset).toString() )
            {
                if( pageIndex - 1 != currentPage )
                {
                    //console.log("hide page " + (pageIndex-1) );
                    hidePageContent( $($(".page")[pageIndex-1]).find('.slidepage-content'), pageIndex - 1 );
                }                    
            }
            else
            {
                if( pageIndex != currentPage )
                {
                    //console.log("hide page " + pageIndex );
                    hidePageContent( $(event.srcElement).find('.slidepage-content'), pageIndex );
                }
            }
            updateCorrectSizing();
        }
    }
}

function updateLayout()
{    
    updateCorrectSizing();
    
    var xOffset = 0;
    
    if( isMobile() == false )
    {
        $( ".page" ).each( function( index ) {
            var _this = this;
            var _xOffset = xOffset;
            
            if( index > currentPage )
            {
                setTimeout( function() {
                    if( translateAnimations )
                    {
                        $( _this ).css( transformMatrix, "translate3d(" + ($( _this ).innerWidth() - (numberOfPages - index) * pageOffset) + "px, 0, 0)" );
                    }else
                    {
                        $( _this ).css( "left", $( _this ).innerWidth() - (numberOfPages - index) * pageOffset );
                    }
                }, ( speedUp ? 0 : (lastPage - index) * 100 ) );
            }
            else
            {
                setTimeout( function() {
                    if( translateAnimations )
                    {
                        $( _this ).css( transformMatrix, "translate3d(" + (_xOffset) + "px, 0, 0)" );
                    }else
                    {
                        $( _this ).css( "left", _xOffset );
                    }
                }, ( speedUp ? 0 : (index - lastPage) * 100 ) );
                
                xOffset += pageOffset;
            }
        });
    }
    else
    {        
        if( translateAnimations )
        {
            $($(".page")[currentPage]).css( transformMatrix, "translate3d(0px, 0, 0)" );
        }else
        {
            $($(".page")[currentPage]).css( "left", 0 );
        }
    }
}

function updateCorrectSizing()
{
    if( isMobile() == false )
    {
        var $content = $( "#content" );
        $content.css( "height", $content.parent().innerHeight() - 60 );
        
        var $page2_bg = $( "#page2-bg" );
        if( $page2_bg.parent().css( "display" ) != "none" )
        {
            $page2_bg.css( "width", parseFloat( $page2_bg.parent().css( "width" ) ) + 10 );
        }
        
        //set correct high for page headers
        var largestHeight = 0;
        $( ".slidepage-content" ).each( function( index ) {
            var height = $( this ).css("display") == "none" ? 0 : $( this ).innerHeight();
            var pageHeight = $( this ).parent().parent().innerHeight();
            if( largestHeight < height )
                largestHeight = height;
            if( largestHeight < pageHeight )
                largestHeight = pageHeight;
        });    
        $( ".page" ).each( function( index ) {
            $( this ).css( "height", largestHeight );
        });
    }
    else
    {
        setTimeout( function() {
            var $content = $( "#content" );
            $content.css( "height", "" );
            var $page = $($(".page")[currentPage]);
            $page.css( "height", $page.find(".slidepage-content").innerHeight() );
        }, 20 );
    }
}

function setItemInfoPage(itemType)
{
    var data = itemData[itemType];
    currentItem = data;
    $("#bg_itemvideo").attr("src", "img/" + data.video);
    
    $("#page2-title")[0].innerHTML = data.text.title;
    $("#page2-role")[0].innerHTML = data.text.role;
    $("#page2-team")[0].innerHTML = data.text.team;
    $("#page2-tech")[0].innerHTML = data.text.tech;
    $("#page2-desc")[0].innerHTML = data.text.desc;
    if(data.text.contrib != "")
    {
        $("#page2-contrib").parent().show();
        $("#page2-contrib")[0].innerHTML = data.text.contrib;
    }
    else
    {
        $("#page2-contrib").parent().hide();
    }
    $("#page2-year")[0].innerHTML = data.text.year;
}

function hidePageContent(pageObj, pageIndex)
{
    pageIndex = parseInt(pageIndex);
    
    if( pageObj.css("display") != "none" )
    {
        pageObj.css("display", "none");
        
        switch( pageIndex )
        {
            case 1:
            if( playerReady && currentItem )
            {
                $("#bg_itemvideo")[0].pause();
                player.pauseVideo();
            }
            break;
        }
    }
}

function showPageContent(pageObj, pageIndex)
{
    pageIndex = parseInt(pageIndex);
     
    if( pageObj.css("display") != "block" )
    {
        pageObj.css("display", "block");
        
        switch( pageIndex )
        {
            case 1:
                if( playerReady && currentItem )
                {
                    $("#bg_itemvideo")[0].play();
                    
                    /*player.loadVideoById({
                       'videoId': currentItem.youtube,
                       'suggestedQuality': 'large'});*/
                }
            break;
        }
    }
    
    if( playerReady && currentItem && pageIndex == 1 )
    {
        var url = player.getVideoUrl();
        if( url == "https://www.youtube.com/watch" )
            url = undefined;
        if( url )
        {
            url = url.replace("https://www.youtube.com/watch?","");
            urlSplit = url.split(/[=,&,]/);
            for( var i = 0; i < urlSplit.length; i++ )
            {
                if( urlSplit[i] == "v" )
                {
                    url = urlSplit[i+1];
                    break;
                }
            }
            if( url != currentItem.youtube )
            {
                player.loadVideoById({
                   'videoId': currentItem.youtube,
                   'suggestedQuality': 'large'});
            }
            else if( player.getPlayerState() == YT.PlayerState.PAUSED ||
                     player.getPlayerState() == YT.PlayerState.ENDED ||
                     player.getPlayerState() == YT.PlayerState.CUED ||
                     player.getPlayerState() == YT.PlayerState.UNSTARTED )
            {
                player.playVideo();
                player.mute();
            }
        }
    }
}

function contactUs()
{
	//alert( $("#InputName").val() + " " + $("#InputEmail").val() + " " + $("#InputMessage").val() + " " + $("#InputReal").val() );
	$.post( "contactform.php", { name: $("#InputName").val(), email: $("#InputEmail").val(), body: $("#InputMessage").val(), spam: $("#InputReal").val() }, function(info)
	{
		if( info == "1" )
		{
			var success = $("#contactSuccess");
            
            success.css("transition-duration", "0s");
			success.css("opacity", 0);
            success.show();
            success.css("transition-duration", "0.5s");
            setTimeout( function() 
            {
                success.css("opacity", 1);
                setTimeout( function() {
                    success.css("opacity", 0);
                    setTimeout( function() {
                        success.hide();
                    }, 500 );
                }, 4000 );
            }, 30 );
			
			$("#InputName").val("");
			$("#InputEmail").val("");
			$("#InputMessage").val("");
			$("#InputReal").val("");
			//alert( "yay" );
		}else
		{
			var failure = $("#contactFailure");
			
            failure.css("transition-duration", "0s");
			failure.css("opacity", 0);
            failure.show();
            failure.css("transition-duration", "0.5s");
            setTimeout( function() 
            {
                failure.css("opacity", 1);
                setTimeout( function() {
                    failure.css("opacity", 0);
                    setTimeout( function() {
                        failure.hide();
                    }, 500 );
                }, 4000 );
			}, 30 );
            
			//alert( "nay :( " + info );
		}
	});
	return false;
}

function isMobile()
{
    return mqMobile.matches;
}

function sortItems()
{
    var color = $(this).attr("data-sort-color");
    var sort = $(this).attr("data-sort");
    var filter = $(this).attr("data-filter");

    if(sort)
        currentSort = sort;
    if(filter)
        currentFilter = filter;

    $grid.isotope({ sortBy : currentSort, filter: "." + currentFilter });
    
    $(".grid-item-overlay-container").each( function(index)
    {
        if(sort)
            $(this).attr("data-sort-color", color);
        
        var $gridItem = $(this).parent();
        var itemStr = $gridItem.attr("data-item");
        var $text = $(this).find("span");
        
        if( currentSort === "tech" )
        {
            $text.css("font-size", 20);
        }
        else
        {
            $text.css("font-size", 26);
        }
        
        if( currentSort === "rank" )
        {
            $(this).css("bottom", $(this).height() * -1 );
            $text[0].innerHTML = "";
        }
        else
        {
            $(this).css("bottom", 0 );
            var textStr = itemData[itemStr].text[currentSort];
            if( currentSort === "tech" )
            {
                textStr = textStr.split(",")[0];
            }
            $text[0].innerHTML = textStr;
        }
    });
}

var itemData = {
    flightless: {
        video:"flightless_bg.mp4",
        youtube:"RJyNnevLLdA",
        displayRank: 110,
        text: {
            title:"Flightless - Prototype",
            role:"Programmer",
            team:"2",
            tech:"C# - XNA",
            year:"2010",
            desc:"Worked on a platforming engine which was used for several small prototypes." +
            " Flightless was the most successful prototype but was cancelled because of complications.",
            contrib: "<ul><li>Everything programming-wise.</li></ul>"
        }
    },
    bitsy: {
        video:"bitsy_bg.mp4",
        youtube: "j1sesIpSY0Q",
        displayRank: 45,
        text: {
            title:"Bitzy Blitz",
            role:"Gameplay-, Engine programmer",
            team:"5",
            tech:"Actionscript - Flixel",
            year:"2013",
            desc:"One of our released games from Wingon Studios and personally my most successful game so far with over a million" +
            " of plays throughout the world. Can be played online at <a href='http://www.kongregate.com/games/wingonstudios/bitzy-blitz'>kongregate.com</a>.",
            contrib: "<ul><li>Implemented most of the player upgrades and the combination of them.</li>" +
            "<li>Created a story board system to create time based story visualization.</li>" +
            "<li>A simple transform system so objects could be childed to other objects.</li>" +
            "<li>Clouds.</li>" +
            "<li>All menys and UIs in the title-, pause screen.</li>" +
            "</ul>"
        }
    },
    franken: {
        video:"franken_bg.mp4",
        youtube:"DoPPKk6npkA",
        displayRank: 50,
        text: {
            title:"Franken Runners",
            role:"Networking programmer",
            team:"5",
            tech:"Actionscript - Starling/PlayerIO",
            year:"2013",
            desc:"Developed at Wingon Studios. Responsible for networking, both front-end and back-end. A failed project but a giant learning experience. Can be played online at <a href='http://www.newgrounds.com/portal/view/633995'>newgrounds.com</a>.",
            contrib: "<ul><li>All networking both front-end and back-end, using PlayerIO.</li>" +
            "<li>Gameplay: Some UIs, polish, optimizations and bug fixes.</li>" +
            "</ul>"
        }
    },
    letum: {
        video:"letum_bg.mp4",
        youtube:"gZxhdTgng8o",
        displayRank: 90,
        text: {
            title:"Letum",
            role:"Gameplay-, engine-, tools programmer",
            team:"15",
            tech:"C++ - SFML",
            year:"2012",
            desc:"My first school project at HiS with a duration of 8 weeks part-time.<br><br><b>Letum</b> is a 2D, side-scrolling, puzzle game where the player has the power of an eraser to remove obstacles and solve sophisticated puzzles.<br><br>" +
            "Official trailer can be found at <a href='https://www.youtube.com/watch?v=Hv2W0OjTnb0&ab_channel=Erik%C3%85rman'>youtube.com</a>",
            contrib: "<ul><li>Implemented optimized player to pixel collision.</li>" + 
            "<li>Pixel erasing feature.</li>" +
            "<li>Eraser movement and collision.</li>" +
            "<li>Level editor made in C# with SFML.Net bindings.</li>" +
            "<li>Title menu with slider UI for volume control.</li>" +
            "<li>Implemented a checkpoint system with saving and loading.</li>" +
            "</ul>"
        }
    },
    squid: {
        video:"squid_bg.mp4",
        youtube:"gyEXzWU0bQA",
        displayRank: 60,
        text: {
            title:"Squid Skid",
            role:"Gameplay programmer",
            team:"5",
            tech:"Actionscript - Flixel",
            year:"2013",
            desc:"Developed at Wingon Studios, minor involvement but helped out with programming difficulties and design decisions. Based on modifications made to Flixel during development of Bitzy Blitz. Can be played online at <a href='http://www.kongregate.com/games/wingonstudios/squid-skid'>kongregate.com</a>.",
            contrib: ""
        }
    },
    dwarfs: {
        video:"dwarfs_bg.mp4",
        youtube: "N3hW3lEhfxM",
        displayRank: 42,
        text: {
            title:"6 Dwarfs Under - Prototype",
            role:"Everything",
            team:"1",
            tech:"C# - Unity",
            year:"2015",
            desc:"A small multiplayer prototype, combining liero gameplay with crafting mechanics.",
            contrib: "<ul><li>Everything.</li></ul>"
        }
    },
    planet: {
        video:"planet_bg.mp4",
        youtube:"rApwWZz95iw",
        displayRank: 80,
        text: {
            title:"Protect The Planet",
            role:"Programmer, designer",
            team:"2",
            tech:"Typescript - Phaser",
            year:"2014",
            desc:"Developed together with an artist. Created for licensing. Works for most HTML5 enabled platforms (Mobile, PC). Can be played online at <a href='http://www.johanrosen.me/Games/ProtectThePlanet/'>johanrosen.me</a>.",
            contrib: "<ul><li>Everything programming and design-wise.</li></ul>"
        }
    },
    finger: {
        video:"finger_bg.mp4",
        youtube:"1fvTCLf0CdQ",
        displayRank: 70,
        text: {
            title:"Finger Adventure",
            role:"Programmer, designer",
            team:"2",
            tech:"Typescript - Phaser",
            year:"2015",
            desc:"Developed together with an artist. Created for licensing. Works for most HTML5 enabled platforms (Mobile, PC). Can be played online at  <a href='http://www.johanrosen.me/Games/FingerAdventure/'>johanrosen.me</a>.",
            contrib: "<ul><li>Everything programming and design-wise.</li></ul>"
        }
    },
    paint: {
        video:"paint_bg.mp4",
        youtube:"zJNyWqs8aWc",
        displayRank: 40,
        text: {
            title:"Paint The Arena",
            role:"Lead-, network-, graphics- programmer",
            team:"16",
            tech:"C# - Unity",
            year:"2013",
            desc:"My second school project at HiS with a duration of 9 weeks.<br><br><b>Paint The Arena</b> is a first person, online multiplayer, arena shooter inspired by Quake, Super Smash Bros and Portal." +
            " The players can't kill each other in the traditional way, so instead they have to push each other out of the map. To help you out you have 4 different colors you can shoot with different effects when you interact on them." +
            " The game has multiple game modes: Deathmatch, King of the Hill and Capture the flag pitching up to 32 players in two teams against each other.<br><br>" +
            "Official trailer can be found at <a href='https://www.youtube.com/watch?v=PivNOmMp-mk&ab_channel=PainttheArena'>youtube.com</a>",
            contrib: "<ul><li>Acted as lead programmer, close communication with programmers and other disciplines. Going to lead meetings and creating the programmers schedule.</li>" +
            "<li>Implemented networking for everything.</li>" +
            "<li>Player networking with smooth transform interpolation/extrapolation.</li>" +
            "<li>Player outline- and \"See through walls\" shaders.</li>" +
            "</ul>"
        }
    },
    runners: {
        video:"runners_bg.mp4",
        youtube:"_BFKmN3qgig",
        displayRank: 30,
        text: {
            title:"Runners",
            role:"Gameplay-, engine-, tools programmer",
            team:"8",
            tech:"C++ - TenGine",
            year:"2017",
            desc:"My first school project at PlaygroundSquad. Developed over 5 weeks of fulltime work.<br><br>" +
            "<b>Runners</b> is a local multiplayer, third-person, parkouring game that supports up to 4 players. The game is score based" +
            ", which you get by clearing obstacles. The player with the highest score when the times ends is the winner." +
            "<br><br>Check out our project page with official trailer at <a href='https://www.playgroundsquad.com/spelprojekt/runners/'>playgroundsquad.com</a>",
            contrib: "<ul><li>Player movement physics.</li><li>Player animation controller and blendning.</li><li>Box collision between player and obstacles.</li>" +
            "<li>Level editor pipeline using maya and python to export level data to json.</li>" + 
            "<li>Dynamic level construction with sections.</li><li>Fog effect.</li><li>Clearing obstacles detection for scoring.</li></ul>"
        }
    },
    mausoleum: {
        video:"mausoleum_bg.mp4",
        youtube:"m023zBCQBTU",
        displayRank: 20,
        text: {
            title:"Mausoleum",
            role:"Lead-, engine-, tools-, graphics programmer",
            team:"9",
            tech:"C++ - TenGine + Renderer",
            year:"2018",
            desc:"My second school project at PlaygroundSquad. Developed over 9 weeks of fulltime work.<br><br>" +
            "<b>Mausoleum</b> is a top down action game for psvita. You play through 5 levels with 3 different kinds of monster." + 
            " The goal is to defeat the boss and reclaim your soul." +
            "<br><br>Check out our project page with official trailer at <a href='https://www.playgroundsquad.com/spelprojekt/prototype-2/'>playgroundsquad.com</a>",
            contrib: "<ul><li>Acted as lead programmer, which meant I worked tighly with the programmers and other disciplines to make everything go smooth.</li>" +
            "<li>We used my own rendering engine. It's a multithreaded, data oriented, multi platform renderer that's designed with speed in mind.</li>" + 
            "<li>We also used my ecs in this game, which is a highly optimized data oriented ecs that is simple to use and with clear api.</li>" +
            "<li>Ported the renderer to PSVita.</li>" +
            "<li>Player and enemy animation.</li><li>Converted our pathfinder to a* (from breadth-first) and made it multithreaded.</li>" + 
            "<li>Created all shaders and optimized rendering for stable 60fps.</li><li>Implemented a line renderer used for the ultimate ability.</li>" +
            "<li>Created a quad component used for all 2d rendering.</li>" +
            "<li>Implemented flatbuffers for loading settings/level data. Entities can be created only using json which describes all of its components and the data for each of them.</li>" +
            "<li>Python scripts for easy compiling of json and fbs files for flatbuffers.</li>" +
            "<li>Ported a student made particle editor and emitter to the renderer and ecs system, modifying it with multiple improvements.</li>" +
            "<li>Implemented most of the effects and particles in the game.</li>" +
            "<li>Implemented the enemy spawning wave system and pipeline.</li>" +
            "<li>A lot of gameplay tweaks and bug fixes in most systems.</li>" +
            "</ul>"
        }
    },
    engine: {
        video:"engine_bg.mp4",
        youtube:"OlCfrW9WQvc",
        displayRank: 10,
        text: {
            title:"3D Renderer",
            role:"Programmer",
            team:"1",
            tech:"C++ - D3D11/PS4",
            year:"2018",
            desc: "A 3D renderer that I have worked on during my free time. Made with speed in mind, optimized data-oriented approach and multiplatform design with support for D3D11 and PS4. "
            + " The video shows a scene with 16384 pointlights and 40 animated characters.<br><br>Features:<br>" +
            "<ul><li>Multiplatform design, support for D3D11 and PS4.</li>" +
            "<li>Clustered forward renderer (D3D11) and a classic forward renderer (D3D11/PS4).</li>" +
            "<li><b>[Clustered forward]</b> GPU accelerated using a compute shader for fast light assignment to the clusters.</li>" +
            "<li><b>[Classic forward]</b> Unified shader model, many lights in 1 draw call.</li>" +
            "<li>Support for directional-, point- and spot lights." +
            "<li>Multithreaded pipeline - Seperated in 3 threads, Game (game logic), Render Logic (frustum culling, sorting) and Rendering (graphics api calls).</li>" +
            "<li>Customizable sorting, default using back-to-front for alpha sorting and front-to-back for opaque sorting.</li>" +
            "<li>Joint and transform animation with blending and gpu skinning.</li>" +
            "<li>Fbx to custom model/animation file converter using assimp.</li>" +
            "<li>Large shared vertex-, index buffers with custom gpu syncronization (discard free updating of data).</li>" +
            "<li>SOA vertex data, only bind relevant data per shader.</li>" +
            "<li>Post process pipeline with Tonemapping, Bloom, Colormapping (using LUT) and FXAA</li>" +
            "</ul>",
            contrib: "<ul><li>Everything.</li>" +
            "</ul>"
        }
    },
    hexablocks: {
        video:"hexablocks_bg.mp4",
        youtube:"HDo8rNrCrI4",
        displayRank: 65,
        text: {
            title:"Puzzle Fever",
            role:"Programmer",
            team:"2",
            tech:"Typescript - Phaser",
            year:"2016",
            desc: "Freelance work, made for SOFTGAMES GmbH. Plays on Mobile and PC using HTML5. Includes localization for 10 different languages. "
            + "Also made an procedural level generator for easy creation of new levels.<br><br>Can be played online at <a href=\"https://m.softgames.de/games/puzzle-fever\">softgames.de</a>",
            contrib: "<ul><li>Everything programming-wise.</li>" +
            "</ul>"
        }
    },
    station5: {
        video:"station5_bg.mp4",
        youtube:"RG9KCvAe7Ko",
        displayRank: 15,
        text: {
            title:"Station 5",
            role:"Lead-, engine-, graphics-, tools programmer",
            team:"9",
            tech:"C++ - TenGine + Renderer",
            year:"2018",
            desc:"My third school project at PlaygroundSquad. Developed over 9 weeks of fulltime work.<br><br>" +
            "<b>Station 5</b> is a first person horror game for PS4 and PC. You explore Nadir, a science research station on the north pole where something has gone terrible wrong." + 
            " An Invisible monster walks around the base who you must hide from. Use your flashlight to turn the monster visible and to freeze it, while using the radar to detect sounds." +
            " Find the 4 batteries located around the place to escape this nightmare." +
            "<br><br>Check out our project page with official gameplay trailer at <a href='https://www.playgroundsquad.com/spelprojekt/station-5/'>playgroundsquad.com</a>",
            contrib: "<ul><li>Acted as lead programmer, which meant I worked tighly with the programmers and the other disciplines. I had responsibility for planning the programmer backlog each week with the reast of the leads.</li>" +
            "<li>We used my own rendering engine. It's a multithreaded, data oriented, multi platform renderer that's designed with speed in mind.</li>" + 
            "<li>We also used my ecs in this game, which is a highly optimized data oriented ecs that is simple to use and with clear api.</li>" +
            "<li>Ported the renderer to PS4.</li>" +
            "<li>Created a pbr shader (using metal/roughness) and figured out the pipeline for creating and loading radiance/irradiance maps and for loading pbr textures.</li>" +
            "<li>Implemented dynamic shadows for the flashlight (spotlight shadows) and the ability to set up a light cookie for it.</li>" +
            "<li>Created an hdr rendering pipeline.</li>" +
            "<li>Implemented a post process pipeline with Tonemapping, Bloom, Colormapping (using LUT) and FXAA.</li>" +
            "<li>Created some minor shaders - Skybox and UV scrolling.</li>" +
            "<li>Fixed our debug tools (Debuginator) so it worked with my renderer and so it worked correctly for the PS4.</li>" +
            "<li>Created a modelviewer for the artist so they easily could check how the models would look in game (with pbr).</li>" +
            "<li>Optimized loading and rendering to make the game smooth and fast - able to consistently hit 60 fps on both PC and PS4.</li>" +
            "<li>Created many minor features and fixed bugs in gameplay, pathfinding, animation, tools and UI.</li>" +
            "</ul>"
        }
    },
    topmarks: {
        video:"topmarks_bg.mp4",
        youtube:"KCLzkp6Bn-4",
        displayRank: 65,
        text: {
            title:"Freelancing - Topmarks",
            role:"Programmer",
            team:"2",
            tech:"Typescript - Phaser",
            year:"2017",
            desc:"Freelance work, made for Topmarks Online Ltd. All games plays on Mobile and PC using HTML5."
            + "<br><br>Can be found online at <a href=\"https://www.topmarks.co.uk/\">topmarks.co.uk</a>",
            contrib: "<ul><li>Everything programming-wise.</li>" +
            "</ul>"
        }
    }
}