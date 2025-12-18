import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import gsap from 'gsap'

/**
 * ThreeScene Component
 * Interactive 3D scene with manipulable elements
 * Features:
 * - Animated rotating cubes and spheres
 * - Mouse interaction for object manipulation
 * - Neon material effects with bloom simulation
 * - Responsive canvas sizing
 * - Performance optimized with requestAnimationFrame
 * - Parallax effect on scroll
 */
const ThreeScene = React.forwardRef(({ interactive = true }, ref) => {
  const containerRef = useRef(null)
  const sceneRef = useRef(null)
  const cameraRef = useRef(null)
  const rendererRef = useRef(null)
  const objectsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const raycasterRef = useRef(new THREE.Raycaster())
  const mousePositionRef = useRef(new THREE.Vector2())

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x0a0a14)
    scene.fog = new THREE.Fog(0x0a0a14, 100, 1000)
    sceneRef.current = scene

    // Camera setup
    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.z = 50
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowShadowMap
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0x00ffff, 1.5, 200)
    pointLight1.position.set(50, 50, 50)
    pointLight1.castShadow = true
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 200)
    pointLight2.position.set(-50, -50, 50)
    pointLight2.castShadow = true
    scene.add(pointLight2)

    // Create neon material
    const createNeonMaterial = (color) => {
      return new THREE.MeshStandardMaterial({
        color: new THREE.Color(color),
        metalness: 0.8,
        roughness: 0.2,
        emissive: new THREE.Color(color),
        emissiveIntensity: 0.5,
      })
    }

    // Create geometric objects
    const objects = []

    // Rotating cube
    const cubeGeometry = new THREE.BoxGeometry(15, 15, 15)
    const cubeMaterial = createNeonMaterial(0x00ffff)
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)
    cube.position.set(-25, 0, 0)
    cube.castShadow = true
    cube.receiveShadow = true
    cube.userData.originalPosition = cube.position.clone()
    cube.userData.velocity = new THREE.Vector3()
    scene.add(cube)
    objects.push(cube)

    // Rotating sphere
    const sphereGeometry = new THREE.IcosahedronGeometry(10, 4)
    const sphereMaterial = createNeonMaterial(0xff00ff)
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.position.set(25, 0, 0)
    sphere.castShadow = true
    sphere.receiveShadow = true
    sphere.userData.originalPosition = sphere.position.clone()
    sphere.userData.velocity = new THREE.Vector3()
    scene.add(sphere)
    objects.push(sphere)

    // Torus knot
    const torusGeometry = new THREE.TorusGeometry(12, 4, 100, 100)
    const torusMaterial = createNeonMaterial(0x00ff88)
    const torus = new THREE.Mesh(torusGeometry, torusMaterial)
    torus.position.set(0, 25, 0)
    torus.castShadow = true
    torus.receiveShadow = true
    torus.userData.originalPosition = torus.position.clone()
    torus.userData.velocity = new THREE.Vector3()
    scene.add(torus)
    objects.push(torus)

    // Octahedron
    const octaGeometry = new THREE.OctahedronGeometry(12, 2)
    const octaMaterial = createNeonMaterial(0xffff00)
    const octahedron = new THREE.Mesh(octaGeometry, octaMaterial)
    octahedron.position.set(0, -25, 0)
    octahedron.castShadow = true
    octahedron.receiveShadow = true
    octahedron.userData.originalPosition = octahedron.position.clone()
    octahedron.userData.velocity = new THREE.Vector3()
    scene.add(octahedron)
    objects.push(octahedron)

    objectsRef.current = objects

    // Handle mouse movement
    const handleMouseMove = (event) => {
      mousePositionRef.current.x = (event.clientX / width) * 2 - 1
      mousePositionRef.current.y = -(event.clientY / height) * 2 + 1

      mouseRef.current.targetX = (event.clientX / width) * 2 - 1
      mouseRef.current.targetY = -(event.clientY / height) * 2 + 1

      // Raycasting for object interaction
      if (interactive) {
        raycasterRef.current.setFromCamera(mousePositionRef.current, camera)
        const intersects = raycasterRef.current.intersectObjects(objects)

        objects.forEach((obj) => {
          obj.userData.hovered = false
        })

        if (intersects.length > 0) {
          intersects[0].object.userData.hovered = true
        }
      }
    }

    // Handle window resize
    const handleResize = () => {
      const newWidth = containerRef.current.clientWidth
      const newHeight = containerRef.current.clientHeight
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
    }

    // Handle scroll parallax
    const handleScroll = () => {
      const scrollY = window.scrollY
      const parallaxFactor = scrollY * 0.01
      camera.position.y = parallaxFactor
    }

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)
    window.addEventListener('scroll', handleScroll)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      // Smooth mouse tracking
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.1
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.1

      // Update objects
      objects.forEach((obj, index) => {
        // Rotation
        obj.rotation.x += 0.003 + index * 0.0015
        obj.rotation.y += 0.005 + index * 0.002
        obj.rotation.z += 0.002 + index * 0.001

        // Floating animation
        obj.position.y += Math.sin(Date.now() * 0.0005 + index) * 0.01

        // Interactive pulling towards mouse
        if (interactive && obj.userData.hovered) {
          obj.userData.velocity.x = mouseRef.current.x * 50 - obj.position.x
          obj.userData.velocity.y = mouseRef.current.y * 50 - obj.position.y
          obj.userData.velocity.z *= 0.95

          obj.position.x += obj.userData.velocity.x * 0.02
          obj.position.y += obj.userData.velocity.y * 0.02
        } else {
          // Return to original position
          obj.userData.velocity.x *= 0.95
          obj.userData.velocity.y *= 0.95

          obj.position.x += (obj.userData.originalPosition.x - obj.position.x) * 0.02
          obj.position.z += (obj.userData.originalPosition.z - obj.position.z) * 0.02
        }

        // Scale on hover
        const targetScale = obj.userData.hovered ? 1.15 : 1
        obj.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

        // Emissive intensity pulse
        if (obj.material.emissive) {
          obj.material.emissiveIntensity = 0.5 + Math.sin(Date.now() * 0.003) * 0.3
        }
      })

      // Camera slight rotation based on mouse
      camera.position.x += (mouseRef.current.x * 5 - camera.position.x) * 0.05
      camera.lookAt(scene.position)

      renderer.render(scene, camera)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      containerRef.current?.removeChild(renderer.domElement)
      renderer.dispose()
      cubeGeometry.dispose()
      sphereGeometry.dispose()
      torusGeometry.dispose()
      octaGeometry.dispose()
      cubeMaterial.dispose()
      sphereMaterial.dispose()
      torusMaterial.dispose()
      octaMaterial.dispose()
    }
  }, [interactive])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, rgba(10, 10, 20, 0.98) 0%, rgba(15, 15, 30, 0.98) 50%, rgba(10, 10, 20, 0.98) 100%)',
      }}
    />
  )
})

ThreeScene.displayName = 'ThreeScene'

export default ThreeScene