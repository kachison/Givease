export const Environment = {
  BaseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  PaystackSecretKey: process.env.PAYSTACK_PRIVATE_KEY || "",
  JwtSecret: process.env.JWT_SECRET || "donotexpose",
};
