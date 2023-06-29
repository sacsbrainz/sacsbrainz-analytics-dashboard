import BrowsersComponent from "@/components/BrowsersComponent";
import CountriesComponent from "@/components/CountriesComponent";
import MainComponent from "@/components/MainComponent";
import OSComponent from "@/components/OSComponent";
import TopPagesComponent from "@/components/TopPagesComponent";
import TopReferrersComponent from "@/components/TopReferrersComponent";
import { env } from "@/env.mjs";
import { statDateRange } from "@/recoil/atom";
import axios from "axios";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);
  const [dateRange, setDateRange] = useRecoilState(statDateRange);

  const router = useRouter();

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setDateRange(e.target.value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get(`${env.NEXT_PUBLIC_API_URL}/stats`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };
  // console.log(data);

  useEffect(() => {
    // void fetchData();
  }, []);

  return (
    <>
      <Head>
        <title>Analytics Dashboard</title>
        <meta name="description" content="Analytics Dashboard" />
        <link rel="icon" href="/web/favicon.ico" />
      </Head>
      <main className="mx-auto  flex flex-col p-4   lg:container">
        <h1 className=" my-5 text-xl font-bold">Web Analytics</h1>
        <div className="mb-5 flex w-full justify-between">
          <Link href={""}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mr-2 inline-block h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path
                strokeWidth={0.1}
                d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z"
              ></path>
            </svg>
            sacsbrainz.com
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="ml-2 inline-block h-4 w-4"
              viewBox="0 0 24 24"
            >
              <path d="M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z"></path>
            </svg>
          </Link>
          <select
            onChange={handleSelectChange}
            value={dateRange}
            className="rounded-md border bg-transparent px-4 py-2 text-sm focus:outline-none"
          >
            <option value="24h">24 hours</option>
            <option value="7d">7 days</option>
            <option value="30d">30 days</option>
            <option value="90d">90 days</option>
            <option value="1y">1 year</option>
            <option value="all">All time</option>
          </select>
        </div>
        <MainComponent />

        <div className="my-2 flex w-full flex-col gap-4 lg:flex-row">
          <TopPagesComponent />
          <TopReferrersComponent />
        </div>
        <div className="my-2 flex w-full flex-col gap-4 lg:flex-row">
          <CountriesComponent />
          <OSComponent />
          <BrowsersComponent />
        </div>
      </main>
    </>
  );
}
