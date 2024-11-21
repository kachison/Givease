import { ApproveProductRequestDto } from "@/pages/api/products/approve-product-request";
import { GivEaseHttpService } from "./http.service";
import { CreateProductDto } from "@/pages/api/products/create-product";
import { CreateRequestDto } from "@/pages/api/products/create-request";
import {
  FindBeneficiaryProductDto,
  getBeneficiaryProductRecord,
} from "@/pages/api/products/find-beneficiary-product";
import {
  FindDonorProductDto,
  getDonorProductRecord,
} from "@/pages/api/products/find-donor-product";
import { getDonorContributions } from "@/pages/api/products/list-donor-contributions";
import { getDonorProductsRecord } from "@/pages/api/products/list-donor-products";
import { getMerchantProductsRecord } from "@/pages/api/products/list-merchant-products";
import { getMerchantProductRequests } from "@/pages/api/products/list-merchant-requests";
import { PurchaseProductDto } from "@/pages/api/products/purchase-product";
import { TransactionInitialized } from "paystack-sdk/dist/transaction/interface";

class ProductsService extends GivEaseHttpService {
  constructor() {
    super({ baseURL: "/products" });
  }

  async CreateMerchantProduct(dto: CreateProductDto) {
    return await this.SendRequest({
      method: "post",
      path: "/create-product",
      body: dto,
    });
  }

  async ListMerchantProducts() {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getMerchantProductsRecord>>
    >({
      method: "get",
      path: "/list-merchant-products",
    });
  }

  async FindBeneficiaryProduct(dto: FindBeneficiaryProductDto) {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getBeneficiaryProductRecord>>
    >({
      method: "get",
      path: "/find-beneficiary-product",
      query: dto,
    });
  }

  async FindDonorProduct(dto: FindDonorProductDto) {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getDonorProductRecord>>
    >({
      method: "get",
      path: "/find-donor-product",
      query: dto,
    });
  }

  async CreateProductRequest(dto: CreateRequestDto) {
    return await this.SendRequest({
      method: "post",
      path: "/create-request",
      body: dto,
    });
  }

  async ListMerchantRequests() {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getMerchantProductRequests>>
    >({
      method: "get",
      path: "/list-merchant-requests",
    });
  }

  async ListDonorProducts() {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getDonorProductsRecord>>
    >({
      method: "get",
      path: "/list-donor-products",
    });
  }

  async ListDonorContributions() {
    return await this.SendRequest<
      Awaited<ReturnType<typeof getDonorContributions>>
    >({
      method: "get",
      path: "/list-donor-contributions",
    });
  }

  async PurchaseProduct(dto: PurchaseProductDto) {
    return await this.SendRequest<TransactionInitialized>({
      method: "post",
      path: "/purchase-product",
      body: dto,
    });
  }

  async ApproveProductRequest(dto: ApproveProductRequestDto) {
    return await this.SendRequest({
      method: "post",
      path: "/approve-product-request",
      body: dto,
    });
  }
}

export default new ProductsService();
