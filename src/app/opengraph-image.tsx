import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }

export default async function Image() {
  return new ImageResponse(
    (<div style={{ fontSize: 64, background: '#1e40af', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      [Nama Kamu] - Web Developer
    </div>),
    { ...size }
  )
}
