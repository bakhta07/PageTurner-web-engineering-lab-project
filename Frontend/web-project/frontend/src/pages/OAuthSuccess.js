import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const OAuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { setUser } = useAuth(); // We need to expose setUser or use a method to update it

    useEffect(() => {
        const token = searchParams.get("token");
        const role = searchParams.get("role");

        if (token && role) {
            // Manually update context and storage
            localStorage.setItem("user", JSON.stringify({ role, token }));
            // Since AuthContext reads from localStorage on mount, we might need to force update 
            // or we could just reload. For a cleaner SPA experience, let's expose specific method if needed
            // But for now, let's assume a hard reload or simple navigation might work if AuthContext listens to logic
            // Actually, AuthContext initializes state from localStorage on load. 
            // So if we just navigate, the state won't update automatically unless we call a setter.
            // Let's create a special "socialLogin" or direct state update if possible.
            // Or simplest for integration: window.location.href = '/catalog' (forces reload)

            // However, keeping SPA is better. Let's see if we can just reload quickly

            window.location.assign(role === "admin" ? "/admin" : "/catalog");
        } else {
            toast.error("Google Login failed");
            navigate("/login");
        }
    }, [searchParams, navigate]);

    return (
        <div style={{ padding: "50px", textAlign: "center" }}>
            <h2>Logging you in...</h2>
        </div>
    );
};

export default OAuthSuccess;
