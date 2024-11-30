import { useEffect, useState } from "react";

import { useCurrentFrame } from "remotion";

import ManipulatePost from "./manipulatePost/ManipulatePost";
import PublishPost from "./Header/publishPost/PublishPost";
import { useZoomEffect } from "./hooks/useZoomEffect";
import PostView from "./postView/PostView";
import Header from "./Header/Header";
import "./AppShowcase.css";

interface props {
  onScaleChange: (scale: number) => void;
}

const AppShowcase: React.FC<props> = ({ onScaleChange }) => {
  const frame = useCurrentFrame();
  const [isView, setIsView] = useState(false);
  const [isPublish, setIsPublish] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const scale = useZoomEffect({
    frame,
  }); // when 'startFrame' is '0' other values can be left default

  useEffect(() => {
    onScaleChange(scale);
  }, [scale]);

  useEffect(() => {
    if (frame < 10) {
      setIsView(false);
      setShowEditor(false);
      setIsPublish(false);
    }
  }, [frame]);

  const showIsPublish = () => {
    setShowEditor(false);
    setIsPublish(true);
  };

  const closeIsPublish = () => {
    setShowEditor(false);
    setIsPublish(false);
    setIsView(true);
  };

  return (
    <div id="my-app">
      <Header
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        showIsPublish={showIsPublish}
      />
      <div className="main-container">
        {showEditor && <ManipulatePost isNewPost />}
        {isPublish && (
          <div className="Modal__overlay" role="dialog">
            <div className="Modal__content">
              <PublishPost onClose={closeIsPublish} />
            </div>
          </div>
        )}
        {isView && <PostView onScaleChange={onScaleChange} />}
      </div>
    </div>
  );
};

export default AppShowcase;
