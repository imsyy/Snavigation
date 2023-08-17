// Pinia
import useSetDataStore from "@/stores/setData";
import useSiteDataStore from "@/stores/siteData";
import useStatusDataStore from "@/stores/statusData";

export const setStore = () => useSetDataStore();
export const siteStore = () => useSiteDataStore();
export const statusStore = () => useStatusDataStore();
