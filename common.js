let links = document.querySelectorAll('.nav-link');
let links1 = document.querySelectorAll('.dropdown-item');
links.forEach(el => {
    el.addEventListener('mouseenter', function(){
        this.classList.add('active')
    })
    el.addEventListener('mouseleave', function(){
        this.classList.remove('active')
    })
})
links1.forEach(el => {
    el.addEventListener('mouseenter', function(){
        this.classList.add('active')
    })
    el.addEventListener('mouseleave', function(){
        this.classList.remove('active')
    })
})

