document.addEventListener('DOMContentLoaded', function() {
  const h1 = document.querySelector('h1');
  h1.style.cursor = 'pointer';
  h1.addEventListener('click', function() {
    const emojis = ['😃', '🎉', '🚀', '✨', '😎', '🥳', '👾', '🦄'];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    h1.textContent = `Hello World ${randomEmoji}`;
    h1.style.color = `hsl(${Math.random()*360}, 80%, 60%)`;
    h1.style.transform = `scale(${1 + Math.random()*0.5}) rotate(${Math.random()*20-10}deg)`;
    setTimeout(() => {
      h1.style.transform = '';
    }, 500);
  });
});
