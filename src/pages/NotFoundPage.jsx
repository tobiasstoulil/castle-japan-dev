import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="h-screen fixed z-[500] bg-white w-screen">
      <div
        className="select-none z-50 fixed left-[50%] top-[50%] -translate-x-[50%] -translate-y-[50%]
          flex flex-row gap-2.5 sm:gap-3 lg:gap-[1rem] 
          w-fit
          "
      >
        <h1 className="text-nowrap pointer-events-none antialiased font-frd text-xl sm:text-2xl lg:text-3xl !font-[300]">
          404 Not Found
        </h1>
        <h2 className="text-nowrap pointer-events-auto antialiased font-frd text-xl sm:text-2xl lg:text-3xl italic !font-[600]">
          <Link to="/">Link to home</Link>
        </h2>
      </div>
    </div>
  );
};

export default NotFoundPage;
