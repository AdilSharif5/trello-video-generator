/**
 * @param {null} props - Unused props
 */

import React, { useEffect, useState } from "react";

import { Sequence, useCurrentFrame } from "remotion";

import { FakeCursor } from "../reusableComponents/fakeCursor/FakeCursor";
import WriteIcon from "../reusableComponents/svgs/WriteIcon";
import BellIcon from "../reusableComponents/svgs/BellIcon";
import Button from "../reusableComponents/button/Button";
import Avatar from "../reusableComponents/avatar/Avatar";
import { useCursor } from "../hooks/useCursor";
import ThemeToggle from "./theme/ThemeToggle";
import classes from "./Header.module.css";

interface props {
  showEditor: boolean;
  setShowEditor: (value: boolean) => void;
  showIsPublish: () => void;
}

const Header: React.FC<props> = ({
  showEditor,
  setShowEditor,
  showIsPublish,
}) => {
  const frame = useCurrentFrame();
  const { cursors, addCursors } = useCursor();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const { currentUser } = {
    currentUser: {
      photoURL:
        "data:image/jpeg;base64,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",
      displayName: "",
    },
  };
  const { pathname } = { pathname: "" };
  const scrollDirection = "up";

  useEffect(() => {
    const themeSwitch = document.querySelector(
      "#button-container"
    ) as HTMLElement;
    const writeBtn = document.querySelector("#write-story") as HTMLElement;
    addCursors("changeTheme", {
      position: {
        x: themeSwitch?.offsetLeft ? themeSwitch.offsetLeft + 40 : 0,
        y: themeSwitch?.offsetTop ? themeSwitch.offsetTop + 20 : 0,
      },
    });
    addCursors("triggerWrite", {
      position: {
        x: writeBtn?.offsetLeft ? writeBtn.offsetLeft + 40 : 0,
        y: writeBtn?.offsetTop ? writeBtn.offsetTop + 20 : 0,
      },
    });
    addCursors("triggerPublish", {
      position: {
        x: themeSwitch?.offsetLeft ? themeSwitch.offsetLeft + 150 : 0,
        y: themeSwitch?.offsetTop ? themeSwitch.offsetTop + 20 : 0,
      },
    });
  }, []);

  useEffect(() => {
    // reset every single time
    if (frame < 10) {
      setIsDarkMode(false);
    }
  }, [frame]);

  const onMouseOverWriteBtn = (value: boolean) => {
    setShowEditor(value);
  };

  const onMouseOverThemeToggle = (value: boolean) => {
    setIsDarkMode(value ?? true);
  };

  const onMouseOverPublishBtn = () => {
    showIsPublish();
  };

  return (
    <header
      className={`${classes.headerWrapper} ${
        pathname.includes("new") && classes.paddingInlineHeader
      } ${
        scrollDirection === "up" || !scrollDirection
          ? classes.showHeader
          : classes.hideHeader
      }`}
    >
      <div className={classes.left}>
        <div id={classes.logo}>
          <a href="/"></a>
          {/** Medium logo used only for testing */}
        </div>
        <div className={classes.searchBar}>
          <input type="text" placeholder="Search" />
        </div>
      </div>
      <div className={classes.right}>
        <ThemeToggle isDarkMode={isDarkMode} />
        {!showEditor && (
          <div
            id="write-story"
            className={classes.postButton}
            onClick={() => onMouseOverWriteBtn(true)}
          >
            <WriteIcon />
            <div className={classes.iconCaption}>Write</div>
          </div>
        )}
        {showEditor && (
          <div className={classes.postButton}>
            <Button
              id="publish-story"
              label={"Publish"}
              style={{ color: "white", fontWeight: "bold" }}
              onClick={() => onMouseOverWriteBtn(false)}
            />
          </div>
        )}
        <div>
          <BellIcon />
        </div>
        <Avatar
          imgSrc={currentUser?.photoURL?.toString()}
          imgTitle={currentUser?.displayName?.toString()}
        />
      </div>
      {cursors && (
        <Sequence from={12} durationInFrames={40}>
          <FakeCursor
            x={cursors.get("changeTheme")?.position?.x ?? 0}
            y={cursors.get("changeTheme")?.position?.y ?? 0}
            onHover={onMouseOverThemeToggle}
          />
        </Sequence>
      )}
      {cursors && (
        <Sequence from={51} durationInFrames={30}>
          <FakeCursor
            x={cursors.get("triggerWrite")?.position?.x ?? 0}
            y={cursors.get("triggerWrite")?.position?.y ?? 0}
            initialX={cursors.get("changeTheme")?.position?.x ?? 0}
            initialY={cursors.get("changeTheme")?.position?.y ?? 0}
            onHover={onMouseOverWriteBtn}
          />
        </Sequence>
      )}
      {cursors && (
        <Sequence from={160} durationInFrames={30}>
          <FakeCursor
            x={cursors.get("triggerPublish")?.position?.x ?? 0}
            y={cursors.get("triggerPublish")?.position?.y ?? 0}
            initialX={cursors.get("confirmCollapsible")?.position?.x ?? 0}
            initialY={cursors.get("confirmCollapsible")?.position?.y ?? 0}
            onHover={onMouseOverPublishBtn}
          />
        </Sequence>
      )}
    </header>
  );
};

export default Header;
