import React, { useEffect, useState } from "react";
import UsersList from "../components/UsersList";
import ErrorModal from "../../shared/components/UIelements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIelements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
const Users = () => {
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const [loadedUsers, setLoadedUsers] = useState([]);
    useEffect(() => {
        const fetchUsers = async () => {
        try {
                const responseData = await sendRequest(`${BACKEND_URL}/api/users`)
                setLoadedUsers(responseData.users);
        } catch (err) {}
    };
        fetchUsers();
    }, [sendRequest])


    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError} />
            {isLoading && (
                <div className="center">
                    <LoadingSpinner />
                </div>
            )}
            <UsersList items={loadedUsers} />
        </React.Fragment>
    );
};
export default Users;