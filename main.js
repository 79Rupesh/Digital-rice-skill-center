import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js';

import {
    addDoc,
    collection,
    getDoc,
    doc,
    getFirestore,
    serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js';


const firebaseConfig = {
    apiKey: "AIzaSyD6otrGTDeW55SKZUrmk0BfDhh8c1I1lRc",
    authDomain: "digital-rise-skill-center.firebaseapp.com",
    projectId: "digital-rise-skill-center",
    storageBucket: "digital-rise-skill-center.firebasestorage.app",
    messagingSenderId: "596472090939",
    appId: "1:596472090939:web:b170785263cef3c885e71e",
    measurementId: "G-P93FV9Q4FB"
};


const notificationEmail =
    "rupeshkumarbijewar@gmail.com";


const isFirebaseConfigured =
    !Object.values(firebaseConfig).some(
        value => value.includes('PASTE_YOUR')
    );


const firebaseApp =
    isFirebaseConfigured
        ? initializeApp(firebaseConfig)
        : null;


const db =
    firebaseApp
        ? getFirestore(firebaseApp)
        : null;


const FORM_TIMEOUT_MS = 12000;
document.addEventListener('DOMContentLoaded', () => {

    const contactForm =
        document.querySelector('.contact-form');

    const formMessage =
        document.getElementById('form-message');

    const splashScreen =
        document.getElementById('splash-screen');

    const aiAssistant =
        document.getElementById('ai-assistant');

    const splashProgress =
        document.querySelector('.splash-progress');

    const progressCount =
        document.querySelector('.progress-count');

    const progressFill =
        document.querySelector('.progress-fill');

    const revealSelectors = [
        '.hero-card',
        '.offer-card',
        '.positioning-card',
        '.glass-card',
        '.section-header',
        '.course-card',
        '.step',
        '.ceo-card',
        '.footer-col'
    ];

    /* =========================================
   CONTACT FORM
========================================= */

    if (contactForm) {

        contactForm.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );

                const formData =
                    new FormData(contactForm);

                const name =
                    formData.get('name')
                        ?.toString()
                        .trim() || '';

                const phone =
                    formData.get('phone')
                        ?.toString()
                        .trim() || '';

                const email =
                    formData.get('email')
                        ?.toString()
                        .trim() || '';


                if (
                    !validateApplication({
                        name,
                        phone,
                        email
                    })
                ) {

                    showFormMessage(
                        'Name must be at least 2 characters, phone must contain at least 10 digits, and email must be at least 5 characters.',
                        'error'
                    );

                    return;
                }


                const application = {

                    name: name,

                    phone: phone,

                    email: email

                };


                if (!db) {

                    showFormMessage(
                        'The form will be available after the Firebase configuration is completed.',
                        'error'
                    );

                    return;
                }


                if (!navigator.onLine) {

                    showFormMessage(
                        'No internet connection is available. Please connect to the internet and try again.',
                        'error'
                    );

                    return;
                }


                submitButton.disabled = true;

                submitButton.textContent =
                    'Submitting...';


                showFormMessage(
                    'Please wait, your application is being submitted...',
                    'info'
                );


                try {

                    const applicationRef =
                        await withTimeout(

                            addDoc(
                                collection(
                                    db,
                                    'applications'
                                ),
                                application
                            ),

                            FORM_TIMEOUT_MS,

                            'Firebase request timed out'

                        );


                    if (notificationEmail) {

                        addDoc(
                            collection(
                                db,
                                'mail'
                            ),
                            {

                                to: [
                                    notificationEmail
                                ],

                                createdAt:
                                    serverTimestamp(),

                                message: {

                                    subject:
                                        `New website application - ${application.name}`,

                                    text:
                                        `New application received.

Application ID: ${applicationRef.id}
Name: ${application.name}
Phone: ${application.phone}
Email: ${application.email}`

                                }

                            }
                        ).catch(
                            (mailError) => {

                                console.warn(
                                    'Notification email enqueue failed:',
                                    mailError
                                );

                            }
                        );

                    }


                    contactForm.reset();


                    showFormMessage(
                        'Application submitted successfully. An email notification will be sent.',
                        'success'
                    );


                } catch (error) {

                    console.error(
                        'Application submit failed:',
                        error
                    );


                    savePendingApplication({

                        ...application,

                        createdAt:
                            new Date().toISOString()

                    });


                    const firebaseError =
                        error?.code ||
                        error?.message ||
                        String(error);


                    const permissionIssue =
                        /permission|PERMISSION_DENIED|Missing or insufficient permissions/i
                            .test(firebaseError);


                    const messageText =
                        permissionIssue

                            ? 'Application could not be submitted because of a Firebase permission issue. Please try again later.'

                            : `Submit failed: ${firebaseError}`;


                    showFormMessage(
                        messageText,
                        'error'
                    );


                } finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        'Apply Now';

                }

            }
        );

    }
    /* =========================================
   CONTACT FORM
========================================= */

    if (contactForm) {

        contactForm.addEventListener(
            'submit',
            async (event) => {

                event.preventDefault();

                const submitButton =
                    contactForm.querySelector(
                        'button[type="submit"]'
                    );

                const formData =
                    new FormData(contactForm);

                const name =
                    formData.get('name')
                        ?.toString()
                        .trim() || '';

                const phone =
                    formData.get('phone')
                        ?.toString()
                        .trim() || '';

                const email =
                    formData.get('email')
                        ?.toString()
                        .trim() || '';


                if (
                    !validateApplication({
                        name,
                        phone,
                        email
                    })
                ) {

                    showFormMessage(
                        'Name must be at least 2 characters, phone must contain at least 10 digits, and email must be at least 5 characters.',
                        'error'
                    );

                    return;
                }


                const application = {

                    name: name,

                    phone: phone,

                    email: email

                };


                if (!db) {

                    showFormMessage(
                        'The form will be available after the Firebase configuration is completed.',
                        'error'
                    );

                    return;
                }


                if (!navigator.onLine) {

                    showFormMessage(
                        'No internet connection is available. Please connect to the internet and try again.',
                        'error'
                    );

                    return;
                }


                submitButton.disabled = true;

                submitButton.textContent =
                    'Submitting...';


                showFormMessage(
                    'Please wait, your application is being submitted...',
                    'info'
                );


                try {

                    const applicationRef =
                        await withTimeout(

                            addDoc(
                                collection(
                                    db,
                                    'applications'
                                ),
                                application
                            ),

                            FORM_TIMEOUT_MS,

                            'Firebase request timed out'

                        );


                    if (notificationEmail) {

                        addDoc(
                            collection(
                                db,
                                'mail'
                            ),
                            {

                                to: [
                                    notificationEmail
                                ],

                                createdAt:
                                    serverTimestamp(),

                                message: {

                                    subject:
                                        `New website application - ${application.name}`,

                                    text:
                                        `New application received.

Application ID: ${applicationRef.id}
Name: ${application.name}
Phone: ${application.phone}
Email: ${application.email}`

                                }

                            }
                        ).catch(
                            (mailError) => {

                                console.warn(
                                    'Notification email enqueue failed:',
                                    mailError
                                );

                            }
                        );

                    }


                    contactForm.reset();


                    showFormMessage(
                        'Application submitted successfully. An email notification will be sent.',
                        'success'
                    );


                } catch (error) {

                    console.error(
                        'Application submit failed:',
                        error
                    );


                    savePendingApplication({

                        ...application,

                        createdAt:
                            new Date().toISOString()

                    });


                    const firebaseError =
                        error?.code ||
                        error?.message ||
                        String(error);


                    const permissionIssue =
                        /permission|PERMISSION_DENIED|Missing or insufficient permissions/i
                            .test(firebaseError);


                    const messageText =
                        permissionIssue

                            ? 'Application could not be submitted because of a Firebase permission issue. Please try again later.'

                            : `Submit failed: ${firebaseError}`;


                    showFormMessage(
                        messageText,
                        'error'
                    );


                } finally {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        'Apply Now';

                }

            }
        );

    }
    /* =========================================
   FORM MESSAGE
========================================= */

    function showFormMessage(text, type) {

        if (!formMessage) {
            return;
        }

        formMessage.textContent = text;

        formMessage.className =
            `form-message ${type}`;

    }


    /* =========================================
       VALIDATE APPLICATION
    ========================================= */

    function validateApplication(application) {

        return (

            typeof application.name === 'string' &&

            typeof application.phone === 'string' &&

            typeof application.email === 'string' &&

            application.name.trim().length >= 2 &&

            application.phone.trim().length >= 10 &&

            application.email.trim().length >= 5

        );

    }


    /* =========================================
       REQUEST TIMEOUT
    ========================================= */

    function withTimeout(
        promise,
        timeoutMs,
        timeoutMessage
    ) {

        return Promise.race([

            promise,

            new Promise((_, reject) => {

                setTimeout(() => {

                    reject(
                        new Error(timeoutMessage)
                    );

                }, timeoutMs);

            })

        ]);

    }


    /* =========================================
       SAVE PENDING APPLICATION
    ========================================= */

    function savePendingApplication(application) {

        try {

            const pendingApplications =
                JSON.parse(
                    localStorage.getItem(
                        'pendingApplications'
                    ) || '[]'
                );


            pendingApplications.push(
                application
            );


            localStorage.setItem(
                'pendingApplications',
                JSON.stringify(
                    pendingApplications
                )
            );


        } catch (storageError) {

            console.warn(
                'Pending application backup failed:',
                storageError
            );

        }

    }
    /* =========================================
   ANIMATION
========================================= */

    const revealElements = revealSelectors
        .map(selector =>
            Array.from(
                document.querySelectorAll(selector)
            )
        )
        .flat();


    revealElements.forEach(element => {

        element.classList.add(
            'reveal-item'
        );

    });


    const observer =
        new IntersectionObserver(

            (entries) => {

                entries.forEach(entry => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add(
                            'revealed'
                        );

                        observer.unobserve(
                            entry.target
                        );

                    }

                });

            },

            {
                threshold: 0.18
            }

        );


    revealElements.forEach(element => {

        observer.observe(element);

    });


    let pageLoaded = false;

    let progressDone = false;


    /* =========================================
       START SPLASH PROGRESS
    ========================================= */

    const startProgress = () => {

        if (
            !splashProgress ||
            !progressCount ||
            !progressFill
        ) {
            return;
        }


        splashProgress.classList.add(
            'visible'
        );


        let value = 0;


        const interval = setInterval(() => {

            value += 1;


            progressCount.textContent =
                `${value}%`;


            progressFill.style.width =
                `${value}%`;


            if (value >= 100) {

                clearInterval(interval);

                progressDone = true;


                if (pageLoaded) {

                    setTimeout(() => {

                        hideSplash();

                    }, 400);

                }

            }

        }, 20);

    };


    /* =========================================
       SHOW AI ASSISTANT
    ========================================= */

    const showAssistant = () => {

        if (!aiAssistant) {
            return;
        }


        aiAssistant.classList.remove(
            'hidden'
        );


        aiAssistant.classList.add(
            'visible'
        );

    };


    /* =========================================
       HIDE SPLASH SCREEN
    ========================================= */

    const hideSplash = () => {

        if (!splashScreen) {
            return;
        }


        splashScreen.classList.add(
            'hidden'
        );


        setTimeout(() => {

            splashScreen.remove();

            showAssistant();

        }, 500);

    };


    /* =========================================
       PAGE LOAD
    ========================================= */

    window.addEventListener(
        'load',
        () => {

            pageLoaded = true;


            if (progressDone) {

                setTimeout(() => {

                    hideSplash();

                }, 400);

            }

        }
    );


    startProgress();

    /* =========================================
       REAL GEMINI AI ASSISTANT
    ========================================= */

    const aiToggle =
        document.getElementById('ai-toggle');

    const aiChat =
        document.getElementById('ai-chat');

    const aiClose =
        document.getElementById('ai-close');

    const aiInput =
        document.getElementById('ai-input');

    const aiSend =
        document.getElementById('ai-send');

    const aiMessages =
        document.getElementById('ai-messages');


    /* =========================================
       ADD MESSAGE
    ========================================= */

    const addMessage = (
        text,
        type = 'bot'
    ) => {

        if (!aiMessages) {
            return;
        }

        const message =
            document.createElement('div');

        message.className =
            `ai-message ${type}`;

        message.textContent =
            text;

        aiMessages.appendChild(
            message
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;
    };


    /* =========================================
       OPEN / CLOSE AI
    ========================================= */

    if (aiToggle) {

        aiToggle.addEventListener(
            'click',
            () => {

                aiChat.classList.toggle(
                    'open'
                );

            }
        );

    }


    if (aiClose) {

        aiClose.addEventListener(
            'click',
            () => {

                aiChat.classList.remove(
                    'open'
                );

            }
        );

    }


    /* =========================================
       SEND QUESTION TO GEMINI
    ========================================= */

    const sendQuestion = async () => {

        if (!aiInput) {
            return;
        }

        const question =
            aiInput.value.trim();

        if (!question) {
            return;
        }


        /* User message */

        addMessage(
            question,
            'user'
        );


        /* Clear input */

        aiInput.value = '';


        /* Thinking message */

        const thinkingMessage =
            document.createElement('div');

        thinkingMessage.className =
            'ai-message bot';

        thinkingMessage.textContent =
            'Thinking...';

        aiMessages.appendChild(
            thinkingMessage
        );

        aiMessages.scrollTop =
            aiMessages.scrollHeight;


        try {

            /* =================================
               CALL FASTAPI
            ================================= */

            const response =
                await fetch(
                    'http://127.0.0.1:8000/chat',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body: JSON.stringify({
                            question: question
                        })
                    }
                );


            /* =================================
               CHECK SERVER RESPONSE
            ================================= */

            if (!response.ok) {

                throw new Error(
                    `Server returned ${response.status}`
                );

            }


            /* =================================
               GET AI RESPONSE
            ================================= */

            const data =
                await response.json();


            /* Remove Thinking */

            thinkingMessage.remove();


            /* Show Gemini answer */

            addMessage(
                data.answer,
                'bot'
            );


        } catch (error) {

            console.error(
                'Gemini AI Error:',
                error
            );


            /* Remove Thinking */

            thinkingMessage.remove();


            /* Show error */

            addMessage(
                'Sorry, AI service is currently unavailable. Please try again.',
                'bot'
            );

        }

    };


    /* =========================================
       SEND BUTTON
    ========================================= */

    if (aiSend) {

        aiSend.addEventListener(
            'click',
            sendQuestion
        );

    }


    /* =========================================
       ENTER KEY
    ========================================= */

    if (aiInput) {

        aiInput.addEventListener(
            'keydown',
            (event) => {

                if (
                    event.key === 'Enter'
                ) {

                    event.preventDefault();

                    sendQuestion();

                }

            }
        );

    }
    /* =========================================
   REGISTRATION MODAL
========================================= */

    const openRegisterTop =
        document.getElementById(
            'open-enroll-modal'
        );

    const openRegisterFooter =
        document.getElementById(
            'open-enroll-footer'
        );

    const registerModal =
        document.getElementById(
            'register-modal'
        );

    const registerClose =
        document.getElementById(
            'register-close'
        );

    const registerForm =
        document.querySelector(
            '.register-form'
        );

    const paymentStep =
        document.getElementById(
            'registration-payment-step'
        );

    const modalPayBtn =
        document.getElementById(
            'modal-pay-fee'
        );

    const modalPaymentStatus =
        document.getElementById(
            'modal-payment-status'
        );

    const modalFormMessage =
        document.getElementById(
            'modal-form-message'
        );

    const paymentPopup =
        document.getElementById(
            'payment-popup'
        );

    const paymentCard =
        document.getElementById(
            'payment-card'
        );

    const paymentClose =
        document.getElementById(
            'payment-close'
        );

    const popupPayDone =
        document.getElementById(
            'popup-pay-done'
        );

    const popupPaymentStatus =
        document.getElementById(
            'popup-payment-status'
        );

    const paymentSuccessDone =
        document.getElementById(
            'payment-success-done'
        );


    let pendingRegistration = null;


    const openPaymentPopup = () => {

        if (paymentCard) {

            paymentCard.classList.remove(
                'success'
            );

        }


        if (paymentSuccessDone) {

            paymentSuccessDone.classList.add(
                'hidden'
            );

        }


        if (popupPayDone) {

            popupPayDone.disabled =
                false;

            popupPayDone.textContent =
                'I Have Paid Rs. 300';

        }


        if (popupPaymentStatus) {

            popupPaymentStatus.textContent =
                'Waiting for payment confirmation.';

            popupPaymentStatus.className =
                'form-message info';

        }


        if (paymentPopup) {

            paymentPopup.classList.remove(
                'hidden'
            );

        }

    };


    const closePaymentPopup = () => {

        if (paymentPopup) {

            paymentPopup.classList.add(
                'hidden'
            );

        }

    };


    const showPaymentSuccess = () => {

        if (paymentCard) {

            paymentCard.classList.add(
                'success'
            );

        }


        if (paymentSuccessDone) {

            paymentSuccessDone.classList.remove(
                'hidden'
            );

        }

    };


    /* =========================================
    OPEN REGISTRATION MODAL
    ========================================= */

    const openRegister = (event) => {

        if (event) {
            event.preventDefault();
        }

        if (registerModal) {

            registerModal.classList.remove(
                'hidden'
            );

        }

    };


    /* =========================================
       CLOSE REGISTRATION MODAL
    ========================================= */

    const closeRegister = () => {

        if (registerModal) {

            registerModal.classList.add(
                'hidden'
            );

        }


        pendingRegistration = null;


        if (modalPaymentStatus) {

            modalPaymentStatus.textContent =
                '';

        }


        if (modalFormMessage) {

            modalFormMessage.textContent =
                '';

        }


        if (registerForm) {

            registerForm.reset();

        }


        const qrSection =
            document.getElementById(
                'upi-qr-section'
            );


        if (qrSection) {

            qrSection.remove();

        }


        const submitButton =
            registerForm?.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                'Continue to Pay ₹300';

        }

    };


    /* =========================================
       MODAL EVENTS
    ========================================= */

    if (openRegisterTop) {

        openRegisterTop.addEventListener(
            'click',
            openRegister
        );

    }


    if (openRegisterFooter) {

        openRegisterFooter.addEventListener(
            'click',
            openRegister
        );

    }


    if (registerClose) {

        registerClose.addEventListener(
            'click',
            closeRegister
        );

    }


    if (paymentClose) {

        paymentClose.addEventListener(
            'click',
            closePaymentPopup
        );

    }


    if (paymentSuccessDone) {

        paymentSuccessDone.addEventListener(
            'click',
            closePaymentPopup
        );

    }


    if (
        popupPayDone &&
        popupPaymentStatus
    ) {

        popupPayDone.addEventListener(
            'click',
            async () => {

                if (!pendingRegistration) {

                    popupPaymentStatus.textContent =
                        'Please complete the registration form first.';

                    popupPaymentStatus.className =
                        'form-message error';

                    return;
                }


                popupPayDone.disabled =
                    true;

                popupPayDone.textContent =
                    'Processing...';


                popupPaymentStatus.textContent =
                    'Processing your registration...';

                popupPaymentStatus.className =
                    'form-message info';


                await new Promise(
                    resolve => {

                        setTimeout(
                            resolve,
                            800
                        );

                    }
                );


                const completed =
                    await completeRegistration({

                        ...pendingRegistration,

                        registrationFee:
                            300,

                        paymentStatus:
                            'successful',

                        paymentMode:
                            'upi_qr'

                    });


                if (completed) {

                    popupPaymentStatus.textContent =
                        'Payment successful.';

                    popupPaymentStatus.className =
                        'form-message success';

                    showPaymentSuccess();

                } else {

                    popupPayDone.disabled =
                        false;

                    popupPayDone.textContent =
                        'I Have Paid Rs. 300';

                    popupPaymentStatus.textContent =
                        'Registration could not be completed. Please try again.';

                    popupPaymentStatus.className =
                        'form-message error';

                }

            }
        );

    }
    /* =========================================
   REGISTRATION FORM SUBMISSION
========================================= */

    if (registerForm) {

        registerForm.addEventListener(
            'submit',
            (event) => {

                event.preventDefault();


                const submitButton =
                    registerForm.querySelector(
                        'button[type="submit"]'
                    );


                const formData =
                    new FormData(registerForm);


                const name =
                    formData.get('name')
                        ?.toString()
                        .trim() || '';


                const phone =
                    formData.get('phone')
                        ?.toString()
                        .trim() || '';


                const email =
                    formData.get('email')
                        ?.toString()
                        .trim() || '';


                /* =================================
                   VALIDATE FORM
                ================================= */

                if (
                    !validateApplication({
                        name,
                        phone,
                        email
                    })
                ) {

                    if (modalFormMessage) {

                        modalFormMessage.textContent =
                            'Please provide a valid name, phone number, and email address.';

                        modalFormMessage.className =
                            'form-message error';

                    }

                    return;

                }


                /* =================================
                   SAVE REGISTRATION DETAILS
                ================================= */

                pendingRegistration = {

                    name: name,

                    phone: phone,

                    email: email

                };


                openPaymentPopup();


                /* =================================
                   SHOW PAYMENT SECTION
                ================================= */

                if (false && paymentStep) {

                    paymentStep.classList.remove(
                        'hidden'
                    );


                    let qrSection =
                        document.getElementById(
                            'upi-qr-section'
                        );


                    if (!qrSection) {

                        qrSection =
                            document.createElement(
                                'div'
                            );


                        qrSection.id =
                            'upi-qr-section';


                        qrSection.className =
                            'upi-qr-section';


                        qrSection.innerHTML = `

                            <div class="upi-payment-box">

                                <h3>
                                    Registration Fee: ₹300
                                </h3>


                                <p>
                                    Scan this UPI QR Code
                                    and pay exactly ₹300.
                                </p>


                                <img
                                    src="payment-qr.png"
                                    alt="UPI Payment QR Code"
                                    class="upi-qr-image"
                                >


                                <p
                                    class="upi-payment-note"
                                    style="color: #0a0909;"
                                >
                                    After completing the payment,
                                    click the

    <strong>
        I Have Paid ₹300
    </strong>

    button.
</p>

                            </div>

                        `;


                        paymentStep.prepend(
                            qrSection
                        );

                    }

                }


                /* =================================
                UPDATE PAYMENT MESSAGE
                ================================= */

                if (modalFormMessage) {

                    modalFormMessage.textContent =
                        'Registration details saved. Please scan the QR Code and pay the ₹300 Registration Fee.';

                    modalFormMessage.className =
                        'form-message info';

                }


                if (modalPaymentStatus) {

                    modalPaymentStatus.textContent =
                        'After completing the payment, click "I Have Paid ₹300".';

                    modalPaymentStatus.className =
                        'form-message info';

                }


                /* =================================
                UPDATE BUTTONS
                ================================= */

                if (modalPayBtn) {

                    modalPayBtn.textContent =
                        'I Have Paid ₹300';

                    modalPayBtn.disabled =
                        false;

                }


                if (submitButton) {

                    submitButton.textContent =
                        'Details Saved';

                    submitButton.disabled =
                        true;

                }

            }
        );

    }
    /* =========================================
   PAYMENT BUTTON
========================================= */

    if (
        modalPayBtn &&
        modalPaymentStatus
    ) {

        modalPayBtn.addEventListener(
            'click',
            async () => {

                if (!pendingRegistration) {

                    modalPaymentStatus.textContent =
                        'Please complete the registration form first.';

                    modalPaymentStatus.className =
                        'form-message error';

                    return;
                }


                modalPayBtn.disabled = true;

                modalPayBtn.textContent =
                    'Processing...';


                modalPaymentStatus.textContent =
                    'Processing your registration...';

                modalPaymentStatus.className =
                    'form-message info';


                /*
                    This currently uses the QR payment
                    confirmation button.

                    Real payment verification can be
                    connected later using a payment gateway.
                */

                await new Promise(
                    resolve => {

                        setTimeout(
                            resolve,
                            800
                        );

                    }
                );


                await completeRegistration({

                    ...pendingRegistration,

                    registrationFee: 300,

                    paymentStatus:
                        'successful',

                    paymentMode:
                        'upi_qr'

                });


                modalPayBtn.disabled =
                    false;

                modalPayBtn.textContent =
                    'I Have Paid ₹300';

            }
        );

    }
    /* =========================================
   COMPLETE REGISTRATION
========================================= */

    async function completeRegistration(
        application
    ) {

        /* =================================
           FIREBASE CHECK
        ================================= */

        if (!db) {

            if (modalFormMessage) {

                modalFormMessage.textContent =
                    'Firebase is not configured. Registration data has been saved locally.';

                modalFormMessage.className =
                    'form-message error';

            }


            savePendingApplication({

                ...application,

                createdAt:
                    new Date().toISOString()

            });


            return false;

        }


        /* =================================
           INTERNET CHECK
        ================================= */

        if (!navigator.onLine) {

            if (modalFormMessage) {

                modalFormMessage.textContent =
                    'No internet connection is available. Registration data has been saved locally.';

                modalFormMessage.className =
                    'form-message error';

            }


            savePendingApplication({

                ...application,

                createdAt:
                    new Date().toISOString()

            });


            return false;

        }


        /* =================================
           SHOW SUBMISSION STATUS
        ================================= */

        if (modalFormMessage) {

            modalFormMessage.textContent =
                'Payment confirmed. Your registration is being submitted...';

            modalFormMessage.className =
                'form-message info';

        }


        try {

            /* =================================
               CREATE PAYMENT RECORD
            ================================= */

            const paymentDoc = {

                name:
                    application.name,

                phone:
                    application.phone,

                email:
                    application.email,

                amount:
                    application.registrationFee ||
                    300,

                type:
                    'registration',

                provider:
                    application.paymentMode ||
                    'upi_qr',

                status:
                    application.paymentStatus ||
                    'successful',

                createdAt:
                    serverTimestamp()

            };


            const paymentRef =
                await withTimeout(

                    addDoc(
                        collection(
                            db,
                            'payments'
                        ),
                        paymentDoc
                    ),

                    FORM_TIMEOUT_MS,

                    'Payment write timed out'

                );


            /* =================================
            CREATE APPLICATION RECORD
            ================================= */

            const appData = {

                name:
                    application.name,

                phone:
                    application.phone,

                email:
                    application.email,

                status:
                    'interview_pending',

                registrationPaid:
                    true,

                registrationFee:
                    application.registrationFee ||
                    300,

                registrationPaidAt:
                    serverTimestamp(),

                registrationPaymentId:
                    paymentRef.id,

                createdAt:
                    serverTimestamp()

            };


            const applicationRef =
                await withTimeout(

                    addDoc(
                        collection(
                            db,
                            'applications'
                        ),
                        appData
                    ),

                    FORM_TIMEOUT_MS,

                    'Application write timed out'

                );


            /* =================================
               SEND EMAIL NOTIFICATION
            ================================= */

            if (notificationEmail) {

                addDoc(

                    collection(
                        db,
                        'mail'
                    ),

                    {

                        to: [
                            notificationEmail
                        ],

                        createdAt:
                            serverTimestamp(),

                        message: {

                            subject:
                                `New paid registration - ${appData.name}`,

                            text:
                                `Application ID: ${applicationRef.id}

Name: ${appData.name}

Phone: ${appData.phone}

Email: ${appData.email}

Registration Fee: Rs. 300

Payment Status: ${paymentDoc.status}`

                        }

                    }

                ).catch(
                    (error) => {

                        console.warn(
                            'Notification email enqueue failed:',
                            error
                        );

                    }
                );

            }


            /* =================================
               SAVE APPLICATION ID
            ================================= */

            try {

                localStorage.setItem(
                    'applicationId',
                    applicationRef.id
                );

            } catch (error) {

                console.warn(
                    'Application ID storage failed:',
                    error
                );

            }


            /* =================================
               CLOSE REGISTRATION MODAL
            ================================= */

            closeRegister();


            /* =================================
               SHOW SUCCESS MESSAGE
            ================================= */

            if (formMessage) {

                formMessage.textContent =
                    '₹300 payment successful. Registration completed successfully. Our team will contact you regarding the interview.';

                formMessage.className =
                    'form-message success';

            }


            return true;


        } catch (error) {

            console.error(
                'Registration submission failed:',
                error
            );


            savePendingApplication({

                ...application,

                createdAt:
                    new Date().toISOString()

            });


            if (modalFormMessage) {

                modalFormMessage.textContent =
                    'Registration submission failed. Your details have been saved locally.';

                modalFormMessage.className =
                    'form-message error';

            }


            return false;

        }

    }
    /* =========================================
   SITE SETTINGS
========================================= */

    let siteSettings = {
        finalTrainingFee: 5000
    };


    /* =========================================
       LOAD SITE SETTINGS
    ========================================= */

    async function loadSiteSettings() {

        if (!db) {
            return;
        }


        try {

            const settingsDoc =
                await getDoc(
                    doc(
                        db,
                        'settings',
                        'site'
                    )
                );


            if (settingsDoc.exists()) {

                const data =
                    settingsDoc.data();


                if (data?.finalTrainingFee) {

                    siteSettings.finalTrainingFee =
                        data.finalTrainingFee;

                }

            }


        } catch (error) {

            console.warn(
                'Failed to load site settings:',
                error
            );

        }

    }


    /* =========================================
       APPLICATION STATUS
    ========================================= */

    async function fetchApplicationStatus(
        applicationId
    ) {

        if (!db || !applicationId) {
            return;
        }


        try {

            const applicationDocument =
                await getDoc(
                    doc(
                        db,
                        'applications',
                        applicationId
                    )
                );


            if (!applicationDocument.exists()) {

                if (formMessage) {

                    formMessage.textContent =
                        'Application ID not found.';

                    formMessage.className =
                        'form-message error';

                }

                return;

            }


            const data =
                applicationDocument.data();


            let statusText =
                `Status: ${data.status || 'unknown'}`;


            /* =================================
               INTERVIEW PENDING
            ================================= */

            if (
                data.status ===
                'interview_pending'
            ) {

                statusText =
                    'Registration payment received. Interview process is pending. The admin team will contact you.';

            }


            /* =================================
               INTERVIEW PASSED
            ================================= */

            if (
                data.status ===
                'interview_passed'
            ) {

                statusText =
                    'Interview cleared. You are selected for 3 Days Online FREE Training.';

            }


            /* =================================
               3 DAYS FREE TRAINING
            ================================= */

            if (
                data.status ===
                '3day_training'
            ) {

                const trainingStart =
                    data.trainingStartAt
                        ?.toDate?.()
                        ?.toLocaleString?.() || '';


                statusText =
                    `3 Days Online FREE Training is in progress. Training starts: ${trainingStart}`;

            }


            /* =================================
               FINAL TRAINING PENDING
            ================================= */

            if (
                data.status ===
                'final_training_pending'
            ) {

                statusText =
                    `3 Days FREE Training completed. Final Training is available. Final Training Fee: ₹${siteSettings.finalTrainingFee}`;

            }


            /* =================================
               FINAL TRAINING PAID
            ================================= */

            if (
                data.status ===
                'final_training_paid'
            ) {

                statusText =
                    'Final Training Fee received. Welcome to the Final Training Program.';

            }


            if (formMessage) {

                formMessage.textContent =
                    statusText;

                formMessage.className =
                    'form-message info';

            }


        } catch (error) {

            console.error(
                'Failed to fetch application status:',
                error
            );

        }

    }
    /* =========================================
   LOAD SETTINGS AND APPLICATION STATUS
========================================= */

    (async () => {

        await loadSiteSettings();


        try {

            const storedApplicationId =
                localStorage.getItem(
                    'applicationId'
                );


            if (storedApplicationId) {

                await fetchApplicationStatus(
                    storedApplicationId
                );

            }

        } catch (error) {

            console.warn(
                'Failed to load application status:',
                error
            );

        }

    })();


    /* =========================================
    CLOSE DOM CONTENT LOADED
    ========================================= */

});



// ================================
// MOBILE NAVIGATION MENU
// ================================

const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuBtn && navLinks) {

    mobileMenuBtn.addEventListener("click", function () {

        navLinks.classList.toggle("mobile-menu-open");

        const isOpen = navLinks.classList.contains("mobile-menu-open");

        mobileMenuBtn.setAttribute(
            "aria-expanded",
            isOpen ? "true" : "false"
        );

        mobileMenuBtn.setAttribute(
            "aria-label",
            isOpen ? "Close navigation menu" : "Open navigation menu"
        );

        mobileMenuBtn.textContent = isOpen ? "✕" : "☰";
    });


    // Menu link par click/touch hone ke baad menu close
    navLinks.querySelectorAll("a").forEach(function (link) {

        link.addEventListener("click", function () {

            navLinks.classList.remove("mobile-menu-open");

            mobileMenuBtn.setAttribute(
                "aria-expanded",
                "false"
            );

            mobileMenuBtn.setAttribute(
                "aria-label",
                "Open navigation menu"
            );

            mobileMenuBtn.textContent = "☰";
        });

    });
}