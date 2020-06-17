import request from '@/utils/request';

export async function accountLogin(params) {
  console.log(params);
  return request('http://localhost:8000/api/users/login', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/user-login/captcha?mobile=${mobile}`);
}
