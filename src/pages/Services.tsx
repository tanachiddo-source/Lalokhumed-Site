import { Link } from "react-router-dom";
import { ArrowRight, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";
import { SEO } from "../components/Layout";

export default function Services() {
  const services = [
    {
      name: "Vitamin & Mineral Booster",
      price: "R940",
      description: "Supports muscle and bone development through high-concentration vitamins and minerals.",
      features: ["Muscle development", "Bone support", "Essential nutrients"]
    },
    {
      name: "Detox",
      price: "R1,300",
      description: "A comprehensive detox drip that supports your liver and provides powerful antioxidant support.",
      features: ["Detoxifies liver", "Reduces heavy metals", "Restores cell membranes"]
    },
    {
      name: "Immune Booster",
      price: "R1,300",
      description: "High-dose Vitamin C to strengthen your immune system and energy levels.",
      features: ["High-dose Vitamin C", "Strengthens immunity", "Energy support"]
    },
    {
      name: "Anti-Ageing",
      price: "R1,300",
      description: "Enhances your natural glow by supporting collagen production and skin health.",
      features: ["Increases collagen", "Improves elasticity", "Brightens skin"]
    },
    {
      name: "Gut Health",
      price: "R1,450",
      description: "Focused on digestive wellness, reducing inflammation and supporting gut restoration.",
      features: ["Supports digestion", "Inflammation control", "Gut restoration"]
    },
    {
      name: "Weight Loss",
      price: "R1,200",
      description: "Boosts metabolism using a blend of vitamins, antioxidants, and amino acids.",
      features: ["Boosts metabolism", "Antioxidant blend", "Amino acid support"]
    },
    {
      name: "Mood & Brain Booster",
      price: "R1,300",
      description: "Clears brain fog and enhances cognitive function for better mental clarity.",
      features: ["Cognitive support", "Reduces brain fog", "Improves focus"]
    },
    {
      name: "Fertility",
      price: "R980",
      description: "Specific nutrients designed to support reproductive health and egg/sperm quality.",
      features: ["Reproductive health", "Egg/Sperm quality", "Targeted nutrients"]
    },
    {
      name: "NAD Therapy",
      price: "R2,000",
      duration: "3 hours",
      description: "Premium cellular recovery therapy that supports energy, brain function, and anti-ageing.",
      features: ["Cellular recovery", "Energy support", "Brain function"]
    },
  ];

  return (
    <div className="pt-20">
      <SEO 
        title="IV Therapy Services & Pricing | LALOKHUMED Sandton" 
        description="Explore our range of medical IV drips including Immune Boosters, NAD+ Therapy, Detox, and Weight Loss. Professional healthcare in Bryanston."
      />
      {/* Header */}
      <section className="py-24 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
           <div className="max-w-3xl">
             <h1 className="text-5xl md:text-7xl font-serif text-brand-text mb-8">
               Evidence-Based <span className="text-brand-red italic">IV Treatments</span>.
             </h1>
             <p className="text-xl text-gray-500 leading-relaxed">
               Our IV therapy treatments are designed to support a wide range of health and wellness goals, delivered in a clinical setting under professional supervision.
             </p>
           </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-brand-grey/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, idx) => (
              <div 
                key={idx} 
                className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100 flex flex-col hover:shadow-xl hover:border-brand-red/10 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-8">
                   <div>
                     <h3 className="text-2xl font-serif mb-2">{service.name}</h3>
                     {service.duration && (
                       <div className="flex items-center gap-1.5 text-brand-red text-xs font-bold uppercase tracking-widest">
                         <Clock className="w-3.5 h-3.5" />
                         {service.duration}
                       </div>
                     )}
                   </div>
                   <div className="text-2xl font-serif text-gray-900">{service.price}</div>
                </div>

                <p className="text-gray-500 text-sm mb-8 leading-relaxed flex-grow">
                  {service.description}
                </p>

                <div className="space-y-3 mb-10">
                   {service.features.map((f, i) => (
                     <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                       <CheckCircle2 className="w-4 h-4 text-green-500" />
                       {f}
                     </div>
                   ))}
                </div>

                <Link
                  to="/booking"
                  className="w-full bg-brand-grey text-brand-text py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-brand-red group-hover:text-white transition-all transform active:scale-95"
                >
                  Book Treatment <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Quote */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center italic">
          <div className="w-12 h-12 bg-brand-red/10 rounded-full flex items-center justify-center text-brand-red mx-auto mb-8">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <p className="text-2xl md:text-3xl font-serif text-gray-700 leading-relaxed mb-8">
            "Every drip is prepared at our clinic using pharmaceutical-grade nutrients. We ensure that your treatment is perfectly balanced for your health profile."
          </p>
          <div className="h-px w-20 bg-brand-red mx-auto" />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-text text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
           <div className="bg-brand-red/5 rounded-[3rem] p-12 lg:p-20 border border-white/5 text-center">
             <h2 className="text-3xl md:text-5xl font-serif mb-8 text-white">Not sure which treatment is right for you?</h2>
             <p className="text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
               All treatments are subject to a medical review. We suggest beginning with a consultation or completing our digital patient questionnaire for a professional recommendation.
             </p>
             <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                  to="/booking" 
                  className="bg-brand-red text-white px-10 py-5 rounded-full font-bold shadow-2xl hover:bg-brand-red-dark transition-all"
              >
                Book Consultation
              </Link>
              <Link 
                  to="/questionnaire" 
                  className="bg-white text-brand-text px-10 py-5 rounded-full font-bold hover:bg-brand-grey transition-all"
              >
                Complete Questionnaire
              </Link>
            </div>
           </div>
        </div>
      </section>
    </div>
  );
}
