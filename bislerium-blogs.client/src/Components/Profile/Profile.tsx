import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useBookmarksQuery from '../../hooks/react-query/useBookmarksQuery';

const Profile = () => {
  const { username } = useParams();
  useEffect(() => {
    console.log(username);
  }, [username]);

  //   const {}=useBookmarksQuery()

  return (
    <div className="min-h-screen w-full flex justify-between px-12 flex-col">
      Profile
    </div>
  );
};

export default Profile;
