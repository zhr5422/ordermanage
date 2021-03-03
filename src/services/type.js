import request from "@/utils/request";

export async function queryType() {
  return request('/api/type')
}

export async function addType(param) {
  return request('/api/type/add', {
    method: 'POST',
    data: param
  })
}

export async function updateType(param) {
  return request('/api/type/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeType(param) {
  return request('/api/type/delete', {
    method: 'DELETE',
    data: param
  })
}
