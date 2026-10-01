import type { SiteConfig } from "@/config/types";
import type { Product } from "@/lib/commerce/types";

/* ------------------------------------------------------------------ */
/*  Demo catalog — used until Shopify credentials are added to .env.  */
/*  Replace with your real products (or just connect Shopify).        */
/* ------------------------------------------------------------------ */

const php = (amount: number) => ({ amount, currencyCode: "PHP" });

function product(p: Omit<Product, "priceRange" | "available" | "images"> & { images?: Product["images"] }): Product {
  const prices = p.variants.map((v) => v.price.amount);
  return {
    ...p,
    images: p.images ?? [],
    available: p.variants.some((v) => v.available),
    priceRange: { min: php(Math.min(...prices)), max: php(Math.max(...prices)) },
  };
}

const demoCatalog: Product[] = [
  product({
    id: "demo-gut-guard",
    handle: "gut-guard",
    title: "Gut Guard",
    subtitle: "Pre + probiotic powder",
    description:
      "A daily scoop of six probiotic strains plus prebiotic fibre and pumpkin, made to support steady digestion, firmer stools and a happy tummy. Chicken-liver flavour that sprinkles straight onto meals.",
    art: { body: "#1F2A5C", lid: "#FF8FAB", label: "#FFFFFF", shape: "tub", bg: "#F1F7C4" },
    variants: [
      { id: "demo-gut-guard-30", title: "30 scoops", price: php(1290), compareAtPrice: php(1490), available: true },
      { id: "demo-gut-guard-60", title: "60 scoops", price: php(2290), compareAtPrice: php(2980), available: true },
    ],
    compareAtPrice: php(1490),
    tags: ["digestion", "bestseller"],
    productType: "Digestion",
    sellingPlan: { id: "demo-sub-15", name: "Delivered every 30 days", discountPercent: 15 },
    rating: 4.8,
    reviewCount: 412,
    highlights: ["Supports digestion and stool quality", "6 strains, 3 billion CFU per scoop", "No artificial colours or fillers"],
    howToUse: "Sprinkle on food once a day. Under 10 kg: ½ scoop. 10–25 kg: 1 scoop. Over 25 kg: 2 scoops.",
    ingredients: "Probiotic blend (L. acidophilus, L. plantarum, B. animalis, B. coagulans, E. faecium, B. subtilis), inulin, pumpkin powder, chicken liver powder.",
  }),
  product({
    id: "demo-coat-shine",
    handle: "coat-shine",
    title: "Coat Shine",
    subtitle: "Skin & coat chews",
    description:
      "Soft chews with omega-3 from fish oil, biotin and zinc to support a soft, glossy coat and comfortable skin — especially in humid months.",
    art: { body: "#FF8FAB", lid: "#1F2A5C", label: "#FFFFFF", shape: "tub" },
    variants: [{ id: "demo-coat-shine-60", title: "60 chews", price: php(1190), compareAtPrice: php(1390), available: true }],
    compareAtPrice: php(1390),
    tags: ["skin", "coat"],
    productType: "Skin & coat",
    sellingPlan: { id: "demo-sub-15", name: "Delivered every 30 days", discountPercent: 15 },
    rating: 4.7,
    reviewCount: 268,
    highlights: ["Supports skin comfort and coat shine", "Omega-3, biotin and zinc", "Salmon flavour"],
    howToUse: "Under 10 kg: 1 chew a day. 10–25 kg: 2 chews. Over 25 kg: 3 chews.",
    ingredients: "Fish oil, biotin, zinc, vitamin E, sweet potato, oat flour, natural salmon flavour.",
  }),
  product({
    id: "demo-joint-jump",
    handle: "joint-jump",
    title: "Joint Jump",
    subtitle: "Hip & joint chews",
    description:
      "Glucosamine, chondroitin and green-lipped mussel in a chew dogs actually ask for. Made for active dogs, big breeds and seniors who still want to climb the stairs.",
    art: { body: "#7FC8F8", lid: "#1F2A5C", label: "#FFFFFF", shape: "tub" },
    variants: [{ id: "demo-joint-jump-60", title: "60 chews", price: php(1390), available: true }],
    tags: ["joints", "senior"],
    productType: "Mobility",
    sellingPlan: { id: "demo-sub-15", name: "Delivered every 30 days", discountPercent: 15 },
    rating: 4.8,
    reviewCount: 187,
    highlights: ["Supports joint comfort and mobility", "Green-lipped mussel and MSM", "Great for seniors and large breeds"],
    howToUse: "Under 10 kg: 1 chew a day. 10–25 kg: 2 chews. Over 25 kg: 3 chews.",
    ingredients: "Glucosamine HCl, chondroitin sulfate, green-lipped mussel, MSM, turmeric, chicken flavour.",
  }),
  product({
    id: "demo-calm-bites",
    handle: "calm-bites",
    title: "Calm Bites",
    subtitle: "Relaxation chews",
    description:
      "Chamomile, L-theanine and passionflower for thunderstorms, fireworks, grooming visits and long car rides. Give 30 minutes before the stressful part.",
    art: { body: "#B9A6F2", lid: "#1F2A5C", label: "#FFFFFF", shape: "pouch" },
    variants: [{ id: "demo-calm-bites-45", title: "45 chews", price: php(990), available: true }],
    tags: ["calming"],
    productType: "Calming",
    rating: 4.6,
    reviewCount: 143,
    highlights: ["Supports calm during stressful moments", "Non-drowsy formula", "Peanut-butter flavour"],
    howToUse: "Give 30 minutes before a stressful event. Up to 2× a day.",
    ingredients: "L-theanine, chamomile, passionflower, thiamine, ginger, peanut butter flavour.",
  }),
  product({
    id: "demo-daily-wag",
    handle: "daily-wag",
    title: "Daily Wag",
    subtitle: "Multivitamin chews",
    description:
      "One chew covering the everyday basics: vitamins A to E, antioxidants and a little probiotic. The easy one for dogs on homemade or mixed diets.",
    art: { body: "#E3F25A", lid: "#1F2A5C", label: "#FFFFFF", shape: "tub" },
    variants: [{ id: "demo-daily-wag-90", title: "90 chews", price: php(1090), available: true }],
    tags: ["daily", "multivitamin"],
    productType: "Daily care",
    sellingPlan: { id: "demo-sub-15", name: "Delivered every 30 days", discountPercent: 15 },
    rating: 4.7,
    reviewCount: 96,
    highlights: ["Everyday vitamins and minerals", "Supports energy and immunity", "Beef flavour"],
    howToUse: "1 chew per 10 kg of body weight, once a day.",
    ingredients: "Vitamins A, B-complex, C, D3, E, blueberry, spinach, kelp, probiotic blend, beef flavour.",
  }),
  product({
    id: "demo-fresh-breath",
    handle: "fresh-breath",
    title: "Fresh Breath",
    subtitle: "Dental water additive",
    description:
      "Add a capful to the water bowl to help reduce plaque build-up and keep breath fresh between brushings. Flavourless, so picky drinkers won't notice.",
    art: { body: "#5CC9A7", lid: "#1F2A5C", label: "#FFFFFF", shape: "bottle" },
    variants: [{ id: "demo-fresh-breath-250", title: "250 ml", price: php(790), available: true }],
    tags: ["dental"],
    productType: "Dental",
    rating: 4.5,
    reviewCount: 71,
    highlights: ["Helps reduce plaque and tartar", "Freshens breath", "Flavourless — no fuss at the bowl"],
    howToUse: "Add 1 capful (5 ml) to 250 ml of water daily.",
    ingredients: "Purified water, zinc gluconate, green tea extract, xylitol-free, sodium hexametaphosphate.",
  }),
];

/* ------------------------------------------------------------------ */

export const wagwellness: SiteConfig = {
  id: "wagwellness",
  name: "WagWellness",
  tagline: "Daily supplements for happy dogs",
  description:
    "Vet-formulated dog supplements for digestion, skin, joints and calm — made for dogs living in the Philippine heat. Free delivery over ₱1,500.",
  locale: "en-PH",
  currency: "PHP",
  demoMode: true,

  theme: {
    colors: {
      bg: "#FFFEF8",
      surface: "#FFFFFF",
      surfaceAlt: "#F4EEE2",
      ink: "#1F2A5C",
      muted: "#5A6288",
      line: "#E6E1D4",
      primary: "#1F2A5C",
      primaryInk: "#FFFEF8",
      accent: "#E3F25A",
      accentInk: "#1F2A5C",
      pop: "#FF8FAB",
      popInk: "#1F2A5C",
    },
    fonts: {
      heading: {
        family: "Bricolage Grotesque",
        google: "Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800",
        fallback: "system-ui, sans-serif",
      },
      body: {
        family: "Instrument Sans",
        google: "Instrument+Sans:wght@400..700",
        fallback: "system-ui, sans-serif",
      },
    },
    radius: { sm: "12px", md: "20px", lg: "36px" },
  },

  logo: { text: "WagWellness", mark: "paw" },

  announcements: [
    "Free delivery on orders over ₱1,500",
    "Subscribe and save 15% on every refill",
    "Cash on delivery available nationwide",
  ],

  nav: [
    { label: "Shop all", href: "/shop" },
    { label: "Digestion", href: "/shop?type=Digestion" },
    { label: "Skin & coat", href: "/shop?type=Skin+%26+coat" },
    { label: "Find their fit", href: "/#quiz" },
    { label: "FAQ", href: "/#faq" },
  ],

  searchSuggestions: ["Digestion", "Itchy skin", "Joints", "Calm", "Puppy"],

  commerce: {
    freeShippingThreshold: 1500,
    demoCatalog,
    upsellHandles: ["calm-bites", "fresh-breath", "daily-wag"],
  },

  productPage: {
    guarantees: [
      { icon: "refund", label: "30-day money-back guarantee" },
      { icon: "truck", label: "Ships in 24 hours from Manila" },
      { icon: "flask", label: "Third-party lab tested" },
    ],
  },

  sections: [
    {
      type: "hero",
      heading: "Good days start in the gut.",
      body:
        "Daily supplements for digestion, skin, joints and calm — formulated with vets for dogs living in tropical heat.",
      primaryCta: { label: "Shop supplements", href: "/shop" },
      secondaryCta: { label: "Take the 30-second quiz", href: "/#quiz" },
      featuredHandle: "gut-guard",
      stickers: ["3B CFU per scoop", "Chicken-liver flavour", "Vet formulated"],
      proof: { rating: 4.8, label: "from 1,100+ dog parents" },
    },
    {
      type: "trust",
      items: [
        { icon: "flask", title: "Lab tested", body: "Every batch checked by an independent lab." },
        { icon: "leaf", title: "Clean label", body: "No artificial colours, fillers or sugar." },
        { icon: "truck", title: "Fast delivery", body: "1–3 days Metro Manila, 3–7 days provincial." },
        { icon: "refund", title: "30-day guarantee", body: "Not a fit? Get your money back." },
      ],
    },
    {
      type: "products",
      heading: "Something for every kind of dog",
      body: "Start with one, or stack two for the biggest difference.",
      cta: { label: "See all products", href: "/shop" },
    },
    {
      type: "story",
      heading: "Why we start with the gut",
      body: [
        "Around 70% of a dog's immune system sits in the gut. When the gut bacteria are out of balance, it can show up as loose stools, gas, itchy skin and a dull coat.",
        "Heat, humidity and sudden food changes make that balance harder to keep. Our formulas give it daily support, in flavours dogs treat like a reward.",
      ],
      stat: { value: "70%", label: "of the immune system lives in the gut" },
      points: [
        { title: "Steadier digestion", body: "Firmer stools, less gas, fewer upset tummies." },
        { title: "Calmer skin", body: "Less scratching and a softer, shinier coat." },
        { title: "Stronger defences", body: "Daily support for natural immunity." },
      ],
    },
    {
      type: "steps",
      heading: "How it fits into your day",
      steps: [
        { title: "Scoop or treat", body: "Sprinkle on breakfast or hand over a chew — dogs think it's a snack." },
        { title: "Keep it daily", body: "Most dog parents notice a difference within 2–4 weeks." },
        { title: "Refill automatically", body: "Subscribe and we deliver before you run out, 15% off." },
      ],
    },
    {
      type: "bundle",
      heading: "Build a bundle, save more",
      body: "Mix any products. The more you add, the bigger the discount.",
      handles: ["gut-guard", "coat-shine", "joint-jump", "calm-bites", "daily-wag", "fresh-breath"],
      tiers: [
        { quantity: 2, discountPercent: 10, label: "Pick 2" },
        { quantity: 3, discountPercent: 15, label: "Pick 3" },
        { quantity: 4, discountPercent: 20, label: "Pick 4" },
      ],
    },
    {
      type: "quiz",
      heading: "Not sure where to start?",
      body: "Three questions and we'll suggest the best first product for your dog.",
      questions: [
        {
          id: "concern",
          question: "What would you most like to improve?",
          options: [
            { label: "Tummy troubles or soft stools", scores: { "gut-guard": 3 } },
            { label: "Itching or a dull coat", scores: { "coat-shine": 3, "gut-guard": 1 } },
            { label: "Stiff joints or slowing down", scores: { "joint-jump": 3 } },
            { label: "Stress, fireworks or car rides", scores: { "calm-bites": 3 } },
          ],
        },
        {
          id: "age",
          question: "How old is your dog?",
          options: [
            { label: "Under 1 year", scores: { "gut-guard": 1, "daily-wag": 1 } },
            { label: "1 to 7 years", scores: { "daily-wag": 1 } },
            { label: "Over 7 years", scores: { "joint-jump": 2 } },
          ],
        },
        {
          id: "diet",
          question: "What do they mostly eat?",
          options: [
            { label: "Dry kibble", scores: { "gut-guard": 1, "coat-shine": 1 } },
            { label: "Home-cooked or raw", scores: { "daily-wag": 2 } },
            { label: "A mix of everything", scores: { "gut-guard": 2 } },
          ],
        },
      ],
      results: {
        "gut-guard": { headline: "Start with Gut Guard", reason: "Balancing the gut first helps digestion, skin and immunity all at once." },
        "coat-shine": { headline: "Start with Coat Shine", reason: "Omega-3 and biotin go straight to the skin and coat you're worried about." },
        "joint-jump": { headline: "Start with Joint Jump", reason: "Daily joint support keeps older and bigger dogs moving comfortably." },
        "calm-bites": { headline: "Start with Calm Bites", reason: "Fast-acting calm support for the moments that stress them out." },
        "daily-wag": { headline: "Start with Daily Wag", reason: "Covers the everyday nutrient gaps of home-cooked and mixed diets." },
      },
    },
    {
      type: "reviews",
      heading: "What dog parents tell us",
      sample: true,
      reviews: [
        { name: "Bea R.", pet: "Mochi, Shih Tzu", rating: 5, title: "Finally, normal poops", body: "Two weeks in and her stools are firm again. She licks the bowl clean, scoop and all.", product: "Gut Guard", date: "Aug 2025", verified: true },
        { name: "Paolo D.", pet: "Bruno, Aspin", rating: 5, title: "He stopped scratching at night", body: "We tried three shampoos before this. The chews did more for his skin than all of them.", product: "Coat Shine", date: "Jul 2025", verified: true },
        { name: "Karla M.", pet: "Tala, Labrador", rating: 5, title: "Stairs are easy again", body: "She's eleven and was skipping the stairs. A month later she's racing us up.", product: "Joint Jump", date: "Jun 2025", verified: true },
        { name: "Jerome S.", pet: "Pepper, Beagle", rating: 4, title: "New Year's Eve was quiet", body: "Gave two bites before the fireworks. Still a bit clingy, but no shaking or hiding.", product: "Calm Bites", date: "Jan 2025", verified: true },
        { name: "Ana L.", pet: "Coco & Kiko, Poodles", rating: 5, title: "Subscription is so easy", body: "Refills arrive before we run out and the 15% adds up with two dogs.", date: "Sep 2025", verified: true },
        { name: "Miguel T.", pet: "Biscuit, Golden Retriever", rating: 5, title: "Shiny coat, zero fishy smell", body: "Other omega chews left his breath weird. These don't, and strangers keep commenting on how glossy he looks.", product: "Coat Shine", date: "Aug 2025", verified: true },
        { name: "Rica P.", pet: "Loki, Husky", rating: 5, title: "Less gas, happier walks", body: "Embarrassing but true — walks are pleasant again. Gut Guard plus Daily Wag is our combo now.", product: "Gut Guard", date: "May 2025", verified: true },
        { name: "Denise W.", pet: "Mango, Corgi", rating: 4, title: "Calm without the drowsy look", body: "Thunder used to send her under the bed. She still watches the window, but she stays on her mat.", product: "Calm Bites", date: "Apr 2025", verified: true },
        { name: "Jonah F.", pet: "Scout, Belgian Malinois", rating: 5, title: "Recovery days feel smoother", body: "He's an agility dog and we use Joint Jump on heavy training weeks. Less stiffness the morning after.", product: "Joint Jump", date: "Jul 2025", verified: true },
        { name: "Hannah G.", pet: "Peanut, Mini Dachshund", rating: 5, title: "Picky eater approved", body: "She usually spits out supplements. Daily Wag goes on her kibble and she finishes every bowl.", product: "Daily Wag", date: "Sep 2025", verified: true },
        { name: "Omar V.", pet: "Ghost, German Shepherd", rating: 4, title: "Breath is noticeably fresher", body: "The Fresh Breath chews aren't magic, but after two weeks the morning licks are way more tolerable.", product: "Fresh Breath", date: "Jun 2025", verified: true },
      ],
    },
    {
      type: "faq",
      heading: "Questions, answered",
      items: [
        { q: "How soon will I see a difference?", a: "Digestion usually improves within 1–2 weeks. Skin, coat and joint changes take 3–6 weeks of daily use." },
        { q: "Can puppies take these?", a: "Gut Guard and Daily Wag are safe from 12 weeks old. For the chews, we recommend waiting until 6 months." },
        { q: "Can I combine products?", a: "Yes. All our formulas are designed to be used together. Gut Guard plus Coat Shine is the most popular pair." },
        { q: "My dog is on medication. Is it safe?", a: "Our supplements are generally well tolerated, but please check with your vet first if your dog is on medication or has a health condition." },
        { q: "How does the subscription work?", a: "Choose subscribe on any product to save 15%. We deliver every 30 days, and you can skip, pause or cancel anytime from your account." },
        { q: "What if my dog doesn't like it?", a: "Message us within 30 days of delivery and we'll refund you — even if the tub is open." },
        { q: "How long does delivery take?", a: "Orders ship within 24 hours. Metro Manila takes 1–3 days and provincial areas take 3–7 days." },
      ],
    },
    {
      type: "cta",
      heading: "Their best days are ahead.",
      body: "Try any product risk-free for 30 days.",
      cta: { label: "Shop supplements", href: "/shop" },
    },
  ],

  // Template policies — have these reviewed before launch.
  pages: {
    shipping: {
      title: "Shipping policy",
      body: [
        "Orders placed before 2 pm ship the same business day from our Manila warehouse.",
        "Metro Manila: 1–3 business days. Luzon: 3–5 business days. Visayas and Mindanao: 5–7 business days.",
        "Delivery is free on orders over ₱1,500. Below that, a flat ₱99 fee applies in Metro Manila and ₱149 elsewhere.",
        "You'll get a tracking link by SMS and email as soon as your order ships.",
      ],
    },
    refunds: {
      title: "Returns & refunds",
      body: [
        "If your dog doesn't take to a product, message us within 30 days of delivery for a full refund — opened tubs included.",
        "Refunds are sent to your original payment method within 5–7 business days. Cash-on-delivery orders are refunded by GCash or bank transfer.",
        "Damaged or wrong items are replaced free of charge. Send a photo to our support email within 7 days of delivery.",
      ],
    },
    privacy: {
      title: "Privacy policy",
      body: [
        "We collect only the details needed to process and deliver your order: name, contact details and delivery address.",
        "Payments are handled by Shopify and its payment partners. We never see or store your card details.",
        "We comply with the Philippine Data Privacy Act of 2012. Email us anytime to access, correct or delete your data.",
      ],
    },
    terms: {
      title: "Terms of use",
      body: [
        "Our products are food supplements for dogs and are not intended to diagnose, treat, cure or prevent any disease.",
        "Always consult your veterinarian if your dog is pregnant, nursing, on medication or has a medical condition.",
        "Prices and availability may change without notice.",
      ],
    },
  },

  footer: {
    about: "Vet-formulated supplements for dogs in Southeast Asia. Made to support happier tummies, softer coats and easier days.",
    columns: [
      { title: "Shop", links: [{ label: "All products", href: "/shop" }, { label: "Digestion", href: "/shop?type=Digestion" }, { label: "Bundles", href: "/#bundle" }] },
      { title: "Help", links: [{ label: "FAQ", href: "/#faq" }, { label: "Shipping", href: "/pages/shipping" }, { label: "Returns & refunds", href: "/pages/refunds" }] },
      { title: "Company", links: [{ label: "Privacy policy", href: "/pages/privacy" }, { label: "Terms of use", href: "/pages/terms" }] },
    ],
    contact: { email: "hello@wagwellness.ph", phone: "+63 900 000 0000" },
    social: [
      { label: "Facebook", href: "https://facebook.com" },
      { label: "Instagram", href: "https://instagram.com" },
      { label: "TikTok", href: "https://tiktok.com" },
    ],
    payments: ["GCash", "Maya", "Visa", "Mastercard", "COD"],
  },
};
