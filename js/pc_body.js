
//--                    모바일이면 index_m.html로 이동

    // 모바일 기기 감지 함수
    function isMobile() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        // 흔한 모바일 기기 키워드 체크
        return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    }

    // 모바일일 경우 iot_m.html로 이동
    if (isMobile()) {
        window.location.href = "sub-index.html"; //
    }


//--                    PC 메뉴 탑에 불러옴

// window.addEventListener("load", function () {                // <---- 똑같은건데 메뉴가 늦게뜸
document.addEventListener("DOMContentLoaded", function () {     // <---- 이걸로 바꾸면 메뉴가 더 빠르게 뜸
    
    const menuUrl = 'Menu.html'; // 불러올 메뉴 파일명
    const menuWidth = 1890;        // 메뉴 가로 너비               <<<----------------------- 밀려서 1890으로 ㅠ.ㅜ
    const menuHeight = 90;         // 메뉴 세로 높이

    // 1. iframe을 감쌀 컨테이너 생성 (스크롤 고정의 핵심)
    const menuWrapper = document.createElement('div');
    menuWrapper.id = 'fixed-menu-header';
    
    // 2. 컨테이너 스타일: 화면 상단에 완전히 박제
    Object.assign(menuWrapper.style, {  
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: menuHeight + "px",
        zIndex: "10000",
        display: "flex",
        justifyContent: "center", // 가로 중앙 정렬
        pointerEvents: "none"     // 컨테이너 자체는 클릭 통과 (메뉴만 클릭되게)
    });

    // 3. iframe 생성 및 설정
    const menuIframe = document.createElement('iframe');
    menuIframe.src = menuUrl;
    Object.assign(menuIframe.style, {
        width: menuWidth + "px",
        height: "100%",
        border: "none",
        backgroundColor: "transparent",
        pointerEvents: "auto"     // 메뉴 클릭 활성화
    });
    menuIframe.scrolling = "no";

    // 4. 화면에 삽입
    menuWrapper.appendChild(menuIframe);
    document.body.prepend(menuWrapper);


    ////////////////////////////////////////////////////////////// 이게 있으면 부모 콘텐츠가 아래로 100픽셀 정도가 밀려서 지워버림
    // // 5. 부모창 본문(#index) 위치 조정
    // const mainIndex = document.getElementById('index');
    // if (mainIndex) {
    //     // 본문이 absolute이므로 top 값을 메뉴 높이만큼 강제 조정
    //     mainIndex.style.setProperty("top", menuHeight + "px", "important");
    // }
});
    
    
//--                    /css/pc_fonts.css 를 로드

const link2 = document.createElement('link');
link2.rel = 'stylesheet';
link2.href = '/css/pc_fonts.css';
document.head.appendChild(link2);


//--                    /css/pc_youtube.css 를 로드

const link = document.createElement('link');
link.rel = 'stylesheet';
link.href = '/css/pc_youtube.css';

document.head.appendChild(link);


//--                    #index의 hidden 무력화 및 가로 스크롤 방지


function disableOverflowHidden() {
    const index = document.getElementById("index");

    // 가로 스크롤 방지
    document.documentElement.style.overflowX = "hidden";
    document.body.style.overflowX = "hidden";

    // 특정 요소 overflow 해제
    if (index) {
        index.style.overflow = "visible";
    }
}

window.addEventListener("load", disableOverflowHidden);


//--                    #index_box_movie 고정 및 확대 패러록스

window.addEventListener("load", function () {
    const movie = document.getElementById("index_box_movie");
    const index = document.getElementById("index"); // index 변수 선언 확인 필요
    if (!movie || !index) return;

    if (movie.parentElement !== document.body) {
        document.body.appendChild(movie);
    }

    movie.style.position = "fixed";
    movie.style.top = "0";
    movie.style.zIndex = "-1";
    movie.style.transformOrigin = "center center";
    movie.style.display = "block";

    function updateMovieLayout() {
        const browserWidth = window.innerWidth;
        const scrollY = window.pageYOffset;
        const baseWidth = 1890;
        const movieHeight = 100;
        const parallaxOffset = -(scrollY * 0.2);

        if (browserWidth >= baseWidth) {
            // 1. 1280px 이상: 브라우저 너비에 맞춰 확대
            const scale = browserWidth / baseWidth;
            movie.style.width = baseWidth + "px";
            movie.style.left = "50%";
            const initialTranslateY = (movieHeight * (scale - 1)) / 2;
            movie.style.transform = `translateX(-50%) translateY(${initialTranslateY + parallaxOffset}px) scale(${scale})`;
        } else {
            // 2. 1280px 미만: 크기를 줄이지 않고 1280px 상태로 고정
            // 부모인 #index의 위치를 실시간으로 파악하여 왼쪽 끝을 맞춤
            const rect = index.getBoundingClientRect();
            
            movie.style.width = baseWidth + "px";
            movie.style.left = rect.left + "px"; // #index의 왼쪽 좌표에 고정
            
            // scale을 1로 고정하여 크기가 줄어들지 않게 함
            // translateX(0)으로 설정하여 rect.left 위치에서 시작하게 함
            movie.style.transform = `translateX(0) translateY(${parallaxOffset}px) scale(1)`;
        }
    }

    window.addEventListener("resize", updateMovieLayout);
    window.addEventListener("scroll", updateMovieLayout);
    updateMovieLayout();
});


//--                    .wide 들의 가로 무한 확장 [[[ <SVG> 도 작동 ]]] -  jpg 도 작동

window.addEventListener("load", function () {
    const wides = document.querySelectorAll('.wide1');
    // const index = document.getElementById("index");
    
    if (wides.length === 0 || !index) return;

    // 부모 박스의 가두리 해제
    index.style.overflow = "visible";
    document.body.style.overflowX = "hidden";

    function updateWideLayout() {
        const browserWidth = window.innerWidth;
        const baseWidth = 1890; // [수정] index.html 디자인 기준 너비
        
        const rectPos = index.getBoundingClientRect();

        wides.forEach(el => {
            if (browserWidth >= baseWidth) {
                // 1. SVG 태그 자체의 너비 확장
                el.style.width = browserWidth + "px";
                el.style.left = "0px";
                el.style.marginLeft = -rectPos.left + "px";

                // 2. [핵심] SVG 내부의 rect 태그 너비 속성 강제 수정
                const innerRect = el.querySelector('rect');
                if (innerRect) {
                    innerRect.setAttribute('width', browserWidth);
                }
            } else {
                // 브라우저가 작을 때 원래 디자인대로 복구
                el.style.width = baseWidth + "px";
                el.style.left = "0px";
                el.style.marginLeft = "0px";

                const innerRect = el.querySelector('rect');
                if (innerRect) {
                    innerRect.setAttribute('width', baseWidth);
                }
            }
        });
    }

    // 이벤트 리스너 연결
    window.addEventListener("resize", updateWideLayout);
    window.addEventListener("scroll", updateWideLayout); // 부모 위치 변화 대응
    
    // 즉시 실행 및 지연 실행 (F5 대응)
    updateWideLayout();
    setTimeout(updateWideLayout, 50); 
    setTimeout(updateWideLayout, 50); // 이미지 로드 등에 따른 레이아웃 변화 대응
});


//--                    이미지 scale_opacity의 모션 처리

const imgs = document.querySelectorAll('.scale_opacity');

function updateOnScroll() {
  imgs.forEach(img => {
    const rect = img.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress1 = Math.min(Math.max(
      (windowHeight * 0.8 - rect.top) / (windowHeight * 0.15), 0), 1);

    const progress2 = Math.min(Math.max(
      (windowHeight * 0.9 - rect.top) / (windowHeight * 1), 0), 1);

    const moveX = progress2 < 0.5
      ? 30 * (progress2 * 2)
      : 30 * (1 - (progress2 - 0.5) * 2);

    img.style.opacity   = progress1;
    img.style.transform = `scale(${0.7 + 0.3 * progress1}) translateX(${moveX}px)`;
  });
}

window.addEventListener('scroll', updateOnScroll, { passive: true });
updateOnScroll();



//--                   .text_sub_RtoL 의 모션 처리

const texts = document.querySelectorAll('.text_sub_RtoL');

function updateTextOnScroll() {
  texts.forEach(text => {
    const rect = text.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const progress = Math.min(Math.max(
      (windowHeight * 0.7 - rect.top) / (windowHeight * 0.3), 0), 1);

    // 100px에서 시작해서 50px까지 이동 (왼쪽으로 50px 이동)
    const moveX = 50 - 50 * progress;

    text.style.opacity   = progress;
    text.style.transform = `translateX(${moveX}px)`;
  });
}

window.addEventListener('scroll', updateTextOnScroll, { passive: true });
updateTextOnScroll();



//--                    text_middle_RtoL 의 모션 처리

const test2 = document.querySelectorAll('.text_middle_RtoL');

function updateTextMiddleOnScroll() {    // ← 함수명 변경
  test2.forEach(ti => {
    const rect = ti.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const progress = Math.min(Math.max(
      (windowHeight * 1 - rect.top) / (windowHeight * 1.2), 0), 1);
    const moveX = 700 - 700 * progress;
    ti.style.opacity   = progress;
    ti.style.transform = `translateX(${moveX}px)`;
  });
}

window.addEventListener('scroll', updateTextMiddleOnScroll, { passive: true }); // ← 함수명 변경
updateTextMiddleOnScroll();

