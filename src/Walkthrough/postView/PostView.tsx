/**
 * @param {Props} props - The properties for rendering the post.
 * @param {Post} [props.post] - The post data.
 */
import { useState } from "react";

import CommentIcon from "../reusableComponents/svgs/CommentIcon";
import HtmlContentDisplay from "../packages/HtmlContentDisplay/HtmlContentDisplay";
import ClapIcon from "../reusableComponents/svgs/ClapIcon";
import Avatar from "../reusableComponents/avatar/Avatar";
import { reusableContentTwo } from "../constants";
import classes from "./PostView.module.css";
import { Post } from "../types";

interface props {
  post?: Post;
  onScaleChange: (scale: number) => void;
}

const PostView: React.FC<props> = ({ post, onScaleChange }) => {
  const postId = "asfasdf92w3044";
  const { state } = {
    state: {
      post: { id: postId, title: "", content: "", userId: "jkl543dfvd2" },
    },
  };
  post = state?.post;

  const [postContent] = useState<Post>({
    id: postId!,
    title: "Sample title",
    content: reusableContentTwo,
    claps: post?.claps ?? 68,
    userId: post?.userId ?? "",
    createdAt: post?.createdAt,
    comments: post?.comments ?? [],
    tags: post?.tags ?? [],
  });
  const [contentAuthor] = useState({
    name: "Test User",
    username: "",
    photoURL: "",
    id: "",
  });

  return (
    <article className={classes.postWrapper}>
      {postContent?.title && (
        <h1
          //   className={attr?.className?.title ?? "title"}
          style={{
            fontSize: "2.5rem",
            fontFamily: `sohne, "Helvetica Neue", Helvetica, Arial, sans-serif`,
            padding: "1rem 0",
          }}
        >
          {postContent.title}
        </h1>
      )}
      <div className={classes.authorDetails}>
        <Avatar width="42px" height="42px" imgSrc={contentAuthor?.photoURL} />
        <div>
          <span className={classes.authorName}>{contentAuthor.name}</span>
        </div>
      </div>
      <div className={classes.postInteractions}>
        <div className={classes.leftInteractions}>
          <ClapIcon label={postContent.claps ?? 0} />
          <CommentIcon />
        </div>
        //#region Add ThreeDotsIcons here!
      </div>
      {postContent?.content && (
        <HtmlContentDisplay onScaleChange={onScaleChange} post={postContent} />
      )}
      <div className={classes.tags}>
        {postContent.tags &&
          postContent.tags?.length > 0 &&
          postContent.tags?.map((tag) => (
            <div key={tag} className={classes.tag}>
              {tag}
            </div>
          ))}
      </div>
      <div className={classes.footerInteractions}>
        <ClapIcon label={postContent.claps ?? 0} />
        <CommentIcon />
      </div>
    </article>
  );
};

export default PostView;
