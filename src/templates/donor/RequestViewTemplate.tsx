import ProductsService from "@/http/Products.service";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import useSWR from "swr";

export default function RequestViewTemplate() {
  const router = useRouter();

  const productData = useSWR(
    "ProductsService.FindDonorProduct",
    SWRFetcher(() =>
      ProductsService.FindDonorProduct({
        productId: router.query.productId?.toString()!,
      })
    )
  );

  async function handlePurchaseProduct(requestId: string) {
    const { data, error } = await ProductsService.PurchaseProduct({
      requestId,
    });

    enqueueSnackbar({
      message: data?.message || error?.message,
      variant: data ? "success" : "error",
    });

    if (data) {
      setTimeout(() => {
        router.push(data.data.data.authorization_url);
      }, 2000);
    }
  }

  return (
    <section className="grid lg:grid-cols-2 xl:flex items-start py-6 gap-6 px-5">
      <section className="bg-white rounded-xl p-6 border border-stone-200 w-full xl:max-w-[500px]">
        <div className="mb-8">
          <img
            src={
              "https://images.unsplash.com/photo-1615915468538-0fbd857888ca?q=80&w=3336&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt={productData.data?.data?.merchant.businessName}
            className="size-16 rounded-full object-cover"
          />

          <h4 className="text-2xl mt-2.5 font-medium">
            {productData.data?.data?.merchant.businessName}
          </h4>

          <span className="flex items-center text-sm text-stone-500 gap-1">
            <Icon icon={"proicons:location"} width={16} />
            {productData?.data?.data?.pickupAddress ??
              productData?.data?.data?.merchant?.address}
          </span>
        </div>

        <img
          src={productData.data?.data?.images[0].remoteLink}
          alt=""
          className="object-cover rounded-xl h-[200px] w-full mb-4"
        />

        <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Name of Package
          </span>
          <p className="text-lg font-medium text-stone-600 tracking-tight">
            {productData.data?.data?.name}
          </p>
        </div>
        <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Price
          </span>
          <p className="text-lg font-semibold text-stone-700">
            &#x20A6;{productData.data?.data?.price.toLocaleString()}
          </p>
        </div>

        <div className="mb-4">
          <span className="text-sm text-stone-400 font-medium block -mb-1">
            Details
          </span>
          <p className="text-sm text-stone-700">
            <LexicalComposer
              initialConfig={{
                editable: false,
                onError: (error) => console.log(error),
                editorState: productData.data?.data?.details,
                namespace: productData.data?.data?.id!,
              }}
            >
              <PlainTextPlugin
                contentEditable={
                  <ContentEditable className="text-sm bg-white" />
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalComposer>
          </p>
        </div>
      </section>

      <section className="w-full ">
        <h5 className="text-lg font-light mb-4">
          Open Requests ({productData.data?.data?.requests.length}){" "}
        </h5>
        <div className="grid gap-4">
          {productData.data?.data?.requests.map((request) => (
            <div
              key={request.id}
              className="bg-white p-4 border border-stone-200 rounded-lg flex gap-4"
            >
              <div>
                <img
                  src={request.benficiary.passport!}
                  className="size-28 rounded-lg object-cover aspect-square"
                />

                <div className="grid gap-1 mt-2 w-max">
                  <button className="text-xs font-semibold text-stone-500 border border-stone-300 rounded-full py-1 px-4 block w-max">
                    View full profile
                  </button>
                  <p className="text-sm">
                    <span>
                      Acc Name: Zatae Foodmart and Service Hub
                      <span className="block">
                        Acc No: <b>5600722326</b>
                      </span>
                    </span>
                    <span className="block">Bank: Fidelity Bank</span>
                  </p>
                  {/* <button
                    className="text-xs font-semibold text-primary bg-white border-primary border rounded-full py-1 px-4 w-full block"
                    onClick={() => handlePurchaseProduct(request.id)}
                  >
                    Pay now
                  </button> */}
                </div>
              </div>

              <div className="flex items-start w-full">
                <div className="w-full flex flex-col self-stretch">
                  <div className="border-b border-stone-100 flex justify-between pr-4 pb-4">
                    <div>
                      <span className="text-sm text-stone-400">Request ID</span>
                      <p className="font-medium"> PKG{request.requestId}</p>
                    </div>
                    <div>
                      <span className="text-sm text-stone-400">
                        Name of Beneficiary
                      </span>
                      <p>
                        {request.benficiary.firstName}{" "}
                        {request.benficiary.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-stone-400">Occupation</span>
                      <p className="text-sm">{request.benficiary.occupation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-stone-400">
                        Time Requested
                      </span>
                      <p className="text-sm">
                        {dayjs(request.createdAt).format(
                          "MMM DD, YYYY [at] HH:mm a"
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-2.5">
                    <span className="text-sm text-stone-400">
                      Reason for request
                    </span>

                    {request.details ? (
                      <LexicalComposer
                        initialConfig={{
                          editable: false,
                          onError: (error) => console.log(error),
                          editorState: request.details,
                          namespace: request.id,
                        }}
                      >
                        <PlainTextPlugin
                          contentEditable={
                            <ContentEditable className="text-sm bg-white" />
                          }
                          ErrorBoundary={LexicalErrorBoundary}
                        />
                      </LexicalComposer>
                    ) : (
                      <p className="text-sm">{request.title}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
