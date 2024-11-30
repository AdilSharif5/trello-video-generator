/**
 * @param {Function} [props.onClose] - Method to trigger after close.
 */

import { useEffect, useRef, useState } from "react";

import { Sequence } from "remotion";

import { FakeCursor } from "../../reusableComponents/fakeCursor/FakeCursor";
import Button from "../../reusableComponents/button/Button";
import { useCursor } from "../../hooks/useCursor";
import classes from "./PublishPost.module.css";

interface props {
  onClose: () => void;
}

const PublishPost: React.FC<props> = ({ onClose }) => {
  const { cursors, addCursors } = useCursor();
  const post = { activePost: { title: "", content: "" } };
  const { currentUser: user } = {
    currentUser: {
      displayName: "",
    },
  };

  const [topicStr, setTopicStr] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [featuredImage, setFeaturedImage] = useState("");
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLInputElement>(null);
  const tooManyTopics = topics.length >= 5;
  const topicRegx = /^$|^[A-Za-z0-9 _-]+$/;

  useEffect(() => {
    const htmlElement = createElementFromHTML(post.activePost.content);
    const imgElement = htmlElement.querySelector("img");
    imgElement && setFeaturedImage(imgElement.src);

    const publishBtn = document.querySelector(
      "#publish-story"
    ) as HTMLButtonElement;
    if (publishBtn) {
      addCursors("publishStory", {
        position: {
          x:
            publishBtn.offsetLeft +
            (publishBtn.parentElement as HTMLElement).offsetLeft +
            40,
          y:
            publishBtn.offsetTop +
            (publishBtn.parentElement as HTMLElement).offsetTop +
            20,
        },
      });
    }
  }, [post.activePost.content]);

  const addTopic = (topic: string) => {
    topic = topic.trim();
    if (tooManyTopics || !topic) return;
    const isDuplicate = topics.some(
      (t) => t.toLowerCase() === topic.toLowerCase()
    );
    if (isDuplicate) return;

    setTopics([...topics, topic]);
    setTopicStr("");
  };

  const removeTopic = (topic: string) => {
    setTopics((prevState) =>
      prevState.filter((filteredTopic) => filteredTopic !== topic)
    );
  };

  function onTopicChange(value: string) {
    // if last key pressed is double space or comma
    if (value.slice(-2) === "  " || value.slice(-1) === ",") {
      // remove the trailing comma before adding topic
      addTopic(value.replace(",", ""));
    } else if (topicRegx.test(value) && value.length <= 25) {
      setTopicStr(value);
    }
  }

  const handleSubmitData = async () => {
    onClose && onClose();
  };

  const onMouseOverPublishBtn = () => {
    onClose();
  };

  return (
    <div className={classes.publishPostWrapper}>
      <div className={classes.story}>
        <div className={classes.storyPreview}>
          <b className={classes.heading}>Story Preview</b>
          <div className={classes.featuredImageWrapper}>
            <div className={classes.featuredImageContainer}>
              {featuredImage ? (
                <img
                  src={featuredImage}
                  alt={post.activePost.title}
                  className={classes.featuredImage}
                />
              ) : (
                <span className={classes.thumbnail}>
                  Include a high-quality image in your story to make it more
                  inviting to readers.
                </span>
              )}
            </div>
          </div>
          <div className={classes.storyTitle}>
            <input
              ref={titleRef}
              id="title"
              type="text"
              maxLength={100}
              placeholder="Write a preview title"
              className={classes.storyInput}
            />
          </div>
          <div className={classes.storyDescription}>
            <input
              ref={descriptionRef}
              id="description"
              type="text"
              maxLength={140}
              placeholder="Write a preview subtitle"
              className={classes.storyInput}
            />
          </div>
        </div>

        <div className={classes.misc}>
          <p className={classes.heading}>
            Publishing to:{" "}
            <b className={classes.username}>{user?.displayName}</b>
          </p>
          <form
            className={classes.form}
            onSubmit={(e) => {
              e.preventDefault();
              addTopic(topicStr);
            }}
          >
            <label htmlFor="topic">
              Add topics (up to 5) so readers know what your story is about
            </label>

            <div className={classes.topics}>
              {topics.map((topic) => (
                <div className={classes.topicContainer} key={topic}>
                  <span className={classes.topic}>{topic}</span>
                  <button
                    type="button"
                    className={classes.removeTopicBtn}
                    onClick={() => removeTopic(topic)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            <input
              id="topic"
              placeholder={
                tooManyTopics ? "Maximum topics reached." : "Add a topic..."
              }
              className={classes.topicInput}
              onChange={(e) => onTopicChange(e.target.value)}
              value={topicStr}
              disabled={tooManyTopics}
              title={
                tooManyTopics ? "You can only add up to 5 topics." : undefined
              }
            />
          </form>
          <div className={classes.action}>
            <Button
              id="publish-story"
              label="Publish Now"
              style={{ color: "white", padding: "0.7rem 1.1rem" }}
              onClick={handleSubmitData}
            />
          </div>
        </div>
      </div>
      {cursors && (
        <Sequence from={190} durationInFrames={30}>
          <FakeCursor
            x={cursors.get("publishStory")?.position?.x ?? 0}
            y={cursors.get("publishStory")?.position?.y ?? 0}
            initialX={cursors.get("triggerPublish")?.position?.x ?? 0}
            initialY={cursors.get("triggerPublish")?.position?.y ?? 0}
            onHover={onMouseOverPublishBtn}
          />
        </Sequence>
      )}
    </div>
  );
};

const createElementFromHTML = (htmlString: string): HTMLElement => {
  const div = document.createElement("div");
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes.
  return div;
};

export default PublishPost;