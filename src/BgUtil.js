
/**
 * 
 * @param  color : exemple #faa020
 * @returns array [fa,a0,20]
 */
export function getColorsArray(color) {
    var array = [];
    for (var i = 0; i < 3; i++) {
        let str = color.substring(2 * i + 2, 2 * i + 4)
        console.log("color str ----->" + str)
        let c = parseInt(str, 16);
        array.push(c)

    }
    return array;
}

export function extractContours(imageData) {

    let imageDataNew = new ImageData(
        imageData.width,
        imageData.height
    );
    console.log("imageDataNew ",imageDataNew)
    let dataNew = imageDataNew.data;
    console.log("data ",dataNew)
    let nContour = 0;
    let nContourNo = 0;
    for (var i = 0; i < imageData.width; i++) {
        for (var j = 0; j < imageData.height; j++) {
            let k = 4 * (i * imageData.width + j);
           
            if (isContour(i, j, imageData)) {
                nContour++;
                dataNew[k] = 0;
                dataNew[k + 1] = 0;
                dataNew[k + 2] = 0xff;
                dataNew[k+3] = 0xff;
            } else {
                nContourNo++;
                dataNew[k] = 0xff;
                dataNew[k + 1] = 0;
                dataNew[k + 2] = 0;
                dataNew[k+3] = 0xff;
            }
        }
    }
    console.log("nContour :" + nContour + "  nContourNo :" + nContourNo)
    return imageDataNew;
}

function isContour(i, j, imageData) {
    let w = imageData.width;
    let h = imageData.height;


    let color0 = getColors(i, j, imageData);
    let color1 = getColors(i - 1, j, imageData);
    let color2 = getColors(i + 1, j, imageData);
    let color3 = getColors(i, j - 1, imageData);
    let color4 = getColors(i, j + 1, imageData);
    if (!colorEqual(color0, color1)) {
        return true;
    }
    if (!colorEqual(color0, color2)) {
        return true;
    }
    if (!colorEqual(color0, color3)) {
        return true;
    }
    if (!colorEqual(color0, color4)) {
        return true;
    }
    return false;
}


function getColors(i, j, imageData) {
    if (i < 0) return;
    if (j < 0) return;
    if (i > imageData.width) return;
    if (j > imageData.height) return;
    let k = 4 * (i * imageData.width + j);
    let colors = [];
    for (let i = 0; i < 3; i++) {
        let c = imageData.data[k + i];
        colors.push(c)
    }
    return colors;
}


function colorEqual(color0, color1) {
    if (color0 && color1) {
        for (let i = 0; i < 3; i++) {
            if (color0[i] !== color1[i]) {
                return false;
            }
        }
    }
    return true;
}
