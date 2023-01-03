// collect all necessary referance


//Global
let div = null;
const defeoldPresetColor = [
    "#464F07", "#636788", "#46A44B", "#2E5A56", "#98FB79", "#A66DBC",
    "#670EE9", "#721281", "#923B1F", "#00C098", "#8DD06E", "#AB18F9",
    "#9092DB", "#EEA150", "#6038AD",]
let customColor = new Array(10)
//Onload handler
window.onload = () => {
    main()
    displayColorBoxes(document.getElementById("preset-color-parents"), defeoldPresetColor)

    const customColorStringfy = localStorage.getItem('custom-color')
    if (customColorStringfy) {
        customColor = JSON.parse(customColorStringfy);

        displayColorBoxes(document.getElementById("custom-color-parents"), customColor)
    }
}

//Main function or Boot function and collert All reference
function main() {

    //Dom Reference....
    const generateRandomColorBtn = document.getElementById("change-btn")
    const hexColorInp = document.getElementById("hex-input");
    const colorSliderRed = document.getElementById("color-slider-red");
    const colorSliderGreen = document.getElementById("color-slider-green")
    const colorSliderBlue = document.getElementById("color-slider-blue")
    const clipboardCopyBtn = document.getElementById("clicpboard-copy-btn")
    const clipboardSaveBtn = document.getElementById("clicpboard-save-btn")
    const presetColorParent = document.getElementById("preset-color-parents")
    const customColorParent = document.getElementById("custom-color-parents");
    const backgroundUpdateBtn = document.getElementById("background-update-btn")
    const backgroundFileDelete = document.getElementById("background-delete-btn");
    const bgController = document.getElementById("bg-img-control");
    bgController.style.display = 'none'
    //Event Lesener.....
    generateRandomColorBtn.addEventListener("click", handeGenerateRandomColorbtn)
    hexColorInp.addEventListener("keyup", handelHexColorInp)
    clipboardCopyBtn.addEventListener("click", handleClicpboardCopyBtn)
    colorSliderRed.addEventListener("change", handelColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderGreen.addEventListener("change", handelColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    colorSliderBlue.addEventListener("change", handelColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue))
    presetColorParent.addEventListener("click", handelPresetColorParent)
    customColorParent.addEventListener("click", handelCustomColorBtn)
    clipboardSaveBtn.addEventListener("click", handelCustomColor(customColorParent, hexColorInp))
    function handeGenerateRandomColorbtn() {
        let decemalCode = generateDecemalColor();
        updateColorCodeToDom(decemalCode)
    }

    backgroundUpdateBtn.addEventListener("click",function (){
        const backgroundFileInput = document.getElementById("background-file-input");
        const backgroundPreview = document.getElementById("background-left-container");
        backgroundFileInput.click()
        backgroundFileInput.addEventListener('change',function(event){
            const file = event.target.files[0]
            const fileUrl = URL.createObjectURL(file)
            backgroundPreview.style.backgroundImage = `url(${fileUrl})`
            document.body.style.backgroundImage = `url(${fileUrl})`
            backgroundFileDelete.style.display = 'block'
            backgroundUpdateBtn.style.display = 'none'
            bgController.style.display = 'block';
        })
    
    })

    backgroundFileDelete.addEventListener("click",function(event){
        const backgroundPreview = document.getElementById("background-left-container");
        let backgroundFileInput = document.getElementById('background-file-input')
        backgroundPreview.style.backgroundImage = 'none';
        document.body.style.backgroundImage = 'none'
        backgroundUpdateBtn.style.display = 'block'
        this.style.display = 'none';
        backgroundFileInput.value = null;
        bgController.style.display = 'none'
        
    })

}


//Event handler 

function handelHexColorInp(e) {
    let hexColor = e.target.value;
    if (hexColor) {
        this.value = hexColor.toUpperCase()
        if (isValidHex(hexColor)) {
            const color = hexToDecemalCodes(hexColor)
            updateColorCodeToDom(color)
        }
    }
}
function handelColorSlider(colorSliderRed, colorSliderGreen, colorSliderBlue) {

    return function () {
        const color = {
            red: parseInt(colorSliderRed.value),
            green: parseInt(colorSliderGreen.value),
            blue: parseInt(colorSliderBlue.value)
        }
        updateColorCodeToDom(color)
    }
}

function handleClicpboardCopyBtn() {
    const colorModeRadio = document.getElementsByName("color-mode")
    const value = getCheckedValuesFromRadios(colorModeRadio);
    if (value === null) {
        throw new Error("Invalid Radio Input")
    }
    if (div !== null) {
        div.remove()
        div === null
    }
    if (value === "hex") {
        const hexColorCode = document.getElementById("hex-input").value;
        if (hexColorCode && isValidHex(hexColorCode)) {
            window.navigator.clipboard.writeText(`#${hexColorCode}`);
            generateToseMgs(`#${hexColorCode} copied`)
        } else {
            alert("Invlid Hex Color Code")
        }

    } else {
        const rgbColorCode = document.getElementById("rgb-input").value;
        if (rgbColorCode) {
            window.navigator.clipboard.writeText(`${rgbColorCode}`);
            generateToseMgs(`${rgbColorCode} copied`)
        } else {
            alert("Invalid RGB Color Code")
        }
    }
}

function handelPresetColorParent(event) {
    if (div !== null) {
        div.remove()
        div = null
    }
    if (event.target.className === "preset-color-box") {
        colorCode = event.target.getAttribute('color-data')
        window.navigator.clipboard.writeText(`${colorCode}`);
        generateToseMgs(`${colorCode} copied`)

    }
}

function handelCustomColorBtn(event) {
    if (div !== null) {
        div.remove()
        div = null
    }
    if (event.target.className === "preset-color-box") {
        const colorCode = event.target.getAttribute('color-data')
        window.navigator.clipboard.writeText(`${colorCode}`)
        generateToseMgs(`${colorCode} copied`)
        
    }
}

function handelCustomColor(customColorParent, hexColorInp) {
    return function () {
        const color = `#${hexColorInp.value}`;
        if (customColor.includes(color)) return alert("Already save in the list")
        customColor.unshift(color)
        if (customColor.length > 10) {
            customColor = customColor.slice(0, 10);
        }
        localStorage.setItem('custom-color', JSON.stringify(customColor))
        removeChildren(customColorParent)
        displayColorBoxes(customColorParent, customColor)

    }
}



//Dom function 

function generateToseMgs(mgs) {
    div = document.createElement("div");
    document.body.appendChild(div);
    div.innerHTML = mgs
    div.classList = "tose-mgs tose-mgs-slide-in"
    div.addEventListener("click", function () {
        div.classList.remove("tose-mgs-slide-in")
        div.classList.add("tose-mgs-slide-out")
        div.addEventListener("animationend", function () {
            div.remove()
        })

    })
}

function removeChildren(parent) {
    var child = parent.lastElementChild;
    while (child) {
        parent.removeChild(child);
        child = parent.lastElementChild;
    }
}
/**
 * find the element from a list of radio buttons
 * @param {Array} nodes
 * @returns {String | null} 
 */

function getCheckedValuesFromRadios(nodes) {
    let checkedValue = null;

    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].checked) {
            checkedValue = nodes[i].value;
            break;
        }
    }
    return checkedValue;
}

/**
 * Update Dom Element to calculate color code
 * @param {object} color 
 */

function updateColorCodeToDom(color) {
    const hexColor = generateHexColor(color);
    const rgbColor = generateRgbColor(color);
    document.getElementById("display-area").style.background = `#${hexColor}`;
    document.getElementById("hex-input").value = hexColor;
    document.getElementById("rgb-input").value = rgbColor;
    document.getElementById("color-slider-red").value = color.red;
    document.getElementById("color-slider-red-label").innerText = color.red;
    document.getElementById("color-slider-green").value = color.green;
    document.getElementById("color-slider-green-label").innerText = color.green;
    document.getElementById("color-slider-blue").value = color.blue;
    document.getElementById("color-slider-blue-label").innerText = color.blue;



}

/**
 * create a div name as colorbox with class name preset-color-box
 * @param {String} color 
 * @returns {object}
 */


function generateColorBox(color) {
    const colorBox = document.createElement("div");
    colorBox.classList = "preset-color-box";
    colorBox.style.background = color;
    colorBox.setAttribute("color-data", color)

    return colorBox;
}

/**
 * this function will create and append with it's pareant
 * @param {object} parent 
 * @param {Array} colors 
 */

function displayColorBoxes(parent, colors) {
    colors.forEach((color) => {
        const colorBox = generateColorBox(color);
        parent.appendChild(colorBox)
    })
}


//Utlity Function 
/**
 * 
 * @returns {object}
 */
function generateDecemalColor() {
    let red = Math.floor(Math.random() * 255);
    let green = Math.floor(Math.random() * 255);
    let blue = Math.floor(Math.random() * 255);

    return { red, green, blue }
}
/**
 * 
 * @param {object} color  
 * @returns {string}
 */
function generateHexColor({ red, green, blue }) {


    function getTwoCode(value) {
        let hex = value.toString(16);
        return hex.length === 1 ? `0${hex}` : `${hex}`;
    }

    return `${getTwoCode(red)}${getTwoCode(green)}${getTwoCode(blue)}`.toUpperCase()
}
/**
 * 
 * @param {object} param
 * @returns {string}
 */
function generateRgbColor({ red, green, blue }) {

    return `rgb(${red},${green},${blue})`
}

/**
 * convert hex to decemal color code
 * @param {string} hex 
 * @returns {object}
 */

function hexToDecemalCodes(hex) {
    let red = parseInt(hex.slice(0, 2), 16);
    let green = parseInt(hex.slice(2, 4), 16);
    let blue = parseInt(hex.slice(4), 16);

    return { red, green, blue }
}


/**
 * 
 * @param {string} color 
 * @returns {boolean}
 */

function isValidHex(color) {
    if (color.length !== 6) return false;

    return /^[0-9A-Fa-f]{6}$/i.test(color)
}