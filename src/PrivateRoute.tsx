import  {ReactNode} from 'react';
import { useAppSelector } from './app/redux/hooks';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({children}:{children:ReactNode}) => {
    const user = useAppSelector(state=>state.user.token);
    return (
        
            user ? children : <Navigate to='/login'/>
        
    );
};

export default PrivateRoute;