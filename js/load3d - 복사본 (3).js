
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


