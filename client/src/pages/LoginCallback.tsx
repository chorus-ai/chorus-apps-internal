import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function LoginCallback() {
  const [sp] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const email = sp.get("email") || "";
    // Always land on Signin, keep email in query (Signin will auto-handle it)
    if (email) {
      navigate(`/signin?email=${encodeURIComponent(email)}`, { replace: true });
    } else {
      navigate("/signin", { replace: true });
    }
  }, [sp, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      Redirecting…
    </div>
  );
}
