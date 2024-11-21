import DashboardLayout from "@/layouts/DashboardLayout";
import MerchantKYCTemplate from '@/templates/merchant/kyc-template/KYCTemplate';
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";

export default function SetupPage(props: { user: TActiveUserSession }) {
  return (
    <DashboardLayout user={props.user}>
      <MerchantKYCTemplate user={props.user} />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = (await __util__clientActiveSession(
    context.req.cookies,
    UserRole.Merchant
  )) as any;
  if (user.redirect) return user;
  return { props: { user } };
}
