import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function addUser(user) {
  return request('/api/user/add', {
    method: 'POST',
    data: user
  })
}

export async function updateUser(user) {
  return request('/api/user/edit', {
    method: 'PATCH',
    data: user
  })

}

export async function removeUser(user) {
  return request('/api/user/delete', {
    method: 'DELETE',
    data: user
  })

}

export async function queryWelcome() {
  return request("/api/welcome")
}

export async function queryCraftMan() {
  return request('/api/user/craftman');
}

export async function editInformation(param) {
  return request('/api/user/information', {
    method: 'PATCH',
    data: param
  })
}

export async function editPassword(param) {
  return request('/api/user/password', {
    method: 'PATCH',
    data: param
  })
}
