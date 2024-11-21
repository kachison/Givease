import ProductsService from "@/http/Products.service";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import CreateProductTemplate from "./chunks/CreateProductTemplate";

function useStoreTemplate() {
  const productsData = useSWR(
    "ProductsService.ListMerchantProducts",
    SWRFetcher(() => ProductsService.ListMerchantProducts())
  );
  const [isActionNewProduct, setIsActionNewProduct] = useState(false);

  function toggleActionNewProduct() {
    setIsActionNewProduct(!isActionNewProduct);
  }

  return { isActionNewProduct, toggleActionNewProduct, productsData };
}

export default function StoreTemplate() {
  const h = useStoreTemplate();
  return (
    <section className="py-4 px-5">
      <div className="flex justify-between gap-10 items-center">
        <h5 className="text-xl font-light"> My Store </h5>
        <button
          className="rounded-full text-xs border-orange-300 border text-orange-500 font-light px-2.5 py-1 hover:bg-orange-300 hover:text-white duration-200 flex items-center gap-1"
          onClick={h.toggleActionNewProduct}
        >
          <Icon icon={"bi:plus"} width={16} />
          New product
        </button>
      </div>

      {h.isActionNewProduct && (
        <CreateProductTemplate onCreateSuccess={h.toggleActionNewProduct} />
      )}

      <div className="grid grid-cols-4 gap-2 mt-6">
        {h.productsData.data?.data.map((product) => (
          <div key={product.id} className="bg-white rounded-xl p-4">
            <img
              src={product.images[0].remoteLink}
              alt={product.name}
              className="rounded-lg h-[200px] w-full object-cover"
            />
            <div className="py-2">
              <span className="text-xs text-stone-400 font-medium">
                {product.merchant.businessName}
              </span>
              <p className="">{product.name}</p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-lg font-semibold">
                    &#x20A6;{product.price.toLocaleString()}
                  </p>
                  <span className="flex items-center text-xs text-stone-500 gap-1">
                    <Icon icon={"proicons:location"} width={14} />
                    {product?.pickupAddress ?? product?.merchant?.address}
                  </span>
                </div>

                <div>
                  <Link
                    href={""}
                    // href={
                    //   !props.user?.beneficiary?.identityVerifiedAt
                    //     ? "#"
                    //     : Routes.Beneficiary.ProductView(product.id)
                    // }
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-full"
                    // onClick={h.handleRequestClick}
                  >
                    Manage Item
                  </Link>

                  <span className="flex items-center text-xs font-medium text-stone-500 gap-1 mt-1">
                    <Icon icon={"formkit:info"} width={14} />
                    {product._count.requests.toLocaleString()} Requests
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
