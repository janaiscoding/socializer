"use client";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/userContext";
import { getJwtToken, removeJwtToken } from "../api/auth_handler";
import { useRouter } from "next/navigation";
import { User } from "../__types__/types";
import { verifyAPI } from "../api/endpoints";
import TopNav from "../ui_components/top_navbar/TopNav";
import fetchPosts from "../api/fetchers/posts";
import fetchUsers from "../api/fetchers/users";
import BotNav from "../ui_components/bottom_navbar/BotNav";

const App = () => {
  const router = useRouter();
  const userContext = useContext(UserContext);
  const verifyToken = async (
    token: string,
    setUser: React.Dispatch<React.SetStateAction<User | null>>
  ) => {
    await fetch(verifyAPI, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.user) {
          setUser(data.user);
        } else {
          //Rejected/Invalid Token!! Remove Token | Clear User | Redirect to login
          removeJwtToken();
          setUser(null);
          router.push("/login");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const token = getJwtToken();
    if (token) {
      verifyToken(token, userContext.setUser);
      fetchPosts(token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <TopNav />
      <p className="px-6">
        Welcome back from main_page app:
        {userContext.user?.first_name} {userContext.user?.last_name}
      </p>
      <BotNav />
    </div>
  );
};

export default App;
