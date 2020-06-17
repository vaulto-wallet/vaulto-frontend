import request from '@/utils/request';

export async function registerUser(params) {
  return request('http://localhost:8000/api/users/register/', {
    method: 'POST',
    data: params,
  });
}
