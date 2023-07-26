import "./Avatar.scss";
import React from "react";

export interface IAvatarProps {
  avatarSrc?: string;
  name?: string;
  bgColor?: string;
  textColor?: string;
  size?: number;
  round?: boolean;
}

const Avatar: React.FC<IAvatarProps> = ({
  avatarSrc,
  name,
  bgColor = "#f33e58",
  textColor,
  size = 0,
  round = true,
}) => {
  const textSizeRatio = 1.7;
  const fontSize = Math.floor(size / textSizeRatio);
  const firstNameCharacter = name?.charAt(0);

  return (
    <>
      {!avatarSrc && (
        <div
          data-testid="avatar-container"
          className="avatar-container"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${round ? "50%" : ""}`,
            backgroundColor: `${!avatarSrc ? bgColor : ""}`,
            display: "flex",
          }}
        >
          {name && (
            <div
              data-testid="avatar-name"
              style={{
                color: `${textColor}`,
                fontSize: `${fontSize}`,
                margin: "auto",
                fontWeight: "bold",
                textTransform: "uppercase",
              }}
            >
              {firstNameCharacter}
            </div>
          )}
        </div>
      )}

      {avatarSrc && (
        <img
          src={avatarSrc}
          alt=""
          className="avatar-content avatar-container"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            borderRadius: `${round ? "50%" : ""}`,
          }}
        />
      )}
    </>
  );
};

export default Avatar;
