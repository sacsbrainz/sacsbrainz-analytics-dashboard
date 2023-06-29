import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <ToastContainer />
    </RecoilRoot>
  );
};

export default MyApp;
