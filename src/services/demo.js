import request from "@/utils/request";

export async function queryDemo(param) {
  if (param)
    return request(`/api/demo/${param}`);
  return request(`/api/demo`);
}

export async function removeDemo(param) {
  return request(`/api/demo/delete`,
    {
      method: 'DELETE',
      data: param
    }
  )
}

export async function updateDemo(param) {
  return request(`/api/demo/edit`, {
    method: 'PATCH',
    data: param
  })
}

export async function addDemo(param) {
  return request(`/api/demo/add`, {
    method: 'POST',
    data: param
  })
}

