export const parseJwt = (token: string) => {
  const payload = JSON.parse(atob(token.split(".")[1]));

  return {
    role:
      payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
    userId: payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"],
  };
};