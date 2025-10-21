document.addEventListener('DOMContentLoaded', () => {
  const playButton = document.getElementById('playBeat');
  const noteLine = document.getElementById('noteLine');
  const container = document.getElementById('noteLineContainer');
  let intervalId = null;
  let beatIndex = 0;

  // Define your sample files or audio context
  const audioFiles = {
    bass: new Audio('path/to/bass-sample.mp3'),
    tone: new Audio('path/to/tone-sample.mp3'),
    slap: new Audio('path/to/slap-sample.mp3')
  };

  // Default sequence (change to your own)
  const sequence = ['bass', 'tone', 'slap', 'tone'];

  playButton.addEventListener('click', () => {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
      playButton.textContent = 'Play beat';
    } else {
      beatIndex = 0;
      playButton.textContent = 'Stop beat';
      intervalId = setInterval(() => {
        const beatType = sequence[beatIndex % sequence.length];
        audioFiles[beatType].currentTime = 0;
        audioFiles[beatType].play();

        // Move noteLine indicator across container
        const pct = (beatIndex % sequence.length) / sequence.length;
        noteLine.style.left = (pct * 100) + '%';

        beatIndex++;
      }, 500); // 500ms per beat; adjust BPM accordingly
    }
  });

  // Change sequence when user clicks beat‐type buttons (optional)
  document.getElementById('beatTypes').addEventListener('click', (ev) => {
    const btn = ev.target;
    if (!btn.dataset.beat) return;
    const chosen = btn.dataset.beat;
    // For example: always alternate chosen beat with default
    sequence[beatIndex % sequence.length] = chosen;
  });
});
