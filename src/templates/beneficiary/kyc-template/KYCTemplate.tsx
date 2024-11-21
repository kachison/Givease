import BannerUploadView from "@/components/inputs/file-input/views/BannerUploadView";
import SelectInput from "@/components/inputs/select-input/SelectInput";
import TextAreaInput from "@/components/inputs/text-area-input/TextAreaInput";
import { TextInput } from "@/components/inputs/text-input/TextInput";
import ProfileService from "@/http/Profile.service";
import { Routes } from "@/utils/config/routes.config";
import { TActiveUserSession } from "@/utils/helpers/session.helper";
import { useForm } from "@/utils/hooks/useForm.hook";
import { useTab } from "@/utils/hooks/useTab";
import { ListItem } from "@/utils/types/index.types";
import { IdentifierType } from "@prisma/client";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

type KYCTemplateProps = {
  user: TActiveUserSession;
};

function useKYCTemplate(props: KYCTemplateProps) {
  const router = useRouter();
  const kycSteps = useTab([
    { id: "1", name: "Personal Details" },
    { id: "2", name: "Identity" },
    { id: "3", name: "Review & Submit" },
  ]);

  const educationLevels: ListItem[] = [
    { id: "Secondary Education", name: "Secondary Education" },
    { id: "Tertiary Education", name: "Tertiary Education" },
    { id: "Primary Education", name: "Primary Education" },
  ];

  const sourceOptions: ListItem[] = [
    { id: "Whatsapp", name: "Whatsapp" },
    { id: "Facebook", name: "Facebook" },
    { id: "Twitter", name: "Twitter" },
  ];

  const form = useForm({
    initialFormData: {
      phoneNumber: "",
      address: "",
      bio: "",
      gender: "",
      occupation: "",
      educationLevel: "",
      passport: "",
      source: "",
      kidStatus: "",
      numberOfKids: "",
      identificationNumber: "",
    },

    async onSubmit(formData) {
      // kycSteps.handleTabChange({
      //   id: (parseInt(kycSteps.activeTab) < kycSteps.tabs.length
      //     ? parseInt(kycSteps.activeTab) + 1
      //     : kycSteps.activeTab
      //   ).toString(),
      //   name: "",
      // });

      const { data, error } = await ProfileService.UpdateBeneficiaryProfile(
        formData as any
      );

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        router.push(Routes.Beneficiary.Marketplace);
      }
    },
  });

  useEffect(() => {
    form.setFields({
      phoneNumber: props.user?.identifier || "",
      address: props.user?.beneficiary?.address || "",
      bio: props.user?.beneficiary?.bio || "",
      occupation: props.user?.beneficiary?.occupation || "",
      educationLevel: props.user?.beneficiary?.educationLevel || "",
      passport: props.user?.beneficiary?.passport || "",
      source: props.user?.beneficiary?.source || "",
    });
  }, [props.user]);

  return { kycSteps, sourceOptions, form, educationLevels };
}

export default function KYCTemplate(props: KYCTemplateProps) {
  const h = useKYCTemplate(props);

  return (
    <section className="px-5 pt-5 pb-10">
      {/* <div className="bg-white border border-stone-200 rounded-lg max-w-screen-2xl px-5 py-3">
        <div className="flex items-center justify-between">
          {h.kycSteps.tabs.map((step) => (
            <div key={step.id} className="flex items-center gap-2.5">
              <span
                className={`flex justify-center items-center size-7 rounded-full text-white font-semibold text-xs ${
                  h.kycSteps.activeTab === step.id
                    ? "bg-primary"
                    : "bg-stone-300"
                }`}
              >
                {step.id}
              </span>
              <p className="text-sm">{step.name}</p>
            </div>
          ))}
        </div>
      </div> */}

      <div className="bg-white border border-stone-200 rounded-lg max-w-screen-2xl px-6 pt-6 pb-10 mt-4">
        <h6 className="text-center font-medium">
          Please fill out the fields that has not been filled yet
        </h6>

        <form
          onSubmit={h.form.handleSubmit}
          className="grid grid-cols-2 gap-6 mt-8"
        >
          <TextInput
            label="Name"
            name="name"
            onChange={() => null}
            readOnly
            disabled
            value={`${props.user?.beneficiary?.firstName} ${props.user?.beneficiary?.lastName}`}
          />

          {props.user?.identifierType === IdentifierType.EMAIL && (
            <>
              <TextInput
                label="Email Address"
                name="email"
                onChange={() => null}
                readOnly
                disabled
                value={props.user?.identifier!}
              />

              {/* <TextInput
                label="Phone Number"
                name={h.form.fieldNames.phoneNumber}
                placeholder="Enter your phone number"
                onChange={h.form.handleChange}
                readOnly={!!props.user?.beneficiary?.phoneNumber}
                disabled={!!props.user?.beneficiary?.phoneNumber}
                value={h.form.formData.phoneNumber}
                validation={h.form.validationSchema?.phoneNumber}
                validationTrigger={h.form.validationError}
              /> */}
            </>
          )}

          {props.user?.identifierType === IdentifierType.PHONE && (
            <TextInput
              label="Phone Number"
              name={h.form.fieldNames.phoneNumber}
              placeholder="Enter your phone number"
              onChange={() => null}
              readOnly={!!props.user?.identifier}
              disabled={!!props.user?.identifier}
              value={h.form.formData.phoneNumber}
              validation={h.form.validationSchema?.phoneNumber}
              validationTrigger={h.form.validationError}
            />
          )}

          <SelectInput
            label="Gender"
            placeholder="Click to select an option"
            options={[
              { id: "male", name: "Male" },
              { id: "female", name: "Female" },
            ]}
            name={h.form.fieldNames.gender}
            value={h.form.formData.gender}
            onChange={h.form.handleChange}
            validation={h.form.validationSchema?.gender}
            validationTrigger={h.form.validationError}
          />

          <TextInput
            label="Address"
            placeholder="Enter your residential address"
            name={h.form.fieldNames.address}
            value={h.form.formData.address}
            onChange={h.form.handleChange}
            validation={h.form.validationSchema?.address}
            validationTrigger={h.form.validationError}
          />

          <SelectInput
            label="Do you have kids?"
            placeholder="Click to select an option"
            options={[
              { id: "y", name: "Yes" },
              { id: "n", name: "No" },
            ]}
            name={h.form.fieldNames.kidStatus}
            value={h.form.formData.kidStatus}
            onChange={h.form.handleChange}
            validation={h.form.validationSchema?.kidStatus}
            validationTrigger={h.form.validationError}
          />

          {h.form.formData.kidStatus === "y" && (
            <TextInput
              label="Number of kids"
              placeholder="2"
              name={h.form.fieldNames.numberOfKids}
              value={h.form.formData.numberOfKids}
              onChange={h.form.handleChange}
              validation={h.form.validationSchema?.numberOfKids}
              validationTrigger={h.form.validationError}
            />
          )}

          <div className="col-span-2">
            <TextAreaInput
              label="Tell us about yourself"
              placeholder="Type here..."
              name={h.form.fieldNames.bio}
              value={h.form.formData.bio}
              onChange={h.form.handleChange}
              validation={h.form.validationSchema?.bio}
              validationTrigger={h.form.validationError}
            />
          </div>

          <TextInput
            label="Occupation"
            placeholder="Enter your occupation"
            name={h.form.fieldNames.occupation}
            value={h.form.formData.occupation}
            onChange={h.form.handleChange}
            validation={h.form.validationSchema?.occupation}
            validationTrigger={h.form.validationError}
          />

          <SelectInput
            label="Education Level"
            placeholder="Click to select an option"
            options={h.educationLevels}
            name={h.form.fieldNames.educationLevel}
            value={h.form.formData.educationLevel}
            onChange={h.form.handleChange}
            validation={h.form.validationSchema?.educationLevel}
            validationTrigger={h.form.validationError}
          />

          <div className="col-span-2">
            <BannerUploadView
              preview
              label="Passport photograph"
              placeholder="Click to select an image"
              accept="image/*"
              name={h.form.fieldNames.passport}
              value={h.form.formData.passport}
              onChange={h.form.handleChange}
              validation={h.form.validationSchema?.passport}
              validationTrigger={h.form.validationError}
            />
          </div>

          <div className="col-span-2">
            <TextInput
              label="National Identification Number (NIN)"
              placeholder="Enter your NIN"
              name={h.form.fieldNames.identificationNumber}
              value={h.form.formData.identificationNumber}
              onChange={h.form.handleChange}
              validation={h.form.validationSchema?.identificationNumber}
              validationTrigger={h.form.validationError}
            />
          </div>

          <div className="col-span-2">
            <SelectInput
              label="How did you hear about us?"
              placeholder="Click to select an option"
              options={h.sourceOptions}
              name={h.form.fieldNames.source}
              value={h.form.formData.source}
              onChange={h.form.handleChange}
              validation={h.form.validationSchema?.source}
              validationTrigger={h.form.validationError}
            />
          </div>

          <div className="flex justify-between items-center col-span-2">
            {/* <button
              className="text-sm font-medium text-white bg-stone-400 rounded-full py-2 px-6 block"
              type="button"
              onClick={() =>
                h.kycSteps.handleTabChange({
                  id: (parseInt(h.kycSteps.activeTab) > 1
                    ? parseInt(h.kycSteps.activeTab) - 1
                    : h.kycSteps.activeTab
                  ).toString(),
                  name: "",
                })
              }
            >
              Previous
            </button> */}
            <button className="text-sm font-medium text-white bg-primary rounded-full py-2 px-6 block ml-auto">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
