<template>
  <div class="scene-container">
    <canvas ref="canvasRef"></canvas>
    <div class="controls">
      <div class="control-group">
        <label>旋转速度</label>
        <input 
          type="range" 
          v-model="rotationSpeed" 
          min="0" 
          max="0.05" 
          step="0.001"
        >
      </div>
      <div class="control-group">
        <label>颜色</label>
        <input 
          type="color" 
          v-model="boxColor"
        >
      </div>
      <div class="control-group">
        <label>大小</label>
        <input 
          type="range" 
          v-model="boxSize" 
          min="1" 
          max="5" 
          step="0.1"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as BABYLON from '@babylonjs/core'

const canvasRef = ref(null)
const rotationSpeed = ref(0.01)
const boxColor = ref('#6666cc')
const boxSize = ref(2)

let engine = null
let scene = null
let box = null
let boxMaterial = null

const createScene = async (canvas) => {
  // 创建引擎和场景
  engine = new BABYLON.Engine(canvas, true)
  scene = new BABYLON.Scene(engine)

  // 创建相机
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    0,
    Math.PI / 3,
    10,
    BABYLON.Vector3.Zero(),
    scene
  )
  camera.attachControl(canvas, true)

  // 创建光源
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  )

  // 创建立方体
  box = BABYLON.MeshBuilder.CreateBox('box', { 
    size: boxSize.value 
  }, scene)
  
  // 创建材质
  boxMaterial = new BABYLON.StandardMaterial('boxMaterial', scene)
  boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(boxColor.value)
  box.material = boxMaterial

  // 添加动画
  scene.registerBeforeRender(() => {
    box.rotation.y += rotationSpeed.value
    box.rotation.x += rotationSpeed.value / 2
  })

  // 开始渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 处理窗口大小调整
  window.addEventListener('resize', () => {
    engine.resize()
  })
}

// 监听控制值的变化
watch(boxColor, (newColor) => {
  if (boxMaterial) {
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(newColor)
  }
})

watch(boxSize, (newSize) => {
  if (box) {
    box.scaling = new BABYLON.Vector3(newSize/2, newSize/2, newSize/2)
  }
})

// 组件挂载时创建场景
onMounted(async () => {
  if (canvasRef.value) {
    await createScene(canvasRef.value)
  }
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (engine) {
    engine.dispose()
  }
  window.removeEventListener('resize', () => {
    engine.resize()
  })
})
</script>

<style scoped>
.scene-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-group {
  margin-bottom: 15px;
}

.control-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input[type="range"] {
  width: 100%;
  margin: 5px 0;
}

input[type="color"] {
  width: 100%;
  height: 30px;
}
</style><template>
  <div class="scene-container">
    <canvas ref="canvasRef"></canvas>
    <div class="controls">
      <div class="control-group">
        <label>旋转速度</label>
        <input 
          type="range" 
          v-model="rotationSpeed" 
          min="0" 
          max="0.05" 
          step="0.001"
        >
      </div>
      <div class="control-group">
        <label>颜色</label>
        <input 
          type="color" 
          v-model="boxColor"
        >
      </div>
      <div class="control-group">
        <label>大小</label>
        <input 
          type="range" 
          v-model="boxSize" 
          min="1" 
          max="5" 
          step="0.1"
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import * as BABYLON from '@babylonjs/core'

const canvasRef = ref(null)
const rotationSpeed = ref(0.01)
const boxColor = ref('#6666cc')
const boxSize = ref(2)

let engine = null
let scene = null
let box = null
let boxMaterial = null

const createScene = async (canvas) => {
  // 创建引擎和场景
  engine = new BABYLON.Engine(canvas, true)
  scene = new BABYLON.Scene(engine)

  // 创建相机
  const camera = new BABYLON.ArcRotateCamera(
    'camera',
    0,
    Math.PI / 3,
    10,
    BABYLON.Vector3.Zero(),
    scene
  )
  camera.attachControl(canvas, true)

  // 创建光源
  const light = new BABYLON.HemisphericLight(
    'light',
    new BABYLON.Vector3(0, 1, 0),
    scene
  )

  // 创建立方体
  box = BABYLON.MeshBuilder.CreateBox('box', { 
    size: boxSize.value 
  }, scene)
  
  // 创建材质
  boxMaterial = new BABYLON.StandardMaterial('boxMaterial', scene)
  boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(boxColor.value)
  box.material = boxMaterial

  // 添加动画
  scene.registerBeforeRender(() => {
    box.rotation.y += rotationSpeed.value
    box.rotation.x += rotationSpeed.value / 2
  })

  // 开始渲染循环
  engine.runRenderLoop(() => {
    scene.render()
  })

  // 处理窗口大小调整
  window.addEventListener('resize', () => {
    engine.resize()
  })
}

// 监听控制值的变化
watch(boxColor, (newColor) => {
  if (boxMaterial) {
    boxMaterial.diffuseColor = BABYLON.Color3.FromHexString(newColor)
  }
})

watch(boxSize, (newSize) => {
  if (box) {
    box.scaling = new BABYLON.Vector3(newSize/2, newSize/2, newSize/2)
  }
})

// 组件挂载时创建场景
onMounted(async () => {
  if (canvasRef.value) {
    await createScene(canvasRef.value)
  }
})

// 组件卸载时清理资源
onBeforeUnmount(() => {
  if (engine) {
    engine.dispose()
  }
  window.removeEventListener('resize', () => {
    engine.resize()
  })
})
</script>

<style scoped>
.scene-container {
  position: relative;
  width: 100vw;
  height: 100vh;
}

canvas {
  width: 100%;
  height: 100%;
  touch-action: none;
}

.controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.8);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.control-group {
  margin-bottom: 15px;
}

.control-group:last-child {
  margin-bottom: 0;
}

label {
  display: block;
  margin-bottom: 5px;
  font-size: 14px;
  color: #333;
}

input[type="range"] {
  width: 100%;
  margin: 5px 0;
}

input[type="color"] {
  width: 100%;
  height: 30px;
}
</style>