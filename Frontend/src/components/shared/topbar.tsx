import { Link, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";

const Topbar = () => {
  const nav = useNavigate()
  const signOut = () => {
    localStorage.removeItem('email')
    localStorage.removeItem('erp')
    localStorage.removeItem('name')
    localStorage.removeItem('token')
    nav("/login")
  }

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
        <h2 className="h2-bold md:h2-bold pb-0 pl-0">
          Student Connect
        </h2>
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={() => signOut()}>
            <img src="/assets/icons/logout.svg" alt="logout" />
          </Button>
          <Link to={`/profile/${localStorage.getItem('erp') || ""}`} className="flex-center gap-3">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;