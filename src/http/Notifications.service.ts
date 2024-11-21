import { getMerchantNotifications } from "@/pages/api/notifications/list-merchant-notifications";
import { GivEaseHttpService } from "./http.service";

class NotificationService extends GivEaseHttpService {
  constructor() {
    super({
      baseURL: "/notifications",
    });
  }

  async ListMerchantNotifications() {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getMerchantNotifications>>
    >({
      method: "get",
      path: "/list-merchant-notifications",
    });
  }
}

export default new NotificationService();
