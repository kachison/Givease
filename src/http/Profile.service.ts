import {
  FindBeneficiaryDto,
  getBeneficiaryRecord,
} from "@/pages/api/profile/find-beneficiary";
import {
  UpdateBeneficiaryDto,
  updateBeneficiaryProfile,
} from "@/pages/api/profile/update-beneficiary";
import { UpdateMerchantDto, updateMerchantProfile } from '@/pages/api/profile/update-merchant';
import { GivEaseHttpService } from "./http.service";

class ProfileService extends GivEaseHttpService {
  constructor() {
    super({ baseURL: "/profile" });
  }

  async UpdateBeneficiaryProfile(dto: UpdateBeneficiaryDto) {
    return await this.SendRequest<
      Awaited<ReturnType<typeof updateBeneficiaryProfile>>
    >({
      method: "post",
      path: "/update-beneficiary",
      body: dto,
    });
  }

  async UpdateMerchantProfile(dto: UpdateMerchantDto) {
    return await this.SendRequest<
      Awaited<ReturnType<typeof updateMerchantProfile>>
    >({
      method: "post",
      path: "/update-merchant",
      body: dto,
    });
  }

  async FindBeneficiaryProfile(dto: FindBeneficiaryDto) {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getBeneficiaryRecord>>
    >({
      method: "get",
      path: "/find-beneficiary",
      query: dto,
    });
  }
}

export default new ProfileService();
