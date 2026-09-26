'use client';

import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { disposeScene } from './gl';

export default function GlBridge({ onLost }) {
  const { gl, scene } = useThree();
  const onLostRef = useRef(onLost);
  onLostRef.current = onLost;

  useEffect(() => {
    const canvas = gl.domElement;
    let lostTimer = 0;
    const handleLost = (event) => {
      event.preventDefault();
      window.clearTimeout(lostTimer);
      lostTimer = window.setTimeout(() => onLostRef.current?.(), 0);
    };
    canvas.addEventListener('webglcontextlost', handleLost);
    return () => {
      window.clearTimeout(lostTimer);
      canvas.removeEventListener('webglcontextlost', handleLost);
      disposeScene(scene);
      window.setTimeout(() => {
        gl.dispose();
        gl.forceContextLoss();
      }, 0);
    };
  }, [gl, scene]);

  return null;
}
