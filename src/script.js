import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"

const canvas = document.querySelector("canvas.webgl")

const scene = new THREE.Scene()

const cubeTextureLoader = new THREE.CubeTextureLoader()
cubeTextureLoader.setPath("/textures/environmentMaps/")
const environmentMapTexture = cubeTextureLoader.load([
    "px.png",
    "nx.png",
    "py.png",
    "ny.png",
    "pz.png",
    "nz.png"
])

const geometry = new THREE.IcosahedronGeometry(12, 15)
const material = new THREE.MeshBasicMaterial()
material.envMap = environmentMapTexture
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

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

scene.background = environmentMapTexture

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000)
camera.position.z = 35
scene.add(camera)

const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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
