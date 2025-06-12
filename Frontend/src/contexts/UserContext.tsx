import { createContext, useState } from "react";
import axiosInstance from "../libs/axios";
import { AxiosError } from "axios";

type UserContextProps = {
  user: any;
  loading: boolean;
  error: string;
  message: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getuser: () => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    avatar: File
  ) => Promise<void>;
};

type UserProviderProps = {
  children: React.ReactNode;
};

type ErrorResponse = {
  message: string;
};

export const userContext = createContext<UserContextProps | undefined>(
  undefined
);

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getuser = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get("/users/profile");
      if (response.data.success) {
        setUser(response.data.user);
      }
      console.log(response.data);
    } catch (error) {
      setUser(null);
      // setError("User Fetch Failed");
      // console.log("Error in getuser", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      if (response.data.success) {
        setError("");
        setMessage(response.data.message);
        console.log(response.data.message);
        getuser();
      } else {
        setError(response.data.message);
        setMessage("");
      }
    } catch (error) {
      console.log("Error in login", error);
      setError("User Login Failed");
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    avatar: File
  ) => {
    setLoading(true);
    try {
      const payload = new FormData();
      payload.append("username", name);
      payload.append("email", email);
      payload.append("password", password);
      payload.append("avatar", avatar);
      const response = await axiosInstance.post("/users/register", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        setError("");
        setMessage(response.data.message);
        getuser();
      } else {
        setError(response.data.message);
        setMessage("");
      }
    } catch (err) {
      const error = err as AxiosError;
      console.log("Error in register", error);
      const message =
        (error?.response?.data as ErrorResponse)?.message ||
        "Something went wrong during registration.";
      setError(message);
      setMessage("");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/users/logout");
      if (response.data.success) {
        setError("");
        setMessage(response.data.message);
        setUser(null);
      } else {
        setError(response.data.message);
        setMessage("");
      }
    } catch (error) {
      console.log("Error in logout", error);
      setError("User Logout Failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <userContext.Provider
      value={{
        user,
        loading,
        error,
        message,
        login,
        logout,
        getuser,
        register,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default UserProvider;
