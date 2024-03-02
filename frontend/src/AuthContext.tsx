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
}

// Create a context with a default value that matches the AuthContextType
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  loading: true,
  login: async () => {}, // Provide an async empty function as placeholder
  logout: () => {},
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
      setCurrentUser({ email: data.user_email, id: data.user_id });
      sessionStorage.setItem("token", data.access_token); // Save the token
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

  const value = {
    currentUser,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
