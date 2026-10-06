import { faqs } from '../data/data'
import { PageHead } from '../components/ui'

export default function Faq() {
  return (
    <>
      <PageHead
        title="Pertanyaan umum"
        desc="Tidak menemukan jawabannya? Tulis lewat halaman Kontak."
      />

      <div className="card max-w-2xl divide-y divide-line">
        {faqs.map(([question, answer]) => (
          <details
            key={question}
            className="group p-4"
          >
            <summary className="flex cursor-pointer list-none justify-between font-semibold">
              <span>{question}</span>

              <i
                className="fa-solid fa-chevron-down text-mute transition-transform duration-200 group-open:rotate-180"
                aria-hidden="true"
              />
            </summary>

            <p className="mt-2 text-mute">
              {answer}
            </p>
          </details>
        ))}
      </div>
    </>
  )
}