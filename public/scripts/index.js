'use strict';

document.addEventListener('DOMContentLoaded', function(e) {
	var windowScrollTop;
	const nav = document.getElementsByTagName('nav')[0];
	const navMain = document.getElementById('nav-main');
	const header = document.getElementsByTagName('header')[0];
	
	const pqHero = document.getElementById('pq-hero');
	const pqProject = document.querySelector('.slide-title.pq');
	var sheet;
	
	var carouselBtns = document.getElementsByClassName('carousel-btns')[0].children;
	var projectSlides = document.getElementsByClassName('slide');
	var activeSlideIndex = 0;
	
	var contactForm = document.getElementById('contact-form');

	var mailBtn = document.querySelector('.letter-image');
	var contactAgain = document.getElementById('contact-again');
	
	var contactStepDots = document.getElementsByClassName('step-dot');
	let contactBtns = document.getElementById('form-btns').children;
	var contactPrevBtn = contactBtns[0];
	var contactNextBtn = contactBtns[1];
	var contactSubmitBtn = contactBtns[2];
	var contactFormTabs = document.getElementsByClassName('form-tab');
	var currentContactTab = 0;
	
	window.addEventListener('scroll', function(e) {
		windowScrollTop = document.documentElement.scrollTop;
		if (windowScrollTop > nav.offsetHeight) {
			nav.classList.add('navScrolled');
		} else {
			nav.classList.remove('navScrolled');
		}
		
		if (windowScrollTop > header.offsetHeight) {
			navMain.classList.add('navShowed');
		} else {
			navMain.classList.remove('navShowed');
		}
	});


	sheet = Typewriter.feed(pqHero);
	Typewriter.type(sheet);

	sheet = Typewriter.feed(pqProject)
	Typewriter.type(sheet);
	
	for (let i = 0; i < carouselBtns.length; i++) {
		carouselBtns[i].addEventListener('click', () => {
			projectSlides[activeSlideIndex].style.display = 'none';
			carouselBtns[activeSlideIndex].classList.remove('project-active');
			projectSlides[i].style.display = 'flex';
			projectSlides[i].style.animation = 'fade-in 1s ease forwards'
			carouselBtns[i].classList.add('project-active');
			activeSlideIndex = i;
		});
	}
	contactForm.addEventListener('keydown', (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;	
		}
	});
	contactForm.addEventListener('keyup', (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			if (currentContactTab != contactFormTabs.length - 1) {
				contactNextBtn.click();
			} else {
				contactSubmitBtn.click();
			}
		}
	});

	contactNextBtn.addEventListener('click', nextContactTab);

	contactPrevBtn.addEventListener('click', prevContactTab);

	contactForm.addEventListener('submit', (e) => {
		e.preventDefault();
		makeContactRequest();
	});

	mailBtn.addEventListener('click', () => {
		mailBtn.classList.add('open');
		contactForm.style.visibility = 'visible';
		contactForm.style.animation = 'zoom-in 1s forwards';
	});

	contactAgain.addEventListener('click', () => {
		contactAgain.style.animation = 'zoom-out 1s forwards';
		mailBtn.style.animation = 'mail-in 2s forwards';
		mailBtn.classList.remove('closed');
	});

//---------------------------------------------------------------------------
	function resetForm() {
		contactSubmitBtn.style.display = 'none';
		contactPrevBtn.style.display = 'none';
		contactFormTabs[currentContactTab].style.visibility = 'hidden';
		contactStepDots[currentContactTab].classList.remove('active');
		contactForm.reset();
		currentContactTab = 0;
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactStepDots[currentContactTab].classList.add('active');
		contactNextBtn.style.display = 'block';
	}

	async function nextContactTab() {
		if (currentContactTab == 1) {
			let emailInput = contactFormTabs[currentContactTab].children[1];
			if (!emailInput.checkValidity()) {
				emailInput.style.animation = 'none';
				void emailInput.offsetWidth;
				emailInput.style.animation = 'shake 500ms';
				return;
			}
		}
	
		let prevTab = contactFormTabs[currentContactTab];
		prevTab.style.animation = 'slide-out-to-top 500ms cubic-bezier(.77,-0.89,.43,.8)';
		window.setTimeout(() => {
			prevTab.style.visibility = 'hidden';
		}, 450);
		contactStepDots[currentContactTab].classList.remove('active');
		if (++currentContactTab == contactFormTabs.length - 1) {
			contactNextBtn.style.display = 'none';
			contactSubmitBtn.style.display = 'block';
			contactSubmitBtn.style.animation = 'fade-in 1s';
		} else if (currentContactTab == 1) {
			contactPrevBtn.style.display = 'block';
			contactPrevBtn.style.animation = 'fade-in 1s';
		}
		await sleep(300);
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactFormTabs[currentContactTab].style.animation = 'slide-in-from-bottom 500ms cubic-bezier(.48,.74,.48,.74)';
		contactStepDots[currentContactTab].classList.add('active');
		contactFormTabs[currentContactTab].children[1].focus();
	}
	
	async function prevContactTab() {
		if (currentContactTab == 1) {
			let emailInput = contactFormTabs[currentContactTab].children[1];
			if (!emailInput.checkValidity()) {
				emailInput.style.animation = 'none';
				void emailInput.offsetWidth;
				emailInput.style.animation = 'shake 500ms';
				return;
			}
		}
	
		let prevTab = contactFormTabs[currentContactTab]
		prevTab.style.animation = 'slide-out-to-bottom 500ms cubic-bezier(.77,-0.89,.43,.8)';
		window.setTimeout(() => {
			prevTab.style.visibility = 'hidden';
		}, 450);
		contactStepDots[currentContactTab].classList.remove('active');
		if (--currentContactTab == 0) {
			contactPrevBtn.style.display = 'none';
		} else if (currentContactTab == contactFormTabs.length - 2) {
			contactSubmitBtn.style.display = 'none';
			contactNextBtn.style.display = 'block';
			contactNextBtn.style.animation = 'fade-in 1s';
		}
		await sleep(300);
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactFormTabs[currentContactTab].style.animation = 'slide-in-from-top 500ms cubic-bezier(.48,.74,.48,.74)';
		contactStepDots[currentContactTab].classList.add('active');
		contactFormTabs[currentContactTab].children[1].focus();
	}
	
	function makeContactRequest() {
		let xhr = new XMLHttpRequest();
	
		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if(xhr.status === 200) {
					contactSuccess(); //success
				} else {
					contactSuccess(); //TODO: implements failure handler?
				}
			}
		};
	
		xhr.open('POST', '/quang/contact', true);
		xhr.send(new FormData(contactForm));
	}
	
	async function contactSuccess() {
		contactForm.style.animation = 'zoom-out 1s forwards';
		await sleep(1000);
		mailBtn.classList.remove('open');
		mailBtn.classList.add('closed');
		await sleep(1000);
		mailBtn.style.animation = 'mail-out 2s forwards';
		await sleep(500);
		resetForm();
		contactAgain.style.visibility = 'visible';
		contactAgain.style.animation = 'zoom-in 1s forwards';
	}

	function sleep(ms) { 
		return new Promise(resolve => window.setTimeout(resolve, ms));
	}


});
