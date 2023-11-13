import axios from "axios";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AuthUser() {

    const navigate = useNavigate()
    const getToken = () => {
        const tokenString = sessionStorage.getItem('token');
        const userToken = JSON.parse(tokenString);
        return userToken;
    }

    const getUser = () => {
        const userString = sessionStorage.getItem('user');
        const userDetail = JSON.parse(userString);
        return userDetail;
    }

    const [token, setToken] = useState(getToken);
    const [user, setUser] = useState(getUser);

    const saveToken = (user, token) => {
        sessionStorage.setItem('token', JSON.stringify(token));
        sessionStorage.setItem('user', JSON.stringify(user));

        setToken(token);
        setUser(user);
    }

    const logout = () => {
        sessionStorage.clear();
        navigate('/')
    }

    const http_call = axios.create({
        baseURL: axios.defaults.baseURL,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    });

    return {
        setToken: saveToken,
        token,
        user,
        getToken,
        http_call,
        logout
    }
}