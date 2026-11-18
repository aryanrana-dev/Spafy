import { useQuery } from "@tanstack/react-query";
import api from "../api/axiosClient";

const fetchSalonServices = async () => {
    const { data } = await api.get("/salons/fetch-services");
    return data;
}

export function useServices() {
    return useQuery({
        queryKey: ["salon-services"],
        queryFn: fetchSalonServices
    })
}