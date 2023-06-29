import { type AppType } from "next/dist/shared/lib/utils";
import "@/styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { RecoilRoot } from "recoil";
import { useCallback, useEffect, useState } from "react";
import { env } from "@/env.mjs";
import { useRouter } from "next/router";

declare global {
  interface Window {
    phantom: any;
    _phantom: any;
    __nightmare: any;
    Cypress: any;
  }
}

const MyApp: AppType = ({ Component, pageProps }) => {
  const [analytics, setAnalytics] = useState<{
    [key: string]: [number, number];
  }>({});
  const [date, setDate] = useState(new Date());
  const router = useRouter();

  const onRouteChange = useCallback(() => {
    const url = window.location.pathname;
    const d = new Date();
    const dt = (d.getTime() - date.getTime()) / 1000;
    // eslint-disable-next-line prefer-const
    let [n, t] = analytics[url] || [Object.keys(analytics).length + 1, 0];
    t = Math.round((t + dt) * 100) / 100;
    setAnalytics({ ...analytics, [url]: [n, t] });
    setDate(d);
  }, [analytics, date]);

  const onVisibilityChange = useCallback(() => {
    // Don't send analytics if it's a bot
    if (
      window.phantom ||
      window._phantom ||
      window.__nightmare ||
      window.navigator.webdriver ||
      window.Cypress
    )
      return;

    if (document.visibilityState === "hidden") {
      const url = window.location.pathname;
      const d = new Date();
      const dt = (d.getTime() - date.getTime()) / 1000;
      // eslint-disable-next-line prefer-const
      let [n, t] = analytics[url] || [Object.keys(analytics).length + 1, 0];
      t = Math.round((t + dt) * 100) / 100;
      const option: RequestInit = {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          d: d,
          r: document.referrer || null,
          w: window.innerWidth,
          p: { ...analytics, [url]: [n, t] },
          a: env.NEXT_PUBLIC_APP_ID,
        }),
        keepalive: true,
      };
      fetch(env.NEXT_PUBLIC_ANALYTICS_URL, { ...option })
        .then((response) => response.json())
        .catch((err) => console.log("something went wrong "));
    } else {
      // Reset analytics
      setDate(new Date());
      setAnalytics({ [window.location.pathname]: [1, 0] });
    }
  }, [analytics, date]);

  useEffect(() => {
    document.addEventListener("visibilitychange", onVisibilityChange, {
      passive: true,
    });
    router.events.on("beforeHistoryChange", onRouteChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      router.events.off("beforeHistoryChange", onRouteChange);
    };
  }, [router.events, onVisibilityChange, onRouteChange]);

  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <ToastContainer />
    </RecoilRoot>
  );
};

export default MyApp;
