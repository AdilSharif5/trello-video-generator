import { useState, useEffect } from "react";

import { AbsoluteFill, Composition } from "remotion";

export const MyVideo = ({
  title,
  description,
  status,
}: {
  title: string;
  description: string;
  status: string;
}) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "4rem",
      }}
    >
      <center>
        <h1>{title}</h1>
        <p>{description}</p>
        <span>Status: {status}</span>
      </center>
    </AbsoluteFill>
  );
};

export const VideoComponent = () => {
  const [ticketData, setTicketData] = useState<
    | {
        name: string;
        desc: string;
        idList: string;
      }[]
    | null
  >(null);

  useEffect(() => {
    // Fetch Trello data dynamically when building the video
    const fetchTrelloData = async () => {
      //   const response = await fetch(
      //     `https://api.trello.com/1/boards/YOUR_BOARD_ID/cards?key=${process.env.REACT_APP_TRELLO_KEY}&token=${process.env.REACT_APP_TRELLO_TOKEN}`,
      //   );
      //   const data = await response.json();
      const data = [
        { name: "1", desc: "2", idList: "3" },
        { name: "1", desc: "2", idList: "3" },
      ];
      setTicketData(data);
    };

    fetchTrelloData();
  }, []);

  if (!ticketData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Composition
        id="MyVideo"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: ticketData[0].name,
          description: ticketData[0].desc,
          status:
            ticketData[0].idList === "DONE_LIST_ID" ? "Done" : "In Progress",
        }}
      />
      <Composition
        id="MyVideo2"
        component={MyVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          title: ticketData[1].name,
          description: ticketData[1].desc,
          status:
            ticketData[1].idList === "DONE_LIST_ID" ? "Done" : "In Progress",
        }}
      />
    </>
  );
};
