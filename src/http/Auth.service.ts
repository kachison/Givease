import { CreateMerchantDto } from "@/pages/api/auth/create-merchant";
import { GivEaseHttpService } from "./http.service";
import { CreateBeneficiaryDto } from "@/pages/api/auth/create-beneficiary";
import {
  CreateSessionDto,
  getUserRecord,
} from "@/pages/api/auth/create-session";
import { Beneficiary, Donor, Merchant, User } from "@prisma/client";
import { CreateDonorDto } from "@/pages/api/auth/create-donor";

class AuthService extends GivEaseHttpService {
  constructor() {
    super({ baseURL: "/auth" });
  }

  async CreateMerchant(dto: CreateMerchantDto) {
    return await this.SendRequest({
      method: "post",
      path: "/create-merchant",
      body: dto,
    });
  }

  async CreateBeneficiary(dto: CreateBeneficiaryDto) {
    return await this.SendRequest({
      method: "post",
      path: "/create-beneficiary",
      body: dto,
    });
  }

  async CreateDonor(dto: CreateDonorDto) {
    return await this.SendRequest({
      method: "post",
      path: "/create-donor",
      body: dto,
    });
  }

  async CreateSession(dto: CreateSessionDto) {
    return await this.SendRequest<Awaited<ReturnType<typeof getUserRecord>>>({
      method: "post",
      path: "/create-session",
      body: dto,
    });
  }

  async GetSession() {
    return await this.SendRequest<
      User & { beneficiary?: Beneficiary; merchant?: Merchant; donor: Donor }
    >({
      method: "get",
      path: "/get-session",
    });
  }

  async DeleteSession() {
    return await this.SendRequest<
      User & { beneficiary?: Beneficiary; merchant?: Merchant; donor: Donor }
    >({
      method: "post",
      path: "/delete-session",
    });
  }
}

export default new AuthService();
