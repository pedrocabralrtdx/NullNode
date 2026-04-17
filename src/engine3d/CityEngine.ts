// @ts-nocheck
import * as THREE from 'three'
import type { User } from '../types'

type ThemeMode = 'dark' | 'light'

interface CityEngineOptions {
  container: HTMLDivElement
  users: User[]
  currentUserId: string
  onUserHover: (user: User | null) => void
  onUserSelect: (userId: string) => void
  theme: ThemeMode
}

// ─── CONSTANTS ───────────────────────────────────────────────
const PLAYER_HEIGHT = 6
const PLAYER_SPEED = 60
const MOUSE_SENSITIVITY = 0.002
const CITY_BLOCK_SIZE = 60
const ROAD_WIDTH = 14
const CELL_SIZE = CITY_BLOCK_SIZE + ROAD_WIDTH
const GRID_COLS = 6
const GRID_ROWS = 6
const FOG_NEAR = 80
const FOG_FAR = 500

// ─── CITY ENGINE ─────────────────────────────────────────────
export class CityEngine {
  private container: HTMLDivElement
  private users: User[]
  private currentUserId: string
  private onUserHover: (user: User | null) => void
  private onUserSelect: (userId: string) => void

  private scene!: THREE.Scene
  private camera!: THREE.PerspectiveCamera
  private renderer!: THREE.WebGLRenderer
  private clock!: THREE.Clock
  private frameId = 0

  // First-person movement
  private yaw = 0
  private pitch = 0
  private moveForward = false
  private moveBackward = false
  private moveLeft = false
  private moveRight = false
  private isLocked = false

  // City objects
  private cityGroup!: THREE.Group
  private houseGroup!: THREE.Group

  // User data
  private housePositions = new Map<string, THREE.Vector3>()
  private houseMeshes: Array<{ userId: string; mesh: THREE.Object3D }> = []
  private hoveredUser: User | null = null

  // Raycasting
  private raycaster!: THREE.Raycaster
  private raycasterDirection = new THREE.Vector3()

  // Lights
  private ambientLight!: THREE.AmbientLight
  private dirLight!: THREE.DirectionalLight
  private streetLights: THREE.PointLight[] = []

  // Cached for disposal
  private materialsCache: THREE.Material[] = []
  private geometriesCache: THREE.BufferGeometry[] = []

  private themeMode: ThemeMode = 'dark'

  // ─── CONSTRUCTOR ──────────────────────────────────────────
  constructor(options: CityEngineOptions) {
    this.container = options.container
    this.users = options.users
    this.currentUserId = options.currentUserId
    this.onUserHover = options.onUserHover
    this.onUserSelect = options.onUserSelect
    this.themeMode = options.theme

    this.init()
    this.buildGround()
    this.buildRoads()
    this.buildSkylineTowers()
    this.buildStreetLights()
    this.buildUserHouses()
    this.applyTheme(this.themeMode)

    // Start near current user's house
    const startPos = this.housePositions.get(this.currentUserId)
    if (startPos) {
      this.camera.position.set(startPos.x, PLAYER_HEIGHT, startPos.z + 30)
      this.yaw = 0
      this.pitch = 0
    }

    this.animate()
  }

  // ─── TRACK DISPOSABLES ────────────────────────────────────
  private track<T extends { dispose: () => void }>(obj: T): T {
    if ((obj as any).isMaterial) this.materialsCache.push(obj as any)
    if ((obj as any).isBufferGeometry) this.geometriesCache.push(obj as any)
    return obj
  }

  // ─── INIT ─────────────────────────────────────────────────
  private init() {
    this.scene = new THREE.Scene()
    this.scene.background = new THREE.Color(0x020208)
    this.scene.fog = new THREE.Fog(0x020208, FOG_NEAR, FOG_FAR)

    this.camera = new THREE.PerspectiveCamera(
      70,
      this.container.clientWidth / this.container.clientHeight,
      0.5,
      1200
    )
    this.camera.position.set(0, PLAYER_HEIGHT, 40)

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 0.9
    this.container.appendChild(this.renderer.domElement)

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0x334466, 0.4)
    this.scene.add(this.ambientLight)

    this.dirLight = new THREE.DirectionalLight(0x6688bb, 0.3)
    this.dirLight.position.set(80, 200, 60)
    this.dirLight.castShadow = true
    this.dirLight.shadow.mapSize.set(1024, 1024)
    this.dirLight.shadow.camera.left = -200
    this.dirLight.shadow.camera.right = 200
    this.dirLight.shadow.camera.top = 200
    this.dirLight.shadow.camera.bottom = -200
    this.scene.add(this.dirLight)

    // Hemisphere light for subtle sky coloring
    const hemi = new THREE.HemisphereLight(0x112244, 0x050510, 0.3)
    this.scene.add(hemi)

    this.clock = new THREE.Clock()
    this.raycaster = new THREE.Raycaster()
    this.raycaster.far = 50

    this.cityGroup = new THREE.Group()
    this.scene.add(this.cityGroup)

    this.houseGroup = new THREE.Group()
    this.cityGroup.add(this.houseGroup)

    // Events
    this.container.addEventListener('click', this.handleClick)
    document.addEventListener('pointerlockchange', this.onPointerLockChange)
    document.addEventListener('keydown', this.onKeyDown)
    document.addEventListener('keyup', this.onKeyUp)
    document.addEventListener('mousemove', this.onMouseMove)
    window.addEventListener('resize', this.onResize)
  }

  // ─── GROUND ───────────────────────────────────────────────
  private buildGround() {
    const size = GRID_COLS * CELL_SIZE + 200
    const geo = this.track(new THREE.PlaneGeometry(size, size))
    const mat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x080810,
        roughness: 0.9,
        metalness: 0.1,
      })
    )
    const ground = new THREE.Mesh(geo, mat)
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.1
    ground.receiveShadow = true
    this.scene.add(ground)
  }

  // ─── ROADS ────────────────────────────────────────────────
  private buildRoads() {
    const roadMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x1a1a28,
        roughness: 0.7,
        metalness: 0.15,
      })
    )
    const laneMat = this.track(
      new THREE.MeshBasicMaterial({
        color: 0x7cff9b,
        transparent: true,
        opacity: 0.3,
      })
    )

    const totalSpan = GRID_COLS * CELL_SIZE
    const halfSpan = totalSpan / 2
    const roadLen = totalSpan + 80

    // Horizontal roads
    for (let row = 0; row <= GRID_ROWS; row++) {
      const z = row * CELL_SIZE - halfSpan
      const roadGeo = this.track(new THREE.PlaneGeometry(roadLen, ROAD_WIDTH))
      const road = new THREE.Mesh(roadGeo, roadMat)
      road.rotation.x = -Math.PI / 2
      road.position.set(0, 0.01, z)
      road.receiveShadow = true
      this.cityGroup.add(road)

      // Lane dashes
      const dashCount = Math.floor(roadLen / 8)
      for (let d = 0; d < dashCount; d++) {
        const dashGeo = this.track(new THREE.PlaneGeometry(3, 0.3))
        const dash = new THREE.Mesh(dashGeo, laneMat)
        dash.rotation.x = -Math.PI / 2
        dash.position.set(d * 8 - roadLen / 2, 0.05, z)
        this.cityGroup.add(dash)
      }
    }

    // Vertical roads
    for (let col = 0; col <= GRID_COLS; col++) {
      const x = col * CELL_SIZE - halfSpan
      const roadGeo = this.track(new THREE.PlaneGeometry(ROAD_WIDTH, roadLen))
      const road = new THREE.Mesh(roadGeo, roadMat)
      road.rotation.x = -Math.PI / 2
      road.position.set(x, 0.02, 0)
      road.receiveShadow = true
      this.cityGroup.add(road)

      const dashCount = Math.floor(roadLen / 8)
      for (let d = 0; d < dashCount; d++) {
        const dashGeo = this.track(new THREE.PlaneGeometry(0.3, 3))
        const dash = new THREE.Mesh(dashGeo, laneMat)
        dash.rotation.x = -Math.PI / 2
        dash.position.set(x, 0.06, d * 8 - roadLen / 2)
        this.cityGroup.add(dash)
      }
    }
  }

  // ─── SKYLINE TOWERS (INSTANCED) ───────────────────────────
  private buildSkylineTowers() {
    const towerGeo = this.track(new THREE.BoxGeometry(1, 1, 1))
    const towerMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x0a0a18,
        roughness: 0.6,
        metalness: 0.35,
      })
    )

    const towerCount = GRID_COLS * GRID_ROWS * 3
    const instanced = new THREE.InstancedMesh(towerGeo, towerMat, towerCount)
    instanced.castShadow = true
    instanced.receiveShadow = true

    const dummy = new THREE.Object3D()
    const halfSpan = (GRID_COLS * CELL_SIZE) / 2
    let idx = 0

    for (let col = 0; col < GRID_COLS; col++) {
      for (let row = 0; row < GRID_ROWS; row++) {
        const blockCenterX = col * CELL_SIZE - halfSpan + CELL_SIZE / 2
        const blockCenterZ = row * CELL_SIZE - halfSpan + CELL_SIZE / 2

        // Place 3 towers per block, offset from center
        for (let t = 0; t < 3; t++) {
          if (idx >= towerCount) break
          const height = 20 + Math.random() * 100
          const width = 8 + Math.random() * 16
          const depth = 8 + Math.random() * 16

          const ox = (Math.random() - 0.5) * (CITY_BLOCK_SIZE - width - 4)
          const oz = (Math.random() - 0.5) * (CITY_BLOCK_SIZE - depth - 4)

          dummy.position.set(blockCenterX + ox, height / 2, blockCenterZ + oz)
          dummy.scale.set(width, height, depth)
          dummy.updateMatrix()
          instanced.setMatrixAt(idx, dummy.matrix)

          // Tint variation per instance
          const shade = 0.03 + Math.random() * 0.06
          instanced.setColorAt(idx, new THREE.Color(shade, shade, shade + 0.02))
          idx++
        }
      }
    }

    instanced.instanceMatrix.needsUpdate = true
    if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true
    this.cityGroup.add(instanced)

    // Neon window strips on some towers
    const windowMat = this.track(
      new THREE.MeshBasicMaterial({
        color: 0x7cff9b,
        transparent: true,
        opacity: 0.15,
        blending: THREE.AdditiveBlending,
      })
    )

    // Small window decorations (instanced strips)
    const windowGeo = this.track(new THREE.PlaneGeometry(0.8, 2))
    const windowCount = 120
    const windowMesh = new THREE.InstancedMesh(windowGeo, windowMat, windowCount)

    for (let i = 0; i < windowCount; i++) {
      const angle = Math.random() * Math.PI * 2
      const dist = 30 + Math.random() * 200
      const height = 8 + Math.random() * 60

      dummy.position.set(Math.cos(angle) * dist, height, Math.sin(angle) * dist)
      dummy.lookAt(dummy.position.x + Math.cos(angle), height, dummy.position.z + Math.sin(angle))
      dummy.scale.set(1 + Math.random() * 3, 1 + Math.random() * 2, 1)
      dummy.updateMatrix()
      windowMesh.setMatrixAt(i, dummy.matrix)

      // Randomize window color
      const colors = [0x7cff9b, 0x4488ff, 0xff4488, 0xffaa22]
      windowMesh.setColorAt(i, new THREE.Color(colors[Math.floor(Math.random() * colors.length)]))
    }

    windowMesh.instanceMatrix.needsUpdate = true
    if (windowMesh.instanceColor) windowMesh.instanceColor.needsUpdate = true
    this.cityGroup.add(windowMesh)
  }

  // ─── STREET LIGHTS ────────────────────────────────────────
  private buildStreetLights() {
    const poleMat = this.track(
      new THREE.MeshStandardMaterial({ color: 0x222233, roughness: 0.6 })
    )
    const poleGeo = this.track(new THREE.CylinderGeometry(0.15, 0.2, 10, 6))
    const bulbGeo = this.track(new THREE.SphereGeometry(0.5, 8, 8))
    const neonColors = [0x7cff9b, 0x4488ff, 0xff4488, 0xffcc22]

    const halfSpan = (GRID_COLS * CELL_SIZE) / 2

    // Place lights along road intersections
    for (let col = 0; col <= GRID_COLS; col += 2) {
      for (let row = 0; row <= GRID_ROWS; row += 2) {
        const x = col * CELL_SIZE - halfSpan
        const z = row * CELL_SIZE - halfSpan
        const neonColor = neonColors[(col + row) % neonColors.length]

        // Pole
        const pole = new THREE.Mesh(poleGeo, poleMat)
        pole.position.set(x + 5, 5, z + 5)
        pole.castShadow = true
        this.cityGroup.add(pole)

        // Bulb glow
        const bulbMat = this.track(
          new THREE.MeshBasicMaterial({
            color: neonColor,
            transparent: true,
            opacity: 0.9,
          })
        )
        const bulb = new THREE.Mesh(bulbGeo, bulbMat)
        bulb.position.set(x + 5, 10.5, z + 5)
        this.cityGroup.add(bulb)

        // Point light
        const light = new THREE.PointLight(neonColor, 0.6, 40, 2)
        light.position.set(x + 5, 10.5, z + 5)
        this.scene.add(light)
        this.streetLights.push(light)
      }
    }
  }

  // ─── USER HOUSES ──────────────────────────────────────────
  private buildUserHouses() {
    const halfSpan = (GRID_COLS * CELL_SIZE) / 2

    // Place user houses in specific blocks near the center
    const houseSlots = [
      { col: 2, row: 2, offX: 0, offZ: 0 },
      { col: 3, row: 2, offX: 0, offZ: 0 },
      { col: 2, row: 3, offX: 0, offZ: 0 },
      { col: 3, row: 3, offX: 0, offZ: 0 },
      { col: 1, row: 2, offX: 0, offZ: 0 },
      { col: 4, row: 2, offX: 0, offZ: 0 },
      { col: 2, row: 1, offX: 0, offZ: 0 },
      { col: 3, row: 4, offX: 0, offZ: 0 },
    ]

    const baseGeo = this.track(new THREE.BoxGeometry(14, 10, 14))
    const roofGeo = this.track(new THREE.ConeGeometry(11, 7, 4))
    const doorGeo = this.track(new THREE.BoxGeometry(3, 5, 0.3))

    const houseMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x1a1a2e,
        roughness: 0.5,
        metalness: 0.2,
      })
    )
    const houseRoofMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x111128,
        roughness: 0.4,
        metalness: 0.3,
      })
    )
    const currentHouseMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x0a1a0f,
        emissive: 0x7cff9b,
        emissiveIntensity: 0.25,
        roughness: 0.4,
        metalness: 0.25,
      })
    )
    const currentRoofMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x081510,
        emissive: 0x7cff9b,
        emissiveIntensity: 0.15,
        roughness: 0.35,
        metalness: 0.3,
      })
    )
    const doorMat = this.track(
      new THREE.MeshStandardMaterial({
        color: 0x7cff9b,
        emissive: 0x7cff9b,
        emissiveIntensity: 0.4,
        roughness: 0.3,
      })
    )

    // Pulse ring geometry for current user
    const pulseRingGeo = this.track(new THREE.RingGeometry(14, 16, 32))
    const pulseRingMat = this.track(
      new THREE.MeshBasicMaterial({
        color: 0x7cff9b,
        transparent: true,
        opacity: 0.5,
        side: THREE.DoubleSide,
      })
    )

    this.users.forEach((user, index) => {
      const slot = houseSlots[index % houseSlots.length]
      const blockCenterX = slot.col * CELL_SIZE - halfSpan + CELL_SIZE / 2
      const blockCenterZ = slot.row * CELL_SIZE - halfSpan + CELL_SIZE / 2
      const pos = new THREE.Vector3(blockCenterX, 5, blockCenterZ)

      this.housePositions.set(user.id, pos.clone())

      const isCurrent = user.id === this.currentUserId
      const group = new THREE.Group()

      // Base
      const base = new THREE.Mesh(baseGeo, isCurrent ? currentHouseMat : houseMat)
      base.position.copy(pos)
      base.castShadow = true
      base.receiveShadow = true
      group.add(base)

      // Roof
      const roof = new THREE.Mesh(roofGeo, isCurrent ? currentRoofMat : houseRoofMat)
      roof.position.set(pos.x, pos.y + 8.5, pos.z)
      roof.rotation.y = Math.PI / 4
      roof.castShadow = true
      group.add(roof)

      // Neon door
      const door = new THREE.Mesh(doorGeo, doorMat)
      door.position.set(pos.x, pos.y - 2.5, pos.z + 7.2)
      group.add(door)

      // Point light at house entrance
      const houseLight = new THREE.PointLight(
        isCurrent ? 0x7cff9b : 0x4466aa,
        0.5,
        25,
        2
      )
      houseLight.position.set(pos.x, pos.y + 2, pos.z + 8)
      group.add(houseLight)

      // Nameplate
      const nameCanvas = document.createElement('canvas')
      nameCanvas.width = 256
      nameCanvas.height = 64
      const ctx = nameCanvas.getContext('2d')!
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.fillRect(0, 0, 256, 64)
      ctx.strokeStyle = isCurrent ? '#7cff9b' : '#4466aa'
      ctx.lineWidth = 2
      ctx.strokeRect(1, 1, 254, 62)
      ctx.font = 'bold 18px monospace'
      ctx.fillStyle = isCurrent ? '#7cff9b' : '#aabbcc'
      ctx.textAlign = 'center'
      ctx.fillText(user.handle, 128, 26)
      ctx.font = '13px monospace'
      ctx.fillStyle = '#888899'
      ctx.fillText(user.username, 128, 48)

      const nameTexture = new THREE.CanvasTexture(nameCanvas)
      const nameMat = this.track(
        new THREE.MeshBasicMaterial({
          map: nameTexture,
          transparent: true,
          side: THREE.DoubleSide,
        })
      )
      const nameGeo = this.track(new THREE.PlaneGeometry(10, 2.5))
      const namePlate = new THREE.Mesh(nameGeo, nameMat)
      namePlate.position.set(pos.x, pos.y + 14, pos.z)
      group.add(namePlate)

      // Current user pulse ring
      if (isCurrent) {
        const ring = new THREE.Mesh(pulseRingGeo, pulseRingMat.clone())
        ring.rotation.x = -Math.PI / 2
        ring.position.set(pos.x, 0.2, pos.z)
        ring.userData.isPulseRing = true
        group.add(ring)
      }

      this.houseGroup.add(group)
      this.houseMeshes.push({ userId: user.id, mesh: group })
    })
  }

  // ─── POINTER LOCK ─────────────────────────────────────────
  public requestPointerLock() {
    this.renderer.domElement.requestPointerLock()
  }

  private onPointerLockChange = () => {
    this.isLocked = document.pointerLockElement === this.renderer.domElement
  }

  // ─── INPUT HANDLERS ───────────────────────────────────────
  private onKeyDown = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = true
        break
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = true
        break
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = true
        break
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = true
        break
      case 'Enter':
      case 'Space':
        if (this.hoveredUser) {
          this.onUserSelect(this.hoveredUser.id)
        }
        break
    }
  }

  private onKeyUp = (e: KeyboardEvent) => {
    switch (e.code) {
      case 'KeyW':
      case 'ArrowUp':
        this.moveForward = false
        break
      case 'KeyS':
      case 'ArrowDown':
        this.moveBackward = false
        break
      case 'KeyA':
      case 'ArrowLeft':
        this.moveLeft = false
        break
      case 'KeyD':
      case 'ArrowRight':
        this.moveRight = false
        break
    }
  }

  private onMouseMove = (e: MouseEvent) => {
    if (!this.isLocked) return
    this.yaw -= e.movementX * MOUSE_SENSITIVITY
    this.pitch -= e.movementY * MOUSE_SENSITIVITY
    this.pitch = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.pitch))
  }

  private handleClick = () => {
    if (!this.isLocked) {
      this.requestPointerLock()
    } else if (this.hoveredUser) {
      this.onUserSelect(this.hoveredUser.id)
    }
  }

  private onResize = () => {
    const w = this.container.clientWidth
    const h = this.container.clientHeight
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.renderer.setSize(w, h)
  }

  // ─── THEME ────────────────────────────────────────────────
  public applyTheme(theme: ThemeMode) {
    this.themeMode = theme
    const isLight = theme === 'light'

    const bgColor = isLight ? 0xe8ecf0 : 0x020208
    this.scene.background = new THREE.Color(bgColor)
    if (this.scene.fog) {
      ;(this.scene.fog as THREE.Fog).color.setHex(bgColor)
      ;(this.scene.fog as THREE.Fog).near = isLight ? 120 : FOG_NEAR
      ;(this.scene.fog as THREE.Fog).far = isLight ? 600 : FOG_FAR
    }

    this.ambientLight.intensity = isLight ? 0.8 : 0.4
    this.dirLight.intensity = isLight ? 0.7 : 0.3

    this.streetLights.forEach((l) => {
      l.intensity = isLight ? 0.25 : 0.6
    })
  }

  // ─── FOCUS / TELEPORT TO USER ─────────────────────────────
  public focusUser(userId: string) {
    const pos = this.housePositions.get(userId)
    if (!pos) return
    this.camera.position.set(pos.x, PLAYER_HEIGHT, pos.z + 28)
    this.yaw = 0
    this.pitch = 0
  }

  // ─── ANIMATE ──────────────────────────────────────────────
  private animate = () => {
    this.frameId = requestAnimationFrame(this.animate)
    const delta = this.clock.getDelta()
    const elapsed = this.clock.getElapsedTime()

    // ─ First-person movement ─
    if (this.isLocked) {
      const speed = PLAYER_SPEED * delta
      const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw))
      const strafe = new THREE.Vector3(-Math.sin(this.yaw + Math.PI / 2), 0, -Math.cos(this.yaw + Math.PI / 2))

      if (this.moveForward) this.camera.position.addScaledVector(forward, speed)
      if (this.moveBackward) this.camera.position.addScaledVector(forward, -speed)
      if (this.moveLeft) this.camera.position.addScaledVector(strafe, speed)
      if (this.moveRight) this.camera.position.addScaledVector(strafe, -speed)

      this.camera.position.y = PLAYER_HEIGHT // Lock to ground
    }

    // ─ Camera rotation ─
    const euler = new THREE.Euler(this.pitch, this.yaw, 0, 'YXZ')
    this.camera.quaternion.setFromEuler(euler)

    // ─ Raycast for house interaction ─
    this.camera.getWorldDirection(this.raycasterDirection)
    this.raycaster.set(this.camera.position, this.raycasterDirection)

    if (this.houseGroup.children.length > 0) {
      const intersects = this.raycaster.intersectObjects(
        this.houseGroup.children,
        true
      )
      if (intersects.length > 0) {
        let root = intersects[0].object
        while (root.parent && root.parent !== this.houseGroup) root = root.parent
        const entry = this.houseMeshes.find((h) => h.mesh === root)
        if (entry) {
          const user = this.users.find((u) => u.id === entry.userId) || null
          if (this.hoveredUser?.id !== user?.id) {
            this.hoveredUser = user
            this.onUserHover(user)
          }
        }
      } else {
        if (this.hoveredUser !== null) {
          this.hoveredUser = null
          this.onUserHover(null)
        }
      }
    }

    // ─ Animate pulse rings ─
    this.houseGroup.traverse((child) => {
      if (child.userData.isPulseRing) {
        child.scale.setScalar(1 + Math.sin(elapsed * 2) * 0.15)
        ;(child as any).material.opacity = 0.3 + Math.sin(elapsed * 2.4) * 0.2
      }
    })

    // ─ Animate nameplates to face camera ─
    this.houseGroup.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry?.type === 'PlaneGeometry') {
        const geo = child.geometry as THREE.PlaneGeometry
        if (geo.parameters.width === 10 && geo.parameters.height === 2.5) {
          child.lookAt(this.camera.position)
        }
      }
    })

    // ─ Flicker street lights slightly ─
    this.streetLights.forEach((light, i) => {
      light.intensity =
        (this.themeMode === 'light' ? 0.2 : 0.5) +
        Math.sin(elapsed * 3 + i * 1.5) * 0.15
    })

    this.renderer.render(this.scene, this.camera)
  }

  // ─── DISPOSE ──────────────────────────────────────────────
  public dispose() {
    cancelAnimationFrame(this.frameId)

    this.container.removeEventListener('click', this.handleClick)
    document.removeEventListener('pointerlockchange', this.onPointerLockChange)
    document.removeEventListener('keydown', this.onKeyDown)
    document.removeEventListener('keyup', this.onKeyUp)
    document.removeEventListener('mousemove', this.onMouseMove)
    window.removeEventListener('resize', this.onResize)

    // Exit pointer lock if active
    if (document.pointerLockElement === this.renderer.domElement) {
      document.exitPointerLock()
    }

    this.materialsCache.forEach((m) => m.dispose())
    this.geometriesCache.forEach((g) => g.dispose())
    this.renderer.dispose()

    if (this.container.contains(this.renderer.domElement)) {
      this.container.removeChild(this.renderer.domElement)
    }
  }
}
