import classNames from "classnames";
import React from "react";

interface TileProps {
  status: string;
  children: string;
}

const Tile: React.FC<TileProps> = ({status, children}) => {
  const classes = classNames(
    "w-20 h-20 border-2 inline-flex justify-center items-center text-2xl font-bold capitalize select-none",
    {
      "bg-green-400": status === "correct",
      "bg-yellow-200": status === "include",
      "bg-slate-300": status === "filled",
    },
  );

  return <div className={classes}> {children}</div>;
};

export default React.memo(Tile);
