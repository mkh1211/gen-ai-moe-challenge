import { Link } from 'react-router-dom';
import { post } from 'aws-amplify/api';
import { getCurrentUser, AuthUser, fetchAuthSession } from 'aws-amplify/auth';
import { useContext, useEffect, useState } from 'react';
import { toJSON } from '../utilities';
import { AuthContext } from '../AuthContext';

async function _getCurrentUser() {
  try {
    await fetchAuthSession({ forceRefresh: true }); // try to refresh the session first
    const user = await getCurrentUser();
    return user;
  } catch (error: any) {
    if (error.name == 'UserUnAuthenticatedException') {
      console.log('Not logged in');
    } else {
      throw error;
    }
  }
}

function TestPage() {
  const [user, setUser] = useState<AuthUser | undefined>(undefined);

  const testAPIAccess = async () => {
    const response = await toJSON(
      post({
        apiName: 'myAPI',
        path: '/',
      }),
    );

    console.log(response);
  };

  // Get current user
  useEffect(() => {
    _getCurrentUser().then(user => {
      setUser(user);
    });
  }, []);

  const userInfo = useContext(AuthContext);

  return (
    <>
      <h2> This is a test page</h2>
      <p>{user ? JSON.stringify(user) : 'No current User'}</p>

      <p className="mt-4 font-light text-lg">Get info using Auth Stack</p>
      {userInfo ? (
        <>
          <p className="mb-3">
            Auth Session = {JSON.stringify(userInfo.authSession)}
          </p>
          <p className="mb-3">User info = {JSON.stringify(userInfo.user)}</p>
        </>
      ) : (
        <p>No Current User</p>
      )}

      <br />
      <button onClick={testAPIAccess}>POST /</button>
      <br />
      <br />
      <Link to="/"> Back </Link>

      <ColorPalette />
    </>
  );
}

const ColorPalette = () => {
  const baseClasses = 'w-16 h-16 ';

  return (
    <>
      <p> Hover over a color for its name </p>
      <div className="flex flex-row mt-4">
        <div className={baseClasses + 'bg-blue-4'} title="blue-4"></div>
        <div className={baseClasses + 'bg-blue-3'} title="blue-3"></div>
        <div className={baseClasses + 'bg-blue-2'} title="blue-2"></div>
        <div className={baseClasses + 'bg-blue-1'} title="blue-1"></div>
        <div className="ml-4"></div>
        <div className={baseClasses + 'bg-grey-4'} title="grey-4"></div>
        <div className={baseClasses + 'bg-grey-3'} title="grey-3"></div>
        <div className={baseClasses + 'bg-grey-2'} title="grey-2"></div>
        <div className={baseClasses + 'bg-grey-1'} title="grey-1"></div>
      </div>
    </>
  );
};

export default TestPage;
