const toggleButton = document.querySelector('.dark-light');
const colors = document.querySelectorAll('.color');

colors.forEach(color => {
  color.addEventListener('click', (e) => {
    colors.forEach(c => c.classList.remove('selected'));
    const theme = color.getAttribute('data-color');
    document.body.setAttribute('data-theme', theme);
    color.classList.add('selected');
  });
});

toggleButton.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
});


// shows heart when you click on match "play" button
const submit = document.getElementById("play-button")
const match = document.getElementById("match")

//whenever the button is clicked, toggle the ".hidden" class in css file
submit.addEventListener("click", (event) => {
    event.preventDefault();
    match.classList.toggle("hidden")
    // document.getElementById("play-button").innerHTML = String.fromCodePoint(0x1F621);
})

