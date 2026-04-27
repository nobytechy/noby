import { Link } from 'react-router-dom'
import SEO from '@/components/SEO'
import { Button } from '@/components/ui/Button'

export default function NotFound() {
  return (
    <>
      <SEO title="404" path="/404" />
      <section className="container-x py-32 text-center">
        <div className="text-7xl font-bold gradient-text">404</div>
        <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you're looking for doesn't exist.</p>
        <Button asChild className="mt-6"><Link to="/">Back home</Link></Button>
      </section>
    </>
  )
}
