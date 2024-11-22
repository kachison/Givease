import { ImLogo } from "@/assets/images";
import SectionAlert from "@/components/feedbacks/section-alert/SectionAlert";
import AuthService from "@/http/Auth.service";
import { Routes } from "@/utils/config/routes.config";
import { TActiveUserSession } from "@/utils/helpers/session.helper";
import { ListItem } from "@/utils/types/index.types";
import Link from "next/link";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { ReactNode } from "react";

type DashboardLayoutProps = {
  user: Required<TActiveUserSession>;
  children: ReactNode;
};

function useDashboardLayout(props: DashboardLayoutProps) {
  const router = useRouter();
  const beneficiaryRoutes: ListItem[] = [
    { id: Routes.Beneficiary.Marketplace, name: "Marketplace" },
    { id: Routes.Beneficiary.Wishlist, name: "Wishlist" },
  ];

  const merchantRoutes: ListItem[] = [
    { id: Routes.Merchant.Store, name: "My store" },
    { id: Routes.Merchant.Requests, name: "Requests" },
    { id: Routes.Merchant.Notifications, name: "Notifications" },
  ];

  const donorRoutes: ListItem[] = [
    { id: Routes.Donor.Board, name: "Marketplace" },
    { id: Routes.Donor.Contributions, name: "Contributions" },
    { id: Routes.Donor.Notifications, name: "Notifications" },
  ];

  async function handleSignOut() {
    const { data, error } = await AuthService.DeleteSession();

    enqueueSnackbar({
      message: data?.message || error?.message,
      variant: data ? "success" : "error",
    });

    if (data) {
      router.push(Routes.SignIn);
    }
  }

  const user =
    props.user?.beneficiary || props.user?.merchant || props.user?.donor;

  return {
    user,
    handleSignOut,
    routes: props.user?.merchant
      ? merchantRoutes
      : props.user?.donor
      ? donorRoutes
      : beneficiaryRoutes,
  };
}

export default function DashboardLayout(props: DashboardLayoutProps) {
  const router = useRouter();
  const h = useDashboardLayout(props);

  const shouldShowCompleteProfileInfo =
    router.asPath !== Routes.Donor.Board &&
    !router.asPath.includes("/d/board/") &&
    router.asPath !== Routes.Beneficiary.Setup &&
    router.asPath !== Routes.Merchant.Setup &&
    !props.user?.beneficiary?.identityVerifiedAt &&
    !props.user?.merchant?.identityVerifiedAt;

  return (
    <main className="min-h-dvh bg-bg-primary flex flex-col">
      <header className="bg-white py-4 border-b border-stone-200">
        <div className="flex items-center justify-between px-5 bg-white max-w-screen-2xl mx-auto">
          <Link href={Routes.Index}>
            <img src={ImLogo.src} className="h-4" />
          </Link>

          <ul className="flex items-center gap-6">
            {h.routes.map((route) => (
              <Link
                href={route.id}
                key={route.id}
                className="text-sm font-medium"
              >
                {route.name}
              </Link>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${h.user?.firstName}}+${h.user?.lastName}&background=FB8B24&color=fff&font-size=0.35`}
              className="size-8 rounded-full"
            />

            <div>
              <h6 className="text-sm text-stone-600 font-medium">
                {h.user?.firstName} {h.user?.lastName}
              </h6>
              <p className="text-xs font-semibold text-stone-400 -mt-0.5">
                {props.user?.identifier}
              </p>
            </div>
          </div>
        </div>
      </header>

      {shouldShowCompleteProfileInfo && (
        <div className="px-5 mx-auto max-w-screen-2xl mt-6">
          <SectionAlert>
            <div className="flex justify-between items-center w-full">
              <div>
                <span className="text-lg block font-medium">
                  Hi {h.user?.firstName}, Welcome to GivEase
                </span>
                <span className="block text-stone-400">
                  Please to get started we would like you to update your profile
                  and fill out the KYC form.
                </span>
              </div>

              <Link
                href={
                  props?.user?.merchant?.id
                    ? Routes.Merchant.Setup
                    : Routes.Beneficiary.Setup
                }
                className="text-xs font-medium text-white bg-primary rounded-full py-2 px-4 block border-4 border-orange-200"
              >
                Update profile
              </Link>
            </div>
          </SectionAlert>
        </div>
      )}

      <section className="max-w-screen-2xl mx-auto w-full">
        {props.children}
      </section>

      <footer className="mt-auto">
        <div className="px-6 mx-auto max-w-screen-2xl border-t border-stone-200 py-6">
          <div className="flex items-center justify-between">
            <Link href={Routes.Index}>
              <img src={ImLogo.src} className="h-6" />
            </Link>

            <div className="text-sm">
              Follow us: <Link href={Routes.Index}>Instagram</Link> |{" "}
              <Link href={Routes.Index}>Facebook</Link> |{" "}
              <button onClick={h.handleSignOut}>Log out</button>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
