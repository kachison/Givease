import SelectInput from "@/components/inputs/select-input/SelectInput";
import TextAreaInput from "@/components/inputs/text-area-input/TextAreaInput";
import ProductsService from "@/http/Products.service";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { useForm } from "@/utils/hooks/useForm.hook";
import { ListItem } from "@/utils/types/index.types";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import useSWR from "swr";
import { z } from "zod";

type ProductRequestTemplateProps = {};

function useProductRequestTemplate() {
  const router = useRouter();

  const supportOptions: ListItem[] = [
    { id: "I need something for christmas", name: "Run me christmas goodies" },
    { id: "other", name: "Others" },
  ];

  const productData = useSWR(
    "ProductsService.FindBeneficiaryProduct",
    SWRFetcher(() =>
      ProductsService.FindBeneficiaryProduct({
        productId: router.query.productId?.toString()!,
      })
    )
  );

  const requestForm = useForm({
    initialFormData: {
      title: "",
      details: "",
    },
    validationSchema: z.object({
      title: z.string().min(1, "Please select an option"),
      details: z.string(),
    }),
    async onSubmit(formData) {
      const { data, error } = await ProductsService.CreateProductRequest({
        ...formData,
        productId: router.query.productId?.toString()!,
      });

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      console.log(formData);
    },
  });

  return { productData, requestForm, supportOptions };
}

export default function ProductRequestTemplate(
  props: ProductRequestTemplateProps
) {
  const h = useProductRequestTemplate();

  return (
    <section className="grid lg:grid-cols-2 xl:flex items-start py-6 gap-6 px-5">
      <section className="bg-white rounded-xl p-6 border border-stone-200 w-full xl:max-w-[500px]">
        <div className="mb-8">
          {/* <img src={h.productData.data?.data?.merchant.businessName} alt="" /> */}
          <img
            src={
              "https://images.unsplash.com/photo-1615915468538-0fbd857888ca?q=80&w=3336&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={h.productData.data?.data?.merchant.businessName}
            className="size-16 rounded-full object-cover"
          />

          <h4 className="text-2xl mt-2.5 font-medium">
            {h.productData.data?.data?.merchant.businessName}
          </h4>

          <span className="flex items-center text-sm text-stone-500 gap-1">
            <Icon icon={"proicons:location"} width={16} />
            {h?.productData?.data?.data?.pickupAddress ?? h?.productData?.data?.data?.merchant?.address}
          </span>
        </div>

        <img
          src={h.productData.data?.data?.images[0].remoteLink}
          alt=""
          className="object-cover rounded-xl h-[200px] w-full mb-4"
        />

        <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Name of Package
          </span>
          <p className="text-lg font-medium text-stone-600 tracking-tight">
            {h.productData.data?.data?.name}
          </p>
        </div>
        {/* <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Price
          </span>
          <p className="text-lg font-semibold text-stone-700">
            &#x20A6;{h.productData.data?.data?.price.toLocaleString()}
          </p>
        </div> */}

        <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Details
          </span>
          <p className="text-sm text-stone-700">
            <LexicalComposer
              initialConfig={{
                editable: false,
                onError: (error) => console.log(error),
                editorState: h.productData.data?.data?.details,
                namespace: h.productData.data?.data?.id!,
              }}
            >
              <PlainTextPlugin
                contentEditable={
                  <ContentEditable className="text-sm bg-white" />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalComposer>
            {/* {h.productData.data?.data?.details} */}
          </p>
        </div>
      </section>

      <section className="bg-white rounded-xl p-8 border border-stone-200 w-full ">
        <form onSubmit={h.requestForm.handleSubmit} className="grid gap-4">
          <h4 className="text-2xl font-semibold">
            To make a request for this package please fill out the form below
          </h4>

          <SelectInput
            label="Why do you need the support?"
            options={h.supportOptions}
            placeholder="Click to select an option"
            name={h.requestForm.fieldNames.title}
            onChange={h.requestForm.handleChange}
            value={h.requestForm.formData.title}
            validation={h.requestForm.validationSchema?.title}
            validationTrigger={h.requestForm.validationError}
          />

          {h.requestForm.formData.title === "other" && (
            <TextAreaInput
              label="Tell us the reason why you need this"
              placeholder="Start typing..."
              name={h.requestForm.fieldNames.details}
              onChange={h.requestForm.handleChange}
              value={h.requestForm.formData.details}
              validation={h.requestForm.validationSchema?.details}
              validationTrigger={h.requestForm.validationError}
            />
          )}

          <button className="text-sm font-medium text-white bg-primary rounded-full py-2 px-6 block ml-auto">
            Request package
          </button>
        </form>
      </section>
    </section>
  );
}
