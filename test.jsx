{
  /* <PopoverTrigger asChild>
        {isEditMode ? (
          <div>
            <div className="sm:hidden">
              <button
                variant="default"
                className={`px-2 py-1 bg-yellow-400 hover:bg-yellow-600 rounded-lg text-black text-xs`}
              >
                <Edit className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden sm:block">
              <Button
                variant="ghost"
                size="icon"
                className={`transition-all duration-200 ${
                  isHovered ? "bg-blue-50" : ""
                }`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <Edit
                  className={`h-4 w-4 transition-all duration-200 ${
                    isHovered ? "text-blue-500" : ""
                  }`}
                />
              </Button>
            </div>
          </div>
        ) : (
          <>
            {pathname == "/master/branch" ? (
              <div>
                <div className="sm:hidden">
                  <Button
                    onClick={() => setOpen(true)}
                    variant="default"
                    className={`md:ml-2 bg-yellow-400 hover:bg-yellow-600 text-black rounded-l-full`}
                  >
                    <SquarePlus className="h-4 w-4" /> Buyer
                  </Button>
                </div>
                <div className="hidden sm:block">
                  <Button
                    onClick={() => setOpen(true)}
                    variant="default"
                    className={`md:ml-2 ${ButtonConfig.backgroundColor} ${ButtonConfig.hoverBackgroundColor} ${ButtonConfig.textColor}`}
                  >
                    <SquarePlus className="h-4 w-4 mr-2" /> Buyer
                  </Button>
                </div>
              </div>
            ) : pathname === "/purchase/create" ||
              pathname === "/dispatch/create" ||
              "/purchase/edit" ? (
              <p className="text-xs text-red-600  w-32 hover:text-red-300 cursor-pointer">
                Buyer <span className="text-red-500 ml-1">*</span>
              </p>
            ) : (
              <span />
            )}
          </>
        )}
      </PopoverTrigger> */
}
