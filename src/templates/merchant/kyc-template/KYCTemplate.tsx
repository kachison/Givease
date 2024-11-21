import { TextInput } from "@/components/inputs/text-input/TextInput";
import ProfileService from "@/http/Profile.service";
import { Routes } from "@/utils/config/routes.config";
import { TActiveUserSession } from "@/utils/helpers/session.helper";
import { useForm } from "@/utils/hooks/useForm.hook";
import { IdentifierType } from "@prisma/client";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";

type KYCTemplateProps = {
  user: TActiveUserSession;
};

function useMerchantKYCTemplate(props: KYCTemplateProps) {
  const router = useRouter();

  const form = useForm({
    initialFormData: {
      address: "",
    },

    async onSubmit(formData) {
      const { data, error } = await ProfileService.UpdateMerchantProfile(
        formData as any
      );

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        router.push(Routes.Merchant.Store);
      }
    },
  });

  useEffect(() => {
    form.setFields({
      address: props.user?.merchant?.address || "",
    });
  }, [props.user]);

  return { form };
}

export default function MerchantKYCTemplate(props: KYCTemplateProps) {
  const h = useMerchantKYCTemplate(props);

  return (
    <section className="px-5 pt-5 pb-10">
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
            value={`${props.user?.merchant?.firstName} ${props.user?.merchant?.lastName}`}
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
                name="phoneNumber"
                placeholder="Enter your phone number"
                onChange={() => null}
                readOnly={!!props.user?.merchant?.phoneNumber}
                disabled={!!props.user?.merchant?.phoneNumber}
                value={h.form.formData.phoneNumber}
                validation={h.form.validationSchema?.phoneNumber}
                validationTrigger={h.form.validationError}
              /> */}
            </>
          )}

          <TextInput
            label="Business Name"
            placeholder="Enter your business name"
            name="businessName"
            value={props.user?.merchant?.businessName ?? ""}
            onChange={() => null}
            readOnly
            disabled
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

          <div className="flex justify-between items-center col-span-2">
            <button className="text-sm font-medium text-white bg-primary rounded-full py-2 px-6 block ml-auto">
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
