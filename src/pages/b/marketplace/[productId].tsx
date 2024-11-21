import DashboardLayout from "@/layouts/DashboardLayout";
import ProductRequestTemplate from "@/templates/beneficiary/product-request-template/ProductRequestTemplate";
import {
  __util__clientActiveSession,
  TActiveUserSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import React from "react";

export default function ProductView(props: {
  user: Required<TActiveUserSession>;
}) {
  return (
    <DashboardLayout user={props.user}>
      <ProductRequestTemplate />
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
