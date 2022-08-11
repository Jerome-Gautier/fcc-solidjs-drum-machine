import { Component, createSignal, For, onMount } from 'solid-js';

import "./styles.css";

import sound from "./assets/soundbank.json";

const App: Component = () => {
  const soundsList: Array<string> = Object.keys(sound);
  const [sounds, setSounds] = createSignal({ name: soundsList[0], data: sound[soundsList[0] as keyof typeof sound] });
  const [settings, setSettings] = createSignal({ volume: 1 });
  const [display, setDisplay] = createSignal("");

  const handleChangeSoundBank = () => {
    if (sounds().name === soundsList[0]) {
      setSounds({ name: soundsList[1], data: sound[soundsList[1] as keyof typeof sound] });
    } else if (sounds().name === soundsList[1]) {
      setSounds({ name: soundsList[0], data: sound[soundsList[0] as keyof typeof sound] });
    }
  }

  const handleSound = (sound: any) => {
    let elem = document.getElementById(sound.id);

    setDisplay(sound.id);
    elem?.classList.add("active");
    let audio = new Audio(sound.url);
    audio.volume = settings().volume;
    audio.play();
    setTimeout(() => {
      elem?.classList.remove("active");
    }, 100);
  }

  const handleChangeVolume = (e: any) => {
    let volume = e.target.value > 100 ? 100 :
      e.target.value < 1 ? 1 :
        e.target.value;
    setSettings({ ...settings(), volume: parseFloat(((parseFloat(volume) / 100) * 100).toFixed()) / 100 })
  }

  document.addEventListener("keydown", (e: any) => {
    let string = e.key.toUpperCase();
    sounds().data.forEach((sound: any) => {
      if (sound.keyTrigger === string) {
        handleSound(sound);
      }
    });
  });

  return (
    <div class="main-container">
      <div class="project-container">
        <div class="drumpads-container noselect">
          <For each={sounds().data}>{(sound) =>
            <div class="drumpads" id={sound.id} onclick={[handleSound, sound]}>
              <p>{sound.keyTrigger}</p>
            </div>
          }</For>
        </div>
        <div class="tools">
          <div class="volume-container">
            <div class="volume-display">
              <p>Volume</p>
              <input type="number" min="1" max="100" value={(settings().volume * 100).toFixed()} onChange={handleChangeVolume} />
            </div>
            <div class="slidecontainer">
              <input class="slider" type="range" min="1" max="100" value={(settings().volume * 100).toFixed()} onInput={handleChangeVolume} />
            </div>
          </div>
          <div class="sound-id-display" id="display">
            <p>{display()}</p>
          </div>
          <div class="bank-container">
            <div>Bank</div>
            <div class="bank-selector" onclick={handleChangeSoundBank}>
              <div class={`slider ${sounds().name === soundsList[1] && "active"}`}></div>
            </div>
            <div>{sounds().name}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
