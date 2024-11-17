"use client";
import api from "@/lib/api";
import { ProfileData, profileDataSchema } from "@/schema/profile-data";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export default function useCredentialsState(initialAddress?: string) {
  const [address, setAddress] = useState(initialAddress ?? null);
  const {
    data: profile,
    refetch,
    ...profileQuery
  } = useQuery({
    queryKey: ["profile", address, !!address],
    queryFn: async () => {
      const data: ProfileData | false = await api
        .get("/user")
        .then(({ data }) => {
          return profileDataSchema.parse(data);
        });
      return data;
    },
    enabled: !!address,
  });

  const error = profileQuery.error; // TODO: trigger error toast on error

  const credentialsStatus = (function () {
    if (error) return "loading";
    if (!address) {
      return "disconnected";
    }
    if (address && profile === null) {
      return "loading";
    }
    if (address && profile === false) {
      return "creating-account";
    }
    // address && profile && kazui
    return "connected";
  })();

  useEffect(() => {
    if (!address || error) {
      setAddress(null);
    }
  }, [address, error]);

  return {
    address,
    setAddress,
    profile,
    status: credentialsStatus as typeof credentialsStatus,
    refetchProfile: refetch,
  };
}
