import DefaultTheme from 'vitepress/theme'
import type { Theme } from 'vitepress'
import './style.css'

let zoomPromise: Promise<any> | null = null
let zoomInstance: any = null

async function initMediumZoom() {
  if (typeof window === 'undefined') {
    return
  }

  const images = Array.from(
    document.querySelectorAll<HTMLImageElement>('.VPContent img:not(.no-zoom)')
  ).filter(img => !img.closest('a')) // 避免与外部链接冲突

  if (images.length === 0) {
    return
  }

  if (!zoomPromise) {
    zoomPromise = import('medium-zoom').then(module => module.default)
  }

  const mediumZoom = await zoomPromise

  if (zoomInstance) {
    zoomInstance.detach()
  }

  zoomInstance = mediumZoom(images, {
    background: 'rgba(0, 0, 0, 0.8)',
    margin: 12
  })
}

const theme: Theme = {
  ...DefaultTheme,
  enhanceApp(ctx) {
    DefaultTheme.enhanceApp?.(ctx)

    ctx.router.onAfterRouteChange = () => {
      initMediumZoom()
    }

    if (typeof window !== 'undefined') {
      initMediumZoom()
    }
  }
}

export default theme

