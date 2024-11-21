import { ImAuthBg } from "@/assets/images";
import Image from "next/image";
import React, { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <section className="items-start grid sm:grid-cols-2 2xl:grid-cols-3">
      <aside className="sticky top-0 2xl:col-span-2 hidden sm:block">
        <Image src={ImAuthBg} alt="" className="h-dvh object-cover w-full" />
        <p className="text-2xl lg:text-3xl text-white absolute bottom-0 left-0 right-0 mx-auto w-11/12 py-24 leading-normal lg:leading-normal">
          At Givease, we bridge the gap between those in need and generous
          donors who want to make a difference. Our platform is designed to
          provide essential items, such as food packages, to individuals who may
          be facing financial difficulties.
        </p>
      </aside>
      {props.children}
    </section>
  );
}
