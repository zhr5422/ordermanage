import request from '@/utils/request';

export async function accountLogin(params) {
  return request('/api/login', {
    method: 'POST',
    data: params,
  });
}

export async function accountLogout() {
  return request('/api/logout');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}
