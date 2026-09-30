'use client'

import { Component, useEffect, useState, type ReactNode } from 'react'

/**
 * null until mounted, then whether this browser can create a WebGL context.
 * Some older phones, locked-down in-app browsers and power-saving modes can't;
 * without this check the 3D canvas throws and the whole invitation shows
 * Next's "Application error" instead of the greeting.
 */
export function useWebGL(): boolean | null {
  const [ok, setOk] = useState<boolean | null>(null)
  useEffect(() => {
    try {
      const c = document.createElement('canvas')
      const gl = c.getContext('webgl2') || c.getContext('webgl') || c.getContext('experimental-webgl')
      setOk(Boolean(gl))
    } catch {
      setOk(false)
    }
  }, [])
  return ok
}

/** Catches a failing 3D scene (context loss, driver bugs) and shows `fallback`. */
export class SceneBoundary extends Component<{ fallback: ReactNode; onError?: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch() {
    this.props.onError?.()
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
