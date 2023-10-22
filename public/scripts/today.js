$('li input').on('click', (event) => {
    const checkbox = document.querySelector('#' + event.target.id);
    if(checkbox.checked) {
        document.querySelector("#" + event.target.id + "Label").style.textDecoration = 'line-through';
    }
    else {
        document.querySelector("#" + event.target.id + "Label").style.textDecoration = 'none';
    }
});