const toggle = document.querySelector('.toggle');
const navigation = document.querySelector('.navigation');
const main = document.querySelector('.main');
toggle.addEventListener('click', ()=>{
    toggle.classList.toggle('active');
    navigation.classList.toggle('active');
    main.classList.toggle('active');
});