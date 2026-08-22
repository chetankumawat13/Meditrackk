import { useDispatch } from "react-redux";
import { getCurrentUser } from "../api/users.api.js";
import { setUser,setLoading } from "../../auth/state/auth.slice.js";




export const useUsers = () => {


    const dispatch = useDispatch();

    async function handleGetUser() {
        dispatch(setLoading(true));

        try{
            const data = await getCurrentUser();
            dispatch(setUser(data.user));
        }
        finally{
            dispatch(setLoading(false));
        }

    }


    return {
        handleGetUser
    }

}
