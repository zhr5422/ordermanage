import request from "@/utils/request";

export async function addProgress(param) {
  return request('/api/progress/add', {
    method: 'POST',
    data: param
  })
}


export async function queryProgress(param) {
  if (param) {
    if (param.type === '首件')
      return request(`/api/progress/demo/${param.order}`);
    return request(`/api/progress/order/${param.order}`)
  }
  return request("api/progress")

}

export async function updateProgress(param) {
  return request('/api/progress/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeProgress(param) {
  return request('/api/progress/delete', {
    method: 'DELETE',
    data: param
  })
}

