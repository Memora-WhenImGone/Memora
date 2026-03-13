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
    question: "What is Memora?",
    answer:
      "Memora is a secure digital vault for your most important documents, credentials, and notes. You can assign Trusted Contacts and configure Triggers so the right information is shared only when it is truly needed."
  },
  {
    question: "How does Memora keep my data safe?",
    answer:
      "Your items are encrypted and stored securely. Access is tied to your account, and releases to Trusted Contacts are governed by your configured Triggers. Only the people you authorize can access specific items you select."
  },
  {
    question: "Who are Trusted Contacts?",
    answer:
      "Trusted Contacts are people you choose to receive access to certain items from your vault. You control exactly which items each contact can see and under what conditions (via Triggers)."
  },
  {
    question: "What are Triggers and when do they fire?",
    answer:
      "Triggers are rules such as inactivity checks. If a Trigger condition is met (for example, no login for a defined period), Memora can notify your Trusted Contacts or release only the items you selected for them."
  },
  {
    question: "What can I store in the vault?",
    answer:
      "You can store documents, credentials, and notes. Many common file types are supported. Organize items however you like and assign them to specific Trusted Contacts as needed."
  },
  {
    question: "Can I change who gets access later?",
    answer:
      "Yes. You can add or remove Trusted Contacts at any time, and you can update which items each contact can access without affecting your other vault content."
  },
  {
    question: "What happens after I sign in?",
    answer:
      "If your vault is active, you will land on the Dashboard to manage items, contacts, and triggers. New users are guided through Onboarding to set up the vault, add contacts, and configure Triggers."
  },
  {
    question: "Can Memora staff see my data?",
    answer:
      "No. Your encrypted data and access rules are yours. Only you and the Trusted Contacts you authorize (under the conditions you set) can access selected items."
  },
  {
    question: "What if I get locked out?",
    answer:
      "Use your account recovery options to regain access. We recommend keeping your sign-in credentials safe and ensuring Trusted Contacts are up to date in case a Trigger must be used."
  },
  {
    question: "How do I delete my data?",
    answer:
      "You can remove individual items or delete your vault from the Dashboard. Deleting is permanent and revokes access for all Trusted Contacts to the deleted items."
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
            <AccordionItem key={index} value={`item-${index + 1}`} className='group rounded-xl border border-gray-200 bg-white shadow-sm mb-2 px-3 py-2 open:shadow'>
              <AccordionTrigger className='text-lg px-2 py-2'>
                {item.question}
              </AccordionTrigger>
              <AccordionContent className='text-gray-600 px-2 pb-3'>
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className='mt-6 text-center'>
          <span className='inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs text-gray-600'>
            <span>Component inspired by</span>
            <a href='https://ui.shadcn.com' target='_blank' className='underline hover:text-gray-900' rel='noreferrer'>
              shadcn/ui
            </a>
          </span>
        </div>
      </div>
    </section>
  )
}
