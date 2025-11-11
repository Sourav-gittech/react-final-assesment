import { toast } from "react-toastify";

const decleration = () => {
    return {
        upi: document.getElementById('upi'),
        card: document.getElementById('card'),
        netBanking: document.getElementById('netBanking'),
        emi: document.getElementById('emi'),

        upiPlaceholderValue: document.getElementById('upiPlaceholder'),
        cardNumberPlaceholderValue: document.getElementById('cardNumberPlaceholder'),
        cardCVVPlaceholderValue: document.getElementById('cardCVVPlaceholder'),
        bankingIdPlaceholderValue: document.getElementById('bankingIdPlaceholder'),
        bankingNameHolderValue: document.getElementById('bankingNameHolder'),
        bankAccountEMIPlaceholderValue: document.getElementById('bankAccountEMIPlaceholder'),
        bankAccountEMINameValue: document.getElementById('bankAccountEMIName'),

        paymentButton: document.getElementById('paymentButton')
    }
}

const clearInput = () => {
    const inputValue = decleration();
    inputValue.upiPlaceholderValue.value = '';
    inputValue.cardNumberPlaceholderValue.value = '';
    inputValue.cardCVVPlaceholderValue.value = '';
    inputValue.bankingIdPlaceholderValue.value = '';
    inputValue.bankingNameHolderValue.value = '';
    inputValue.bankAccountEMIPlaceholderValue.value = '';
    inputValue.bankAccountEMINameValue.value = '';
}

let paymentDetails = {
    upiID: null,
    cardDetails: {
        cardNo: null,
        cvv: null
    },
    bankDetails: {
        accountNo: null,
        baneName: null
    },
    cash: false
}

let clearPaymentDetails = {
    upiID: null,
    cardDetails: {
        cardNo: null,
        cvv: null
    },
    bankDetails: {
        accountNo: null,
        baneName: null
    },
    cash: false
}

const radioUpi = () => {
    clearInput();
    const inputValue = decleration();
    inputValue.upi.classList.remove('hidden');
    inputValue.card.classList.add('hidden');
    inputValue.netBanking.classList.add('hidden');
    inputValue.emi.classList.add('hidden');

    paymentButton.disabled = true;
}

const radioCard = () => {
    clearInput();
    const inputValue = decleration();
    inputValue.upi.classList.add('hidden');
    inputValue.card.classList.remove('hidden');
    inputValue.netBanking.classList.add('hidden');
    inputValue.emi.classList.add('hidden');

    paymentButton.disabled = true;
}

const radioNetBanking = () => {
    clearInput();
    const inputValue = decleration();
    inputValue.upi.classList.add('hidden');
    inputValue.card.classList.add('hidden');
    inputValue.netBanking.classList.remove('hidden');
    inputValue.emi.classList.add('hidden');

    paymentButton.disabled = true;
}

const radioEmi = () => {
    clearInput();
    const inputValue = decleration();
    inputValue.upi.classList.add('hidden');
    inputValue.card.classList.add('hidden');
    inputValue.netBanking.classList.add('hidden');
    inputValue.emi.classList.remove('hidden');

    paymentButton.disabled = true;
}

const radioCod = () => {
    clearInput();
    const inputValue = decleration();
    inputValue.upi.classList.add('hidden');
    inputValue.card.classList.add('hidden');
    inputValue.netBanking.classList.add('hidden');
    inputValue.emi.classList.add('hidden');

    paymentDetails = { ...clearPaymentDetails,cash: true };

    paymentButton.disabled = false;
}

const okinputMode = (mode) => {
    paymentButton.disabled = false;
    toast.success(mode + " verified successfully");
}

const notOkinputMode = (mode) => {
    paymentButton.disabled = true;
    toast.warn("Invalid " + mode)
}

const handleUpi = () => {
    const inputValue = decleration();
    const upiPattern = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z0-9]{2,64}$/, mode = 'UPI ID';

    let isOk = upiPattern.test(inputValue.upiPlaceholderValue.value);
    isOk ?
        (okinputMode(mode), paymentDetails = {
            ...clearPaymentDetails,
            upiID: inputValue.upiPlaceholderValue.value
        }) : notOkinputMode(mode);
}

const handleCard = () => {
    const inputValue = decleration();
    const cardNumberPattern = /^\d{16}$/, cardCVVPattern = /^\d{3}$/, mode = 'Card details';

    let isNumberOk = cardNumberPattern.test(inputValue.cardNumberPlaceholderValue.value);
    let isCVVrOk = cardCVVPattern.test(inputValue.cardCVVPlaceholderValue.value);

    isNumberOk && isCVVrOk ?
        (okinputMode(mode), paymentDetails = {
            ...clearPaymentDetails,
            cardDetails: {
                cardNo: inputValue.cardNumberPlaceholderValue.value,
                cvv: inputValue.cardCVVPlaceholderValue.value
            }
        }) : notOkinputMode(mode);
}

const handleNetBanking = () => {
    const inputValue = decleration();
    const bankingIdPattern = /^.{8,}$/, mode = 'Banking details';

    let isIDOk = bankingIdPattern.test(inputValue.bankingIdPlaceholderValue.value);
    let isNameOk = inputValue.bankingNameHolderValue.options[inputValue.bankingNameHolderValue.selectedIndex].value === '' ? false : true;

    isIDOk && isNameOk ?
        (okinputMode(mode), paymentDetails = {
            ...clearPaymentDetails,
            bankDetails: {
                accountNo: inputValue.bankingIdPlaceholderValue.value,
                baneName: inputValue.bankingNameHolderValue.options[inputValue.bankingNameHolderValue.selectedIndex].value
            }
        }) : notOkinputMode(mode);
}

const handleEmi = () => {
    const inputValue = decleration();
    const bankingIdPattern = /^.{8,}$/, mode = 'Banking details';

    let isIDOk = bankingIdPattern.test(inputValue.bankAccountEMIPlaceholderValue.value);
    let isNameOk = inputValue.bankAccountEMINameValue.options[inputValue.bankAccountEMINameValue.selectedIndex].value === '' ? false : true;

    isIDOk && isNameOk ?
        (okinputMode(mode), paymentDetails = {
            ...clearPaymentDetails,
            bankDetails: {
                accountNo: inputValue.bankAccountEMIPlaceholderValue.value,
                baneName: inputValue.bankAccountEMINameValue.options[inputValue.bankAccountEMINameValue.selectedIndex].value
            }
        }) : notOkinputMode(mode);
}

export { radioUpi, radioCard, radioNetBanking, radioEmi, radioCod, handleUpi, handleCard, handleNetBanking, handleEmi, paymentDetails };