import { useEffect, useState } from "react";

import { Sequence, useCurrentFrame } from "remotion";

import AsideSection from "../../reusableComponents/asideSection/AsideSection";
import contextClasses from "../../Header/contextMenu/ContextMenu.module.css";
import { FakeCursor } from "../../reusableComponents/fakeCursor/FakeCursor";
import { reusableContent } from "../../constants";
import { useCursor } from "../../hooks/useCursor";
import ContextMenu, {
  Position,
  MenuItems,
} from "../../Header/contextMenu/ContextMenu";
import { Post } from "../../types";
import "./HtmlContentDisplay.css";
import { useZoomEffect } from "../../hooks/useZoomEffect";

type Definition = {
  partOfSpeech: string;
  definitions: {
    definition: string;
    synonyms: [];
    antonyms: [];
    example: string;
  }[];
};

export const appendContent = async (element: HTMLElement) => {
  const url = element.getAttribute("data-post-url");
  if (url) {
    const res = await fetchPost(url);

    const titleElement = element.querySelector(
      ".CollapsibleLink__title"
    ) as HTMLDivElement;
    const contentElement = element.querySelector(
      ".CollapsibleLink__content"
    ) as HTMLDivElement;

    const title = res?.title;
    titleElement.innerHTML = `<p><h3>${title}</h3></p>`; // .CollapsibleLink__title (child of .Collapisble__title class)

    const content = res?.content;
    contentElement.innerHTML = `<p>${content}</p>`; // .CollapsibleLink__content (child of .Collapisble__content class)
  }
};

const getDefFromDict = async (word: string) => {
  if (!word.trim()) return;
  const response = await fetch(
    `https://api.dictionaryapi.dev/api/v2/entries/en/${word.trim()}`
  );
  const body = await response.json();
  return body;
};

const getSelectedWord = (e: React.MouseEvent<HTMLDivElement>) => {
  const selectedLine = (e.target as HTMLElement).textContent;
  const selectedData = window.getSelection();
  const selectedContent = selectedLine?.slice(
    selectedData?.anchorOffset,
    selectedData?.focusOffset
  );
  return selectedContent;
};

const fetchPost = async (url: string): Promise<Post> => {
  console.log("Am I useless or this is useless :(", url);
  // console.error("No proper fetch method was provided");
  return new Promise((res, rej) =>
    res({
      id: "qw0w45",
      title: "Sample reusable post title",
      content: reusableContent,
      userId: "",
    })
  );
};

interface props {
  post?: Post;
  attr?: {
    style: null | object;
    className: {
      content: null | string;
    };
  };
  onScaleChange: (scale: number) => void;
}

const HtmlContentDisplay: React.FC<props> = ({ post, attr, onScaleChange }) => {
  const frame = useCurrentFrame();
  const { cursors, addCursors } = useCursor();
  const [postContent] = useState({
    title: post?.title,
    content: post?.content,
  });
  const [contextMenu, setContextMenu] = useState<null | {
    position: Position;
    menuItems: MenuItems[];
  }>(null);
  const [showAsideSection, setShowAsideSection] = useState(false);
  const [definitions, setDefinitions] = useState<Definition[] | null>(null);

  const scale = useZoomEffect({
    frame,
    startFrame: 285,
    zoomInDuration: 10,
    holdDuration: 69,
    zoomOutDuration: 10,
    fps: 30,
    maxScale: 2,
  });

  useEffect(() => {
    const selection = window.getSelection();
    selection?.removeAllRanges(); // Clear any existing selections
    const wordToSelect = document.querySelector(
      "#selection"
    ) as HTMLButtonElement;
    if (wordToSelect) {
      addCursors("selectWord", {
        position: {
          x: wordToSelect.offsetLeft ? wordToSelect.offsetLeft + 15 : 0,
          y: wordToSelect.offsetTop ? wordToSelect.offsetTop + 15 : 0,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (definitions) {
      onScaleChange(scale);
    }
  }, [scale, definitions]);

  const handleCloseContextMenu = () => {
    setContextMenu(null);
  };

  const getDefinition = async (selectedWord?: string) => {
    const dictionaryRes = (await getDefFromDict(selectedWord ?? "")) ?? [];
    setShowAsideSection(true);
    const defs: Definition[] = [];
    dictionaryRes.forEach((res: { meanings: Definition[] }) => {
      res.meanings?.forEach((meaning: Definition) => {
        const means = {
          partOfSpeech: meaning.partOfSpeech,
          definitions: meaning.definitions,
        };
        defs.push(means);
      });
    });
    setDefinitions(defs);
  };

  const handleDoubleClick = async (
    event?: React.MouseEvent<HTMLDivElement> | null,
    programmaticX?: number,
    programmaticY?: number,
    word?: string
  ) => {
    // Determine the x and y coordinates
    const x = event?.clientX ?? programmaticX ?? 0;
    const y = event?.clientY ?? programmaticY ?? 0;

    // Get the selected word
    const selectedWord = event ? getSelectedWord(event) : word;

    const menuItems = [
      { label: `Selected word is: ${selectedWord}` },
      {
        label: "Find the definition in dictionary",
        onClick: () => getDefinition(selectedWord),
      },
    ];

    setContextMenu({ position: { x, y }, menuItems });
  };

  const closeDefinitionSection = () => {
    setShowAsideSection(false);
    setDefinitions(null);
  };

  const selectTextById = async (elementId: string) => {
    const textElement = document.getElementById(elementId);

    if (textElement) {
      const range = document.createRange();
      range.selectNodeContents(textElement); // Select the entire text inside the element

      const selection = window.getSelection();
      selection?.removeAllRanges(); // Clear any existing selections
      selection?.addRange(range); // Add the new range to the selection

      const word = selection?.anchorNode?.textContent as string;
      await handleDoubleClick(
        null,
        cursors.get("selectWord")?.position?.x ?? 0,
        cursors.get("selectWord")?.position?.y ?? 0,
        word
      );
    } else {
      console.warn(`Element with ID ${elementId} not found`);
    }
  };

  const onSelectWord = () => {
    selectTextById("selection");
  };

  const triggerHoverEffect = (listItem: HTMLElement) => {
    listItem.classList.add(contextClasses.menuItemHover);

    // Optionally remove the class after a delay to mimic hover-out
    // we don't need as we will close the context, still better!!
    setTimeout(() => {
      listItem.classList.remove(contextClasses.menuItemHover);
      listItem.click();
    }, 1000);
  };

  const onMouseOverContextMenu = () => {
    const menuItem = document.querySelector("#ctx-item-1") as HTMLUListElement;
    menuItem && triggerHoverEffect(menuItem);
  };

  return (
    <>
      {postContent?.content && (
        <div
          className={`${attr?.className?.content ? attr?.className?.content + " " : ""}content`}
          style={attr?.style ?? {}}
          dangerouslySetInnerHTML={{
            __html:
              postContent.content || "<h1>Error: content not provided</h1>",
          }}
          onDoubleClick={handleDoubleClick}
        ></div>
      )}
      {contextMenu && (
        <ContextMenu
          position={contextMenu.position}
          menuItems={contextMenu.menuItems}
          onClose={handleCloseContextMenu}
        />
      )}
      {showAsideSection && (
        <AsideSection onClose={closeDefinitionSection}>
          {definitions ? (
            definitions?.map((definition) => (
              <div key={definition.partOfSpeech}>
                <h2>{definition.partOfSpeech}</h2>
                <ul>
                  {definition.definitions.map((def) => (
                    <li key={def.definition}>
                      <div>
                        <b>Definition:</b> {def.definition}
                      </div>
                      {def.example && (
                        <>
                          <br />
                          <div>
                            <b>Example:</b> {def.example}
                          </div>
                        </>
                      )}
                      <hr />
                      <br />
                    </li>
                  ))}
                </ul>
              </div>
            ))
          ) : (
            <>Sorry, we are also unaware of this word!</>
          )}
        </AsideSection>
      )}
      {cursors && (
        <Sequence from={220} durationInFrames={50}>
          <FakeCursor
            x={cursors.get("selectWord")?.position?.x ?? 0} // 1045px
            y={cursors.get("selectWord")?.position?.y ?? 0} // 612px
            initialX={cursors.get("publishStory")?.position?.x ?? 0}
            initialY={cursors.get("publishStory")?.position?.y ?? 0}
            onHover={onSelectWord}
          />
        </Sequence>
      )}
      {cursors && (
        <Sequence from={270} durationInFrames={80}>
          <FakeCursor
            x={(cursors.get("selectWord")?.position?.x ?? 0) + 50}
            y={(cursors.get("selectWord")?.position?.y ?? 0) + 60}
            initialX={cursors.get("selectWord")?.position?.x ?? 0}
            initialY={cursors.get("selectWord")?.position?.y ?? 0}
            onHover={onMouseOverContextMenu}
          />
        </Sequence>
      )}
    </>
  );
};

export default HtmlContentDisplay;
