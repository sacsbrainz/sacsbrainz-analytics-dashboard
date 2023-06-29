import { NextMiddleware, NextResponse } from "next/server";
import withAuthorization from "./middlewares/withAuthorization";
const mainMiddleware: NextMiddleware = (request) => {
  const res = NextResponse.next();
  return res;
};
export default withAuthorization(mainMiddleware, ["/dashboard"]);
