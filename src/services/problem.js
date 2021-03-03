import request from "@/utils/request";

export async function queryProblem(param) {
  if (param) {
    if (param.type === '首件')
      return request(`/api/problem/demo/${param.order}`);
    return request(`/api/problem/order/${param.order}`)
  }
  return request("/api/problem")
}

export async function addProblem(param) {
  return request('/api/problem/add', {
    method: 'POST',
    data: param
  })
}

export async function updateProblem(param) {
  return request('/api/problem/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeProblem(param) {
  return request('/api/problem/delete', {
    method: 'DELETE',
    data: param
  })
}


