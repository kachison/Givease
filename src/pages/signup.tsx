import AuthLayout from "@/layouts/AuthLayout";
import { Routes } from "@/utils/config/routes.config";
import {
  __util__clientActiveSession,
  UserRole,
} from "@/utils/helpers/session.helper";
import { ListItem } from "@/utils/types/index.types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { decode } from "jsonwebtoken";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";

export default function SignUpPage() {
  const signInRoutes: ListItem[] = [
    {
      id: Routes.Beneficiary.SignUp,
      icon: "game-icons:receive-money",
      name: "As a Beneficiary",
      description: "Select this option if you want to request for help",
    },
    {
      id: Routes.Donor.SignUp,
      icon: "streamline:blood-donate-drop-solid",
      name: "As a Donor",
      description: "Select this option if you want to sponsor a beneficiary",
    },
    {
      id: Routes.Merchant.SignUp,
      icon: "lets-icons:shop",
      name: "As a Merchant",
      description: "Select this option if you want to provide packages",
    },
  ];
  return (
    <AuthLayout>
      <section className="bg-bg-primary min-h-dvh flex w-full">
        <div className="m-auto w-10/12 max-w-lg h-min">
          <header>
            <h1 className="text-4xl font-semibold">
              How do you want to proceed?
            </h1>
            <p className="text-stone-500 mt-2">
              Select the type of account you want to create.
            </p>
          </header>

          <ul className="grid gap-4 mt-8">
            {signInRoutes.map((role) => (
              <li key={role.id}>
                <Link
                  href={role.id}
                  className="flex gap-4 items-start bg-white border-stone-200 hover:border-primary rounded-lg border py-3 px-5 group"
                >
                  <Icon
                    icon={role.icon?.toString()!}
                    width={24}
                    className="mt-1 text-primary"
                  />
                  <div className="">
                    <h6 className="text-lg font-medium group-hover:text-primary">
                      {" "}
                      {role.name}{" "}
                    </h6>
                    <p className="text-stone-400"> {role.description} </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          <p className="text-stone-600 max-w-max mx-auto mt-10">
            Already have an account?{" "}
            <Link
              href='/signin'
              className="underline text-primary font-medium"
            >
              {" "}
              Sign in here.{" "}
            </Link>
          </p>
        </div>
      </section>
    </AuthLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = (await __util__clientActiveSession(context.req.cookies)) as any;
  const sessionToken = context.req.cookies["session_id"];

  if (user.redirect || !sessionToken) return { props: {} };

  const payload = decode(sessionToken) as unknown as {
    id: string;
    role: UserRole;
  };

  console.log(payload);

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
