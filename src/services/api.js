import request from '@/utils/request';

const apiurl = "http://localhost:8000";

export function setSessionKey(session_key) {
    return localStorage.setItem('session_key', session_key);
}
  
export function getSessionKey() {
    return localStorage.getItem('session_key');
}

export async function accountLogin(params) {
    console.log(params);
    return request(apiurl + '/api/users/login', {
      method: 'POST',
      data: params,
    });
  }
  

function authorizedRequest(method, url, params){
    return request(apiurl + url, {method: method, data : params, headers : {"Authorization" : "Token " + getSessionKey()} } );
}

export async function createVault(params) {
    console.log("createAccount", params, getSessionKey());
    return authorizedRequest("POST", '/api/seeds', params); 
}

export async function getVaults(params) {
    console.log("getKeys")
    return authorizedRequest('GET','/api/seeds', params);
}

export async function shareKey(params) {
    console.log("shareKey")
    return authorizedRequest('POST','/api/keys/share/', params);
}

export async function getWallets(params) {
    console.log("getWallets")
    return authorizedRequest('GET','/api/wallets', params);
}

export async function createAsset(params) {
    console.log("createAccount", params, getSessionKey());
    return authorizedRequest("POST", '/api/assets', params); 
}

export async function getAssets(params) {
    return authorizedRequest('GET','/api/assets', params);
}

export async function getWallet(params) {
    return authorizedRequest('GET','/api/wallet/'+params.id , {});
}

export async function getAddress(params) {
    return authorizedRequest('POST','/api/address/'+params.id+'/'+params.n+"/", {});
}

export async function getAddresses(params) {
    return authorizedRequest('GET','/api/address/'+params.id, {});
}


export async function validateAddress(params) {
    return authorizedRequest('GET','/api/address/validate/'+params.address+'/', {});
}


export async function getAccounts(params) {
    return authorizedRequest('GET','/api/users', params);
}

export async function queryCurrent() {
    console.log("queryCurrent");
    return authorizedRequest('GET','/api/account', {});
}

export async function queryUsers() {
    console.log("queryCurrent");
    return authorizedRequest('GET','/api/users', {});
}


export async function createAccount(params) {
    console.log("createAccount", params, getSessionKey());
    return authorizedRequest("POST", '/api/account/', params); 
}

export async function getAccount(params) {
    return authorizedRequest('GET','/api/account', params);
}

export async function getOTP(params) {
    return authorizedRequest('GET','/api/otp/', params);
}

export async function confirmOTP(params) {
    return authorizedRequest('POST','/api/otp/', params);
}

export async function setFirewallRule(params) {
    return authorizedRequest('PUT','/api/firewall', params);
}

export async function getFirewallRules(params) {
    return authorizedRequest('GET','/api/firewall', params);
}


export async function addFirewallRule(params) {
    return authorizedRequest('POST','/api/firewall', params);
}

export async function deleteFirewallRule(params) {
    return authorizedRequest('DELETE','/api/firewall/', params);
}

export async function createTransfer(params) {
    return authorizedRequest('POST', '/api/orders', params);
}

export async function getTransfers(params) {
    return authorizedRequest('GET', '/api/orders', params);
}

export async function createConfirmation(params) {
    return authorizedRequest('POST', '/api/transfers/confirm/', params);
}

export async function userRegister(params) {
    return authorizedRequest('POST', '/api/users/register/', params);
}

export async function userDelete(params) {
    return authorizedRequest('DELETE', '/api/users/register/', params);
}


export async function userList(params) {
    return authorizedRequest('GET', '/api/users/list/', params);
}

export async function createGroups(params) {
    return authorizedRequest('POST', '/api/users/groups/', params);
}

export async function createWorker(params) {
    return authorizedRequest('POST', '/api/users/worker/', params);
}

export async function getWorkerStatus(params) {
    return authorizedRequest('GET', '/api/users/worker/', params);
}
