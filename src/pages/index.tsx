import { ImFold02, ImLogo } from "@/assets/images";
import { Routes } from "@/utils/config/routes.config";
import Link from "next/link";
import DonateOne from "../assets/images/donate1.png";
import DonateTwo from "../assets/images/donate2.png";
import OneImage from "../assets/images/one-image.png";

export default function HomePage() {
  const horizontalImages = [""];

  return (
    <main className="bg-bg-primary min-h-dvh py-6 md:py-8">
      <header className="rounded-full bg-white px-5 py-2.5 max-w-screen-2xl border-stone-200 border mx-auto flex items-center justify-between w-[95%]">
        <Link href={Routes.Index}>
          <img src={ImLogo.src} className="h-10" />
        </Link>

        <div className="md:flex items-center gap-2 hidden">
          <Link
            href={Routes.Beneficiary.SignUp}
            className="border-primary border text-xs font-semibold rounded-full py-2 px-4 text-primary"
          >
            I need help
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-xs font-semibold rounded-full py-2 px-4 text-white"
          >
            Become a Donor
          </Link>
        </div>
        <button className="bg-primary text-xs font-semibold rounded-full py-2 px-4 text-white md:hidden">
          Menu
        </button>
      </header>

      <section className="py-10 mt-0 w-11/12 mx-auto">
        <h1 className="text-6xl max-w-2xl text-center leading-tight mx-auto">
          Bridging the gap between Generosity and Need
        </h1>
        <p className="text-xl max-w-2xl text-center mx-auto mt-6 text-stone-600 leading-normal">
          Transform lives with the simple act of giving. Through GiveEase, your
          support provides essential items like food and toiletries to families
          in need. Join a community where compassion connects with real impact.
        </p>

        <div className="md:flex items-center gap-2 hidden max-w-max mx-auto mt-10">
          <Link
            href={Routes.Beneficiary.SignUp}
            className="border-stone-400 border text-xs font-semibold rounded-full py-2.5 px-6 text-stone-700"
          >
            Request Support
          </Link>
          <Link
            href="/signup"
            className="bg-primary text-xs font-semibold rounded-full py-2.5 px-6 text-white"
          >
            Sign Up to Give
          </Link>
        </div>
      </section>

      <img
        src={OneImage.src}
        alt=""
        className=" max-h-[500px] w-full object-cover object-top"
      />

      <div className="relative ">
        <img
          src={ImFold02.src}
          alt=""
          className="w-full min-h-[600px] max-h-[900px] object-cover"
        />

        <div className="absolute bottom-0 mb-20 px-6 flex flex-col items-center gap-4 text-white lg:w-3/4 lg:items-start">
          <p className="text-[30px] font-semibold lg:text-[28px]">What we do</p>

          <p className="text-[20px] text-center lg:text-start lg:text-[32px]">
            At Givease, we’re creating connections to help meet daily needs and
            fight hunger through simple, accessible giving. Our platform
            empowers donors to directly support recipients with essential items,
            building a community of empathy and care. Join us in building a
            world where generosity knows no limits.
          </p>

          <Link
            href="/signup"
            className="w-full flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 lg:w-40 "
          >
            Signup to Give
          </Link>
        </div>
      </div>

      <section className="bg-black pt-24  pb-10 text-white">
        <div className="max-w-screen-2xl mx-auto w-11/12">
          <div>
            <span className="text-xl font-semibold text-white">
              How it works
            </span>
            <h2 className="text-3xl max-w-4xl leading-snug mt-4 font-light">
              GiveEase simplifies giving and receiving assistance. Whether you
              want to donate or request assistance, our process ensures
              transparency, security, and real-time tangible impact.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 mt-10 text-black gap-4 w-full">
            <div className="grid gap-4 col-span-2">
              <div className="bg-[#EBFCCF] rounded-xl p-8 w-full">
                <p className="text-2xl">Sign Up & Choose a Role</p>

                <div className="flex flex-col gap-2 mt-4 w-full leading-normal	lg:items-end">
                  <p className=" text-lg leading-6 text-stone-700">
                    Whether you're here to give or receive, start by creating an
                    account. Donors can browse recipients, while recipients can
                    submit requests for aid.
                  </p>

                  <Link
                    href="/signup"
                    className="flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 w-40 text-white font-medium"
                  >
                    Signup to Give
                  </Link>
                </div>
              </div>
              <div className="bg-white rounded-xl p-8">
                <p className="text-2xl">Select & Support a Recipient</p>

                <div className="flex flex-col gap-2  mt-4 w-full lg:items-end">
                  <p className=" text-lg leading-6 text-stone-700">
                    Donors browse requests and select the individual or family
                    they wish to support. Each request outlines essential items
                    like food and toiletries, ensuring donations directly meet
                    immediate needs.
                  </p>

                  <Link
                    href="/signup"
                    className="flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 w-40 text-white font-medium"
                  >
                    Signup to Give
                  </Link>
                </div>
              </div>
            </div>
            <div className="bg-[#F9DCC4] p-8 rounded-xl flex flex-col w-full">
              <p className="text-2xl">Donation Process</p>

              <div className="hidden lg:flex w-full gap-2 mt-6">
                <div className="flex flex-col gap-2 items-end border-2 border-black rounded-lg p-4 bg-white">
                  <img src={DonateOne.src} alt="" className="w-full" />
                  <p className="w-full text-xs text-[#679E0E]">Food request</p>
                  <div className="w-full flex flex-col gap-1">
                    <p className=" font-semibold">Anita Olajumoke</p>
                    <p className="text-xs ">
                      I really hope to have this so i and my family can eat well
                    </p>
                  </div>

                  <Link
                    href="/signup"
                    className="flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 w-20 text-white font-medium text-xs"
                  >
                    Donate
                  </Link>
                </div>

                <div className="flex flex-col gap-2 items-end border-2 border-black rounded-lg p-4 bg-white">
                  <img src={DonateTwo.src} alt="" className="w-full" />
                  <p className="w-full text-xs text-[#679E0E]">Food request</p>
                  <div className="w-full flex flex-col gap-1">
                    <p className=" font-semibold">Bayo Ogundepo</p>
                    <p className="text-xs ">
                      I really hope to have this so i and my family can eat well
                    </p>
                  </div>

                  <Link
                    href="/signup"
                    className="flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 w-20 text-white font-medium text-xs"
                  >
                    Donate
                  </Link>
                </div>
              </div>

              <p className="max-w-lg text-lg leading-6 text-stone-700 mt-4">
                GiveEase partners with trusted retailers to bundle items. Once
                selected, your donation is processed and sent directly to the
                recipient.
              </p>

              <Link
                href="/signup"
                className="flex items-center justify-center bg-[#FB8B24] rounded-[21.65px] py-2 px-4 mt-4 w-40 text-white font-medium lg:hidden"
              >
                Signup to Give
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="w-11/12 mx-auto max-w-screen-2xl pt-28">
          <h1 className="text-7xl sm:text-8xl font-light">
            Let's give back to our community
          </h1>
          <Link
            href={Routes.Merchant.SignUp}
            className="bg-primary block max-w-max font-semibold rounded-full py-3 px-6 text-white mt-8"
          >
            Become a merchant
          </Link>

          <div className="flex items-center justify-between mt-28">
            <Link href={Routes.Index}>
              <img src={ImLogo.src} className="h-10" />
            </Link>

            <div>
              Follow us: <Link href={Routes.Index}>Instagram</Link> |{" "}
              <Link href={Routes.Index}>Facebook</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
