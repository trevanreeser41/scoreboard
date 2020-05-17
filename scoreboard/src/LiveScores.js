import React, { useState, useEffect } from 'react';
//import ScoreboardTable from './ScoreboardTable';

const LiveScores = (props) => {
  const [isActive, setIsActive] = useState(false);

  function toggle() {
    setIsActive(!isActive);
  }

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        fetch(`http://site.api.espn.com/apis/site/v2/sports/${props.sport}/${props.league}/scoreboard`)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }        
                throw new Error("Unable to retrieve required data from server.");
            })
            .then(function (data) {
                let events = data.events;
                var games = [];
                for (var i = 0; i < events.length; i++) {
                    for (var j = 0; j < events[i].competitions.length; j++) {
                        games.push(events[i].competitions[j]);
                    }
                }
                return games;
            })
            .then(games => {
                for (let index = 0; index < games.length; index++) {
                    var scores = this.state.scores.concat(games[index].competitors[this.state.teamIndex].score);
                }
                return scores;
            })
            .catch(function (error) {
            console.log("Error: ", error.message);
            });
      }, 20000);
    } else if (!isActive) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  return (
    <div className="footer" onClick={toggle}>
      Get Live Scores
    </div>
  );
};

export default LiveScores;