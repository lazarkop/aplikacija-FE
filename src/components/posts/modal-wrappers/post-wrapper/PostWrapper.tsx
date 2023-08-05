import React, { ReactElement, ReactNode } from "react";
import "./PostWrapper.scss";
import PropTypes from "prop-types";

interface PostWrapperProps {
  children: ReactNode;
}

const PostWrapper: React.FC<PostWrapperProps> = ({ children }) => {
  const childrenArray = React.Children.toArray(children) as ReactElement[];

  return (
    <div className="modal-wrapper" data-testid="post-modal">
      {childrenArray[1]}
      {childrenArray[2]}
      {childrenArray[3]}
      <div className="modal-bg"></div>
    </div>
  );
};

PostWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PostWrapper;
