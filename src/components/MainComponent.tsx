import { env } from "@/env.mjs";
import { cn, getDateToAndFrom } from "@/lib/utils";
import { statDateRange } from "@/recoil/atom";
import { StandardApi } from "@/types/types";
import axios from "axios";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Area,
  AreaChart,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useRecoilValue } from "recoil";

interface MainProps extends StandardApi {
  data: {
    visitorsCount: number;
    pageViewsCount: number;
  };
}

interface TimeSeriesProps extends StandardApi {
  data: {
    visitors: {
      key: string;
      total: number;
    }[];
    pageViews: {
      key: string;
      total: number;
    }[];
  };
}

function MainComponent() {
  const [currentTab, setCurrentTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dateRange = useRecoilValue(statDateRange);

  const [data, setData] = useState<{
    visitorsCount: number;
    pageViewsCount: number;
  } | null>(null);
  const [timeSeriesdata, setTimeSeriesData] = useState<{
    visitors: {
      key: string;
      total: number;
    }[];
    pageViews: {
      key: string;
      total: number;
    }[];
  } | null>(null);
  const [currentTimeSeriesData, setCurrentTimeSeriesData] = useState<
    | {
        key: string;
        total: number;
      }[]
    | undefined
  >([]);

  const router = useRouter();

  const fetchDataFilteredByDate = async () => {
    const range = getDateToAndFrom(dateRange);

    setIsLoading(true);
    await axios
      .get<MainProps>(`${env.NEXT_PUBLIC_API_URL}/stats`, {
        withCredentials: true,
        params: {
          from: range[0],
          to: range[1],
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

  const fetchSeriesdataFilteredByDate = async () => {
    const range = getDateToAndFrom(dateRange);
    setIsLoading(true);
    await axios
      .get<TimeSeriesProps>(`${env.NEXT_PUBLIC_API_URL}/timeseries`, {
        withCredentials: true,
        params: {
          from: range[0],
          to: range[1],
        },
      })
      .then((res) => {
        if (res.data.success) {
          setTimeSeriesData(res.data.data);
          if (currentTab === 0) {
            setCurrentTimeSeriesData(res.data.data?.visitors);
          }
          if (currentTab === 1) {
            setCurrentTimeSeriesData(res.data.data?.pageViews);
          }
          setIsLoading(false);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
      });
  };

  useEffect(() => {
    void fetchDataFilteredByDate();
    void fetchSeriesdataFilteredByDate();
  }, [dateRange]);

  return (
    <>
      {isLoading ? (
        <div className="flex h-[350px] w-full flex-col divide-y rounded-lg border shadow-lg">
          <div className="flex divide-x rounded-xl rounded-b-none border border-x-0 border-t-0">
            <button className="flex w-full flex-col gap-1 px-4 py-3 text-start md:w-auto md:pr-20">
              <span className="text-sm">Visitors</span>
              <span className="h-5 w-10 animate-pulse rounded-md bg-gray-200" />
            </button>
            <button className="flex w-full flex-col gap-1 px-4 py-3 text-start md:w-auto md:pr-20">
              <span className="text-sm">Page Views</span>
              <span className="h-5 w-10 animate-pulse rounded-md bg-gray-200" />
            </button>
            <div className="hidden md:block" />
          </div>
          <div className="flex h-[300px] animate-pulse flex-col gap-4 bg-gray-200 px-4 pt-5" />
        </div>
      ) : (
        <div className="mb-6 rounded-xl border shadow-xl">
          <div className="flex divide-x rounded-xl rounded-b-none border border-x-0 border-t-0">
            <button
              onClick={() => {
                if (currentTab === 0) return;
                setCurrentTab(0);
                setCurrentTimeSeriesData(timeSeriesdata?.visitors);
              }}
              className={cn(
                "flex w-full flex-col gap-1 px-4 py-3 text-start md:w-auto md:pr-20",
                currentTab === 0 && " border-b-2 border-b-black"
              )}
            >
              <span className="text-sm">Visitors</span>
              <span className="text-2xl font-medium">
                {data?.visitorsCount ?? 0}
              </span>
            </button>
            <button
              onClick={() => {
                if (currentTab === 1) return;
                setCurrentTab(1);
                setCurrentTimeSeriesData(timeSeriesdata?.pageViews);
              }}
              className={cn(
                "flex w-full flex-col gap-1 px-4 py-3 text-start md:w-auto md:pr-20",
                currentTab === 1 && " border-b-2 border-b-black"
              )}
            >
              <span className="text-sm">Page Views</span>
              <span className="text-2xl font-medium">
                {data?.pageViewsCount ?? 0}
              </span>
            </button>
            <div className="hidden md:block" />
          </div>
          <div className="my-6 flex h-[300px] ">
            <ResponsiveContainer height={300}>
              <AreaChart data={currentTimeSeriesData}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />{" "}
                {/* Disable vertical grid lines */}
                <XAxis
                  dataKey="key"
                  interval="preserveStartEnd" // Display first and last item always
                  tickFormatter={(value: string, index: number) => {
                    if (
                      index %
                        Math.ceil(currentTimeSeriesData?.length ?? 0 / 4) !==
                      0
                    )
                      return ""; // Hide intermediate labels
                    const date = new Date(value);
                    const formattedDate = `${date.getDate()}/${
                      date.getMonth() + 1
                    }`;
                    return formattedDate;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(label: string) => {
                    const date = new Date(label);
                    const formattedDate = `${date.toLocaleDateString("en-US", {
                      weekday: "short",
                    })}, ${date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}`;
                    return formattedDate;
                  }}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="total"
                  fill="#0070f3"
                  fillOpacity={0.1}
                  strokeWidth={1.5}
                  stroke="#0070f3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}

export default MainComponent;
