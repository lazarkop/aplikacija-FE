/* eslint-disable react/prop-types */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
/* import PropTypes from "prop-types";
import "@components/dialog/Dialog.scss";
import Button from "@components/button/Button"; */

const PostCommentSection = ({ post }) => {
  return <div data-testid="comment-section">PostCommentSection {post._id}</div>;
};

export default PostCommentSection;
