export const COOKIE_NAME = "fb:session";

export const MAIN_ORIGIN =
  typeof window === "undefined"
    ? `https://${process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? ""}`.replace(/\/$/, "")
    : `${window.location.protocol}//${
        process.env.NEXT_PUBLIC_MAIN_DOMAIN ?? window.location.host
      }`;

export const PROFILE_ORIGIN =
  typeof window === "undefined"
    ? `https://${process.env.NEXT_PUBLIC_PROFILE_DOMAIN ?? ""}`.replace(
        /\/$/,
        ""
      )
    : `${window.location.protocol}//${
        process.env.NEXT_PUBLIC_PROFILE_DOMAIN ?? window.location.host
      }`;
