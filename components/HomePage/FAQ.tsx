import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

type FAQItem = {
  question: string
  answer: string
}

type Props = {
  faqItems?: FAQItem[]
}

const defaultFaqItems: FAQItem[] = [
  {
    question: "Is my vault really end-to-end encrypted?",
    answer:
      "Yes. Every file, note, and credential is encrypted locally in your browser before it reaches Memora. "
      + "We store only ciphertext plus the minimal metadata required to power triggers, so neither Memora staff nor infrastructure partners can read your content."
  },
  {
    question: "What happens when it's time to deliver my vault?",
    answer:
      "You define release triggers like inactivity timers, manual confirmations, or device pings. "
      + "Once the required signals land, Memora packages the items you selected, re-encrypts them per recipient, and delivers them through an authenticated portal with audit logging."
  },
  {
    question: "How do I add and manage Trusted Contacts?",
    answer:
      "From the dashboard you can invite trusted people via email, assign exactly which folders or single items they can view, and pair them with the triggers that should unlock access. " +
       "You can revoke, reassign, or add contacts at any time without touching the rest of your vault."
  },
  {
    question: "What does Memora have access to?",
    answer:
      "Only hashed account identifiers, billing status, and high-level audit telemetry (for example, when a trigger was armed or a delivery succeeded)." + 
      " Your vault contents and the secrets inside remain unreadable to us at all times."
  }
]

export default function FAQ({ faqItems = defaultFaqItems }: Props) {
  return (
    <section id='faq' className='py-16 sm:py-20 lg:py-24 bg-white border-t border-gray-200'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='mb-12 space-y-4 text-center sm:mb-16 lg:mb-24'>
          <h2 className='text-2xl font-semibold md:text-3xl lg:text-4xl'>Need Help? We&apos;ve Got Answers</h2>
          <p className='text-xl text-gray-600'>Explore our most commonly asked questions.</p>
        </div>

        <Accordion type='single' collapsible className='w-full' defaultValue='item-1'>
          {faqItems.map((item, index) => (
            <AccordionItem key={index} value={`item-${index + 1}`} className='group rounded-xl border 
            border-gray-200 bg-white shadow-sm mb-2 px-3 py-2 open:shadow'>
              <AccordionTrigger className='text-lg px-2 py-2'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-gray-600 px-2 pb-3'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
{/* 
        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-600'>
          
            <a href='https://ui.shadcn.com' target='_blank' className=' hover:text-gray-900' rel='noreferrer'>
              Powered By Shadcn Ui
            </a>
          </span>
        </div> */}
      </div>
    </section>
  )
}
