import DashboardLayout from "@/layouts/DashboardLayout";
import MarketplaceTemplate from "@/templates/beneficiary/marketplace-template/MarketplaceTemplate";
import {
  __util__clientActiveSession,
  __util_GetActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";

export default function MarketplacePage(props: {
  user: Required<TActiveUserSession>;
}) {
  return (
    <DashboardLayout user={props.user}>
      <MarketplaceTemplate user={props.user} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = (await __util__clientActiveSession(
    context.req.cookies,
    UserRole.Beneficiary
  )) as any;
  if (user.redirect) return user;
  return { props: { user } };
}
