import {
    FaBrain,
    FaSignOutAlt,
    FaUserCircle,
    FaFileMedical,
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

            {/* Logo */}

            <div className="logo">

                <FaBrain />

                <span>NeuroAI</span>

            </div>


            {/* Right Side */}

            <div className="navbar-right">


                {/* My Reports */}

                <button
                    className="my-reports-btn"
                    onClick={() => navigate("/reports")}
                >

                    <FaFileMedical />

                    <span>My Reports</span>

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

                    <span>Logout</span>

                </button>

            </div>

        </nav>

    );

}


export default Navbar;