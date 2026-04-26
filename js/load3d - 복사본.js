import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. 장면(Scene)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xa0a0a0);
// scene.fog = new THREE.Fog(0xa0a0a0, 10, 50); // 안개 효과로 바닥 경계 자연스럽게

// 2. 카메라(Camera)
const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(3, 22, 32);

// 3. 렌더러(Renderer) 및 그림자 활성화
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// [중요] 렌더러의 그림자 맵 활성화
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
document.body.appendChild(renderer.domElement);

// 4. 조명(Lights)
// 은은한 전체 조명
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// 그림자를 만드는 주 조명
const dirLight = new THREE.DirectionalLight(0xffffff, 4.5);
dirLight.position.set(5, 10, 7.5);
// [중요] 조명의 그림자 생성 활성화
dirLight.castShadow = true;
// 그림자 범위 및 품질 설정
dirLight.shadow.camera.top = 10;
dirLight.shadow.camera.bottom = -10;
dirLight.shadow.camera.left = -10;
dirLight.shadow.camera.right = 10;
dirLight.shadow.mapSize.width = 2048; // 그림자 해상도
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

// 5. 바닥(Floor) - 그림자가 맺힐 곳
const planeMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: 0xeeeeee, depthWrite: true })
);
planeMesh.rotation.x = -Math.PI / 2;
// [중요] 바닥은 그림자를 받아야 함
planeMesh.receiveShadow = true;
scene.add(planeMesh);

// 6. OrbitControls (마우스 카메라 제어)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.set(0, 1, 0);

// 7. GLTFLoader로 모델 로드
const loader = new GLTFLoader();
loader.load(
    './3d/teapot.glb',
    (gltf) => {
        const model = gltf.scene;

        // 1. 모델의 모든 메쉬에 그림자 설정
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
            }
        });

        // 2. [핵심] 모델을 정중앙으로 강제 이동
        const box = new THREE.Box3().setFromObject(model); // 모델의 전체 크기 계산
        const center = box.getCenter(new THREE.Vector3()); // 모델의 중심점 찾기
        
        model.position.x += (model.position.x - center.x);
        // model.position.y += (model.position.y - center.y); // Y축(높이) 중앙 정렬
        model.position.z += (model.position.z - center.z);

        // 만약 바닥 위에 바로 올려두고 싶다면 위 Y축 계산 대신 아래를 쓰세요
        model.position.y -= box.min.y; 

        scene.add(model);
        
        // 3. 카메라가 모델을 바라보게 설정
        controls.target.set(0, 0, 0); 
        controls.update();
    }
);


// 8. 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

// 창 크기 조절 대응
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();