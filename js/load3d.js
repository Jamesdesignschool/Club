import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// --- 애니메이션을 위한 변수 추가 ---
let mixer; 
const clock = new THREE.Clock(); 

// 1. 장면(Scene)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);                   //--    배경 색상 설정


// 2. 카메라(Camera)
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 200);                   //--    렌더링 거리 어디까지 해줄껀지
camera.position.set(0, 3, 36);


// 3. 렌더러(Renderer)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

// 4. 조명(Lights)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 4.5);
dirLight.position.set(5, 10, 7.5);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -20;                            // << -- 이걸 수정하면 그림자 표현이 안되는 부분이 나타남
dirLight.shadow.camera.left = -20;                              // << -- 이걸 수정하면 그림자 표현이 안되는 부분이 나타남
dirLight.shadow.camera.right = 20;                              // << -- 이걸 수정하면 그림자 표현이 안되는 부분이 나타남
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);



//-- 5. 바닥(Floor)                                                                        5번 블록을 아예 무력화 하면 바닥 자체가 없어짐
// const planeMesh = new THREE.Mesh(
//     new THREE.PlaneGeometry(100, 100), // << 바닥 크기 설정 (현재 회색)
//     new THREE.MeshStandardMaterial({ color: 0xdadada, depthWrite: true })                   // << -- 바닥 색상 설정 16진수 0x 다음 6자리를 바꿔야 함
// );
// planeMesh.rotation.x = -Math.PI / 2;
// planeMesh.receiveShadow = true;
// scene.add(planeMesh);



// 6. OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

controls.target.set(0, 7.6, 0);                                                              //-- 초기 Obit 위치 설정

controls.maxPolarAngle = Math.PI / 1.82;

controls.minDistance = 5;                                   // << -- 떨리는(Jitter) 현상 방지




//---                                                                       [추가] 마우스 오른쪽 버튼으로 Pan(화면 이동) 설정 ---
controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,    // 왼쪽 버튼: 회전
    MIDDLE: THREE.MOUSE.DOLLY,   // 휠: 확대/축소
    RIGHT: THREE.MOUSE.PAN       // 오른쪽 버튼: 화면 이동(Pan)
};
// ---------------------------------------------------

controls.update();



// --- [추가] 로딩 UI 생성 (JS로만 스타일 적용) ---
const loadingOverlay = document.createElement('div');
Object.assign(loadingOverlay.style, {
    position: 'fixed', top: '0', left: '0',
    width: '100%', height: '100%',
    background: 'rgba(255,255,255,0.95)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: '9999', fontFamily: 'sans-serif',
    transition: 'opacity 0.4s ease'
});

const loadingText = document.createElement('div');
Object.assign(loadingText.style, {
    fontSize: '16px', color: '#333', marginBottom: '16px'
});
loadingText.textContent = '로딩 중...';

const barTrack = document.createElement('div');
Object.assign(barTrack.style, {
    width: '260px', height: '6px',
    background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden'
});

const barFill = document.createElement('div');
Object.assign(barFill.style, {
    width: '0%', height: '100%',
    background: '#333', borderRadius: '4px',
    transition: 'width 0.2s ease'
});

barTrack.appendChild(barFill);
loadingOverlay.appendChild(loadingText);
loadingOverlay.appendChild(barTrack);
document.body.appendChild(loadingOverlay);
// -----------------------------------------------



// 7. GLTFLoader로 모델 로드
const loader = new GLTFLoader();
loader.load(
    './3D/teapot.glb',
    (gltf) => {
        const model = gltf.scene;

// model.traverse(function (node) {                                                        // << --    여기부터
//     if (node.isMesh) {
//         // 오브젝트 이름에 "noshadow"가 포함되어 있는지 확인 (대소문자 구분 안 함)
//         const hasNoShadowName = node.name.toLowerCase().includes("noshadow");

//         if (hasNoShadowName) {
//             // 이름에 noshadow가 있으면 그림자 비활성화
//             node.castShadow = false;
//             node.receiveShadow = false;
//             console.log(`이름 기반 그림자 제외: ${node.name}`); 
//         } else {
//             // 그 외에는 그림자 활성화
//             node.castShadow = true;
//             node.receiveShadow = true;
//         }
//     }
// });                                                                                        // << -- 여기까지가 파일 이름에 "noshadow"라는 이름이 있는 오브젝트는 그림자를 생성하지 않음

model.traverse(function (node) {
    if (node.isMesh) {
        // 1. 이름에 "noshadow"가 포함되어 있거나
        // 2. User Defined Properties 내용 전체에 "noshadow"라는 단어가 있는지 검사
        const rawData = JSON.stringify(node.userData).toLowerCase();
        const hasNoShadow = node.name.toLowerCase().includes("noshadow") || rawData.includes("noshadow");

        if (hasNoShadow) {
            // "noshadow" 단어가 발견되면 그림자 제외
            node.castShadow = false;
            node.receiveShadow = false;
            console.log(`그림자 비활성화됨: ${node.name}`);
        } else {
            // 그 외에는 그림자 활성화
            node.castShadow = true;
            node.receiveShadow = true;
        }
    }
});                                                                                             // << -- 여기까지 맥스에서 우클릭 후 Object Properties - Userdefined에 "babylonjs_tag = noshadow"를 넣어주거나 오브텍트 우클릭 후 (가장밑에) Babylon Properties에 태그를 "noshadow"라고 넣어주면 태그가 들어가고, 그림자 생성이 안됨



        // const box = new THREE.Box3().setFromObject(model);  //-- ----------------------------------------   여기부터 // << -- 이걸 지우면 x,y,z가 맥스 오브젝트 기준이 됨
        // const center = box.getCenter(new THREE.Vector3());
        
        // model.position.x += (model.position.x - center.x);
        // model.position.z += (model.position.z - center.z);
        // model.position.y -= box.min.y;  // ------------------------------------------------------------   여기까지 // << -- 이걸 지우면 x,y,z가 맥스 오브젝트 기준이 됨

        scene.add(model);

        // --- [추가] 애니메이션 실행 및 루프 설정 ---
        if (gltf.animations && gltf.animations.length > 0) {
            mixer = new THREE.AnimationMixer(model); // 모델에 믹서 연결
            const action = mixer.clipAction(gltf.animations[0]); // 첫 번째 애니메이션 클립 선택
            
            action.setLoop(THREE.LoopRepeat); // 무한 루프 설정 (기본값)
            action.play(); // 애니메이션 재생
        }
        
        // controls.target.set(-5, 9, 0);                   //--    오브젝트의 초기 바닥 설정

        controls.update();

        // --- [추가] 로딩 완료 시 오버레이 페이드 아웃 후 제거 ---
        loadingOverlay.style.opacity = '0';
        setTimeout(() => loadingOverlay.remove(), 400);
        // -------------------------------------------------------
    },
    // --- [추가] 로딩 진행률 업데이트 ---
(xhr) => {
    if (xhr.lengthComputable && xhr.total > 0) {
        // Math.min을 사용하여 100%를 초과하지 않도록 강제 제한
        let percent = Math.round((xhr.loaded / xhr.total) * 100);
        if (percent > 100) percent = 100; 

        barFill.style.width = percent + '%';
        loadingText.textContent = `로딩 중... ${percent}%`;
    } else {
        // total 크기를 알 수 없는 경우 (서버 압축 등)
        // 다운로드된 용량(MB)이라도 표시하여 멈춘 게 아님을 알림
        const loadedMB = (xhr.loaded / (1024 * 1024)).toFixed(2);
        loadingText.textContent = `다운로드 중... ${loadedMB} MB`;
        
        // 게이지가 계속 움직이는 애니메이션 효과를 주거나 
        // 99%에서 멈춰있게 처리할 수 있습니다.
        barFill.style.width = '99%'; 
    }
}
);



// 8. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // --- [추가] 매 프레임마다 애니메이션 시간 업데이트 ---
    if (mixer) {
        const delta = clock.getDelta(); // 프레임 간 시간 차이 계산
        mixer.update(delta);
    }
    controls.update();


if (camera.position.y < 0.05) { // 0.5 정도 여유를 두는 것이 좋습니다        // -- 여기부터 - 떨리는(Jitter) 현상 방지
        camera.position.y = 0.05;
    }                                                                       // -- 여기까지


    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();




//--                                                                    하단 Rotation 태그
// (function () {
//     const helpBox = document.createElement("div");
//     helpBox.innerText = "LMB : Rotation / MMB : Zoom / RMB : Pan";

//     helpBox.style.position = "fixed";
//     helpBox.style.bottom = "10px";
//     helpBox.style.left = "50%";
//     helpBox.style.transform = "translateX(-50%)";

//     helpBox.style.padding = "4px 20px";
//     helpBox.style.background = "rgba(0, 0, 0, 0.5)";
//     helpBox.style.color = "#fff";
//     helpBox.style.fontSize = "14px";
//     helpBox.style.fontFamily = "Arial, sans-serif";

//     helpBox.style.borderRadius = "999px"; // 완전 둥글게
//     helpBox.style.backdropFilter = "blur(6px)"; // 유리 느낌 (지원 브라우저에서만)
    
//     helpBox.style.zIndex = "9999";
//     helpBox.style.pointerEvents = "none"; // 클릭 방해 안함

//     document.body.appendChild(helpBox);
// })();



(function () {
    const img = document.createElement("img");

    // 이미지 경로
    img.src = "./3D/mouse.png";

    // 스타일
    img.style.position = "fixed";
    img.style.bottom = "10px";
    img.style.left = "50%";
    img.style.transform = "translateX(-50%)";

    img.style.width = "140px"; // 필요하면 조절
    img.style.height = "64px";

    img.style.opacity = "1.6"; // 👈 여기서 투명도 조절 (0 ~ 1)

    img.style.zIndex = "9999";
    img.style.pointerEvents = "none"; // 클릭 방해 안함

    // 부드러운 등장
    img.style.transition = "opacity 0.3s ease";

    document.body.appendChild(img);
})();
