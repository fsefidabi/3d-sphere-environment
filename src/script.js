import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import GUI from "lil-gui"

const gui = new GUI()
const canvas = document.querySelector("canvas.webgl")
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()
const japanEnvironmentMap = textureLoader.load("/textures/japanEnvironmentMap.jpg")
japanEnvironmentMap.mapping = THREE.EquirectangularReflectionMapping
japanEnvironmentMap.colorSpace = THREE.SRGBColorSpace

const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath("/textures/seaEnvironmentMaps/")
const seaEnvironmentMap = cubeTextureLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png"
])

const geometry = new THREE.IcosahedronGeometry(12, 15)
const material = new THREE.MeshBasicMaterial()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

window.currentEnvironment = "SEA"

updateEnvironmentMap()

function updateEnvironmentMap() {
    if (window.currentEnvironment === "SEA") {
        window.currentEnvironment = "JAPAN"
        applySeaEnvironment()
    } else {
        window.currentEnvironment = "SEA"
        applyJapanEnvironment()
    }
}

function applySeaEnvironment() {
    material.envMap = seaEnvironmentMap
    scene.background = seaEnvironmentMap
    scene.environment = seaEnvironmentMap
}

function applyJapanEnvironment() {
    material.envMap = japanEnvironmentMap
    scene.background = japanEnvironmentMap
    scene.environment = japanEnvironmentMap
}

const environmentController = gui.add({
    ChangeEnvironment: function () {
    }
}, "ChangeEnvironment").name("Toggle Environment")

environmentController.onChange(updateEnvironmentMap)

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener("resize", function () {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 35
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.enableZoom = false

const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

function animate() {
    controls.update()
    window.requestAnimationFrame(animate)
    render()
}

function render() {
    camera.lookAt(scene.position)
    renderer.render(scene, camera)
}

animate()
