document.addEventListener("DOMContentLoaded", function () {
	MAX_LENGTH = 16;
	
	var calcMemory = 0,
		lang = Languages.ENGLISH,
		$result = document.getElementById("Result"),
		firstOperand,
		isDisabled = false,
		isMemoryDisabled = true,
		isPercent = false,
		isReset = false,
		operation;

	document.querySelectorAll(".memory").forEach((elem) => {
		elem.val = parseInt(elem.value);

		elem.addEventListener("click", function () {
			playAudio();

			var result = parseFloat(removeSeparator($result.value));

			switch (this.val) {
				case Operations.MemoryClear:
					memory = 0;
					isMemoryDisabled = true;

					disableMemory(true);
					break;
				case Operations.MemoryRecall:
					$result.value = appendSeparator(memory);
					break;
				case Operations.MemoryAddition: 
					memory += result;
					if (isMemoryDisabled) {
						isMemoryDisabled = false;

						disableMemory(false);
					}
					break;
				case Operations.MemorySubtraction:
					memory -= result;
					if (isMemoryDisabled) {
						isMemoryDisabled = false;

						disableMemory(false);
					}
					break;
			}

			isReset = true;
		});
	});

	document.querySelectorAll(".digit, .point").forEach((elem) => {
		elem.val = Operations.Point == elem.value ? String.POINT : elem.value;

		elem.addEventListener("click", function () {
			inputNumber(this.val);
		});
	});

	var $percent = document.getElementById("Percent");

	$percent.val = $percent.value;

	$percent.addEventListener("click", function () {
		percent();
	}); 

	document.querySelectorAll(".action").forEach((elem) => {
		elem.val = elem.value;

		elem.addEventListener("click", function () {
			setAction(this.val);

			switch (operation) {
				case Operations.Square:
					firstOperand **= 2;
					$result.value = appendSeparator(firstOperand);
					break;
				case Operations.Fraction:
					if (0 == firstOperand) {
						firstOperand = Messages.CANNOT_DIVIDE_BY_ZERO;
						
						isDisabled = true;

						disableActions(true);
					} else {
						firstOperand **= -1;
					}
					
					$result.value = appendSeparator(firstOperand);
					break;
				case Operations.SquareRoot: 
					if (firstOperand < 0) {
						firstOperand = Messages.INVALID_INPUT;
						
						isDisabled = true;

						disableActions(true);
					} else {
						firstOperand = Math.sqrt(firstOperand);
					}

					$result.value = appendSeparator(firstOperand);
					break;

				case Operations.Fraction:
					result = `${getActionText(operation)}${Languages.changeLanguage(appendSeparator(firstOperand), lang)}`;
					break;
				default:
					result = `${Languages.changeLanguage(appendSeparator(firstOperand), lang)} ${getActionText(operation)}`;
			}
		});
	});

	var $equal = document.getElementById("Equality");

	$equal.val = $equal.value;

	$equal.addEventListener("click", function () {
		equal();
	});

	var $switch = document.getElementById("Switch");

	$switch.val = $switch.value;

	$switch.addEventListener("click", function () {
		$result.value = appendSeparator(-removeSeparator($result.value));
	});

	var $backspace = document.getElementById("Backspace");

	$backspace.val = $backspace.value;

	$backspace.addEventListener("click", function () {
		backspace();
	});

	document.querySelectorAll(".clear").forEach((elem) => {
		elem.val = elem.value;

		elem.addEventListener("click", function () {
			playAudio();
			$result.value = Languages.changeLanguage($result.value, Languages.ENGLISH, lang);

			if (isDisabled) {
				isDisabled = false;

				disableActions(false);
			}

			var clear = elem.val;
			$result.value = 0;

			if(Operations.Clear == clear) {
				firstOperand = undefined;
				operation = undefined;

				showPrevAction();
			}
			$result.value = Languages.changeLanguage($result.value, lang);
		});
	});

	document.getElementById("SystemOfNumeration").addEventListener("change", function () {
		var value = this.value;
		
		$result.value = Languages.changeLanguage($result.value, Languages[value.toUpperCase()], lang);
		lang = Languages[value.toUpperCase()];

		if(!lang){
			return;
		}

		document.querySelectorAll(".digit").forEach((elem) => {
			elem.innerText = lang.DIGITS[elem.val];

			elem.setAttribute("title", lang.TITLES[elem.val]);
		});

		document.querySelectorAll(".action, .percent, .clear, .equality, .switch, .backspace, .point, .memory")
		.forEach((elem) => {
			elem.setAttribute("title", lang.OPERATIONS[elem.val - 1]);
		});
	});

	function disableActions(isDisabled) {

		document.querySelectorAll(".action, .percent, .equality, .switch, .backspace, #MemoryAddition, #MemorySubtraction")
		.forEach((elem) => {
			elem.disabled = isDisabled;
		});
	}

	function disableMemory(isDisabled) {
		document.getElementById("MemoryClear").disabled = isDisabled;
		document.getElementById("MemoryRecall").disabled = isDisabled;
	}

	function showPrevAction() {
		if (!(firstOperand && operation)){
			document.getElementById("Membar").innerText = String.EMPTY;

			return;
		}

		var result = String.EMPTY;

		switch (operation) {
			case Operations.SquareRoot:
			case Operations.Fraction:
				result = `${getActionText(operation)}${Languages.changeLanguage(appendSeparator(firstOperand), lang)}`;
				break;
			default:
				result = `${Languages.changeLanguage(appendSeparator(firstOperand), lang)} ${getActionText(operation)}`;
		}

		document.getElementById("Membar").innerText = result;
	}

	function getActionText(operation) {
		switch (operation) {
			case Operations.Fraction: 
				return "1/";
			case Operations.Square: 
				return "^2";
			case Operations.SquareRoot: 
				return "√";
			case Operations.Division: 
				return "÷";
			case Operations.Multiplication: 
				return "×";
			case Operations.Subtraction: 
				return "-";
			case Operations.Addition: 
				return "+";
		}
	}

	function appendSeparator(number) {
		var parts = number.toString().split(String.POINT);

		parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, String.THOUSAND_SEPARATOR);

		return parts.join(String.POINT);
	}

	function removeSeparator(number) {
		var regExp = new RegExp(String.THOUSAND_SEPARATOR, "g");

		return number.replace(regExp, String.EMPTY);
	}

	function playAudio() {
		document.getElementById("audio").play();
	}

	document.addEventListener("keydown", function (e) {
		if (e.keyCode >= KeyCodes.Zero && e.keyCode <= KeyCodes.Nine) {
			inputNumber(e.keyCode - KeyCodes.Zero);
		}

		switch (e.keyCode) {
			case KeyCodes.Point:
				inputNumber(String.POINT);
				break;
			case KeyCodes.Percent:
				if (e.shiftKey) {
					percent();
				}
				break;
			case KeyCodes.Backspace:
				backspace();
				break;
			case KeyCodes.Division:
				setAction(Operations.Division);
				break;
			case KeyCodes.Multiplication:
				setAction(Operations.Multiplication);
				break;
			case KeyCodes.Subtraction:
				setAction(Operations.Subtraction);
				break;
			case KeyCodes.Addition:
				setAction(Operations.Addition);
				break;
			case KeyCodes.Result:
				equal();
				break;
		}
	});

	function equal() {
		playAudio();
		$result.value = Languages.changeLanguage($result.value, Languages.ENGLISH, lang);

		isReset = true;
		var result = parseFloat(removeSeparator($result.value)),
		value = (isPercent ? firstOperand / 100 : 1) * result;

		switch (operation) {
			case Operations.Addition: 
				firstOperand += value;
				break;
			case Operations.Subtraction: 
				firstOperand -= value;
				break;
			case Operations.Multiplication: 
				firstOperand *= value;
				break;
			case Operations.Division: 
				if (0 == value) {
					isDisabled = true;

					disableActions(true);

					firstOperand = 0 == firstOperand ? Messages.RESULT_IS_UNDEFINED : Messages.CANNOT_DIVIDE_BY_ZERO;
				} else {
					firstOperand /= value;
				}
				break;
			default: 
				firstOperand = result;
		}

		$result.value = appendSeparator(firstOperand);
		/*$result.value = Languages.changeLanguage($result.value, lang);*/
		operation = undefined;
		isPercent = false;

		showPrevAction();
	}

	function setAction(symbol) {
		playAudio();
		$result.value = Languages.changeLanguage($result.value, Languages.ENGLISH, lang);

		operation = parseInt(symbol);
		firstOperand = parseFloat(removeSeparator($result.value));
		isReset = true;

		showPrevAction();
		$result.value = Languages.changeLanguage(firstOperand, lang);
	}

	function backspace() {
		playAudio();

		var result = removeSeparator($result.value);

		$result.value = 1 == result.length || (2 == result.length && result < 0) ? 0 : appendSeparator(result.substring(0, result.length - 1));
	}

	function percent() {
		playAudio();

		isPercent = true;
	}

	function inputNumber(symbol) {
		playAudio();

		$result.value = Languages.changeLanguage($result.value, Languages.ENGLISH, lang);

		if (isReset) {
			$result.value = 0;
		}

		isReset = false;

		var result = removeSeparator($result.value);

		if (MAX_LENGTH <= result.length) {
			return;
		}

		if (isDisabled) {
			isDisabled = false;

			disableActions(false);
		}

		if (0 == result && -1 == result.indexOf(String.POINT)) {
			$result.value = String.POINT === symbol ? `0${String.POINT}` : symbol;
		} else if (String.POINT === symbol && -1 != result.indexOf(String.POINT)) {
			return;
		} else {
			$result.value = appendSeparator(result + symbol);
		}

		$result.value = Languages.changeLanguage($result.value, lang);
	}
});