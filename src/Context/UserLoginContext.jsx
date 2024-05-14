

import React from "react";

export const UserLoginContext = React.createContext({
    userLogin: false,
    setUserLogin: () => { },

    guestState: false,
    setGuestState: () => { },
});