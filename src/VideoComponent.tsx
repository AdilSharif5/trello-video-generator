//#region approach
/**
 *
 * I got two ways to do this
 * One I have get the all the lists and then get the "Done" List Id
 * Then get all the cards and check what list my card belongs to (my card
 * based on idShort)
 *
 * Another way
 * Two get all cards in the Done List and then check if it has my card in it
 * Based on idShort (can be seen in the URL on trello UI when card is opened)
 *
 * If we see clearly both ways require me to know the list ID, which takes two
 * calls but if we hardcode as we won't change it this should work.
 *
 * Why to choose second over first?
 * Only getting Done List cards returns less cards out of those we need to
 * filter out our required cards details, but in first approach we will get
 * all the cards in the board (increases by time), so those will cause big
 * performance issue later!
 *
 * Trick!!
 * To get the List ID, just open any of the card in it, and then in the url
 * add .json at the end and hit enter!
 * Eg:
 *  https://trello.com/c/ydA2h5Rk/19-test
 *  to
 *  https://trello.com/c/ydA2h5Rk/19-test.json
 * this will return all the data for the list in JSON format.
 *
 */
//#endregion

import { useState, useEffect, useRef } from "react";

import { AbsoluteFill, continueRender, delayRender, Sequence } from "remotion";
import { TOTAL_DURATION_IN_FRAMES } from "./Root";

// const LIST_ID = "67090a826b8145f3b3b5f716"; // Testing Trello API List ID
const LIST_ID = "66fa5dcc77e666bd2dc61f67"; // Done List ID
const TRELLO_KEY = process.env.REACT_APP_TRELLO_KEY;
const TRELLO_TOKEN = process.env.REACT_APP_TRELLO_TOKEN;
const CARDS_TO_TRACK = [7, 15, 19, 20];

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

type Ticket = {
  id: string;
  name: string;
  desc: string;
  idList: string;
  idShort: number;
};

export const VideoComponent = () => {
  const from = useRef(0);
  const duration = useRef(0);
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [handle] = useState(() => delayRender());

  useEffect(() => {
    // Fetch Trello data dynamically when building the video
    const fetchTrelloData = async () => {
      try {
        const response = await fetch(
          `https://api.trello.com/1/lists/${LIST_ID}/cards?key=${TRELLO_KEY}&token=${TRELLO_TOKEN}`
        );
        const doneCards = await response.json();
        const filteredCards = doneCards.filter((card: Ticket) =>
          CARDS_TO_TRACK.includes(card.idShort)
        );
        setTickets(filteredCards);
      } catch (e) {
        console.error("Error while fetching data from Trello: ", e);
        throw e;
      } finally {
        continueRender(handle);
      }
    };

    fetchTrelloData();
  }, []);

  if (!tickets) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {tickets.length > 0 &&
        tickets.map((ticket, index) => {
          const time = Math.round(TOTAL_DURATION_IN_FRAMES / tickets.length);
          duration.current = time;
          if (index) from.current += time;
          return (
            <Sequence from={from.current} durationInFrames={duration.current}>
              <MyVideo
                title={ticket.name}
                description={ticket.desc}
                status={"Done"}
              />
            </Sequence>
          );
        })}
    </>
  );
};
