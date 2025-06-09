# Refresh Token with NodeJs and ReactJs without manually handling

If we login, we have accessToken, then we could get protected resource with the token to API as Authorization value;
If the token is expried, then we might get error or somthing says we are unauthorized for those protected resource;
Then we have another token named refreshToken, that is responsible for exchanging/renew a new accessToken for us to get the protected resource again.
Normally, refreshToken has a long-live while accessToken has a relatively short-live

Requirement:  
   We want to refreshToken to get new accessToken and automatically request again with the new accessToken at background rather than any manully action.

Thoughts:
   - Using Axios interceptors to intercepte when first request response 401(Unauthorized)
   - If so call the refreshToken API
   - Re-request the existing resonse-401 endpoint again with the new accessToken

   - If accessToken is expried neither, direct user to login page

## Client side

[x] Login btn
[x] Get user btn
[x] Manually refreshToken
[x] getToken, setToken, removeToken of localStorage
[x] Create axios ins
[x] Create axios interceptors request
[x] Create axios interceptors reponse

## Service side

[x] setup the project
[x] setup JWT
[x] setup login endpoint
[x] setup get user endpoint
[x] setup refresh token endpoint
[x] create generate token function
[x] create middle for checking token