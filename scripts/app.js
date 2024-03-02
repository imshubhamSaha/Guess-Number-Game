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

/*
 ************* Variables*******************
 */
let timeout = false;
const delay = 150;
let randomNum;

/*
 ************* Functions*******************
 */
/*LOCAL STORAGE FUNCTIONS */
const accessLocal = (value = 0) => sessionStorage.setItem('high-score', value);
const createLocal = () =>
  !sessionStorage.getItem('high-score') && accessLocal();

/*GENERATE RANDOM NUMBER */
const generateRandom = () => Math.floor(Math.random() * 20) + 1;

/*GET DIMENSIONS OF SCREEN WIDTH */
const getDimensions = function () {
  const width = window.innerWidth;
  if (width <= 600) {
    progressMsg.innerHTML = 'Start guessing';
  }
  if (width > 600) {
    my_bar.classList.add('start');
    my_bar.classList.add('transform');
  }
};
/*HIGH SCORE CHECK */
// const checkHighScore = function (value) {
//   if (value < highScore) return false;
//   highScore = value;
//   return true;
// };

/*FORM DATA CHECK */
const checkFormData = value =>
  !value || typeof value !== 'number' || value > 20 || value < 1;

/*INITIAL FUNCTION */
const init = function () {
  /*Get dimension */
  getDimensions();
  /*Set score and high score */
  createLocal();
  high_score.innerHTML = sessionStorage.getItem('high-score');
  scoreElm.innerHTML = 20;
  /*Get random */
  randomNum = generateRandom();
  console.log(randomNum);
};

/*
 ************* Event handlers*******************
 */

/*
 ************* Event Listners*******************
 */
window.addEventListener('resize', () => {
  clearTimeout(timeout);
  timeout = setTimeout(getDimensions, delay);
});

/*FORM SUBMIT */
// article_left.addEventListener('submit', submitHandler);

/*LOAD EVENT */
window.addEventListener('DOMContentLoaded', init);
