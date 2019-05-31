'use strict';

document.addEventListener('DOMContentLoaded', (e) => {
	let windowScrollTop;
	const nav = document.getElementsByTagName('nav')[0];
	const navMain = document.getElementById('nav-main');
	const navAvatar = document.getElementById('nav-avatar');
	const navName = document.querySelector('#nav-quangphan>p');
	const header = document.getElementsByTagName('header')[0];

	const sheetHero = Typewriter.feed(document.getElementById('pq-hero'));
	const sheetProject = Typewriter.feed(document.querySelector('.slide-title.pq'));
	const pqProcessed = document.getElementById("pq-processed");
	const sheetProcessForm = Typewriter.feed(pqProcessed);

	const carouselBtns = document.getElementsByClassName('carousel-btns')[0].children;
	const projectSlides = document.getElementsByClassName('slide');
	let activeSlideIndex = 0;

	const contactForm = document.getElementById('contact-form');

	const mailTruck = document.querySelector('#mail-truck>div');
	const mailBtn = document.querySelector('.letter-image');
	const contactAgain = document.getElementById('contact-again');

	const contactStepDots = document.getElementById('step-dots');
	const contactBtns = document.getElementById('form-btns');
	const contactPrevBtn = contactBtns.children[0];
	const contactNextBtn = contactBtns.children[1];
	const contactSubmitBtn = contactBtns.children[2];
	const contactExitBtn = contactBtns.children[3];
	const contactFormTabs = document.getElementsByClassName('form-tab');
	let currentContactTab = 0;

	window.addEventListener('scroll', (e) => {
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

		if (windowScrollTop + window.innerHeight >= document.body.scrollHeight) {
			navAvatar.style.animation = 'none';
			void navAvatar.offsetWidth;
			navAvatar.style.animation = 'zoom-in-out 500ms cubic-bezier(.77,-0.89,.43,.8) 3';
		}
	});

	Typewriter.type(sheetHero);

	Typewriter.type(sheetProject);

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

	navName.addEventListener('click', () => {
		navName.classList.toggle('flickered');
	});

	contactForm.addEventListener('keydown', (e) => { //prevents autosubmit from enter
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});
	contactForm.addEventListener('keyup', (e) => {
		if (e.keyCode == 13) {
			e.preventDefault();
			contactNextAndFocus();
		}
	});

	for (let i = 0; i < contactStepDots.children.length; i++) {
		contactStepDots.children[i].addEventListener('click', () =>
			switchToContactTab(i)
		);

	}

	contactNextBtn.addEventListener('click', () => nextContactTab());

	contactPrevBtn.addEventListener('click', () => prevContactTab());

	contactSubmitBtn.addEventListener('click', (e) => {
		e.preventDefault();
		submitContactForm();
	});

	contactExitBtn.addEventListener('click', exitContactForm);

	// contactForm.addEventListener('submit', (e) => {
	// 	e.preventDefault();

	// });

	mailBtn.addEventListener('click', () => {
		mailBtn.classList.add('open');
		contactForm.style.visibility = 'visible';
		contactForm.style.animation = 'zoom-in 1s forwards';
	});

	contactAgain.addEventListener('click', () => {
		contactAgain.style.animation = 'zoom-out 1s forwards';
		mailBtn.style.animation = 'mail-in 2s forwards';
		mailBtn.classList.remove('closed');
		resetForm();
	});

	mailTruck.addEventListener('click', () => {
		mailTruck.classList.remove('run');
		void mailTruck.offsetWidth;
		mailTruck.classList.add('run');
	});

	//---------------------------------------------------------------------------
	async function switchToContactTab(index) {
		if (currentContactTab < index) {
			nextContactTab(index);
		} else if (index < currentContactTab) {
			prevContactTab(index);
		}
	}

	async function nextContactTab(newIndex) {
		if (currentContactTab == 0) {
			let messageInput = contactFormTabs[currentContactTab].children[1];
			if (!messageInput.checkValidity()) {
				messageInput.style.animation = 'none';
				void messageInput.offsetWidth;
				messageInput.style.animation = 'shake 500ms';
				return;
			}
		} else if (currentContactTab == 1) {
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
		contactStepDots.children[currentContactTab].classList.remove('active');
		if (newIndex != undefined) {
			currentContactTab = newIndex;
		} else {
			currentContactTab++;
		}
		updateContactBtns(currentContactTab);
		await sleep(300);
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactFormTabs[currentContactTab].style.animation = 'slide-in-from-bottom 500ms cubic-bezier(.48,.74,.48,.74)';
		contactStepDots.children[currentContactTab].classList.add('active');
	}

	async function contactNextAndFocus() {
		if (currentContactTab != contactFormTabs.length - 1) {
			await nextContactTab();
			contactFormTabs[currentContactTab].children[1].focus();
		} else {
			submitContactForm();
		}
	}

	async function prevContactTab(newIndex) {
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
		prevTab.style.animation = 'slide-out-to-bottom 500ms cubic-bezier(.77,-0.89,.43,.8)';
		window.setTimeout(() => {
			prevTab.style.visibility = 'hidden';
		}, 450);
		contactStepDots.children[currentContactTab].classList.remove('active');
		if (newIndex != undefined) {
			currentContactTab = newIndex;
		} else {
			currentContactTab--;
		}
		updateContactBtns(currentContactTab);
		await sleep(300);
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactFormTabs[currentContactTab].style.animation = 'slide-in-from-top 500ms cubic-bezier(.48,.74,.48,.74)';
		contactStepDots.children[currentContactTab].classList.add('active');
	}

	function updateContactBtns(newIndex) {
		contactNextBtn.style.display = 'none';
		contactPrevBtn.style.display = 'none';
		contactSubmitBtn.style.display = 'none';

		switch (newIndex) {
			case 2:
				contactSubmitBtn.style.display = 'block';
				contactSubmitBtn.style.animation = 'fade-in 1s';
				contactPrevBtn.style.display = 'block';
				contactPrevBtn.style.animation = 'fade-in 1s';
				break;
			case 1:
				contactPrevBtn.style.display = 'block';
				contactPrevBtn.style.animation = 'fade-in 1s';
				contactNextBtn.style.display = 'block';
				contactNextBtn.style.animation = 'fade-in 1s';
				break;
			case 0:
				contactNextBtn.style.display = 'block';
				contactNextBtn.style.animation = 'fade-in 1s';
				break;
			default:
				break;
		}

	}

	function exitContactForm() {
		mailBtn.classList.remove('open');
		contactForm.style.animation = 'zoom-out 500ms forwards';
	}

	async function submitContactForm() {
		contactFormTabs[currentContactTab].style.visibility = 'hidden';
		contactStepDots.children[currentContactTab].classList.remove('active');
		contactBtns.style.visibility = 'hidden';
		contactStepDots.style.visibility = 'hidden';
		pqProcessed.style.display = 'block';
		Typewriter.type(sheetProcessForm);
		await sleep(1000);
		makeContactRequest();
	}

	function resetForm() {
		contactForm.reset();
		pqProcessed.style.display = 'none';
		Typewriter.reset(sheetProcessForm);
		contactStepDots.style.visibility = 'visible';
		currentContactTab = 0;
		contactFormTabs[currentContactTab].style.visibility = 'visible';
		contactStepDots.children[currentContactTab].classList.add('active');
		contactBtns.style.visibility = 'visible';
		contactPrevBtn.style.display = 'none';
		contactSubmitBtn.style.display = 'none';
		contactNextBtn.style.display = 'block';
	}

	function makeContactRequest() {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					contactSuccess(); //success
				} else {
					contactSuccess(); //TODO: implements failure handler?
				}
			}
		};

		xhr.open('POST', '/contact', true);
		xhr.send(new FormData(contactForm));
	}

	async function contactSuccess() {
		contactForm.style.animation = 'zoom-out 1s forwards';
		await sleep(500);
		mailBtn.classList.remove('open');
		mailBtn.classList.add('closed');
		await sleep(1000);
		mailBtn.style.animation = 'mail-out 1s forwards';
		await sleep(750);
		mailTruck.click();
		contactAgain.style.visibility = 'visible';
		contactAgain.style.animation = 'zoom-in 1s forwards';
	}

	function sleep(ms) {
		return new Promise(resolve => window.setTimeout(resolve, ms));
	}

});
