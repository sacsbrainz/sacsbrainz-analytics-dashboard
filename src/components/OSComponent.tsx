import { env } from "@/env.mjs";
import { cn, getDateToAndFrom } from "@/lib/utils";
import { statDateRange } from "@/recoil/atom";
import { StandardApi } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

interface OSProps extends StandardApi {
  data: {
    os: string;
    count: number;
  }[];
}

function OSComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const dateRange = useRecoilValue(statDateRange);
  const router = useRouter();
  const id = router.query.id as string;

  const [data, setData] = useState<
    | {
        os: string;
        count: number;
      }[]
    | null
  >(null);

  const fetchDataFilteredByDate = async () => {
    const range = getDateToAndFrom(dateRange);

    setIsLoading(true);
    await axios
      .get<OSProps>(`${env.NEXT_PUBLIC_API_URL}/os`, {
        withCredentials: true,
        params: {
          from: range[0],
          to: range[1],
          id,
        },
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

  useEffect(() => {
    if (!id) return;
    void fetchDataFilteredByDate();
  }, [dateRange, id]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[350px] w-full flex-col divide-y rounded-lg border shadow-lg">
          <div className="flex w-full items-center justify-between px-4 py-5">
            <span className=" font-medium">Operating Systems</span>
            <span className="text-xs">VISITORS</span>
          </div>
          <div className="flex flex-col gap-4 px-4 pt-5">
            <div className="h-8 w-full animate-pulse rounded-sm bg-gray-200" />
            <div className="h-8 w-full animate-pulse rounded-sm bg-gray-200" />
            <div className="h-8 w-full animate-pulse rounded-sm bg-gray-200" />
            <div className="h-8 w-full animate-pulse rounded-sm bg-gray-200" />
            <div className="h-8 w-full animate-pulse rounded-sm bg-gray-200" />
          </div>
        </div>
      ) : (
        <div
          className={cn(
            "flex w-full flex-col divide-y rounded-lg border shadow-lg",
            data?.length! < 3 && "h-[350px]"
          )}
        >
          <div className="flex w-full items-center justify-between px-4 py-6">
            <span className=" font-medium">Operating Systems</span>
            <span className="text-xs">VISITORS</span>
          </div>
          <div className="flex flex-col gap-3 pb-10 pt-4">
            {data?.map((item, index) => (
              <button
                key={index}
                // style={{ opacity: (data.length - index) * 0.4 }}
                className=" px-4 hover:border-l-2 hover:border-l-black"
              >
                <div className="flex w-full items-center justify-between rounded-lg bg-gray-100 px-3 py-3">
                  <span className="text-xs">{item.os}</span>
                  <span className="text-sm font-semibold">{item.count}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default OSComponent;
