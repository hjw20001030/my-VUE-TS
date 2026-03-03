(() => {
    function str(){
        const H = window.innerWidth * (9/16);
        // const W = window.innerHeight * (16/9);
        if(H < window.innerHeight) {
            document.documentElement.style.height = H + 'px';
        }else{
            document.documentElement.style.height = 100+ '%';
        }
    }
    window.addEventListener('resize', () => {
        str();
    })
    str();
})()
