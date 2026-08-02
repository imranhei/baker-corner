import axiosInstance from "@/utils/axiosInstance";

export const getSummary =
async(filters)=>{

  const response =
    await axiosInstance.get(`/api/admin/summary`,
      {
        params:filters
      }
    );


  return response.data;

};