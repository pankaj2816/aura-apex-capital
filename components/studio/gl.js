export function disposeMaterial(material) {
  if (!material) return;
  Object.keys(material).forEach((key) => {
    const value = material[key];
    if (value && value.isTexture) value.dispose();
  });
  material.dispose();
}

export function disposeScene(scene) {
  scene.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (Array.isArray(obj.material)) obj.material.forEach(disposeMaterial);
    else if (obj.material) disposeMaterial(obj.material);
  });
}

export function detectWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return false;
    const lose = gl.getExtension('WEBGL_lose_context');
    if (lose) lose.loseContext();
    return true;
  } catch (err) {
    return false;
  }
}

export const LIGHTS = {
  dawn: { color: '#ffb38a', intensity: 1.15, ambient: 0.38, position: [-8, 3.2, 5] },
  noon: { color: '#f5f7ff', intensity: 1.55, ambient: 0.72, position: [5, 12, 3] },
  golden: { color: '#ffc46b', intensity: 1.35, ambient: 0.42, position: [9, 2.8, 6] },
  midnight: { color: '#7aa2ff', intensity: 0.42, ambient: 0.14, position: [-3, 7, -5] },
};
