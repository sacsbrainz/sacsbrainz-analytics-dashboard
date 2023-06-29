import { env } from "@/env.mjs";
import { StandardApi } from "@/types/types";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface DashboardProps extends StandardApi {
  data: {
    websites: {
      id: string;
      url: string;
      _count: {
        analytic: number;
      };
    }[];
  };
}

function Index() {
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<
    | {
        id: string;
        url: string;
        _count: {
          analytic: number;
        };
      }[]
    | null
  >(null);

  const fetchData = async () => {
    setIsLoading(true);
    await axios
      .get<DashboardProps>(`${env.NEXT_PUBLIC_API_URL}/get-websites`, {
        withCredentials: true,
      })
      .then((res) => {
        if (res.data.success) {
          setData(res.data.data.websites);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    void fetchData();
  }, []);

  return (
    <>
      {isLoading ? (
        <div className="mt-5 grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
          <div className=" flex flex-col gap-3 rounded-md p-3 shadow-lg">
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className=" flex flex-col gap-3 rounded-md p-3 shadow-lg">
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className=" flex flex-col gap-3 rounded-md p-3 shadow-lg">
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className=" flex flex-col gap-3 rounded-md p-3 shadow-lg">
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
          <div className=" flex flex-col gap-3 rounded-md p-3 shadow-lg">
            <div className="h-5 w-40 animate-pulse rounded-md bg-gray-200" />
            <div className="h-5 w-20 animate-pulse rounded-md bg-gray-200" />
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-3 p-4 md:grid-cols-2 lg:grid-cols-3">
          {data?.map((data, index) => (
            <Link
              key={index}
              className=" flex flex-col gap-3 rounded-md border px-4 py-6 shadow-md shadow-violet-700"
              href={`/web/dashboard/${data.id}`}
            >
              <span className="font-bold">{data.url}</span>
              <span>Total visitors: {data._count.analytic}</span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}

export default Index;
