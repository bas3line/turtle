import { Plus } from 'lucide-react'
import { Band, Blue, SectionHead } from './shared'

const QA = [
  {
    q: 'Why does it take a few minutes?',
    a: 'Because it reads the files your change touches, and the ones that touch those, before it comments. Three minutes on a pull request is still faster than finding the bug in production on a Friday.',
  },
  {
    q: 'How many comments will it leave?',
    a: "About one a pull request, and none on most. It never comments on style, naming or formatting; your linter does that. If it isn't sure something is a bug, it stays quiet.",
  },
  {
    q: 'Does it train on my code?',
    a: "No. Your code is read to review the pull request and kept only as long as the review takes. Nothing is used to train a model, ours or anyone else's.",
  },
  {
    q: 'Which languages does it read?',
    a: 'TypeScript and JavaScript, Python, Go, Rust, Java, Kotlin, Ruby, PHP and C#. It follows imports within a language and across the usual boundaries, like an API route and the client that calls it.',
  },
  {
    q: 'Can it approve pull requests?',
    a: 'If you let it. With approve: true in .turtle.yml it stamps the pull requests it has nothing to say about, so a person only has to look at the interesting ones.',
  },
  {
    q: 'Can I run it on my own machines?',
    a: 'Yes. The self-hosted plan runs turtle inside your network against a model you choose, and nothing leaves it.',
  },
]

export function Faq() {
  return (
    <Band id="faq" tone="grey" className="grid gap-12 px-6 py-20 md:px-12 md:py-28 lg:grid-cols-[0.8fr_1.2fr]">
      <SectionHead
        label="faq"
        title={
          <>
            Questions, <Blue>answered slowly.</Blue>
          </>
        }
      >
        Something else? Ask in the community Slack, where a person answers.
      </SectionHead>
      <div className="flex flex-col gap-2">
        {QA.map((item, i) => (
          <details key={item.q} open={i === 0} className="group card">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] text-ink [&::-webkit-details-marker]:hidden">
              <span className="flex gap-4">
                <span className="w-6 pt-0.5 font-mono text-[12px] text-blue">{String(i + 1).padStart(2, '0')}</span>
                {item.q}
              </span>
              <span className="grid size-7 shrink-0 place-items-center rounded-full text-ink-3 transition-colors group-open:bg-blue group-open:text-white">
                <Plus className="size-3.5 transition-transform duration-300 group-open:rotate-45" />
              </span>
            </summary>
            <p className="max-w-[60ch] px-5 pb-5 pl-[60px] text-[15px] leading-relaxed text-ink-2">{item.a}</p>
          </details>
        ))}
      </div>
    </Band>
  )
}
