//reusable

function getISOFormat(date) {
  return new Date(date).toISOString().split('T')[0]
}

//constants

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//main_func

let selectedMonth = new Date();
let currentDate = new Date();
let notes = JSON.parse(localStorage.getItem('calendarNotes')) || {};

function displayCalendar() {
  const date =  new Date(selectedMonth);

  const month =  date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  document.getElementById('calendar-month').textContent = month + ' ' + year;

  const loopDate = new Date(date);
  loopDate.setDate(1);

  if (loopDate.getDay() !== 0) {
    // date 0 is the last date of previous month
    loopDate.setDate((loopDate.getDay() * -1) + 1);
  }

  renderDatesCalendar(loopDate);
}

//actionable

function selectDate(_currentDate) {

  // if selected previous or next month on current calendar, move to that month
  if (_currentDate.getMonth() != selectedMonth.getMonth()) {
    selectedMonth = _currentDate;
    currentDate = _currentDate;
    displayCalendar();
  } else {
    // update selected dates without re-render the whole calendar
    const prevSelected = document.getElementById(getISOFormat(currentDate));
    if (prevSelected) {
      prevSelected.classList.remove('selected');
    }
    const currSelected = document.getElementById(getISOFormat(_currentDate));
    currSelected.classList.add('selected');
    currentDate = _currentDate;
  }

  loadNote();
}

function prevMonth() {
  selectedMonth.setMonth(selectedMonth.getMonth() - 1);
  displayCalendar()
}

function nextMonth() {
  selectedMonth.setMonth(selectedMonth.getMonth() + 1);
  displayCalendar()
}

// note functionality

function saveNote() {
  const currentNote = document.getElementById('notes-input').value;
  notes = {
    ...notes,
    [getISOFormat(currentDate)]: currentNote || '',
  }
  
  localStorage.setItem('calendarNotes', JSON.stringify(notes))
}

function loadNote() {
  // loads the note on the specific date
  const currentNoteEl = document.getElementById('notes-input');
  currentNoteEl.value = notes[getISOFormat(currentDate)] || '';
}

// render

function renderDatesCalendar(startDate) {
  
  const datesContainer = document.getElementById('dates-container');

  datesContainer.innerHTML = '';

  for (let i = 0; i < 7; i++) {
    const datesRow = document.createElement('div');
    const startDateCols = new Date(startDate);

    for (let j = 0; j < 7; j++) {
      // index 0 reserved for day name
      if (j == 0) {
        const dayElement = document.createElement('span');
        dayElement.textContent = DAYS[i];
        datesRow.append(dayElement);
      } else {
        const dayElement = document.createElement('button');
            
        // if not on selected month
        if (startDateCols.getMonth() != selectedMonth.getMonth()) {
          dayElement.classList.add('blur');
        }
        // if it is selected date
        if (startDateCols.getDate() == currentDate.getDate() &&
          startDateCols.getMonth() == currentDate.getMonth() &&
          startDateCols.getFullYear() == currentDate.getFullYear())
        {
          dayElement.classList.add('selected');
        }
        // if it is today
        if (startDateCols.getDate() == new Date().getDate() &&
          startDateCols.getMonth() == new Date().getMonth() &&
          startDateCols.getFullYear() == new Date().getFullYear())
        {
          dayElement.classList.add('today');
        }
        // if has note
        if (!!notes[getISOFormat(startDateCols)]) {
          dayElement.classList.add('underline');
          dayElement.classList.add('red');
        }
  
        dayElement.textContent = startDateCols.getDate().toString();
        const localCurrentDate = new Date(startDateCols);
        dayElement.setAttribute("id", getISOFormat(localCurrentDate));
        dayElement.onclick = () => selectDate(localCurrentDate);
        datesRow.append(dayElement);
        startDateCols.setDate(startDateCols.getDate() + 7);
      }
    }
    startDate.setDate(startDate.getDate() + 1);
    datesContainer.append(datesRow);
  }
}

//onload display

displayCalendar();
loadNote();
