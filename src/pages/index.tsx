import { env } from "@/env.mjs";
import axios from "axios";
import { Howl } from "howler";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface LoginProps {
  username: string;
  password: string;
}
interface ResProps {
  success: boolean;
  message: string;
  data: any | null;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<LoginProps>({
    username: "",
    password: "",
  });
  const sound = new Howl({
    src: ["sound.mp3"],
    onend: () => {
      setIsLoading(false);
    },
  });
  const router = useRouter();

  const handleSignIn = async () => {
    if (!data.username || !data.password) return sound.play();
    setIsLoading(true);
    await axios
      .post<ResProps>(
        `${env.NEXT_PUBLIC_API_URL}/auth/login`,
        {
          ...data,
        },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        if (res.data.success) {
          router.push("/home");
          setIsLoading(false);
        }
      })
      .catch((e) => {
        sound.play();
        toast("Ole!!!!!");
      });
  };

  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <Head>
        <title>Analytics Login</title>
        <meta name="description" content="Analytics Login" />
        <link rel="icon" href="favicon.ico" />
      </Head>
      <label htmlFor="username">Username</label>
      <input
        className="rounded-full border px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
        type="text"
        value={data.username}
        name="username"
        onChange={(e) => setData({ ...data, username: e.target.value })}
      />
      <label htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        value={data.password}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        className="rounded-full border px-10 py-3 font-semibold no-underline transition hover:bg-white/20"
      />
      <button
        onClick={(e) => {
          e.preventDefault();
          void handleSignIn();
        }}
        disabled={isLoading}
        className="mt-5 rounded-full bg-blue-400 px-10 py-3 font-semibold text-white no-underline transition disabled:opacity-40"
      >
        {isLoading && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-3 inline-block h-6 w-6 animate-spin fill-current"
            viewBox="0 0 24 24"
          >
            <path d="M11.9995 2C12.5518 2 12.9995 2.44772 12.9995 3V6C12.9995 6.55228 12.5518 7 11.9995 7C11.4472 7 10.9995 6.55228 10.9995 6V3C10.9995 2.44772 11.4472 2 11.9995 2ZM11.9995 17C12.5518 17 12.9995 17.4477 12.9995 18V21C12.9995 21.5523 12.5518 22 11.9995 22C11.4472 22 10.9995 21.5523 10.9995 21V18C10.9995 17.4477 11.4472 17 11.9995 17ZM20.6597 7C20.9359 7.47829 20.772 8.08988 20.2937 8.36602L17.6956 9.86602C17.2173 10.1422 16.6057 9.97829 16.3296 9.5C16.0535 9.02171 16.2173 8.41012 16.6956 8.13398L19.2937 6.63397C19.772 6.35783 20.3836 6.52171 20.6597 7ZM7.66935 14.5C7.94549 14.9783 7.78161 15.5899 7.30332 15.866L4.70525 17.366C4.22695 17.6422 3.61536 17.4783 3.33922 17C3.06308 16.5217 3.22695 15.9101 3.70525 15.634L6.30332 14.134C6.78161 13.8578 7.3932 14.0217 7.66935 14.5ZM20.6597 17C20.3836 17.4783 19.772 17.6422 19.2937 17.366L16.6956 15.866C16.2173 15.5899 16.0535 14.9783 16.3296 14.5C16.6057 14.0217 17.2173 13.8578 17.6956 14.134L20.2937 15.634C20.772 15.9101 20.9359 16.5217 20.6597 17ZM7.66935 9.5C7.3932 9.97829 6.78161 10.1422 6.30332 9.86602L3.70525 8.36602C3.22695 8.08988 3.06308 7.47829 3.33922 7C3.61536 6.52171 4.22695 6.35783 4.70525 6.63397L7.30332 8.13398C7.78161 8.41012 7.94549 9.02171 7.66935 9.5Z"></path>
          </svg>
        )}
        Login
      </button>
      <button
        disabled={isLoading}
        onClick={() => {
          setIsLoading(true);
          sound.play();
          toast("Shabi nah me and you get the website ba?", {
            autoClose: 10000,
          });
        }}
        className="absolute right-5 top-10 rounded-xl border p-3 text-xs shadow-lg disabled:opacity-25"
      >
        Register
      </button>
    </div>
  );
}

export default Login;
