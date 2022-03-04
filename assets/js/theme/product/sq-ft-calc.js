// initialize global calculation variables
let areaArray = [];
let vehicleClass = '';
let totalSqFt = 0;
// data for fancy math to calculate square width using square width (addition)
const Data = {
    "2dcar": {
        "floor": 20,
        "doors": 12,
        "roof": 14,
        "firewall": 10,
        "trunk": 16,
        "hood": 12,
        "wheel-wells": 24,
        "undercarriage": 45
    },
    "4dcar": {
        "floor": 22,
        "doors": 24,
        "roof": 16,
        "firewall": 10,
        "trunk": 18,
        "hood": 12,
        "wheel-wells": 24,
        "undercarriage": 50
    },
    "midcar": {
        "floor": 26,
        "doors": 26,
        "roof": 18,
        "firewall": 12,
        "trunk": 22,
        "hood": 14,
        "wheel-wells": 24,
        "undercarriage": 55
    },
    "fullcar": {
        "floor": 28,
        "doors": 26,
        "roof": 20,
        "firewall": 12,
        "trunk": 26,
        "hood": 14,
        "wheel-wells": 24,
        "undercarriage": 60
    },
    "2dtruck": {
        "floor": 20,
        "doors": 14,
        "roof": 14,
        "firewall": 10,
        "trunk": 0,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 36
    },
    "4dtruck": {
        "floor": 28,
        "doors": 24,
        "roof": 22,
        "firewall": 12,
        "trunk": 0,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 45
    },
    "jeep": {
        "floor": 24,
        "doors": 22,
        "roof": 22,
        "firewall": 10,
        "trunk": 24,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 58
    },
    "compactSUV": {
        "floor": 28,
        "doors": 26,
        "roof": 24,
        "firewall": 12,
        "trunk": 30,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 65
    },
    "fullSUV": {
        "floor": 36,
        "doors": 26,
        "roof": 34,
        "firewall": 14,
        "trunk": 32,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 75
    },
    "minivan": {
        "floor": 42,
        "doors": 34,
        "roof": 44,
        "firewall": 14,
        "trunk": 34,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 80
    },
    "cargovan": {
        "floor": 60,
        "doors": 34,
        "roof": 60,
        "firewall": 16,
        "trunk": 34,
        "hood": 14,
        "wheel-wells": 28,
        "undercarriage": 90
    }
};

function handleAreaArray(area) {
    const areaIndex = areaArray.indexOf(area);
    if (areaIndex > -1) {
        // if the area is already in the array, remove it.
        areaArray.splice(areaIndex, 1);
    } else {
        // otherwise, add it
        areaArray.push(area);
    }

    // recalculate total
    calculateTotal();
}

function calculateTotal() {
    // confirm that we have a vehicle class
    const vehicleSelector = document.getElementById("vehicle-class");
    // if not, error
    if (!vehicleClass.length) {
        vehicleSelector.classList.add('error');
        return;
    } 
    // if we've updated to have vehicle, remove error
    if(vehicleSelector.classList.contains('error')) {
        vehicleSelector.classList.remove('error');
    }

    // use the global areaArray
    const total = areaArray.reduce((acc, area) => acc + Data[vehicleClass][area], 0);
    // show total in interface
    document.getElementById('sq-ft-calc__value').innerHTML = total;
}

function initializeSquareFootageCalculator() {
    const container = document.querySelector('.sq-ft-calc');
    const tooltipCloseBtn = document.getElementById('sq-ft-close-x');
    const tooltipShowBtn =  document.getElementById('sq-ft-tooltip-show');
    const tooltipBox = document.getElementById('sq-ft-tooltip-box');
    const vehicleCoverageBtns= document.querySelectorAll('.sq-ft-calc__btn');

    if (!container) {
        // No calculator was found; bail
        return;
    }

    // showing tooltip
    tooltipShowBtn.addEventListener( "click", ()=> {
        tooltipBox.classList.add('active');
    });

    // removing tooltip
    tooltipCloseBtn.addEventListener("click", ()=> {
        tooltipBox.classList.remove('active');
    });

    // buttons: toggle active state & modify calculations
    vehicleCoverageBtns.forEach((button) => {
        button.addEventListener('click', (e) => {
            button.classList.toggle('active');
            // console.log(e.target.dataset.area);
            let area = e.target.dataset.area;
            handleAreaArray(area);
        });
    });
    // change vehicle class to modify calculations
    document.getElementById('vehicle-class').onchange = function() {
        var target = document.getElementById("vehicle-class");

        // grabbing the value for selected vehicle
        vehicleClass = target.options[target.selectedIndex].value;

        const calcBlock = document.querySelector('.sq-ft-calc__calc-content');
        const altBlock = document.querySelector('.sq-ft-calc__alt-content');

        // making the calculator part go away and a phone number alt text appear if sprinter van or other is selected
        if (vehicleClass != 'sprinter-van' && vehicleClass != 'other') {
            calcBlock.classList.remove('not-active');
            altBlock.classList.remove('active')
        }  else {
            calcBlock.classList.add('not-active');
            altBlock.classList.add('active');
            
        }
        calculateTotal();
    }
  }
  export default initializeSquareFootageCalculator;
