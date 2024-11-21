import BannerUploadView from "@/components/inputs/file-input/views/BannerUploadView";
import TextAreaInput from "@/components/inputs/text-area-input/TextAreaInput";
import { TextInput } from "@/components/inputs/text-input/TextInput";
import ProductsService from "@/http/Products.service";
import { useForm } from "@/utils/hooks/useForm.hook";
import useMultiInputManager from "@/utils/hooks/useMultiInputManager";
import { Icon } from "@iconify/react/dist/iconify.js";
import { enqueueSnackbar } from "notistack";
import { useEffect } from "react";
import { mutate } from "swr";

type CreateProductTemplateProps = {
  onCreateSuccess: VoidFunction;
};

export function useCreateProductTemplate(props: CreateProductTemplateProps) {
  const fileManager = useMultiInputManager({
    initialValue: {
      id: "",
      url: "",
    },
  });

  const form = useForm({
    initialFormData: { description: "", name: "", price: "",address:"" },

    async onSubmit(formData) {
      const { data, error } = await ProductsService.CreateMerchantProduct({
        ...formData,
        price: parseFloat(formData.price),
        images: fileManager.values,
      });

      enqueueSnackbar({
        message: data?.message || error?.message,
        variant: data ? "success" : "error",
      });

      if (data) {
        mutate("ProductsService.ListMerchantProducts");
        props.onCreateSuccess();
      }
    },
  });

  useEffect(() => {
    if (fileManager.values.length === 0) {
      fileManager.add();
    }
  }, [fileManager.values.length]);

  return { fileManager, form };
}

export default function CreateProductTemplate(
  props: CreateProductTemplateProps
) {
  const h = useCreateProductTemplate(props);

  return (
    <section className="fixed top-0 left-0 w-full h-dvh flex bg-black z-10 bg-opacity-25">
      <form
        onSubmit={h.form.handleSubmit}
        className="max-w-2xl m-auto w-11/12 bg-white p-8 rounded-xl shadow-2xl"
      >
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h5 className="text-2xl">Add New Product</h5>
            <p className="text-sm font-light text-stone-500">
              Provide relevant information about this product.
            </p>
          </div>

          <button
            className="size-8 flex border rounded-lg border-stone-200 text-stone-400"
            onClick={props.onCreateSuccess}
          >
            <Icon icon={"ic:round-close"} className="size-6 m-auto" />
          </button>
        </header>

        <div className="grid gap-5">
          <TextInput
            label="Product Name"
            placeholder="Enter the name of the product or package"
            name={h.form.fieldNames.name}
            onChange={h.form.handleChange}
            value={h.form.formData.name}
          />

          <TextInput
            label="Price"
            placeholder="0.00"
            type="number"
            step={0.01}
            iconLeft={<span className="pl-2 -mr-2 text-stone-500">NGN</span>}
            name={h.form.fieldNames.price}
            onChange={h.form.handleChange}
            value={h.form.formData.price}
          />

          <div>
            <p className="text-xs text-stone-500">Product Image</p>
            {h.fileManager.values.map((file, index) => (
              <div key={index} className="flex items-end gap-2">
                <BannerUploadView
                  preview
                  label
                  name={`product_image[${index}]`}
                  placeholder="Click to select an image"
                  accept="image/*"
                  onChange={(_, sourcePayload) => {
                    h.fileManager.update(index, {
                      field: "id",
                      value: sourcePayload.asset_id,
                    });
                    h.fileManager.update(index, {
                      field: "url",
                      value: sourcePayload.secure_url,
                    });
                  }}
                  value={file.url}
                />

                {(h.fileManager.values.length > 1 || file.url) && (
                  <button
                    className="flex size-10 border rounded-lg"
                    onClick={() => h.fileManager.remove(index)} // TODO: Create endpoint to delete image
                  >
                    <Icon
                      icon={"fluent:delete-12-filled"}
                      className="m-auto text-stone-400 hover:text-red-500"
                      width={20}
                    />
                  </button>
                )}
              </div>
            ))}
            {/* <button
              className="rounded-lg text-[10px] border-stone-300 text-stone-400 bg-stone-50 border-dashed border font-medium px-1.5 py-1 duration-200 w-full flex items-center justify-center gap-1 mt-1.5"
              onClick={h.fileManager.add}
              type="button"
            >
              <Icon icon={"akar-icons:plus"} width={14} />
              Add a new image
            </button> */}
          </div>

          <TextInput
            label="Pickup Address"
            placeholder="Enter the location where this product can be picked up."
            name={h.form.fieldNames.address}
            onChange={h.form.handleChange}
            value={h.form.formData.address}
          />

          <TextAreaInput
            label="Description"
            placeholder="Enter a description of this product"
            name={h.form.fieldNames.description}
            onChange={h.form.handleChange}
            value={h.form.formData.description}
          />

          <button className="rounded-xl text-sm font-medium bg-primary px-2.5 py-2.5 w-full duration-200 text-white">
            Add to store
          </button>
        </div>
      </form>
    </section>
  );
}
