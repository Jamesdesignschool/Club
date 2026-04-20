
//--                    모바일이면 index_m.html로 이동 (((((((  모바일이라 로드 할 필요 없음  )))))))))

    // // 모바일 기기 감지 함수
    // function isMobile() {
    //     const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    //     // 흔한 모바일 기기 키워드 체크
    //     return /android|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    // }

    // // 모바일일 경우 iot_m.html로 이동
    // if (isMobile()) {
    //     window.location.href = "index_m.html";
    // }


//--          맑은 고딕 폴더에서 열음
async function loadCustomFonts() {
  const fonts = [
    { name: 'Malgun Gothic', url: 'url(/font/malgun.ttf)', weight: 'normal' },
    { name: 'Malgun Gothic', url: 'url(/font/malgunbd.ttf)', weight: 'bold' },
    { name: 'Malgun Gothic', url: 'url(/font/malgunsl.ttf)', weight: '300' } // Semilight
    { name: 'Malgun Gothic', url: 'url(/font/malgunsl.ttf)', weight: '400' } // Semilight

    
  ];

  try {
    const loadedFonts = await Promise.all(fonts.map(async (f) => {
      const fontFace = new FontFace(f.name, f.url, { weight: f.weight });
      const loadedFace = await fontFace.load(); // 폰트 파일 다운로드
      document.fonts.add(loadedFace);           // 문서에 폰트 추가
      return loadedFace;
    }));

    console.log("모든 폰트가 로드되었습니다.");
    document.body.style.fontFamily = "'Malgun Gothic', sans-serif";
  } catch (error) {
    console.error("폰트 로드 중 오류 발생:", error);
  }
}

// 함수 실행
loadCustomFonts();



//--                    PC 메뉴 탑에 불러옴

// window.addEventListener("load", function () {                // <---- 똑같은건데 메뉴가 늦게뜸
document.addEventListener("DOMContentLoaded", function () {     // <---- 이걸로 바꾸면 메뉴가 더 빠르게 뜸
    
    const menuUrl = '/sub_Menu.html'; // 불러올 메뉴 파일명
    const menuWidth = 360;        // 메뉴 가로 너비
    const menuHeight = 300;         // 메뉴 세로 높이

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
link2.href = '/css/m_fonts.css';
document.head.appendChild(link2);


// //--          유튜브 레이지 로드


// document.addEventListener("DOMContentLoaded", function() {
//     // 1. 위에서 만든 class="lazy-youtube"를 가진 모든 요소를 찾습니다.
//     const lazyVideos = document.querySelectorAll(".youtube");

//     // 2. 화면에 보이는지 감시하는 '관찰자' 생성
//     const observer = new IntersectionObserver((entries, observer) => {
//         entries.forEach(entry => {
//             if (entry.isIntersecting) { // 화면에 영상이 나타나면!
//                 const iframe = entry.target;
//                 // 숨겨둔 data-src를 진짜 src로 옮겨서 로딩 시작
//                 iframe.src = iframe.dataset.src; 
                
//                 // 로딩이 시작됐으니 더 이상 감시할 필요 없음
//                 observer.unobserve(iframe);
//             }
//         });
//     });

//     // 3. 모든 영상에 대해 감시 시작
//     lazyVideos.forEach(video => observer.observe(video));
// });




//-- 타이틀 일관적으로 변경

document.addEventListener("DOMContentLoaded", function() {
    document.title = "클럽디자인";
});


//--                    /css/pc_youtube.css를 로드

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


//--                    페이지에 핏팅

const meta = document.querySelector('meta[name="viewport"]');
if (meta) {
    meta.content = 'width=360';
} else {
    const newMeta = document.createElement('meta');
    newMeta.name = "viewport";
    newMeta.content = "width=360";
    document.head.appendChild(newMeta);
}


//--                    #index_box_movie 고정 및 확대 패러록스 (모바일 전용임 / PC용이랑 다름)

window.addEventListener("load", function () {
    const movie = document.getElementById("index_box_movie");
    if (!movie) return;

    // 1. 초기 스타일 설정 (심플하게)
    movie.style.position = "fixed";
    movie.style.top = "0";
    movie.style.left = "50%";
    movie.style.width = "360px"; // 기준 가로 사이즈 고정
    movie.style.zIndex = "-1";
    movie.style.display = "block";

    function updateParallax() {
        const scrollY = window.pageYOffset;
        
        // [수정 포인트] 패럴랙스 강도 조절
        // 0.3 이면 실제 스크롤보다 30% 속도로 천천히 따라옵니다.
        // 마이너스(-)를 주어야 화면이 올라갈 때 영상이 천천히 위로 올라갑니다.
        const parallaxSpeed = 0.6; 
        const moveY = scrollY * parallaxSpeed;

        // 중앙 정렬 상태에서 Y축 이동만 적용
        movie.style.transform = `translateX(-50%) translateY(${moveY}px)`;
    }

    // 스크롤 시 실행
    window.addEventListener("scroll", updateParallax, { passive: true });
    
    // 초기 위치 실행
    updateParallax();
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
      ? 20 * (progress2 * 2)
      : 20 * (1 - (progress2 - 0.5) * 2);

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
      (windowHeight * 0.96 - rect.top) / (windowHeight * 0.26), 0), 1);

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
      (windowHeight * 1.7 - rect.top) / (windowHeight * 1.4), 0), 1);
      // 오브젝트가 너무 빨리 도착하는 이유는 애니메이션이 시작되고 끝나는 구간(트리거 범위)이 너무 좁고 위쪽에 몰려 있기 때문입니다.
      // 현재 코드의 windowHeight * 0.9에서 시작해 0.2 구간 동안만 움직이게 되어 있는데, 이 범위를 더 넓게(예: 0.5) 잡고,
      // **종료 지점을 더 위쪽(0.1)**으로 올려주면 페이지를 한참 더 올려야 애니메이션이 마감됩니다.
    const moveX = 900 - 900 * progress;
    ti.style.opacity   = progress;
    ti.style.transform = `translateX(${moveX}px)`;
  });
}

window.addEventListener('scroll', updateTextMiddleOnScroll, { passive: true }); // ← 함수명 변경
updateTextMiddleOnScroll();


//--          맥 os 에서는 산돌고딕으로

// async function applyMobileFont() {
//     // 1. iOS/macOS 여부 확인
//     const isApple = /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
    
//     // 2. 맑은 고딕 가용성 체크
//     // iOS는 맑은 고딕이 없으므로 항상 false가 나옵니다.
//     const isMalgunAvailable = document.fonts.check("12px 'Malgun Gothic'");

//     if (isApple || !isMalgunAvailable) {
//         console.log("Apple 기기 또는 맑은 고딕 부재: 산돌고딕 스택 적용");
        
//         // 아이폰 크롬이 인식할 수 있는 모든 산돌고딕 명칭을 스택으로 넣습니다.
//         document.body.style.fontFamily = "-apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif";
//     }
// }

// // 폰트 준비가 끝난 후 + 즉시 실행 (안전장치)
// if (document.fonts && document.fonts.ready) {
//     document.fonts.ready.then(applyMobileFont);
// } else {
//     window.onload = applyMobileFont;
// }



