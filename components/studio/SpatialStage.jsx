'use client';

import { Component, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import MonolithScene from './MonolithScene';
import DistrictScene from './DistrictScene';
import StudioFallback from './StudioFallback';
import { detectWebGL } from './gl';
import GlBridge from './GlBridge';

class StageBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFail?.();
  }

  render() {
    if (this.state.failed) return this.props.fallback;
    return this.props.children;
  }
}

export default function SpatialStage({
  mode = 'monolith',
  explode = false,
  light = 'noon',
  palette,
  hotspot,
  onHotspot,
  properties = [],
  activeId,
  onSelect,
  compact = false,
}) {
  const [webgl, setWebgl] = useState('pending');

  useEffect(() => {
    setWebgl(detectWebGL() ? 'ready' : 'fail');
  }, []);

  const fallback = (
    <StudioFallback
      mode={mode}
      explode={explode}
      light={light}
      hotspot={hotspot}
      onHotspot={onHotspot}
      properties={properties}
      activeId={activeId}
      onSelect={onSelect}
    />
  );

  if (webgl !== 'ready') {
    return <div className="h-full w-full">{webgl === 'fail' ? fallback : null}</div>;
  }

  const camera =
    mode === 'district'
      ? { position: [12, 9, 14], fov: 40 }
      : { position: compact ? [6.2, 3.2, 6.4] : [7.2, 3.8, 7.4], fov: 38 };

  return (
    <StageBoundary onFail={() => setWebgl('fail')} fallback={<div className="h-full w-full">{fallback}</div>}>
      <Canvas
        camera={camera}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        className="h-full w-full"
      >
        <GlBridge onLost={() => setWebgl('fail')} />
        {mode === 'district' ? (
          <DistrictScene
            properties={properties}
            palette={palette}
            light={light}
            activeId={activeId}
            onSelect={onSelect}
          />
        ) : (
          <MonolithScene
            explode={explode}
            palette={palette}
            light={light}
            hotspot={hotspot}
            onHotspot={onHotspot}
          />
        )}
      </Canvas>
    </StageBoundary>
  );
}
