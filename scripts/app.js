'use strict';
const $ = element => document.querySelector(element);

/*
 *************Element Selection*******************
 */
const bannerBtn = $('#resetBtn');
const modalId = $('#myModal');
const modal_section = $('.modal');
const modal_container = $('.modal-content');
const container = $('.container');
const modalBtnAgn = $('#btn-again');
const modalBtnReset = $('#btn-reset');
const modal_btn_message = $('.modal-btn-text');
const decision_section = $('.decision-section');
const progress_bar = $('.progress-bar');
const my_bar = $('.my-bar');
const progressMsg = $('.message-text');
const labels = $('.labels');
const input_section = $('.input-section');
const input_section_center = $('.input-section-center');
const article_left = $('.left');
const number_inp = $('#guessed-num');
const submitBtn = $('.btn-submit');
const right_article = $('.right');
const scoreElm = $('#score');
const high_score = $('#high-score');
const modalNumber = $('#correctnumber');
const modal_header = $('.modal-header');
const modal_message = $('.modal-message');

/*
 ************* Variables*******************
 */
const delay = 150;
const progressDelay = 1000;
const key = 'high-score';
const winMessage = 'congratulation';
const lostMessage = 'sorry';
const btnMessage = 'for next round';
const correctMsg = 'you guessed correct number';
const errorMsg = 'game over';
let timeout = false;
let progressTime = false;
let score = 20;
let randomNum;
let statusMsg;

/*
 ************* Functions*******************
 */
/************DOM FUNCTIONS************ */

/**
 * ADD CLASS
 * @param {*} element
 * @param {*} className
 * @returns
 */
const addClass = (element, className) => element?.classList.add(className);
/**
 *  REMOVE CLASS
 * @param {*} element
 * @param {*} className
 * @returns
 */
const removeClass = (element, className) => {
  element.classList.remove(className);
};
/**
 *UPDATE DOM
 * @param {*} element
 * @param {*} value
 * @returns null
 */
const updateDom = (element, value) => (element.innerHTML = value);
const getClass = function (element) {
  return document.querySelector(element).classList[2];
};
/**
 * GET DIMENSIONS OF SCREEN WIDTH
 */
const getDimensions = function () {
  const width = window.innerWidth;
  if (width <= 600) {
    progressMsg.innerHTML = statusMsg;
  }
};

/**
 *  UPDATE PROGRESS BAR
 * @param {*} element = html element
 * @param {*} pushClass = css class
 * @param {*} popClass  = css class
 * @param {*} cb1 = function
 * @param {*} cb2 = function
 */
const updateProgressBar = function (
  element,
  pushClass,
  popClass = 'start',
  cb1,
  cb2,
  cb3
) {
  cb1(element, popClass);
  cb2(element, pushClass);
  if (cb3) {
    statusMsg = pushClass;
    cb3(progressMsg, statusMsg);
  }
};

/************END DOM FUNCTIONS************ */

/************LOCAL STORAGE FUNCTIONS************** */
/**
 * SESSION STORAGE CREATION
 * @returns
 */
const createLocal = (key, value) => {
  sessionStorage.setItem(key, value);
};
/**
 * SESSION STORAGE DATA
 * @param {*} key => string
 * @returns string
 */
const getFromLocal = key => sessionStorage.getItem(key);
/**
 *SESSION STORAGE ACCESS
 * @param {*} value => number
 * @returns null
 */
const accessLocal = (key, value, cb) => {
  !getFromLocal(key)
    ? createLocal(key, value)
    : value >= getFromLocal(key)
    ? createLocal(key, value)
    : (value = getFromLocal(key));
  score = 20;
  cb(scoreElm, 20);
  cb(high_score, value);
};

/************END LOCAL STORAGE FUNCTIONS************ */

/**********UTILITY FUNCTIONS************ */

/**
 * GENERATE RANDOM NUMBER
 * @returns random number => number
 */
const generateRandom = () => Math.floor(Math.random() * 20) + 1;
/**
 * HIGH SCORE CHECK
 * @param {*} value => number
 * @returns boolean
 */
const updateHighScore = (value, key, localCb, DOMcb) => {
  localCb(key, value, DOMcb);
};
/**
 *CHECK FORM DATA
 * @param {*} value =>number
 * @returns boolean
 */
const checkFormData = value =>
  !value || typeof value !== 'number' || value > 20 || value < 1;
/**
 * DEFAULT FORM DATA
 * @param {*} element
 * @param {*} data
 * @returns
 */
const defaultformData = (element, data) => (element.value = data);

/**
 * CHECK VALUE
 * @param {*} inputVal = integer
 * @param {*} range = integer
 * @param {*} messageStr -= string
 * @returns none
 */
const checkValue = function (inputVal, range, messageStr) {
  if (inputVal >= range) {
    return messageStr;
  } else {
    return 'too-' + messageStr;
  }
};
/**
 * UPDATE STATUS
 * @param {*} inputVal = integer
 * @param {*} range = integer
 * @param {*} checkCb  = function
 * @param {*} updateCb = function
 * @param {*} argsArr = function
 * @returns none
 */
const updateStatus = function (inputVal, range, checkCb, updateCb, argsArr) {
  if (!inputVal || !range || !checkCb || !updateCb || argsArr.length < 6) {
    return;
  }

  const [defaultElm, msg, delCb, addCb, updDOmCB, mainClass] = argsArr;
  const appendClass = checkCb(inputVal, range, mainClass);
  updateCb(defaultElm, appendClass, msg, delCb, addCb, updDOmCB);
};

/**
 *CHECK RANGE
 * @param {*} range  number
 * @param {*} data  number
 * @returns boolean
 */
const checkRange = function (range, inpData, value, cbArgs) {
  const [updateCb, checkValueCb, pbCb, cbArr, lstVal] = cbArgs;

  if (range > inpData) {
    const a = cbArr.at(-1) === 'high' ? lstVal : value;
    const b = cbArr.at(-1) === 'high' ? value : lstVal;

    updateCb(a, b, checkValueCb, pbCb, cbArr);
  } else {
    const [htmlEl, msg, popCl, pushCl, updDom, appendCl] = cbArr;
    pbCb(htmlEl, appendCl, msg, popCl, pushCl, updDom);
  }
};
/**
 * PROGRESS BAR RESET
 * @return
 */
const resetProgressBar = function () {
  updateProgressBar(
    my_bar,
    'start',
    statusMsg,
    removeClass,
    addClass,
    updateDom
  );
  defaultformData(number_inp, '');
};

/**
 *
 * @param {*} score int
 * @param {*} highscore int
 * @returns boolean
 */
const checkGame = (score, highscore) => score === 1 || score - 1 <= highscore;

/**
 * TIMEOUT RESET
 * @param {*} element - > string
 * @returns
 */
const timeReset = element => element && clearTimeout(element);
/**
 *
 * @param {*} elem
 * @param {*} heading
 * @param {*} msg
 * @param {*} clr
 * @param {*} btnmsg
 * @param {*} showBtn
 */
const initalState = function (
  elem,
  heading,
  msg,
  clr,
  btnmsg = 'to play again',
  showBtn
) {
  timeReset(progressTime);
  progressTime = false;
  updateProgressBar(
    my_bar,
    'start',
    statusMsg,
    removeClass,
    addClass,
    updateDom
  );
  updateDom(modal_header, heading);
  updateDom(modal_message, msg);
  updateDom(modal_btn_message, btnmsg);
  updateDom(modalNumber, `Number: ${randomNum}`);
  container.style.color = clr;
  updateProgressBar(showBtn, 'show', 'hide', removeClass, addClass);
  updateProgressBar(elem, 'show', 'hide', removeClass, addClass);
  // console.log(statusMsg);
};
/**********END UTILITY FUNCTIONS************ */

/*
 ************* Event handlers*******************
 */
/**
 * FORM SUBMIT HANDLER
 * @param {} e =>event object
 * @returns null
 */
const submitHandler = function (e) {
  e.preventDefault();
  const value = +e.target[0].value;
  /**
  * IF CHECK FORM DATA 
      * INVALID
        *UPDATE PROGRESS BAR = NOT ALLOWED
   
  * ELSE IF INPUT DATA === GENERATED NUMBER
      *CHECKHIGH SCORE
  * ELSE
    * IF INPUT DATA > GENERATED NUMBER
        * CHECK RANGE FUNCTION
    *ELSE CHECK RANGE FUNCTION
   */
  if (checkFormData(value)) {
    updateProgressBar(
      my_bar,
      'not-allowed',
      statusMsg,
      removeClass,
      addClass,
      updateDom
    );
  } else if (value === randomNum && score >= getFromLocal(key)) {
    initalState(
      modal_section,
      winMessage,
      correctMsg,
      'green',
      btnMessage,
      modalBtnReset
    );

    return updateHighScore(score, key, accessLocal, updateDom);
  } else {
    const domCb = [my_bar, statusMsg, removeClass, addClass, updateDom];
    const updateCbArgs = [updateStatus, checkValue, updateProgressBar, domCb];
    if (value > randomNum) {
      domCb.push('high');
      updateCbArgs.push(randomNum + 4);
      checkRange(16, randomNum, value, updateCbArgs);
    } else {
      domCb.push('low');
      updateCbArgs.push(randomNum - 4);
      checkRange(randomNum, 4, value, updateCbArgs);
    }
  }

  if (checkGame(score, getFromLocal(key)))
    return initalState(
      modal_section,
      lostMessage,
      errorMsg,
      'red',
      undefined,
      modalBtnAgn
    );
  score--;
  timeReset(progressTime);
  progressTime = setTimeout(resetProgressBar, progressDelay);
  updateDom(scoreElm, score);
};

/**
 * INITIAL FUNCTION
 */
const init = function () {
  /*Set score and high score */
  accessLocal(key, 0, updateDom);
  updateProgressBar(
    my_bar,
    'start',
    statusMsg,
    removeClass,
    addClass,
    updateDom
  );
  /*Get random */
  randomNum = generateRandom();
  // console.log(randomNum);
};

/**
 * RESET BUTTON HANDLER
 */
const resetHandler = function () {
  timeReset(progressTime);
  progressTime = false;
  defaultformData(number_inp, '');
  sessionStorage.setItem(key, 0);
  init();
};

/**
 * AGAIN BUTTN HANDLER
 * @param {*} e
 */
const againHandler = function (e) {
  init();
  defaultformData(number_inp, '');
  updateProgressBar(modal_section, 'hide', 'show', removeClass, addClass);
  updateProgressBar(modalBtnAgn, 'hide', 'show', removeClass, addClass);
};

/**
 * RESET BUTTON HANDLER
 */
const modalResetHandler = function () {
  init();
  defaultformData(number_inp, '');
  updateProgressBar(modal_section, 'hide', 'show', removeClass, addClass);
  updateProgressBar(modalBtnReset, 'hide', 'show', removeClass, addClass);
};

/*
 ************* Event Listners*******************
 */
/**
 * RESIZE EVENT
 */
window.addEventListener('resize', () => {
  timeReset(timeout);
  timeout = setTimeout(getDimensions, delay);
});
/**
 * FORM SUBMIT (GUESSED NUMBER SUBMIT)
 */
article_left.addEventListener('submit', submitHandler);
/**
 * LOAD EVENT
 */
window.addEventListener('DOMContentLoaded', init);
/**
 * RESET BUTTON LISTENER
 */
bannerBtn.addEventListener('click', resetHandler);

/**
 * AGAIN BUTTON EVENT
 */
modalBtnAgn.addEventListener('click', againHandler);
/**
 * MODAL RESET EVENT
 */
modalBtnReset.addEventListener('click', modalResetHandler);
