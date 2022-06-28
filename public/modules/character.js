const characterDiv = document.querySelector('main section')

export const getNewCharacter = (data) => {
    const img = document.querySelector('img');
    if (img) {
        img.remove();
    }
    const charcterImg = document.createElement('img');
        console.log(data)
        characterDiv.appendChild(charcterImg);
        console.log(charcterImg);
    
}