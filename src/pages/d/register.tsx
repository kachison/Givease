import RegisterTemplate from "@/templates/donor/RegisterTemplate";
import { Routes } from "@/utils/config/routes.config";
import {
  __util__clientActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { GetServerSidePropsContext } from "next";
import { decode } from "punycode";
import React from "react";

export default function register() {
  return <RegisterTemplate />;
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
