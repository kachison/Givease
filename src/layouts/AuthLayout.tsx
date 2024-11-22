import { ImLogoWhite } from "@/assets/images";
import { Routes } from "@/utils/config/routes.config";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import AuthImage from "../assets/images/donate3.png"; // Ensure this path is correct

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout(props: AuthLayoutProps) {
  return (
    <section className="grid sm:grid-cols-2 2xl:grid-cols-3 h-screen overflow-hidden">
      <aside className="relative h-full 2xl:col-span-2 hidden sm:block">
        {/* Image Container */}
        <div className="relative w-full h-full">
          <Image
            src={AuthImage}
            alt="Auth background"
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            priority
          />
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        </div>
        <div className="absolute top-10 left-10">
          <Link href={Routes.Index}>
            <img src={ImLogoWhite.src} className="h-10 fill-white" />
          </Link>
        </div>
        {/* Text Content */}
        <p className="absolute bottom-0 left-0 right-0 mx-auto w-11/12 py-12 text-white text-2xl lg:text-3xl leading-normal lg:leading-normal bg-gradient-to-t from-black/60 to-transparent">
          At Givease, we bridge the gap between those in need and generous
          donors who want to make a difference. Our platform is designed to
          provide essential items, such as food packages, to individuals who may
          be facing financial difficulties.
        </p>
      </aside>
      {/* Main Content */}
      <main className="flex items-center justify-center h-full bg-white w-full">
        {props.children}
      </main>
    </section>
  );
}
