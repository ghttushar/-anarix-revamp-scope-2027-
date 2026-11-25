/** Routes rendered with the "pro" kit (the pilot). After sign-off the kit becomes the default and this list goes away. */
export const PRO_KIT_ROUTES = ["/advertising/campaigns", "/kit"];

export const isProKitRoute = (pathname: string) => PRO_KIT_ROUTES.some((r) => pathname === r || pathname === `${r}/`);
