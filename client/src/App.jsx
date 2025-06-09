import {TOKENS} from './utils';
import { PATHS } from './paths';
import {apiGet, apiPost} from './ins';
function App() {
  const handleLogin = async () => {
    try {
      const {message} = await apiPost(
        PATHS.LOGIN
      );
      console.log(message);
    } catch (err) {
      console.log(err);
    }
  };
  const handleGetuser = async () => {
    try {
      const {users} = await apiGet(PATHS.USERS);
      console.log(users);
    } catch (err) {
      // Here will catch the error from interceptor error return
      console.error('Catch in caller:', err);
      console.log('Status:', err.response?.status);
      console.log('Message:', err.response?.data?.message);
    }
  };
  // manually handle refresh token
  const handleRefreshToken = async () => {
    try {
      await apiPost(PATHS.REFRESH_TOKEN,{},{
        headers: {
          Authorization: `Bearer ${localStorage.getItem(TOKENS.REFRESH_TOKEN)}`,
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  
  return (
    <div>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleGetuser}>get user</button>
      <button onClick={handleRefreshToken}>refresh token</button>
    </div>
  );
}

export default App;
