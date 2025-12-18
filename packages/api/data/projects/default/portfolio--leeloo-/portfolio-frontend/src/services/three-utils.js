// src/services/three-utils.js

/**
 * Three.js Utility Functions Service
 * Provides helper functions for 3D scene setup, geometry creation, materials,
 * lighting, and interactive element management
 */

import * as THREE from 'three'

/**
 * Scene Configuration and Setup
 */
export const createScene = () => {
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0f0f1e)
  scene.fog = new THREE.Fog(0x0f0f1e, 100, 1000)
  return scene
}

export const createCamera = (width, height) => {
  const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
  camera.position.z = 5
  return camera
}

export const createRenderer = (canvas, width, height) => {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    precision: 'highp',
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.0
  return renderer
}

/**
 * Lighting Setup
 */
export const setupLighting = (scene) => {
  // Ambient light for base illumination
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)

  // Directional light for shadows and contrast
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
  directionalLight.position.set(10, 15, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  directionalLight.shadow.camera.far = 50
  directionalLight.shadow.camera.near = 0.1
  scene.add(directionalLight)

  // Neon blue point light
  const pointLight1 = new THREE.PointLight(0x00ffff, 1, 100)
  pointLight1.position.set(10, 10, 10)
  scene.add(pointLight1)

  // Neon magenta point light
  const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 100)
  pointLight2.position.set(-10, -10, 10)
  scene.add(pointLight2)

  return { ambientLight, directionalLight, pointLight1, pointLight2 }
}

/**
 * Material Creation with Neon Effects
 */
export const createNeonMaterial = (color = 0x00ffff) => {
  return new THREE.MeshStandardMaterial({
    color,
    metalness: 0.7,
    roughness: 0.2,
    emissive: color,
    emissiveIntensity: 0.5,
    wireframe: false,
  })
}

export const createGlassMaterial = () => {
  return new THREE.MeshStandardMaterial({
    color: 0x00ffff,
    metalness: 0.1,
    roughness: 0.1,
    transparent: true,
    opacity: 0.7,
    emissive: 0x00ffff,
    emissiveIntensity: 0.3,
  })
}

export const createWireframeMaterial = (color = 0x00ffff) => {
  return new THREE.LineBasicMaterial({
    color,
    linewidth: 2,
  })
}

/**
 * Geometry Creation
 */
export const createGeometries = () => {
  return {
    cube: new THREE.BoxGeometry(2, 2, 2),
    sphere: new THREE.SphereGeometry(1.5, 32, 32),
    icosahedron: new THREE.IcosahedronGeometry(1.5, 4),
    octahedron: new THREE.OctahedronGeometry(1.5, 2),
    torus: new THREE.TorusGeometry(1, 0.4, 16, 100),
    cone: new THREE.ConeGeometry(1, 3, 32),
    pyramid: new THREE.TetrahedronGeometry(2, 0),
  }
}

export const createEdgesGeometry = (geometry) => {
  return new THREE.EdgesGeometry(geometry)
}

/**
 * Mesh Creation with Interactive Properties
 */
export const createInteractiveMesh = (geometry, material, position = { x: 0, y: 0, z: 0 }) => {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position.x, position.y, position.z)
  mesh.castShadow = true
  mesh.receiveShadow = true
  mesh.userData.interactive = true
  mesh.userData.originalPosition = { ...position }
  mesh.userData.originalRotation = { x: 0, y: 0, z: 0 }
  return mesh
}

export const createWireframe = (geometry, color = 0x00ffff, mesh = null) => {
  const edges = createEdgesGeometry(geometry)
  const wireframe = new THREE.LineSegments(edges, createWireframeMaterial(color))
  if (mesh) {
    wireframe.position.copy(mesh.position)
    wireframe.scale.copy(mesh.scale)
  }
  return wireframe
}

/**
 * Particle System Creation
 */
export const createParticleSystem = (count = 1000) => {
  const geometry = new THREE.BufferGeometry()
  const positions = new Float32Array(count * 3)
  const velocities = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 100
    positions[i + 1] = (Math.random() - 0.5) * 100
    positions[i + 2] = (Math.random() - 0.5) * 100

    velocities[i] = (Math.random() - 0.5) * 0.5
    velocities[i + 1] = (Math.random() - 0.5) * 0.5
    velocities[i + 2] = (Math.random() - 0.5) * 0.5

    const colorChoice = Math.random()
    if (colorChoice < 0.33) {
      colors[i] = 0
      colors[i + 1] = 1
      colors[i + 2] = 1
    } else if (colorChoice < 0.66) {
      colors[i] = 1
      colors[i + 1] = 0
      colors[i + 2] = 1
    } else {
      colors[i] = 0
      colors[i + 1] = 0.5
      colors[i + 2] = 1
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const material = new THREE.PointsMaterial({
    size: 0.1,
    vertexColors: true,
    sizeAttenuation: true,
  })

  const particles = new THREE.Points(geometry, material)
  particles.userData.velocities = velocities
  return particles
}

export const updateParticleSystem = (particles) => {
  const positions = particles.geometry.attributes.position.array
  const velocities = particles.userData.velocities

  for (let i = 0; i < positions.length; i += 3) {
    positions[i] += velocities[i]
    positions[i + 1] += velocities[i + 1]
    positions[i + 2] += velocities[i + 2]

    if (Math.abs(positions[i]) > 50) velocities[i] *= -1
    if (Math.abs(positions[i + 1]) > 50) velocities[i + 1] *= -1
    if (Math.abs(positions[i + 2]) > 50) velocities[i + 2] *= -1
  }

  particles.geometry.attributes.position.needsUpdate = true
}

/**
 * Animation and Rotation Utilities
 */
export const animateMesh = (mesh, deltaTime, speed = 1) => {
  if (mesh.userData.interactive) {
    mesh.rotation.x += deltaTime * speed * 0.5
    mesh.rotation.y += deltaTime * speed * 0.7
    mesh.rotation.z += deltaTime * speed * 0.3
  }
}

export const rotateMesh = (mesh, axis = 'y', speed = 0.01) => {
  switch (axis) {
    case 'x':
      mesh.rotation.x += speed
      break
    case 'y':
      mesh.rotation.y += speed
      break
    case 'z':
      mesh.rotation.z += speed
      break
    default:
      mesh.rotation.x += speed
      mesh.rotation.y += speed
      mesh.rotation.z += speed
  }
}

export const floatMesh = (mesh, time, amplitude = 0.5, frequency = 1) => {
  if (mesh.userData.originalPosition) {
    mesh.position.y = mesh.userData.originalPosition.y + Math.sin(time * frequency) * amplitude
  }
}

/**
 * Mouse Interaction Utilities
 */
export const createRaycaster = () => {
  return new THREE.Raycaster()
}

export const getMousePosition = (event, containerWidth, containerHeight) => {
  return {
    x: (event.clientX / containerWidth) * 2 - 1,
    y: -(event.clientY / containerHeight) * 2 + 1,
  }
}

export const checkIntersections = (raycaster, camera, mouse, objects) => {
  raycaster.setFromCamera(mouse, camera)
  return raycaster.intersectObjects(objects, true)
}

export const highlightMesh = (mesh, isHighlighted = true) => {
  if (isHighlighted) {
    mesh.scale.set(1.2, 1.2, 1.2)
    if (mesh.material.emissiveIntensity !== undefined) {
      mesh.material.emissiveIntensity = 1
    }
  } else {
    mesh.scale.set(1, 1, 1)
    if (mesh.material.emissiveIntensity !== undefined) {
      mesh.material.emissiveIntensity = 0.5
    }
  }
}

/**
 * Drag and Drop Utilities
 */
export const startDragMesh = (mesh) => {
  mesh.userData.isDragging = true
  mesh.userData.dragStart = { ...mesh.position }
  return mesh
}

export const dragMesh = (mesh, delta) => {
  if (mesh.userData.isDragging) {
    mesh.position.x += delta.x * 0.01
    mesh.position.y -= delta.y * 0.01
  }
}

export const endDragMesh = (mesh) => {
  mesh.userData.isDragging = false
}

/**
 * Geometry Utilities
 */
export const scaleGeometry = (geometry, scale = 1) => {
  geometry.scale(scale, scale, scale)
  return geometry
}

export const centerGeometry = (geometry) => {
  geometry.center()
  return geometry
}

export const cloneGeometry = (geometry) => {
  return geometry.clone()
}

/**
 * Camera Controls
 */
export const orbitCamera = (camera, time, radius = 10, height = 5) => {
  camera.position.x = Math.cos(time * 0.3) * radius
  camera.position.y = height
  camera.position.z = Math.sin(time * 0.3) * radius
  camera.lookAt(0, 0, 0)
}

export const resetCamera = (camera) => {
  camera.position.set(0, 0, 5)
  camera.lookAt(0, 0, 0)
}

/**
 * Utility Functions
 */
export const disposeGeometry = (geometry) => {
  geometry.dispose()
}

export const disposeMaterial = (material) => {
  material.dispose()
}

export const disposeMesh = (mesh) => {
  if (mesh.geometry) disposeMesh(mesh.geometry)
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(mat => disposeMaterial(mat))
    } else {
      disposeMaterial(mesh.material)
    }
  }
}

export const handleWindowResize = (camera, renderer, containerWidth, containerHeight) => {
  camera.aspect = containerWidth / containerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(containerWidth, containerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}

/**
 * Post-Processing Effects Setup
 */
export const createGlowEffect = (scene, geometry, color = 0x00ffff) => {
  const glowGeometry = geometry.clone()
  const glowMaterial = new THREE.MeshBasicMaterial({
    color,
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
  })
  const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial)
  glowMesh.scale.set(1.25, 1.25, 1.25)
  return glowMesh
}

/**
 * Color Utilities
 */
export const getNeonColor = (type = 'cyan') => {
  const colors = {
    cyan: 0x00ffff,
    magenta: 0xff00ff,
    lime: 0x00ff00,
    blue: 0x0099ff,
    purple: 0x9900ff,
  }
  return colors[type] || colors.cyan
}

export const randomNeonColor = () => {
  const neonColors = [0x00ffff, 0xff00ff, 0x00ff00, 0x0099ff, 0x9900ff]
  return neonColors[Math.floor(Math.random() * neonColors.length)]
}