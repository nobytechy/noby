import { useEffect, useState } from 'react'
import { Download, MapPin, Mail } from 'lucide-react'
import SEO from '@/components/SEO'
import PageHero from '@/components/PageHero'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getProfile, listSkills } from '@/lib/queries'

export default function About() {
  const [profile, setProfile] = useState(null)
  const [skills, setSkills] = useState([])

  useEffect(() => {
    Promise.all([
      getProfile().catch(() => null),
      listSkills().catch(() => []),
    ]).then(([p, s]) => { setProfile(p); setSkills(s) })
  }, [])

  const skillsByCategory = skills.reduce((acc, s) => {
    const k = s.category || 'Other'
    acc[k] = acc[k] || []
    acc[k].push(s)
    return acc
  }, {})

  return (
    <>
      <SEO title="About" path="/about" description={profile?.bio?.slice(0, 160)} />

      <PageHero
        eyebrow="About me"
        title={profile?.full_name || 'Noby'}
        subtitle={profile?.headline}
      />

      <section className="container-x py-16 md:py-24">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-1">
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
              {profile?.headshot_url ? (
                <img src={profile.headshot_url} alt={profile.full_name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  Upload headshot in admin
                </div>
              )}
            </div>
            <div className="mt-6 space-y-3 text-sm">
              {profile?.location && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin size={16} /> {profile.location}
                </div>
              )}
              {profile?.email && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail size={16} /> {profile.email}
                </div>
              )}
              {profile?.resume_url && (
                <Button asChild variant="outline" className="w-full mt-4">
                  <a href={profile.resume_url} target="_blank" rel="noreferrer">
                    <Download size={16} /> Download Resume
                  </a>
                </Button>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="prose prose-neutral dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed whitespace-pre-line">
                {profile?.bio || 'Bio coming soon. Edit this in the admin panel.'}
              </p>
            </div>

            {skills.length > 0 && (
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Skills & Tools</h2>
                <div className="space-y-6">
                  {Object.entries(skillsByCategory).map(([cat, items]) => (
                    <div key={cat}>
                      <div className="text-sm font-semibold text-muted-foreground mb-2">{cat}</div>
                      <div className="flex flex-wrap gap-2">
                        {items.map(s => (
                          <Badge key={s.id} variant="secondary">{s.name}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
