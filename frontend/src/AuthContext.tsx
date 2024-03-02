import {
  createContext,
  useContext,
  useState,
  ReactNode,
  FunctionComponent,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";

type User = null | { email: string; id: string };

interface AuthContextType {
  currentUser: User;
  loading: boolean;
  login: (
    username: string,
    password: string,
    location: string
  ) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    location: string
  ) => Promise<void>;
}

// Create a context with a default value that matches the AuthContextType
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const useAuth = () => useContext(AuthContext);
const apiUrl = import.meta.env.VITE_API_URL as string;

interface AuthProviderProps {
  children: ReactNode;
}

async function fetchUserDetails(token: string) {
  const userDetailsUrl = `${apiUrl}/api/v1/user/`;

  try {
    const response = await fetch(userDetailsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      // If the server response is not ok (e.g., 401 Unauthorized), throw an error
      throw new Error("Failed to fetch user details.");
    }
    const userData = await response.json();
    return userData;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
}

export const AuthProvider: FunctionComponent<AuthProviderProps> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      const token = sessionStorage.getItem("token");
      if (token) {
        try {
          const user = await fetchUserDetails(token);
          setCurrentUser(user);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user details:", error);
          // Handle error, e.g., by logging out the user
        }
      } else {
        setLoading(false);
      }
    };
    checkUserLoggedIn();
  }, []);

  const login = async (
    username: string,
    password: string,
    location: string = "/"
  ) => {
    if (!apiUrl) {
      throw new Error("Backend API URL is not set");
    }
    const loginUrl = apiUrl + "/api/v1/login/";
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        username: username,
        password: password,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      sessionStorage.setItem("token", data.access_token); // Save the token
      const user = await fetchUserDetails(data.access_token);
      setCurrentUser({ email: user.email, id: user.id });
      navigate(location);
    } else {
      throw new Error(data.detail || "Login failed");
    }
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem("token"); // Clear the token on logout
    navigate("/login");
  };

  const register = async (
    username: string,
    password: string,
    firstName: string,
    lastName: string,
    location: string = "/"
  ) => {
    if (!apiUrl) {
      throw new Error("Backend API URL is not set");
    }
    const registerUrl = apiUrl + "/api/v1/register/";
    const response = await fetch(registerUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: username,
        password: password,
        first_name: firstName,
        last_name: lastName,
      }),
    });
    const data = await response.json();
    if (response.ok) {
      login(username, password, location);
    } else {
      throw new Error(data.detail || "Login failed");
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
