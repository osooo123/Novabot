import dynamic from 'next/dynamic'

const NovaModa = dynamic(
  () => import('../components/novamoda-colombia'),
  { ssr: false }
)

export default function Home() {
  return <NovaModa />
}