import request from "@/utils/request";

export async function queryAuthorities() {
  return request('/api/authority/all')
}
