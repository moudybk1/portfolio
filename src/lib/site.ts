export const siteConfig = {
  name: "Moudy",
  title: "Moudy | Customer Support Specialist",
  description:
    "Customer Support Specialist helping teams turn everyday support into loyalty — with empathy, calm triage, and clear operations. Experience forged in Web3, ready for any industry.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://moudy.xyz",
  locale: "en_US",
  email: "moudy.eth@gmail.com",
  twitter: "mowdylowdy",
  ogImage: "/about-photo.png",
  keywords: [
    "Moudy",
    "Customer Support Specialist",
    "Web3 support",
    "community support",
    "customer success",
    "Discord support",
    "Telegram support",
    "ticket triage",
    "support operations",
  ],
  sameAs: [
    "https://x.com/mowdylowdy",
    "https://www.linkedin.com/in/yogabk/",
    "https://t.me/mowdylowdy",
    "https://discord.com/users/490201818123730954",
  ],
} as const;
