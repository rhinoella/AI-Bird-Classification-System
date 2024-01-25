if (document.URL.includes('home')) {
    anchor = document.getElementById('Home')
    document.getElementById('Home').style.color = 'rgb(126, 126, 126)';
    document.getElementById('Home').style.borderBottom ='3px solid rgb(189, 189, 189)';
};
if (document.URL.includes('birdcaptures')) {
    document.getElementById('BirdCaptures').style.color = 'rgb(126, 126, 126)';
    document.getElementById('BirdCaptures').style.borderBottom ='3px solid rgb(189, 189, 189)';

};

const allCardThumbnails = document.getElementsByClassName('cardThumbnail');
for(let cardThumbnail of allCardThumbnails) {
    cardThumbnail.addEventListener('click', () => {
        var birdCard = cardThumbnail.parentNode;
        var cardModal = birdCard.querySelector('.cardModal');
        cardModal.style.display = 'block';
        var close = birdCard.querySelector('.close');
        var cardModal = birdCard.querySelector('.cardModal')
        close.addEventListener('click', () => {removeModal(cardModal)});
    });
};

function removeModal(cardModal) {
    cardModal.style.display = 'none';
};