import DashboardLayout from "@/layouts/DashboardLayout";
import StoreTemplate from "@/templates/merchant/store-template/StoreTemplate";
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import React from "react";

type StorePageProps = {
  user: TActiveUserSession;
};

export default function StorePage(props: StorePageProps) {
  return (
    <DashboardLayout user={props.user}>
      <StoreTemplate />
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
