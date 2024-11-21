export const Routes = {
  Index: "/",
  SignIn: "/signin",
  SignUp: "/signup",
  Merchant: {
    SignUp: "/m/register",
    Store: "/m/store",
    Setup: "/m/setup",
    Requests: "/m/requests",
    Notifications: "/m/notifications",
  },
  Beneficiary: {
    SignUp: "/b/register",
    Marketplace: "/b/marketplace",
    ProductView: (productId: string) => `/b/marketplace/${productId}`,
    Setup: "/b/setup",
    Wishlist: "/b/wishlist",
    Notifications: "/b/notifications",
  },
  Donor: {
    SignUp: "/d/register",
    Board: "/d/board",
    Contributions: "/d/contributions",
    Notifications: "/d/notifications",
    RequestView: (productId: string) => `/d/board/${productId}`,
  },
};
