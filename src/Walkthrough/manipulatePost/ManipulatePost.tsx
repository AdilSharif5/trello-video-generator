/**
 * @param {Props} props - The properties for rendering the post.
 * @param {boolean} [props.isNewPost] - Indicates if the post is new.
 * @param {Post} [props.post] - The post data.
 */
import { ChangeEvent, useEffect, useState } from "react";

import { random, Sequence, useCurrentFrame } from "remotion";

import { FakeCursor } from "../reusableComponents/fakeCursor/FakeCursor";
import classes from "./ManipulatePost.module.css";
import Editor from "../packages/Editor/Editor";
import { useCursor } from "../hooks/useCursor";
import { reusableContent } from "../constants";
import { Post } from "../types";

interface props {
  isNewPost?: boolean;
  post?: Post;
}

const initialPostData = {
  title: "",
  content: "",
};

const ManipulatePost: React.FC<props> = ({
  isNewPost = true,
  post,
}) => {
  const { cursors, addCursors } = useCursor();
  const frame = useCurrentFrame();
  const showText = frame > 40;
  const { state } = {
    state: {
      post: { id: "0x23s4f4", title: "", content: "", userId: "a0saf0asf" },
    },
  };
  post = state?.post;

  const [postData, setPostData] = useState<{
    title: string;
    content: string;
  }>(initialPostData);

  useEffect(() => {
    const collapsibleBtn = document.querySelector(
      "#insert-collapsible-container"
    ) as HTMLButtonElement;
    addCursors("triggerCollapsible", {
      position: {
        x:
          collapsibleBtn.offsetLeft && collapsibleBtn.parentElement?.offsetLeft
            ? collapsibleBtn.offsetLeft +
              collapsibleBtn.parentElement?.offsetLeft +
              30
            : 930,
        y: collapsibleBtn.parentElement?.offsetTop
          ? collapsibleBtn.parentElement?.offsetTop + 30
          : 0,
      },
    });
  }, []);

  useEffect(() => {
    if (!isNewPost) {
      const updatedPost = {
        title: post?.title ?? "",
        content: post?.content ?? "",
      };
      setPostData(updatedPost);
    }
    if (showText && !postData.title) {
      onInputChange("title", "Sample title");
    } else if (!showText && postData.title) {
      onInputChange("title", initialPostData.title);
    }
  }, [isNewPost, post, showText]);

  const onInputChange = (key: string, value: string) => {
    if (key) {
      setPostData((prevData) => {
        if (!key) return prevData;

        const newData = { ...prevData, [key]: value };

        return newData;
      });
    }
  };

  const setTitleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    onInputChange("title", e.target.value);
  };

  const popUpObserver = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList") {
        const collapsibleAddBtn = document.querySelector(
          ".Button__root"
        ) as HTMLButtonElement;

        if (collapsibleAddBtn) {
          addCursors("confirmCollapsible", {
            position: {
              x:
                collapsibleAddBtn.offsetLeft &&
                (collapsibleAddBtn.offsetParent as HTMLElement)?.offsetLeft
                  ? (collapsibleAddBtn.offsetParent as HTMLElement)
                      ?.offsetLeft +
                    collapsibleAddBtn.offsetLeft +
                    30
                  : 0,
              y:
                (collapsibleAddBtn.offsetParent as HTMLElement)?.offsetTop &&
                collapsibleAddBtn.offsetTop
                  ? (collapsibleAddBtn.offsetParent as HTMLElement)?.offsetTop +
                    collapsibleAddBtn.offsetTop +
                    30
                  : 0,
            },
          });
          // Stop observing after finding the button
          popUpObserver.disconnect();
        }

        // const publishBtn = document.querySelector(
        //   "#publish-story"
        // ) as HTMLButtonElement;
        // console.dir(publishBtn);

        // if (publishBtn) {
        //   addCursors("triggerPublish", {
        //     position: {
        //       x:
        //         publishBtn.offsetLeft &&
        //         (publishBtn.offsetParent as HTMLElement)?.offsetLeft
        //           ? (publishBtn.offsetParent as HTMLElement)?.offsetLeft +
        //             publishBtn.offsetLeft +
        //             30
        //           : 0,
        //       y:
        //         (publishBtn.offsetParent as HTMLElement)?.offsetTop &&
        //         publishBtn.offsetTop
        //           ? (publishBtn.offsetParent as HTMLElement)?.offsetTop +
        //             publishBtn.offsetTop +
        //             30
        //           : 0,
        //     },
        //   });
        // }
      }
    }
  });

  const onMouseOverCollapsibleBtn = () => {
    const collapsibleBtn = document.querySelector(
      "#insert-collapsible-container"
    ) as HTMLButtonElement;
    collapsibleBtn.click();

    // Start observing the popup container for changes
    const popupContainer = document.querySelector(".toolbar");
    if (popupContainer) {
      popUpObserver.observe(popupContainer, { childList: true, subtree: true });
    }
  };

  const onMouseOverCollapsibleConfirmBtn = () => {
    const linkInputField = document.querySelector(
      ".Input__input"
    ) as HTMLInputElement;
    const collapsibleAddBtn = document.querySelector(
      ".Button__root"
    ) as HTMLButtonElement;
    if (linkInputField && linkInputField.value) {
      linkInputField.value = "NotVSauce.com";
    }
    collapsibleAddBtn && collapsibleAddBtn.click();
  };

  return (
    <>
      <div className={classes.titleField}>
        <input
          type="text"
          name="post-title"
          className={classes.titleInput}
          maxLength={150}
          value={postData.title}
          onChange={setTitleOnChange}
        />
      </div>
      <div className={classes.editor}>
        <Editor
          key={random("editor")}
          namespace="new-post-editor"
          initialEditorState={post?.content}
          fetchPost={async (url: string) => {
            console.log("Am I useless or this is useless :(", url);
            // console.error("No proper fetch method was provided");
            return new Promise((res, rej) =>
              res({
                id: "qw0w45",
                title: "Sample reusable post title",
                content: reusableContent,
              })
            );
          }}
          onInputChange={onInputChange}
        />
      </div>
      {cursors && (
        <Sequence from={85} durationInFrames={50}>
          <FakeCursor
            x={cursors.get("triggerCollapsible")?.position?.x ?? 0}
            y={cursors.get("triggerCollapsible")?.position?.y ?? 0}
            initialX={cursors.get("triggerWrite")?.position?.x ?? 0}
            initialY={cursors.get("triggerWrite")?.position?.y ?? 0}
            onHover={onMouseOverCollapsibleBtn}
          />
        </Sequence>
      )}

      {cursors && (
        <Sequence from={140} durationInFrames={20}>
          <FakeCursor
            x={cursors.get("confirmCollapsible")?.position?.x ?? 0} // 1045px
            y={cursors.get("confirmCollapsible")?.position?.y ?? 0} // 612px
            initialX={cursors.get("triggerCollapsible")?.position?.x ?? 0}
            initialY={cursors.get("triggerCollapsible")?.position?.y ?? 0}
            onHover={onMouseOverCollapsibleConfirmBtn}
          />
        </Sequence>
      )}
    </>
  );
};

export default ManipulatePost;
