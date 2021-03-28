
/**
 * 
 * @param  color : exemple #faa020
 * @returns array [fa,a0,20]
 */
 export  function getColorsArray(color){
    var array = [];
    for (var i = 0; i < 3; i++) {
        let str = color.substring(2*i+2,2*i+4)
        console.log("color str ----->"+str)
        let c = parseInt(str, 16);
        array.push(c)
        
    }
    return array;
}
