import type { Metadata } from 'next'
import Image from '@/components/ui/Image'
import Link from '@/components/ui/Link'
import { LogoMark } from '@/components/brand/Logo'
import ReviewForm from '@/components/reviews/ReviewForm'
import { designNameOf, isMissingReviewTable, reviewForToken } from '@/lib/reviews'
import { templateImage } from '@/lib/templateMedia'
import { supportWhatsAppUrl } from '@/lib/support'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'How did your invitation go?',
  robots: { index: false, follow: false },
}

/**
 * A host's review of their invitation, from the private link in the email sent
 * the morning after their celebration (lib/reviews.ts), or sent on WhatsApp.
 * No sign-in: the link itself is the proof, and it reaches the host alone.
 */
export default async function ReviewPage({ params, searchParams }: { params: { token: string }; searchParams: { rating?: string } }) {
  let review: Awaited<ReturnType<typeof reviewForToken>> = null
  try {
    review = await reviewForToken(params.token)
  } catch (err) {
    if (!isMissingReviewTable(err)) console.error('[review page]', err instanceof Error ? err.message : err)
  }

  if (!review) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-champagne px-5 py-16 text-charcoal">
        <div className="w-full max-w-md text-center">
          <LogoMark className="mx-auto h-14 w-14" />
          <h1 className="t-h2 mt-6">This review link isn&apos;t working</h1>
          <p className="mt-4 text-[0.98rem] leading-7 text-charcoal/70">
            It may have been copied only in part. Open it again from the email, or message us and we&apos;ll send a fresh one.
          </p>
          <a href={supportWhatsAppUrl('Hi, my review link is not working.')} target="_blank" rel="noopener noreferrer" className="btn-primary mt-7 inline-flex rounded-full px-7 py-3 text-[0.9rem] font-semibold">
            Message us on WhatsApp
          </a>
        </div>
      </main>
    )
  }

  const design = designNameOf(review.templateId)
  const preset = Number(searchParams.rating)
  const rating = review.rating ?? (Number.isInteger(preset) && preset >= 1 && preset <= 5 ? preset : 0)

  return (
    <main className="min-h-screen bg-champagne px-5 py-12 text-charcoal sm:py-16">
      <div className="mx-auto w-full max-w-xl">
        <Link href="/" className="inline-flex items-center gap-2" aria-label="ShareInvite home">
          <LogoMark className="h-9 w-9" />
        </Link>
        <div className="mt-8 flex items-center gap-4">
          <Image src={templateImage(review.templateId)} alt="" width={96} height={120} sizes="56px" className="h-[70px] w-14 shrink-0 rounded-md object-cover object-top shadow-sm" />
          <div className="min-w-0">
            <p className="eyebrow">Your invitation · {design}</p>
            <h1 className="t-h2 mt-1">How did it go?</h1>
          </div>
        </div>
        <p className="mt-4 text-[0.98rem] leading-7 text-charcoal/75">
          Tell us how you and your guests found it, good or bad. We read every review, and a few honest words help other families choose.
        </p>
        <ReviewForm
          token={params.token}
          initial={{ rating, name: review.name, city: review.city ?? '', text: review.text ?? '', publish: review.publish }}
          alreadySent={review.status !== 'asked'}
          googleReviewUrl={process.env.GOOGLE_REVIEW_URL?.trim() || null}
          supportUrl={supportWhatsAppUrl(`Hi, about my ${design} invitation:`)}
        />
      </div>
    </main>
  )
}
