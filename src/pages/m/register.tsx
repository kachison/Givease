import SignUpTemplate from "@/templates/merchant/sign-up-template/SignUpTemplate";
import { Routes } from "@/utils/config/routes.config";
import {
  __util__clientActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { decode } from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import React from "react";

export default function MerchantSignUpPage() {
  return <SignUpTemplate />;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = (await __util__clientActiveSession(context.req.cookies)) as any;
  const sessionToken = context.req.cookies["session_id"];

  if (user.redirect || !sessionToken) return { props: {} };

  const payload = decode(sessionToken) as unknown as {
    id: string;
    role: UserRole;
  };

  return {
    redirect: {
      destination:
        payload.role === UserRole.Merchant
          ? Routes.Merchant.Store
          : payload.role === UserRole.Donor
          ? Routes.Donor.Board
          : Routes.Beneficiary.Marketplace,
    },
  };
}
