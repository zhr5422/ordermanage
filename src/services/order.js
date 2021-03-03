import request from '@/utils/request';


export async function queryOrder(param) {
  if (param)
    return request(`/api/order/${param}`);
  return request('/api/order');
}

export async function addOrder(param) {
  return request('/api/order/add',
    {
      method: 'POST',
      data: param
    }
  )
}

export async function updateOrder(param) {
  return request('/api/order/edit', {
    method: 'PATCH',
    data: param
  })
}

export async function removeOrder(param) {
  return request(`/api/order/delete`,{method:'DELETE',data:param} )
}

export async function queryNeedDemo(param) {
  return request(`/api/order/needdemo/${param.figure}/${param.companyId}`)
}

export async function changeDeadline(param){
  return request('/api/order/deadline',{
    method:'PATCH',
    data:param
  })

}
