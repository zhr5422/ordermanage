import request from "@/utils/request";

export async function queryCompany() {
  return request('/api/company');
}

export async function addCompany(param) {
  return request('/api/company/add', {
    method: 'POST',
    data: param
  })
}

export async function updateCompany(param) {
  return request('/api/company/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeCompany(param) {
  return request('/api/company/delete', {
    method: 'DELETE',
    data: param
  })
}
