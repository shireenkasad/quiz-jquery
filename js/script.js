$(document).ready(function(){
	var $questionArea = $('.question'),
	$answerArea = $('.answers'),
	$messageArea = $('#message-area'),
	$submitAreaBtn = $('#submit'),
	$backBtn = $('#back'),
	current = 0,
	score = 0,
	valSelected,
	wasCorrect = false,
	isSelected = false,
	$allArea = $(".questionSection");
	
	var allQuestions = [
		{ question: "Who wrote 'Alice in Wonderland'?", 
		  answers: ["A.A. Milne", "C.S. Lewis", "Lewis Carol", "Margery Williams"],
		  correctAnswer:2 },
		{ question: "What year did Abraham Lincoln deliver The Gettysburg Address?", 
		  answers: ["1857", "1859", "1861", "1863"],
		  correctAnswer:3 },
		{ question: "What is the world's largest freshwater lake, by volumn?", 
		  answers: ["Lake Superior", "Lake Victoria", "Lake Ontario", "Lake Michigan"],
		  correctAnswer:0 }
		],

		totalQuestions = allQuestions.length;
		
	function loadQA(curr){
		$allArea.removeClass("fadeIn").prop('offsetHeight');
		$allArea.addClass("fadeIn");
		
		// load question
		$questionArea.html(""); 
		var question = allQuestions[curr].question;
		$questionArea.append(question);
		
		// load answer
		$answerArea.html(""); 
		hideContent($messageArea);
		$submitAreaBtn.html("submit");
		var answer = allQuestions[curr].answers;	
		$.each(answer, function( index, value ) {
			var $div = $('<div></div>');
			var radio = $('<input />', {
						type: "radio",
						name: "answer", 
						value: index, 
						id: "answer" + index 
						});
			$div.append(radio, value);
			$answerArea.append($div);
		});	

		// check to see if there is a value for this answer in local storage, 
		// if so, show the button as selected

		var currentNumber = curr;
		if(localStorage.getItem(currentNumber) !== null){
			var wasSelected = localStorage.getItem(currentNumber);
			$('input')[wasSelected].checked = true;
		}
		else{
			$('input').checked =  false;
		}

		// load back button if applicable

		curr > 0 ? showContent($backBtn): hideContent($backBtn);
		
		// add a listener to each radio button to clear error message

		$('input').on('click', function(){
			isSelected = false;
			hideContent($messageArea);
		});
	}
	
	function checkAnswer(curr){
		
		// check to see an input was selected

		var currentNumber = curr;
		valSelected = $('input:checked').val();
		if(valSelected == undefined){
			showContent($messageArea);
		}
		else {

			// save submitted answer in local storage, using the current number as the key

			localStorage.setItem(currentNumber, valSelected); 
			if(valSelected == allQuestions[curr].correctAnswer){
				score++;
				wasCorrect = true;
			}
			else { wasCorrect = false; }
			loadNext(curr);
		}	
	}
	
	function loadNext(curr){
		if(curr < allQuestions.length-1){
			current++;
			loadQA(current);
		}
		else {
			loadResult();
		}
	}
	
	function loadPrev(curr){
		current--;	
		loadQA(current);

		// adjust score if necessary
		
		if(wasCorrect){
			score--;
		}
	}
	
	function loadResult(){
		var finalScore = '<span class="highlight">' + score + '/' + totalQuestions + '</span>';		
		$questionArea.html('You have completed the quiz! <br> Your total score is ' + finalScore + '.'); 
		$answerArea.html(""); 
		$submitAreaBtn.html("restart");
		hideContent($backBtn);
	}
	
	function showContent(c){
		c.removeClass("hidden");
	}
	function hideContent(c){
		c.addClass("hidden");
	}
	
	loadQA(current);
	localStorage.clear();
	$('input').checked =  false;

	// if submit, go through check answer 
	// if restart button, reset all values, clear local storage

	$submitAreaBtn.on('click', function(e){
		(e).stopPropagation();
		if($(this).html() == "submit"){
			checkAnswer(current);
		}
		else {
			localStorage.clear();
			score = 0;
			current = 0;
			loadQA(current);
		}
	});
	
	$backBtn.on('click', function(){
		loadPrev(current);
	});
	
});