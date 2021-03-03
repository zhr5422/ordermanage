import request from '@/utils/request';

export async function queryRoadmap(param) {
  if (param)
    return request(`/api/roadmap/${param}`);
  return request('/api/roadmap')
}

export async function queryFlow(param) {
  if (param)
    return request(`/api/flow/${param}`);
  return request('/api/flow')
}

export async function addRoadmap(param) {
  return request('/api/roadmap/add', {
    method: 'POST',
    data: param,
  });
}

export async function updateRoadmap(param) {
  return request('/api/roadmap/edit', {
    method: 'PATCH',
    data: param,
  });
}

export async function removeRoadmap(param) {
  return request('/api/roadmap/delete', {
    method: 'DELETE',
    data: param,
  });
}

export async function addFlow(param) {
  return request('/api/flow/add', {
    method: 'POST',
    data: param,
  });
}

export async function updateFlow(param) {
  return request('/api/flow/edit', {
    method: 'PATCH',
    data: param,
  });
}

export async function removeFlow(param) {
  return request('/api/flow/delete', {
    method: 'DELETE',
    data: param,
  });
}
