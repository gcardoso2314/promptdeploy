import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./Routes";
import { AuthProvider } from "./AuthContext";
import "@mantine/core/styles.css";
import { MantineProvider, createTheme } from "@mantine/core";

const theme = createTheme({
  fontFamily: "Montserrat, sans-serif",
  defaultRadius: "md",
});

function App() {
  return (
    <MantineProvider defaultColorScheme="dark" theme={theme}>
      <Router>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </Router>
    </MantineProvider>
  );
}

export default App;
