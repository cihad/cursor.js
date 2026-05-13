export const proPurchaseLinks = {
  solo: process.env.NEXT_PUBLIC_CURSOR_PRO_SOLO_URL?.trim() || null,
  team: process.env.NEXT_PUBLIC_CURSOR_PRO_TEAM_URL?.trim() || null,
} as const;

export function getProPurchaseHref(plan: keyof typeof proPurchaseLinks): string {
  return proPurchaseLinks[plan] ?? '/pro#pricing';
}

export const proRegistrationChecklist = [
  'Secure checkout for Solo or Team.',
  'Instant email receipt with your order reference.',
  'License key delivery for premium features like Gemini TTS credits.',
  'A lightweight onboarding path so you can start shipping immediately.',
] as const;
