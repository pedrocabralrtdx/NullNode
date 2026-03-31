import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import type { User } from '../types'
import CyberButton from './CyberButton'

type Props = {
  users: User[]
  currentUserId: string
  onSelectUser: (userId: string) => void
}

type HouseMesh = {
  userId: string
  mesh: any
}

const GREEN = new THREE.Color('#7CFF9B')

export default function NetworkMap3D({ users, currentUserId, onSelectUser }: Props) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [hovered, setHovered] = useState<User | null>(null)
  const hoveredRef = useRef<User | null>(null)
  const [focusUserId, setFocusUserId] = useState<string>(currentUserId)
  const focusUserIdRef = useRef<string>(currentUserId)
  const focusHandlerRef = useRef<(userId: string) => void>(() => {})
  const housePositionsRef = useRef<Map<string, any>>(new Map())
  const labelRef = useRef<Map<string, any>>(new Map())
  const controlsRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const focusTargetRef = useRef<any>(null)
  const focusOffsetRef = useRef<any>(null)

  useEffect(() => {
    setFocusUserId(currentUserId)
  }, [currentUserId])

  useEffect(() => {
    focusUserIdRef.current = focusUserId
  }, [focusUserId])

  useEffect(() => {
    if (focusHandlerRef.current) {
      focusHandlerRef.current(focusUserId)
    }
  }, [focusUserId])

  const handleFocus = (userId: string) => {
    setFocusUserId(userId)
    focusHandlerRef.current(userId)
  }

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      controlsRef.current.target.set(0, 18, 0)
      cameraRef.current.position.set(0, 130, 240)
      controlsRef.current.update()
    }
    handleFocus(currentUserId)
  }

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color('#000000')

    const camera = new THREE.PerspectiveCamera(45, 1, 1, 2000)
    camera.position.set(0, 130, 240)

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.target.set(0, 18, 0)
    controls.maxPolarAngle = Math.PI / 2.1
    controls.minPolarAngle = Math.PI / 6
    controls.minDistance = 120
    controls.maxDistance = 360
    controls.enablePan = true
    controlsRef.current = controls
    cameraRef.current = camera

    const ambient = new THREE.AmbientLight(0xffffff, 0.55)
    scene.add(ambient)

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.65)
    dirLight.position.set(140, 220, 120)
    dirLight.castShadow = true
    dirLight.shadow.mapSize.set(1024, 1024)
    scene.add(dirLight)

    const glowLight = new THREE.PointLight(GREEN, 0.8, 500, 2)
    glowLight.position.set(-60, 80, -40)
    scene.add(glowLight)

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(420, 420),
      new THREE.MeshStandardMaterial({
        color: '#070707',
        metalness: 0.2,
        roughness: 0.85
      })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    const grid = new THREE.GridHelper(420, 24, 0xffffff, 0xffffff)
    if (Array.isArray(grid.material)) {
      grid.material.forEach((material: any) => {
        material.opacity = 0.1
        material.transparent = true
      })
    } else {
      grid.material.opacity = 0.1
      grid.material.transparent = true
    }
    scene.add(grid)

    const cityGroup = new THREE.Group()
    scene.add(cityGroup)

    const blockGeometry = new THREE.BoxGeometry(1, 1, 1)
    const blockMaterial = new THREE.MeshStandardMaterial({
      color: '#111111',
      metalness: 0.15,
      roughness: 0.75
    })

    const cols = 10
    const rows = 8
    const spacing = 34
    const blocksTotal = cols * rows
    const instancedBlocks = new THREE.InstancedMesh(blockGeometry, blockMaterial, blocksTotal)
    instancedBlocks.castShadow = true
    instancedBlocks.receiveShadow = true

    const dummy = new THREE.Object3D()
    let blockIndex = 0
    for (let x = 0; x < cols; x += 1) {
      for (let z = 0; z < rows; z += 1) {
        const height = 10 + Math.random() * 70
        const size = 16 + Math.random() * 12
        dummy.position.set(
          (x - cols / 2) * spacing,
          height / 2,
          (z - rows / 2) * spacing
        )
        dummy.scale.set(size, height, size)
        dummy.updateMatrix()
        instancedBlocks.setMatrixAt(blockIndex, dummy.matrix)
        blockIndex += 1
      }
    }
    cityGroup.add(instancedBlocks)

    const parkMaterial = new THREE.MeshStandardMaterial({
      color: '#0b2b18',
      metalness: 0,
      roughness: 0.9,
      emissive: GREEN,
      emissiveIntensity: 0.15
    })
    const parkPositions = [
      new THREE.Vector3(-90, 0.6, -40),
      new THREE.Vector3(60, 0.6, 70),
      new THREE.Vector3(-40, 0.6, 90)
    ]
    parkPositions.forEach((pos) => {
      const park = new THREE.Mesh(new THREE.PlaneGeometry(60, 38), parkMaterial)
      park.rotation.x = -Math.PI / 2
      park.position.copy(pos)
      cityGroup.add(park)
    })

    const riverCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(160, 0.2, -150),
      new THREE.Vector3(120, 0.2, -40),
      new THREE.Vector3(140, 0.2, 40),
      new THREE.Vector3(90, 0.2, 140)
    ])
    const riverPoints = riverCurve.getPoints(80)
    const riverGeometry = new THREE.TubeGeometry(riverCurve, 80, 6, 10, false)
    const riverMaterial = new THREE.MeshStandardMaterial({
      color: '#040404',
      roughness: 0.3,
      metalness: 0.4,
      emissive: GREEN,
      emissiveIntensity: 0.12
    })
    const river = new THREE.Mesh(riverGeometry, riverMaterial)
    river.position.y = 0.2
    cityGroup.add(river)

    const riverLine = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(riverPoints),
      new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.25 })
    )
    riverLine.position.y = 0.3
    cityGroup.add(riverLine)

    const houseMeshes: HouseMesh[] = []
    const houseGroup = new THREE.Group()
    cityGroup.add(houseGroup)

    const createLabelSprite = (text: string) => {
      const canvas = document.createElement('canvas')
      canvas.width = 256
      canvas.height = 64
      const context = canvas.getContext('2d')
      if (context) {
        context.fillStyle = 'rgba(0, 0, 0, 0.6)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        context.strokeStyle = 'rgba(255, 255, 255, 0.4)'
        context.strokeRect(2, 2, canvas.width - 4, canvas.height - 4)
        context.fillStyle = '#ffffff'
        context.font = '20px "Share Tech Mono", monospace'
        context.textAlign = 'center'
        context.textBaseline = 'middle'
        context.fillText(text, canvas.width / 2, canvas.height / 2)
      }
      const texture = new THREE.CanvasTexture(canvas)
      texture.needsUpdate = true
      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.9 })
      const sprite = new THREE.Sprite(material)
      sprite.scale.set(36, 9, 1)
      return { sprite, texture, material }
    }

    const houseBaseGeo = new THREE.BoxGeometry(10, 8, 10)
    const houseRoofGeo = new THREE.ConeGeometry(8, 6, 4)
    const houseMaterial = new THREE.MeshStandardMaterial({
      color: '#f2f2f2',
      metalness: 0.2,
      roughness: 0.6
    })
    const currentMaterial = new THREE.MeshStandardMaterial({
      color: '#202020',
      emissive: GREEN,
      emissiveIntensity: 0.35,
      metalness: 0.2,
      roughness: 0.5
    })

    const userSlots = users.map((user, index) => ({
      user,
      position: new THREE.Vector3(
        (index % 4) * 52 - 78,
        4,
        Math.floor(index / 4) * 52 - 70
      )
    }))

    housePositionsRef.current = new Map(
      userSlots.map((slot) => [slot.user.id, slot.position.clone()])
    )

    const labelTextures: any[] = []
    const labelMaterials: any[] = []

    userSlots.forEach(({ user, position }) => {
      const group = new THREE.Group()
      const base = new THREE.Mesh(
        houseBaseGeo,
        user.id === currentUserId ? currentMaterial : houseMaterial
      )
      base.castShadow = true
      base.receiveShadow = true
      base.position.set(position.x, position.y, position.z)

      const roof = new THREE.Mesh(
        houseRoofGeo,
        user.id === currentUserId ? currentMaterial : houseMaterial
      )
      roof.castShadow = true
      roof.position.set(position.x, position.y + 7, position.z)
      roof.rotation.y = Math.PI / 4

      group.add(base, roof)
      houseGroup.add(group)
      houseMeshes.push({ userId: user.id, mesh: group })

      const { sprite, texture, material } = createLabelSprite(user.handle)
      sprite.position.set(position.x, position.y + 22, position.z)
      sprite.visible = user.id === currentUserId
      houseGroup.add(sprite)
      labelRef.current.set(user.id, sprite)
      labelTextures.push(texture)
      labelMaterials.push(material)
    })

    const ringGeometry = new THREE.RingGeometry(12, 14, 64)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.7,
      side: THREE.DoubleSide
    })
    const pulseRing = new THREE.Mesh(ringGeometry, ringMaterial)
    pulseRing.rotation.x = -Math.PI / 2
    const currentSlot = userSlots.find((slot) => slot.user.id === currentUserId)
    if (currentSlot) {
      pulseRing.position.set(currentSlot.position.x, 0.6, currentSlot.position.z)
    }
    cityGroup.add(pulseRing)

    const focusRingGeometry = new THREE.RingGeometry(10, 13, 64)
    const focusRingMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide
    })
    const focusRing = new THREE.Mesh(focusRingGeometry, focusRingMaterial)
    focusRing.rotation.x = -Math.PI / 2
    focusRing.visible = false
    cityGroup.add(focusRing)

    const beamGeometry = new THREE.CylinderGeometry(1.8, 2.6, 60, 16, 1, true)
    const focusBeamMaterial = new THREE.MeshBasicMaterial({
      color: GREEN,
      transparent: true,
      opacity: 0.25,
      blending: THREE.AdditiveBlending
    })
    const focusBeam = new THREE.Mesh(beamGeometry, focusBeamMaterial)
    focusBeam.visible = false
    focusBeam.position.y = 30
    cityGroup.add(focusBeam)

    const hoverBeamMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.2,
      blending: THREE.AdditiveBlending
    })
    const hoverBeam = new THREE.Mesh(beamGeometry, hoverBeamMaterial)
    hoverBeam.visible = false
    hoverBeam.position.y = 26
    cityGroup.add(hoverBeam)

    focusHandlerRef.current = (id: string) => {
      const pos = housePositionsRef.current.get(id)
      if (!pos || !controlsRef.current || !cameraRef.current) return
      focusTargetRef.current = pos.clone()
      focusOffsetRef.current = cameraRef.current.position.clone().sub(controlsRef.current.target)
      focusRing.visible = true
      focusRing.position.set(pos.x, 0.6, pos.z)
      focusBeam.visible = true
      focusBeam.position.set(pos.x, 30, pos.z)
    }

    focusHandlerRef.current(currentUserId)

    const connectionGroup = new THREE.Group()
    cityGroup.add(connectionGroup)
    const pulseSpheres: Array<{
      mesh: any
      start: any
      end: any
      t: number
      speed: number
    }> = []

    const currentUser = users.find((user) => user.id === currentUserId)
    if (currentSlot && currentUser) {
      currentUser.followingIds.forEach((id, idx) => {
        const targetSlot = userSlots.find((slot) => slot.user.id === id)
        if (!targetSlot) return
        const points = [currentSlot.position, targetSlot.position]
        const geometry = new THREE.BufferGeometry().setFromPoints(points)
        const line = new THREE.Line(
          geometry,
          new THREE.LineBasicMaterial({ color: GREEN, transparent: true, opacity: 0.35 })
        )
        connectionGroup.add(line)

        const sphere = new THREE.Mesh(
          new THREE.SphereGeometry(2.2, 16, 16),
          new THREE.MeshBasicMaterial({ color: GREEN })
        )
        connectionGroup.add(sphere)
        pulseSpheres.push({
          mesh: sphere,
          start: currentSlot.position.clone(),
          end: targetSlot.position.clone(),
          t: idx * 0.2,
          speed: 0.003 + Math.random() * 0.003
        })
      })
    }

    const particleCount = 160
    const particleGeometry = new THREE.BufferGeometry()
    const particlePositions = new Float32Array(particleCount * 3)
    const particleBaseY = new Float32Array(particleCount)
    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 360
      particlePositions[i * 3 + 1] = 20 + Math.random() * 120
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 360
      particleBaseY[i] = particlePositions[i * 3 + 1]
    }
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.6,
      opacity: 0.5,
      transparent: true
    })
    const particles = new THREE.Points(particleGeometry, particleMaterial)
    scene.add(particles)

    const scanPlaneGeometry = new THREE.PlaneGeometry(420, 40)
    const scanPlaneMaterial = new THREE.MeshBasicMaterial({
      color: GREEN,
      opacity: 0.08,
      transparent: true,
      blending: THREE.AdditiveBlending
    })
    const scanPlane = new THREE.Mesh(
      scanPlaneGeometry,
      scanPlaneMaterial
    )
    scanPlane.rotation.x = -Math.PI / 2
    scanPlane.position.y = 1.5
    cityGroup.add(scanPlane)

    const raycaster = new THREE.Raycaster()
    const pointer = new THREE.Vector2()

    const handlePointerMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    }

    const handleClick = () => {
      if (!hoveredRef.current) return
      onSelectUser(hoveredRef.current.id)
    }

    renderer.domElement.addEventListener('mousemove', handlePointerMove)
    renderer.domElement.addEventListener('click', handleClick)

    let frameId = 0
    const clock = new THREE.Clock()

    const animate = () => {
      frameId = requestAnimationFrame(animate)
      controls.update()

      const elapsed = clock.getElapsedTime()
      pulseRing.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.12)
      ringMaterial.opacity = 0.5 + Math.sin(elapsed * 2.4) * 0.2

      scanPlane.position.z = -200 + ((elapsed * 40) % 400)

      pulseSpheres.forEach((pulse) => {
        pulse.t += pulse.speed
        if (pulse.t > 1) pulse.t = 0
        pulse.mesh.position.lerpVectors(pulse.start, pulse.end, pulse.t)
      })

      if (focusTargetRef.current && focusOffsetRef.current) {
        controls.target.lerp(focusTargetRef.current, 0.08)
        const desired = focusTargetRef.current.clone().add(focusOffsetRef.current)
        camera.position.lerp(desired, 0.08)
        if (controls.target.distanceTo(focusTargetRef.current) < 0.4) {
          focusTargetRef.current = null
        }
      }

      const positions = particleGeometry.attributes.position as any
      for (let i = 0; i < particleCount; i += 1) {
        positions.setY(i, particleBaseY[i] + Math.sin(elapsed * 0.6 + i) * 0.8)
      }
      positions.needsUpdate = true

      raycaster.setFromCamera(pointer, camera)
      const intersects = raycaster.intersectObjects(houseGroup.children, true)
      if (intersects.length > 0) {
        const hit = intersects[0].object
        const house = houseMeshes.find((entry) => entry.mesh === hit.parent || entry.mesh === hit)
        if (house) {
          const user = users.find((u) => u.id === house.userId) ?? null
          if (hoveredRef.current?.id !== user?.id) {
            hoveredRef.current = user
            setHovered(user)
          }
          renderer.domElement.style.cursor = 'pointer'
        }
      } else if (hoveredRef.current) {
        hoveredRef.current = null
        setHovered(null)
        renderer.domElement.style.cursor = 'grab'
      } else {
        renderer.domElement.style.cursor = 'grab'
      }

      const focusId = focusUserIdRef.current
      const focusPos = housePositionsRef.current.get(focusId)
      if (focusPos) {
        focusRing.visible = true
        focusRing.position.set(focusPos.x, 0.6, focusPos.z)
        focusBeam.visible = true
        focusBeam.position.set(focusPos.x, 30, focusPos.z)
        focusBeamMaterial.opacity = 0.18 + Math.sin(elapsed * 2.2) * 0.08
      }

      if (hoveredRef.current) {
        const hoverPos = housePositionsRef.current.get(hoveredRef.current.id)
        if (hoverPos) {
          hoverBeam.visible = true
          hoverBeam.position.set(hoverPos.x, 26, hoverPos.z)
          hoverBeamMaterial.opacity = 0.12 + Math.sin(elapsed * 3) * 0.06
        }
      } else {
        hoverBeam.visible = false
      }

      labelRef.current.forEach((sprite, id) => {
        sprite.visible =
          id === currentUserId ||
          id === focusUserIdRef.current ||
          id === hoveredRef.current?.id
      })

      renderer.render(scene, camera)
    }

    const resizeObserver = new ResizeObserver(() => {
      const { clientWidth, clientHeight } = mount
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(clientWidth, clientHeight)
    })
    resizeObserver.observe(mount)

    animate()

    return () => {
      resizeObserver.disconnect()
      renderer.domElement.removeEventListener('mousemove', handlePointerMove)
      renderer.domElement.removeEventListener('click', handleClick)
      cancelAnimationFrame(frameId)
      controls.dispose()
      blockGeometry.dispose()
      blockMaterial.dispose()
      parkMaterial.dispose()
      houseBaseGeo.dispose()
      houseRoofGeo.dispose()
      houseMaterial.dispose()
      currentMaterial.dispose()
      ringGeometry.dispose()
      focusRingGeometry.dispose()
      ringMaterial.dispose()
      focusRingMaterial.dispose()
      focusBeamMaterial.dispose()
      hoverBeamMaterial.dispose()
      beamGeometry.dispose()
      particleGeometry.dispose()
      particleMaterial.dispose()
      riverGeometry.dispose()
      riverMaterial.dispose()
      riverLine.geometry.dispose()
      ;(riverLine.material as any).dispose()
      scanPlaneGeometry.dispose()
      scanPlaneMaterial.dispose()
      if (grid.geometry) grid.geometry.dispose()
      if (Array.isArray(grid.material)) {
        grid.material.forEach((material: any) => material.dispose())
      } else {
        grid.material.dispose()
      }
      labelTextures.forEach((texture) => texture.dispose())
      labelMaterials.forEach((material) => material.dispose())
      ground.geometry.dispose()
      ;(ground.material as any).dispose()
      renderer.dispose()
      mount.removeChild(renderer.domElement)
    }
  }, [users, currentUserId, onSelectUser])

  return (
    <div className="glass-panel p-5 panel-sheen">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3 text-white">
          <span className="uppercase tracking-[0.35em]">// City Map 3D</span>
          <span className="text-white/50">Orbit · Pan · Zoom</span>
        </div>
        <span className="text-white/60">
          {hovered ? `${hovered.handle} · ${hovered.username}` : 'Hover a house to reveal profile'}
        </span>
      </div>
      <div ref={mountRef} className="h-[480px] w-full border border-white/15 bg-black" />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-neon-green" /> Current user
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 border border-white/50 bg-black" /> Houses
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 bg-white/10" /> Blocks
          </span>
        </div>
        <div className="text-white/50">Click a house to open profile</div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-white/60">
        <div className="flex flex-wrap items-center gap-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleFocus(user.id)}
              className={[
                'border border-white/20 px-2 py-1 uppercase tracking-[0.2em]',
                focusUserId === user.id ? 'text-neon-green border-neon-green/60' : 'text-white/70 hover:text-white'
              ].join(' ')}
            >
              {user.handle}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <CyberButton size="sm" variant="ghost" onClick={() => handleFocus(currentUserId)}>
            My Residence
          </CyberButton>
          <CyberButton size="sm" variant="ghost" onClick={handleResetView}>
            Reset View
          </CyberButton>
        </div>
      </div>
    </div>
  )
}
