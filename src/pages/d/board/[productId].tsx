import DashboardLayout from "@/layouts/DashboardLayout";
import RequestViewTemplate from "@/templates/donor/RequestViewTemplate";
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import React from "react";

export default function DonorProductRequestPage(props: {
  user: TActiveUserSession;
}) {
  return (
    <DashboardLayout user={props.user}>
      <RequestViewTemplate />
    </DashboardLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = (await __util__clientActiveSession(
    context.req.cookies,
    UserRole.Donor
  )) as any;
  if (user.redirect) return user;
  return { props: { user } };
}
