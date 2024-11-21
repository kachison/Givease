import { enqueueSnackbar } from "notistack";
import { HttpServiceResolverError } from "../../http/http.service";

type SWRFetcherOptions = Partial<{
  emitError: boolean;
}>;

export function SWRFetcher<
  T extends () => Promise<{
    data: Awaited<ReturnType<T>>["data"];
    error: HttpServiceResolverError | null;
  }>
>(httpFunction: T, options?: SWRFetcherOptions) {
  return async () => {
    const { data, error } = await httpFunction();

    if (error) {
      if (options?.emitError) {
        enqueueSnackbar({ message: error.message, variant: "error" });
      }
      throw error;
    }
    return data;
  };
}
