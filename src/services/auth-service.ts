import axios from "axios";
import { ILogin, IUser, updateUserType } from "../@Types/types";

export const baseUrl = "https://node-beit-chabad-yaffo-production.up.railway.app/api";
export const usersUrl = `${baseUrl}/users`;
export const loginUrl = `${baseUrl}/users/login`;

export const register = (data: IUser) => axios.post(usersUrl, data);
export const login = (data: ILogin) => axios.post(loginUrl, data);


export const userDetails = (id: string) => {
    const url = `${usersUrl}/${id}`;
    return axios.get(url,
        {
            headers: {
                "x-auth-token": localStorage.getItem("token"),
            },
        }
    );

};

export const businessUser = (id: string) => {
    const url = `${usersUrl}/${id}`;
    return axios.patch(url, {
        isBusiness: true,
    }, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
}
//login user
//get all users
export const getAllUsers = () => {
    const url = `${usersUrl}/`;
    return axios.get(url, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
}
//get user by id
export const getUserById = (id: string) => axios.get(`${usersUrl}/${id}`, {
    headers: {
        "x-auth-token": localStorage.getItem("token"),
    },
});

//update user
export const updateUser = (id: string, user: updateUserType) => {
    return axios.put(`${usersUrl}/${id}`, user,
        {
            headers: {
                "x-auth-token": localStorage.getItem("token"),
            },
        }
    );
};

export const deleteUserById = (id: string) => {
    const url = `${usersUrl}/${id}`;
    return axios.delete(url, {
        headers: {
            "x-auth-token": localStorage.getItem("token"),
        },
    });
};



export const auth = {
    register,
    login,
    userDetails,
    getAllUsers,
    getUserById,
    businessUser,
    deleteUserById
};

export default auth;