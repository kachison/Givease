import { ImVerificationWarn } from "@/assets/images";
import ProductsService from "@/http/Products.service";
import { Routes } from "@/utils/config/routes.config";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { TActiveUserSession } from "@/utils/helpers/session.helper";
import { Icon } from "@iconify/react/dist/iconify.js";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

type MarketplaceTemplateProps = {
  user: TActiveUserSession;
};

function useMarketplaceTemplate(props: MarketplaceTemplateProps) {
  const [isVerificationWarning, setIsVerificationWarning] = useState(false);
  const productsData = useSWR(
    "ProductsService.ListMerchantProducts",
    SWRFetcher(() => ProductsService.ListMerchantProducts())
  );

  function handleRequestClick() {
    if (props.user?.beneficiary?.identityVerifiedAt) return;
    setIsVerificationWarning(true);
  }

  return { productsData, isVerificationWarning, handleRequestClick };
}

export default function MarketplaceTemplate(props: MarketplaceTemplateProps) {
  const h = useMarketplaceTemplate(props);
  return (
    <section className="px-5 mt-5 pb-10">
      <div className="flex items-center justify-between w-full flex-wrap gap-4">
        <div className="flex items-center gap-1.5">
          <h5 className="font-semibold">All Stores</h5>
          <Link href={""} className="text-xs text-stone-400">
            {" "}
            | See all{" "}
          </Link>
        </div>

        <div className="text-sm bg-white border border-stone-200 rounded-lg text-stone-600 flex items-center gap-2 px-2.5 w-full sm:max-w-[250px]">
          <Icon icon={"cuida:search-outline"} width={16} />
          <input
            type="search"
            placeholder="Search for vendor"
            className="text-xs placeholder:text-stone-300 py-2.5"
          />
        </div>
      </div>

      {h.productsData.data?.data.length === 0 && (
        <div className="bg-white border border-stone-200 rounded-lg max-w-screen-2xl px-5 py-3 flex mt-6 min-h-[500px]">
          <div className="m-auto">
            <Icon
              icon={"heroicons:shopping-bag-20-solid"}
              width={120}
              className="text-stone-200"
            />
            <p className="text-sm text-stone-500 mt-1">Nothing to see here</p>
          </div>
        </div>
      )}

      <div className="grid xl:grid-cols-4 gap-2 mt-6">
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
                  {/* <p className="text-lg font-semibold">
                    &#x20A6;{product.price.toLocaleString()}
                  </p> */}
                  <span className="flex items-center text-xs text-stone-500 gap-1">
                    <Icon icon={"proicons:location"} width={14} />
                    {product?.pickupAddress ?? product?.merchant?.address}
                  </span>
                </div>

                <div>
                  <Link
                    href={
                      !props.user?.beneficiary?.identityVerifiedAt
                        ? "#"
                        : Routes.Beneficiary.ProductView(product.id)
                    }
                    className="text-xs px-3 py-1.5 bg-primary text-white rounded-full"
                    onClick={h.handleRequestClick}
                  >
                    Make a request
                  </Link>

                  {!props.user?.beneficiary?.identityVerifiedAt && (
                    <span className="flex items-center text-xs font-medium text-red-400 gap-1 mt-1">
                      Package locked
                      <Icon
                        icon={"formkit:info"}
                        width={14}
                        className="text-stone-400"
                      />
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {h.isVerificationWarning && (
        <div className="fixed top-0 left-0 bg-black bg-opacity-25 h-full w-full flex">
          <div className="m-auto bg-white w-11/12 max-w-xl py-10 px-4 rounded-xl">
            <div>
              <img
                src={ImVerificationWarn.src}
                alt=""
                className="size-28 mx-auto"
              />

              <div className="text-center mt-6">
                <h5 className="text-2xl font-semibold text-stone-700">
                  Access Denied
                </h5>

                <p className="text-stone-500 mb-6 max-w-sm mx-auto mt-2">
                  Sorry {props.user?.beneficiary?.firstName}, but you need to
                  complete your KYC Verification to request for an item.
                </p>

                <Link
                  href={Routes.Beneficiary.Setup}
                  className="text-sm font-medium text-white bg-primary rounded-full py-2 px-6 block max-w-max mx-auto"
                >
                  Update Profile
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
