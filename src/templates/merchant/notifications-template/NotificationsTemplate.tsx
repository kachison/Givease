import { ImBell } from "@/assets/images";
import NotificationsService from "@/http/Notifications.service";
import ProductsService from "@/http/Products.service";
import { Routes } from "@/utils/config/routes.config";
import { NotificationAction } from "@/utils/helpers/enum.helpers";
import { SWRFetcher } from "@/utils/helpers/http.helpers";
import { Icon } from "@iconify/react/dist/iconify.js";
import { MerchantNotification } from "@prisma/client";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import React from "react";
import useSWR from "swr";

export default function NotificationsTemplate() {
  const router = useRouter();
  const notificationsData = useSWR(
    "NotificationsService.ListMerchantNotifications",
    SWRFetcher(() => NotificationsService.ListMerchantNotifications())
  );

  async function handleActionApproveRequest(metaData: string) {
    const { data, error } = await ProductsService.ApproveProductRequest({
      requestId: JSON.parse(metaData).productRequestId,
    });

    enqueueSnackbar({
      message: data?.message || error?.message,
      variant: data ? "success" : "error",
    });
  }

  async function handleNotificationAction(notification: MerchantNotification) {
    if (
      notification.action === NotificationAction.View ||
      notification.action === NotificationAction.Approve
    ) {
      router.push(
        Routes.Merchant.Requests +
          "#" +
          JSON.parse(notification.metadata).productRequestId
      );
    }
  }

  return (
    <section className="max-w-screen-2xl mx-auto px-5 mt-5">
      <div className="flex justify-between gap-10 items-center mb-4">
        <h5 className="text-xl font-light">
          Notifications ({notificationsData.data?.data.length})
        </h5>
      </div>

      <div className="bg-white border-stone-200 border rounded-lg ">
        {notificationsData.data?.data.map((notification) => (
          <div
            key={notification.id}
            className="border-stone-100 border-b py-2 flex justify-between items-center px-5 gap-4 last:border-b-0"
          >
            <img src={ImBell.src} className="size-8" />
            <div className="w-full">
              <p className="font-medium text-sm">{notification.title}</p>
            </div>
            <button
              type="button"
              className="text-xs font-medium text-primary rounded-full flex items-center flex-shrink-0 gap-1"
              onClick={() => handleNotificationAction(notification)}
            >
              {notification.action}
              <Icon icon={"flowbite:angle-right-outline"} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
