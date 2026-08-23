import { useSelector } from 'react-redux'
import { Navigate } from 'react-router';

const Protected = ({ children, role }) => {

    const user = useSelector(state => state.authReducer.user)
    const loading = useSelector(state => state.authReducer.loading);
    

    if(loading){
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    }

    if(!user){
        return <Navigate to='/login' replace />
    }

        if (role && user.role !== role) {
                return <Navigate to={user.role === 'store' ? '/seller' : '/buyer'} replace />;
        }

    return children;
}

export default Protected