import React, { memo } from "react";
import classNames from "classnames";

interface TileProps {
  status: string;
  children: string;
}

const Tile: React.FC<TileProps> = ({ status, children }) => {
  const classes = classNames(
    "w-16 h-16 sm:w-20 sm:h-20 border-2 inline-flex justify-center items-center text-2xl md:text-3xl  font-bold capitalize select-none",
    {
      "bg-green-500 text-white": status === "correct",
      "bg-yellow-400 text-white": status === "include",
      "bg-gray-700 text-white": status === "incorrect",
      "border-slate-400": children !== '' && status === "empty",
    },
  );

  return <div aria-label={children} title={children} className={classes} role="gridcell" data-testid={children}> {children}</div>;
};

export default memo(Tile);
