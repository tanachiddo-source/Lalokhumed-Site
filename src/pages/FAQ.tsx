import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Minus, 
  Search, 
  MessageSquare, 
  Stethoscope, 
  Droplets, 
  Hospital,
  Send,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { cn } from '../lib/utils';

interface FAQItem {
  question: string;
  answer: string;
  category: 'medical' | 'therapy' | 'practice';
}

const faqs: FAQItem[] = [
  // General Medical Questions
  {
    category: 'medical',
    question: "Do I need a prescription for IV therapy?",
    answer: "No, you do not need a prescription from your own doctor. Our medical team conducts a thorough consultation and assessment before any treatment is administered to ensure it is safe and appropriate for you."
  },
  {
    category: 'medical',
    question: "Are there any side effects?",
    answer: "Minor side effects like bruising at the injection site, a cool sensation in the arm, or a metallic taste in the mouth are normal. Serious side effects are rare, as our treatments are administered by licensed medical professionals."
  },
  {
    category: 'medical',
    question: "Who should not get IV therapy?",
    answer: "Individuals with certain conditions like heart failure, kidney disease, or severe hypertension may not be eligible. Our medical questionnaire helps us identify any contraindications during your assessment."
  },
  
  // IV Therapy Questions
  {
    category: 'therapy',
    question: "What is IV Nutrient Therapy?",
    answer: "IV Nutrient Therapy is a method of delivering high doses of vitamins, minerals, and antioxidants directly into the bloodstream, bypassing the digestive system for 100% absorption."
  },
  {
    category: 'therapy',
    question: "How long does a session take?",
    answer: "Most IV drips take between 30 to 60 minutes depending on the specific treatment. Booster shots (intramuscular) take less than 5 minutes."
  },
  {
    category: 'therapy',
    question: "How often should I get an IV drip?",
    answer: "This varies based on individual goals. For general wellness, once or twice a month is common. For specific recovery or acute symptoms, a more frequent protocol may be recommended by our specialists."
  },

  // Practice Specific Questions
  {
    category: 'practice',
    question: "Where is Lalokhumed located?",
    answer: "We are located at 273 Bryanston Drive, Bryanston, Sandton, Johannesburg. Our facility offers a private, clinical, yet relaxing environment for all treatments."
  },
  {
    category: 'practice',
    question: "Do you offer mobile services?",
    answer: "Currently, we focus on providing treatments at our Bryanston practice to ensure the highest standards of clinical safety and equipment availability. Mobile services may be considered for large corporate groups upon request."
  },
  {
    category: 'practice',
    question: "What are your operating hours?",
    answer: "We operate primarily by appointment to ensure dedicated time for each patient. Please check our booking calendar for available slots, which typically range from 8:00 AM to 5:00 PM on weekdays and select hours on weekends."
  }
];

const categories = [
  { id: 'all', label: 'All Questions', icon: MessageSquare },
  { id: 'medical', label: 'General Medical', icon: Stethoscope },
  { id: 'therapy', label: 'IV Therapy', icon: Droplets },
  { id: 'practice', label: 'Lalokhumed Practice', icon: Hospital },
] as const;

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<typeof categories[number]['id']>('all');
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  // Submission Form State
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ email: '', question: '' });

  const filteredFaqs = useMemo(() => {
    return faqs.filter(faq => {
      const matchesSearch = 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const handleSubmitQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.question) return;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "faq_submissions"), {
        ...formData,
        createdAt: serverTimestamp()
      });
      setSubmitted(true);
      setFormData({ email: '', question: '' });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("Error submitting question:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold font-sans tracking-tight text-brand-text mb-4"
          >
            How can we help?
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-2xl mx-auto"
          >
            Find answers to common questions about our medical protocols, IV therapy benefits, and how our practice operates.
          </motion.p>
        </div>

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8"
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search questions or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-100 h-16 pl-14 pr-6 rounded-2xl shadow-sm focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red outline-none transition-all font-sans text-brand-text text-lg"
          />
        </motion.div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all",
                  activeCategory === cat.id 
                    ? "bg-brand-red text-white shadow-lg shadow-brand-red/20" 
                    : "bg-white text-gray-500 hover:bg-gray-50"
                )}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* FAQ Grid */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, idx) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={faq.question}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <button
                    onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                    className="w-full flex items-center justify-between p-6 text-left group"
                  >
                    <span className="font-bold text-brand-text pr-8 font-sans leading-tight">
                      {faq.question}
                    </span>
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                      openIndex === idx ? "bg-brand-red text-white" : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                    )}>
                      {openIndex === idx ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openIndex === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                      >
                        <div className="px-6 pb-6 text-gray-500 leading-relaxed text-sm">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 bg-white rounded-3xl border border-dashed border-gray-200"
              >
                <p className="text-gray-400">No questions found matching your search.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Submit Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 p-8 md:p-12 bg-brand-text rounded-[2.5rem] text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold font-sans tracking-tight mb-4">
                Still have questions?
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                If you couldn't find what you were looking for, feel free to submit your question here. Our medical team will get back to you as soon as possible.
              </p>
              
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-brand-text bg-gray-200" />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-brand-text bg-brand-red flex items-center justify-center text-[10px] font-bold">
                  +1k
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-4 italic">
                Joined by over 1,000 health-conscious individuals.
              </p>
            </div>

            <div>
              <form onSubmit={handleSubmitQuestion} className="space-y-4">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl text-center"
                  >
                    <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Question Shared!</h3>
                    <p className="text-gray-400 text-sm">We've received your inquiry and will reach out shortly.</p>
                  </motion.div>
                ) : (
                  <>
                    <div>
                      <input
                        type="email"
                        required
                        placeholder="Your Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 h-14 px-6 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/50 transition-all text-sm"
                      />
                    </div>
                    <div>
                      <textarea
                        required
                        placeholder="Tell us what you'd like to know..."
                        rows={4}
                        value={formData.question}
                        onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-6 rounded-xl outline-none focus:ring-2 focus:ring-brand-red/50 transition-all text-sm resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-brand-red hover:bg-brand-red/90 text-white h-14 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-brand-red/20 disabled:opacity-50"
                    >
                      {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          <Send className="w-4 h-4" /> Submit Inquiry
                        </>
                      )}
                    </button>
                  </>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
