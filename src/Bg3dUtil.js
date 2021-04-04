


var normalize = function (p) {
    let r;
    
    //var length = Math.sqrt(p[0] * p[0] + p[1]* p[1]+p[2] * p[2]); //calculating length
    // I don't need to be accurate , and sqrt is expensive ....
    
    var length =  (Math.abs(p[0])+Math.abs(p[1])+Math.abs(p[2]))/3.0;
    if (length ===0){
        r = [0,0,1];
    }else {
        r =[p[0]/length, p[1]/length,p[2]/length];
    }
    return r;
}

export function getNormal(p1, p2, p3) {
    let v1 = diff(p1, p2);
    let v2 = diff(p1, p3);
    let v3 = vectoriel(v1, v2);
    let normal = normalize(v3);
   
    return normal;
}

function diff(p1, p2) {
    let pDiff = [p2[0] - p1[0],p2[1] - p1[1],p2[2] - p1[2]];
    
    return pDiff
}

function vectoriel(u, v) {
    let u1 = u[0];
    let u2 = u[1];
    let u3 = u[2];
    let v1 = v[0];
    let v2 = v[1];
    let v3 = v[2]
    let r1 = u2 * v3 - u3 * v2;
    let r2 = u3 * v1 - u1 * v3;
    let r3 = u1 * v2 - u2 * v1;
    let pResult = [r1, r2, r3];

    return pResult
}



