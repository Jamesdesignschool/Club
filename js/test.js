// 폰트 로드 함수 정의
async function loadCustomFonts() {
  const fonts = [
    { name: 'Malgun Gothic', url: 'url(/font/malgun.ttf)', weight: 'normal' },
    { name: 'Malgun Gothic', url: 'url(/font/malgunbd.ttf)', weight: 'bold' },
    { name: 'Malgun Gothic', url: 'url(/font/malgunsl.ttf)', weight: '300' }, // Semilight

    { name: 'bauer', url: 'url(/font/BAUERG.TTF)', weight: 'normal' },

  ];

  try {
    const loadedFonts = await Promise.all(fonts.map(async (f) => {
      const fontFace = new FontFace(f.name, f.url, { weight: f.weight });
      const loadedFace = await fontFace.load(); // 폰트 파일 다운로드
      document.fonts.add(loadedFace);           // 문서에 폰트 추가
      return loadedFace;
    }));

    console.log("모든 폰트가 로드되었습니다.");
    document.body.style.fontFamily = "'bauer', sans-serif";
  } catch (error) {
    console.error("폰트 로드 중 오류 발생:", error);
  }
}

// 함수 실행
loadCustomFonts();
