import { Link, NavLink, useLocation, useNavigate} from "react-router-dom";

import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const nav = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('erp')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    nav("/login")
  };

  return (
    <nav className="leftsidebar ">
      <div className="flex flex-col gap-11">
        <div>
        <Link to="/" className="flex items-center gap-3">
        <h2 className="h1-bold md:h1-bold pb-6 pl-2">
          Student Connect
        </h2>
        </Link>
          <Link to={"/"} className="flex gap-3 items-center">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{localStorage.getItem('name')||"name"}</p>
              <p className="small-regular text-light-3">{localStorage.getItem('email')||"email"}</p>
            </div>
          </Link>
        </div>
        

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4">
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={() => handleSignOut()}>
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;