import DashboardLayout from "@/layouts/DashboardLayout";
import NotificationsTemplate from "@/templates/merchant/notifications-template/NotificationsTemplate";
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import React from "react";

type MerchantNotificationsPageProps = {
  user: TActiveUserSession;
};

export default function MerchantNotificationsPage(
  props: MerchantNotificationsPageProps
) {
  return (
    <DashboardLayout user={props.user}>
      <NotificationsTemplate />
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
