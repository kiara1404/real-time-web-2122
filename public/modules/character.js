const characterDiv = document.querySelector('.imgbox')

export const getNewCharacter = (data) => {
    const img = document.querySelector('img');
    if (img) {
        img.remove();
    }
    const characterImg = document.createElement('img');
    characterImg.src = data.url
        console.log(data)
        characterDiv.appendChild(characterImg);
        console.log(characterImg);
    
}