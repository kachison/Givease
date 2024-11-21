import ProductsService from "@/http/Products.service";
import BeneficiaryProfile from "@/templates/donor/chunks/BeneficiaryProfile";
import { ProductRequestStatus } from "@/utils/helpers/enum.helpers";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import dayjs from "dayjs";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";
import useSWR from "swr";

export default function ProductRequestsTemplate() {
  const [profileInView, setProfileInView] = useState("");
  const merchantRequests = useSWR(
    "ProductsService.ListMerchantRequests",
    SWRFetcher(() => ProductsService.ListMerchantRequests())
  );

  async function handleActionApproveRequest(requestId: string) {
    const { data, error } = await ProductsService.ApproveProductRequest({
      requestId,
    });

    enqueueSnackbar({
      message: data?.message || error?.message,
      variant: data ? "success" : "error",
    });
  }

  return (
    <section className="px-5 mt-4 pb-16">
      <div className="flex justify-between gap-10 items-center mb-4">
        <h5 className="text-xl font-light"> Beneficiary Requests </h5>
      </div>

      <div className="grid gap-4">
        {merchantRequests.data?.data.map((request) => (
          <div
            key={request.id}
            className="bg-white p-4 border border-stone-200 rounded-lg flex gap-4"
          >
            <div className="w-max">
              <img
                src={request.product.images[0].remoteLink}
                className="size-28 rounded-lg object-cover aspect-square"
              />

              <div className="grid gap-1 mt-2">
                <button
                  className="text-xs font-semibold text-stone-500 border border-stone-300 rounded-full py-1 px-4 block w-full"
                  onClick={() => setProfileInView(request.beneficiaryId)}
                >
                  View Profile
                </button>
                {request.status === ProductRequestStatus.AwaitingPickup && (
                  <button
                    className="text-xs font-semibold text-primary bg-white border-primary border rounded-full py-1 px-4 w-full block"
                    onClick={() => handleActionApproveRequest(request.id)}
                  >
                    Mark as claimed
                  </button>
                )}
              </div>
            </div>

            <div className="w-full flex flex-col self-stretch">
              <div className="border-b border-stone-100 flex justify-between pr-4 pb-4">
                <div>
                  <span className="text-sm text-stone-400">Request ID</span>
                  <p className="font-medium"> PKG{request.requestId}</p>
                </div>
                <div>
                  <span className="text-sm text-stone-400">
                    Name of package
                  </span>
                  <p>{request.product.name}</p>
                </div>
                <div>
                  <span className="text-sm text-stone-400">Price</span>
                  <p className="text-sm">
                    &#x20A6;{request.product.price.toLocaleString()}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-stone-400">Time Requested</span>
                  <p className="text-sm">
                    {dayjs(request.createdAt).format(
                      "MMM DD, YYYY [at] HH:mm a"
                    )}
                  </p>
                </div>
              </div>

              <div
                className={`p-2 rounded-lg  text-sm font-medium flex items-center gap-2 mt-3 ${
                  request.status === ProductRequestStatus.Claimed
                    ? "text-green-600 bg-green-100"
                    : "text-primary bg-bg-primary"
                }`}
              >
                <Icon icon={"formkit:info"} width={16} />
                {request.status}
              </div>
            </div>
          </div>
        ))}
      </div>

      {profileInView && (
        <BeneficiaryProfile
          beneficiaryId={profileInView}
          onClose={() => setProfileInView("")}
        />
      )}
    </section>
  );
}
