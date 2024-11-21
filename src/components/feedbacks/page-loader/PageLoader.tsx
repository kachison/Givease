import Loader from "../loader/Loader";
import { PageLoaderProps } from "./PageLoader.types";

export default function PageLoader(props: PageLoaderProps) {
  return (
    <section className="w-full h-screen flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-md fixed top-0 left-0 z-10">
      <div className="flex items-center justify-center flex-col gap-3">
        <Loader />
        <p className="text-accent-3 text-sm">
          {props.message ?? "One moment..."}
        </p>
      </div>
    </section>
  );
}
