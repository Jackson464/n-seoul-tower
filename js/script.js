//jQuery
$(document).ready(function(){
    const section = $('.main > section')
    const footer = $('.footer')
    
    let sectionSpeed = 500;
    // 각각의 섹션의 위치값 저장
    let sectionPos = [];
    let sectionIndex = 0;
    
    // 연속 휠 막기
    let scrolling = false;

    // 화면 사이즈 체크
    // 화면 너비 1000px 이하에서는 휠 작동 시켜도 fullpage식 섹션전환이
    // 되지 않게 막아주는 변수
    // true -> fullpage식 섹션전환이 작동 됨
    // fales -> fullpage식 섹션전환이 작동 안됨
    // fullpage mode on <= true
    // fullpage mode off <= false
    let wheeling = true;

    // const sectionMenu = $('.section-menu')

    // 화면 너비가 1000px 이하면 fullpage off 시키고
    // sectionMenu 를 hide 시킨다
    // 화면 너비가 1000px 초과면 fullpage on 시키고
    // sectionMenu 를 show 시킨다
    function wheelCheckFn(){
        let windowWidth = window.innerWidth;
        console.log(windowWidth)
        if(windowWidth <= 1000){
            wheeling = false;
            // sectionMenu.hide();
        }else{
            wheeling = true;
            // sectionMenu.show();
        }
    }
    wheelCheckFn();
    // $(window).resize(function(){
    //     wheelCheckFn();
    //     // resetSection();
    // })

    // 위치파악(Y스크롤 이동 px)
    // 화면리사이징이 일어날때마다 호출됨

    // 화면리사이징시 변경되는 section위치를 다시 sectionPos 배열안에 저장함
    function resetSection(){
        sectionPos = [];
        $.each(section,function(index,item){
            let tempY = $(this).offset().top;
            // console.log(index + ":" + tempY)
            tempY = Math.ceil(tempY);
            sectionPos[index] = tempY;
        })
        sectionPos[sectionPos.length] = Math.ceil(footer.offset().top)
        console.log(sectionPos);
    }
    //최초에 새로고침 또는 실행시 위치값파악 => sectionPos배열에 저장
    resetSection();

    let sectionTotal = sectionPos.length;
    console.log("sectionTotal : " + sectionTotal)

    let resizeTimer;

    $(window).bind('resize', function(){
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(resizeFunction , 500);
    })
    function resizeFunction(){
        // 리사이즈시 실행할 코드
        wheelCheckFn();
        resetSection();
        if(wheeling){
            // gsap.to($(요소명),durationTime,{설정})
            gsap.to($('html'),sectionSpeed/1000,{
                // 리사이즈 될때 scroll top을 섹션 위치로 이동해라
                scrollTop : sectionPos[sectionIndex],
                onComplete: function(){
                    scrolling = false;
                }
            })
        }
    }

        // 리사이즈
    // $(window).resize(function(){
    //     wheelCheckFn();
    //     resetSection();
    //     if(wheeling){
    //         // gsap.to($(요소명),durationTime,{설정})
    //         gsap.to($('html'),sectionSpeed/1000,{
    //             // 리사이즈 될때 scroll top을 섹션 위치로 이동해라
    //             scrollTop : sectionPos[sectionIndex],
    //             onComplete: function(){
    //                 scrolling = false;
    //             }
    //         })
    //     }
    // })

    // 스크롤바의 위쪽 위치값을 파악한다

    $(window).scroll(function(){
        if(wheeling){
            return;
        }
        let tempY = $(window).scrollTop();
        tempY = Math.ceil(tempY);
        
        for(let i = sectionTotal - 1; i >= 0; i--){
            let tempMax = sectionPos[i];
            // 섹션인덱스번호와 스크롤양을 비교해서 해당하는 섹션인덱스
            // 값을 찾아줌 - 현재 위치에 해당하는 section번호를 넘겨줌
            if(tempY >= tempMax){
                sectionIndex = i;
                break;
            }
        }
    })

    
    // $(window).bind('mosewheel', function(event){
    //     if(event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0){
    //         // scroll up
    //         console.log("스크롤 위로");
    //     }else{
    //         // scroll down
    //         console.log("스크롤 아래로");
    //     }
    // })

    //마우스 휠체크 및 섹션 이동
    $(window).bind('mousewheel DOMMousescroll',function(event){
        let distance = event.originalEvent.wheelDelta;
        // 화면 사이즈에 따른 작동여부
        if (distance == null) {
            distance = event.originalEvent.detail * -1;
        }
        console.log(distance)
        if (wheeling != true) {
        return;
        }
        // wheeling이 트루일때 연속휠 막아준다
        if (scrolling) {
        return;
        }
        
        // 마우스 휠 작동 막기
        // scrolling = false;
        scrolling = true;
        if(distance < 0){
            sectionIndex++;
            if(sectionIndex >= sectionTotal){
                sectionIndex = sectionTotal - 1;
            }
            console.log(sectionIndex)
        }else {
            sectionIndex--;
            if(sectionIndex <= 0){
                sectionIndex = 0;
            }
            console.log(sectionIndex)
        }

        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTop : sectionPos[sectionIndex],
            onComplete : function(){
                scrolling = false;
            }
        })
    })

    // go top 클릭시 섹션 이동
    const goTopLink = $('.go-top a')

    $.each(goTopLink, function(index, item){
        $(this).click(function(e){
            e.preventDefault();
            moveSection(index);
            sectionColor();
        })
    })

    function moveSection(_index){
        sectionIndex = _index;
        gsap.to($('html'), sectionSpeed / 1000, {
            scrollTo : sectionPos[sectionIndex],
            onComplete : function(){
                scrolling = false;
            }
        })
    }
    // function sectionColor(){
    //     // 포커스 표현
    //     sectionLink.removeClass('section-menu-active')
    //     sectionLink.eq(sectionIndex).addClass('section-menu-active')
    //     // 색상 표현
    //     sectionLink.removeClass('section-menu-blue')
    //     sectionLink.eq(sectionIndex).addClass('section-menu-blue')
    //     sectionLink.eq(sectionIndex + 2).removeClass('section-menu-blue')
    // }
    // 최초 또는 새로고침 시 색상 셋팅
    // sectionColor();

});

$(document).ready(function(event){
    // event.preventDefault();
    // event.stopPropagation()
    $('.left-menu > a').click(function(){
        $(this).next().slideToggle(250).parent().siblings().children('ul').slideUp();
        // $(this).parent().siblings().children('ul').slideUp();
    });
});

// swiper slide
$(document).ready(function(){
    let main_swiper = new Swiper(".main-swiper", {
        spaceBetween: 30,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        loop: true,
        effect: "fade",
        speed: 2000,
        on: {
            slideChangeTransitionEnd : function(){
                if($('.swiper-slide.slide03').hasClass('swiper-slide-active')){
                    $('.vis-menu .menu>li').find('a').css('color','#fff')
                    $('.logo-box h1 a').addClass('white')
                }else{
                    $('.vis-menu .menu>li').find('a').css('color','#333')
                    $('.logo-box h1 a').removeClass('white')
                }
            },
        }
      });

    let dk_swiper = new Swiper(".deck-swiper", {
        effect: "fade",
        loop: true,
        grabCursor: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        speed: 2000,
    });

    let dn_swiper = new Swiper(".dn-swiper", {
        slidesPerView: "auto",
        centeredSlides: true,
        grabCursor: true,
        loop: true,
        speed: 1500,
        loopAdditionalSlides : 1,
        loopedSlides: 2,
        autoplay: {
            delay: 4500,
            disableOnInteraction: false,
        },
    })

    //event

    //event1
    $('.event1').mouseenter(function(){
        $('.event1 > .content').stop().slideDown()
    })    
    $('.event1').mouseleave(function(){
        $('.event1 > .content').stop().slideUp()
    })  
    //event2
    $('.event2').mouseenter(function(){
        $('.event2 > .content').stop().slideDown()
    })    
    $('.event2').mouseleave(function(){
        $('.event2 > .content').stop().slideUp()
    })    
    //event3
    $('.event3').mouseenter(function(){
        $('.event3 > .content').stop().slideDown()
    })    
    $('.event3').mouseleave(function(){
        $('.event3 > .content').stop().slideUp()
    })    

    //sns-heart change
    $('.box-icon .heart').mouseenter(function(){
        $('.box-icon .heart').addClass('red')
    })
    $('.box-icon .heart').mouseleave(function(){
        $('.box-icon .heart').removeClass('red')
    })

    $('.box-icon .instar').mouseenter(function(){
        $('.box-icon .instar').addClass('color')
    })
    $('.box-icon .instar').mouseleave(function(){
        $('.box-icon .instar').removeClass('color')
    })

    //how-tabs-nav
    const howBtn = $('.tabs-nav .btn')
    console.log(howBtn)
    howBtn.click(function(e){
        e.preventDefault()
        $(this).toggleClass('active')
        $(this).parent().siblings().children('a').removeClass('active')
    })

    //how-tab-menu
    let tabAnchor = $('.tabs-nav li');
        tabPanel = $('.how-content');

    tabAnchor.on('click',function(e){
        e.preventDefault();
        tabAnchor.find('a').removeClass('active');
        $(this).find('a').addClass('active');

        tabPanel.hide();
        tabPanel.eq($(this).index()).fadeIn();
        $('.tab-panel5').hide();
    })
})




// vanilla Javascript
window.onload = function(){
    //메뉴 기능
    const header = $('.header'),
          gnb = $('.gnb')
    
    let gnbHeight = gnb.height();
    let headerHeight = header.outerHeight();
    console.log(gnbHeight)
    gnb.mouseenter(function(){
        header.css('height', gnbHeight)
    })
    gnb.mouseleave(function(){
        header.css('height',75)
    })
    $(window).on('scroll',function(){
        if($(window).scrollTop() >= 880){
            $('.header').addClass('active');
            $('.logo-box').addClass('remove');
        }else{
            $('.header').removeClass('active');
            $('.logo-box').removeClass('remove')
        }
    })
};