import axios from 'axios';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";

const Profile = ({ user }) => {
    const handleLogOut = async () => {
        try {
            const token = localStorage.getItem('jwt_token');

            localStorage.removeItem('username');
            localStorage.removeItem('email');
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('userId');
            localStorage.removeItem('fname');
            localStorage.removeItem('token_expiry');

            // const resp = await axios.get('http://localhost:8000/auth/logout', {
            const resp = await axios.get('http://localhost:8080/user-service/auth/logout', {
                headers: {
                    "Authorization": token,
                }
            });
            console.log(resp.data);

            // navigate('/');
            window.location.href = '/';
        } catch (error) {
            console.log('Error while loggin out: ', error);
        }
    }

    return (
        <div id="user-profile" className="user-profile-card">
            <div className="popup-menu">
                <div className="profile-card">
                    <p>Welcome</p>
                    <Link to={`/dashboard/${user.username}`} className='link' >{user.username}</Link>
                    {/* <Link to={`/${user.username}/createEvent`} className='link'>CreateEvent </Link> */}
                    <Link onClick={handleLogOut} className="link" to="/">Log Out </Link>
                </div>
            </div>
        </div>
    )
}

Profile.propTypes = {
    user: PropTypes.any.isRequired,
};

export default Profile;