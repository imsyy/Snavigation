// Pinia
import useSetDataStore from "@/stores/setData";
import useStatusDataStore from "@/stores/statusData";

export const setStore = () => useSetDataStore();
export const statusStore = () => useStatusDataStore();
