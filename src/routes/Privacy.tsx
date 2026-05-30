import { useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import { DEFAULT_LOCALE, isLocale } from '../i18n/locales'
import { ARTIST_NAME } from '../lib/seo'
import { LEGAL } from '../content/legal'

export default function Privacy() {
  const { lang } = useParams()
  const locale = isLocale(lang) ? lang : DEFAULT_LOCALE
  const doc = LEGAL[locale]

  return (
    <>
      <Seo title={`${doc.title} — ${ARTIST_NAME}`} description={doc.intro} />
      <main className="page legal">
        <h1>{doc.title}</h1>
        <p className="legal__updated">{doc.updated}</p>
        <p>{doc.intro}</p>

        {doc.sections.map((section) => (
          <section key={section.heading}>
            <h2>{section.heading}</h2>
            {section.body.map((block, i) =>
              typeof block === 'string' ? (
                <p key={i}>{block}</p>
              ) : (
                <ul key={i}>
                  {block.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ),
            )}
          </section>
        ))}

        {doc.note && <p className="legal__note">{doc.note}</p>}
      </main>
    </>
  )
}
