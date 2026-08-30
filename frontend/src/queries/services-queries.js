import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const fetchSalonServices = async () => {
    const { data } = await axios.get("http://localhost:8080/api/salon/fetch-services");
    console.log("services", data);
    return data;
}

export function useServices() {
    return useQuery({
        queryKey: ["salon-services"],
        queryFn: fetchSalonServices
    })
}