import ProfileService from "@/http/Profile.service";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import React from "react";
import useSWR from "swr";

type BeneficiaryProfileProps = {
  beneficiaryId: string;
  onClose: VoidFunction;
};

function useBeneficiaryProfile(props: BeneficiaryProfileProps) {
  const beneficiaryData = useSWR(
    "ProfileService.FindBeneficiaryProfile" + props.beneficiaryId,
    SWRFetcher(() =>
      ProfileService.FindBeneficiaryProfile({
        beneficiaryId: props.beneficiaryId,
      })
    )
  );

  return { beneficiaryData };
}

export default function BeneficiaryProfile(props: BeneficiaryProfileProps) {
  const h = useBeneficiaryProfile(props);
  return (
    <section className="z-10 bg-black w-full h-dvh bg-opacity-25 flex fixed top-0 left-0">
      <div className="bg-white px-6 py-4 rounded-xl w-11/12 m-auto max-w-screen-md">
        <div className="flex items-center justify-between mb-3">
          <h6 className="text-xs font-medium text-stone-400">
            BENEFICIARY PROFILE
          </h6>
          <button
            className="size-8 flex border rounded-lg border-stone-200 text-stone-400"
            onClick={props.onClose}
          >
            <Icon icon={"ic:round-close"} className="size-6 m-auto" />
          </button>
        </div>
        <div className="flex items-start gap-6">
          <img
            src={h.beneficiaryData.data?.data?.passport!}
            alt=""
            className="rounded-xl size-48 object-cover flex-shrink-0"
          />

          <div className="w-full">
            <div className="mb-4">
              <span className="text-sm text-stone-400 font-medium block -mb-1">
                Name
              </span>
              <h1 className="text-2xl font-medium">
                {h.beneficiaryData.data?.data?.firstName}{" "}
                {h.beneficiaryData.data?.data?.lastName}
              </h1>
            </div>

            <div className="grid grid-cols-2 w-full">
              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  Phone Number
                </span>
                <p className="text text-stone-700">
                  {h.beneficiaryData.data?.data?.user.identifier}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  Gender
                </span>
                <p className="text text-stone-700 capitalize">
                  {h.beneficiaryData.data?.data?.gender}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  Education
                </span>
                <p className="text text-stone-700">
                  {h.beneficiaryData.data?.data?.educationLevel}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  Occupation
                </span>
                <p className="text text-stone-700">
                  {h.beneficiaryData.data?.data?.occupation}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  No. of kids
                </span>
                <p className="text text-stone-700">
                  {h.beneficiaryData.data?.data?.numberOfKids || "None"}
                </p>
              </div>
              <div className="mb-4">
                <span className="text-sm text-stone-400 font-medium block">
                  Address
                </span>
                <p className="text text-stone-700">
                  {h.beneficiaryData.data?.data?.address}
                </p>
              </div>
            </div>
            <div className="mb-4 text-black">
              <span className="text-sm text-stone-400 font-medium block">
                About
              </span>
              {h.beneficiaryData.data?.data?.bio && (
                <LexicalComposer
                  initialConfig={{
                    editable: false,
                    onError: (error) => console.log(error),
                    editorState: h.beneficiaryData.data?.data?.bio,
                    namespace: h.beneficiaryData.data?.data?.id!,
                  }}
                >
                  <PlainTextPlugin
                    contentEditable={
                      <ContentEditable className="text-sm bg-white" />
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                  />
                </LexicalComposer>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
