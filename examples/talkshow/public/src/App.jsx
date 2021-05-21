import { forEach, get } from 'lodash';
import React, { useMemo, useState } from 'react';

import styles from './App.module.scss';

const client = new alterse.Client();

function useAlterse() {
  const [state, setState] = useState(client.state.value);

  client.state.on("change", ({ value }) => {
    setState(value);
  });

  return { client, state };
}

function App() {
  const { state } = useAlterse();

  const speakers = useMemo(() => {
    const result = [];

    forEach(state.speakers, (speaker) => {
      const discord = get(speaker, ["discord"]);
      const profile = get(speaker, ["profile"]);
      const voiceState = get(state, ["voiceStates", discord.id]);

      if (!voiceState) {
        return;
      }

      result.push({
        id: discord.id,
        name: profile.name,
        twitter: profile.twitter,
        description: profile.description,
        speaking: voiceState.speaking,
        avatar: voiceState.avatar,
      });
    });

    return result;
  }, [state]);

  return (
    <div className={styles.wrapper}>
      {speakers.map((speaker) => (
        <Speaker key={speaker.id} className={styles.speaker} {...speaker} />
      ))}
    </div>
  )
}

export default App
