// coverage calculator on acoustic product pages
function calculate(e) {
  e.preventDefault();
  document.querySelector('.calculated-results').style.display = "none";
  const baseMsg = '<strong>Coverage: <span class="recommended-coverage"></span> Sq Ft</strong><br /><br />You need <strong><span class="recommended-number"></span> <span class="panel-type"></span> panels</strong> to get the <span class="coverage-description"></span> <span class="coverage-amount"></span>% coverage in your <span class="coverage-length"></span> ft by <span class="coverage-width"></span> ft room.';
  document.querySelector('.calculated-results').innerHTML = baseMsg;

  const roomType = document.querySelector('#room-type').value;
  let roomLength = document.querySelector('#room-length').value;
  let roomWidth = document.querySelector('#room-width').value;
  let roomHeight = document.querySelector('#room-height').value;

  if (roomType.length === 0 || roomLength.length === 0 || roomWidth.length === 0 || roomHeight.length === 0 ) {
    alert('All fields required.');
    return false;
  }

  roomLength = parseInt(roomLength);
  roomWidth = parseInt(roomWidth);
  roomHeight = parseInt(roomHeight);

  const sqFootage = roomLength * roomWidth;

  if (sqFootage >= 400) {
    const msg = '<p class="message">This room is too big. Please contact us for a custom quote.<p><p class="icon-phone"></p><p style="text-align: center"><a href="tel:1-800-679-8511">1-800-679-8511</a></p><span class="icon-email"></span><p><a href="mailto:service@secondskinaudio.com">service@secondskinaudio.com</a><p>';
    document.querySelector('.calculated-results').innerHTML = msg;
    document.querySelector('.calculated-results').style.display = "block";
    return;
  }
  // console.log('sq footage', sqFootage);
  if (roomHeight > 12) {
    const msg = '<p class="message">This ceiling is too high. Please contact us for a custom quote.<p><p class="icon-phone"></p><p style="text-align: center"><a href="tel:1-800-679-8511">1-800-679-8511</a></p><span class="icon-email"></span><p><a href="mailto:service@secondskinaudio.com">service@secondskinaudio.com</a><p>';
    document.querySelector('.calculated-results').innerHTML = msg;
    document.querySelector('.calculated-results').style.display = "block";

    return;
  }

  // get shape so we can figure out how many needed
  let shape;
  const shapes = document.getElementsByName('shape'); 
              
  for(let i = 0; i < shapes.length; i++) { 
    if(shapes[i].checked) 
    shape = shapes[i].value; 
  } 
  // console.log('shape', shape);

  const coverages = document.getElementsByName('coverage');
  const coverageAmount = coverages[0].checked ? coverages[0].value : coverages[1].value;
  const coveragePercentage = coverageAmount * .01;
  // console.log('coveragePercentage', coveragePercentage);

  // figure out how much square footage each shape gives us
  let sqFtPerPanel;
  if(shape === 'rectangle') {
    sqFtPerPanel = 8;
  } else {
    sqFtPerPanel = 4;
  }

  const panelSqFtNeeded = sqFootage * coveragePercentage;
  // we want a whole number that is divisible by the sqFtPerPanel
  const divisor = Math.floor(panelSqFtNeeded / sqFtPerPanel);
  const panelSqFtApprox = divisor * sqFtPerPanel;

  // panels needed =
  const panelsNeeded = Math.round(panelSqFtApprox / sqFtPerPanel);
  // console.log('panelsNeeded', panelsNeeded);

  document.querySelector('.recommended-coverage').innerHTML = panelSqFtApprox;
  document.querySelector('.recommended-number').innerHTML = panelsNeeded;
  document.querySelector('.panel-type').innerHTML = shape;
  document.querySelector('.coverage-description').innerHTML = coverageAmount === 25 ? 'minimum' : 'recommended';
  document.querySelector('.coverage-amount').innerHTML = coverageAmount;
  document.querySelector('.coverage-width').innerHTML = roomWidth;
  document.querySelector('.coverage-length').innerHTML = roomLength;
  
  document.querySelector('.calculated-results').style.display = "block";
  return false;
}



function handleCoverageCalculatorSubmit() {
  const calculatorTrigger = document.querySelector('.coverage-calculator');
  if(calculatorTrigger) {
    calculatorTrigger.addEventListener("submit", calculate);
  }
}
export default handleCoverageCalculatorSubmit;
