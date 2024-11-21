import { Paystack } from "paystack-sdk";
import { Environment } from "./environment.config";

export const paystack = new Paystack(Environment.PaystackSecretKey);
