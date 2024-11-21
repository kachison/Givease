import DashboardLayout from "@/layouts/DashboardLayout";
import KYCTemplate from "@/templates/beneficiary/kyc-template/KYCTemplate";
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import React from "react";

export default function SetupPage(props: { user: TActiveUserSession }) {
  return (
    <DashboardLayout user={props.user}>
      <KYCTemplate user={props.user} />
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
