import React, { memo } from "react";
import classNames from "classnames";

interface TileProps {
	index: string;
  status: string;
  children: string;
}

const Tile: React.FC<TileProps> = ({index, status, children}) => {
  const classes = classNames(
    "w-16 h-16 sm:w-20 sm:h-20 border-2 inline-flex justify-center items-center text-2xl md:text-3xl  font-bold capitalize select-none",
    {
      "bg-green-400": status === "correct",
      "bg-yellow-200": status === "include",
      "bg-slate-300": status === "incorrect",
    },
  );

  return <div  className={classes} role="gridcell" data-testid={index}> {children}</div>;
};

export default memo(Tile);
