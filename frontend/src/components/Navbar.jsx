import {
    FaBrain,
    FaSignOutAlt,
    FaUserCircle,
    FaFileMedical
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

function Navbar() {

    const navigate = useNavigate();

    const user = getCurrentUser();

    function logout() {

        localStorage.removeItem("access_token");

        navigate("/login");

    }

    return (

        <nav className="navbar">

            <div
                className="logo"
                onClick={() => navigate("/dashboard")}
                style={{ cursor: "pointer" }}
            >

                <FaBrain />

                <span>NeuroAI</span>

            </div>


            <div className="navbar-right">

                {/* My Reports */}

                <button
                    className="reports-btn"
                    onClick={() => navigate("/reports")}
                >

                    <FaFileMedical />

                    My Reports

                </button>


                {/* User */}

                <div className="user-info">

                    <FaUserCircle />

                    <span>

                        {user?.full_name || "User"}

                    </span>

                </div>


                {/* Logout */}

                <button
                    className="logout-btn"
                    onClick={logout}
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </nav>

    );

}

export default Navbar;