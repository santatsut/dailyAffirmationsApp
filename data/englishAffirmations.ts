import { AffirmationItem, Category } from "./dataTypes";

export const affirmations: Record<Category, AffirmationItem[]> = {
  selfLove: [
    { id: "sl1", text: "I am enough exactly as I am." },
    { id: "sl2", text: "I treat myself with kindness." },
    { id: "sl3", text: "My worth is not up for debate." },
    { id: "sl4", text: "I allow myself to rest without guilt." },
  ],

  motivation: [
    { id: "m1", text: "I am capable of more than I think." },
    { id: "m2", text: "I keep going even when it’s hard." },
    { id: "m3", text: "Progress matters more than perfection." },
    { id: "m4", text: "I am building the life I want, one step at a time." },
  ],

  relationships: [
    { id: "r1", text: "I deserve love that feels safe." },
    { id: "r2", text: "Healthy love respects boundaries." },
    { id: "r3", text: "I attract relationships that support my growth." },
    { id: "r4", text: "I am worthy of love and respect." },
  ],

  heartbreak: [
    { id: "h1", text: "This pain is temporary and will pass." },
    { id: "h2", text: "I am learning and growing from this experience." },
    { id: "h3", text: "I release what I cannot change." },
    { id: "h4", text: "I am open to new love and happiness in the future." },
  ],
};
