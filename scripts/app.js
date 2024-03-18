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
const modalBtnAgn = $('.btn-again');
const modalBtnReset = $('.btn-reset');
const modal_message = $('#modal-message');
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

/*
 ************* Variables*******************
 */
const delay = 150;
const progressDelay = 1000;
const key = 'high-score';
let timeout = false;
let progressTime = false;
let score = 20;
let randomNum;
let statusMsg = 'start';

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
const updateProgressBar = function (element, pushClass, popClass, cb1, cb2) {
  cb1(element, popClass);
  cb2(element, pushClass);
  statusMsg = pushClass;
  progressMsg.innerHTML = statusMsg;
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
const checkHighScore = (value, key, localCb, DOMcb) => {
  value >= getFromLocal(key) && localCb(key, value, DOMcb);
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
  if (!inputVal || !range || !checkCb || !updateCb || argsArr.length !== 5) {
    return;
  }
  const [defaultElm, msg, delCb, addCb, mainClass] = argsArr;
  const appendClass = checkCb(inputVal, range, mainClass);
  updateCb(defaultElm, appendClass, msg, delCb, addCb);
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
    const [htmlEl, msg, popCl, pushCl, appendCl] = cbArr;
    pbCb(htmlEl, appendCl, msg, popCl, pushCl);
  }
};

const resetProgressBar = function () {
  updateProgressBar(my_bar, 'start', statusMsg, removeClass, addClass);
  defaultformData(number_inp, '');
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
    updateProgressBar(my_bar, 'not-allowed', statusMsg, removeClass, addClass);
  } else if (value === randomNum) {
    checkHighScore(score, key, accessLocal, updateDom);
    /*  INIT  */
  } else {
    const domCb = [my_bar, statusMsg, removeClass, addClass];
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
  score--;
  if (progressTime) clearTimeout(progressTime);
  progressTime = setTimeout(resetProgressBar, progressDelay);
  updateDom(scoreElm, score);
};

/**
 * INITIAL FUNCTION
 */
const init = function () {
  /*Set score and high score */
  accessLocal(key, 0, updateDom);
  /*Get dimension */
  getDimensions();
  /*Get random */
  randomNum = generateRandom();
  console.log(randomNum);
};

const resetHandler = function () {
  if (progressTime) clearTimeout(progressTime);
  progressTime = false;
  defaultformData(number_inp, '');
  accessLocal(key, 0, updateDom);
  updateProgressBar(my_bar, 'start', statusMsg, removeClass, addClass);
  randomNum = generateRandom();
  console.log(randomNum);
};

/*
 ************* Event Listners*******************
 */
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(getDimensions, delay);
});

/*FORM SUBMIT */
article_left.addEventListener('submit', submitHandler);

/*LOAD EVENT */
window.addEventListener('DOMContentLoaded', init);

/**
 * RESET BUTTON LISTENER
 */

bannerBtn.addEventListener('click', resetHandler);
