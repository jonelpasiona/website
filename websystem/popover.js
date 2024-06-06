
function showPopover(event) {
    const popoverOverlay = document.getElementById('popover-overlay');
    const popover = document.getElementById('popover');
    const item = event.currentTarget;

    const name = item.getAttribute('data-name');
    const price = item.getAttribute('data-price');
    const description = item.getAttribute('data-description');
    const stars = item.getAttribute('data-stars');
    const imgSrc = item.getAttribute('data-img');

    document.getElementById('popover-title').innerText = name;
    document.getElementById('popover-description').innerText = description;
    document.getElementById('popover-price').innerText = 'Price: P' + price;
    document.getElementById('popover-img').src = imgSrc;

    // Create stars
    const starDiv = document.getElementById('popover-stars');
    starDiv.innerHTML = '';
    const numStars = parseInt(stars);
    for (let i = 0; i < 5; i++) {
        const starIcon = document.createElement('i');
        starIcon.classList.add('mdi', 'mdi-star');
        if (i < numStars) {
            starIcon.style.color = '#FFD700'; // Filled star color
        } else {
            starIcon.style.color = '#ccc'; // Empty star color
        }
        starDiv.appendChild(starIcon);
    }

    popoverOverlay.style.display = 'block';
}

function hidePopover() {
    document.getElementById('popover-overlay').style.display = 'none';
}

document.querySelectorAll('.pro').forEach(function(element) {
    element.addEventListener('click', showPopover);
});

document.getElementById('popover-overlay').addEventListener('click', function(event) {
    if (event.target === this) {
        hidePopover();
    }
});