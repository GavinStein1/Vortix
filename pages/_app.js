import '@/styles/globals.css'
import { MyProvider } from '@/components/AuthProvider'

export default function App({ Component, pageProps }) {
  return (
    <MyProvider>
      <Component {...pageProps} />
    </MyProvider>
  )
}
