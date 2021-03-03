import request from "@/utils/request";

export async function querySpecialNeed(param) {
  if (param)
    return request(`/api/specialneed/${param}`);
  return request('/api/specialneed')
}

export async function querySpecialNeedByFigure(param) {
    return request(`/api/specialneed/figure/${param}`);
}



export async function addSpecialNeed(param) {
  return request('/api/specialneed/add', {
    method: 'POST',
    data: param
  })

}

export async function updateSpecialNeed(param) {
  return request('/api/specialneed/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeSpecialNeed(param) {
  return request('/api/specialneed/delete', {
    method: 'DELETE',
    data: param
  })
}
