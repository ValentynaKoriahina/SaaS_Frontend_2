import { useState } from "react";
import { NavLink } from "react-router-dom";

interface Props {
  color: string;
  style?: string;
  disable?: boolean;
  e: any;
  hasNewMessage: number;
}

const DashboardButton = ({ color, style, disable, e, hasNewMessage }: Props) => {
  const [display, setDisplay] = useState("");
  console.log(disable)

  return (
    <>
      {!disable ? (
        <button
          type="button"
          className={"btn btn-" + color + " " + style + " " + display}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }} // Используем flexbox для отображения элементов в столбик
        >
          <NavLink to={`/Messages/${e.order_id}/${e.client_id}`} style={{ textDecoration: 'none', color:  '#033c5a' }}>
            Message
          </NavLink>
          {hasNewMessage === 1 && (
            <span style={{ color: 'red' }}>New</span>
          )} {/* Show the word "New" as an indicator of a new message */}
        </button>
      ) : (
        <></>
      )}
    </>
  );
};

export default DashboardButton;
