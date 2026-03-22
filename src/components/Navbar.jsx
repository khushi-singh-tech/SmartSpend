import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../services/authentication';
import './Nacbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          💰 Smart-Spend
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {user ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transactions">Transactions</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/reports">Reports</Link>
                </li>
                {user.role === 'ADMIN' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Panel</Link>
                  </li>
                )}
                <li className="nav-item">
                  <span className="nav-link">Welcome, {user.name}</span>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-light" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { authService } from '../services/authentication';
// import './Nacbar.css';

// const Navbar = () => {
//   const navigate = useNavigate();
//   const user = authService.getCurrentUser();

//   const handleLogout = () => {
//     authService.logout();
//     navigate('/login');
//   };

//   return (
//     <nav className="navbar navbar-expand-lg custom-navbar">
//       <div className="container-fluid navbar-row">
//         <Link className="navbar-brand brand-logo text-light" to="/">
//           💰 Money Manager
//         </Link>

//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>

//         <div className="collapse navbar-collapse d-flex align-items-center justify-content-between" id="navbarNav">
//           <ul className="navbar-nav ms-auto d-flex flex-row align-items-center gap-3">

//             {user ? (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link nav-hover text-light" to="/">Dashboard</Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link nav-hover text-light" to="/transactions">Transactions</Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="nav-link nav-hover text-light" to="/reports">Reports</Link>
//                 </li>

//                 {user.role === 'ADMIN' && (
//                   <li className="nav-item">
//                     <Link className="nav-link nav-hover text-light" to="/admin">Admin Panel</Link>
//                   </li>
//                 )}

//                 <li className="nav-item">
//                   <span className="nav-link welcome-text text-light">
//                     Welcome, {user.name}
//                   </span>
//                 </li>

//                 <li className="nav-item">
//                   <button className="btn logout-btn text-light" onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <>
//                 <li className="nav-item">
//                   <Link className="nav-link nav-hover text-light" to="/login">Login</Link>
//                 </li>

//                 <li className="nav-item">
//                   <Link className="btn register-btn ms-2 text-light" to="/register">
//                     Register
//                   </Link>
//                 </li>
//               </>
//             )}

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;