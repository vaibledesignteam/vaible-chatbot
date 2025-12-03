// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');

// ====== VAIBLE HERBAL FAQS (instant answers, no OpenAI call) ======
const FAQS = [
  {
    id: 'who_we_are',
    triggers: ['who is vaible herbal', 'what is vaible herbal', 'vaible herbal india pvt'],
    answer:
      'Vaible Herbal India Pvt. Ltd. is a leading Indian supplier of Herbal Extracts, Essential Oils, Carrier Oils, Herbal Powders, Natural Fragrances, Hydrosols, and Nutraceutical Ingredients. We provide high-quality, globally compliant materials to FMCG, Cosmetics, Pharmaceuticals, Food & Nutraceutical industries.'
  },
    {
    id: 'contact_details',
    triggers: [
      'contact number',
      'phone number',
      'whatsapp number',
      'how can i contact you',
      'how do i contact you',
      'your contact',
      'your phone',
      'your whatsapp',
      'company contact',
      'company phone'
    ],
    answer:
      'You can contact Vaible Herbal via phone or WhatsApp on 7503803829, 8802885530 or +91-11 4705 6375, or email us at Sales@Vaibleherbal.com.'
  },

  {
    id: 'location',
    triggers: ['where is your company located', 'where are you located', 'headquarters'],
    answer:
      'Our headquarters is in Delhi, India, and we supply across India and to multiple international markets.'
  },
  {
    id: 'employees_team',
    triggers: ['how many employees', 'team size', 'how big is your team'],
    answer:
      'We operate through a professionally managed team handling production, quality, R&D, logistics, and global sourcing.'
  },
  {
    id: 'manufacturer_or_trader',
    triggers: ['manufacturer or trader', 'are you a manufacturer', 'are you trader'],
    answer:
      'We primarily supply pure and standardized extracts, and we also offer imported extracts and oils based on customer requirements.'
  },
  {
    id: 'imported_extracts',
    triggers: ['imported extracts', 'imported oils', 'do you supply imported'],
    answer:
      'Yes. We source premium-quality materials from India, Europe, Southeast Asia, and the U.S. as per project requirements.'
  },
  {
    id: 'organic_conventional',
    triggers: ['organic and conventional', 'organic products', 'conventional grade'],
    answer:
      'Yes, we offer both Organic-certified and Conventional grade products.'
  },
  {
    id: 'pure_natural',
    triggers: ['100% pure', 'pure and natural', 'additive-free'],
    answer:
      'Yes. We supply pure, natural and additive-free herbal ingredients.'
  },
  {
    id: 'vegan_cruelty_free',
    triggers: ['vegan', 'cruelty free'],
    answer:
      'Yes. All our products are 100% vegan and not tested on animals.'
  },
  {
    id: 'bse_tse_free',
    triggers: ['bse', 'tse', 'bse/tse'],
    answer:
      'Yes. Our products are of plant origin and are BSE/TSE free.'
  },
  {
    id: 'non_gmo',
    triggers: ['non-gmo', 'gmo free'],
    answer:
      'Yes, our sourced raw materials are NON-GMO compliant.'
  },
  {
    id: 'melamine_free',
    triggers: ['melamine free', 'melamine-free'],
    answer:
      'Yes. We follow strict quality testing ensuring zero melamine contamination.'
  },
  {
    id: 'quality_standards',
    triggers: ['international quality standards', 'usp ip bp ep', 'who guidelines'],
    answer:
      'Yes. Our products comply with global standards including USP, IP, BP, EP and WHO guidelines, depending on client requirement.'
  },
  {
    id: 'product_range',
    triggers: ['what products do you manufacture', 'what products do you supply', 'product range'],
    answer:
      'We supply Dry Extracts, Liquid Extracts, Oil-soluble Extracts, Water-soluble Extracts, Soft/Paste Extracts, Essential Oils, Carrier Oils, Herbal Powders & Granules, Natural Fragrances and Hydrosols.'
  },
  {
    id: 'hydrosols',
    triggers: ['hydrosol', 'floral waters', 'hydrosol waters'],
    answer:
      'Yes, we offer a wide range of floral hydrosols and natural waters.'
  },
  {
    id: 'documents_coa_msds',
    triggers: ['coa', 'msds', 'spec sheet', 'documents do you provide'],
    answer:
      'Yes. Every product is supported with COA (Certificate of Analysis), MSDS, Specifications Sheet and relevant test reports.'
  },
  {
    id: 'product_catalog',
    triggers: ['product catalog', 'catalogue', 'do you have a catalogue'],
    answer:
      'Yes, we have a complete product catalog. You can request it by emailing Sales@Vaibleherbal.com or via the enquiry form.'
  },
  {
    id: 'standardized_extracts',
    triggers: ['standardized extracts', 'standardised extracts', 'standardisation'],
    answer:
      'Yes. We supply standardized extracts and can match marker compounds / assay levels as per client requirements.'
  },
  {
    id: 'effervescent',
    triggers: ['effervescent', 'effervescent tablet'],
    answer:
      'Yes, we supply effervescent-friendly, highly soluble extracts suitable for effervescent tablet applications.'
  },
  {
    id: 'custom_blends',
    triggers: ['custom blends', 'premixes', 'custom formulations'],
    answer:
      'Yes. We create custom formulations, blends and premixes for brands based on their formulation and label claims.'
  },
  {
    id: 'formulation_assistance',
    triggers: ['formulation assistance', 'help with formulation', 'ingredient selection'],
    answer:
      'Yes. Our technical team can guide you with ingredient selection and basic formulation suggestions at the raw-material level.'
  },
  {
    id: 'private_label',
    triggers: ['private label', 'contract manufacturing', 'white label'],
    answer:
      'Yes. We provide bulk supply and white label / contract manufacturing support depending on the project scope.'
  },
  {
    id: 'bulk_only',
    triggers: ['bulk only', 'do you supply in bulk', 'b2b only'],
    answer:
      'We are a B2B bulk supplier. We supply in commercial pack sizes for brands, manufacturers, formulators and traders.'
  },
  {
    id: 'testing',
    triggers: ['what do you test for', 'product testing', 'what tests do you do'],
    answer:
      'We test for microbiology, heavy metals, aflatoxins, residual solvents and pesticide residues. All testing is performed under NABL-accredited labs or equivalent.'
  },
  {
    id: 'third_party_reports',
    triggers: ['3rd-party lab reports', 'third party reports', 'nabl report'],
    answer:
      'Yes, we provide NABL/ISO-certified third-party reports based on client requirements.'
  },
  {
    id: 'packaging_options',
    triggers: ['packaging options', 'how do you pack', 'drums cans'],
    answer:
      'We offer HDPE cans, aluminium bottles, fibre drums, poly-lined bags, cartons and bulk drums, depending on the product and quantity.'
  },
  {
    id: 'moq',
    triggers: ['moq', 'minimum order', 'minimum quantity'],
    answer:
      'Our MOQ varies by product, but generally starts from 1 kg, 5 kg or 25 kg per product. For specific items and pilot projects, please check with us at Sales@Vaibleherbal.com.'
  },
  {
    id: 'samples',
    triggers: ['do you provide samples', 'free samples', 'paid samples'],
    answer:
      'Yes, we provide both paid and free samples depending on the product and project. Share your requirements and destination, and we will advise sampling options.'
  },
  {
    id: 'pricing',
    triggers: ['get pricing', 'price list', 'quotation'],
    answer:
      'To get pricing, please share the product name, quantity and delivery location. We will provide a formal quotation with lead time and terms.'
  },
  {
    id: 'volume_discount',
    triggers: ['volume discount', 'bulk discount', 'better price for higher quantity'],
    answer:
      'Yes, we offer volume-based pricing. As order quantities increase, we can extend better commercial terms.'
  },
  {
    id: 'payment_terms',
    triggers: ['payment terms', 'how do i pay', 'payment options'],
    answer:
      'Typical terms are 50% advance and balance before dispatch. For exports, we support TT/Wire Transfer and, for large contracts, LC can be discussed.'
  },
  {
    id: 'delivery_time',
    triggers: ['delivery timeline', 'how long for delivery', 'shipping time'],
    answer:
      'Domestic deliveries are generally 2–5 days from dispatch. International deliveries are typically 5–12 days depending on destination and shipping mode.'
  },
  {
    id: 'countries',
    triggers: ['which countries do you supply', 'countries you serve', 'export markets'],
    answer:
      'We supply across India and export to Europe, USA, Middle East, Southeast Asia and South Asia, and are open to working with new regions.'
  },
  {
    id: 'industries',
    triggers: ['which industries do you serve', 'who uses your products', 'sectors you supply'],
    answer:
      'We serve Cosmetics, Pharmaceuticals, Nutraceuticals, Ayurveda, FMCG, Food & Beverage and related industries.'
  },
  {
    id: 'incoterms',
    triggers: ['cif', 'fob', 'exw', 'incoterms'],
    answer:
      'Yes, we can work with different Incoterms such as EXW, FOB and CIF depending on the project and destination.'
  },
  {
    id: 'distributor',
    triggers: ['become a distributor', 'distributorship', 'channel partner'],
    answer:
      'Yes, distributorship and partnership enquiries are welcome. Please share your company profile, region and focus segments.'
  },
  {
    id: 'annual_contracts',
    triggers: ['annual contract', 'long term supply', 'yearly contract'],
    answer:
      'Yes, we support annual contracts and long-term supply agreements, with mutually agreed specs, pricing and delivery schedules.'
  },
  {
  id: 'vimal_joke',
  triggers: ['vimal joke', 'tell me about vimal', 'vimal idiot'],
  answer:
    "Vimal is a Rajasthani idiot who thinks he plays cricket very well. 'Taal bijli se patle hamare piya' song is actually based on Vimal. 😂"
}

];

// Extract pure user question even if frontend prepends "Please answer in X. User message: ..."
function extractUserMessage(raw) {
  if (!raw) return '';
  const lower = raw.toLowerCase();
  const marker = 'user message:';
  const idx = lower.indexOf(marker);
  if (idx !== -1) {
    return raw.substring(idx + marker.length).trim();
  }
  return raw;
}

function findFaqAnswer(rawMessage) {  
  const userText = extractUserMessage(rawMessage).toLowerCase();

  for (const faq of FAQS) {
    const hit = faq.triggers.some((t) => userText.includes(t.toLowerCase()));
    if (hit) {
      return faq.answer;
    }
  }
  return null;
}
// ====== END FAQS ======


const app = express();
const port = process.env.PORT || 3000;


app.use(cors());
app.use(express.json());

// Initialise OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt – basic version for now
// System prompt – basic version for now
const SYSTEM_PROMPT = `
You are "Vaible Herbal Assistant," the official virtual agent of Vaible Herbal India Pvt. Ltd.

About the company:
- Vaible Herbal is an Indian manufacturer and exporter of premium-quality herbal extracts, essential oils, carrier oils, floral waters, cosmetic butters, and nutraceutical powders.
- Tagline: "Manufactured in India, Delivered Across the Globe."
- All products are manufactured in India and shipped worldwide (USA, EU, UK, Middle East, Africa, Asia).
- Company offers: COA, Specification Sheet, MSDS, Phyto Certificate, Commercial Invoice, Packing List, HS Code Information.
- GMP, ISO, FSSAI, Organic-certified products (where applicable).

Official contact details:
- Email: Sales@Vaibleherbal.com
- Phone / WhatsApp:
  • 7503803829
  • 8802885530
  • +91-11 4705 6375

Never mention or use the number +91-9911154497 in any response.

Key product categories:
1. Herbal Extracts (Dry & Liquid)
2. Essential Oils
3. Carrier Oils
4. Cosmetic Butters
5. Nutraceutical Powders
6. Herbal Powders

General guidelines:
- MOQ for herbal extracts: 25 kg
- MOQ for essential oils: 5 kg
- MOQ for herbal powders: 25 kg
- Samples available upon request (shipping charge may apply)
- Lead time for dispatch: 2–5 working days depending on product
- Packaging: HDPE drums, fiber drums, food-grade pouches, or custom packaging based on product.

How to respond:
- Always be polite, professional, concise, and helpful.
- Always ask for product name + quantity + destination country when acting on pricing or shipping.
- NEVER give exact prices (say "pricing depends on quantity and destination—please contact Sales@Vaibleherbal.com or call/WhatsApp on 7503803829 / 8802885530 / +91-11 4705 6375.").
- Do not make medical claims. If asked about benefits, only speak about "traditional uses" or "general applications."
- If a question is unrelated to business (jokes, personal advice, coding, politics), respond:
  "I am the Vaible Herbal Assistant and can only help with product, export or business-related inquiries."

Applications information format:
When asked about applications of a product:
- Provide 3–5 clear points
- Mention common industries (cosmetics, nutraceuticals, Ayurveda, food, aromatherapy, perfumery, pharma, skincare).

Shipping:
- For export queries, ask for: Consignee country + order volume.
- Mention: "We ship globally via DHL, FedEx, air cargo, or sea freight depending on volume."

Documents:
- For every export order, Vaible provides: Commercial Invoice, Packing List, Certificate of Analysis (COA), MSDS, Organic Certificate (where applicable), Phytosanitary Certificate if required.

If information is missing:
- Say: "For exact details, please contact Sales@Vaibleherbal.com or call/WhatsApp on 7503803829 / 8802885530 / +91-11 4705 6375."

Tone:
- Warm, knowledgeable, professional.
- Represent the brand exactly as a trained export manager would.
`;

app.post('/api/chat', async (req, res) => {
  try {
    const rawMessage = req.body.message || '';

    // 1) First try to match FAQ
    const faqAnswer = findFaqAnswer(rawMessage);
    if (faqAnswer) {
      return res.json({ reply: faqAnswer });
    }

    // 2) If no FAQ matched → fall back to OpenAI exactly as before
    const userMessage = rawMessage;
    
    if (!userMessage.trim()) {
      return res.status(400).json({ error: 'Empty message' });
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.4,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });

  } catch (err) {
    console.error('Error from OpenAI:', err?.response?.data || err.message);
    res.status(500).json({ error: 'Something went wrong. Please try again later.' });
  }
});


app.listen(port, () => {
  console.log(`Vaible chatbot server running on http://localhost:${port}`);
});
