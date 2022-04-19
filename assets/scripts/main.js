;(function () {
    const getResultButton = document.getElementById("getResultButton")
    const numberOfUsersInputEl = document.querySelector("#freePlanForQuestion0");
    const emailInputEl = document.getElementById("email");

    let planName;
    let monthlyPrice;
    let organizationType;

    let pricePlan;
    let payFrequency;

    let formValid;
    let onQueueForOnScrollIntoViewArr = [];

    const monthlyPriceForPlusPlan = 12;
    const annuallyPriceForPlusPlan = 10;

    getResultButton.addEventListener('click', () => {
        getResults();
    })
    numberOfUsersInputEl.addEventListener('input', () => {
        if (numberOfUsersInputEl.validity.valid) {
            onResetInputToValid(numberOfUsersInputEl);
        } else {
            onShowInputError(numberOfUsersInputEl);
        }
    })
    emailInputEl.addEventListener('input', () => {
        if (emailInputEl.validity.valid) {
            onResetInputToValid(emailInputEl);
        } else {
            onShowInputError(emailInputEl);
        }
    })

    function getResults() {

        onQueueForOnScrollIntoViewArr = [];

        if (!numberOfUsersInputEl.validity.valid) {
            onShowInputError(numberOfUsersInputEl)
            onQueueForOnScrollIntoView(numberOfUsersInputEl)
        }

        formValid = onRadioButtonValidation() && numberOfUsersInputEl.validity.valid && emailInputEl.validity.valid;

        if (!emailInputEl.validity.valid) {
            onShowInputError(emailInputEl);
            onQueueForOnScrollIntoView(emailInputEl)
        }

        onScrollIntoViewForFirstError();

        onFindOutPreferredPlan();

        payFrequency = onFindOutPayFrequency();

        organizationType = onFindOutOrganizationType();

        monthlyPrice = onFindOutFinalResultForMonth(planName);

        onSendingFinalResult();

    }

    function onQueueForOnScrollIntoView(element) {
        onQueueForOnScrollIntoViewArr.push(element);
    }

    function onScrollIntoViewForFirstError() {
        if (onQueueForOnScrollIntoViewArr.length > 0) {
            onQueueForOnScrollIntoViewArr[0].scrollIntoView({behavior: 'smooth', block: 'center'});
        }
    }

    function onRadioButtonValidation() {
        const numberOfRequiredQuestions = 10;
        let radioButtonGroupValid;
        let radioButtonGroup;
        let allRadioButtonQuestionsValid = true;

        for (let i = 1; i <= numberOfRequiredQuestions; i++) {
            radioButtonGroup = [...document.getElementsByName(`question-${i}`)];
            radioButtonGroupValid = radioButtonGroup.some((radioButton) => radioButton.checked);
            if (!radioButtonGroupValid) {
                onShowErrorForRadioButtonGroup(radioButtonGroup[0]);
                onQueueForOnScrollIntoView(radioButtonGroup[0])
                allRadioButtonQuestionsValid = false;
            } else {
                onHideErrorForRadioButtonGroup(radioButtonGroup[0])
            }
        }
        return allRadioButtonQuestionsValid;
    }

    function onShowInputError(input) {
        switch (input.type) {
            case 'number': {
                if (!input.value) {
                    input.style.borderColor = 'red';
                    input.nextElementSibling.innerHTML = '<i class="ph-warning"></i>This field is required';
                } else if (!Number.isInteger(input.value)) {
                    input.style.borderColor = 'red';
                    input.nextElementSibling.innerHTML = '<i class="ph-warning"></i>Entered value needs to be an integer number';
                }
            }
                return
            case 'email': {
                if (input.validity.valueMissing) {
                    input.style.borderColor = 'red';
                    input.nextElementSibling.innerHTML = '<i class="ph-warning"></i>Email is required';
                } else if (input.validity.typeMismatch) {
                    input.style.borderColor = 'red';
                    input.nextElementSibling.innerHTML = '<i class="ph-warning"></i>Entered value needs to be an email address';
                }
            }
                return;
            default:
                break;
        }
    }

    function onResetInputToValid(input) {
        input.nextElementSibling.innerHTML = '';
        input.style.borderColor = '';
    }

    function onShowErrorForRadioButtonGroup(input) {
        input.parentNode.parentNode.children[1].innerHTML = '<i class="ph-warning"></i>This field is required';
    }

    function onHideErrorForRadioButtonGroup(input) {
        input.parentNode.parentNode.children[1].innerHTML = '';
    }

    function onFindOutPreferredPlan() {
        const freePlanRadioButtonsArr = document.querySelectorAll(".free");
        const plusPlanRadioButtonsArr = document.querySelectorAll(".plus");
        const proPlanRadioButtonsArr = document.querySelectorAll(".pro");

        if (numberOfUsersInputEl.value <= 5) {
            freePlanRadioButtonsArr.forEach((radioButton) => {
                if (radioButton.checked) {
                    planName = 'free';
                }
            })
        } else {
            planName = 'plus';
        }

        plusPlanRadioButtonsArr.forEach((radioButton) => {
            if (radioButton.checked) {
                planName = 'plus';
            }
        });
        proPlanRadioButtonsArr.forEach((radioButton) => {
            if (radioButton.checked) {
                planName = 'pro';
            }
        });
    }

    function onFindOutPayFrequency() {
        const monthlyRadioButton = document.querySelector(".monthly");
        const annuallyRadioButton = document.querySelector(".annually");

        if (monthlyRadioButton.checked) {
            pricePlan = monthlyPriceForPlusPlan;
            return 'monthly';
        }

        if (annuallyRadioButton.checked) {
            pricePlan = annuallyPriceForPlusPlan;
            return 'annually';
        }
    }

    function onFindOutOrganizationType() {
        const nonProfitOrEducationOrganizationRadioButton = document.querySelector(".nonProfitOrEducationOrganization");
        if (nonProfitOrEducationOrganizationRadioButton.checked) {
            return 'non-profit or educational';
        } else {
            return 'other';
        }
    }

    function onFindOutFinalResultForMonth(planName) {
        if (organizationType !== 'other') {
            pricePlan = monthlyPriceForPlusPlan / 2;
        }

        switch (planName) {
            case 'plus': {
                return numberOfUsersInputEl.value * pricePlan;
            }
            case 'pro': {
                return numberOfUsersInputEl.value * pricePlan * 2;
            }
            default:
                break;
        }
    }

    function onSendingFinalResult() {
        if (formValid) {
            let values = {
                numberOfUsers: numberOfUsersInputEl.value,
                planName,
                payFrequency,
                organizationType,
                monthlyPrice,
                userEmailAddress: emailInputEl.value
            }

            console.log(values);
        }
    }
})()

